# How we work on this site

The site is live. From here on, every change reaches production the same way, and
nothing reaches production that has not been verified. This document is the whole
process — it is short on purpose.

---

## The loop

```
branch  →  change  →  npm run verify  →  push  →  PR  →  CI + preview  →  merge  →  live
```

Every step has a reason. None of them are optional.

### 1. Branch

Never commit to `main`. `main` is what the public sees; a push to it deploys
within about a minute, with no review and no preview.

```bash
git checkout main
git pull --ff-only
git checkout -b feat/short-description
```

Naming: `feat/` for new capability, `fix/` for a defect, `content/` for copy,
prices, or new cities, `chore/` for tooling.

### 2. Change one thing

A branch that adds three cities *and* redesigns the header is a branch nobody can
review and nobody can revert cleanly. One intent per branch.

### 3. Verify locally

```bash
npm ci          # exactly what Vercel runs — catches lockfile drift
npm run verify  # typecheck → tests → build → site audit
```

`npm ci`, not `npm install`. `npm install` will happily paper over a lockfile
that has drifted from `package.json`; `npm ci` refuses, which is what Vercel
does. A deploy that dies at the install step is always this.

If you changed a dependency, commit `package-lock.json` in the same commit as
`package.json`. They are one change.

### 4. Push and open a PR

```bash
git push -u origin feat/short-description
gh pr create --fill
```

Opening a PR does two things at once: CI runs the full verify, and Vercel builds
a **preview deployment** at its own URL. The preview is `noindex` and its
robots.txt is `Disallow: /`, so it cannot compete with production in search.

### 5. Actually open the preview

CI proves the site builds and the markup is sound. It cannot tell you the hero
looks wrong on a phone. Click the Vercel link on the PR and use the thing.

### 6. Merge

Merge from the GitHub UI once CI is green. Vercel deploys `main` automatically.

---

## What CI checks, and why each one exists

`.github/workflows/ci.yml` runs on every PR and every push to `main`.

| Step | Catches |
| --- | --- |
| `npm ci` | Lockfile drift — the thing that kills a Vercel deploy at install |
| `npm run typecheck` | Type errors, including `noUncheckedIndexedAccess` violations |
| `npm test` | Broken lead validation, wrong stair-code thresholds, a matrix that has gone thin, search that stopped ranking |
| `npm run build` | Anything that fails to prerender |
| `npm run audit:site` | Dead internal links, duplicate titles or descriptions, missing canonicals, missing `h1` or `alt`, unparseable JSON-LD, missing media |

The audit is the one that repays itself. It has already caught a title collision
between the homepage and `/areas/toronto`, a duplicate meta description shared by
`/contact` and the 404, and roughly fifty SERP-truncation problems.

### Turn on branch protection

Do this once, in GitHub → Settings → Branches → Add rule for `main`:

- **Require status checks to pass before merging** → select `Typecheck, test, build, audit`
- **Require branches to be up to date before merging**
- **Do not allow bypassing the above settings** (yes, including for you)

Without this, CI is advisory. With it, a red build cannot reach production.

---

## The test suite

```bash
npm test                              # all of it, ~2 seconds
npx tsx --test tests/matrix.test.ts   # one file
```

It covers the pure logic where a silent bug is expensive:

- **`tests/leads.test.ts`** — phone and email formats real people type, tampered
  city/service values, sq ft written as "1,200 sq ft", all errors returned at
  once, values echoed back so a failed submit does not clear the form.
- **`tests/obc.test.ts`** — every Ontario stair threshold, including inclusive
  boundaries, and a check that the prose in `obcRules` quotes the same numbers
  `checkObc` enforces.
- **`tests/matrix.test.ts`** — 84 unique paths, titles, and descriptions; titles
  that fit a SERP; and, critically, that the same job prices *differently* in
  different cities. If that assertion ever fails, the city multiplier has stopped
  applying and all 84 pages have become the same page.
- **`tests/search.test.ts`** — all query tokens must match; a city name reaches
  that city's page.
