import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { JsonLd } from "@/components/json-ld";
import { services } from "@/data/services";
import { breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Hardwood Flooring Services",
  description:
    "Hardwood installation, custom stairs, railings, dust-free sanding, refinishing, repairs, and decks across Toronto and the GTA.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Hardwood Flooring Services | Green Hardwood",
    description:
      "Hardwood installation, custom stairs, railings, dust-free sanding, refinishing, repairs, and decks across Toronto and the GTA.",
    url: "/services",
  },
};

export default function ServicesIndex() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ])}
      />
      <PageHero
        kicker="Services"
        title="Every hardwood job the house actually needs."
        lede="Installation, stairs, railings, sanding, finishing, refinishing, repairs, decks, and commercial work — specified as one system, not five subcontractors."
      />
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:py-16 sm:px-6 md:grid-cols-2">
        {services.map((s) => (
          <Link
            key={s.slug}
            href={`/services/${s.slug}`}
            className="overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-card)]"
          >
            <img src={s.image} alt={s.imageAlt} className="aspect-[16/9] w-full object-cover" loading="lazy" decoding="async"/>
            <div className="p-6">
              <p className="text-xs text-accent">{s.priceFrom}</p>
              <h2 className="mt-1 font-display text-2xl">{s.name}</h2>
              <p className="mt-2 text-sm text-muted">{s.summary}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
