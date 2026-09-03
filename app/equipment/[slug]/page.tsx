import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, Check, Search } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { Button } from "@/components/ui/button";
import { company } from "@/data/company";
import { equipment, equipmentCategories, getEquipment, servicesFor } from "@/data/equipment";
import { getGuide } from "@/data/guides";
import { getMethod } from "@/data/methods";
import { breadcrumbLd, clampDescription, webPageLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site-url";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return equipment.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const item = getEquipment(slug);
  if (!item) return {};
  const description = clampDescription(item.summary);

  return {
    title: `${item.seoTitle} — Equipment`,
    description,
    keywords: item.alsoCalled,
    alternates: { canonical: `/equipment/${item.slug}` },
    openGraph: {
      title: `${item.name} | Green Hardwood`,
      description,
      url: `/equipment/${item.slug}`,
      type: "article",
    },
  };
}

export default async function EquipmentPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const item = getEquipment(slug);
  if (!item) notFound();

  const category = equipmentCategories.find((c) => c.id === item.category);
  const usedOn = servicesFor(item);
  const guides = item.relatedGuides.map(getGuide).filter((g) => g !== undefined);
  const methodsUsing = item.relatedMethods.map(getMethod).filter((m) => m !== undefined);
  const siblings = equipment.filter((e) => e.category === item.category && e.slug !== item.slug);

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Equipment", path: "/equipment" },
    { name: item.name, path: `/equipment/${item.slug}` },
  ];

  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd
        data={webPageLd({
          name: item.name,
          description: item.summary,
          path: `/equipment/${item.slug}`,
        })}
      />
      {/*
        DefinedTerm, not Product. A Product node would assert a thing we own and
        offer for sale; this page asserts a class of machine that the work
        requires. The distinction is the same one that keeps AggregateRating off
        this site until a real testimonial file exists.
      */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "DefinedTerm",
          "@id": `${SITE_URL}/equipment/${item.slug}#term`,
          name: item.name,
          alternateName: item.alsoCalled,
          description: item.summary,
          url: `${SITE_URL}/equipment/${item.slug}`,
          inDefinedTermSet: {
            "@type": "DefinedTermSet",
            name: "Green Hardwood — machinery and tooling",
            url: `${SITE_URL}/equipment`,
          },
        }}
      />

      <section className="border-b border-border bg-bg-warm">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Breadcrumbs items={crumbs} className="pt-4" />
        </div>
        <div className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
          <p className="text-xs tracking-[0.18em] text-accent uppercase">
            Equipment · {category?.label ?? item.category}
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl leading-[1.08] font-medium sm:text-5xl">
            {item.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">{item.summary}</p>
          <p className="mt-3 max-w-2xl text-sm text-muted">
            Also called: {item.alsoCalled.join(", ")}.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/estimate">Price the work it does</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/equipment">All equipment</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.3fr_0.7fr]">
        <article>
          <h2 className="font-display text-3xl">What it does</h2>
          {item.whatItDoes.map((p) => (
            <p key={p.slice(0, 40)} className="mt-4 text-muted">
              {p}
            </p>
          ))}

          <h2 className="mt-10 font-display text-3xl">Why it matters to your floor</h2>
          <ul className="mt-4 space-y-4">
            {item.whyItMatters.map((p) => (
              <li key={p.slice(0, 40)} className="flex gap-3">
                <Check className="mt-1 size-4 shrink-0 text-accent" aria-hidden="true" />
                <span className="text-muted">{p}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 rounded-xl bg-surface p-6 shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-2 text-primary">
              <AlertTriangle className="size-4" aria-hidden="true" />
              <h2 className="text-xs tracking-[0.16em] uppercase">What happens without it</h2>
            </div>
            <p className="mt-3 font-medium">{item.without.instead}</p>
            <p className="mt-2 text-muted">{item.without.consequence}</p>
          </div>

          <div className="mt-10">
            <div className="flex items-center gap-2 text-accent">
              <Search className="size-4" aria-hidden="true" />
              <h2 className="text-xs tracking-[0.16em] uppercase">
                How to tell, before you sign
              </h2>
            </div>
            <ol className="mt-4 space-y-4">
              {item.howToTell.map((p, i) => (
                <li key={p.slice(0, 40)} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary font-display text-sm text-primary-fg tabular-nums"
                  >
                    {i + 1}
                  </span>
                  <span className="text-muted">{p}</span>
                </li>
              ))}
            </ol>
            <p className="mt-6 text-sm text-muted">
              These questions are meant to be asked of everyone quoting you, not only of us. A
              trade that cannot answer them is telling you something useful.
            </p>
          </div>

          {methodsUsing.length > 0 && (
            <div className="mt-10">
              <h2 className="font-display text-2xl">The method it belongs to</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {methodsUsing.map((m) => (
                  <li key={m.slug}>
                    <Link
                      href={`/methods/${m.slug}`}
                      className="block rounded-xl bg-surface p-4 shadow-[var(--shadow-card)] transition-colors hover:bg-bg-warm"
                    >
                      <p className="font-medium">{m.name}</p>
                      <p className="mt-1 text-sm text-muted">{m.summary}</p>
                    </Link>
                  </li>
                ))}
              </ul>
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
          {usedOn.length > 0 && (
            <div className="rounded-xl bg-surface p-6 shadow-[var(--shadow-card)]">
              <h2 className="font-display text-xl">Used on</h2>
              <ul className="mt-3 space-y-3 text-sm">
                {usedOn.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/services/${s.slug}`} className="font-medium text-primary hover:underline">
                      {s.shortName}
                    </Link>
                    <span className="block text-muted">{s.priceFrom}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {siblings.length > 0 && (
            <div className="rounded-xl bg-surface p-6 shadow-[var(--shadow-card)]">
              <h2 className="font-display text-xl">Other {category?.label.toLowerCase()} equipment</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {siblings.map((e) => (
                  <li key={e.slug}>
                    <Link href={`/equipment/${e.slug}`} className="text-primary hover:underline">
                      {e.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-xl border border-border p-6">
            <h2 className="text-xs tracking-[0.16em] text-accent uppercase">What this page is</h2>
            <p className="mt-2 text-sm text-muted">
              A specification of what the work requires, not an inventory. This site does not
              publish an asset list it cannot evidence, so nothing here claims a particular
              machine sits in the Sterling Road shop.
            </p>
          </div>

          <div className="rounded-xl bg-primary p-6 text-primary-fg">
            <h2 className="font-display text-xl">Ask us these questions</h2>
            <p className="mt-2 text-sm text-primary-fg/75">
              We bring a moisture meter to the first visit and quote from what it reads.{" "}
              {company.warranty}.
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
