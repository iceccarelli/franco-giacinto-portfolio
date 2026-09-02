import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { localPricing, nearestServed, coverage } from "@/data/coverage";
import { tierNote, type City } from "@/data/areas";
import { company } from "@/data/company";

/**
 * The computed half of a city hub.
 *
 * These three blocks exist because the 32 hub pages — the ones that rank for
 * "hardwood flooring in {city}", the highest commercial-intent query this shop
 * has — were rendering 308 to 420 words each. Thin pages on high-intent
 * queries lose to thicker ones, and no amount of technical SEO compensates.
 *
 * What they are NOT is 32 paraphrases of the same three paragraphs with the
 * town name swapped, which is the standard fix and the reason "doorway page"
 * is a manual-action category. Every figure here is computed from this
 * municipality's own multiplier, its own centroid and the catalogue this shop
 * actually publishes. A reader can put the same inputs into /estimate and get
 * the same number back, which is the test any local claim should have to pass.
 */

const fmt = (n: number) => `$${n.toLocaleString("en-CA")}`;
const rate = (n: number) => (n >= 100 ? Math.round(n).toLocaleString("en-CA") : n.toFixed(2));

/**
 * Every priceable service, banded for this municipality.
 *
 * Six of eight services. Custom inlays and commercial fit-outs are absent on
 * purpose: an inlay is quoted from a drawing and a fit-out from a phasing
 * plan, and inventing a sq-ft band for either would be the one dishonest cell
 * in an otherwise checkable table.
 */
