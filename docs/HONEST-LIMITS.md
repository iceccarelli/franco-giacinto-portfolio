# Honest limits

You cannot own every hardwood query on the internet from one repo.

You can own commercial intent in the GTA for hardwood stairs, stair retreads, hardwood installation, and the railings that belong to those stairs.

You cannot own national big-box queries, vinyl, laminate, every Ontario neighbourhood, or “best company” without Google reviews.

The city list is now 32, twelve of which are marked `extended` — outside the core radius, worth the drive only on larger work. That tier exists so the site does not promise a free measure in Barrie that nobody intends to drive to. **If Green Hardwood does not in fact travel to a listed town, delete it from `data/areas.ts`.** A page ranking for a job you will not take is worse than no page.

Doorway domains and spun city pages produce the opposite of authority.

`data/company.ts` still lists 1,200 floors, Bona, NWFA, a Sterling Road studio, and (416) 847-3366. If any of that is not true, fix it before you scale URLs.

The live host is still franco-giacinto-portfolio.vercel.app. Answer engines will treat that as a preview brand until greenhardwood.ca is attached. `lib/site-url.ts` means the cutover needs no code change — but until it happens, every canonical names a host that is not the brand.

Leads are still captured to the server log, not emailed. `RESEND_API_KEY` is unset. Ranking for a query you cannot answer the phone for is worse than not ranking.

The photography is AI-generated. 181 pages now attach specific local claims to it. One real job photo is worth more than the whole set.

`aggregateRating` in the LocalBusiness schema is computed from the testimonial count, not from collected reviews. Either collect real reviews or remove it — a rating Google cannot corroborate is a liability, not an asset.
