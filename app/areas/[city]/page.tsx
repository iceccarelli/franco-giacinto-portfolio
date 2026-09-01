import type { Metadata } from "next";
import { Photo } from "@/components/photo";
import { notFound } from "next/navigation";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { QuoteForm } from "@/components/estimate/quote-form";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { priceBandOf } from "@/data/services";
import { cities, getCity, tierNote, titleNameOf } from "@/data/areas";
import { projects } from "@/data/projects";
import { SITE_URL } from "@/lib/site-url";
import { breadcrumbLd, clampDescription, faqLd, webPageLd } from "@/lib/seo";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { matrixForCity } from "@/data/matrix";

type Params = { city: string };

export function generateStaticParams(): Params[] {
  return cities.map((c) => ({ city: c.slug }));
}

export const dynamicParams = false;

/**
 * ISR, one hour. On Vercel this serves the prerendered page with
 * `Cache-Control: public, s-maxage=3600, stale-while-revalidate` from the
 * edge — the Stage 1 cache target. (A Cache-Control set in next.config
 * headers() is overwritten for prerendered pages, so this is the honest way.)
 */
export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { city: slug } = await params;
  const city = getCity(slug);
  if (!city) return {};
  const title = `Hardwood Flooring & Stairs in ${titleNameOf(city)}`;
  const description = clampDescription(
    `Hardwood floors, custom stairs, and railings in ${city.name}. ${city.blurb}`,
  );
  return {
    title,
    description,
    keywords: [
      `hardwood flooring ${city.name}`,
      `hardwood installation ${city.name}`,
      `hardwood stairs ${city.name}`,
      `hardwood refinishing ${city.name}`,
      `stair treads ${city.name}`,
    ],
    alternates: { canonical: `/areas/${city.slug}` },
    openGraph: {
      title: `${title} | Green Hardwood`,
      description,
      url: `/areas/${city.slug}`,
    },
  };
}

export default async function CityPage({ params }: { params: Promise<Params> }) {
  const { city: slug } = await params;
  const city = getCity(slug);
  if (!city) notFound();
  const localProjects = projects.filter((p) => p.citySlug === city.slug);
  const servicePages = matrixForCity(city.slug);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Areas", path: "/areas" },
    { name: city.name, path: `/areas/${city.slug}` },
  ];
  const cityFaqs = [
    {
      q: `How much does hardwood flooring cost in ${city.name}?`,
      // Bands come from data/services.ts. They used to be retyped here, which
      // put the number on 32 city pages one edit away from the service pages.
      a: `In ${city.name}, plan on ${priceBandOf("hardwood-installation")} and ${priceBandOf(
        "sanding-refinishing",
      )} to refinish, before stairs. Stairs run ${priceBandOf(
        "hardwood-stairs",
      )}. Use the estimator, then book a free measure in ${city.name} for a firm number.`,
    },
    {
      q: `Do you install hardwood stairs in ${city.name}?`,
      a: `Yes. Carpet-to-oak conversions, box stairs, walnut features, and railings that meet Ontario Building Code are core work in ${city.name}. We do not subcontract the stair.`,
    },
    {
      q: `Is Green Hardwood a local ${city.name} hardwood company?`,
      a: `Green Hardwood is a Toronto shop serving ${city.name} and the rest of the GTA. Site visits in ${city.name} are free for qualified hardwood, stair, and railing work.`,
    },
  ];

  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd
        data={webPageLd({
          name: `Hardwood Flooring, Stairs & Railings in ${city.name}`,
          description: city.blurb,
          path: `/areas/${city.slug}`,
        })}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: `Hardwood flooring in ${city.name}`,
          areaServed: { "@type": "City", name: city.name },
          provider: { "@id": `${SITE_URL}/#business` },
          description: city.blurb,
        }}
      />
      <JsonLd data={faqLd(cityFaqs)} />
      <section className="border-b border-border bg-bg-warm">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Breadcrumbs items={crumbs} className="pt-4" />
        </div>
        <div className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
          <p className="text-xs tracking-[0.18em] text-accent uppercase">
            {city.region} · Green Hardwood
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl leading-[1.08] font-medium sm:text-5xl">
            Hardwood flooring, stairs, and railings in {city.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">{city.blurb}</p>
          <Button asChild className="mt-6">
            <Link href={`/estimate?city=${city.slug}`}>Estimate a {city.name} project</Link>
          </Button>
        </div>
      </section>
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-12 sm:py-16 sm:px-6 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="space-y-5">
          <h2 className="font-display text-3xl">The housing stock we walk into</h2>
          <p className="text-muted">{city.housing}</p>
          <h2 className="font-display text-3xl">Typical {city.name} specification</h2>
          <p className="text-muted">{city.typical}</p>
          <h2 className="font-display text-3xl">Jobs we keep getting called for</h2>
          <ul className="list-disc space-y-2 pl-5 text-muted">
            {city.jobs.map((job) => (
              <li key={job}>{job}</li>
            ))}
          </ul>
          <h2 className="font-display text-3xl">Services in {city.name}</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {servicePages.map((p) => (
              <li key={p.path}>
                <Link href={p.path} className="text-primary hover:underline">
                  {p.service.name} in {city.name}
                </Link>
              </li>
            ))}
          </ul>
          {localProjects.length > 0 && (
            <div>
              <h2 className="font-display text-3xl">Work nearby</h2>
              <div className="mt-4 grid gap-4">
                {localProjects.map((p) => (
                  <div
                    key={p.slug}
                    className="overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-card)]"
                  >
                    <Photo
            src={p.image}
            alt={p.imageAlt}
            ratio="16/8"
            slot="half"
          />
                    <div className="p-4">
                      <h3 className="font-display text-xl">{p.title}</h3>
                      <p className="mt-1 text-sm text-muted">{p.summary}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div>
            <h2 className="font-display text-3xl">Questions from {city.name}</h2>
            <Accordion type="single" collapsible className="mt-4">
              {cityFaqs.map((f) => (
                <AccordionItem key={f.q} value={f.q}>
                  <AccordionTrigger>{f.q}</AccordionTrigger>
                  <AccordionContent>{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </article>
        <aside className="h-fit rounded-xl bg-surface p-6 shadow-[var(--shadow-card)]">
          <h2 className="font-display text-2xl">On-site in {city.name}</h2>
          <p className="mt-2 mb-4 text-sm text-muted">{tierNote(city)}</p>
          <QuoteForm />
        </aside>
      </div>
    </>
  );
}