export function LocalPriceTable({ city }: { city: City }) {
  const rows = localPricing(city.slug);
  const pin = coverage.find((p) => p.city.slug === city.slug);

  return (
    <section className="min-w-0">
      <h2 className="font-display text-3xl">What hardwood costs in {city.name}</h2>
      <p className="mt-3 text-muted">
        2026 bands, computed with {city.name}&rsquo;s own labour, access and travel multiplier —
        not a GTA average with a place name on it. HST is extra and a firm number follows a
        moisture reading on site.
        {pin && pin.city.tier === "extended" && (
          <> The drive is priced in: {pin.distanceKm} km each way is a real cost, not a rounding.</>
        )}
      </p>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[30rem] border-collapse text-left text-sm">
          <caption className="sr-only">
            Indicative 2026 price bands for hardwood services in {city.name}
          </caption>
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="py-2 pr-5 font-medium">
                Service &amp; specification
              </th>
              <th scope="col" className="py-2 pr-5 font-medium whitespace-nowrap">
                {city.name} band
              </th>
              <th scope="col" className="py-2 pr-5 font-medium whitespace-nowrap">
                Per unit
              </th>
              <th scope="col" className="py-2 font-medium whitespace-nowrap">
                On site
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.kind} className="border-b border-border/60 align-top">
                {/*
                  The basis sits under the service name rather than in a column
                  of its own. As a fifth column it wrapped five lines deep and
                  squeezed the timeline into an ellipsis; the specification is
                  a qualifier on the service, not a peer of the price.
                */}
                <th scope="row" className="max-w-[15rem] py-3 pr-5 font-normal">
                  <Link
                    href={`/services/${row.serviceSlug}/${city.slug}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {row.label}
                  </Link>
                  <span className="mt-0.5 block text-xs text-muted">{row.basis}</span>
                </th>
                <td className="py-3 pr-5 tabular-nums whitespace-nowrap">
                  {fmt(row.low)} – {fmt(row.high)}
                </td>
                <td className="py-3 pr-5 text-muted tabular-nums whitespace-nowrap">
                  ${rate(row.perUnitLow)}–${rate(row.perUnitHigh)} / {row.unit}
                </td>
                <td className="py-3 text-muted whitespace-nowrap">{row.timeline}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/*
        Said out loud rather than left for a reader to trip over.

        The per-unit column is directly comparable with the "From $x–$y" range
        on each service page, and for installation it runs through the top of
        that range and past it. Both numbers are true and they measure
        different things — the published range is the envelope across every
        specification, this row is one specification and not the cheap one.
        See bandVsPublished() in data/coverage.ts for the decision that
        belongs to the shop rather than to this component.
      */}
      <p className="mt-4 text-sm text-muted">
        The per-unit column is the same band divided by the quantity, so it can be checked against
        the range on each service page. Those ranges span every specification we install: the
        bottom is engineered board, prefinished; this table prices solid white oak with a
        site-applied finish, which is the upper half of the range and, in the towns furthest from
        the shop, a little above it. A budget specification in {city.name} lands lower — the
        estimator will show you exactly how much lower.
      </p>

      <p className="mt-4 text-sm text-muted">
        Custom inlays and commercial fit-outs are not in the table because neither is priceable
        from a square-foot box — an inlay is quoted from a drawing, a fit-out from a phasing plan.{" "}
        <Link href="/estimate" className="text-primary hover:underline">
          Configure your own job
        </Link>{" "}
        to move any of these bands with species, pattern and finish.
      </p>
    </section>
  );
}

/**
 * What this shop will actually take on here — read off the coverage tier, so
 * the list shortens by itself in a town we only travel to for packages. The
 * page cannot promise a single-room repair in Barrie, because the data does
 * not offer one.
 */
export function JobTypesHere({ city }: { city: City }) {
  const pin = coverage.find((p) => p.city.slug === city.slug);
  if (!pin) return null;

  return (
    <section>
      <h2 className="font-display text-3xl">What we take on in {city.name}</h2>
      <p className="mt-3 text-muted">{tierNote(city)}</p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {pin.jobTypes.map((job) => (
          <li key={job.slug}>
            <Link
              href={`/catalog/${job.slug}`}
              className="group flex h-full flex-col rounded-xl border border-border bg-surface p-4 transition-shadow hover:shadow-[var(--shadow-card)]"
            >
              <span className="font-medium group-hover:text-primary">{job.name}</span>
              <span className="mt-1 text-sm text-muted">{job.summary}</span>
            </Link>
          </li>
        ))}
      </ul>
      {city.tier === "extended" && (
        <p className="mt-4 text-sm text-muted">
          Five of the twelve job types are missing from this list on purpose. Driving{" "}
          {pin.distanceKm} km for a single-room repair is not a service, it is a promise nobody
          intends to keep — so we do not list it here.
        </p>
      )}
    </section>
  );
}

/**
 * The neighbours.
 *
 * For a reader it answers the question behind the question — "you're in
 * Vaughan, do you come to Maple" — and for the site it is a real geographic
 * link mesh. Before this, the 32 hubs linked upward to /areas and nowhere
 * sideways, so every one of them was a leaf.
 */
export function NearbyMunicipalities({ city }: { city: City }) {
  const neighbours = nearestServed(city.slug, 6);
  const pin = coverage.find((p) => p.city.slug === city.slug);
  if (neighbours.length === 0) return null;

  return (
    <section>
      <h2 className="font-display text-3xl">Around {city.name}</h2>
      <p className="mt-3 text-muted">
        {pin && (
          <>
            {city.name} is {pin.distanceKm} km from the workshop at {company.address.line1}, and{" "}
          </>
        )}
        the same crew covers these on the way in and out. Distances are centre to centre — a way
        to order the list, not a drive time.
      </p>
      <ul className="mt-5 flex flex-wrap gap-2">
        {neighbours.map(({ pin: n, km }) => (
          <li key={n.city.slug}>
            <Link
              href={`/areas/${n.city.slug}`}
              className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-2 text-sm transition-colors hover:bg-bg-warm"
            >
              <span className="font-medium">{n.city.name}</span>
              <span className="tabular-nums text-muted">{km} km</span>
              <ArrowUpRight
                className="size-3.5 opacity-40 transition-opacity group-hover:opacity-100"
                aria-hidden
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
