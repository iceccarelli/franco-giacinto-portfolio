# Working on Green Hardwood — instructions for AI coding agents

This file is read by Claude Code, GitHub Copilot, Gemini Code Assist, Cursor, and
any other agent that supports the `AGENTS.md` convention. `CLAUDE.md`,
`.github/copilot-instructions.md`, and `GEMINI.md` all point here so there is one
set of rules, not four that drift apart.

Human contributors: read `docs/WORKFLOW.md` instead. It says the same things at
more length.

---

## What this repository is

The production website of **Green Hardwood**, a hardwood flooring, stairs, and
railings company in Toronto. Live at **https://greenhardwood.ca** — the
`*.vercel.app` alias serves the same bytes and is deliberately noindexed.

It is a statically prerendered Next.js 15 App Router site: **371 pages**, all
generated at build time from typed content modules in `data/`. TypeScript is
`strict` with `noUncheckedIndexedAccess`.

The site's commercial thesis is narrow and deliberate: **own hardwood stairs and
hardwood installation in the Greater Toronto Area.** Changes that dilute that
focus are the wrong changes, even when they add pages.

---

## Non-negotiables

1. **Never commit to `main`.** Branch, open a PR, let CI pass. `main` deploys to
   production within about a minute of a push.
2. **Run `npm ci && npm run verify` before proposing a change is done.**
   `verify` is typecheck → tests → build → site audit. If the audit fails, the
   change is not ready, no matter how good the diff looks.
3. **Content belongs in `data/`, never inline in a `page.tsx`.** A service
   description in `data/services.ts` feeds the service page, 32 city pages, the
   header, the footer, the homepage, the JSON-LD offer catalogue, the sitemap,
   the search index, `llms.txt`, and the assistant. Inlining copy breaks that
   guarantee silently.
4. **Never invent a fact about the business.** Prices, credentials, project
   locations, review counts, and Ontario Building Code thresholds come from
   `data/`. If a number is not there, do not write it — ask.
5. **Do not add pages to inflate a count.** A URL earns its place only if it
   answers a query no existing URL answers better. See
   `docs/QUERY-INVENTORY.md`. The audit fails on duplicate titles specifically to
   stop this drifting.
6. **Never state that a specific staircase passes inspection.** Quote the
   thresholds from `OBC_LIMITS` and say the municipal building department
   decides. This is a liability boundary, not a stylistic preference.
7. **Only `greenhardwood.ca` may be indexed.** Every `*.vercel.app` host —
   previews and the production alias alike — gets `X-Robots-Tag: noindex`
   from `next.config.mjs`. `tests/host-noindex.test.ts` fails if that rule is
   removed or loosened.
8. **Machine surfaces never promise a 404 and never contradict `data/`.**
   `/llms.txt` and `/ai.txt` are generated; every URL they emit must resolve,
   and worked price examples derive from the estimator rather than being
   retyped. `tests/llms-surface.test.ts` is the gate.

---

## Commands

```bash
npm ci              # exactly what Vercel runs; fails on lockfile drift
npm run dev         # http://localhost:3000
npm run typecheck   # tsc --noEmit
npm test            # unit tests, ~4s
npm run build       # prerenders every route
npm run audit:site  # post-build gate, reads the generated HTML
npm run verify      # all four, in order
npm run indexnow    # announce URL changes (needs INDEXNOW_KEY)
```

The test runner needs `--conditions=react-server` (already in the npm script) so
modules guarded by `server-only` can load outside a Server Component.

---

## Architecture

```
app/                        route segments; every page exports metadata + JSON-LD
  services/[slug]/[city]/   224 service x city pages, generated from data/matrix.ts
  answers/ methods/         the authority layer
  glossary/                 ONE page, anchored per term — not one page per term
  api/ask/                  the assistant endpoint
  actions/lead.ts           Server Action for the quote form
  sitemap.ts robots.ts manifest.ts llms.txt/ llms-full.txt/ ai.txt/ feed.xml/
components/
  assistant/                Ask Green Hardwood widget (thin; retrieval is server-side)
  layout/ search/ tools/ estimate/ ui/
data/                       the single source of truth for all content
lib/
  seo.ts                    the JSON-LD entity graph, nodes addressable by @id
  site-url.ts               SITE_URL resolution + preview noindex
  assistant/                grounded retrieval for /api/ask
  leads.ts lead-delivery.ts
scripts/audit-site.mjs      the quality gate
tests/                      unit tests over the pure logic and the content
docs/                       WORKFLOW, QUERY-INVENTORY, DISCOVERY, HONEST-LIMITS
```

