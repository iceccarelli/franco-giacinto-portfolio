import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { Button } from "@/components/ui/button";
import { company } from "@/data/company";
import { breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Workmanship Warranty",
  description:
    "Green Hardwood’s three-year workmanship warranty on hardwood installation and refinishing in Toronto and the GTA — what is covered, what is not, and how to call us.",
  alternates: { canonical: "/warranty" },
  openGraph: {
    title: "Workmanship Warranty | Green Hardwood",
    description:
      "Green Hardwood’s three-year workmanship warranty on hardwood installation and refinishing in Toronto and the GTA — what is covered, what is not, and how to call us.",
    url: "/warranty",
  },
};

export default function WarrantyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Warranty", path: "/warranty" },
        ])}
      />
      <section className="border-b border-border bg-bg-warm">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16 sm:px-6">
          <p className="text-xs tracking-[0.18em] text-accent uppercase">Warranty</p>
          <h1 className="mt-3 font-display text-4xl leading-[1.08] font-medium sm:text-5xl">
            Three years of workmanship. The mill keeps the material warranty.
          </h1>
          <p className="mt-4 text-lg text-muted">
            {company.warranty}. In writing, on the proposal.
          </p>
        </div>
      </section>
      <article className="mx-auto max-w-3xl space-y-8 px-4 py-12 sm:py-16 sm:px-6">
        <section>
          <h2 className="font-display text-2xl">What we cover</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-muted">
            <li>
              Installation defects: hollow spots we caused, failed adhesive from our spec, proud
              nails, open joints that are not seasonal movement.
            </li>
            <li>
              Finish defects from our application: peeling, clouding, contamination we introduced.
            </li>
            <li>
              Stair and railing workmanship: loose newels, rattle in balusters we set, nosings we
              installed.
            </li>
            <li>
              Callback labour to make it right, inside the three-year window, on work we performed.
            </li>
          </ul>
        </section>
        <section>
          <h2 className="font-display text-2xl">What we do not cover</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-muted">
            <li>
              Seasonal gaps from a house that runs 18% relative humidity in January. That is
              physics. We will tell you how to humidify.
            </li>
            <li>
              Floods, ice-maker lines, dogs, high heels, moving companies, and patio-door grit.
            </li>
            <li>
              Material defects — those sit with the mill, which is why we will not void their spec
              with the wrong glue on a wet slab.
            </li>
            <li>Work another trade did after we left, including painters taping a fresh finish.</li>
          </ul>
        </section>
        <section>
          <h2 className="font-display text-2xl">How to use it</h2>
          <p className="mt-3 text-muted">
            Call {company.phoneDisplay} or email {company.email} with the address and the date on
            the proposal. We would rather see a small problem in month four than a large one in
            month thirty-four.
          </p>
          <Button asChild className="mt-6">
            <Link href="/contact">Contact the shop</Link>
          </Button>
        </section>
      </article>
    </>
  );
}
