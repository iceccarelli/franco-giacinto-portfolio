# Satellite architecture for Green Hardwood

> **Status: not deployed, and deliberately so.**
>
> The routes in this repo (`/methods`, `/answers`, `/glossary`, the 84 service x
> city pages) already capture the queries these subdomains were meant to catch,
> from a single domain that accumulates authority instead of splitting it.
>
> Revisit this only after greenhardwood.ca is live, indexed, and ranking. A
> subdomain that canonicalises to the main site adds crawl surface without
> adding authority; a separate root domain repeating the same content is a
> doorway network, which is a penalty, not a strategy.
>
> The `sites/` HTML in pack 02 is kept out of this repo for the same reason.

## The entity

```
Organization @id = {SITE_URL}/#org
LocalBusiness @id = {SITE_URL}/#business
NAP           = data/company.ts  (single source)
```

Every satellite page points `rel=canonical` at the matching URL on the main site, and includes the same Organization `@id`.

## Allowed properties

| Property                   | Purpose                           | Canonical target                   |
| -------------------------- | --------------------------------- | ---------------------------------- |
| `greenhardwood.ca`         | System of record                  | itself                             |
| `stairs.greenhardwood.ca`  | Stair-only narrative + studio CTA | `/services/hardwood-stairs`        |
| `install.greenhardwood.ca` | Installation-only narrative       | `/services/hardwood-installation`  |
| `ai.greenhardwood.ca`      | Machine-readable citation card    | `/llms.txt`                        |
| Google Business Profile    | Local pack                        | website field = `greenhardwood.ca` |
| Instagram / YouTube        | Proof                             | link in bio = `greenhardwood.ca`   |

## Forbidden

- A new root domain that repeats the same 12 city pages.
- `greenhardwoodtoronto.com`, `hardwoodstairstoronto.net`, etc. unless they 301 to the canonical.
- Different phone numbers on different sites.
- Auto-generated city doorway pages on a satellite.

## DNS / Vercel when you are ready

1. Add `stairs.greenhardwood.ca` and `install.greenhardwood.ca` as domains on the **same** Vercel project, mapped to a small `app/satellites/` rewrite **or** deploy the static HTML in `sites/` as separate Vercel projects that only emit the microsite.
2. `robots.txt` on a satellite: allow crawl, but every page has a canonical to main.
3. `llms.txt` on a satellite: four lines + link to `{SITE_URL}/llms-full.txt`.

Preferred in 2026: **do not deploy separate sites until the main domain is live**. The App Router routes in this pack already capture the queries.
