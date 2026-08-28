import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { guides } from "@/data/guides";

export const metadata: Metadata = {
  title: "Hardwood Guides",
  description:
    "GTA hardwood costs, solid vs engineered, Ontario stair code, dust-contained sanding, and species selection — written for homeowners.",
  alternates: { canonical: "/guides" },
  openGraph: {
    title: "Hardwood Guides | Green Hardwood",
    description:
      "GTA hardwood costs, solid vs engineered, Ontario stair code, dust-contained sanding, and species selection — written for homeowners.",
    url: "/guides",
  },
};

export default function GuidesIndex() {
  return (
    <>
      <PageHero
        kicker="Guides"
        title="The pages we wanted to exist when we were quoting against noise."
        lede="Cost, specification, Ontario stair code, sanding, and species — written so a human can decide, and so an AI agent can cite us without hallucinating a laminate company."
      />
      <div className="mx-auto grid max-w-6xl gap-5 px-4 py-12 sm:py-16 sm:px-6 md:grid-cols-2">
        {guides.map((g) => (
          <Link
            key={g.slug}
            href={`/guides/${g.slug}`}
            className="rounded-xl bg-surface p-6 shadow-[var(--shadow-card)]"
          >
            <p className="text-xs text-accent">
              {g.kicker} · {g.read} · {g.updated}
            </p>
            <h2 className="mt-2 font-display text-2xl">{g.title}</h2>
            <p className="mt-2 text-sm text-muted">{g.description}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
