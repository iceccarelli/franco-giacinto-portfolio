import type { Metadata } from "next";
import { Photo } from "@/components/photo";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, X } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { answers } from "@/data/answers";
import { company } from "@/data/company";
import { getGuide } from "@/data/guides";
import { EQUIPMENT_IMAGE_DISCLOSURE, equipment } from "@/data/equipment";
import { getMethod, methods } from "@/data/methods";
import { getService } from "@/data/services";
import { breadcrumbLd, clampDescription, faqLd, webPageLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site-url";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return methods.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const method = getMethod(slug);
  if (!method) return {};
  const description = clampDescription(method.summary);

  return {
    title: `${method.name} — Method`,
    description,
    alternates: { canonical: `/methods/${method.slug}` },
    openGraph: {
      title: `${method.name} | Green Hardwood`,
      description,
      url: `/methods/${method.slug}`,
      type: "article",
      images: [{ url: method.image, alt: method.imageAlt }],
    },
  };
}

export default async function MethodPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const method = getMethod(slug);
  if (!method) notFound();

  const service = getService(method.relatedService);
  const guides = method.relatedGuides.map(getGuide).filter((g) => g !== undefined);
  const siblings = methods.filter((m) => m.cluster === method.cluster && m.slug !== method.slug);
  const kit = equipment.filter((e) => e.relatedMethods.includes(method.slug));
  const relatedAnswers = answers
    .filter((a) => a.primaryService === method.relatedService)
    .slice(0, 4);

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Methods", path: "/methods" },
    { name: method.name, path: `/methods/${method.slug}` },
  ];

  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd
        data={webPageLd({
          name: method.name,
          description: method.summary,
          path: `/methods/${method.slug}`,
          primaryImage: method.image,
        })}
      />
      {method.faqs.length > 0 && <JsonLd data={faqLd(method.faqs)} />}
      {/* HowTo describes a procedure. Every step here is one we actually perform. */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: method.name,
          description: method.summary,
          image: `${SITE_URL}${method.image}`,
          supply: {
            "@type": "HowToSupply",
            name: "Solid or engineered hardwood, to specification",
          },
          tool: { "@type": "HowToTool", name: "Moisture meter, flooring nailer or trowel, saws" },
          performer: { "@id": `${SITE_URL}/#business` },
          step: method.steps.map((s, i) => ({
            "@type": "HowToStep",
            position: i + 1,
            name: s.heading,
            text: s.body,
          })),
        }}
      />

      <section className="border-b border-border bg-bg-warm">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Breadcrumbs items={crumbs} className="pt-4" />
        </div>
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 pb-10 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="text-xs tracking-[0.18em] text-accent uppercase">
              Method · {method.cluster}
            </p>
            <h1 className="mt-3 font-display text-4xl leading-[1.08] font-medium sm:text-5xl">{method.name}</h1>
            <p className="mt-4 text-lg text-muted">{method.headline}</p>
            <p className="mt-3 text-muted">{method.summary}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {service && (
                <Button asChild>
                  <Link href={`/services/${service.slug}`}>{service.shortName} service</Link>
                </Button>
              )}
              <Button asChild variant="outline">
                <Link href="/estimate">Price this work</Link>
              </Button>
            </div>
          </div>
          <Photo
            src={method.image}
            alt={method.imageAlt}
            ratio="16/10"
            slot="half"
            priority
            className="rounded-xl shadow-[var(--shadow-card)]"
          />
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-12 sm:py-16 sm:px-6 lg:grid-cols-[1.3fr_0.7fr]">
        <article>
          <h2 className="font-display text-3xl">How it is done</h2>
          <ol className="mt-6 space-y-6">
            {method.steps.map((s, i) => (
              <li key={s.heading} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary font-display text-sm text-primary-fg tabular-nums"
                >
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-display text-xl">{s.heading}</h3>
                  <p className="mt-1 text-muted">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            <div className="rounded-xl bg-surface p-5 shadow-[var(--shadow-card)]">
              <div className="flex items-center gap-2 text-accent">
                <Check className="size-4" aria-hidden="true" />
                <h2 className="text-xs tracking-[0.16em] uppercase">Correct when</h2>
              </div>
              <p className="mt-2 text-sm text-muted">{method.when}</p>
            </div>
            <div className="rounded-xl bg-surface p-5 shadow-[var(--shadow-card)]">
              <div className="flex items-center gap-2 text-primary">
                <X className="size-4" aria-hidden="true" />
                <h2 className="text-xs tracking-[0.16em] uppercase">Wrong when</h2>
              </div>
              <p className="mt-2 text-sm text-muted">{method.whenNot}</p>
            </div>
          </div>

          {method.faqs.length > 0 && (
            <div className="mt-10">
              <h2 className="font-display text-2xl">Questions about this method</h2>
              <Accordion type="single" collapsible className="mt-4">
                {method.faqs.map((f) => (
                  <AccordionItem key={f.q} value={f.q}>
                    <AccordionTrigger>{f.q}</AccordionTrigger>
                    <AccordionContent>{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}

          {kit.length > 0 && (
            <div className="mt-10">
              <h2 className="font-display text-2xl">What this method runs on</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {kit.map((e) => (
                  <li key={e.slug}>
                    <Link
                      href={`/equipment/${e.slug}`}
                      className="flex gap-4 overflow-hidden rounded-xl bg-surface p-4 shadow-[var(--shadow-card)] transition-colors hover:bg-bg-warm"
                    >
                      {/*
                        A static seeded thumbnail, not a rotator. Six drifting
                        tiles in a cross-link list is motion competing with the
                        page it is meant to serve.
                      */}
                      <Photo
                        src={e.image}
                        alt={e.imageAlt}
                        ratio="1/1"
                        slot="thumb"
                        seed={e.slug}
                        className="size-20 shrink-0 rounded-lg"
                      />
                      <span className="min-w-0">
                        <span className="block font-medium">{e.name}</span>
                        <span className="mt-1 block text-sm text-muted">{e.summary}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-muted">{EQUIPMENT_IMAGE_DISCLOSURE}</p>
            </div>
          )}

          {guides.length > 0 && (
            <div className="mt-10">
              <h2 className="font-display text-2xl">Read further</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {guides.map((g) => (
                  <li key={g.slug}>
                    <Link
                      href={`/guides/${g.slug}`}
                      className="block rounded-xl bg-surface p-4 shadow-[var(--shadow-card)] transition-colors hover:bg-bg-warm"
                    >
                      <p className="font-medium">{g.title}</p>
                      <p className="mt-1 text-sm text-muted">{g.description}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </article>

        <aside className="space-y-6">
          {service && (
            <div className="rounded-xl bg-surface p-6 shadow-[var(--shadow-card)]">
              <h2 className="font-display text-xl">{service.name}</h2>
              <p className="mt-2 text-sm text-muted">{service.summary}</p>
              <p className="mt-3 text-sm font-medium text-primary">{service.priceFrom}</p>
              <p className="text-sm text-muted">{service.duration}</p>
              <Button asChild variant="outline" className="mt-4 w-full">
                <Link href={`/services/${service.slug}`}>Service detail</Link>
              </Button>
            </div>
          )}

          {relatedAnswers.length > 0 && (
            <div className="rounded-xl bg-surface p-6 shadow-[var(--shadow-card)]">
              <h2 className="font-display text-xl">Quick answers</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {relatedAnswers.map((a) => (
                  <li key={a.slug}>
                    <Link href={`/answers/${a.slug}`} className="text-primary hover:underline">
                      {a.q}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {siblings.length > 0 && (
            <div className="rounded-xl bg-surface p-6 shadow-[var(--shadow-card)]">
              <h2 className="font-display text-xl">Other {method.cluster} methods</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {siblings.map((m) => (
                  <li key={m.slug}>
                    <Link href={`/methods/${m.slug}`} className="text-primary hover:underline">
                      {m.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-xl bg-primary p-6 text-primary-fg">
            <h2 className="font-display text-xl">Have this specified properly</h2>
            <p className="mt-2 text-sm text-primary-fg/75">
              We bring a moisture meter to the first visit. {company.warranty}.
            </p>
            <Button asChild variant="invert" className="mt-4 w-full">
              <Link href="/estimate">Book a free measure</Link>
            </Button>
          </div>
        </aside>
      </div>
    </>
  );
}
