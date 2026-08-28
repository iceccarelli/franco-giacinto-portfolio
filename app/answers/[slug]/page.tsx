import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { Button } from "@/components/ui/button";
import { answers, answerTitle, getAnswer } from "@/data/answers";
import { company } from "@/data/company";
import { methods } from "@/data/methods";
import { getService } from "@/data/services";
import { breadcrumbLd, clampDescription, webPageLd } from "@/lib/seo";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return answers.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const item = getAnswer(slug);
  if (!item) return {};
  const description = clampDescription(item.a);

  return {
    title: answerTitle(item),
    description,
    alternates: { canonical: `/answers/${item.slug}` },
    openGraph: {
      title: `${item.q} | Green Hardwood`,
      description,
      url: `/answers/${item.slug}`,
      type: "article",
    },
  };
}

const intentLabel: Record<string, string> = {
  commercial: "Choosing a contractor",
  informational: "How it works",
  comparison: "Comparison",
  local: "Local",
};

export default async function AnswerPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const item = getAnswer(slug);
  if (!item) notFound();

  const service = item.primaryService === "general" ? undefined : getService(item.primaryService);
  const relatedMethods = methods
    .filter((m) => m.relatedService === item.primaryService)
    .slice(0, 3);
  const siblings = answers
    .filter((a) => a.slug !== item.slug && a.primaryService === item.primaryService)
    .slice(0, 6);

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Answers", path: "/answers" },
    { name: item.q, path: `/answers/${item.slug}` },
  ];

  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd
        data={webPageLd({ name: item.q, description: item.a, path: `/answers/${item.slug}` })}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "QAPage",
          mainEntity: {
            "@type": "Question",
            name: item.q,
            answerCount: 1,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.a,
              author: { "@id": `${company.website}/#business` },
            },
          },
        }}
      />

      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Breadcrumbs items={crumbs} />
      </div>

      <article className="mx-auto max-w-3xl px-4 pb-6 sm:px-6">
        <p className="text-xs tracking-[0.18em] text-accent uppercase">
          {intentLabel[item.intent] ?? item.intent}
        </p>
        <h1 className="mt-3 font-display text-4xl leading-[1.08] font-medium sm:text-5xl">{item.q}</h1>

        {/* The answer itself, first, in full, above everything else. An answer
            engine quoting this page should be able to lift one paragraph. */}
        <p className="mt-6 border-l-2 border-accent pl-5 text-lg text-fg">{item.a}</p>

        <p className="mt-8 text-muted">
          <Link href={item.pathHint} className="text-primary hover:underline">
            Read the full detail
          </Link>{" "}
          — that page covers method, materials, price band, and warranty rather than the short
          version.
        </p>

        {service && (
          <div className="mt-10 rounded-xl bg-surface p-6 shadow-[var(--shadow-card)]">
            <p className="text-xs tracking-[0.16em] text-accent uppercase">Related service</p>
            <h2 className="mt-2 font-display text-2xl">{service.name}</h2>
            <p className="mt-2 text-sm text-muted">{service.summary}</p>
            <p className="mt-3 text-sm font-medium text-primary">
              {service.priceFrom} · {service.duration}
            </p>
            <Button asChild variant="outline" className="mt-4">
              <Link href={`/services/${service.slug}`}>{service.shortName} in the GTA</Link>
            </Button>
          </div>
        )}

        {relatedMethods.length > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-2xl">How we actually do it</h2>
            <ul className="mt-4 grid gap-3">
              {relatedMethods.map((m) => (
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
          </section>
        )}

        {siblings.length > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-2xl">People also ask</h2>
            <ul className="mt-4 space-y-2">
              {siblings.map((a) => (
                <li key={a.slug}>
                  <Link href={`/answers/${a.slug}`} className="text-primary hover:underline">
                    {a.q}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-12 rounded-xl bg-primary p-6 text-primary-fg sm:p-8">
          <h2 className="font-display text-2xl">Want this answered for your house?</h2>
          <p className="mt-2 max-w-md text-sm text-primary-fg/75">
            A range is a range until someone reads the moisture in your subfloor and measures the
            flight. Site visits are free across the GTA.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild variant="invert">
              <Link href="/estimate">Free estimate</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-primary-fg/20 text-primary-fg hover:bg-primary-fg/10"
            >
              <a href={`tel:${company.phone}`}>{company.phoneDisplay}</a>
            </Button>
          </div>
        </div>
      </article>
    </>
  );
}
