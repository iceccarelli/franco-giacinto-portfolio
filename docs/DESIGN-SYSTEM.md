# The design system

The reference is [aws.amazon.com](https://aws.amazon.com). Not its colours —
ours are parchment and forest green — but its *structure*: how a large site with
hundreds of pages stays navigable, and how the same information architecture
survives the trip from a 1440px laptop to a 390px phone.

The rule this document exists to enforce:

> **The breakpoint changes the presentation. It never changes the site.**

A phone visitor and a laptop visitor must be able to reach the same pages, in
the same groups, in the same order. Anything else is two websites maintained by
one team, and the one nobody is looking at is the one that rots.

---

## 1. Navigation: one source, two presentations

Everything in the header and the footer comes from **`data/navigation.ts`**.
No component may declare a link of its own — `tests/navigation.test.ts` fails
the build if one does.

| Surface | Renders | At `lg`+ | Below `lg` |
| --- | --- | --- | --- |
| Utility bar | `utilityLinks` | thin dark strip above the logo | first block inside the drawer |
| Primary nav | `navSections` | mega-menu panels, groups side by side | drawer, groups stacked behind disclosures |
| Footer matrix | `footerColumns` | four columns | four `<details>` accordions |

### Why this file exists

The header used to hold three hand-maintained arrays — `mega`, `primary`, and
`mobile`. They had already drifted. A desktop visitor could not reach `/guides`,
`/answers`, `/glossary`, `/trade` or `/contact` from the header at all; a phone
visitor could. Nobody decided that. It is what happens when there are two lists.

The footer had sixteen hand-written `<li>` elements in a single "Company"
column, which is a list, not a structure.

### Adding a page to the navigation

Add it to `data/navigation.ts`. That is the whole procedure. It appears on
desktop and on mobile simultaneously, because there is only one array.

---

## 2. The two container widths

`components/layout/container.tsx`:

| Width | Class | Use |
| --- | --- | --- |
| `wide` | `max-w-6xl` | page rails, grids, cards, heroes, the footer |
| `prose` | `max-w-3xl` | a single reading column |

**There is no third width.** The audit and the test both fail on one.

Before the rule, `max-w-6xl` was on 19 pages, `max-w-3xl` on 9, and `max-w-4xl`
on exactly 2 — so `/problems/[slug]` sat at a different measure than its own
siblings `/answers/[slug]` and `/guides/[slug]`, and `/glossary` put its
breadcrumbs on a wider gutter than its own body text. Nobody chose that.

A page rail is identified as `mx-auto` + `px-4`. A `max-w-sm` on a centred
portrait is not a page rail and is left alone.

## 3. The vertical rhythm

`components/layout/section.tsx`:

| Step | Class | Use |
| --- | --- | --- |
| `tight` | `py-6 sm:py-8` | breadcrumb rails, meta strips |
| `default` | `py-12 sm:py-16` | the standard section |
| `loose` | `py-16 sm:py-24` | the one or two sections that should breathe |

Every step grows at `sm:`. Before this, only the homepage did — so a hand-rolled
hero was visibly tighter on a laptop than a `<PageHero>` one on the same site.

## 4. One h1 scale

```
font-display text-4xl leading-[1.08] font-medium sm:text-5xl
```

All fifteen of them. The three `<article>` detail routes had forked to
`leading-[1.1]` with no `font-medium`, and `not-found.tsx` had neither.

## 5. Images

Every raw `<img>` declares how it loads:

- the one hero image per page: `fetchPriority="high" decoding="async"`
- everything else: `loading="lazy" decoding="async"`

Before this, **none of the sixteen images on the site had a loading hint**, so
`/services` fetched eight images before the fold. On the LTE connection a
homeowner actually browses from, that is the difference between a fast page and
a slow one.

## 6. The assistant dock

Collapsed it is a square icon button bottom-right, clearing the mobile CTA bar
(`bottom-24`, dropping to `bottom-6` at `md`). A chat bubble that covers the
phone number is, for a contractor, a lost call — `tests/navigation.test.ts`
asserts it cannot regress.

Open it carries a title, a grounding badge, suggestion chips, and a disclaimer
strip, in that order.

---

## What enforces this

| Rule | Enforced by |
| --- | --- |
| No component declares its own nav links | `tests/navigation.test.ts` |
| Every nav href resolves to a real route | `tests/navigation.test.ts` |
| Every top-level page is reachable from the header | `tests/navigation.test.ts` |
| Four balanced footer columns | `tests/navigation.test.ts` |
| Two container widths | test **and** `scripts/audit-site.mjs` |
| One h1 scale | test **and** `scripts/audit-site.mjs` |
| Every `<img>` has a loading hint | test **and** `scripts/audit-site.mjs` |
| Prices live only in `data/services.ts` | `tests/navigation.test.ts` |
| Assistant clears the mobile CTA bar | `tests/navigation.test.ts` |

A convention that is not enforced is a convention that lasts two patches. Each
row above is there because that specific rule had already been broken.
