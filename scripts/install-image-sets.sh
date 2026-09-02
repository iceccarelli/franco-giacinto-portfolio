#!/usr/bin/env bash
#
# Install the two commissioned photo sets into public/images.
#
# Two sets were produced to one brief by two different generators. Set A takes
# the canonical filenames the codebase already references; set B is installed
# beside it with a `-2` suffix. `data/images.ts` picks between them
# deterministically from a seed, so 224 service x city pages stop showing the
# identical staircase.
#
# Idempotent: run it as many times as you like.
#
# Usage:
#   bash scripts/install-image-sets.sh [set-a.zip] [set-b.zip]
#
# Defaults to the two zips at the repository root.

set -euo pipefail

A="${1:-greenhardwood-images.zip}"
B="${2:-greenhardwood-images-second-set.zip}"

for f in "$A" "$B"; do
  [ -f "$f" ] || { echo "missing: $f" >&2; exit 1; }
done

command -v unzip >/dev/null || { echo "unzip is required" >&2; exit 1; }

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

unzip -q -o "$A" -d "$tmp/a"
unzip -q -o "$B" -d "$tmp/b"

# Both zips wrap their files in a single folder; find it rather than assume it.
srcA="$(dirname "$(find "$tmp/a" -name 'service-stairs.jpg' -print -quit)")"
srcB="$(dirname "$(find "$tmp/b" -name 'service-stairs.jpg' -print -quit)")"
[ -n "$srcA" ] && [ -n "$srcB" ] || { echo "could not locate images inside the zips" >&2; exit 1; }

mkdir -p public/images/methods

# Set A keeps the canonical names every data file already points at.
cp "$srcA"/*.jpg public/images/
cp "$srcA"/methods/*.jpg public/images/methods/

# Set B is installed as `-2` siblings.
for f in "$srcB"/*.jpg; do
  cp "$f" "public/images/$(basename "${f%.jpg}")-2.jpg"
done
for f in "$srcB"/methods/*.jpg; do
  cp "$f" "public/images/methods/$(basename "${f%.jpg}")-2.jpg"
done

# An orphan from the original set; nothing references it.
rm -f public/images/species-samples.jpg

n=$(find public/images -name '*.jpg' | wc -l | tr -d ' ')
echo "public/images now holds $n files ($(du -sh public/images | cut -f1))"
echo "expected: 74"
