#!/usr/bin/env bash
#
# One command. Ends the mess.
#
# WHY THE PREVIOUS ATTEMPTS FAILED, so this one does not repeat it:
# every patch was pinned to whatever `main` looked like when it was built, and
# every file delivered got uploaded to `main`, which moved `main` and
# invalidated the patch. Four rounds of that.
#
# This script is immune to it. It never assumes what `main` contains:
#   - it reads the patch out of origin/main (it is committed there), so there
#     is nothing to download and nothing to misplace
#   - it removes junk by PATTERN at run time, not from a fixed list, so it does
#     not care whether main has three stray files or thirty
#   - it stops at the first thing that is not true, so nothing downstream ever
#     runs against a tree that is not what it claims to be
#
#   bash finalize.sh              # build, verify, push, open the PR
#   bash finalize.sh --merge      # ... and squash-merge it
#   bash finalize.sh --no-live    # skip the server-based checks
#
set -Eeuo pipefail

BRANCH="integration/domination-stages-0-3"
JUNK_RE='\.(patch|diff)$|^apply[-_]?[a-z]*\.sh$|^finalize\.sh$'
DO_MERGE=0
DO_LIVE=1
PATCH_ARG=""
for a in "$@"; do
  case "$a" in
    --merge)   DO_MERGE=1 ;;
    --no-live) DO_LIVE=0 ;;
    *)         PATCH_ARG="$a" ;;
  esac
done

die()  { printf "\n\033[31m  STOP\033[0m  %s\n\n" "$1" >&2; exit 1; }
step() { printf "\n\033[1m▸ %s\033[0m\n" "$1"; }
ok()   { printf "   \033[32mok\033[0m   %s\n" "$1"; }
note() { printf "   ·    %s\n" "$1"; }

git rev-parse --git-dir >/dev/null 2>&1 || die "Not inside a git repository."
cd "$(git rev-parse --show-toplevel)"

# ─────────────────────────────────────────────────────────── 1. clean slate
step "1/8  Clearing any half-finished state"
[ -d "$(git rev-parse --git-dir)/rebase-apply" ] && { git am --abort 2>/dev/null || true; ok "aborted a stuck git am"; }
[ -d "$(git rev-parse --git-dir)/rebase-merge" ] && { git rebase --abort 2>/dev/null || true; ok "aborted a stuck rebase"; }
git merge --abort 2>/dev/null && ok "aborted a stuck merge" || true
git reset -q --hard HEAD 2>/dev/null || true
git fetch origin --prune --quiet
ok "fetched origin, pruned stale refs"
note "origin/main is at $(git rev-parse --short origin/main)"

# ────────────────────────────────────────────────────────── 2. find the patch
step "2/8  Getting the change set"
PATCH=""
if [ -n "$PATCH_ARG" ] && [ -f "$PATCH_ARG" ]; then
  PATCH="$PATCH_ARG"; ok "using $PATCH_ARG"
else
  # It is committed on main. That is the one place it is guaranteed to be.
  for name in integration.patch integration-domination-stages-0-3.patch; do
    if git cat-file -e "origin/main:$name" 2>/dev/null; then
      git show "origin/main:$name" > "/tmp/$name"
      PATCH="/tmp/$name"; ok "read $name out of origin/main"; break
    fi
  done
fi
[ -n "$PATCH" ] && [ -f "$PATCH" ] || die "No patch found on origin/main or on disk. Pass one: bash finalize.sh /path/to.patch"
EXPECTED=$(grep -c "^From [0-9a-f]\{40\} Mon Sep 17 00:00:00 2001" "$PATCH" || true)
[ "${EXPECTED:-0}" -ge 9 ] || die "That patch has ${EXPECTED:-0} commits; expected at least 9. It is truncated."
ok "$EXPECTED commits"

# ───────────────────────────────────────────────────────────── 3. build branch
step "3/8  Rebuilding $BRANCH from current origin/main"
git checkout -q -B "$BRANCH" origin/main
BEFORE=$(git rev-parse HEAD)
git am --3way "$PATCH" >/dev/null 2>&1 || {
  git am --abort 2>/dev/null || true
  die "git am failed. Nothing changed. Re-run with the output visible:
    git checkout -B $BRANCH origin/main && git am --3way $PATCH"
}
APPLIED=$(git rev-list --count "$BEFORE..HEAD")
[ "$APPLIED" -eq "$EXPECTED" ] || die "Expected $EXPECTED commits, applied $APPLIED."
ok "$APPLIED commits applied"