### Conventions to follow

- Server Components by default. Add `"use client"` only for genuine
  interactivity, and prefer extracting a small client island (see
  `components/portfolio/project-grid.tsx`) over making a whole page client.
- Every page: `export const metadata` with `title`, `description`, and
  `alternates.canonical`. Dynamic routes: `generateStaticParams` +
  `generateMetadata` + `export const dynamicParams = false`.
- Use `clampDescription()` from `lib/seo.ts` for any description built from
  content, or the audit will warn about SERP truncation.
- Build URLs from `SITE_URL` (`lib/site-url.ts`), never from a hard-coded
  domain and never from `company.website` directly.
- Titles must fit `<title> | Green Hardwood` inside 70 characters. When a display
  name is longer, add a `seoName` / `seoTitle` field rather than truncating.
- Tailwind v4 semantic tokens only: `bg-surface`, `text-muted`, `border-border`.
  No hard-coded hex outside `app/globals.css`.
- Every `<img>` needs real `alt` text. The audit fails without it.

---

## The assistant (`/api/ask`)

`lib/assistant/` answers visitor questions **only** from `data/`. Every reply is
either verbatim site content or a template whose variables come from site
content, and every reply carries citations to internal pages.

If `ANTHROPIC_API_KEY` is set, a phrasing layer runs on top — but the model is
given only the retrieved passages and is instructed to refuse rather than fill
gaps. On any error or timeout it falls back to the grounded reply.

**Do not loosen this.** Do not add general flooring knowledge to the system
prompt, do not let the model cite pages retrieval did not return, and do not
remove the fallback. A contractor's chat widget quoting a wrong price is a real
problem, not a rough edge.

---

## Editing content

| Change               | File                                      | Watch for                                                                          |
| -------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------- |
| Service              | `data/services.ts`                        | Feeds 8+ surfaces at once                                                          |
| City                 | `data/areas.ts`                           | Also add a `cityMult` in `data/estimate.ts` — a test enforces this                 |
| Guide                | `data/guides.ts` or `guides-expansion.ts` | Slugs and titles must stay unique                                                  |
| Answer               | `data/answers.ts`                         | `pathHint` must resolve; a test enforces it                                        |
| Method               | `data/methods.ts`                         | `relatedGuides` must resolve                                                       |
| Glossary term        | `data/glossary.ts`                        | `seeAlso` must resolve, no self-reference                                          |
| Prices               | `data/estimate.ts`                        | Updates the estimator, all 84 matrix bands, `llms.txt`, and the assistant together |
| NAP, hours, warranty | `data/company.ts`                         | Must match the Google Business Profile character for character                     |
| Stair thresholds     | `OBC_LIMITS` in `data/obc.ts`             | One constant drives the checker, the pages, `llms-full.txt`, and the assistant     |

---

## When you fix a bug

Add the test that would have caught it, in the same PR. Two real examples now in
the suite: site search ranked a portfolio project above a city's own page for a
city query, and `getSpecies()` could return `undefined` under
`noUncheckedIndexedAccess`.

---

## Known limits — read before proposing "improvements"

`docs/HONEST-LIMITS.md` is the current, honest state. Summary:

- Leads are captured to the server log; `RESEND_API_KEY` is not set yet.
- `data/problems.ts` is written to name the cases where a floor cannot be saved.
  Do not soften those into sales copy — they are what makes the rest credible.
- The site emits **no rating at all**: `company.reviews` is `null` and
  `lib/seo.ts` emits nothing while it stays that way. A previous version
  invented a 4.9 from the testimonial count; `tests/agent-api.test.ts` fails
  the build if a rating ever reappears without a real source. Stars turn on
  only when the owner claims the Google Business Profile and writes the live
  count into `company.reviews`.
- The photography is AI-generated placeholder work.
- Satellite domains and subdomains are deliberately **not** deployed. See
  `docs/SATELLITE-ARCHITECTURE.md`. Do not propose them.

Do not "fix" these by inventing data. They are business decisions with a human
owner.
