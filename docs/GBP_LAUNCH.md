# Google Business Profile — claim runbook

Blocker #1 in `OFFSITE_BLOCKERS.md`, with everything the profile needs
pre-written from this repository's own data so nothing has to be retyped.

**Retyping is the risk.** A single differing character between the profile and
the website — "Unit 6" versus "#6", "Toronto, ON" versus "Toronto, Ontario" —
creates a second entity in Google's index and splits the signal that took this
whole build to accumulate. Copy from this file. Do not paraphrase.

---

## Verdict: the website is ready. Three things are not, and two of them are traps.

The site side is done and measurable: the NAP is one string enforced by a test,
393 pages carry consistent structured data, the entity disambiguation is in
crawlable HTML, and `company.reviews` is `null` so no rating is asserted that
Google would have to corroborate. Nothing on the website will contradict the
profile.

What is not ready is off the website:

| | Status |
| --- | --- |
| Website, NAP, schema, hours, services | **Ready** |
| Photographs for the profile | **Blocked — see the trap below** |
| Verification (likely video) | Needs preparation at Sterling Road |
| Reviews | Zero. Correct, and the reason to claim now rather than later |

---

## Trap 1 — do not upload this site's photographs to the profile

Every image in `public/images` is a commissioned AI rendering. Google's photo
guidelines require images to represent the actual business, and state that
"stock photos and images from other locations aren't allowed".

An AI rendering of a room that does not exist is not a photograph of this
business. Uploading a set of them to a brand-new, unverified profile is the
fastest route to a suspension, and a suspended profile is far harder to recover
than an unclaimed one is to create.

**Upload only real photographs taken at Sterling Road or on real jobs.** A
handful of honest phone pictures — the workshop, the machines, the van, a
finished stair — outperforms a gallery of renderings that gets the profile
pulled. This is the same twelve-photograph shot list as blocker #12, and it is
now blocking two things instead of one.

## Trap 2 — do not put keywords in the business name

The name field takes the real-world business name and nothing else. "Green
Hardwood Flooring & Stairs Toronto" is a guideline violation and one of the
most common causes of suspension, precisely because it works until it doesn't.

**Use exactly:**

```
Green Hardwood
```

If the sign on the door at Unit 6 says "Green Hardwood Ltd.", use that instead
— the rule is that the profile name matches the real-world name as it is
signed. Match the sign, not the ambition.

---

## Before you start: check for an existing listing

Search Google Maps for the address and for "Green Hardwood Toronto". Unverified
listings get auto-generated from other data sources, and claiming an existing
one is correct where creating a duplicate is a guideline violation.

Also worth knowing: there is an unrelated inactive federal corporation named
GREEN HARDWOOD FLOORING INC. (corporation number 784550-2). If anything under
that name appears at a different address, it is not yours and must not be
claimed or merged.

---

## The profile, field by field

### Name
```
Green Hardwood
```

### Address
```
88 Sterling Road, Unit 6
Toronto, ON M6R 2B2
Canada
```

**Decide first: storefront or service-area business.**

Show the address if customers can actually come to Unit 6 by appointment to
look at samples and see the stair work — which is what `/showroom` and the
stair studio on this site imply. A visible address at a real commercial
building in the Junction Triangle is a significant local-pack advantage and
should be kept if it is true.

Hide the address and run as a pure service-area business only if nobody
receives visitors there. Google is explicit that a business run from a
residence must hide its address; a commercial unit that receives clients by
appointment need not.

### Phone
```
(416) 847-3366
```
This must be a number that rings and can take a verification call.

### Website
```
https://greenhardwood.ca
```
Apex, https, no trailing slash. The www version 308s to it, which is correct.

### Hours
```
Monday    08:00 – 18:00
Tuesday   08:00 – 18:00
Wednesday 08:00 – 18:00
Thursday  08:00 – 18:00
Friday    08:00 – 18:00
Saturday  09:00 – 16:00
Sunday    Closed  (the site says "by appointment"; GBP has no such state —
                   leave it closed and say "Sunday by appointment" in the
                   description rather than publishing hours nobody staffs)
```

### Categories

Primary: **Flooring contractor**

Secondaries, in this order of value to this business — add only those the
picker actually offers, and never more than fits:

1. Wood floor refinishing service
2. Flooring store *(only if samples really are available at Unit 6)*
3. Carpenter
4. Deck builder
5. Contractor

The primary category carries most of the ranking weight. "Flooring contractor"
is the right primary even though stairs are the wedge, because it is what
people search and what the shop mostly does. The stair positioning is won on
the website, not in the category picker.

### Service areas — the core 20

Google caps this at **20 areas**, and this shop's core tier is exactly 20. That
is not a coincidence to engineer around; it is the list of municipalities where
`data/areas.ts` says a free on-site measure is offered, which is precisely what
a service area should mean.

