# Domination changelog

Every stage of the discoverability/reachability program appends here. One entry
per stage, dated, with what shipped and what the acceptance evidence was.

---

## Stage 0 — Recon (2026-08-30)

No production content changed. Inventory only.

### Repo map

- **Framework**: Next.js 15.5 (App Router), TypeScript, Tailwind, Radix UI.
  Deployed on Vercel. Fully prerendered; only `/api/ask` is `force-dynamic`.
- **Metadata**: Next Metadata API throughout. `metadataBase`, canonical, OG,
  Twitter and robots directives in `app/layout.tsx`; per-page overrides in each
  `page.tsx`. `lib/seo.ts` is the single structured-data module
  (`localBusinessLd`, `websiteLd`, `webPageLd`, `breadcrumbLd`, `serviceLd`,
  `personLd`, `faqLd`, `howToStairLd`, `itemListLd`, `videoObjectLd`,
  `reviewsLd` — the latter gated on `company.reviews`, which is `null`).
- **Host resolution**: `lib/site-url.ts` (`SITE_URL`, `IS_PREVIEW`). Canonical
  business domain is a business fact in `data/company.ts` (`company.website`).
- **Sitemap**: `app/sitemap.ts`. **Robots**: `app/robots.ts` (AI crawlers
  explicitly allowed; preview deployments fully disallowed).
- **Middleware**: none existed before Stage 1.
- **Headers**: `next.config.mjs` `headers()` — host-matched
  `X-Robots-Tag: noindex, nofollow` for every `*.vercel.app` host,
  `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, immutable
  caching on `/images` and `/videos`. No HSTS, no Permissions-Policy, no CSP
  before Stage 1.
- **CORS**: already scoped correctly — `Access-Control-Allow-Origin: *` is
  emitted only by the agent JSON endpoints via `lib/agent-api.ts`
  (`/api/facts.json`, `/api/services.json`, `/api/areas.json`, `/api/ask`) and
  `/.well-known/agents.json`. HTML routes send no ACAO header.
- **Estimate form**: `app/estimate/page.tsx` +
  `components/estimate/quote-estimator.tsx` / `quote-form.tsx`, server action in
  `lib/leads.ts` + `lib/lead-delivery.ts`. Success is client state — there is no
  `/estimate/success` URL today (robots rule added anyway, future-proof).
- **Assistant/chat**: `components/assistant/`, `lib/assistant/`, `app/api/ask`.
- **AEO files**: `/llms.txt`, `/llms-full.txt`, `/ai.txt`, `/for-agents`,
  `/.well-known/agents.json`, `/api/facts.json`, `/api/services.json`,
  `/api/areas.json`, `/card`, `/card.vcf`, `/humans.txt`, `/feed.xml` — all
  generated from `data/` modules.
- **Content collections** (`data/`): 11 services, 32 cities (+2 non-city area
  entries), 224 service×city matrix pages (`data/matrix.ts`, 7 services × 32
  cities), 41 answers, 18 problems, 10 methods, 11+11 guides, glossary,
  compare, species, OBC thresholds, projects, testimonials (unpublished),
  navigation.
- **Quality gate**: `npm run verify` = typecheck → node:test suite (159 tests)
  → build → `scripts/audit-site.mjs` (post-build HTML audit: canonicals,
  titles, dead links, raw `<img>`, malformed JSON-LD).

### sitemap.xml URL inventory (by type)

| Type                              | Count | Pattern                          |
| --------------------------------- | ----- | -------------------------------- |
| Static routes                     | 27    | `/`, `/stairs`, `/estimate`, …   |
| Service pages                     | 11    | `/services/{slug}`               |
| City pages                        | 32    | `/areas/{city}`                  |
| Guides                            | ~22   | `/guides/{slug}` (own lastmod)   |
| Methods                           | 10    | `/methods/{slug}`                |
| Problems                          | 18    | `/problems/{slug}`               |
| Answers                           | 41    | `/answers/{slug}`                |
| Service×city matrix               | 224   | `/services/{service}/{city}`     |
| **Total**                         | ~385  |                                  |

The 224-page matrix is frozen (rule: enrich or noindex — Stage 6 work).

### Preview-domain handling (pre-Stage-1 state)

- `IS_PREVIEW` (`VERCEL_ENV === "preview"`) → `robots.txt` disallow-all + meta
  robots noindex on every page.
- Production's own `*.vercel.app` alias (where `VERCEL_ENV` is `"production"`)
  → host-matched `X-Robots-Tag: noindex, nofollow` in `next.config.mjs`,
  guarded by `tests/host-noindex.test.ts`.
- Gap before Stage 1: a non-Vercel mirror host, and `www.` handling, were
  uncovered; no request-time guard existed (headers only).

### Header evidence

Outbound network from the build sandbox is proxy-restricted (both hosts return
a proxy 403), so the live checks below must be run from an unrestricted shell
and pasted into the PR:

```bash
curl -sI https://greenhardwood.ca/
curl -sI https://franco-giacinto-portfolio.vercel.app/
```

Expected after Stage 1 deploys: the first shows HSTS + CSP-Report-Only and no
`X-Robots-Tag`; the second shows `X-Robots-Tag: noindex, nofollow`.

- **LCP element on `/`**: the hero `<video poster>` image
  (`/images/stair-studio.jpg`, 430 KB before Stage 1 — optimized in Stage 1).
- **JSON-LD blocks on `/` before Stage 1**: 4 — LocalBusiness + WebSite
  (layout) + FAQPage + HowTo (page). FAQPage duplicated `/faq`'s schema.
- **Analytics**: none anywhere. No GTM, no GA4, no pixels, no
  @vercel/analytics, no Speed Insights. Stage 2 scope.

---

## Stage 1 — Crawler / preview / security / cache (2026-08-30)

### A. Kill the clone

- **`middleware.ts` (new)**: request-time host guard.
  - `www.{canonical}` → apex **308** with path + query preserved. Direction:
    www → apex, matching the canonical `https://greenhardwood.ca`.
  - Any other host that is not the canonical apex (every `*.vercel.app`
    preview/alias, any future mirror) gets
    `X-Robots-Tag: noindex, nofollow` stamped on the response at request time.
    Localhost/127.0.0.1 and dev are exempt.
  - Canonical host derives from `company.website` (the business fact), not
    from `SITE_URL` (the deployment fact) — on a misconfigured deployment the
    guard fails closed (noindex), never open.
  - Pure logic lives in `lib/canonical-host.ts` and is covered by
    `tests/canonical-host.test.ts`.
