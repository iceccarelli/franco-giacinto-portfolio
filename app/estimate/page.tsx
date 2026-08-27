import type { Metadata } from "next";
import { QuoteEstimator } from "@/components/estimate/quote-estimator";
import { QuoteForm } from "@/components/estimate/quote-form";
import { PageHero } from "@/components/page-hero";
import { company } from "@/data/company";

export const metadata: Metadata = {
  title: "Hardwood Estimate",
  description:
    "Get a 2026 GTA hardwood flooring, stair, railing, refinishing, or deck estimate — then book a free on-site measure with Green Hardwood.",
  alternates: { canonical: "/estimate" },
  openGraph: {
    title: "Hardwood Estimate | Green Hardwood — Toronto & GTA",
    description:
      "Get a 2026 GTA hardwood flooring, stair, railing, refinishing, or deck estimate — then book a free on-site measure with Green Hardwood.",
    url: "/estimate",
  },
};

export default function EstimatePage() {
  return (
    <>
      <PageHero
        kicker="Estimate"
        title="A real range, then a site visit."
        lede="Calibrated to 2026 Greater Toronto labour and mill pricing. We do not lock a number until we have read the moisture in your subfloor."
      />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <QuoteEstimator />
        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl">Book the free measure</h2>
            <p className="mt-3 text-muted">
              We typically confirm within one business day. For water damage or a failed inspection,
              call {company.phoneDisplay}.
            </p>
            <div className="mt-6">
              <QuoteForm />
            </div>
          </div>
          <img
            src="/images/workshop.jpg"
            alt="Green Hardwood workshop with racks of oak, walnut, and maple planks and stain sample boards."
            className="h-fit w-full rounded-xl object-cover shadow-[var(--shadow-card)]"
          />
        </div>
      </div>
    </>
  );
}
