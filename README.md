# Green Hardwood

Hardwood floor installation, custom hardwood stairs, and hardwood railings across Toronto and the Greater Toronto Area.

Production site: https://greenhardwood.ca

## What this repository is

A statically prerendered Next.js 15 App Router site built around one commercial thesis: **most GTA flooring companies treat the staircase as leftover flooring.** Every architectural decision here follows from owning "hardwood stairs" and "hardwood installation" as search and answer-engine territory, while covering the full hardwood surface — sanding, finishing, refinishing, buffing, repairs, inlays, decks, and commercial.

## Stack

| Concern   | Choice                                            | Why                                                                                     |
| --------- | ------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Framework | Next.js 15, App Router                            | Per-route `generateMetadata`, `generateStaticParams`, native `sitemap.ts` / `robots.ts` |
| Rendering | 100% static prerender                             | 52 HTML documents at build time; no cold starts, no runtime data dependency             |
| Language  | TypeScript, `strict` + `noUncheckedIndexedAccess` | Lookups are total by construction, not by assertion                                     |
| Styling   | Tailwind CSS v4, `@theme` tokens                  | One palette, zero hard-coded hex in components                                          |
| Content   | Typed modules in `data/`                          | Content is data, so pages, schema, sitemap, and `llms.txt` never drift apart            |
| Icons     | lucide-react                                      | Tree-shaken                                                                             |

## Architecture

```
app/                        route segments; every page exports metadata + JSON-LD
  services/[slug]/          8 services, prerendered from data/services.ts
  services/[slug]/[city]/   224 service x city pages — the long-tail capture layer
  areas/[city]/             32 cities (20 core, 12 travel), from data/areas.ts
  guides/[slug]/            9 long-form guides, prerendered from data/guides.ts
  actions/lead.ts           Server Action: validate, throttle, deliver
  search/                   crawlable results page for the client-side index
  opengraph-image.tsx       per-route social cards, generated from page titles
  sitemap.ts robots.ts      generated from the same data as the pages
  manifest.ts               PWA manifest
  llms-full.txt/            entire corpus as plain text, one request
  feed.xml/                 RSS for the guides
components/
  layout/                   header (search, active nav), footer, shell, mobile CTA
  search/                   ARIA combobox, Cmd-K, backed by lib/search-index.ts
  tools/                    stair studio, OBC checker, species showroom, floor preview
  estimate/                 2026 GTA estimator + the real lead form
  portfolio/                client island for the project filter
  ui/                       Radix primitives
data/                       the single source of truth for content and schema
  matrix.ts                 builds the service x city pages, with guardrails
  obc.ts                    OBC_LIMITS + checkObc + obcRules, one set of numbers
lib/seo.ts                  the JSON-LD entity graph, all nodes addressable by @id
lib/leads.ts                dependency-free lead validation
lib/lead-delivery.ts        Resend adapter; never silently drops a lead
scripts/audit-site.mjs      post-build quality gate (npm run audit:site)
scripts/indexnow.mjs        announce URL changes to Bing, Yandex, and friends
public/llms.txt ai.txt      canonical facts for answer engines
```

### Why the content lives in `data/`

`data/services.ts` feeds the service page, the header mega-menu, the footer, the homepage grid, `hasOfferCatalog` in LocalBusiness JSON-LD, and `sitemap.ts`. Adding a service is one object literal, and eight surfaces update together. This is the property that makes programmatic local SEO safe to scale.

## The assistant

`Ask Green Hardwood` is a chat widget on every page. It answers from this site's
own content and nothing else — every reply is either verbatim from `data/` or a
template whose variables come from `data/`, and every reply cites the internal
pages it came from.

| Question                          | What it does                                                 |
| --------------------------------- | ------------------------------------------------------------ |
| "How much are stairs in Vaughan?" | Returns _that city's_ computed band from `data/matrix.ts`    |
| "Will my stairs pass inspection?" | Quotes `OBC_LIMITS` and says the building department decides |
| "Do you install vinyl?"           | Declines plainly, as the brand does                          |
| Anything undocumented             | Says so and gives the phone number                           |

Setting `ANTHROPIC_API_KEY` adds a phrasing layer over the same retrieved
passages. It cannot introduce new facts, cannot cite a page retrieval did not
return, and falls back to the grounded reply on any error. Without a key the
assistant is fully functional, deterministic, and free.

Contributing agents (Claude Code, Copilot, Gemini) read `AGENTS.md`.

## Working on this site

`docs/WORKFLOW.md` is the operating manual: branch, verify, PR, preview, merge.
Read it before your first change. The short version:

```bash
git checkout -b feat/thing
# ...change...
npm ci && npm run verify     # typecheck, tests, build, site audit
git push -u origin feat/thing && gh pr create --fill
```

Never commit to `main` — it deploys to production in about a minute with no
review and no preview.

## Local development

```bash
npm install
npm run dev          # http://localhost:3000
npm run typecheck    # tsc --noEmit
npm run build        # prerenders every route
npm test             # 57 unit tests over the pure logic, ~2s
npm run verify       # typecheck + tests + build + audit
npm run audit:site   # post-build: links, titles, canonicals, alt text, JSON-LD
```