```
Toronto, Etobicoke, North York, Scarborough, Mississauga, Brampton, Vaughan,
Markham, Richmond Hill, Oakville, Burlington, Milton, East York, Pickering,
Ajax, Whitby, Aurora, Newmarket, King, Whitchurch-Stouffville
```

The other twelve on the website — Oshawa, Clarington, Caledon, Halton Hills,
Hamilton, Ancaster, Dundas, Bradford West Gwillimbury, Barrie, Innisfil,
Orangeville, Guelph — stay **off** the profile. The site already says they are
travelled to for packages rather than covered for any job, and listing a
two-hour drive as a service area weakens the relevance of the twenty that
matter.

### Description (735 characters — under the 750 limit)

```
Green Hardwood is a Toronto hardwood flooring company that treats the floor,
the stair and the rail as one system. We install solid and engineered hardwood,
sand and refinish existing floors under dust containment, convert carpeted
stairs to hardwood, and build railings to Ontario Building Code — from one shop,
under one warranty, with no subcontracted stair.

Fifteen years on GTA floors. The shop was incorporated as Green Hardwood Ltd. in
2022 so the stair and the floor share one warranty. Free on-site measure across
Toronto and the GTA; a firm number follows a moisture reading, never a phone
call. Sunday by appointment.

Published 2026 price bands and a job estimator: https://greenhardwood.ca
```

### Services

Add all eight with the published bands. These are the numbers on the website
and on `/api/facts.json`; keeping them identical is the point.

| Service | Price |
| --- | --- |
| Hardwood Floor Installation | From $11–$22 / sq ft installed |
| Hardwood Stairs | From $380–$850 per step, installed |
| Hardwood Railings | From $180–$420 / linear foot |
| Hardwood Sanding, Finishing & Refinishing | From $4.50–$8.50 / sq ft |
| Hardwood Repairs & Restoration | From $650 minimum · $18–$35 / sq ft affected |
| Hardwood Decks | From $28–$48 / sq ft for ipe-class decks |
| Custom Inlays & Patterns | Quoted per design · medallions from $2,800 |
| Commercial Hardwood | Quoted per project |

### Attributes worth setting

Free estimates · Appointment required · LGBTQ+ friendly if true · Onsite
services · Language(s) spoken. Set only what is true.

### Opening date

Use **2022**, the incorporation year of Green Hardwood Ltd. Do **not** enter a
date derived from the craftsman's fifteen years, and do not use anything
associated with GREEN HARDWOOD FLOORING INC. The website is careful about this
distinction on every surface and the profile must not undo it.

---

## Verification

A commercial unit with a new profile will most likely get **video
verification**: a single unbroken recording, made on the phone, showing three
things in one take.

1. **Location proof** — the street, the building number, the unit, and
   permanent signage if it exists. If there is no sign on Unit 6, this is the
   single highest-value thing to fix before recording.
2. **Equipment and business proof** — the workshop with the machines in it,
   branded material, the van, tools with the trade obviously being practised.
   A stair under construction on horses is ideal.
3. **Management proof** — going into the working space, opening something only
   a manager would open, showing paperwork with the business name on it.

Have ready before recording: the sign, an invoice or letterhead with the NAP,
the WSIB clearance, the liability certificate, and the machines. Do not stop
recording between the three parts.

If it comes back as a **postcard**, that lands at Unit 6 and needs somebody to
collect it within the window.

---

## The first week after verification

1. **Upload only real photographs.** See trap 1. Five honest ones beat fifty
   renderings, and fifty renderings can lose the profile.
2. **Ask the last 25 finished clients for a review.** Offer nothing in return —
   incentivised reviews are a violation and a filtering trigger. Blocker #6 has
   the wording.
3. **The moment there is a profile URL**, put it in `data/profiles.ts` under
   `google-business-profile`. That one edit propagates it to the schema
   `sameAs`, `/ai.txt`, `/llms.txt`, `/api/facts.json` and the footer at the
   next build. There is no second place to paste it.
4. **When Google shows a rating**, set `company.reviews` to the count and
   average it actually displays. `lib/seo.ts` emits nothing until that field is
   set, and `tests/seo.test.ts` fails the build if a rating ever appears
   without it. That gate exists because this site previously shipped an
   invented 4.9 across 358 pages.

Do not skip step 3 or 4 by hand-editing a component. The single-source rule is
what has kept the NAP consistent across 393 pages, and it is the same rule that
will keep the rating honest.

---

## What claiming this unlocks

Map Pack eligibility is not a ranking factor a website can influence. It is a
profile you either have or do not have. Right now this shop cannot appear in
the local pack for `hardwood stairs Toronto` at any position, no matter how
good the site gets — and the site is now very good.

Everything else in the program has been built so that the day the profile
exists, the corroboration is already in place: consistent NAP, published bands
the profile repeats, 32 municipalities of local content, a stair wedge nobody
else in the GTA is claiming, and no fabricated signal anywhere for Google to
catch.

The website is ready. The profile is the last gate, and it is yours.
