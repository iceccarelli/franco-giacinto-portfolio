import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { BeforeAfter } from "@/components/before-after";
import { JsonLd } from "@/components/json-ld";
import { Photo } from "@/components/photo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { catalog } from "@/data/catalog";
import { getCity, tierNote } from "@/data/areas";
import { coverage } from "@/data/coverage";
import { projectBand, projects, projectFilters } from "@/data/projects";
import { getService } from "@/data/services";
import { showcaseCategoryLabel } from "@/data/showcase";
import { breadcrumbLd, webPageLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site-url";

/**
 * A page per job.
 *
 * Until now `/portfolio` was one client-filtered grid and there was no detail
 * route at all: the cards were `<article>` elements, the catalogue deep-linked
 * to `#slug` anchors, and a visitor who clicked a photograph got nothing. Nine
 * of the most persuasive assets on the site were dead ends, and every internal
 * link that wanted to point at a specific job had to point at a fragment on a
 * page that renders all nine.
 *
 * This is the destination those links deserved. It is also where the honesty
 * label belongs: the photography here is AI-generated (docs/HONEST-LIMITS.md),
 * so the page says which parts are a specification and which are a photograph,
 * rather than letting a rendering pass for a job record.
 *
 * The URL shape stays inside the frozen matrix — nine job pages, no new
 * city × service combinations.
 */

type Params = { slug: string };

export const revalidate = 3600;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};

  /*
   * " | Green Hardwood" is appended by the root template and costs 17
   * characters, so the tag has ~43 left before Google truncates it. The
   * location suffix is worth having when it fits — "Oakville estate staircase"
   * already carries its city, "Rosedale compass rose" does not — and is
   * dropped rather than truncated when it does not. The audit flags the
   * overflow either way; this is what stops it recurring on the next entry.
   */
  const withLocation = `${project.title} — ${project.location}`;
  const title = withLocation.length <= 43 ? withLocation : project.title;

  return {
    title,
    description: project.summary,
    alternates: { canonical: `/portfolio/${project.slug}` },
    openGraph: {
      title: `${withLocation} | Green Hardwood`,
      description: project.summary,
      url: `/portfolio/${project.slug}`,
      images: [{ url: project.image }],
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const city = getCity(project.citySlug);
  const filter = projectFilters.find((f) => f.id === project.category);
  const categoryLabel = showcaseCategoryLabel[project.category];

  /**
   * The catalogue entries that describe this shape of work. `relatedProjects`
   * is authored on the catalogue side, so this is a reverse lookup rather than
   * a second list that can drift out of sync with it.
   */
  const archetypes = catalog.filter((c) => c.relatedProjects.includes(project.slug));
  const service = getService(archetypes[0]?.serviceSlug ?? "");

  const band = projectBand(project);
  const pin = coverage.find((p) => p.city.slug === project.citySlug);
  const fmt = (n: number) => `$${n.toLocaleString("en-CA")}`;

  const siblings = projects.filter(
    (p) => p.slug !== project.slug && (p.category === project.category || p.citySlug === project.citySlug),
  );

  return (
    <>
      <JsonLd
        data={webPageLd({
          name: project.title,
          description: project.summary,
          path: `/portfolio/${project.slug}`,
        })}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Work", path: "/portfolio" },
          { name: project.title, path: `/portfolio/${project.slug}` },
        ])}
      />
      {/*
        CreativeWork, not Product and not Review. There is no rating here, no
        author, and no customer — the same rule the job catalogue lives under.
        `creditText` names the AI-generated photography rather than letting an
        indexer treat the image as documentary evidence of the job.
      */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          "@id": `${SITE_URL}/portfolio/${project.slug}#work`,
          name: project.title,
          description: project.summary,
          about: service?.name ?? categoryLabel,
          creator: { "@id": `${SITE_URL}/#business` },
          contentLocation: { "@type": "Place", name: project.location },
          url: `${SITE_URL}/portfolio/${project.slug}`,
          image: {
            "@type": "ImageObject",
            contentUrl: `${SITE_URL}${project.image}`,
            caption: project.imageAlt,
            creditText: "Illustrative rendering — not documentary job photography.",
          },
        }}
      />

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <Breadcrumbs
          items={[
            { name: "Work", path: "/portfolio" },
            { name: project.title, path: `/portfolio/${project.slug}` },
          ]}
        />

        <header className="mt-6">
          <p className="text-xs font-medium tracking-[0.18em] text-accent uppercase">
            {categoryLabel} · {project.type}
          </p>
          <h1 className="mt-3 font-display text-[2.1rem] leading-[1.1] sm:text-[2.75rem]">
            {project.title}
          </h1>
          <p className="mt-4 text-lg text-muted">{project.summary}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Badge>{project.location}</Badge>
            {city && <Badge>{city.region}</Badge>}
            {project.specs.slice(0, 2).map((s) => (
              <Badge key={s}>{s}</Badge>
            ))}
          </div>
        </header>

        <figure className="mt-8">
          {project.before && project.after ? (
            <BeforeAfter
              before={project.before}
              after={project.after}
              beforeAlt={`Before: ${project.title}`}
              afterAlt={project.imageAlt}
            />
          ) : (
            <Photo src={project.image} alt={project.imageAlt} ratio="3/2" slot="half" priority />
          )}
          <figcaption className="mt-3 text-sm text-muted">
            {project.imageAlt}{" "}
            <span className="text-fg">
              Illustrative rendering, not documentary job photography — see{" "}
              <Link href="/about" className="text-primary hover:underline">
                how we work
              </Link>
              .
            </span>
          </figcaption>
        </figure>

        <section className="mt-10">
          <h2 className="font-display text-2xl">What the job actually involved</h2>
          <p className="mt-3 text-muted">{project.details}</p>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl">Specification</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {project.specs.map((spec) => (
              <li key={spec} className="rounded-lg border border-border bg-surface px-4 py-3 text-sm">
                {spec}
              </li>
            ))}
          </ul>
        </section>

        {/*
          What this specification costs today.

          Derived, not stated: the scale comes out of the spec list the reader
          can see above, the municipality out of the entry itself, and the band
          out of the same estimator that prices every other page. It does not
          claim what the job cost — it says what this specification would be
          quoted at now, which is the question a visitor is actually asking and
          the only one that can be answered honestly about an illustrative job.
        */}
        {band && (
          <section className="mt-10">
            <h2 className="font-display text-2xl">What a job like this costs today</h2>
            <div className="mt-4 rounded-xl border border-border bg-surface p-6">
              <p className="font-display text-3xl tabular-nums">
                {fmt(band.low)} <span className="text-muted">–</span> {fmt(band.high)}
              </p>
              <p className="mt-2 text-sm text-muted">
                {band.basis} in {city?.name ?? project.location}, 2026 band, HST extra.{" "}
                {band.timeline} on site.
              </p>
              {(project.category === "custom" || project.category === "commercial") && (
                <p className="mt-3 text-sm text-muted">
                  {project.category === "custom"
                    ? "The medallion itself is quoted from a drawing and is not in this number — an inlay is not priceable by the square foot."
                    : "Overnight phasing and out-of-hours access are quoted per project and are not in this number."}
                </p>
              )}
              <div className="mt-5 flex flex-wrap gap-3">
                <Button asChild>
                  <Link
                    href={`/estimate?city=${project.citySlug}${service ? `&service=${service.slug}` : ""}`}
                  >
                    Price your own version
                  </Link>
                </Button>
                {pin && (
                  <span className="self-center text-sm text-muted">
                    {pin.distanceKm} km from the workshop · {pin.city.tier === "core" ? "free site visit" : "we travel here for packages"}
                  </span>
                )}
              </div>
            </div>
          </section>
        )}

        {archetypes.length > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-2xl">The job type behind this</h2>
            <p className="mt-3 max-w-2xl text-muted">
              Each entry carries the published 2026 band, the sequence, and the failure modes that
              produce a second invoice.
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {archetypes.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/catalog/${c.slug}`}
                    className="group flex h-full flex-col rounded-xl border border-border bg-surface p-5 transition-shadow hover:shadow-[var(--shadow-card)]"
                  >
                    <p className="font-display text-lg leading-snug">{c.name}</p>
                    <p className="mt-2 flex-1 text-sm text-muted">{c.summary}</p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                      {c.failureModes.length} ways it goes wrong
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {archetypes.length > 0 && archetypes[0]!.failureModes.length > 0 && (
          /*
            The two failure modes that matter most for this shape of work,
            lifted from the catalogue archetype rather than restated — the
            catalogue owns them, this page quotes two and links to the rest.
            A job page that only shows the finished photograph is an
            advertisement; one that names what goes wrong is a specification.
          */
          <section className="mt-10">
            <h2 className="font-display text-2xl">What goes wrong on a job like this</h2>
            <ul className="mt-4 space-y-4">
              {archetypes[0]!.failureModes.slice(0, 2).map((f) => (
                <li key={f.problem} className="rounded-xl border border-border bg-surface p-5">
                  <p className="font-medium">{f.problem}</p>
                  <p className="mt-2 text-sm text-muted">{f.consequence}</p>
                  <p className="mt-2 text-sm">
                    <span className="text-muted">Avoided by: </span>
                    {f.avoidedBy}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm">
              <Link
                href={`/catalog/${archetypes[0]!.slug}`}
                className="text-primary hover:underline"
              >
                All {archetypes[0]!.failureModes.length} failure modes for{" "}
                {archetypes[0]!.name.toLowerCase()}
              </Link>
            </p>
          </section>
        )}

        {city && (
          <section className="mt-10">
            <h2 className="font-display text-2xl">Taking this on in {city.name}</h2>
            <p className="mt-3 text-muted">{tierNote(city)}</p>
            {pin && (
              <p className="mt-3 text-muted">
                {city.name} is {pin.distanceKm} km from the Sterling Road workshop, and{" "}
                {pin.jobTypes.length} of the twelve job types in the catalogue are taken here.{" "}
                {city.typical}
              </p>
            )}
          </section>
        )}

        <section className="mt-12 rounded-xl bg-primary p-8 text-primary-fg">
          <h2 className="font-display text-2xl">Want this specification in your house?</h2>
          <p className="mt-3 max-w-xl text-primary-fg/75">
            City, service and size gives you a 2026 GTA band in about twenty seconds. We lock a
            number only after a moisture reading on site.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="invert">
              <Link
                href={`/estimate?city=${project.citySlug}${service ? `&service=${service.slug}` : ""}`}
              >
                Price this job
              </Link>
            </Button>
            {city && (
              <Button
                asChild
                variant="outline"
                className="border-primary-fg/25 text-primary-fg hover:bg-primary-fg/10"
              >
                <Link href={`/areas/${city.slug}`}>Hardwood in {city.name}</Link>
              </Button>
            )}
          </div>
        </section>

        {siblings.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-2xl">Related work</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {siblings.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/portfolio/${p.slug}`}
                    className="flex h-full flex-col rounded-xl border border-border bg-surface p-5 transition-shadow hover:shadow-[var(--shadow-card)]"
                  >
                    <p className="text-xs text-accent">{p.location}</p>
                    <p className="mt-1 font-display text-lg leading-snug">{p.title}</p>
                    <p className="mt-2 text-sm text-muted">{p.summary}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="mt-10 text-sm">
          <Link href="/portfolio" className="inline-flex items-center gap-1.5 text-primary hover:underline">
            <ArrowLeft className="size-3.5" aria-hidden />
            All work{filter && filter.id !== "all" ? ` · ${filter.label}` : ""}
          </Link>
        </p>
      </div>
    </>
  );
}
