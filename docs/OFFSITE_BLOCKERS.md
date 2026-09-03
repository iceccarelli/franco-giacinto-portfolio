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

---

## 11. Decide which installation number is right — **a decision, not a task**

This one is not off-site work. It is a business call that only the shop can
make, and it is here because it is the only thing on the site where two of our
own published numbers disagree.

`data/services.ts` publishes installation at **From $11–$22 / sq ft
installed**. The estimator's default configuration — solid white oak, site
finished matte — prices at roughly **$16–$24 / sq ft** once a municipality's
multiplier is applied. So the top of the computed band sits above the top of
the published range in every one of the 32 municipalities, and in Barrie it is
$24.42 against a published ceiling of $22.

Nothing is broken and nothing is dishonest. The two numbers measure different
things: the published range is the envelope across every specification (the
estimator returns $11.50–$16.31 / sq ft for engineered board, prefinished, in
Toronto — the bottom of it), and the table on each city page prices one
specification, which is not the cheap one. The city pages now say exactly that
in the paragraph under the table.

But a reader comparing the service page with the city page sees $22 and $24.42,
and so does an answer engine. Two ways to close it:

1. **The published ceiling is low.** Solid white oak, site-finished, in
   Oakville genuinely costs more than $22 / sq ft. Raise the published range to
   about $11–$25 in `data/services.ts` and the gap disappears.
2. **The estimator's default is too rich.** Change `emptyEstimate()` in
   `data/estimate.ts` to default to engineered/prefinished, and the tables land
   inside the published range.

Either is a one-line change; picking one is setting this shop's prices, which
is not a decision the code should make on its own. Until it is picked,
`tests/city-depth.test.ts` bounds the drift — no computed band may exceed its
published ceiling by more than 15%, none may ever fall *below* the published
floor, and only installation and decking may sit outside their range at all.
If the estimator or the published bands move and a third service drifts out,
the build fails and this decision comes back to the surface.

---

## 12. Twelve photographs — **the highest-value hour you can spend on this site**

Not a task for the code. A phone, twelve pictures, and the discipline to take
the first one before the crew starts.

Every image in `public/images` is AI-generated. The site now has a before/after
slider that moves on its own so the comparison is actually seen — and exactly
one pair to put in it, whose two frames are not even the same room (the
"before" is a bare floor by a window, the "after" is a hallway with a
staircase). It renders labelled as a rendering, because a manufactured
before-and-after is not a weaker version of proof, it is a fabrication.

`data/comparisons.ts` has a slot ready for each of the six services. Fill one
and it goes live at the next deploy with `verified: true`, the disclaimer
disappears, and the slider starts doing the job it was built for.

### The shot list

Two photographs per service, six services:

| Service | Before | After |
| --- | --- | --- |
| Sanding & refinishing | the grey, worn floor, before the sander comes in | the same floor, finished |
| New hardwood install | the bare subfloor | the finished field |
| Hardwood stairs | the carpeted flight | the finished flight |
| Hardwood railings | the original rail | the replacement |
| Repair & restoration | the damage | the same square metre, repaired |
| Deck / porch | the weathered deck | the rebuilt one |

### The only four rules that matter

1. **Same position.** Stand in the same spot for both frames. Mark it with tape
   if you have to. A before and after from two different places is not a
   comparison, it is two photographs.
2. **Same height and angle.** Chest height, phone level. Do not crouch for one
   and stand for the other.
3. **Same light.** Same time of day, same lights on or off. A dim before and a
   sunlit after is the oldest trick in home improvement and everyone can smell
   it.
4. **Take the before even when the job looks boring.** You cannot go back for
   it. The before frame is the one that is always missing, on every trade site,
   which is exactly why having it is worth something.

Wide enough to show the room, not so wide the floor is a sliver. Landscape.
No filter, no straightening, no HDR.

### Why this outranks everything else on this list

A prospective client deciding between three quotes at $18,000 is looking for a
reason to trust one of them. A real before-and-after of a real floor — with the
awkward radiator and the cat bowl still in the frame — is the most convincing
thing a flooring company can show, and it is the one thing a competitor cannot
copy, buy, or fake. It costs nothing. It needs no photographer.

Repair is the one to shoot first: the whole claim of that service is that the
repair disappears, and a slider is the only way to prove it.

---

## 13. Photograph the machines — the renders are placeholders, not the answer

> **Updated in Stage 14.** Sixty-four commissioned renderings now illustrate the
> ten machine classes and six defects, four renditions each, cross-fading. They
> are labelled on every page as illustrations of a machine *class*, and
> `tests/equipment.test.ts` fails the build if that label disappears.
>
> **Nothing below is closed by them.** The renders make the section look
> finished; only real photographs make it *true*. And none of them may be
> uploaded to the Google Business Profile — Google prohibits stock and
> off-location imagery, and a photo violation on a new profile is a suspension.

### The original blocker, unchanged

`/equipment` and its ten pages went live in Stage 13. They describe **what the
work requires**, not what is parked at Sterling Road, and every page says so in
plain words. That is honest and it is defensible, but it is the weaker version
of what this section can be.

The stronger version is the same pages with a photograph of the actual machine
at the top of each one, and the disclaimer replaced by an inventory. Nobody in
this market publishes that. It is unfaked and unfakeable, and it converts a
specification into evidence.

### The shot list — ten frames, one afternoon in the shop

| # | Frame | Why |
| --- | --- | --- |
| 1 | The belt machine, whole, on a floor | The single most recognisable object in the trade |
| 2 | The edger, in hand or on the floor | Proves the perimeter is not an afterthought |
| 3 | The multi-disc / buffer with a pad fitted | The blend step nobody photographs |
| 4 | The extractor, hose connected to a machine | This is the "dust-free" claim, physically |
| 5 | Zip wall or a doorway seal on a real job | Containment as a system, not an accessory |
| 6 | A moisture meter reading a subfloor, screen legible | The number in the frame is the whole point |
| 7 | The flooring nailer mid-row | The install claim |
| 8 | A notched trowel and a spread bed of adhesive | The trowel notch is the specification |
| 9 | The stair bench with a tread on it | Millwork, not carpentry |
| 10 | A counterbored newel bolt before it is plugged | The hidden fixing, visible once |

Same four rules as blocker #12: real, unfiltered, landscape, taken on a job or
in the shop. A machine on a clean white background looks like a catalogue and
will be read as one.

### What happens in the code when they arrive

The pages already have the slot. Delivering the ten files means:

1. Each `Equipment` entry gains `image` and `imageAlt`.
2. The "What this page is" panel changes from *specification* to *inventory*,
   and the honesty note in `tests/equipment.test.ts` is updated in the same
   commit — not before, and not after.
3. `/llms.txt` and `/llms-full.txt` drop the "not an inventory" caveat, which
   is generated from the same source.

Until then the caveat stays, and the test enforces it.
