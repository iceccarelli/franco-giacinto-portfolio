import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { Button } from "@/components/ui/button";
import { catalog, bandFor } from "@/data/catalog";
import { breadcrumbLd, itemListLd, webPageLd } from "@/lib/seo";

const description =
  "Twelve job types this shop takes, each with the typical specification, the published 2026 GTA band, the sequence of work, and what goes wrong when it is done badly.";

export const metadata: Metadata = {
  title: "Job Catalogue | Hardwood Floors, Stairs & Railings",
  description,
  keywords: [
    "hardwood job types Toronto",
    "carpet to hardwood stairs",
    "herringbone over radiant",
    "dust free sanding occupied condo",
    "hardwood railing Ontario building code",
  ],
  alternates: { canonical: "/catalog" },
  openGraph: { title: "Job Catalogue | Green Hardwood", description, url: "/catalog" },
};

export const revalidate = 3600;

const groups = [
  { key: "stairs", label: "Stairs" },
  { key: "install", label: "Installation" },
  { key: "refinish", label: "Sanding & refinishing" },
  { key: "railings", label: "Railings" },
  { key: "repair", label: "Repair" },
  { key: "commercial", label: "Commercial" },
  { key: "deck", label: "Decks" },
] as const;

export default function CatalogIndex() {
  return (
    <>
      <JsonLd
        data={webPageLd({
          name: "Job Catalogue",
          description,
          path: "/catalog",
          type: "CollectionPage",
        })}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Job catalogue", path: "/catalog" },
        ])}
      />
      <JsonLd
        data={itemListLd(
          catalog.map((c) => ({
            name: c.name,
            path: `/catalog/${c.slug}`,
            description: c.summary,
          })),
          "Green Hardwood job catalogue",
        )}
      />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <Breadcrumbs items={[{ name: "Job catalogue", path: "/catalog" }]} />

        <header className="mt-6 max-w-3xl">
          <p className="text-xs font-medium tracking-[0.18em] text-accent uppercase">
            What we build
          </p>
          <h1 className="mt-3 font-display text-[2.2rem] leading-[1.08] sm:text-5xl">
            Twelve jobs, described the way a specifier would describe them.
          </h1>
          <p className="mt-5 text-lg text-muted">
            Not a gallery and not a list of adjectives. Each entry is the specification, the
            sequence of work, the published band, and the failure modes — what actually goes wrong
            when the job is done badly, which is the part nobody puts on a website.
          </p>
        </header>

        {groups.map((group) => {
          const entries = catalog.filter((c) => c.category === group.key);
          if (entries.length === 0) return null;
          return (
            <section key={group.key} className="mt-12">
              <h2 className="font-display text-2xl">{group.label}</h2>
              <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {entries.map((entry) => (
                  <Link
                    key={entry.slug}
                    href={`/catalog/${entry.slug}`}
                    className="group flex flex-col rounded-xl bg-surface p-6 shadow-[var(--shadow-card)] transition-shadow hover:shadow-lg"
                  >
                    <p className="text-xs text-accent">{bandFor(entry)}</p>
                    <h3 className="mt-2 font-display text-xl leading-snug">{entry.name}</h3>
                    <p className="mt-2 flex-1 text-sm text-muted">{entry.summary}</p>
                    <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                      {entry.failureModes.length} ways it goes wrong
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        <section className="mt-14 rounded-xl bg-primary p-8 text-primary-fg sm:p-10">
          <h2 className="font-display text-2xl sm:text-3xl">Recognise your job on this list?</h2>
          <p className="mt-3 max-w-2xl text-primary-fg/75">
            The estimator gives a 2026 GTA band in about twenty seconds. A firm number follows a
            moisture reading on site, and nothing else.
          </p>
          <div className="mt-6">
            <Button asChild variant="invert">
              <Link href="/estimate">Get a 2026 price band</Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
