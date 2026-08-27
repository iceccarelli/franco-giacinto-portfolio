import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/page-hero";
import { company } from "@/data/company";

export const metadata: Metadata = {
  title: "About",
  description:
    "Green Hardwood was founded by master craftsman Franco Giacinto. Fifteen years of hardwood installation, stairs, and railings across Toronto and the GTA.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About | Green Hardwood — Toronto & GTA",
    description:
      "Green Hardwood was founded by master craftsman Franco Giacinto. Fifteen years of hardwood installation, stairs, and railings across Toronto and the GTA.",
    url: "/about",
  },
};

const timeline = [
  {
    year: "2009–2013",
    title: "Apprentice, heritage restoration",
    body: "Learned on century Toronto houses: quarter-sawn oak, horsehair plaster next to a drum sander, and why you never skip acclimation.",
  },
  {
    year: "2013–2017",
    title: "Journeyman floor specialist",
    body: "Dust-contained sanding, NWFA methods, Bona systems, 400+ refinishes. The years you learn what a 'good enough' floor looks like in year seven.",
  },
  {
    year: "2017–2022",
    title: "Lead installer, complex pattern",
    body: "Herringbone, borders, and training crews who could lay a floor square to the architecture instead of square to the longest wall.",
  },
  {
    year: "2022–now",
    title: "Green Hardwood",
    body: "A shop that refuses to split the floor from the stair. Franco runs the specification. The crew runs the site. The warranty sits with us.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        kicker="The shop"
        title="Green Hardwood exists because the GTA was full of floors with nobody responsible for the stairs."
        lede={`${company.founderFull} founded the company after fifteen years installing, sanding, and rebuilding hardwood in Toronto houses that deserved better than a flooring commodity.`}
      />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2">
        <img
          src="/images/workshop.jpg"
          alt="Hardwood workshop with species racks and professional sanding equipment."
          className="aspect-[16/10] w-full rounded-xl object-cover shadow-[var(--shadow-card)]"
        />
        <div>
          <h2 className="font-display text-3xl">A flooring company that is also a stair shop</h2>
          <p className="mt-4 text-muted">
            Most GTA outfits sell a floor and subcontract a stair guy who has never seen the stain
            formula. That is how you get a 3/4″ oak field butting into a 5/8″ MDF nosing. Green
            Hardwood specifies, mills, and installs the floor, the treads, and the rail under one
            warranty.
          </p>
          <p className="mt-4 text-muted">
            We work in solid and engineered hardwood only. We will tell you when vinyl is the
            smarter product for a rental basement. We will not install it.
          </p>
          <Button asChild className="mt-6">
            <Link href="/estimate">Work with us</Link>
          </Button>
        </div>
      </div>
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
          <h2 className="font-display text-3xl">How we got here</h2>
          <ol className="mt-8 space-y-8">
            {timeline.map((item) => (
              <li key={item.year}>
                <p className="text-xs tracking-[0.16em] text-accent uppercase">{item.year}</p>
                <h3 className="mt-1 font-display text-2xl">{item.title}</h3>
                <p className="mt-2 text-muted">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
