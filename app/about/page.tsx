import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Award, Check, MapPin, Ruler, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/page-hero";
import { company, stats } from "@/data/company";
import { breadcrumbLd, personLd, webPageLd } from "@/lib/seo";

const description = `Franco Giacinto founded Green Hardwood after fifteen years installing and rebuilding hardwood in Toronto. Meet the craftsman behind the floors and stairs.`;

export const metadata: Metadata = {
  title: `About Franco Giacinto & Green Hardwood`,
  description,
  keywords: [
    "Franco Giacinto Oller Grimaldi",
    "master hardwood craftsman Toronto",
    "hardwood flooring company Toronto",
    "Green Hardwood about",
    "Bona certified craftsman GTA",
  ],
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Franco Giacinto & Green Hardwood",
    description,
    url: "/about",
    images: [
      {
        url: "/images/franco-giacinto-oller-grimaldi.jpg",
        width: 800,
        height: 1000,
        alt: `${company.founderFull}, ${company.founderTitle} at Green Hardwood`,
      },
    ],
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
    body: "Dust-contained sanding, NWFA methods, Bona systems, 400+ refinishes. The years you learn what a “good enough” floor looks like in year seven.",
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

const principles = [
  {
    icon: Ruler,
    title: "Measure before you promise",
    body: "Every job opens with a moisture survey and a flatness check. A number quoted without one is a guess wearing a suit.",
  },
  {
    icon: ShieldCheck,
    title: "One shop, one warranty",
    body: `Floor, treads, risers, and rail under ${company.warranty.toLowerCase()}. Nobody gets to blame the other trade, because there is no other trade.`,
  },
  {
    icon: Award,
    title: "Specify against the house",
    body: "Fashion is not a specification. We will talk you out of maple in a west-facing sunroom and into engineered over your slab.",
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={personLd()} />
      <JsonLd
        data={webPageLd({
          name: "About Franco Giacinto & Green Hardwood",
          description,
          path: "/about",
          type: "AboutPage",
          primaryImage: "/images/franco-giacinto-oller-grimaldi.jpg",
        })}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />

      <PageHero
        kicker="The shop"
        title="Green Hardwood exists because the GTA was full of floors with nobody responsible for the stairs."
        lede={`${company.founderFull} founded the company after fifteen years installing, sanding, and rebuilding hardwood in Toronto houses that deserved better than a flooring commodity.`}
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]}
        />
      </div>

      {/* Founder ---------------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16 sm:px-6">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,22rem)_1fr]">
          <figure className="mx-auto w-full max-w-sm lg:mx-0">
            <Image
              src="/images/franco-giacinto-oller-grimaldi.jpg"
              alt={`${company.founderFull}, ${company.founderTitle} at Green Hardwood, in the Sterling Road workshop`}
              width={800}
              height={1000}
              sizes="(min-width: 1024px) 22rem, (min-width: 640px) 24rem, 100vw"
              priority
              className="w-full rounded-xl object-cover shadow-[var(--shadow-card)]"
            />
            <figcaption className="mt-3 text-sm text-muted">
              <span className="font-medium text-fg">{company.founderFull}</span>
              <br />
              {company.founderTitle}
            </figcaption>
          </figure>

          <div>
            <p className="text-xs font-medium tracking-[0.18em] text-accent uppercase">
              Founder · Master craftsman
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">
              Franco Giacinto has been under Toronto floors since 2009.
            </h2>
            <div className="mt-5 space-y-4 text-muted">
              <p>
                He started on century houses in the west end, where the subfloor moves with the
                season and the original quarter-sawn oak is worth more than anything you could put
                over it. That is where the habit came from: read the house first, then decide what
                the floor is allowed to be.
              </p>
              <p>
                The stair obsession came later, and it came from frustration. Franco kept being
                called back to jobs where a good hardwood floor died at the top step — a
                three-quarter-inch oak field butting into a painted MDF nosing, a rail bolted into
                trim instead of structure, a stain formula nobody wrote down. The floor crew blamed
                the stair guy. The stair guy was gone.
              </p>
              <p>
                Green Hardwood is the answer to that. One shop specifies, mills, and installs the
                floor, the treads, the risers, and the rail, and one warranty covers all of it.
                Franco still runs the specification on every job and still shows up with the
                moisture meter.
              </p>
              <p>
                We work in solid and engineered hardwood only. If vinyl is the smarter product for
                your rental basement, we will say so — and we still will not install it.
              </p>
            </div>

            <ul className="mt-7 grid gap-2 sm:grid-cols-2">
              {company.licensed.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm">
                  <Check className="size-4 shrink-0 text-accent" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/estimate">Work with us</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/portfolio">See the work</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Numbers ---------------------------------------------------------- */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px bg-border md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-surface px-4 py-6 sm:px-6">
              <p className="font-display text-3xl text-primary tabular-nums">{s.value}</p>
              <p className="mt-1 text-sm text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Principles ------------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16 sm:px-6">
        <h2 className="font-display text-3xl sm:text-4xl">How we actually work</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {principles.map(({ icon: Icon, title, body }) => (
            <article key={title} className="rounded-xl bg-surface p-6 shadow-[var(--shadow-card)]">
              <Icon className="size-5 text-accent" aria-hidden="true" />
              <h3 className="mt-3 font-display text-xl">{title}</h3>
              <p className="mt-2 text-sm text-muted">{body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Shop ------------------------------------------------------------- */}
      <section className="border-y border-border bg-bg-warm">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:py-16 sm:px-6 lg:grid-cols-2">
          <Image
            src="/images/workshop.jpg"
            alt="Green Hardwood workshop with species racks, stain sample boards, and professional sanding equipment."
            width={1600}
            height={1000}
            sizes="(min-width: 1024px) 32rem, 100vw"
            className="aspect-[16/10] w-full rounded-xl object-cover shadow-[var(--shadow-card)]"
          />
          <div>
            <div className="flex items-center gap-2 text-accent">
              <MapPin className="size-4" aria-hidden="true" />
              <p className="text-xs tracking-[0.18em] uppercase">The studio</p>
            </div>
            <h2 className="mt-2 font-display text-3xl">
              {company.address.line1}, {company.address.city}
            </h2>
            <p className="mt-4 text-muted">
              Species racks, stain sample boards, and the stair bench. Clients come here to sign off
              on a board and a finish before we cut anything — because a 3&nbsp;× 3&nbsp;inch chip
              in a showroom is not a floor, and a photo on a phone is not a stain.
            </p>
            <p className="mt-3 text-sm text-muted">{company.hoursSummary}</p>
            <Button asChild variant="outline" className="mt-6">
              <Link href="/contact">Book a visit to the studio</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Timeline --------------------------------------------------------- */}
      <section className="mx-auto max-w-3xl px-4 py-12 sm:py-16 sm:px-6">
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
      </section>
    </>
  );
}
