import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { Button } from "@/components/ui/button";
import { getGuide, guides } from "@/data/guides";
import { breadcrumbLd } from "@/lib/seo";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return guides.map((g) => ({ slug: g.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: {
      title: `${guide.title} | Green Hardwood`,
      description: guide.description,
      url: `/guides/${guide.slug}`,
      type: "article",
    },
  };
}

export default async function GuidePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Guides", path: "/guides" },
          { name: guide.title, path: `/guides/${guide.slug}` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: guide.title,
          description: guide.description,
          dateModified: "2026-08-27",
          author: { "@type": "Organization", name: "Green Hardwood" },
        }}
      />
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <p className="text-xs tracking-[0.18em] text-accent uppercase">
          {guide.kicker} · {guide.read} · Updated {guide.updated}
        </p>
        <h1 className="mt-3 font-display text-4xl leading-[1.1] sm:text-5xl">{guide.title}</h1>
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
