import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { answers } from "@/data/answers";
import { services } from "@/data/services";
import { breadcrumbLd, faqLd, webPageLd } from "@/lib/seo";

const description =
  "Straight answers on hardwood stairs and installation in Toronto and the GTA: what it costs, what passes code, what we will and will not do.";

export const metadata: Metadata = {
  title: "Hardwood Questions, Answered",
  description,
  keywords: [
    "hardwood stairs questions",
    "hardwood installation questions Toronto",
    "how much do hardwood stairs cost",
    "carpet to hardwood stairs",
    "hardwood flooring FAQ GTA",
  ],
  alternates: { canonical: "/answers" },
  openGraph: {
    title: "Hardwood Questions, Answered | Green Hardwood",
    description,
    url: "/answers",
  },
};

/**
 * Both an index and a citable document. Every answer is rendered in full here,
 * with FAQPage schema over the whole set, so an answer engine can retrieve the
 * page once and quote any of the 28 without crawling 28 URLs.
 */
export default function AnswersIndex() {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Answers", path: "/answers" },
  ];

  const groups = [
    { id: "hardwood-stairs", label: "Hardwood stairs" },
    { id: "hardwood-installation", label: "Hardwood installation" },
    { id: "hardwood-railings", label: "Railings" },
    { id: "sanding-refinishing", label: "Sanding & refinishing" },
    { id: "hardwood-repairs", label: "Repairs" },
    { id: "general", label: "General" },
  ];

  const nameOf = (id: string) => services.find((s) => s.slug === id)?.shortName;

  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd
        data={webPageLd({ name: "Hardwood Questions, Answered", description, path: "/answers" })}
      />
      <JsonLd data={faqLd(answers.map((a) => ({ q: a.q, a: a.a })))} />

      <PageHero
        kicker="Answers"
        title="The questions people actually type, answered without a sales detour."
        lede="Every answer here is the short version of a page that goes deeper. Nothing is hedged to keep you on the phone — where the honest answer is “not us”, it says so."
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Breadcrumbs items={crumbs} />
      </div>

      <div className="mx-auto max-w-3xl space-y-12 px-4 pb-16 sm:px-6">
        {groups.map((group) => {
          const inGroup = answers.filter((a) => a.primaryService === group.id);
          if (inGroup.length === 0) return null;
          const servicePath = group.id === "general" ? null : `/services/${group.id}`;

          return (
            <section key={group.id}>
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 className="font-display text-3xl">{group.label}</h2>
                {servicePath && (
                  <Link href={servicePath} className="text-sm text-primary hover:underline">
                    {nameOf(group.id)} service →
                  </Link>
                )}
              </div>
              <dl className="mt-6 space-y-7">
                {inGroup.map((a) => (
                  <div key={a.slug}>
                    <dt className="font-display text-xl">
                      <Link href={`/answers/${a.slug}`} className="hover:text-primary">
                        {a.q}
                      </Link>
                    </dt>
                    <dd className="mt-2 text-muted">{a.a}</dd>
                  </div>
                ))}
              </dl>
            </section>
          );
        })}

        <p className="text-sm text-muted">
          Still unanswered? The{" "}
          <Link href="/methods" className="text-primary hover:underline">
            methods
          </Link>{" "}
          pages document how each job is performed, the{" "}
          <Link href="/guides" className="text-primary hover:underline">
            guides
          </Link>{" "}
          go long on specification, and{" "}
          <Link href="/for-agents" className="text-primary hover:underline">
            /for-agents
          </Link>{" "}
          carries the canonical facts for AI assistants.
        </p>
      </div>
    </>
  );
}
