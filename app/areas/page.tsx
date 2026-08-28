import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { coreCities, extendedCities } from "@/data/areas";

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

export default function AreasIndex() {
  return (
    <>
      <PageHero
        kicker="Service areas"
        title="Toronto and the GTA, city by city — because a King West slab is not a Forest Hill joist."
        lede="Local pages exist so homeowners, builders, and AI agents can see the housing stock we actually work in, not a dumped list of suburbs."
      />
      <div className="mx-auto max-w-6xl space-y-12 px-4 py-12 sm:py-16 sm:px-6">
        <section>
          <h2 className="font-display text-3xl">Core service area</h2>
          <p className="mt-1 max-w-2xl text-muted">
            Free on-site measure for any qualified hardwood, stair, or railing job.
          </p>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {coreCities.map((c) => (
              <Link
                key={c.slug}
                href={`/areas/${c.slug}`}
                className="rounded-xl bg-surface p-6 shadow-[var(--shadow-card)] transition-colors hover:bg-bg-warm"
              >
                <p className="text-xs text-accent">{c.region}</p>
                <h3 className="mt-1 font-display text-2xl">Hardwood flooring in {c.name}</h3>
                <p className="mt-2 text-sm text-muted">{c.blurb}</p>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-3xl">Travel area</h2>
          <p className="mt-1 max-w-2xl text-muted">
            We work in these towns regularly, but on stair packages, whole-home installs, and
            refinishing rather than a single-room repair. Saying so up front is better than taking
            the booking and disappointing someone.
          </p>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {extendedCities.map((c) => (
              <Link
                key={c.slug}
                href={`/areas/${c.slug}`}
                className="rounded-xl bg-surface p-6 shadow-[var(--shadow-card)] transition-colors hover:bg-bg-warm"
              >
                <p className="text-xs text-accent">{c.region}</p>
                <h3 className="mt-1 font-display text-2xl">Hardwood flooring in {c.name}</h3>
                <p className="mt-2 text-sm text-muted">{c.blurb}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
