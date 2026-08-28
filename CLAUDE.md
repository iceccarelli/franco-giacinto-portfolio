# Claude Code — Green Hardwood

The full working rules live in **[AGENTS.md](./AGENTS.md)**. Read it before
changing anything. Human process is in `docs/WORKFLOW.md`.

## The short version

```bash
npm ci && npm run verify    # typecheck → 147 tests → build → site audit
```

- Never commit to `main`. Branch → PR → CI green → merge.
- Content goes in `data/`, never inline in a `page.tsx`.
- Never invent a price, a credential, or a code threshold. If it is not in
  `data/`, ask rather than writing it.
- Never state that a specific staircase passes inspection.
- A new URL earns its place only if it answers a query no existing URL answers
  better. `docs/QUERY-INVENTORY.md` is the map.
- Fix a bug, add the test that would have caught it, same PR.
- Navigation lives in `data/navigation.ts`. A link added straight into a header
  or footer component fails `tests/navigation.test.ts`, on purpose: web and
  mobile render the same array, and that is what keeps them identical.
- Never emit a rating, a review count, or a date the site cannot source.
  `company.reviews` is null until real reviews exist; guide dates come from
  `updatedDate()`. `tests/agent-api.test.ts` fails on a fabricated one.
- Price ranges are parsed by `parsePriceBand()` and nowhere else. A string with
  no genuine range returns null rather than a guessed ceiling.

## Where things are

| Looking for              | Go to                            |
| ------------------------ | -------------------------------- |
| Any content              | `data/`                          |
| Structured data          | `lib/seo.ts`                     |
| The 224 city pages       | `data/matrix.ts`                 |
| Ontario stair thresholds | `OBC_LIMITS` in `data/obc.ts`    |
| The assistant            | `lib/assistant/`, `app/api/ask/` |
| The quality gate         | `scripts/audit-site.mjs`         |
| Navigation (all of it)   | `data/navigation.ts`             |
| The layout contract      | `docs/DESIGN-SYSTEM.md`          |
| The agent/JSON API       | `app/api/*.json`, `lib/agent-api.ts` |
| Honest current limits    | `docs/HONEST-LIMITS.md`          |

## Things that will waste your time if you do not know them

- The test runner needs `--conditions=react-server` (already in `npm test`) so
  `server-only` modules load.
- `npm run build` fetches Google Fonts; it needs network.
- The audit reads `.next/server/app/**/*.html`, so it only runs after a build.
- `SITE_URL` comes from `lib/site-url.ts`. Never hard-code a domain.
