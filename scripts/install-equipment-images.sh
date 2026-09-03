#!/usr/bin/env bash
#
# Install the equipment and defect photography into public/images/equipment.
#
# Two agents were given one brief and each delivered a full pair, so there are
# FOUR renditions of every subject rather than two:
#
#   set A  ->  x.jpg   and  x-2.jpg
#   set B  ->  x-3.jpg and  x-4.jpg
#
# `data/images.ts` declares four renditions for each of the sixteen subjects
# and `tests/images.test.ts` checks that map against the disk in both
# directions, so a missing file and an unreferenced file both fail the build.
# That is the point of running this script rather than dragging files around:
# get it wrong and the test tells you exactly how.
#
# Idempotent. Run it as many times as you like.
#
# Usage:
#   bash scripts/install-equipment-images.sh [set-a.zip] [set-b.zip]
#
# Defaults to the two zips at the repository root. They are gitignored and
# should be deleted once this has run — archives are transport, not source,
# and tests/repo-hygiene.test.ts fails the build if one is ever committed.

set -euo pipefail

A="${1:-greenhardwood-equipment-set.zip}"
B="${2:-greenhardwood-equipment-set-second-set.zip}"

for f in "$A" "$B"; do
  [ -f "$f" ] || { echo "missing: $f" >&2; exit 1; }
done

command -v unzip >/dev/null || { echo "unzip is required" >&2; exit 1; }

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

unzip -q -o "$A" -d "$tmp/a"
unzip -q -o "$B" -d "$tmp/b"

# Locate the files rather than assume a folder depth: one zip may wrap its
# contents in a directory and the other may not, and assuming is how the last
# three transport steps went wrong.
srcA="$(dirname "$(find "$tmp/a" -name 'eq-belt-sander.jpg' -print -quit)")"
srcB="$(dirname "$(find "$tmp/b" -name 'eq-belt-sander.jpg' -print -quit)")"
[ -n "$srcA" ] && [ -n "$srcB" ] || { echo "could not locate images inside the zips" >&2; exit 1; }

dest="public/images/equipment"
mkdir -p "$dest"

# Set A keeps the canonical names and the -2 sibling it shipped with.
cp "$srcA"/*.jpg "$dest/"

# Set B slots in behind it as renditions three and four.
for f in "$srcB"/*.jpg; do
  base="$(basename "${f%.jpg}")"
  case "$base" in
    *-2) cp "$f" "$dest/${base%-2}-4.jpg" ;;
    *)   cp "$f" "$dest/${base}-3.jpg" ;;
  esac
done

n=$(find "$dest" -name '*.jpg' | wc -l | tr -d ' ')
total=$(find public/images -name '*.jpg' | wc -l | tr -d ' ')
echo "$dest holds $n files; public/images holds $total ($(du -sh public/images | cut -f1))"
echo "expected: 64 and 138"
[ "$n" = "64" ] && [ "$total" = "138" ] || {
  echo "COUNT MISMATCH — npm test will tell you which files are wrong" >&2
  exit 1
}
