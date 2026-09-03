import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { equipment, equipmentCategories } from "@/data/equipment";
import { services } from "@/data/services";
import { breadcrumbLd, itemListLd, webPageLd } from "@/lib/seo";

/**
 * Why this route carries no photographs.
 *
 * Every other index on this site leads with an image. This one does not, and
 * the reason is the honesty rule in `data/equipment.ts`: these pages describe
 * what the work requires, not an inventory. A photograph of a finished floor
 * on a card headed "Belt sander" would read as a photograph of our belt
 * sander, and it is not one. So the cards are typographic until Franco
 * photographs the machines (OFFSITE_BLOCKERS #12).
 *
 * The side effect is a very fast index page, which is the correct trade for a
 * reference layer people arrive at from search.
 */

const description =
  "The machines that decide whether a hardwood floor comes out flat, dust-free and stable — what each one does, and how to tell whether a quote includes them.";

export const metadata: Metadata = {
  title: "Hardwood Machinery & Tooling",
  description,
  keywords: [
    "hardwood floor sanding equipment",
    "dust free sanding system",
    "belt sander vs drum sander floor",
    "wood moisture meter flooring",
    "flooring nailer",
    "stair fabrication tooling",
  ],
  alternates: { canonical: "/equipment" },
  openGraph: {
    title: "Hardwood Machinery & Tooling | Green Hardwood",
    description,
    url: "/equipment",
  },
};

export default function EquipmentIndex() {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Equipment", path: "/equipment" },
  ];

  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd
        data={webPageLd({
          name: "Hardwood Machinery & Tooling",
          description,
          path: "/equipment",
        })}
      />
      <JsonLd
        data={itemListLd(
          equipment.map((e) => ({
            name: e.name,
            path: `/equipment/${e.slug}`,
            description: e.summary,
          })),
          "Green Hardwood — machinery and tooling by class",
        )}
      />

      <PageHero
        kicker="Machinery & tooling"
        title="Most of the difference between a good floor and a bad one is decided by machines you never see."
        lede="Dust-free sanding is a claim about an extraction system. Matching a repair is a claim about a moisture meter. A stair that does not move is a claim about anchorage. These pages turn those claims into things you can check before you sign anything."
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Breadcrumbs items={crumbs} />
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-4 sm:px-6">
        <div className="rounded-xl border border-border bg-bg-warm p-5">
          <h2 className="text-xs tracking-[0.16em] text-accent uppercase">What this section is</h2>
          <p className="mt-2 text-sm text-muted">
            A specification of what each class of work requires, written so you can hold any
            quote — ours included — against it. It is not an asset list, and it does not claim a
            particular machine sits in our shop. Where our published method already implies a
            capability, the page says which practice it follows from and links it.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-14 px-4 py-10 sm:px-6 sm:py-14">
        {equipmentCategories.map((cat) => {
          const inCat = equipment.filter((e) => e.category === cat.id);
          if (inCat.length === 0) return null;

          return (
            <section key={cat.id} id={cat.id}>
              <h2 className="font-display text-3xl">{cat.label}</h2>
              <p className="mt-1 text-muted">{cat.blurb}</p>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {inCat.map((e) => (
                  <Link
                    key={e.slug}
                    href={`/equipment/${e.slug}`}
                    className="group flex flex-col rounded-xl bg-surface p-6 shadow-[var(--shadow-card)] transition-colors hover:bg-bg-warm"
                  >
                    <h3 className="font-display text-2xl">{e.name}</h3>
                    <p className="mt-2 text-sm text-muted">{e.summary}</p>
                    <p className="mt-4 text-sm">
                      <span className="text-xs tracking-[0.14em] text-accent uppercase">
                        Without it
                      </span>
                      <span className="mt-1 block text-muted">{e.without.instead}</span>
                    </p>
                    <p className="mt-4 text-xs text-muted">
                      Also called: {e.alsoCalled.slice(0, 3).join(", ")}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        <section className="rounded-xl bg-surface p-6 shadow-[var(--shadow-card)]">
          <h2 className="font-display text-2xl">Which machines your job depends on</h2>
          <p className="mt-2 text-sm text-muted">
            Each service page lists the equipment classes its work runs on, so you can start from
            the job rather than from the machine.
          </p>
          <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="text-primary hover:underline">
                  {s.shortName}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/estimate">Price your job</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/methods">How the work is done</Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
