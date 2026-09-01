import { coverage } from "@/data/coverage";
import { projects, type Project } from "@/data/projects";

/**
 * The worked examples that appear on the maps.
 *
 * ── Why this file is separate from data/coverage.ts ───────────────────────
 *
 * `data/coverage.ts` may never import `data/projects.ts`, and
 * `tests/coverage.test.ts` fails the build if it ever does. The reason is
 * written out at length there: the portfolio photography is AI-generated
 * (docs/HONEST-LIMITS.md), so dropping those nine entries onto a map at real
 * locations would place invented jobs at checkable addresses. A pin reads as a
 * record even when the caption says otherwise.
 *
 * That rule stands. This file does something different and narrower, under
 * three constraints that make it honest:
 *
 *   1. **Municipality precision only.** A showcase pin is placed at the
 *      municipality centroid — the same public coordinate `coverage` already
 *      uses — and never at the neighbourhood, the street, or the house. It is
 *      drawn as a hollow ring for exactly that reason: the ring says "somewhere
 *      in this municipality", which is all we are entitled to say.
 *   2. **Labelled as a specification, not a record.** Every pin carries
 *      `illustrative: true` and renders under SHOWCASE_DISCLOSURE. The map
 *      legend names the status "Worked example", not "completed job".
 *   3. **No claim about a customer.** No name, no date, no quote, no rating.
 *      Same rule the job catalogue lives under.
 *
 * What this buys: a homeowner in Vaughan can see that the shop has a worked
 * specification for a 4,200 sq ft white-oak install *of the kind they are
 * buying*, click it, and read the spec. That is a true statement and a useful
 * one. "We did a job on your street" is neither.
 *
 * When Franco confirms a real, permissioned, delivered job, it goes in
 * `CoveragePin.confirmedJobs` — a different field, a different gate, and a
 * different marker. This file is not that field and must not become it.
 */

/** The sentence that renders wherever a showcase pin does. Stated once. */
export const SHOWCASE_DISCLOSURE =
  "Worked examples are specifications this shop builds to, pinned at the municipality centre — not a client record, not an address, and not a claim that a job happened on your street.";

export type ShowcasePin = {
  slug: string;
  title: string;
  summary: string;
  /** Neighbourhood-level prose, as written in data/projects.ts. Display only. */
  location: string;
  citySlug: string;
  cityName: string;
  category: Project["category"];
  /** Municipality centroid, copied from the coverage pin. Never finer. */
  lat: number;
  lng: number;
  /** The only precision this data is allowed to assert. */
  precision: "municipality";
  /** No delivered-job claim stands behind this pin. Always true. */
  illustrative: true;
  href: string;
};

/**
 * Human labels for the categories, used in the legend and the caption strip.
 * `data/projects.ts` uses one more category than `data/catalog.ts` does
 * ("custom"), so this map is keyed on the project vocabulary.
 */
export const showcaseCategoryLabel: Record<Project["category"], string> = {
  install: "Installation",
  refinish: "Sanding & refinishing",
  stairs: "Stairs",
  repair: "Repairs",
  custom: "Custom inlay",
  commercial: "Commercial",
  deck: "Decks",
};

export const showcase: ShowcasePin[] = projects.map((p) => {
  const pin = coverage.find((c) => c.city.slug === p.citySlug);
  if (!pin) {
    // A project pointing at a municipality we do not serve would either vanish
    // from the map or, worse, be silently dropped at 0,0. Fail at build time.
    throw new Error(`data/showcase.ts: "${p.slug}" names city "${p.citySlug}", which is not served`);
  }
  return {
    slug: p.slug,
    title: p.title,
    summary: p.summary,
    location: p.location,
    citySlug: p.citySlug,
    cityName: pin.city.name,
    category: p.category,
    lat: pin.lat,
    lng: pin.lng,
    precision: "municipality",
    illustrative: true,
    href: `/portfolio/${p.slug}`,
  };
});

/** The worked examples for one service, or all of them. */
export function showcaseFor(category?: Project["category"]) {
  return category ? showcase.filter((s) => s.category === category) : showcase;
}

/** How many worked examples sit on one municipality, for the marker badge. */
export function showcaseCountByCity(pins: ShowcasePin[] = showcase) {
  const counts = new Map<string, number>();
  for (const s of pins) counts.set(s.citySlug, (counts.get(s.citySlug) ?? 0) + 1);
  return counts;
}

/**
 * Which worked examples belong to which published service.
 *
 * `data/catalog.ts` already carries `serviceSlug` on every archetype, so the
 * *coverage* side of a filtered map needs no table — a municipality appears on
 * the stairs map when one of the job types it is offered is a stair job. The
 * portfolio has one category the catalogue does not ("custom"), so this table
 * exists only for the showcase side.
 *
 * `custom-inlays` has no catalogue archetype of its own yet; the medallion
 * project is its only worked example, which is exactly why it is listed here.
 */
export const serviceShowcaseCategory: Record<string, Project["category"]> = {
  "hardwood-installation": "install",
  "hardwood-stairs": "stairs",
  "sanding-refinishing": "refinish",
  "hardwood-repairs": "repair",
  "hardwood-decks": "deck",
  "commercial-hardwood": "commercial",
  "custom-inlays": "custom",
  // hardwood-railings is deliberately absent. The Oakville stair carries an
  // OBC-compliant rail, but it is a stair job; filing it under railings to
  // avoid an empty list would be padding, and the map is allowed to show a
  // service with no worked example yet.
};
