import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { SpeciesShowroom } from "@/components/tools/species-showroom";
import { Button } from "@/components/ui/button";
import { breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Hardwood Species Showroom",
  description:
    "Interactive hardwood showroom for Toronto and the GTA: white oak, red oak, walnut, maple, hickory, and engineered oak — grain, Janka hardness, pattern, and finish.",
  alternates: { canonical: "/showroom" },
  openGraph: {
    title: "Hardwood Species Showroom | Green Hardwood — Toronto & GTA",
    description:
      "Interactive hardwood showroom for Toronto and the GTA: white oak, red oak, walnut, maple, hickory, and engineered oak — grain, Janka hardness, pattern, and finish.",
    url: "/showroom",
  },
};

export default function ShowroomPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Showroom", path: "/showroom" },
        ])}
      />
      <section className="border-b border-border bg-bg-warm">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <p className="text-xs tracking-[0.18em] text-accent uppercase">Species showroom</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl leading-[1.08] sm:text-5xl">
            Pick the wood the house can actually live with.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            Fashion is not a specification. White oak is the GTA default. Hickory is the dog floor.
            Maple shows every drop. Walnut belongs on the stair more often than the kitchen.
          </p>
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <SpeciesShowroom />
        <img
          src="/images/species-board.jpg"
          alt="White oak, red oak, walnut, maple, and hickory sample boards on a Green Hardwood workbench."
          className="mt-12 aspect-[21/9] w-full rounded-xl object-cover"
        />
        <div className="mt-10 rounded-xl bg-primary px-6 py-10 text-primary-fg sm:px-10">
          <h2 className="font-display text-3xl">
            Samples leave the shop. The internet does not pick a stain.
          </h2>
          <p className="mt-3 max-w-2xl text-primary-fg/75">
            We bring boards to your light, not a jpg to your phone. Book the site visit and we will
            leave a signed sample on the job.
          </p>
          <Button asChild variant="invert" className="mt-6">
            <Link href="/estimate">Bring samples</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
