import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowRight, Clock, Eye, Wrench } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { Button } from "@/components/ui/button";
import { company } from "@/data/company";
import { getGuide } from "@/data/guides";
import { getProblem, problems, problemTitle } from "@/data/problems";
import { getService } from "@/data/services";
import { breadcrumbLd, clampDescription, webPageLd } from "@/lib/seo";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return problems.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const problem = getProblem(slug);
  if (!problem) return {};
  const description = clampDescription(problem.looksLike);

  return {
    title: problemTitle(problem),
    description,
    keywords: [...problem.alsoCalled, `${problem.name} Toronto`, "hardwood floor problem"],
    alternates: { canonical: `/problems/${problem.slug}` },
    openGraph: {
      title: `${problem.name} | Green Hardwood`,
      description,
      url: `/problems/${problem.slug}`,
      type: "article",
    },
  };
}

const urgency = {
  monitor: { label: "Watch it", tone: "text-accent", note: "Not urgent. Worth understanding." },
  "act-soon": {
    label: "Act soon",
    tone: "text-primary",
    note: "The cost of this rises the longer it waits.",
  },
  urgent: {
    label: "Deal with it now",
    tone: "text-primary",
    note: "This one does not wait.",
  },
} as const;

const outlook = {
  repairable: { label: "Usually repairable", tone: "bg-accent/10 text-accent" },
  sometimes: { label: "Depends what caused it", tone: "bg-bg-warm text-fg" },
  replace: { label: "Usually replacement", tone: "bg-primary/10 text-primary" },
} as const;

