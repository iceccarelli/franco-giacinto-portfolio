import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { BeforeAfter } from "@/components/before-after";
import { QuoteEstimator } from "@/components/estimate/quote-estimator";
import { HomeHero } from "@/components/home/hero";
import { ToolsRow } from "@/components/home/tools-row";
import { WhyUs } from "@/components/home/why-us";
import { JsonLd } from "@/components/json-ld";
import { Stars } from "@/components/stars";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { company, stats } from "@/data/company";
import { coreCities } from "@/data/areas";
import { faqs } from "@/data/faq";
import { projects } from "@/data/projects";
import { services } from "@/data/services";
import { testimonials } from "@/data/testimonials";
import { faqLd, howToStairLd } from "@/lib/seo";

const homeDescription =
  "Hardwood floor installation, custom stairs, railings, dust-free sanding and refinishing across Toronto and the GTA. Free on-site estimates.";

export const metadata: Metadata = {
  // Title comes from the root layout's `default`, so the homepage keeps the
  // brand-plus-primary-keyword form without the "%s | " template applied.
  description: homeDescription,
  alternates: { canonical: "/" },
  openGraph: {
    title: "Hardwood Flooring & Stairs Toronto | Green Hardwood",
    description: homeDescription,
    url: "/",
  },
};

