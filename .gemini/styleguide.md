# Green Hardwood — code review style guide

Applies to Gemini Code Assist reviews on this repository.
Full context: `AGENTS.md`.

## Flag these as blocking

- Business content (prices, service copy, city descriptions, credentials)
  inlined into a component instead of `data/`.
- A hard-coded domain instead of `SITE_URL` from `lib/site-url.ts`.
- A hard-coded Ontario Building Code number instead of `OBC_LIMITS`.
- A page without `metadata.title`, `metadata.description`, or
  `alternates.canonical`.
- A dynamic route missing `generateStaticParams` or `dynamicParams = false`.
- An `<img>` without `alt`.
- `any`, `!` non-null assertions, or `@ts-ignore` used to silence
  `noUncheckedIndexedAccess`. The fix is a total lookup, not a suppression.
- Any change to `lib/assistant/` that lets the assistant state a fact not present
  in the retrieved passages, or removes the fallback to the grounded reply.
- Text asserting that a specific staircase passes or will pass inspection.
- A new page whose content largely duplicates an existing page.

## Flag these as suggestions

- `"use client"` on a whole page where a client island would do.
- A hard-coded colour instead of a semantic Tailwind token.
- A title likely to exceed 70 characters once ` | Green Hardwood` is appended.
- A bug fix with no accompanying test.

## Do not flag

- Long typed data files in `data/` — that is the architecture working.
- Deliberate comments explaining _why_ a decision was made. Keep them.
- The single-page glossary. It is intentional; per-term pages would be thin.
- The absence of satellite sites. Also intentional.
