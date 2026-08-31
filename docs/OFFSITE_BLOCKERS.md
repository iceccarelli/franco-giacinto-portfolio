# Off-site blockers

Work only the owner can do. The code side of each item is already built and
waiting — where a URL is named below, dropping it into `data/profiles.ts`
propagates it to the schema `sameAs`, `/ai.txt`, `/llms.txt`,
`/api/facts.json` and the footer at the next build. There is no second place
to paste it.

Ordered by what actually gates ranking. Do not skip to item 6.

---

## 1. Claim the Google Business Profile — **everything else waits on this**

Nothing on this list matters as much. Map Pack eligibility is not a ranking
factor you can influence from a website; it is a profile you either have or do
not have. Right now the shop cannot appear in the local pack for
`hardwood stairs Toronto` at any position, no matter how good the site gets.

Use this NAP, character for character. A single differing character —
"Unit 6" versus "#6", "Toronto, ON" versus "Toronto, Ontario" — creates a
second entity and splits the signal:

```
Green Hardwood Ltd.
88 Sterling Road, Unit 6
Toronto, ON M6R 2B2
Canada
+1 416-847-3366
hello@greenhardwood.ca
```

- **Primary category**: Flooring contractor
- **Secondary category**: Stair contractor
- **Hours**: Mon–Fri 8–6 · Sat 9–4 · Sun by appointment
- **Website**: `https://greenhardwood.ca/?utm_source=gbp&utm_medium=organic&utm_campaign=profile`
  (the UTM is what makes GBP traffic separable in GA4 — without it, it lands
  in `google / organic` and you can never tell whether the profile works)
- **Photos**: 20 minimum. Stairs first — that is the niche being contested.
- **Products/Services**: Hardwood stairs, Hardwood installation, Sanding &
  refinishing, Hardwood railings
- **Description**: use the tagline and the 2026 bands. No superlatives.

→ Then paste the profile URL into `data/profiles.ts` under
`google-business-profile`.

**Until this exists, `/ai.txt` tells assistants that reviews are being
collected and to cite the website, the phone and the price bands instead.**
That is the honest holding position, and it is already live — but it is a
holding position, not a strategy.

## 2. Create the HomeStars profile

Same NAP, character for character. This is the review platform Ontario
homeowners actually search for trades, and it is the second review source
`/ai.txt` names.

→ URL into `data/profiles.ts` under `homestars`.

## 3. Search Console: verify, then remove the clone

1. Add `https://greenhardwood.ca` as a **Domain** property (DNS TXT).
2. Submit `https://greenhardwood.ca/sitemap.xml`.
3. Add `franco-giacinto-portfolio.vercel.app` as a separate property and use
   **Removals → Temporarily remove** on the whole host.

The clone now serves `X-Robots-Tag: noindex, nofollow` (verified live), so it
will drop out on its own — the removal request just makes it happen in days
instead of months.

## 4. Vercel dashboard — two settings

**a. ~~Remove the wildcard CORS header.~~ — CORRECTION: nothing to do here.**

This item previously said the `access-control-allow-origin: *` on the site's
HTML came from a dashboard header rule. That was wrong, and measuring it
settled the question:

```
/stairs   x-vercel-cache: PRERENDER   access-control-allow-origin: *
/images/… (static asset)              access-control-allow-origin: *
/search   (function-rendered)         no CORS header at all
```

Vercel attaches the wildcard to everything it serves from static/prerendered
storage. It is platform behaviour, there is no dashboard switch for it, and
middleware cannot delete it because the CDN adds it after middleware runs. The
override now lives in `next.config.mjs`, scoped so the agent surfaces keep
their `*`.

Impact, stated plainly so nobody re-panics about it: the pages carrying the
wildcard are public marketing pages with no authentication, no cookies and no
user data, and `*` without `Allow-Credentials` means no credentials are ever
sent. It is a scanner finding and an untidiness, not an exposure.

**b. Turn on Deployment Protection for previews.**
**Settings → Deployment Protection → Vercel Authentication → Standard
Protection.** Keep production public.

## 5. Environment variables

**Settings → Environment Variables**, Production *and* Preview:

| Variable             | Value                    | Unblocks                              |
| -------------------- | ------------------------ | ------------------------------------- |
| `NEXT_PUBLIC_GTM_ID` | `GTM-XXXXXXX`            | All measurement. See docs/analytics.md |
| `RESEND_API_KEY`     | from Resend              | Lead email delivery                    |
| `INDEXNOW_KEY`       | 32–64 hex chars          | `npm run indexnow` after each deploy   |

The GA4 Measurement ID goes **inside the GTM container**, never in an env var
here — two tags on one page double every conversion count.

## 6. Ask the last 25 finished clients for a review

Text, not email. One message, one link, no essay:

> Hi — Franco at Green Hardwood. If the floors are still behaving, would you
> leave a quick review? Takes a minute: [short link]

Do not offer anything in exchange. A reviewed shop with 12 honest reviews
outranks an unreviewed shop with a better website, and no amount of engineering
substitutes for this.

## 7. Film one 45-second clip

Franco, the moisture meter, a GTA stair. Vertical, phone, natural light. No
music, no captions, no logo animation.

The site already has the slot: set `NEXT_PUBLIC_HERO_VIDEO`, or drop the file
at `public/videos/`. Video results are the least contested surface in this
niche — there is effectively no competition for `hardwood stair Toronto` on
YouTube.

## 8. Confirm and extend the profile list

Instagram is live at `https://www.instagram.com/greenhardwood`. When YouTube,
Houzz, LinkedIn, Facebook or BBB exist, add each to `data/profiles.ts`.

Each profile must show the NAP from item 1 exactly. **A profile with a
different address is worse than no profile** — it does not add a signal, it
splits the entity, and the half with fewer signals is the half that stops
ranking.

## 9. Citations

BrightLocal, or manually: Yelp Canada, Yellow Pages Canada, Canada411, 411.ca,
Ontario trade directories. Identical NAP every time. This is boring and it
works.

## 10. Do not raise prices until review density exists

The 2026 bands are published on the site and in the JSON endpoints. Raising
them before there are reviews to justify the position means competing on price
against shops that have social proof, which is the one fight this shop should
not pick.

---

## What the code already handles, so you do not have to think about it

- `sameAs` on every page, from one array
- The review policy in `/ai.txt` and `/api/facts.json`, which changes
  automatically the moment a review profile is added
- `outbound_gbp` and `outbound_instagram` analytics events, already firing
- The UTM in item 1 is respected by GA4 without configuration
- The video slot, the testimonial schema, and the vCard NAP
- Entity disambiguation from the inactive `GREEN HARDWOOD FLOORING INC.`
  (corporation number 784550-2), on every page and every machine surface
