import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { JsonLd } from "@/components/json-ld";
import { ProjectGrid } from "@/components/portfolio/project-grid";
import { company } from "@/data/company";
import { projects } from "@/data/projects";
import { breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Hardwood Portfolio",
  description:
    "Hardwood installation, refinishing, custom stairs, railings, repairs, and decks completed across Toronto and the Greater Toronto Area.",
  alternates: { canonical: "/portfolio" },
  openGraph: {
    title: "Hardwood Portfolio | Green Hardwood — Toronto & GTA",
    description:
      "Hardwood installation, refinishing, custom stairs, railings, repairs, and decks completed across Toronto and the Greater Toronto Area.",
    url: "/portfolio",
  },
};

export default function PortfolioPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Work", path: "/portfolio" },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Green Hardwood — selected GTA projects",
          itemListElement: projects.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: p.title,
            description: p.summary,
            image: `${company.website}${p.image}`,
          })),
        }}
      />
      <PageHero
        kicker="Work"
        title="Floors, stairs, and railings you can inspect in person."
        lede="A working selection from Forest Hill restorations, Vaughan new builds, Oakville estates, and occupied GTA condos."
      />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <ProjectGrid />
      </div>
    </>
  );
}
