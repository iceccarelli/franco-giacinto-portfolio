import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { CoverageDisclosure, CoverageList, CoverageMap } from "@/components/map/coverage-map";

export const metadata: Metadata = {
  title: "Hardwood Flooring Service Areas",
  description:
    "Hardwood floors, stairs, and railings across Toronto, Mississauga, Oakville, Vaughan, Markham, and the rest of the GTA.",
  alternates: { canonical: "/areas" },
  openGraph: {
    title: "Hardwood Flooring Service Areas | Green Hardwood",
    description:
      "Hardwood floors, stairs, and railings across Toronto, Mississauga, Oakville, Vaughan, Markham, and the rest of the GTA.",
    url: "/areas",
  },
};

/**
 * ISR, one hour.
 *
 * Measured on production before this change:
 *   cache-control: public, max-age=0, must-revalidate
 *
 * That is the Next default for a fully static page, and it means the edge
 * revalidates against the origin far more eagerly than a page built from
 * `data/` at deploy time ever needs to. `revalidate` makes Vercel serve
 * `s-maxage=3600, stale-while-revalidate` instead: the CDN answers from cache
 * for an hour and refreshes in the background, which is the Stage 1 cache
 * target and one less origin hit on every crawl.
 */
export const revalidate = 3600;

export default function AreasIndex() {
  return (
    <>
      <PageHero
        kicker="Service areas"
        title="Toronto and the GTA, city by city — because a King West slab is not a Forest Hill joist."
        lede="Local pages exist so homeowners, builders, and AI agents can see the housing stock we actually work in, not a dumped list of suburbs."
      />
      <div className="mx-auto max-w-6xl space-y-12 px-4 py-12 sm:py-16 sm:px-6">
        {/*
          The coverage map.

          Pins are municipalities we serve, positioned at their real centroids
          and carrying the locally-adjusted band — NOT a record of past jobs.
          Nine of the portfolio entries carry AI-generated photography (see
          docs/HONEST-LIMITS.md); placing those on a map would put invented
          work at real addresses, which is checkable and indefensible.

          The map is aria-hidden and loads only when scrolled to. Everything
          it shows is also in the lists below, as server-rendered HTML, so a
          crawler or an assistant reads the full service area either way.
        */}
        <section>
          <h2 className="font-display text-3xl">Where we work</h2>
          <CoverageDisclosure />
          <div className="mt-6">
            <CoverageMap />
          </div>
        </section>

        {/*
          One list, the same data the map is drawn from.

          The two hand-rolled sections that were here showed a name and a
          blurb; the map knew the distance, the job types and the local band
          and none of that was in the HTML. A crawler or an assistant would
          have read half the page. CoverageList renders everything the pins
          carry, so the map is genuinely decoration.
        */}
        <CoverageList />
      </div>
    </>
  );
}
