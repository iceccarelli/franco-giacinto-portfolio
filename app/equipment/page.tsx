import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { Photo } from "@/components/photo";
import { PhotoRotator } from "@/components/photo-rotator";
import {
  DEFECT_IMAGE_DISCLOSURE,
  EQUIPMENT_IMAGE_DISCLOSURE,
  equipment,
  equipmentCategories,
} from "@/data/equipment";
import { services } from "@/data/services";
import { breadcrumbLd, itemListLd, webPageLd } from "@/lib/seo";

/**
 * Why the cards carry an image, and what the image is allowed to claim.
 *
 * This route originally shipped typographic, because a photograph of a
 * machine on a card headed "Belt sander" reads as a photograph of OUR belt
 * sander, and there is no such photograph. That reasoning was right and it
 * has not changed — what changed is that a commissioned illustration of the
 * machine class now exists, and it is labelled as one under every instance
 * (`EQUIPMENT_IMAGE_DISCLOSURE`).
 *
 * So the rule stands and the pictures are allowed: the honesty rule was never
 * "no images", it was "no claim about assets". OFFSITE_BLOCKERS #13 still
 * tracks the real photographs, and only those turn this section into an
 * inventory.
 *
 * The hero here is the DEFECT strip rather than the machines. Someone landing
 * on this page from a search does not yet care what a multi-disc sander is;
 * they care that there is a dark ring around their neighbour's refinished
 * floor. Lead with the thing they can recognise.
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

/** The six machine classes whose failure mode is visually checkable. */
const DEFECT_NAMES: Record<string, string> = {
  "belt-sander": "Chatter marks",
  edger: "The perimeter halo",
  "moisture-meter": "Cupping",
  "adhesive-trowel": "Hollow spots",
  "finish-application": "Lap lines",
  "railing-anchorage": "A newel that moves",
};

export default function EquipmentIndex() {
  const defects = equipment
    .filter((e) => e.defectImage && e.defectAlt)
    .map((e) => ({ ...e, defectName: DEFECT_NAMES[e.slug] ?? e.name }));

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
          <p className="mt-3 text-sm text-muted">{EQUIPMENT_IMAGE_DISCLOSURE}</p>
        </div>
      </div>

      {/*
        The six failures a homeowner can actually walk into a room and find.
        This is the strongest thing on the page and it goes above the machine
        grid, because "which of these is on my floor?" is a question a visitor
        already has, and "what is an edger?" is not.
      */}
      <section className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
        <h2 className="font-display text-3xl">What bad work looks like</h2>
        <p className="mt-1 max-w-2xl text-muted">
          Six defects, each one caused by a machine that was missing, worn, or used wrongly. Every
          one of them is visible to someone standing in the room, in the right light, if they know
          what they are looking at. Follow any of them to the equipment that prevents it.
        </p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {defects.map((d) => (
            <Link
              key={d.slug}
              href={`/equipment/${d.slug}`}
              className="group overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-card)] transition-colors hover:bg-bg-warm"
            >
              <Photo
                src={d.defectImage!}
                alt={d.defectAlt!}
                ratio="16/9"
                slot="card"
                seed={d.slug}
              />
              <div className="p-5">
                <h3 className="font-display text-xl">{d.defectName}</h3>
                <p className="mt-2 text-sm text-muted">{d.defectAlt}</p>
                <p className="mt-3 text-xs text-accent">Prevented by: {d.name}</p>
              </div>
            </Link>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted">{DEFECT_IMAGE_DISCLOSURE}</p>
      </section>

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
                    className="group flex flex-col overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-card)] transition-colors hover:bg-bg-warm"
                  >
                    {/*
                      Rotating here too, seeded by slug. Ken Burns is OFF in
                      the grid: ten cards each drifting is a page that will not
                      hold still to be read.
                    */}
                    <PhotoRotator
                      src={e.image}
                      alt={e.imageAlt}
                      seed={e.slug}
                      ratio="aspect-[16/9]"
                      sizes="(min-width: 1024px) 560px, 100vw"
                    />
                    <div className="flex flex-1 flex-col p-6">
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
                    </div>
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