CI (`.github/workflows/ci.yml`) runs the whole of `verify` on every pull request
and every push to `main`.

### The audit gate

`npm run audit:site` reads the prerendered HTML and fails the build on anything
that would quietly cost rankings or break a visitor:

- a dead internal link
- two pages competing for the same `<title>` or meta description
- a missing canonical, `<h1>`, or `alt` attribute
- a referenced image or video that is not in `public/`
- a JSON-LD block that does not parse

It also warns about SERP truncation and orphaned pages. Run it before every
merge; it is the reason the site currently has 132 pages and 132 unique titles.

`npm run build` fetches and self-hosts Google Fonts, so the build machine needs network access.

## Where the site thinks it lives

`lib/site-url.ts` resolves one value, `SITE_URL`, and every canonical tag,
JSON-LD `@id`, `metadataBase`, sitemap entry, RSS link, and `llms.txt` URL is
built from it. Resolution order:

1. `NEXT_PUBLIC_SITE_URL` — explicit override
2. `VERCEL_PROJECT_PRODUCTION_URL` — Vercel's production domain, which becomes
   the custom domain automatically the moment one is assigned
3. `http://localhost:3000` in `next dev`
4. `company.website` — the intended final domain, for any other CI

There is deliberately no hard-coded URL anywhere else. `company.website` stays
in `data/company.ts` as a _business fact_; `SITE_URL` is an _infrastructure
fact_. They converge once the domain is live.

Preview deployments (`VERCEL_ENV=preview`) are served `noindex, nofollow` and a
`Disallow: /` robots.txt, so a preview never competes with production for its
own queries.

## The authority layer

Beyond the service and city pages, the site carries the reference material that
makes it citable rather than just findable:

| Surface                | What it is                                                                                      | Why it exists                                                                           |
| ---------------------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `/methods` (8)         | How each assembly is actually built, step by step, with when it is correct and when it is wrong | The question behind "who should install my floor" is "do they know what they are doing" |
| `/answers` (28)        | Short, direct answers, each also rendered in full on the index with FAQPage markup              | Answer engines retrieve one page and can quote any of the 28                            |
| `/glossary` (22 terms) | One page, anchored per term, `DefinedTermSet` schema                                            | Twenty-two one-paragraph URLs would be thin; one substantial page is not                |
| `/guides` (19)         | Long-form specification and cost                                                                | Depth for the queries that convert                                                      |

`docs/QUERY-INVENTORY.md` maps every target query to exactly one URL, which is
what keeps two pages from competing for the same search.

## The AI-facing surface

`/llms.txt`, `/ai.txt`, and `/llms-full.txt` are generated routes, not static
files, so their URLs follow the deployment and their content is built from the
same modules the pages render from. `/llms-full.txt` is the whole corpus —
every service, city, species, guide, price band, and the Ontario stair rules —
in a single ~51 KB plain-text request.

## Lead delivery

`components/estimate/quote-form.tsx` posts to the `submitLead` Server Action,
which validates, throttles by IP, and hands off to `lib/lead-delivery.ts`.

Until `RESEND_API_KEY` is set, a validated lead is still captured as a single
line of JSON in the server log, prefixed `GREEN_HARDWOOD_LEAD` — greppable in
the Vercel runtime logs. Nothing is ever silently dropped. To switch email on,
set `RESEND_API_KEY`, `LEAD_TO_EMAIL`, and `LEAD_FROM_EMAIL` in the Vercel
project. See `.env.example`.

## Content operations

| Task                                | File                                         |
| ----------------------------------- | -------------------------------------------- |
| Add or edit a service               | `data/services.ts`                           |
| Add a city landing page             | `data/areas.ts`                              |
| Publish a guide                     | `data/guides.ts`                             |
| Change NAP, hours, warranty         | `data/company.ts`                            |
| Update 2026 price bands             | `data/estimate.ts` **and** `public/llms.txt` |
| Add a project                       | `data/projects.ts`                           |
| Add or remove a service x city page | `matrixServices` in `data/matrix.ts`         |
| Ontario stair thresholds            | `OBC_LIMITS` in `data/obc.ts`                |
| Ontario stair-code rules            | `data/obc.ts`                                |

Price bands appear in three places by design — the estimator, the guides, and `llms.txt`. Update all three in the same commit so answer engines never quote a stale number.

## Structured data

Emitted from `lib/seo.ts`, validated against Google's Rich Results Test:

- `HomeAndConstructionBusiness` + `FlooringContractor` with `areaServed`, `hasOfferCatalog`, `openingHoursSpecification`, `geo`
- `Service` per service page, `Service` + `City` per area page
- `FAQPage` on home, service, area, and FAQ pages
- `HowTo` for carpet-to-hardwood stair conversion
- `BreadcrumbList` sitewide, `ItemList` on the portfolio, `Article` on guides

## Deployment

Vercel, `main` branch, zero configuration. `next.config.mjs` carries the permanent redirects from the previous portfolio URL structure — do not remove them; they are load-bearing for existing link equity.

## License

All rights reserved. Green Hardwood Ltd.
