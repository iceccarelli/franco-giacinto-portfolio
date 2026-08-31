import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowRight, Check, Wallet } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { Button } from "@/components/ui/button";
import { catalog, bandFor, exampleFor, getCatalogEntry } from "@/data/catalog";
import { getMethod } from "@/data/methods";
import { getProblem } from "@/data/problems";
import { getService } from "@/data/services";
import { projects } from "@/data/projects";
import { SITE_URL } from "@/lib/site-url";
import { breadcrumbLd, clampDescription, webPageLd } from "@/lib/seo";
import { formatCad } from "@/lib/utils";

type Params = { slug: string };

export const dynamicParams = false;
export const revalidate = 3600;

export function generateStaticParams(): Params[] {
  return catalog.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const entry = getCatalogEntry(slug);
  if (!entry) return {};
  const description = clampDescription(entry.summary);

  return {
    title: entry.seoTitle,
    description,
    keywords: [...entry.alsoCalled, `${entry.name} Toronto`, `${entry.name} GTA`],
    alternates: { canonical: `/catalog/${entry.slug}` },
    openGraph: {
      title: `${entry.name} | Green Hardwood`,
      description,
      url: `/catalog/${entry.slug}`,
      type: "article",
    },
  };
}

export default async function CatalogEntryPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const entry = getCatalogEntry(slug);
  if (!entry) notFound();

  const service = getService(entry.serviceSlug);
  const example = exampleFor(entry);
  const methods = entry.relatedMethods.map(getMethod).filter((m) => m !== undefined);
  const problems = entry.relatedProblems.map(getProblem).filter((p) => p !== undefined);
  const jobs = projects.filter((p) => entry.relatedProjects.includes(p.slug));
  const siblings = catalog.filter((c) => c.category === entry.category && c.slug !== entry.slug);

  return (
    <>
      <JsonLd
        data={webPageLd({
          name: entry.name,
          description: entry.summary,
          path: `/catalog/${entry.slug}`,
        })}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Job catalogue", path: "/catalog" },
          { name: entry.name, path: `/catalog/${entry.slug}` },
        ])}
      />
      {/*
        Service, not Product, and deliberately carrying no rating and no
        review markup of any kind. `entry.testimonial` is null on every entry
        in the catalogue and stays null until a real permissioned one exists;
        tests/catalog.test.ts fails the build if either kind of node appears
        here without one behind it.
      */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          "@id": `${SITE_URL}/catalog/${entry.slug}#service`,
          name: entry.name,
          alternateName: entry.alsoCalled,
          description: entry.summary,
          serviceType: service?.name ?? entry.name,
          provider: { "@id": `${SITE_URL}/#business` },
          areaServed: { "@type": "AdministrativeArea", name: "Greater Toronto Area" },
          url: `${SITE_URL}/catalog/${entry.slug}`,
        }}
      />

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <Breadcrumbs
          items={[
            { name: "Job catalogue", path: "/catalog" },
            { name: entry.name, path: `/catalog/${entry.slug}` },
          ]}
        />

        <header className="mt-6">
          <p className="text-xs font-medium tracking-[0.18em] text-accent uppercase">
            {service?.shortName ?? "Hardwood"}
          </p>
          <h1 className="mt-3 font-display text-[2.1rem] leading-[1.1] sm:text-[2.75rem]">
            {entry.name}
          </h1>
          <p className="mt-4 text-lg text-muted">{entry.summary}</p>

          {entry.illustrative && (
            /*
              Said out loud rather than implied. This archetype describes work
              the shop is equipped for but has no documented delivered job for
              yet. Presenting a capability as a record is the same lie the
              invented testimonials told, just quieter.
            */
            <p className="mt-5 rounded-lg border border-border bg-bg-warm px-4 py-3 text-sm text-muted">
              <strong className="font-medium text-fg">Capability, not a case study.</strong> This is
              work the shop is equipped and specified for. There is no photographed job of this
              exact type published yet — when there is, it appears here.
            </p>
          )}
        </header>

        <section className="mt-9 rounded-xl bg-surface p-6 shadow-[var(--shadow-card)]">
          <h2 className="font-display text-xl">When this is the job</h2>
          <p className="mt-3 text-muted">{entry.trigger}</p>
          {entry.alsoCalled.length > 0 && (
            <p className="mt-4 text-sm text-muted">
              <span className="font-medium text-fg">Also called:</span>{" "}
              {entry.alsoCalled.join(" · ")}
            </p>
          )}
        </section>

        <section className="mt-9 grid gap-5 sm:grid-cols-2">
          <div className="rounded-xl border border-border p-6">
            <p className="flex items-center gap-2 text-xs tracking-[0.16em] text-accent uppercase">
              <Wallet className="size-4" aria-hidden /> Published band
            </p>
            <p className="mt-2 font-display text-2xl">{bandFor(entry)}</p>
            <p className="mt-1 text-sm text-muted">
              HST extra. A range, not a quote — a firm number follows a moisture reading on site.
            </p>
          </div>
          <div className="rounded-xl border border-border p-6">
            <p className="text-xs tracking-[0.16em] text-accent uppercase">Worked example</p>
            <p className="mt-2 font-display text-2xl tabular-nums">
              {formatCad(example.low)} – {formatCad(example.high)}
            </p>
            <p className="mt-1 text-sm text-muted">
              {example.label} · {example.timeline}
            </p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl">Typical specification</h2>
          <ul className="mt-4 space-y-2.5">
            {entry.spec.map((line) => (
              <li key={line} className="flex gap-3 text-muted">
                <Check className="mt-1 size-4 shrink-0 text-accent" aria-hidden />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl">Sequence of work</h2>
          <ol className="mt-4 space-y-3">
            {entry.sequence.map((step, i) => (
              <li key={step} className="flex gap-4">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-fg tabular-nums">
                  {i + 1}
                </span>
                <span className="text-muted">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl">What goes wrong</h2>
          <p className="mt-2 max-w-2xl text-muted">
            The part of a hardwood job that costs money is rarely the part in the quote. These are
            the failures that produce a second invoice.
          </p>
          <div className="mt-6 space-y-4">
            {entry.failureModes.map((f) => (
              <article key={f.problem} className="rounded-xl border border-border bg-surface p-6">
                <h3 className="flex items-start gap-2.5 font-display text-lg leading-snug">
                  <AlertTriangle className="mt-1 size-4 shrink-0 text-primary" aria-hidden />
                  {f.problem}
                </h3>
                <p className="mt-3 text-muted">{f.consequence}</p>
                <p className="mt-3 border-l-2 border-accent pl-4 text-sm text-fg">
                  <span className="font-medium">Avoided by:</span> {f.avoidedBy}
                </p>
              </article>
            ))}
          </div>
        </section>

        {(methods.length > 0 || problems.length > 0 || jobs.length > 0) && (
          <section className="mt-12">
            <h2 className="font-display text-2xl">Related</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {jobs.map((p) => (
                <li key={p.slug}>
                  <Link className="text-primary hover:underline" href={`/portfolio#${p.slug}`}>
                    Job: {p.title}
                  </Link>
                </li>
              ))}
              {methods.map((m) => (
                <li key={m.slug}>
                  <Link className="text-primary hover:underline" href={`/methods/${m.slug}`}>
                    Method: {m.name}
                  </Link>
                </li>
              ))}
              {problems.map((p) => (
                <li key={p.slug}>
                  <Link className="text-primary hover:underline" href={`/problems/${p.slug}`}>
                    Diagnosis: {p.name}
                  </Link>
                </li>
              ))}
              {service && (
                <li>
                  <Link className="text-primary hover:underline" href={`/services/${service.slug}`}>
                    Service: {service.name}
                  </Link>
                </li>
              )}
            </ul>
          </section>
        )}

        <section className="mt-12 rounded-xl bg-primary p-8 text-primary-fg">
          <h2 className="font-display text-2xl">Is this your job?</h2>
          <p className="mt-3 max-w-xl text-primary-fg/75">
            City, service and size gives you a 2026 GTA band in about twenty seconds. We lock a
            number only after a moisture reading.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="invert">
              <Link href={`/estimate?service=${service?.slug ?? ""}`}>Get a price band</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-primary-fg/25 text-primary-fg hover:bg-primary-fg/10"
            >
              <Link href="/catalog">All twelve job types</Link>
            </Button>
          </div>
        </section>

        {siblings.length > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-xl">
              Others in {service?.shortName ?? "this category"}
            </h2>
            <ul className="mt-3 space-y-2">
              {siblings.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/catalog/${s.slug}`}
                    className="inline-flex items-center gap-1.5 text-primary hover:underline"
                  >
                    {s.name} <ArrowRight className="size-3.5" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}
