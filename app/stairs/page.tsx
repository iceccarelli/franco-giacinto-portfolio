import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { StairStudio } from "@/components/tools/stair-studio";
import { Button } from "@/components/ui/button";
import { projects } from "@/data/projects";
import { breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Hardwood Stair Studio & Ontario Code Checker",
  description:
    "Design a hardwood flight, price it, and check it against Ontario stair code. Oak treads over carpet, box stairs, and walnut features across the GTA.",
  alternates: { canonical: "/stairs" },
  openGraph: {
    title: "Hardwood Stair Studio & Ontario Code Checker | Green Hardwood",
    description:
      "Custom hardwood stairs in Toronto and the GTA: oak treads over carpet, box stairs, walnut feature flights, and railings that pass Ontario Building Code. Build a flight in the stair studio.",
    url: "/stairs",
  },
};

export default function StairsHub() {
  const stairJobs = projects.filter((p) => p.category === "stairs" || p.category === "custom");

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Hardwood stairs", path: "/stairs" },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "Convert carpeted stairs to hardwood in the Greater Toronto Area",
          description:
            "How Green Hardwood replaces builder-grade carpet stairs with solid hardwood treads, matched risers, and a code-compliant railing.",
          totalTime: "P5D",
          estimatedCost: {
            "@type": "MonetaryAmount",
            currency: "CAD",
            value: "5000-11000",
          },
          step: [
            {
              "@type": "HowToStep",
              name: "Measure rise, run, and moisture",
              text: "We measure the existing flight against Ontario Building Code and inspect stringers before quoting a firm number.",
            },
            {
              "@type": "HowToStep",
              name: "Pull carpet and inspect structure",
              text: "Carpet and MDF nosings come off. Anything that flexes is sistered. Open sides get returned treads, not leftover planks.",
            },
            {
              "@type": "HowToStep",
              name: "Install treads, risers, and nosings",
              text: "Solid oak, maple, or walnut treads in the same species and finish as the floor. One stain formula.",
            },
            {
              "@type": "HowToStep",
              name: "Through-bolt the railing",
              text: "Graspable handrail, guard height, and newels into structure — not into trim — then a written cure schedule.",
            },
          ],
        }}
      />
      <section className="border-b border-border bg-bg-warm">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="text-xs tracking-[0.18em] text-accent uppercase">
              Hardwood stairs · Toronto & GTA
            </p>
            <h1 className="mt-3 font-display text-4xl leading-[1.08] sm:text-5xl">
              The stair is the product. The floor is the field it sits in.
            </h1>
            <p className="mt-4 text-lg text-muted">
              Carpet-to-oak conversions, walnut feature flights, box stairs, open risers, and
              railings that pass inspection. Most GTA flooring companies subcontract this. We mill
              it.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/estimate">Estimate a stair</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={`/services/${"hardwood-railings"}`}>Railings</Link>
              </Button>
            </div>
          </div>
          <img
            src="/images/stair-studio.jpg"
            alt="Custom white oak staircase with black steel balusters and a graspable oak handrail in a Toronto home."
            className="aspect-[3/2] w-full rounded-xl object-cover shadow-[var(--shadow-card)]"
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="font-display text-3xl sm:text-4xl">
          Build the flight. Read the code. Get a range.
        </h2>
        <p className="mt-3 max-w-2xl text-muted">
          No GTA flooring brochure does this. Change species, step count, and railing. Then see
          whether the geometry would typically pass a dwelling-stair inspection.
        </p>
        <div className="mt-8">
          <StairStudio />
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="font-display text-3xl">Jobs we keep getting called for</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Builder carpet, Vaughan to Milton",
                body: "Pull the carpet. Sister the flex. Solid oak box treads with returned ends on the open side. Rail that a toddler can actually hold.",
              },
              {
                title: "Walnut feature, Oakville and Forest Hill",
                body: "The foyer is the house. Contrast walnut against a white-oak field, iron balusters, hardwax oil on the rail so it can be repaired without resanding three storeys.",
              },
              {
                title: "Failed inspection",
                body: "A 2x6 cap, a short guard, a nosing that trips. We redraw to Part 9, then we build. Pretty that fails is not a stair.",
              },
            ].map((item) => (
              <article
                key={item.title}
                className="rounded-xl bg-bg p-6 shadow-[var(--shadow-card)]"
              >
                <h3 className="font-display text-xl">{item.title}</h3>
                <p className="mt-2 text-sm text-muted">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {stairJobs.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="font-display text-3xl">Stairs you can inspect</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {stairJobs.map((p) => (
              <article
                key={p.slug}
                className="overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-card)]"
              >
                <img
                  src={p.image}
                  alt={p.imageAlt}
                  className="aspect-[16/10] w-full object-cover"
                />
                <div className="p-5">
                  <h3 className="font-display text-xl">{p.title}</h3>
                  <p className="mt-1 text-sm text-muted">{p.summary}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
