#!/usr/bin/env bash
#
# Apply the Green Hardwood integration branch — fail-fast.
#
# The previous attempt failed silently: `git am` could not find the patch,
# every later command ran anyway on an unchanged tree, `npm run verify` passed
# (on plain main), and `gh pr create` reported "No commits between main and ...".
# A green gate on a state nobody intended is the worst possible outcome, so
# this script stops at the first thing that is not true.
#
#   bash apply-integration.sh                       # auto-locates the patch
#   bash apply-integration.sh /path/to/the.patch    # or name it explicitly
#
set -Eeuo pipefail

BRANCH="integration/domination-stages-0-3"
PATCH_NAME="integration-domination-stages-0-3.patch"

die()  { printf "\n\033[31mSTOP\033[0m  %s\n\n" "$1" >&2; exit 1; }
step() { printf "\n\033[1m%s\033[0m\n" "$1"; }
ok()   { printf "  \033[32mok\033[0m    %s\n" "$1"; }

# ---------------------------------------------------------------- 1. locate
step "1. Locating the patch"
PATCH="${1:-}"
if [ -z "$PATCH" ]; then
  for c in \
    "./$PATCH_NAME" "../$PATCH_NAME" "$HOME/$PATCH_NAME" \
    "$HOME/Downloads/$PATCH_NAME" "/workspaces/$PATCH_NAME" "/tmp/$PATCH_NAME"
  do
    [ -f "$c" ] && PATCH="$c" && break
  done
fi
# Last resort: search the workspace and home for it.
if [ -z "$PATCH" ]; then
  PATCH="$(find /workspaces "$HOME" -maxdepth 4 -name "$PATCH_NAME" -type f 2>/dev/null | head -1 || true)"
fi
[ -n "$PATCH" ] && [ -f "$PATCH" ] || die \
"Could not find $PATCH_NAME.

Find it yourself and pass the path:
    find / -name '$PATCH_NAME' 2>/dev/null
    bash apply-integration.sh /the/path/it/printed"

PATCH="$(cd "$(dirname "$PATCH")" && pwd)/$(basename "$PATCH")"
ok "found $PATCH ($(wc -c < "$PATCH") bytes)"

grep -q "^From .* Mon Sep 17 00:00:00 2001" "$PATCH" \
  || die "That file is not a git mailbox. Re-download it — the transfer truncated or mangled it."
EXPECTED=$(grep -c "^From [0-9a-f]\{40\} Mon Sep 17 00:00:00 2001" "$PATCH")
ok "$EXPECTED commits in the patch"

# ------------------------------------------------------------- 2. clean base
step "2. Resetting to a clean origin/main"
git rev-parse --git-dir >/dev/null 2>&1 || die "Not inside a git repository."
[ -d "$(git rev-parse --git-dir)/rebase-apply" ] && { git am --abort || true; ok "aborted a stuck git am"; }

git stash list | grep -q . && printf "  note  you have stashes; they are untouched\n" || true
git fetch origin --quiet
git checkout --quiet -B "$BRANCH" origin/main
git reset --hard --quiet origin/main
ok "on $BRANCH at origin/main ($(git rev-parse --short HEAD))"

BEFORE=$(git rev-parse HEAD)

# ---------------------------------------------------------------- 3. apply
step "3. Applying"
git am --3way "$PATCH" || die \
"git am failed. Nothing has been merged. Run:
    git am --abort
then send me the error above."

AFTER=$(git rev-parse HEAD)
[ "$BEFORE" != "$AFTER" ] || die "git am reported success but created no commits."
APPLIED=$(git rev-list --count "$BEFORE..$AFTER")
[ "$APPLIED" -eq "$EXPECTED" ] || die "Expected $EXPECTED commits, got $APPLIED."
ok "$APPLIED commits applied"

# ---------------------------------------------------------- 4. prove it landed
step "4. Proving the code is actually present"
for f in middleware.ts lib/canonical-host.ts lib/analytics.ts data/profiles.ts \
         scripts/verify-live.sh docs/OFFSITE_BLOCKERS.md \
         components/analytics/click-tracker.tsx public/images/stair-studio-poster.jpg
do
  [ -f "$f" ] || die "$f is missing — the patch did not fully apply."
done
ok "every new file present"

grep -q '"verify:live"' package.json || die "package.json has no verify:live script."
ok "npm run verify:live is wired"

grep -q 'export const revalidate = 3600' app/page.tsx || die "ISR export missing from app/page.tsx."
ok "ISR exports present"

grep -q 'from "next/font/google"' app/layout.tsx || die "next/font import missing from app/layout.tsx."
ok "next/font intact"

[ "$(git ls-files | grep -c '\.patch$' || true)" -eq 0 ] || die "A .patch file is still tracked."
ok "no .patch file tracked"

grep -q 'do not attribute one to us' app/ai.txt/route.ts && die "ai.txt still carries the old blanket rating ban."
ok "ai.txt rating policy replaced"

grep -q '"founded"' app/api/facts.json/route.ts && die "facts.json still asserts a founding date."
ok "fabricated founding date gone"

step "Applied cleanly."
git --no-pager log --oneline "$BEFORE..$AFTER"
cat <<'NEXT'

Next, in order — stop if any of them fails:

    npm ci
    npm run verify

    npx next start -p 4011 &
    sleep 6 && npm run verify:live     # expect: 44 passed, 0 failed
    kill %1

    git push -u origin integration/domination-stages-0-3
    gh pr create --fill

NEXT
