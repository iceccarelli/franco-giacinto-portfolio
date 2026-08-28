# GitHub Copilot — Green Hardwood

Full rules: **[AGENTS.md](../AGENTS.md)**.

Production website of a Toronto hardwood flooring, stairs, and railings company.
Next.js 15 App Router, TypeScript strict with `noUncheckedIndexedAccess`,
Tailwind v4, 181 statically prerendered pages, no database.

## When suggesting code

- **Server Components by default.** `"use client"` only for real interactivity,
  and prefer a small client island over a client page.
- **Content lives in `data/`.** Never suggest inlining copy, a price, or a
  service description into a component. One edit in `data/services.ts` must keep
  feeding the service page, 84 city pages, nav, footer, JSON-LD, sitemap, search
  index, `llms.txt`, and the assistant.
- **Never fabricate business facts.** No invented prices, credentials, project
  addresses, review counts, or Ontario Building Code numbers. They come from
  `data/company.ts`, `data/estimate.ts`, and `OBC_LIMITS` in `data/obc.ts`.
- **Never suggest text saying a specific staircase passes inspection.**
- **Every page needs** `export const metadata` with `title`, `description`, and
  `alternates.canonical`. Dynamic routes also need `generateStaticParams`,
  `generateMetadata`, and `export const dynamicParams = false`.
- **Every `<img>` needs `alt`.** CI fails without it.
- **Use semantic Tailwind tokens** — `bg-surface`, `text-muted`,
  `border-border`, `text-primary` — not hard-coded colours.
- **Build URLs from `SITE_URL`** in `lib/site-url.ts`.
- Titles must fit `<title> | Green Hardwood` within 70 characters.

## Do not suggest

- Committing to `main`.
- Adding pages to increase a page count.
- New root domains or satellite sites (see `docs/SATELLITE-ARCHITECTURE.md`).
- Loosening the grounding rules in `lib/assistant/`.
- `any`, non-null assertions, or `@ts-ignore` to get past
  `noUncheckedIndexedAccess` — make the lookup total instead, as
  `getSpecies()` does.

## Verifying

`npm ci && npm run verify` — typecheck, 92 tests, build, site audit. The audit
fails on dead internal links, duplicate titles or descriptions, missing
canonicals, missing `h1` or `alt`, and unparseable JSON-LD.
