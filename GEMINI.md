# Gemini Code Assist — Green Hardwood

Full rules: **[AGENTS.md](./AGENTS.md)**. Review style guide: `.gemini/styleguide.md`.

Production website of a Toronto hardwood flooring, stairs, and railings company.
Next.js 15 App Router, TypeScript strict + `noUncheckedIndexedAccess`,
Tailwind v4, 359 prerendered pages, no database, deployed on Vercel from `main`.

## Before proposing a change

1. Read `AGENTS.md`.
2. Check `docs/QUERY-INVENTORY.md` before adding any page — every URL maps to one
   query, and duplicates fail CI.
3. Check `docs/HONEST-LIMITS.md` before proposing an "improvement" — several
   obvious gaps are known, deliberate, and owned by a human.

## Hard rules

- Content in `data/`, never inline in components.
- No invented prices, credentials, or building-code numbers.
- Never claim a specific staircase passes inspection.
- Never commit to `main`; branch and open a PR.
- `npm ci && npm run verify` must pass before a change is done.

## Verification

```bash
npm ci && npm run verify
```

typecheck → tests → build (359 pages) → site audit.
