import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { Button } from "@/components/ui/button";
import { company } from "@/data/company";
import { breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Water-Damaged Hardwood",
  description:
    "Emergency hardwood floor repair in Toronto and the GTA after floods, dishwasher leaks, and ice-maker lines. Moisture readings first. Board replacement and blend refinish.",
  alternates: { canonical: "/emergency" },
  openGraph: {
    title: "Water-Damaged Hardwood | Green Hardwood — Toronto & GTA",
    description:
      "Emergency hardwood floor repair in Toronto and the GTA after floods, dishwasher leaks, and ice-maker lines. Moisture readings first. Board replacement and blend refinish.",
    url: "/emergency",
  },
};

export default function EmergencyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Water-damaged hardwood", path: "/emergency" },
        ])}
      />
      <section className="border-b border-border bg-primary text-primary-fg">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <p className="text-xs tracking-[0.18em] text-primary-fg/60 uppercase">Water damage</p>
          <h1 className="mt-3 font-display text-4xl leading-[1.08] sm:text-5xl">
            Stop the water. Then call us. Do not rent a drum sander tonight.
          </h1>
          <p className="mt-4 text-lg text-primary-fg/75">
            Ice-maker lines, second-floor baths, dishwashers, and spring seepage. We measure
            moisture, isolate the wet zone, and replace boards so the seam disappears — or we tell
            you the floor is finished and quote replacement.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="invert" size="lg">
              <a href={`tel:${company.phone}`}>Call {company.phoneDisplay}</a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-primary-fg/20 text-primary-fg hover:bg-primary-fg/10"
            >
              <Link href="/estimate">Send photos</Link>
            </Button>
          </div>
        </div>
      </section>
      <article className="mx-auto max-w-3xl space-y-6 px-4 py-12 sm:px-6">
        <h2 className="font-display text-2xl">Do this now</h2>
        <ol className="list-decimal space-y-2 pl-5 text-muted">
          <li>Stop the source. Shut the valve. Call a plumber if you do not know which valve.</li>
          <li>Pull rugs and wet underpad. Air the room. Do not blast heat at cupped boards.</li>
          <li>Photograph standing water, the ceiling below, and the edges of the field.</li>
          <li>Call us before anyone sands. Sanding a wet floor is how you buy it twice.</li>
        </ol>
        <h2 className="font-display text-2xl">What we will tell you on site</h2>
        <p className="text-muted">
          Moisture readings, which boards have to come out, whether the rest can dry and be sanded,
          and a number that insurance can actually close. Matching 15-year-old red oak is a craft
          problem, not a Home Depot problem.
        </p>
      </article>
    </>
  );
}
