import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { cities } from "@/data/areas";

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
      <div className="mx-auto grid max-w-6xl gap-5 px-4 py-12 sm:px-6 md:grid-cols-2">
        {cities.map((c) => (
          <Link
            key={c.slug}
            href={`/areas/${c.slug}`}
            className="rounded-xl bg-surface p-6 shadow-[var(--shadow-card)]"
          >
            <p className="text-xs text-accent">{c.region}</p>
            <h2 className="mt-1 font-display text-2xl">Hardwood flooring in {c.name}</h2>
            <p className="mt-2 text-sm text-muted">{c.blurb}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
