import { cities, titleNameOf, type City } from "@/data/areas";
import { calculateEstimate, type ServiceKind } from "@/data/estimate";
import { getService, seoNameOf, type Service } from "@/data/services";
import { clampDescription } from "@/lib/seo";

/**
 * The service × city matrix.
 *
 * These pages exist because "hardwood stairs Vaughan" and "hardwood stairs
 * Oakville" are different searches with different answers — different housing
 * stock, different price multiplier, different job. They are NOT doorway pages,
 * and the guardrails that keep them from becoming doorway pages are structural:
 *
 *   1. A service only enters the matrix if it is in `matrixServices` below.
 *      `custom-inlays` is deliberately excluded — an inlay is specified per
 *      project, not per municipality, and a page for it in each of twelve cities
 *      would say nothing a reader could not get from the parent page.
 *   2. Every page carries a locally computed price band, derived from the same
 *      estimator the site uses, including that city's cost multiplier.
 *   3. Every page carries the city's own housing-stock and specification prose
 *      plus a service-specific local angle written per service.
 *   4. Every page self-canonicalises and links up to both parents.
 *
 * If you add a service or a city, this file needs no change — but read the
 * generated page before you ship it, and if it reads like a mad-lib, write a
 * `localAngle` entry for it.
 */

/** Services worth a page per city. Order controls sitemap and nav ordering. */
export const matrixServices = [
  "hardwood-stairs",
  "hardwood-installation",
  "sanding-refinishing",
  "hardwood-railings",
  "hardwood-repairs",
  "hardwood-decks",
  "commercial-hardwood",
] as const;

export type MatrixServiceSlug = (typeof matrixServices)[number];

/** Maps a catalogue service onto the estimator's pricing kind. */
const priceKind: Record<MatrixServiceSlug, ServiceKind> = {
  "hardwood-stairs": "stairs",
  "hardwood-installation": "install",
  "sanding-refinishing": "refinish",
  "hardwood-railings": "railings",
  "hardwood-repairs": "repair",
  "hardwood-decks": "deck",
  "commercial-hardwood": "install",
};

/**
 * The sentence that makes each page local rather than templated. One per
 * service; the city's own fields supply the rest of the variation.
 */
const localAngle: Record<MatrixServiceSlug, (city: City) => string> = {
  "hardwood-stairs": (c) =>
    `Stairs are the job we are called into ${c.name} for most often, and it is almost always the same story: the floor was done properly and the flight was not. We rebuild the stair as millwork in the same species and stain formula as the floor it lands on.`,
  "hardwood-installation": (c) =>
    `Installation in ${c.name} starts with the subfloor, not the sample. We take moisture readings and a flatness check across the whole floor area before a single board is ordered, because the assembly that works over ${c.region} joists is not the assembly that works over a slab.`,
  "sanding-refinishing": (c) =>
    `Most ${c.name} floors we are asked to replace do not need replacing. If there is a wear layer left, a dust-contained sand and a two-component waterborne finish costs a fraction of a new floor and keeps the original boards in the house.`,
  "hardwood-railings": (c) =>
    `Railings in ${c.name} fail in two ways: a handrail nobody can actually grasp, and newels bolted into trim instead of structure. We through-bolt into framing and detail the guard height and graspable profile against Ontario Building Code before we cut.`,
  "hardwood-repairs": (c) =>
    `Repairs in ${c.name} are usually water, pets, or a failed board run — and the question is always whether the floor can be saved. We take moisture readings first and tell you honestly which boards come out and which stay.`,
  "hardwood-decks": (c) =>
    `Hardwood decks and porches in ${c.name} live through Ontario winters, so the framing, the fastening, and the drainage matter more than the board. We build in real hardwood with hidden fasteners, not composite.`,
  "commercial-hardwood": (c) =>
    `Commercial hardwood in ${c.name} is a scheduling problem as much as a flooring one. We work nights and weekends, contain the dust, and specify a finish that survives a decade of foot traffic rather than one that photographs well on handover day.`,
};

/** Roughly what a job of this kind looks like, used to size the local band. */
const typicalJob: Record<MatrixServiceSlug, { sqft: number; stairs: number; railingFt: number }> = {
  "hardwood-stairs": { sqft: 800, stairs: 13, railingFt: 0 },
  "hardwood-installation": { sqft: 900, stairs: 0, railingFt: 0 },
  "sanding-refinishing": { sqft: 900, stairs: 0, railingFt: 0 },
  "hardwood-railings": { sqft: 800, stairs: 0, railingFt: 24 },
  "hardwood-repairs": { sqft: 120, stairs: 0, railingFt: 0 },
  "hardwood-decks": { sqft: 300, stairs: 0, railingFt: 0 },
  "commercial-hardwood": { sqft: 2500, stairs: 0, railingFt: 0 },
};

