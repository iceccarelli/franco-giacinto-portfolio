import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { glossary } from "@/data/glossary";
import { breadcrumbLd, webPageLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site-url";

const description =
  "Plain definitions for the hardwood terms on a quote: nail-down, glue-down, acclimation, nosing, stringer, Janka, screen-and-recoat, and the rest.";

export const metadata: Metadata = {
  title: "Hardwood Flooring & Stair Glossary",
  description,
  keywords: [
    "hardwood flooring terms",
    "stair terminology",
    "what is a stair nosing",
    "what is acclimation hardwood",
    "hardwood glossary",
  ],
  alternates: { canonical: "/glossary" },
  openGraph: {
    title: "Hardwood Flooring & Stair Glossary | Green Hardwood",
    description,
    url: "/glossary",
  },
};

/**
 * One page, every term, anchor-addressable.
 *
 * Twenty-two definitions of one to three sentences each would make twenty-two
 * pages too thin to rank and too thin to deserve to. As a single DefinedTermSet
 * this is a stronger document: it ranks as one substantial page, an answer
 * engine retrieves the whole vocabulary in one fetch, and every term is still
 * directly linkable at /glossary#term-slug.
 */

const clusters = [
  { id: "installation", label: "Installation", blurb: "How the floor meets the building." },
  {
    id: "stairs",
    label: "Stairs",
    blurb: "The parts of a flight, and what they are called on a drawing.",
  },
  { id: "finish", label: "Finish", blurb: "What goes on top, and how long it lasts." },
  { id: "code", label: "Code & measurement", blurb: "The words an inspector uses." },
] as const;

export default function GlossaryPage() {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Glossary", path: "/glossary" },
  ];

  const byslug = new Map(glossary.map((t) => [t.slug, t]));

  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd
        data={webPageLd({
          name: "Hardwood Flooring & Stair Glossary",
          description,
          path: "/glossary",
        })}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "DefinedTermSet",
          "@id": `${SITE_URL}/glossary#set`,
          name: "Green Hardwood — hardwood flooring and stair glossary",
          description,
          url: `${SITE_URL}/glossary`,
          hasDefinedTerm: glossary.map((t) => ({
            "@type": "DefinedTerm",
            "@id": `${SITE_URL}/glossary#${t.slug}`,
            name: t.term,
            description: t.definition,
            inDefinedTermSet: `${SITE_URL}/glossary#set`,
            url: `${SITE_URL}/glossary#${t.slug}`,
          })),
        }}
      />

      <PageHero
        kicker="Glossary"
        title="Every word on a hardwood quote, in plain English."
        lede="If a contractor uses a term you have not met before and does not explain it, that is a choice. Here is the whole vocabulary — twenty-two terms, no jargon defended with more jargon."
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Breadcrumbs items={crumbs} />
      </div>

      <div className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        {/* Jump list — an on-page index doubles as a crawlable link graph. */}
        <nav
          aria-label="Jump to a term"
          className="rounded-xl bg-surface p-5 shadow-[var(--shadow-card)]"
        >
          <p className="text-xs tracking-[0.16em] text-muted uppercase">All terms</p>
          <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-sm">
            {[...glossary]
              .sort((a, b) => a.term.localeCompare(b.term))
              .map((t) => (
                <li key={t.slug}>
                  <a href={`#${t.slug}`} className="text-primary hover:underline">
                    {t.term}
                  </a>
                </li>
              ))}
          </ul>
        </nav>

        {clusters.map((cluster) => {
          const inCluster = glossary.filter((t) => t.cluster === cluster.id);
          if (inCluster.length === 0) return null;

          return (
            <section key={cluster.id} className="mt-12">
              <h2 className="font-display text-3xl">{cluster.label}</h2>
              <p className="mt-1 text-muted">{cluster.blurb}</p>
              <dl className="mt-6 space-y-8">
                {inCluster.map((t) => (
                  <div key={t.slug} id={t.slug} className="scroll-mt-24">
                    <dt className="font-display text-2xl">
                      {t.term}
                      <a
                        href={`#${t.slug}`}
                        aria-label={`Link to ${t.term}`}
                        className="ml-2 text-base text-muted opacity-0 transition-opacity hover:opacity-100 focus:opacity-100"
                      >
                        #
                      </a>
                    </dt>
                    <dd className="mt-1">
                      <p className="text-sm text-accent">{t.short}</p>
                      <p className="mt-2 text-muted">{t.definition}</p>
                      {t.seeAlso.length > 0 && (
                        <p className="mt-2 text-sm text-muted">
                          See also:{" "}
                          {t.seeAlso.map((ref, i) => {
                            const target = byslug.get(ref);
                            return (
                              <span key={ref}>
                                {i > 0 && ", "}
                                {target ? (
                                  <a href={`#${ref}`} className="text-primary hover:underline">
                                    {target.term}
                                  </a>
                                ) : (
                                  ref
                                )}
                              </span>
                            );
                          })}
                        </p>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          );
        })}

        <p className="mt-14 text-sm text-muted">
          These words in context:{" "}
          <Link href="/methods" className="text-primary hover:underline">
            methods
          </Link>{" "}
          shows the assemblies,{" "}
          <Link href="/stairs" className="text-primary hover:underline">
            the stair studio
          </Link>{" "}
          runs the Ontario code checks, and{" "}
          <Link href="/answers" className="text-primary hover:underline">
            answers
          </Link>{" "}
          covers the questions that usually come next.
        </p>
      </div>
    </>
  );
}
