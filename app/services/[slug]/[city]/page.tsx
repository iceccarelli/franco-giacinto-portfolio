import type { Metadata } from "next";
import { Photo } from "@/components/photo";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check, Clock, MapPin, Wallet } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { CoverageMap, MapWorkedExamples } from "@/components/map/coverage-map";
import { QuoteForm } from "@/components/estimate/quote-form";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { tierNote } from "@/data/areas";
import { company } from "@/data/company";
import { SITE_URL } from "@/lib/site-url";
import {
  formatCad,
  getMatrixPage,
  matrixForCity,
  matrixForService,
  matrixPages,
} from "@/data/matrix";
import { projects } from "@/data/projects";
import { breadcrumbLd, faqLd, webPageLd } from "@/lib/seo";

type Params = { slug: string; city: string };

export const dynamicParams = false;

// ISR, one hour — serves s-maxage=3600 + stale-while-revalidate at the edge.
// See app/areas/[city]/page.tsx for the rationale.
export const revalidate = 3600;

export function generateStaticParams(): Params[] {
  return matrixPages.map((p) => ({ slug: p.service.slug, city: p.city.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug, city } = await params;
  const page = getMatrixPage(slug, city);
  if (!page) return {};

  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    alternates: { canonical: page.path },
    openGraph: {
      title: `${page.title} | Green Hardwood`,
      description: page.description,
      url: page.path,
      images: [{ url: page.service.image, alt: page.service.imageAlt }],
    },
  };
}

/** Maps a service slug onto the lead form's service option. */
function leadService(slug: string) {
  if (slug.includes("stair")) return "stairs";
  if (slug.includes("rail")) return "railings";
  if (slug.includes("refin") || slug.includes("sanding")) return "refinish";
  if (slug.includes("repair")) return "repair";
  if (slug.includes("deck")) return "deck";
  return "install";
}

export default async function ServiceCityPage({ params }: { params: Promise<Params> }) {
  const { slug, city: citySlug } = await params;
  const page = getMatrixPage(slug, citySlug);
  if (!page) notFound();

  const { service, city, band } = page;
  const localProjects = projects.filter((p) => p.citySlug === city.slug).slice(0, 2);
  const otherServicesHere = matrixForCity(city.slug).filter((p) => p.service.slug !== service.slug);
  const otherCitiesForService = matrixForService(service.slug).filter(
    (p) => p.city.slug !== city.slug,
  );

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: service.shortName, path: `/services/${service.slug}` },
    { name: city.name, path: page.path },
  ];

  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd data={faqLd(page.faqs)} />
      <JsonLd
        data={webPageLd({
          name: page.title,
          description: page.description,
          path: page.path,
          primaryImage: service.image,
        })}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: page.title,
          serviceType: service.name,
          description: page.description,
          url: `${SITE_URL}${page.path}`,
          provider: { "@id": `${SITE_URL}/#business` },
          areaServed: {
            "@type": "City",
            name: city.name,
            containedInPlace: { "@type": "AdministrativeArea", name: "Ontario" },
          },
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "CAD",
            lowPrice: Math.round(band.low),
            highPrice: Math.round(band.high),
            offerCount: 1,
            description: `Typical ${service.shortName.toLowerCase()} job in ${city.name}: ${band.basis}.`,
          },
        }}
      />

      {/* Hero -------------------------------------------------------------- */}
      <section className="border-b border-border bg-bg-warm">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Breadcrumbs items={crumbs} className="pt-4" />
        </div>
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 pb-12 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="text-xs tracking-[0.18em] text-accent uppercase">
              {city.region} · {service.eyebrow}
            </p>
            <h1 className="mt-3 font-display text-4xl leading-[1.08] font-medium sm:text-5xl">{page.h1}</h1>
            <p className="mt-4 text-lg text-muted">{page.angle}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href={`/estimate?service=${page.service.slug}&city=${page.city.slug}`}>Price this in {city.name}</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={`tel:${company.phone}`}>Call {company.phoneDisplay}</a>
              </Button>
            </div>
          </div>
          <Photo
            src={service.image}
            alt={service.imageAlt}
            ratio="4/3"
            slot="half"
            priority
            className="rounded-xl shadow-[var(--shadow-card)]"
          />
        </div>
      </section>

      {/* Local price band -------------------------------------------------- */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-px bg-border sm:grid-cols-3">
          <div className="bg-surface px-5 py-6">
            <div className="flex items-center gap-2 text-accent">
              <Wallet className="size-4" aria-hidden="true" />
              <p className="text-xs tracking-[0.16em] uppercase">{city.name} range</p>
            </div>
            <p className="mt-2 font-display text-2xl text-primary tabular-nums">
              {formatCad(band.low)}–{formatCad(band.high)}
            </p>
            <p className="mt-1 text-sm text-muted">For {band.basis}, before HST</p>
          </div>
          <div className="bg-surface px-5 py-6">
            <div className="flex items-center gap-2 text-accent">
              <Clock className="size-4" aria-hidden="true" />
              <p className="text-xs tracking-[0.16em] uppercase">On site</p>
            </div>
            <p className="mt-2 font-display text-2xl text-primary">{band.timeline}</p>
            <p className="mt-1 text-sm text-muted">{service.duration}</p>
          </div>
          <div className="bg-surface px-5 py-6">
            <div className="flex items-center gap-2 text-accent">
              <MapPin className="size-4" aria-hidden="true" />
              <p className="text-xs tracking-[0.16em] uppercase">Coverage</p>
            </div>
            <p className="mt-2 font-display text-2xl text-primary">{city.name}</p>
            <p className="mt-1 text-sm text-muted">
              {city.tier === "core" ? "Free site measure" : "Travel area"} · {company.warranty}
            </p>
          </div>
        </div>
      </section>

      {/* Body -------------------------------------------------------------- */}
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-12 sm:py-16 sm:px-6 lg:grid-cols-[1.3fr_0.7fr]">
        <article>
          <h2 className="font-display text-3xl">What we walk into in {city.name}</h2>
          <p className="mt-3 text-muted">{city.housing}</p>
          <p className="mt-3 text-muted">{city.typical}</p>

          <h2 className="mt-10 font-display text-3xl">
            How we specify {service.shortName.toLowerCase()} here
          </h2>
          <ul className="mt-4 space-y-3">
            {service.bullets.map((b) => (
              <li key={b} className="flex gap-3">
                <Check className="mt-1 size-4 shrink-0 text-accent" aria-hidden="true" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 space-y-4 text-muted">
            {service.body.slice(0, 3).map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>

          <h2 className="mt-10 font-display text-3xl">Jobs {city.name} keeps calling us for</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {city.jobs.map((job) => (
              <li
                key={job}
                className="rounded-lg bg-surface px-4 py-3 text-sm shadow-[var(--shadow-card)]"
              >
                {job}
              </li>
            ))}
          </ul>

          {localProjects.length > 0 && (
            <>
              <h2 className="mt-10 font-display text-3xl">Work near {city.name}</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {localProjects.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/portfolio/${p.slug}`}
                    className="group overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-card)] transition-shadow hover:shadow-lg"
                  >
                    <Photo src={p.image} alt={p.imageAlt} ratio="16/10" slot="card" />
                    <div className="p-4">
                      <h3 className="font-display text-lg group-hover:text-primary">{p.title}</h3>
                      <p className="mt-1 text-sm text-muted">{p.summary}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}

          <h2 className="mt-10 font-display text-3xl">
            {service.shortName} in {city.name} — questions
          </h2>
          <Accordion type="single" collapsible className="mt-4">
            {page.faqs.map((f) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/*
            The department map, centred on this city. Same filter as the
            parent service page — only the municipalities where this service is
            actually taken — so a visitor can see at a glance whether their
            neighbours are inside the core radius or on the travel tier.
          */}
          <div className="mt-10">
            <h2 className="font-display text-2xl">
              {service.shortName} around {city.name}
            </h2>
            <p className="mt-2 text-sm text-muted">
              Service coverage and 2026 published bands. Not a record of past jobs.
            </p>
            <div className="mt-4">
              <CoverageMap serviceSlug={service.slug} focus={city.slug} height={320} compact />
            </div>
            <MapWorkedExamples serviceSlug={service.slug} />
          </div>

          <p className="mt-8 text-sm text-muted">
            Looking for the full service detail rather than the {city.name} view?{" "}
            <Link href={`/services/${service.slug}`} className="text-primary hover:underline">
              {service.name}
            </Link>{" "}
            covers method, materials, and warranty. For everything we do in this city, see{" "}
            <Link href={`/areas/${city.slug}`} className="text-primary hover:underline">
              hardwood flooring in {city.name}
            </Link>
            .
          </p>
        </article>

        <aside className="h-fit rounded-xl bg-surface p-6 shadow-[var(--shadow-card)]">
          <h2 className="font-display text-2xl">Book a {city.name} site visit</h2>
          <p className="mt-2 mb-4 text-sm text-muted">{tierNote(city)}</p>
          <QuoteForm
            defaultService={leadService(service.slug)}
            defaultCity={city.slug}
            source={page.path}
          />
        </aside>
      </div>

      {/* Internal linking -------------------------------------------------- */}
      <section className="border-t border-border bg-bg-warm">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:py-16 sm:px-6 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl">Everything else we do in {city.name}</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {otherServicesHere.map((p) => (
                <li key={p.path}>
                  <Link
                    href={p.path}
                    className="group inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                  >
                    {p.service.shortName} in {city.name}
                    <ArrowUpRight className="size-3.5 opacity-50 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-2xl">{service.shortName} in other GTA cities</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {otherCitiesForService.map((p) => (
                <li key={p.path}>
                  <Link
                    href={p.path}
                    className="group inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                  >
                    {p.city.name}
                    <ArrowUpRight className="size-3.5 opacity-50 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
