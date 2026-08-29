# Ship note — observability hardening

Branch: `feat/observability-hardening` (5 commits off `main` @ 9f69d79)
Gate: `npm ci && npm run verify` green — typecheck → 167 tests → build (359 pages) → site audit clean.
Build caveat: the verification sandbox has no egress to fonts.googleapis.com, so the build ran with
`NEXT_FONT_GOOGLE_MOCKED_RESPONSES` (a Next.js-supported test hook; zero repo changes). Vercel and CI
fetch the real fonts. Nothing else was mocked.

## Host evidence (fetched 2026-08-29, cache-busted; re-run `curl -I` on deploy)

| Check | Result |
| --- | --- |
| `https://greenhardwood.ca/` | 200, stats 1,200+ / 15+ / 32 / 3-year, H1 "Hardwood floors. Hardwood stairs. Hardwood railings. One shop.", phone + `/estimate` CTA visible |
| `https://greenhardwood.ca/robots.txt` | named-agent `Allow: /`, `Host: https://greenhardwood.ca`, sitemap on the apex |
| `https://franco-giacinto-portfolio.vercel.app/` | 200 and **`meta robots: index, follow`** — the S3 bug this branch fixes |
| `.vercel.app` canonicals | already point at `https://greenhardwood.ca/...` (mitigation, not a directive) |
| 12-vs-32 stat split | **not reproduced** — both hosts currently render "32 cities and towns served"; the guard is now the shared `data/company.ts` stat plus the alias noindex |

Owner, after next production deploy, please confirm:

```
curl -I https://greenhardwood.ca/                       # expect 200, no X-Robots-Tag
curl -I https://www.greenhardwood.ca/                   # expect 308/301 to apex (or NXDOMAIN)
curl -I https://franco-giacinto-portfolio.vercel.app/   # expect X-Robots-Tag: noindex, nofollow
```

## Ships

### 1. `fix(preview-noindex)` — every `*.vercel.app` host is now noindex
- URL: `https://franco-giacinto-portfolio.vercel.app/*`
- Before: `IS_PREVIEW` only matches `VERCEL_ENV=preview`; the production deployment's own
  `.vercel.app` alias ran as `production` and served `index, follow` — a second indexable host with
  the same 359 pages.
- After: host-matched rule in `next.config.mjs` sends `X-Robots-Tag: noindex, nofollow` on every
  `*.vercel.app` host; `greenhardwood.ca` untouched. `tests/host-noindex.test.ts` fails if the rule
  is removed, loosened, or ever matches the canonical domain.
- Consequence: S3 — one entity, one indexable host. S2 — no answer engine cites the Vercel URL.

### 2. `docs(entity-drift)` — counts derived from the build
- Before: README said 52 HTML documents / 132 pages / 57 tests; AGENTS.md said 181 pages, 84 matrix
  pages, 12 city pages, 92 tests, "live at the Vercel production domain", and described the removed
  fabricated aggregateRating as current; GEMINI.md said 181 pages; HONEST-LIMITS said the live host
  was still the Vercel preview.
- After: 359 pages, 224 matrix (7 matrix services × 32 cities), 32 cities, live at greenhardwood.ca,
  rating section describes the actual `reviews: null` gate. Numbers that add nothing were deleted
  rather than re-invented.
- Consequence: S3 — coding agents reading these files stop reintroducing stale facts into public surfaces.

### 3. `feat(machine-surfaces)` — /llms.txt and /ai.txt say what an answer engine needs
- URLs: `/llms.txt`, `/ai.txt`, `/sitemap.xml`, `data/company.ts`
- Added to /llms.txt: the three specifier questions with exact canonical URLs
  (stairs service + `{city}` pattern + `/estimate`; `/methods/carpet-to-hardwood-stair-retread` with
  the catalogue band pulled from `data/services.ts`; `/methods/hardwood-railing-through-bolt` +
  `/stairs` checker with "the building department decides" stated); verified-profiles line
  (`company.sameAs` — Instagram only today); federal-namesake disambiguation.
- Added to /ai.txt: the same disambiguation plus a never-say-on-our-behalf list — no inspection
  guarantee, no star rating (none is published anywhere), no firm price without a site moisture
  reading. `/ai.txt` joined the sitemap beside `/llms.txt`.
- The disambiguation string lives once, in `data/company.ts` (`notToBeConfusedWith`), and both
  surfaces consume it.
- New gate `tests/llms-surface.test.ts`: every URL llms.txt promises must resolve to a sitemap entry
  or a real route handler; the specifier URLs and disambiguation must be present; no `vercel.app`
  host or repo name may leak into a machine surface.
- Consequence: S2 — a model that fetches only llms.txt can cite the right URL for all three
  specifier questions with the published band. S3 — the dead federal namesake is denied in writing
  on our own surfaces.