export type MatrixPage = {
  service: Service;
  city: City;
  path: string;
  title: string;
  h1: string;
  description: string;
  keywords: string[];
  angle: string;
  /** Locally adjusted price band for a representative job in this city. */
  band: { low: number; high: number; unit: string; basis: string; timeline: string };
  faqs: { q: string; a: string }[];
};

const cad = (n: number) => `$${Math.round(n / 50) * 50}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

function band(slug: MatrixServiceSlug, city: City) {
  const job = typicalJob[slug];
  const result = calculateEstimate({
    service: priceKind[slug],
    sqft: job.sqft,
    species: "white-oak",
    pattern: "straight",
    finish: "matte",
    stairs: job.stairs,
    railingFt: job.railingFt,
    city: city.slug,
  });

  const basis =
    slug === "hardwood-stairs"
      ? `a ${job.stairs}-step flight`
      : slug === "hardwood-railings"
        ? `${job.railingFt} linear feet of rail`
        : slug === "hardwood-repairs"
          ? "a typical single-room repair"
          : `${job.sqft.toLocaleString("en-CA")} sq ft`;

  return {
    low: result.low,
    high: result.high,
    unit: result.perSqft ? `${cad(result.perSqft)} per sq ft` : cad(result.mid),
    basis,
    timeline: result.timeline,
  };
}

function faqsFor(service: Service, city: City, b: ReturnType<typeof band>) {
  return [
    {
      q: `How much does ${service.name.toLowerCase()} cost in ${city.name}?`,
      a: `For ${b.basis} in ${city.name}, budget roughly ${cad(b.low)} to ${cad(b.high)} before HST, at 2026 Greater Toronto labour and mill pricing. ${service.priceFrom} is the catalogue range; ${city.name} sits where it does because of local labour and access. A site measure is what turns that band into a firm number.`,
    },
    {
      q: `How long does ${service.shortName.toLowerCase()} take in a ${city.name} home?`,
      a: `${b.timeline} for ${b.basis}, plus the finish cure window where site finishing is involved. We book ${city.name} site visits within a few days and give you a written schedule before the crew arrives.`,
    },
    {
      q: `Do you actually work in ${city.name}, or just advertise there?`,
      a: `${city.name} is inside our core service area and we work there every month. ${city.typical} Site visits in ${city.name} are free for qualified hardwood, stair, and railing work.`,
    },
    {
      q: `Can you match ${service.shortName.toLowerCase()} to the hardwood already in my ${city.name} house?`,
      a: `Yes — matching is the normal case, not the exception. We identify the species and grade, sample the stain against your existing boards in daylight, and sign the sample off with you before anything is cut. ${city.housing.split(".")[0]}.`,
    },
  ];
}

function buildPages(): MatrixPage[] {
  const pages: MatrixPage[] = [];

  for (const slug of matrixServices) {
    const service = getService(slug);
    if (!service) continue;

    for (const city of cities) {
      const b = band(slug, city);
      const title = `${seoNameOf(service)} in ${titleNameOf(city)}`;

      pages.push({
        service,
        city,
        path: `/services/${service.slug}/${city.slug}`,
        title,
        h1: `${service.name} in ${city.name}, Ontario`,
        description: clampDescription(
          `${service.shortName} in ${city.name}: ${b.basis} typically runs ${cad(b.low)}–${cad(b.high)}. ${city.blurb}`,
        ),
        keywords: [
          `${service.shortName.toLowerCase()} ${city.name}`,
          `${service.name.toLowerCase()} ${city.name}`,
          `hardwood ${city.name}`,
          `${service.shortName.toLowerCase()} near me ${city.name}`,
          `${city.name} hardwood contractor`,
        ],
        angle: localAngle[slug](city),
        band: b,
        faqs: faqsFor(service, city, b),
      });
    }
  }

  return pages;
}

export const matrixPages: MatrixPage[] = buildPages();

export function getMatrixPage(serviceSlug: string, citySlug: string) {
  return matrixPages.find((p) => p.service.slug === serviceSlug && p.city.slug === citySlug);
}

export function matrixForService(serviceSlug: string) {
  return matrixPages.filter((p) => p.service.slug === serviceSlug);
}

export function matrixForCity(citySlug: string) {
  return matrixPages.filter((p) => p.city.slug === citySlug);
}

export function isMatrixService(slug: string): slug is MatrixServiceSlug {
  return (matrixServices as readonly string[]).includes(slug);
}

/** Kept for the price copy on the matrix page and in tests. */
export { cad as formatCad };

/** Sanity check used by the sitemap and the build audit. */
export const MATRIX_COUNT = matrixServices.length * cities.length;

// A quiet guard: if someone adds a service to `matrixServices` that does not
// exist in the catalogue, the page count will silently drop. Fail loudly instead.
if (matrixPages.length !== MATRIX_COUNT) {
  throw new Error(
    `Matrix built ${matrixPages.length} pages but expected ${MATRIX_COUNT}. A slug in matrixServices does not match data/services.ts.`,
  );
}
