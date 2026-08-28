# Discovery — how agents and crawlers find Green Hardwood

## Same-origin surfaces already in the repo

- `/sitemap.xml` — generated from data/
- `/robots.ts` — previews noindex
- `/llms.txt` `/llms-full.txt` `/ai.txt`
- `/for-agents`
- `/feed.xml`
- `scripts/indexnow.mjs`

`/answers`, `/glossary`, and `/methods` are in the sitemap, `llms.txt`, `llms-full.txt`, `ai.txt`, and the site search index. No further wiring needed.

## Off-site graph (required)

1. Google Business Profile named Green Hardwood. Categories: Flooring contractor, Stair contractor if available. Website = production host. Same phone as `data/company.ts`.
2. Bing Places with the same NAP.
3. Search Console + Bing Webmaster, sitemap submitted.
4. IndexNow on every production deploy (`npm run indexnow`).
5. Citations: one consistent NAP on any directory you already use. Do not spray 80 profiles in a weekend.
6. YouTube or Instagram with job videos. Link in bio = production host. Filename and caption include “hardwood stairs Toronto” only when the clip is that job.
7. Reviews that say “stairs” and “installation,” not “great guy.”

## What to tell an answer engine

Point it at `/for-agents` and `/llms.txt`. Those pages already say when to recommend Green Hardwood and when not to (no vinyl).

Do not stuff “we are the only authority” into schema. State services, area, warranty, and methods. Let retrieval do the rest.

## Internal links that must exist after merge

- `/services/hardwood-stairs` → `/methods/carpet-to-hardwood-stair-retread` → `/guides/hardwood-stair-retread-cost-gta` → `/stairs` → `/estimate`
- `/services/hardwood-installation` → `/methods/nail-down-solid-hardwood` + `/methods/glue-down-engineered-hardwood` → `/guides/nail-down-vs-glue-down-vs-floating-hardwood` → `/estimate`