### 4. `fix(price-sync)` — the cost guide's worked example derives from the estimator
- URL: `/guides/hardwood-flooring-cost-gta-2026` (and its copies in /llms-full.txt and the assistant corpus)
- Before: guide prose said a 1,000 sq ft site-finished white-oak main floor "lands around
  $13,000–$18,000" while `/estimate` computed $16,900–$23,980 for the identical job in Toronto —
  two answers on one site.
- After: the sentence is computed in `data/guides.ts` by `calculateEstimate()` across every
  `cityMult`, rendering today as **$15,300–$24,400** (Brampton low → Barrie high), and can never
  drift from the estimator again. Tests: the guide must quote the same catalogue bands as
  `priceFrom` in `data/services.ts`; a retyped worked-example band fails the suite.
- No price *model* was changed — `data/estimate.ts` and `priceFrom` are untouched. Only the retyped
  copy of the model's output was replaced with the model's output.
- Consequence: S2 — one price system; an answer engine cannot quote the site against itself.

### 5. `docs(inventory)` — entity + refusal queries mapped; new rules encoded in AGENTS.md
- QUERY-INVENTORY gains entity rows (Green Hardwood / Franco Giacinto / 88 Sterling Road / phone)
  and an explicit refuse table (vinyl, laminate → decline, `/compare`). Coverage total corrected to
  the audited 359. AGENTS.md non-negotiables 7 and 8 now carry the host-noindex and
  no-404-promises rules so future agents inherit them.

## Machine-surface table

| Path | Status | Announced in llms.txt | Allowed in robots |
| --- | --- | --- | --- |
| /llms.txt | 200, generated | — (is the index; linked via `<link rel=alternate>`, /.well-known/agents.json, sitemap) | yes |
| /llms-full.txt | 200, generated | yes | yes |
| /ai.txt | 200, generated | via layout alternate + sitemap (added) | yes |
| /for-agents | 200 | yes | yes |
| /.well-known/agents.json | 200 (route existed; robots.ts comment now true) | — | yes |
| /api/facts.json /services.json /areas.json | 200, CORS open | yes | yes (no `Disallow: /api/` anywhere — kept that way) |
| /api/ask | POST, grounded | yes | yes |
| /card, /card.vcf | 200 | yes | yes |
| /sitemap.xml /feed.xml /robots.txt | 200, generated | sitemap in robots | yes |

## Price-band sync check

- Catalogue bands: `data/services.ts` `priceFrom` → service pages, /for-agents, /llms.txt,
  /api/services.json, matrix FAQs. One source. ✓
- Numeric bands: `data/estimate.ts` → /estimate, all 224 matrix bands, stair studio, assistant. ✓
- Guide worked example: now computed from `data/estimate.ts` (ship 4). ✓
- Known, by design: a city multiplier can push a specific Toronto-tier job past the catalogue
  ceiling (e.g. site-finished white oak in Toronto ≈ $24/sq ft high vs the catalogue's $22). Both
  numbers come from owner-set data; if the owner wants the catalogue ceiling to bound every city,
  that is a `data/` decision, not an agent's.

## Recall probes

Covered by the suite rather than by hand: city+service price questions return that city's band,
"do you install vinyl" declines, code questions never say "passes", contact returns the real NAP,
city search outranks portfolio items (`tests/assistant.test.ts`, `tests/search.test.ts`). Live
`/api/ask` probes from §recall should be re-run against production after deploy.

## Refused to invent

- No star rating, review count, or GBP link (`reviews` stays `null`; sameAs stays Instagram-only).
- No founding year — `years: 15` remains the only tenure number; the 2011 federal incorporation is
  now explicitly denied rather than borrowed.
- No 33rd city, no vinyl/laminate surface, no NWFA membership upgrade, no `callbackRate` promotion
  into schema or llms.txt, no inspection guarantee anywhere.
- No repricing: `data/estimate.ts` and every `priceFrom` are byte-identical to `main`.

## Owner checkboxes

- [ ] Merge PR; after deploy run the three `curl -I` checks above.
- [ ] `npm run indexnow` after the deploy (needs `INDEXNOW_KEY`), then submit /sitemap.xml in
      Google Search Console and Bing Webmaster Tools.
- [ ] If the `.vercel.app` alias shows any indexed pages in GSC, request removal there.
- [ ] Claim the Google Business Profile for 88 Sterling Road, Unit 6 — NAP + hours character for
      character against `data/company.ts`. Only then: GBP URL into `sameAs`, real count into
      `company.reviews`, same commit.
- [ ] Confirm Instagram bio address matches Sterling Road exactly.
- [ ] Set `RESEND_API_KEY`, `LEAD_TO_EMAIL`, `LEAD_FROM_EMAIL` (leads currently log-captured —
      still working, nothing dropped).