- The existing `next.config.mjs` host-matched `X-Robots-Tag` rule for
  `*.vercel.app` is kept as a second, config-level layer
  (`tests/host-noindex.test.ts` still guards it).
- **Vercel Deployment Protection** (human click-path, do once):
  Vercel dashboard → Project `franco-giacinto-portfolio` → **Settings →
  Deployment Protection → Vercel Authentication → Standard Protection**
  (protects previews; keep production public). Headers above protect
  regardless.
- No `vercel.json` added: headers/redirects stay single-sourced in
  `next.config.mjs` + `middleware.ts` so the test suite can see them.

### B. robots.txt

`app/robots.ts`: the `*` rule now disallows `/api/ask` (POST-only endpoint,
pointless in an index) and `/estimate/success` (future-proof). AI bots remain
explicitly allowed. `Host` + `Sitemap` unchanged, canonical only.

### C. Headers

Added to every route in `next.config.mjs`:

- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Content-Security-Policy-Report-Only` — the Stage 1 starter policy, already
  allowing the Stage 2 analytics origins (GTM, GA4, Vercel scripts/vitals).
  **Enforcement switch**: after ~7 clean days, rename the key to
  `Content-Security-Policy` (constant `CSP_ENFORCE` in `next.config.mjs`).
- Kept: nosniff, Referrer-Policy, X-Frame-Options, immutable media caching.
- ACAO: unchanged — HTML sends none; only the agent JSON endpoints send `*`.

### D. Cache + document weight

- City pages (`/areas/{city}`), service pages (`/services/{slug}`) and the
  224 matrix pages now export `revalidate = 3600` (ISR). On Vercel this serves
  exactly `Cache-Control: public, s-maxage=3600, stale-while-revalidate` from
  the edge. (A `Cache-Control` set in `next.config.mjs` `headers()` is
  overwritten by Vercel for prerendered pages, so ISR is the honest
  implementation, not the header.)
- **Homepage JSON-LD reduced 4 → 4 blocks but ~7 KB lighter and
  de-duplicated**: FAQPage (duplicate of `/faq`) and HowTo (near-duplicate of
  `/stairs`) removed from `/`; home now carries LocalBusiness + WebSite
  (layout) + WebPage + BreadcrumbList (page), which is the Rule-9 set. Full
  FAQPage schema lives only on `/faq`; HowTo lives only on `/stairs`.
- **Hero/LCP**: new `public/images/stair-studio-poster.jpg` (1280 px, < 80 KB,
  progressive) replaces the 430 KB poster on the hero video, and the hero now
  issues a `ReactDOM.preload()` for it so the LCP image is requested from the
  document head. The 430 KB original stays for any other consumer. Video is
  unchanged (still client-gated, never blocks LCP).

### Acceptance evidence

- `npm run verify` green (typecheck, tests incl. new canonical-host suite,
  build, site audit).
- Preview-host noindex: covered at three layers (meta robots on
  `VERCEL_ENV=preview`, config header on `*.vercel.app`, middleware on any
  non-canonical host). Live `curl -sI` to be pasted into the PR from an
  unrestricted network.
- HTML sends no `Access-Control-Allow-Origin` (was already true; audited).
- CSP-Report-Only present on every HTML response.
- Homepage FAQ/HowTo JSON-LD moved off `/`.
