import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Check } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { QuoteForm } from "@/components/estimate/quote-form";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { projects } from "@/data/projects";
import { getService, seoNameOf, services } from "@/data/services";
import { breadcrumbLd, clampDescription, faqLd, serviceLd, webPageLd } from "@/lib/seo";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { isMatrixService, matrixForService } from "@/data/matrix";
import { methods } from "@/data/methods";

const categoryMap: Record<string, (typeof projects)[number]["category"]> = {
  "hardwood-installation": "install",
  "hardwood-stairs": "stairs",
  "hardwood-railings": "stairs",
  "sanding-refinishing": "refinish",
  "hardwood-repairs": "repair",
  "hardwood-decks": "deck",
  "custom-inlays": "custom",
  "commercial-hardwood": "commercial",
};

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return services.map((s) => ({ slug: s.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  const title = `${seoNameOf(service)} Toronto & GTA`;
  const description = clampDescription(service.summary);

  return {
    title,
    description,
    keywords: service.keywords,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: `${title} | Green Hardwood`,
      description,
      url: `/services/${service.slug}`,
      images: [{ url: service.image, alt: service.imageAlt }],
    },
  };
}

export default async function ServicePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  const others = services.filter((s) => s.slug !== service.slug).slice(0, 3);
  const cityPages = isMatrixService(service.slug) ? matrixForService(service.slug) : [];
  const serviceMethods = methods.filter((m) => m.relatedService === service.slug);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: service.shortName, path: `/services/${service.slug}` },
  ];
  const related = projects.filter((p) => p.category === categoryMap[service.slug]).slice(0, 2);

  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd
        data={webPageLd({
          name: `${service.name} Toronto & GTA`,
          description: service.summary,
          path: `/services/${service.slug}`,
          primaryImage: service.image,
        })}
      />
      <JsonLd data={serviceLd(service)} />
      <JsonLd data={faqLd(service.faqs)} />
      <section className="border-b border-border bg-bg-warm">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Breadcrumbs items={crumbs} className="pt-4" />
        </div>
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 pb-10 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="text-xs tracking-[0.18em] text-accent uppercase">{service.eyebrow}</p>
            <h1 className="mt-3 font-display text-4xl leading-[1.08] sm:text-5xl">
              {service.headline}
            </h1>
            <p className="mt-4 text-lg text-muted">{service.summary}</p>
            <p className="mt-4 text-sm font-medium text-primary">
              {service.priceFrom} · {service.duration}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/estimate">Estimate this work</Link>
              </Button>
              {service.slug === "hardwood-stairs" && (
                <Button asChild variant="outline">
                  <Link href="/stairs">Stair studio</Link>
                </Button>
              )}
              <Button asChild variant="outline">
                <Link href="/portfolio">See related projects</Link>
              </Button>
            </div>
          </div>
          <img
            src={service.image}
            alt={service.imageAlt}
            className="aspect-[4/3] w-full rounded-xl object-cover shadow-[var(--shadow-card)]"
          />
        </div>
      </section>
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[1.3fr_0.7fr]">
        <article>
          <ul className="space-y-3">
            {service.bullets.map((b) => (
              <li key={b} className="flex gap-3">
                <Check className="mt-1 size-4 shrink-0 text-accent" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 space-y-4 text-muted">
            {service.body.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          {related.length > 0 && (
            <div className="mt-10">
              <h2 className="font-display text-2xl">Related GTA work</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {related.map((p) => (
                  <article
                    key={p.slug}
                    className="overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-card)]"
                  >
                    <img
                      src={p.image}
                      alt={p.imageAlt}
                      className="aspect-[16/10] w-full object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-display text-lg">{p.title}</h3>
                      <p className="mt-1 text-sm text-muted">{p.summary}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
          {serviceMethods.length > 0 && (
            <div className="mt-10">
              <h2 className="font-display text-2xl">How we do it</h2>
              <p className="mt-2 text-sm text-muted">
                The assemblies behind this service, documented step by step.
              </p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {serviceMethods.map((m) => (
                  <li key={m.slug}>
                    <Link
                      href={`/methods/${m.slug}`}
                      className="block rounded-xl bg-surface p-4 shadow-[var(--shadow-card)] transition-colors hover:bg-bg-warm"
                    >
                      <p className="font-medium">{m.name}</p>
                      <p className="mt-1 text-sm text-muted">{m.headline}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {service.faqs.length > 0 && (
            <div className="mt-10">
              <h2 className="font-display text-2xl">
                Questions about {service.shortName.toLowerCase()}
              </h2>
              <Accordion type="single" collapsible className="mt-4">
                {service.faqs.map((f) => (
                  <AccordionItem key={f.q} value={f.q}>
                    <AccordionTrigger>{f.q}</AccordionTrigger>
                    <AccordionContent>{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </article>
        <aside className="h-fit rounded-xl bg-surface p-6 shadow-[var(--shadow-card)]">
          <h2 className="font-display text-2xl">Book the site visit</h2>
          <p className="mt-2 mb-4 text-sm text-muted">
            Free inside the GTA for qualified {service.shortName.toLowerCase()} work.
          </p>
          <QuoteForm
            defaultService={
              service.slug.includes("stair")
                ? "stairs"
                : service.slug.includes("rail")
                  ? "railings"
                  : service.slug.includes("refin")
                    ? "refinish"
                    : service.slug.includes("repair")
                      ? "repair"
                      : service.slug.includes("deck")
                        ? "deck"
                        : "install"
            }
          />
        </aside>
      </div>
      {cityPages.length > 0 && (
        <section className="border-t border-border bg-bg-warm">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <h2 className="font-display text-2xl">{service.shortName} city by city</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted">
              Housing stock, local price band, and the jobs we actually get called for — written per
              city, because a King West slab is not a Forest Hill joist.
            </p>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {cityPages.map((p) => (
                <li key={p.path}>
                  <Link
                    href={p.path}
                    className="block rounded-lg bg-surface px-4 py-3 text-sm shadow-[var(--shadow-card)] transition-colors hover:bg-bg"
                  >
                    <span className="font-medium">
                      {service.shortName} in {p.city.name}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted">{p.city.region}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <h2 className="font-display text-2xl">Also in the shop</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {others.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="rounded-xl bg-surface p-5 shadow-[var(--shadow-card)]"
              >
                <h3 className="font-display text-xl">{s.shortName}</h3>
                <p className="mt-2 text-sm text-muted">{s.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
