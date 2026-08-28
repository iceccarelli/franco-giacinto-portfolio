# Honest limits

You cannot own every hardwood query on the internet from one repo.

You can own commercial intent in the GTA for hardwood stairs, stair retreads, hardwood installation, and the railings that belong to those stairs.

You cannot own national big-box queries, vinyl, laminate, every Ontario neighbourhood, or “best company” without Google reviews.

The city list is now 32, twelve of which are marked `extended` — outside the core radius, worth the drive only on larger work. That tier exists so the site does not promise a free measure in Barrie that nobody intends to drive to. **If Green Hardwood does not in fact travel to a listed town, delete it from `data/areas.ts`.** A page ranking for a job you will not take is worse than no page.

Doorway domains and spun city pages produce the opposite of authority.

`data/company.ts` still lists 1,200 floors, Bona, NWFA, a Sterling Road studio, and (416) 847-3366. If any of that is not true, fix it before you scale URLs.

The live host is still franco-giacinto-portfolio.vercel.app. Answer engines will treat that as a preview brand until greenhardwood.ca is attached. `lib/site-url.ts` means the cutover needs no code change — but until it happens, every canonical names a host that is not the brand.

Leads are still captured to the server log, not emailed. `RESEND_API_KEY` is unset. Ranking for a query you cannot answer the phone for is worse than not ranking.

The photography is AI-generated. 358 pages now attach specific local claims to it. One real job photo is worth more than the whole set.

**Resolved.** `aggregateRating` used to be `ratingValue: "4.9"` with a review
count derived by multiplying the testimonial array by 18. Neither number had a
source, and it shipped on all 358 pages. It has been removed.

The site now emits no rating at all. `company.reviews` in `data/company.ts` is
`null`, and `reviewsLd()` in `lib/seo.ts` returns nothing while it stays that
way. `tests/agent-api.test.ts` fails the build if a rating ever appears without
that field being set.

**What remains for you:** the site has no stars because it has not earned any
yet. Claim the Google Business Profile for the Sterling Road address, ask
finished customers for reviews without offering them anything in return, then
set `company.reviews` to the count and average Google actually shows and add the
profile URL to `company.sameAs`. That is the only honest path to a rating, and
it is worth more than the fabricated one was — a corroborated 4.6 outranks an
invented 4.9, because the invented one risks a manual action that would strip
every rich result from the domain.

The testimonials still render on the page as ordinary copy. They are simply no
longer asserted to a search engine as verified review data.
