import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { company } from "@/data/company";
import { problemCategories, problems, problemTitle } from "@/data/problems";
import { breadcrumbLd, itemListLd, webPageLd } from "@/lib/seo";

const description =
  "Diagnose a hardwood floor or stair: cupping, gaps, squeaks, peeling finish, loose railings. What causes it, whether it can be fixed, and when to call.";

export const metadata: Metadata = {
  title: "Diagnose a Hardwood Floor or Stair Problem",
  description,
  keywords: [
    "hardwood floor problems",
    "why is my hardwood floor cupping",
    "squeaking stairs",
    "gaps in hardwood floor",
    "peeling floor finish",
    "loose stair railing",
  ],
  alternates: { canonical: "/problems" },
  openGraph: {
    title: "Diagnose a Hardwood Floor or Stair Problem | Green Hardwood",
    description,
    url: "/problems",
  },
};

const urgencyRank = { urgent: 0, "act-soon": 1, monitor: 2 } as const;

export default function ProblemsIndex() {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Diagnose", path: "/problems" },
  ];

  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd
        data={webPageLd({
          name: "Diagnose a Hardwood Floor or Stair Problem",
          description,
          path: "/problems",
        })}
      />
      <JsonLd
        data={itemListLd(
          problems.map((p) => ({
            name: p.name,
            path: `/problems/${p.slug}`,
            description: p.looksLike,
          })),
          "Green Hardwood — hardwood floor and stair diagnostics",
        )}
      />

      <PageHero
        kicker="Diagnose"
        title="Something is wrong with the floor. Start here."
        lede="Sixteen things that go wrong with hardwood floors and staircases — what each one looks like, what actually causes it, whether it can be fixed, and the point at which it stops being a repair. Including the cases where the honest answer is that the floor is finished."
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Breadcrumbs items={crumbs} />
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="rounded-xl bg-primary p-6 text-primary-fg sm:p-8">
          <h2 className="font-display text-2xl">Before you read anything else</h2>
          <p className="mt-3 max-w-2xl text-primary-fg/80">
            If there is active water, stop it first. If a stair guard moves when you lean on it,
            keep people off that stair. Everything else on this page can wait until tomorrow; those
            two cannot.
          </p>
          <p className="mt-4 text-sm text-primary-fg/70">
            And one rule that saves more floors than any other:{" "}
            <strong>do not let anyone sand a floor that is still wet.</strong> It is the most
            expensive mistake in hardwood, and it is almost always made with good intentions.
          </p>
        </div>

        {problemCategories.map((cat) => {
          const inCat = problems
            .filter((p) => p.category === cat.id)
            .sort((a, b) => urgencyRank[a.urgency] - urgencyRank[b.urgency]);
          if (inCat.length === 0) return null;

          return (
            <section key={cat.id} className="mt-12">
              <h2 className="font-display text-3xl">{cat.label}</h2>
              <p className="mt-1 text-muted">{cat.blurb}</p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {inCat.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/problems/${p.slug}`}
                    className="rounded-xl bg-surface p-5 shadow-[var(--shadow-card)] transition-colors hover:bg-bg-warm"
                  >
                    <p
                      className={`text-xs tracking-[0.16em] uppercase ${
                        p.urgency === "monitor" ? "text-accent" : "text-primary"
                      }`}
                    >
                      {p.urgency === "urgent"
                        ? "Deal with it now"
                        : p.urgency === "act-soon"
                          ? "Act soon"
                          : "Watch it"}
                    </p>
                    <h3 className="mt-1.5 font-display text-xl">{problemTitle(p)}</h3>
                    <p className="mt-2 line-clamp-3 text-sm text-muted">{p.looksLike}</p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        <p className="mt-14 text-sm text-muted">
          Not here? Ask the assistant in the corner, check the{" "}
          <Link href="/answers" className="text-primary hover:underline">
            answers
          </Link>{" "}
          and{" "}
          <Link href="/glossary" className="text-primary hover:underline">
            glossary
          </Link>
          , or call {company.phoneDisplay} and describe it. Photographs help more than words — a
          picture of a tread end-on, or low light raking across a floor, usually settles it.
        </p>
      </div>
    </>
  );
}