export default async function ProblemPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const problem = getProblem(slug);
  if (!problem) notFound();

  const service = getService(problem.relatedService);
  const guides = problem.relatedGuides.map(getGuide).filter((g) => g !== undefined);
  const siblings = problems.filter(
    (p) => p.category === problem.category && p.slug !== problem.slug,
  );
  const u = urgency[problem.urgency];
  const o = outlook[problem.outlook];

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Diagnose", path: "/problems" },
    { name: problemTitle(problem), path: `/problems/${problem.slug}` },
  ];

  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd
        data={webPageLd({
          name: problem.name,
          description: problem.looksLike,
          path: `/problems/${problem.slug}`,
        })}
      />
      {/* The causes are the answer to "why", so they carry the FAQ markup. */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: `What causes ${problem.name.toLowerCase()}?`,
              acceptedAnswer: {
                "@type": "Answer",
                text: problem.causes.map((c) => `${c.cause}. ${c.tell}`).join(" "),
              },
            },
            {
              "@type": "Question",
              name: `Can ${problem.name.toLowerCase()} be fixed?`,
              acceptedAnswer: { "@type": "Answer", text: problem.outlookNote },
            },
            {
              "@type": "Question",
              name: "What should I do about it myself?",
              acceptedAnswer: { "@type": "Answer", text: problem.youCanDo.join(" ") },
            },
          ],
        }}
      />

      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Breadcrumbs items={crumbs} />
      </div>

      <article className="mx-auto max-w-4xl px-4 pb-8 sm:px-6">
        <p className={`text-xs tracking-[0.18em] uppercase ${u.tone}`}>
          {u.label} · {u.note}
        </p>
        <h1 className="mt-3 font-display text-4xl leading-[1.1] sm:text-5xl">{problem.name}</h1>
        <p className="mt-2 text-sm text-muted">Also searched as: {problem.alsoCalled.join(", ")}</p>

        {/* What you are looking at ---------------------------------------- */}
        <section className="mt-10">
          <div className="flex items-center gap-2 text-accent">
            <Eye className="size-4" aria-hidden="true" />
            <h2 className="text-xs tracking-[0.16em] uppercase">What it looks like</h2>
          </div>
          <p className="mt-3 text-lg text-fg">{problem.looksLike}</p>
        </section>

        {/* Causes, ranked, each with its tell ------------------------------ */}
        <section className="mt-10">
          <h2 className="font-display text-3xl">What causes it</h2>
          <p className="mt-2 text-muted">
            In rough order of likelihood. Each one has a tell — the observation that separates it
            from the others.
          </p>
          <ol className="mt-6 space-y-5">
            {problem.causes.map((c, i) => (
              <li key={c.cause} className="rounded-xl bg-surface p-5 shadow-[var(--shadow-card)]">
                <div className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary font-display text-xs text-primary-fg tabular-nums"
                  >
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-xl">{c.cause}</h3>
                    <p className="mt-1 text-sm text-muted">
                      <span className="font-medium text-accent">How to tell: </span>
                      {c.tell}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* What it means -------------------------------------------------- */}
        <section className="mt-10">
          <h2 className="font-display text-3xl">What it actually means</h2>
          <p className="mt-3 text-muted">{problem.meaning}</p>
        </section>

        {/* Outlook -------------------------------------------------------- */}
        <section className="mt-10">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-display text-3xl">Can it be fixed?</h2>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${o.tone}`}>
              {o.label}
            </span>
          </div>
          <p className="mt-3 text-muted">{problem.outlookNote}</p>
        </section>

        {/* Homeowner steps ------------------------------------------------ */}
        <section className="mt-10">
          <div className="flex items-center gap-2 text-accent">
            <Wrench className="size-4" aria-hidden="true" />
            <h2 className="text-xs tracking-[0.16em] uppercase">What you can do yourself</h2>
          </div>
          <ul className="mt-4 space-y-3">
            {problem.youCanDo.map((step) => (
              <li key={step} className="flex gap-3 text-muted">
                <ArrowRight className="mt-1 size-4 shrink-0 text-accent" aria-hidden="true" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* When to call --------------------------------------------------- */}
        <section className="mt-10 rounded-xl bg-primary p-6 text-primary-fg sm:p-8">
          <div className="flex items-center gap-2 text-primary-fg/70">
            <AlertTriangle className="size-4" aria-hidden="true" />
            <h2 className="text-xs tracking-[0.16em] uppercase">When to call someone</h2>
          </div>
          <p className="mt-3 text-lg">{problem.callWhen}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="invert">
              <a href={`tel:${company.phone}`}>{company.phoneDisplay}</a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-primary-fg/20 text-primary-fg hover:bg-primary-fg/10"
            >
              <Link href="/estimate">Book a site visit</Link>
            </Button>
          </div>
        </section>

        {/* Onward links --------------------------------------------------- */}
        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          {service && (
            <section>
              <h2 className="font-display text-2xl">The work involved</h2>
              <Link
                href={`/services/${service.slug}`}
                className="mt-3 block rounded-xl bg-surface p-5 shadow-[var(--shadow-card)] transition-colors hover:bg-bg-warm"
              >
                <p className="font-medium">{service.name}</p>
                <p className="mt-1 text-sm text-muted">{service.summary}</p>
                <p className="mt-2 text-sm text-accent">{service.priceFrom}</p>
              </Link>
            </section>
          )}

          {guides.length > 0 && (
            <section>
              <h2 className="font-display text-2xl">Read further</h2>
              <ul className="mt-3 space-y-3">
                {guides.map((g) => (
                  <li key={g.slug}>
                    <Link
                      href={`/guides/${g.slug}`}
                      className="block rounded-xl bg-surface p-5 shadow-[var(--shadow-card)] transition-colors hover:bg-bg-warm"
                    >
                      <p className="font-medium">{g.title}</p>
                      <p className="mt-1 text-sm text-muted">{g.description}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {siblings.length > 0 && (
          <section className="mt-10">
            <div className="flex items-center gap-2 text-accent">
              <Clock className="size-4" aria-hidden="true" />
              <h2 className="text-xs tracking-[0.16em] uppercase">Often confused with</h2>
            </div>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {siblings.map((p) => (
                <li key={p.slug}>
                  <Link href={`/problems/${p.slug}`} className="text-primary hover:underline">
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="mt-10 text-xs text-muted">
          Written from {company.years}+ years of GTA callouts, not from a manufacturer's brochure.
          Every diagnosis here still ends with someone looking at the actual floor — a photograph
          and a moisture reading beat any web page, including this one.
        </p>
      </article>
    </>
  );
}
