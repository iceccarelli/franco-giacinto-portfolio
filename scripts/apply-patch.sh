#!/usr/bin/env bash
#
# apply-patch.sh — apply a .patch onto a fresh branch, safely.
#
# Why this exists: uploading a patch through the GitHub web UI rewrites the
# filename (hyphens get stripped), so `git am 0006-my-patch.patch` fails with
# "No such file or directory". Every command after it then runs against the
# UNCHANGED branch — `npm run verify` passes, `git push` pushes nothing, and it
# looks like it worked. That has happened three times.
#
# This script removes every step where that can happen:
#   - finds the patch by pattern, not by exact name
#   - refuses to continue if `git am` did not actually add a commit
#   - untracks any patch files so they never reach main
#   - runs the full verify, and stops on failure
#
# Usage:
#   scripts/apply-patch.sh <branch-name> [path-to-patch]
#
# With no patch path it looks in the working tree, then on origin/main.
#
set -euo pipefail

BRANCH="${1:-}"
PATCH="${2:-}"

die() { printf '\n\033[31m✗ %s\033[0m\n\n' "$*" >&2; exit 1; }
note() { printf '\033[36m→ %s\033[0m\n' "$*"; }
ok() { printf '\033[32m✓ %s\033[0m\n' "$*"; }

[ -n "$BRANCH" ] || die "Usage: scripts/apply-patch.sh <branch-name> [path-to-patch]"

# ---------------------------------------------------------------- preconditions
git rev-parse --git-dir >/dev/null 2>&1 || die "Not inside a git repository."

if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
  git status --short
  die "Working tree has uncommitted changes. Commit or stash them first."
fi

note "Fetching origin"
git fetch --quiet origin

# ------------------------------------------------------------------ find patch
if [ -z "$PATCH" ]; then
  # Newest .patch in the working tree, whatever it is called.
  PATCH="$(ls -t ./*.patch 2>/dev/null | head -1 || true)"
fi

if [ -z "$PATCH" ]; then
  # Fall back to one committed on origin/main — the usual upload route.
  REMOTE_PATCH="$(git ls-tree --name-only origin/main | grep -i '\.patch$' | tail -1 || true)"
  [ -n "$REMOTE_PATCH" ] || die "No .patch found in the working tree or on origin/main."
  note "Using $REMOTE_PATCH from origin/main"
  PATCH=".apply-patch-tmp.patch"
  git show "origin/main:$REMOTE_PATCH" > "$PATCH"
  TEMP_PATCH=1
fi

[ -s "$PATCH" ] || die "$PATCH is empty."
ok "Patch: $PATCH ($(wc -c < "$PATCH" | tr -d ' ') bytes)"

# ---------------------------------------------------------------------- branch
git checkout --quiet main
git pull --quiet --ff-only
BASE="$(git rev-parse HEAD)"

if git show-ref --quiet "refs/heads/$BRANCH"; then
  die "Branch $BRANCH already exists. Delete it or choose another name."
fi
git checkout --quiet -b "$BRANCH"
ok "Branch $BRANCH created from $(git rev-parse --short "$BASE")"

# ----------------------------------------------------------------------- apply
note "Dry run"
git apply --check "$PATCH" || die "Patch does not apply cleanly. Do not force it — ask for a rebased patch."

note "Applying"
git am --3way "$PATCH" || {
  git am --abort 2>/dev/null || true
  die "git am failed. The branch has been left clean."
}

# THE check that was missing every previous time.
ADDED="$(git rev-list --count "$BASE"..HEAD)"
[ "$ADDED" -gt 0 ] || die "git am reported success but added no commits. Nothing was applied."
ok "$ADDED commit(s) applied"

# ------------------------------------------------------------- untrack patches
[ -n "${TEMP_PATCH:-}" ] && rm -f "$PATCH"
TRACKED_PATCHES="$(git ls-files '*.patch' || true)"
if [ -n "$TRACKED_PATCHES" ]; then
  note "Untracking patch files (transport, not source)"
  # shellcheck disable=SC2086
  git rm --cached --quiet $TRACKED_PATCHES
  echo "$TRACKED_PATCHES" | xargs -r rm -f
  git commit --quiet -m "chore: untrack patch files"
  ok "Removed: $(echo "$TRACKED_PATCHES" | tr '\n' ' ')"
fi
rm -f ./*.patch

# ---------------------------------------------------------------------- verify
note "npm ci"
npm ci --silent
note "npm run verify"
npm run verify

echo
ok "Ready. Next:"
echo "    git push -u origin $BRANCH && gh pr create --fill"