- **`tests/seo.test.ts`** — description clamping, and that the business and
  founder JSON-LD nodes reference each other.

When you fix a bug, add the test that would have caught it, in the same PR.

---

## Content changes

Most work on this site is content, not code. It still goes through a branch and a
PR, because content is what ranks.

| Change | File | Watch out for |
| --- | --- | --- |
| Edit a service | `data/services.ts` | Feeds 8 surfaces at once: service page, matrix pages, header, footer, homepage, JSON-LD offer catalogue, sitemap, `llms.txt` |
| Add a city | `data/areas.ts` | Also add a `cityMult` entry in `data/estimate.ts`, or the price silently falls back. `tests/matrix.test.ts` enforces this |
| Publish a guide | `data/guides.ts` | Appears in the sitemap and RSS automatically |
| Change price bands | `data/estimate.ts` | Updates the estimator, all 84 matrix bands, and `llms.txt` together |
| NAP, hours, warranty | `data/company.ts` | Must match the Google Business Profile **character for character** |
| Add or drop a matrix service | `matrixServices` in `data/matrix.ts` | Read a generated page before shipping. If it reads like a mad-lib, write a `localAngle` for it |
| Ontario stair thresholds | `OBC_LIMITS` in `data/obc.ts` | One constant drives the checker, the pages, and `llms-full.txt` |

Content lives in `data/` so that a page, its structured data, its sitemap entry,
and its plain-text version for AI crawlers cannot drift apart. Editing copy
directly into a `page.tsx` breaks that guarantee — do it in `data/`.

---

## Deploys and rollback

`main` deploys automatically. Watch the build log reach
`Generating static pages (173/173)`.

**Rolling back is instant and does not need a commit.** Vercel → Deployments →
find the last good one → ⋯ → *Promote to Production*. Do that first, then fix the
cause on a branch. Never debug production by pushing to `main`.

---

## Environment variables

Set in Vercel → Settings → Environment Variables. Nothing secret goes in the repo.

| Variable | Purpose | Set? |
| --- | --- | --- |
| `RESEND_API_KEY` | Emails the lead. Without it, leads are captured in the server log only | ❌ pending |
| `LEAD_TO_EMAIL` | Where leads land | ❌ |
| `LEAD_FROM_EMAIL` | Must be a Resend-verified domain | ❌ |
| `INDEXNOW_KEY` | Announces URL changes to Bing, Yandex, Naver | ❌ |
| `NEXT_PUBLIC_SITE_URL` | Only to override Vercel's own production domain | not needed |

`SITE_URL` resolves automatically from Vercel's production domain, so attaching
`greenhardwood.ca` requires **no code change** — every canonical, JSON-LD `@id`,
sitemap URL, and `llms.txt` link follows it.

---

## Working with a patch from Claude

Patches are transport for work done outside the repo. They are not source and are
never committed.

```bash
git checkout main && git pull --ff-only
git checkout -b feat/whatever-the-patch-does

git apply --check --verbose NNNN-name.patch   # dry run first, always
git am --3way NNNN-name.patch
rm -f NNNN-name.patch                          # delete it — it is not source

npm ci && npm run verify
git push -u origin feat/whatever-the-patch-does && gh pr create --fill
```

If `git apply --check` fails, stop. Do not force it. A patch that will not apply
cleanly means the branch has moved underneath it, and the fix is a rebased patch,
not a manual merge.

---

## The three things that have actually gone wrong

Worth knowing, because each cost real time:

1. **Uncommitted `package-lock.json`.** `npm install` added a dependency, the
   lockfile updated, nobody committed it. `npm ci` — and therefore Vercel —
   fails. *Fix: run `npm ci` before you push.*
2. **A rename/delete merge conflict.** One branch renamed a file, the other
   deleted it, and git correctly refused to guess. *Fix: don't do cleanup commits
   directly on `main`; do them on the branch that is already changing the file.*
3. **A merge that stopped at a conflict and was never finished**, so `main` never
   got the work and the old site stayed live. *Fix: after any merge, check
   `git log --oneline -1` and `git status` before assuming it worked.*