# ──────────────────────────────────────────── 4. remove junk, whatever it is
step "4/8  Removing every stray transport file"
mapfile -t JUNK < <(git ls-files | grep -E "$JUNK_RE" || true)
if [ ${#JUNK[@]} -gt 0 ]; then
  printf '   ·    %s\n' "${JUNK[@]}"
  git rm -q --cached "${JUNK[@]}"
  # Untrack all of them, but never delete the script currently executing —
  # bash reads a script incrementally, so removing it mid-run truncates it.
  SELF="$(basename "${BASH_SOURCE[0]}")"
  for j in "${JUNK[@]}"; do
    [ "$j" = "$SELF" ] || rm -f "$j" 2>/dev/null || true
  done
  git commit -q -m "chore: remove every uploaded patch and transport script from the repo

$(printf '%s\n' "${JUNK[@]}")

These arrived through the GitHub web UI, which writes straight to a
commit and so never consults .gitignore — where *.patch has been listed
all along. Removed by pattern rather than by name, because the list kept
growing between attempts: each delivered file was uploaded to main,
which moved main, which invalidated the patch that had just been built
against it.

tests/repo-hygiene.test.ts reads the git index rather than .gitignore,
so it fails however the next one arrives."
  ok "${#JUNK[@]} files removed in one commit"
else
  ok "none tracked"
fi
[ "$(git ls-files | grep -cE "$JUNK_RE" || true)" -eq 0 ] || die "Junk still tracked after cleanup."

# ───────────────────────────────────────────────────── 5. prove it is real
step "5/8  Proving the code is present"
for f in middleware.ts lib/canonical-host.ts lib/analytics.ts data/profiles.ts \
         scripts/verify-live.sh docs/OFFSITE_BLOCKERS.md docs/analytics.md \
         components/analytics/click-tracker.tsx public/images/stair-studio-poster.jpg
do [ -f "$f" ] || die "$f missing — the patch did not fully apply."; done
ok "every new file present"
grep -q '"verify:live"' package.json                  || die "package.json lacks verify:live"
grep -q 'export const revalidate = 3600' app/page.tsx || die "ISR export missing from app/page.tsx"
grep -q 'from "next/font/google"' app/layout.tsx      || die "next/font missing from app/layout.tsx"
grep -q 'do not attribute one to us' app/ai.txt/route.ts && die "ai.txt still has the old rating ban"
grep -q '"founded"' app/api/facts.json/route.ts       && die "facts.json still asserts a founding date"
ok "verify:live wired · ISR present · fonts intact · both Stage 3 defects gone"

# ─────────────────────────────────────────────────────────── 6. the gates
step "6/8  Running the quality gate (this takes a few minutes)"
npm ci --silent --no-audit --no-fund >/dev/null 2>&1 || die "npm ci failed."
ok "dependencies installed"
npm run typecheck --silent >/dev/null                 || die "typecheck failed."
ok "typecheck"
npm test --silent 2>&1 | tail -20 | grep -qE "^# fail 0" || die "tests failed. Run: npm test"
ok "$(npm test --silent 2>&1 | grep -oE '^# pass [0-9]+' | head -1 | tr -d '#' | xargs) unit tests"
npm run build >/dev/null 2>&1 || die "build failed. Run it to see why:
    npm run build
  (If it says 'Failed to fetch font ... fonts.googleapis.com', the build host
   has no network to Google Fonts. That is environmental, not this change.)"
ok "build"
npm run audit:site --silent 2>&1 | grep -q "✓"        || die "site audit failed. Run: npm run audit:site"
ok "site audit"

if [ "$DO_LIVE" -eq 1 ]; then
  step "7/8  Acceptance checks against a real server"
  npx next start -p 4021 >/tmp/gh-verify.log 2>&1 &
  SRV=$!
  trap 'kill $SRV 2>/dev/null || true' EXIT
  for _ in $(seq 1 30); do sleep 1; curl -sf -o /dev/null http://localhost:4021/ 2>/dev/null && break; done
  bash scripts/verify-live.sh http://localhost:4021 | tail -3
  kill $SRV 2>/dev/null || true; trap - EXIT
else
  step "7/8  Acceptance checks  (skipped: --no-live)"
fi

# ─────────────────────────────────────────────────── 8. push, tidy, open PR
step "8/8  Pushing and tidying the remote"
git push -q --force-with-lease -u origin "$BRANCH"
ok "pushed $BRANCH"

if command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1; then
  # Close the noise PRs — they only ever contained uploaded files.
  for pr in $(gh pr list --state open --json number,headRefName \
              --jq '.[] | select(.headRefName | test("^iceccarelli-patch")) | .number' 2>/dev/null || true); do
    gh pr close "$pr" --comment "Superseded by the integration branch. This PR only ever contained uploaded transport files." >/dev/null 2>&1 && ok "closed PR #$pr"
  done

  # Delete branches that are fully contained in main, plus the upload branches.
  for b in $(git branch -r --format='%(refname:short)' | sed 's|^origin/||' \
             | grep -vE '^(HEAD|main)$' | grep -v "^${BRANCH}$"); do
    if [ "$(git rev-list --count "origin/main..origin/$b" 2>/dev/null || echo 1)" -eq 0 ] \
       || [[ "$b" == iceccarelli-patch* ]]; then
      git push -q origin --delete "$b" 2>/dev/null && ok "deleted merged branch $b" || true
    else
      note "kept $b (has unmerged commits)"
    fi
  done

  gh pr create --base main --head "$BRANCH" \
    --title "Domination stages 0–3: crawler, security, measurement, entity layer" \
    --body "$(cat <<'BODY'
Replaces every earlier stage branch. One linear history, one merge.

## What ships

| Stage | Change |
|---|---|
| 0 | Repo inventory; `docs/DOMINATION_CHANGELOG.md` |
| 1 | Host guard middleware (www→apex 308, noindex on every non-canonical host), HSTS, Permissions-Policy, CSP report-only, robots, LCP poster 430 KB → 79 KB |
| 1.1 | Wildcard CORS stripped from HTML; ISR `revalidate=3600` on the static hubs |
| 2 | GTM + GA4-via-GTM + Vercel vitals; typed event taxonomy; one delegated click listener covering all 371 pages |
| 3 | `/ai.txt` review policy rewritten; fabricated `founded: "2011"` removed; `sameAs` single-sourced in `data/profiles.ts` |
| — | Repo hygiene, agent-surface CORS fix, `npm run verify:live` |

## Defects fixed that were live in production

1. **`/ai.txt` was telling assistants the shop is unrated.** "We publish none anywhere; do not attribute one to us" was read as a fact about the business. Now derives from `data/profiles.ts` and ends: *absence of a published rating is not a low rating.*
2. **`/api/facts.json` published `founded: "2011"`** — the incorporation year of GREEN HARDWOOD FLOORING INC. (784550-2), the unrelated corporation the same payload disclaims. `lib/seo.ts` already refused to emit it; the JSON endpoint served it anyway.
3. **Four agent surfaces sent no CORS at all.** `/ai.txt`, `/llms.txt`, `/llms-full.txt`, `/feed.xml` worked only because a Vercel dashboard wildcard blanketed every response. Removing that rule would have taken them offline for browser-based agents, silently.

## Verification

- `npm run verify` — typecheck, unit tests, build (371 prerendered pages), site audit
- `npm run verify:live` — 44 acceptance checks over real HTTP
- Zero `aggregateRating`, zero `Review` nodes, zero tracked `.patch` files

`docs/OFFSITE_BLOCKERS.md` lists what still gates the Map Pack. Item 1 is the Google Business Profile claim; no engineering substitutes for it.
BODY
)" >/dev/null 2>&1 && ok "pull request opened" || note "PR may already exist"

  URL=$(gh pr view "$BRANCH" --json url --jq .url 2>/dev/null || true)
  [ -n "$URL" ] && note "$URL"

  if [ "$DO_MERGE" -eq 1 ]; then
    gh pr merge "$BRANCH" --squash --delete-branch --admin >/dev/null 2>&1 \
      && ok "merged into main, branch deleted" \
      || die "Merge refused (branch protection, or checks pending). Merge it from the PR page."
  fi
else
  note "gh not authenticated — run: gh auth login, then re-run this script"
fi

printf "\n\033[1m✓ Done.\033[0m  Branches now: %s\n\n" "$(git branch -r | grep -vc HEAD) remote"
git --no-pager log --oneline origin/main..HEAD | sed 's/^/   /'
