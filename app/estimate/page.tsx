import type { Metadata } from "next";
import { Photo } from "@/components/photo";
import { EstimateFlow } from "@/components/estimate/estimate-flow";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Hardwood Estimate",
  description:
    "Price a 2026 GTA hardwood floor, stair, railing, refinish, or deck — then book a free on-site measure with Green Hardwood.",
  alternates: { canonical: "/estimate" },
  openGraph: {
    title: "Hardwood Estimate | Green Hardwood",
    description:
      "Price a 2026 GTA hardwood floor, stair, railing, refinish, or deck — then book a free on-site measure with Green Hardwood.",
    url: "/estimate",
  },
};

/**
 * Stays prerendered and edge-cached. The `?service=` / `?city=` prefill is
 * resolved inside EstimateFlow on the client, because resolving it here would
 * make this a per-request function render — which the site audit flagged, and
 * which is the wrong trade on the page every conversion path ends at.
 *
 * The canonical is pinned to the bare path above, so `/estimate?city=vaughan`
 * never becomes a second indexable URL competing with `/estimate`.
 */
export const revalidate = 3600;

export default function EstimatePage() {
  return (
    <>
      <PageHero
        kicker="Estimate"
        title="City, service, size. A 2026 GTA band in about twenty seconds."
        lede="Calibrated to 2026 Greater Toronto labour and mill pricing. We do not lock a number until we have read the moisture in your subfloor. No spam, no vinyl pitch."
      />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16 sm:px-6">
        <EstimateFlow />

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl">What happens next</h2>
            <ol className="mt-4 space-y-3 text-muted">
              <li className="flex gap-3">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-fg">
                  1
                </span>
                <span>
                  A project lead calls or texts within one business day. Not a call centre — the
                  person who will be on site.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-fg">
                  2
                </span>
                <span>
                  Free on-site measure inside the core service area, including a moisture reading of
                  the subfloor. That reading is what turns the band into a number.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-fg">
                  3
                </span>
                <span>
                  A written scope and a firm price. Floors, stairs and railings on one document,
                  under one warranty.
                </span>
              </li>
            </ol>
          </div>
          <Photo
            src="/images/workshop.jpg"
            alt="Green Hardwood workshop with racks of oak, walnut, and maple planks and stain sample boards."
            ratio="4/3"
            slot="half"
            className="h-fit rounded-xl shadow-[var(--shadow-card)]"
          />
        </div>
      </div>
    </>
  );
}