export default function Home() {
  const featured = services.filter((s) =>
    [
      "hardwood-installation",
      "hardwood-stairs",
      "hardwood-railings",
      "sanding-refinishing",
      "hardwood-repairs",
      "hardwood-decks",
    ].includes(s.slug),
  );

  return (
    <>
      <JsonLd data={faqLd()} />
      <JsonLd data={howToStairLd()} />
      <HomeHero />

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

      <WhyUs />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-24 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs font-medium tracking-[0.18em] text-accent uppercase">The work</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl">
              Hardwood is the product. Stairs and railings are the test.
            </h2>
          </div>
          <Button asChild variant="outline">
            <Link href="/services">
              All services <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="group overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-card)]"
            >
              <img
                src={s.image}
                alt={s.imageAlt}
                className="aspect-[16/10] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
           loading="lazy" decoding="async"
          />
              <div className="p-5">
                <p className="text-xs text-accent">{s.priceFrom}</p>
                <h3 className="mt-1 font-display text-2xl">{s.shortName}</h3>
                <p className="mt-2 text-sm text-muted">{s.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-primary text-primary-fg">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:py-24 sm:px-6 lg:grid-cols-2 lg:py-20">
          <div>
            <p className="text-xs tracking-[0.18em] text-primary-fg/55 uppercase">
              Niche we intend to own
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">
              The GTA still treats stairs as leftover flooring. We do not.
            </h2>
            <p className="mt-4 text-primary-fg/75">
              Carpet-to-oak conversions in Vaughan. Walnut feature flights in Oakville. Graspable
              rails that pass inspection in Toronto semis. Build the flight in the stair studio,
              then check it against Ontario Building Code.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="invert">
                <Link href="/stairs">Stair studio</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-primary-fg/20 text-primary-fg hover:bg-primary-fg/10"
              >
                <Link href={`/services/${"hardwood-railings"}`}>Hardwood railings</Link>
              </Button>
            </div>
          </div>
          <img
            src="/images/stair-studio.jpg"
            alt="Custom white oak staircase with black metal balusters in a Greater Toronto home."
            className="aspect-[3/2] w-full rounded-xl object-cover"
           loading="lazy" decoding="async"
          />
        </div>
      </section>

      <ToolsRow />

      <section className="border-y border-border bg-bg-warm">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:py-24 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="text-xs tracking-[0.18em] text-accent uppercase">Proof</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl">
              Same maple. Same condo. Different floor.
            </h2>
            <p className="mt-4 text-muted">
              Occupied Richmond Hill unit, dust-contained sand, waterborne two-component finish. The
              owner slept there. Drag the slider.
            </p>
            <Button asChild className="mt-6">
              <Link href="/portfolio">See the work</Link>
            </Button>
          </div>
          <BeforeAfter
            before="/images/before-worn.jpg"
            after="/images/after-refinished.jpg"
            beforeAlt="Worn, dull maple hardwood floor before refinishing."
            afterAlt="Freshly refinished maple hardwood floor with an even satin sheen."
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-24 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl sm:text-4xl">Selected GTA projects</h2>
          <Link href="/portfolio" className="text-sm font-medium text-primary">
            Full portfolio
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, 6).map((p) => (
            <article
              key={p.slug}
              className="overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-card)]"
            >
              <img src={p.image} alt={p.imageAlt} className="aspect-[4/3] w-full object-cover" loading="lazy" decoding="async"/>
              <div className="p-5">
                <Badge>{p.location}</Badge>
                <h3 className="mt-3 font-display text-xl">{p.title}</h3>
                <p className="mt-1 text-sm text-muted">{p.summary}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24 sm:px-6">
          <h2 className="font-display text-3xl sm:text-4xl">Price the job before you call</h2>
          <p className="mt-3 max-w-2xl text-muted">
            2026 GTA ranges for install, refinish, stairs, railings, repairs, and decks. Then we
            visit, measure moisture, and lock a number.
          </p>
          <div className="mt-8">
            <QuoteEstimator compact />
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-bg-warm">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24 sm:px-6">
          <div className="flex items-center gap-2 text-accent">
            <MapPin className="size-4" />
            <p className="text-xs tracking-[0.18em] uppercase">Service area</p>
          </div>
          <h2 className="mt-2 font-display text-3xl">
            Thirty-two cities and towns, from Burlington to Barrie
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {coreCities.slice(0, 12).map((c) => (
              <Link
                key={c.slug}
                href={`/areas/${c.slug}`}
                className="rounded-lg bg-surface px-4 py-3 text-sm font-medium shadow-[var(--shadow-card)] hover:text-accent"
              >
                {c.name}
                <span className="mt-1 block text-xs font-normal text-muted">{c.region}</span>
              </Link>
            ))}
          </div>
          <p className="mt-6 text-sm">
            <Link href="/areas" className="font-medium text-primary hover:underline">
              All 32 service areas
            </Link>{" "}
            — twenty inside our core radius, twelve we travel to for larger work.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-24 sm:px-6">
        <h2 className="font-display text-3xl">What clients actually say</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <blockquote
              key={t.name}
              className="rounded-xl bg-surface p-6 shadow-[var(--shadow-card)]"
            >
              <Stars rating={t.rating} />
              <p className="mt-3 text-fg">“{t.quote}”</p>
              <footer className="mt-4 text-sm">
                <p className="font-medium">{t.name}</p>
                <p className="text-muted">
                  {t.role} · {t.project}
                </p>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="bg-surface">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:py-24 sm:px-6">
          <h2 className="font-display text-3xl">
            Questions we get from Toronto homeowners — and from AI crawlers
          </h2>
          <Accordion type="single" collapsible className="mt-6">
            {faqs.map((f) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <p className="mt-6 text-sm">
            <Link href="/for-agents" className="text-primary hover:underline">
              Canonical facts for AI agents
            </Link>
            {" · "}
            <Link href="/faq" className="text-primary hover:underline">
              Full FAQ
            </Link>
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-24 sm:px-6">
        <div className="rounded-xl bg-primary px-6 py-12 text-primary-fg sm:px-12">
          <h2 className="font-display text-3xl sm:text-4xl">
            If the stair is an afterthought, you have the wrong flooring company.
          </h2>
          <p className="mt-4 max-w-2xl text-primary-fg/75">
            Book a free site visit. We bring a moisture meter, not a brochure. Serving{" "}
            {company.areaServed}.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="invert" size="lg">
              <Link href="/estimate">Free estimate</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-primary-fg/20 text-primary-fg hover:bg-primary-fg/10"
            >
              <a href={`tel:${company.phone}`}>Call {company.phoneDisplay}</a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
