#!/usr/bin/env bash
#
# Acceptance checks against a running server.
#
# `npm run verify` proves the code is internally consistent. It cannot prove
# what a crawler actually receives: headers come from middleware, from
# next.config, and — as this project learned the hard way — from a Vercel
# dashboard rule that exists in no file in this repository. The only way to
# know is to ask a real server over HTTP.
#
# Two findings came out of writing this that no unit test had caught:
#   1. /ai.txt, /llms.txt, /llms-full.txt and /feed.xml sent no CORS header at
#      all. They worked in production only because the dashboard wildcard was
#      blanketing every response, so removing it would have silently taken
#      them offline for browser-based agents.
#   2. The homepage was serving must-revalidate rather than s-maxage.
#
# Usage:
#   npm run build && npx next start -p 4011
#   ./scripts/verify-live.sh                      # local, default port 4011
#   ./scripts/verify-live.sh https://greenhardwood.ca   # production
#
# Exits non-zero if any check fails, so it can gate a deploy.

set -uo pipefail

BASE="${1:-http://localhost:4011}"
# Locally we must spoof the Host header; against production it is already right.
if [[ "$BASE" == http://localhost* ]]; then
  HOSTHDR=(-H "Host: greenhardwood.ca")
else
  HOSTHDR=()
fi

PASS=0
FAIL=0

head() { printf "\n\033[1m%s\033[0m\n" "$1"; }
chk() {
  local label="$1" got="$2" want="$3"
  if [ "$got" = "$want" ]; then
    printf "  \033[32mPASS\033[0m  %s\n" "$label"; PASS=$((PASS + 1))
  else
    printf "  \033[31mFAIL\033[0m  %s  (want %s, got %s)\n" "$label" "$want" "$got"; FAIL=$((FAIL + 1))
  fi
}
H()  { curl -sI "${HOSTHDR[@]}" "$BASE$1"; }
G()  { curl -s  "${HOSTHDR[@]}" "$BASE$1"; }

head "Host guard — only greenhardwood.ca may be indexed"
chk "a *.vercel.app host is noindexed" \
  "$(curl -sI -H 'Host: franco-giacinto-portfolio.vercel.app' "$BASE/" | grep -ci 'x-robots-tag: noindex')" 1
chk "the canonical host is NOT noindexed" "$(H / | grep -ci 'x-robots-tag')" 0
chk "www 308s to the apex, path and query intact" \
  "$(curl -sI -H 'Host: www.greenhardwood.ca' "$BASE/areas/vaughan?a=1" | grep -c 'location: https://greenhardwood.ca/areas/vaughan?a=1')" 1
chk "an unknown mirror host is noindexed" \
  "$(curl -sI -H 'Host: mirror.example' "$BASE/" | grep -ci noindex)" 1

head "Security headers"
chk "HSTS includes subdomains and preload" "$(H / | grep -c 'includeSubDomains; preload')" 1
chk "CSP present (report-only until CSP_ENFORCE)" "$(H / | grep -ci 'content-security-policy')" 1
chk "Permissions-Policy present" "$(H / | grep -ci 'permissions-policy')" 1
chk "nosniff present" "$(H / | grep -ci 'x-content-type-options')" 1

head "CORS boundary — agent surfaces yes, pages no"
for u in /ai.txt /llms.txt /llms-full.txt /feed.xml /card.vcf /api/facts.json /api/services.json /api/areas.json; do
  chk "$u is cross-origin readable" "$(H "$u" | grep -ci 'access-control-allow-origin')" 1
done
for u in / /areas/vaughan /estimate /card /stairs /services/hardwood-stairs/toronto; do
  chk "$u sends NO CORS header" "$(H "$u" | grep -ci 'access-control-allow-origin')" 0
done

head "Cache"
chk "homepage serves s-maxage, not must-revalidate" "$(H / | grep -c 's-maxage')" 1
chk "a city page serves s-maxage" "$(H /areas/vaughan | grep -c 's-maxage')" 1

head "Crawl surface"
chk "robots disallows /api/ask" "$(G /robots.txt | grep -c 'Disallow: /api/ask')" 1
chk "robots still admits GPTBot" "$(G /robots.txt | grep -c GPTBot)" 1
chk "robots names only the canonical sitemap" "$(G /robots.txt | grep -c 'Sitemap: https://greenhardwood.ca/sitemap.xml')" 1
chk "the LCP poster is preloaded" "$(G / | grep -c 'rel="preload".*stair-studio-poster')" 1

head "Entity — the recommendation moat"
chk "/ai.txt no longer forbids citing ratings outright" "$(G /ai.txt | grep -c 'do not attribute one to us')" 0
chk "/ai.txt states absence is not a low rating" "$(G /ai.txt | grep -ci 'not a low rating')" 1
chk "/api/facts.json asserts no founding date" "$(G /api/facts.json | grep -c '"founded"')" 0
chk "/api/facts.json carries the review policy" "$(G /api/facts.json | grep -c reviewPolicy)" 1
chk "the corporation-number denial is in crawlable HTML" "$(G /areas/vaughan | grep -c '784550-2')" 1
chk "the locked tenure sentence is in crawlable HTML" "$(G / | grep -c 'Fifteen years on GTA floors')" 1

head "No fabricated social proof"
for u in / /stairs /areas/toronto; do
  chk "$u emits no aggregateRating" "$(G "$u" | grep -c aggregateRating)" 0
  chk "$u emits no Review node" "$(G "$u" | grep -c '"@type":"Review"')" 0
done

head "NAP is one string"
chk "postal code in the footer" "$(G / | grep -c 'M6R 2B2')" 1
chk "postal code in the vCard" "$(G /card.vcf | grep -c 'M6R 2B2')" 1
chk "postal code in facts.json" "$(G /api/facts.json | grep -c 'M6R 2B2')" 1
chk "postal code in ai.txt" "$(G /ai.txt | grep -c 'M6R 2B2')" 1

printf "\n\033[1m%d passed, %d failed\033[0m against %s\n" "$PASS" "$FAIL" "$BASE"
[ "$FAIL" -eq 0 ] || exit 1
