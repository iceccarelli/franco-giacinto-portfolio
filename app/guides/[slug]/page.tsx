import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { Button } from "@/components/ui/button";
import { getGuide, guides, updatedIso } from "@/data/guides";
import { breadcrumbLd, clampDescription } from "@/lib/seo";
import { SITE_URL } from "@/lib/site-url";
import { Breadcrumbs } from "@/components/breadcrumbs";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return guides.map((g) => ({ slug: g.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  const description = clampDescription(guide.description);

  return {
    title: guide.title,
    description,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: {
      title: `${guide.title} | Green Hardwood`,
      description,
      url: `/guides/${guide.slug}`,
      type: "article",
    },
  };
}

export default async function GuidePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  // One array, used for both the visible trail and the JSON-LD. This page
  // emitted BreadcrumbList markup with no breadcrumbs on screen — the only
  // detail route on the site that did. Google asks for the two to correspond.
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Guides", path: "/guides" },
    { name: guide.title, path: `/guides/${guide.slug}` },
  ];

  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          "@id": `${SITE_URL}/guides/${guide.slug}#article`,
          headline: guide.title,
          description: guide.description,
          // Was the string "2026-08-27" on all nineteen guides. Now derived
          // from the date the page itself shows the reader.
          dateModified: updatedIso(guide),
          datePublished: updatedIso(guide),
          mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/guides/${guide.slug}` },
          inLanguage: "en-CA",
          publisher: { "@id": `${SITE_URL}/#business` },
          author: { "@id": `${SITE_URL}/#business` },
        }}
      />
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <Breadcrumbs items={crumbs} className="mb-6" />
        <p className="text-xs tracking-[0.18em] text-accent uppercase">
          {guide.kicker} · {guide.read} · Updated {guide.updated}
        </p>
        <h1 className="mt-3 font-display text-4xl leading-[1.08] font-medium sm:text-5xl">{guide.title}</h1>
        <p className="mt-4 text-lg text-muted">{guide.description}</p>
        {guide.sections.map((section) => (
          <section key={section.heading} className="mt-10">
            <h2 className="font-display text-2xl">{section.heading}</h2>
            {section.paragraphs.map((p) => (
              <p key={p.slice(0, 32)} className="mt-3 text-muted">
                {p}
              </p>
            ))}
          </section>
        ))}
        <div className="mt-12 rounded-xl bg-primary p-6 text-primary-fg">
          <h2 className="font-display text-2xl">Want the number for your house?</h2>
          <p className="mt-2 text-sm text-primary-fg/75">
            Estimator first. Site moisture reading second. That is the only honest sequence.
          </p>
          <Button asChild variant="invert" className="mt-4">
            <Link href="/estimate">Open the estimator</Link>
          </Button>
        </div>
      </article>
    </>
  );
}
