import { cities, tierNote, type City } from "@/data/areas";
import { catalog, type CatalogEntry } from "@/data/catalog";
import {
  calculateEstimate,
  emptyEstimate,
  serviceKinds,
  type EstimateInput,
  type ServiceKind,
} from "@/data/estimate";
import { getService } from "@/data/services";
import { company } from "@/data/company";

/**
 * The service-coverage map.
 *
 * ── What this is, and what it deliberately is not ─────────────────────────
 *
 * It is a map of where this shop works, what it takes on in each place, and
 * what that costs there. Every pin is a municipality in the published service
 * area, positioned at its real centroid, carrying its real travel tier and a
 * band computed by the same estimator the rest of the site uses.
 *
 * It is NOT a map of completed jobs, and it must never become one by accident.
 *
 * The reason is specific. `data/projects.ts` holds nine portfolio entries and
 * `docs/HONEST-LIMITS.md` records that the photography attached to them is
 * AI-generated. Dropping those onto a map would place invented work at real
 * addresses in real neighbourhoods — a claim any prospective client, any
 * competitor, or any journalist can check by knocking on a door. That is the
 * invented-testimonial mistake with a street address attached, and it is worse
 * than the original because a map pin reads as a record even when the caption
 * says otherwise.
 *
 * So the map answers a different and more useful question. A homeowner in
 * Burlington does not actually want to know whether this shop worked three
 * streets away; they want to know whether it comes out to Burlington, what it
 * will do when it gets there, and roughly what the number is. All three of
 * those are true things we can state today.
 *
 * ── Where a real job would go, when there is one ──────────────────────────
 *
 * `CoveragePin.confirmedJobs` exists and is empty. It takes an entry only when
 * a job is real, finished, and the client has agreed to it being shown — the
 * same gate `CatalogEntry.testimonial` uses. Until then the honest surface is
 * capability, and the map says "job types we take here" rather than implying
 * a history it cannot evidence.
 */

export type ConfirmedJob = {
  /** Neighbourhood or intersection. Never a street address. */
  area: string;
  citySlug: string;
  /** Which catalogue archetype this job was. */
  catalogSlug: string;
  /** ISO date the work completed. */
  date: string;
  /** Species, size, step count — whatever is true and specific. */
  specs: string[];
  /** The client agreed, in writing, that this job may be shown publicly. */
  permission: true;
};

export type CoveragePin = {
  city: City;
  /** Municipality centroid. Public geographic fact, not a business claim. */
  lat: number;
  lng: number;
  /** Straight-line kilometres from the Sterling Road studio, computed. */
  distanceKm: number;
  /** The catalogue archetypes this shop takes on in this municipality. */
  jobTypes: CatalogEntry[];
  /** A real, locally-adjusted band for the shop's primary service. */
  stairBand: { low: number; high: number };
  installBand: { low: number; high: number };
  /**
   * Real, finished, permissioned jobs. Empty on every pin, and it stays that
   * way until Franco confirms one. `tests/coverage.test.ts` fails the build if
   * an entry appears without a date, a catalogue match and explicit permission.
   */
  confirmedJobs: ConfirmedJob[];
};

/**
 * Municipality centroids, decimal degrees.
 *
 * Ordinary published geography — the same coordinates any atlas or the
 * Canadian Geographical Names Database gives. Nothing here asserts anything
 * about the business; a wrong number puts a pin in the wrong field, which is
 * embarrassing rather than dishonest, and `tests/coverage.test.ts` bounds them
 * to Southern Ontario so a transposed sign cannot ship.
 */
const CENTROIDS: Record<string, [number, number]> = {
  toronto: [43.6532, -79.3832],
  etobicoke: [43.6205, -79.5132],
  "north-york": [43.7615, -79.4111],
  scarborough: [43.7764, -79.2318],
  "east-york": [43.6903, -79.3277],
  mississauga: [43.589, -79.6441],
  brampton: [43.7315, -79.7624],
  caledon: [43.8668, -79.8663],
  vaughan: [43.8361, -79.4983],
  markham: [43.8561, -79.337],
  "richmond-hill": [43.8828, -79.4403],
  aurora: [44.0065, -79.4504],
  newmarket: [44.0592, -79.4613],
  king: [43.9236, -79.5286],
  "whitchurch-stouffville": [43.9709, -79.2445],
  oakville: [43.4675, -79.6877],
  burlington: [43.3255, -79.799],
  milton: [43.5183, -79.8774],
  "halton-hills": [43.6294, -79.9377],
  pickering: [43.8384, -79.0868],
  ajax: [43.8509, -79.0204],
  whitby: [43.8975, -78.9429],
  oshawa: [43.8971, -78.8658],
  clarington: [43.9351, -78.6089],
  hamilton: [43.2557, -79.8711],
  ancaster: [43.2187, -79.9871],
  dundas: [43.2664, -79.9553],
  "bradford-west-gwillimbury": [44.1146, -79.5636],
  barrie: [44.3894, -79.6903],
  innisfil: [44.3, -79.5667],
  orangeville: [43.9192, -80.0941],
  guelph: [43.5448, -80.2482],
};

/** Great-circle distance in kilometres. */
function haversineKm(a: [number, number], b: [number, number]) {
  const R = 6371;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLng = ((b[1] - a[1]) * Math.PI) / 180;
  const lat1 = (a[0] * Math.PI) / 180;
  const lat2 = (b[0] * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return Math.round(2 * R * Math.asin(Math.sqrt(h)));
}

/** The Sterling Road studio. Origin of the map and of every drive. */
export const STUDIO = {
  lat: company.geo.latitude,
  lng: company.geo.longitude,
  label: `${company.legalName}, ${company.address.line1}`,
} as const;

/**
 * Which catalogue archetypes are offered where.
 *
 * Core municipalities get the whole catalogue: any qualified job justifies the
 * visit. Extended ones get only the larger packages, because that is the
 * honest commercial position `tierNote()` already states in prose — driving to
 * Barrie for a single-room repair is not a service, it is a promise nobody
 * intends to keep. Encoding it here means the map cannot contradict the copy.
 */
function jobTypesFor(city: City): CatalogEntry[] {
  if (city.tier === "core") return catalog;
  const worthTheDrive = new Set([
    "carpet-to-hardwood-stairs",
    "open-riser-feature-stair",
    "whole-home-install-plus-stairs",
    "heritage-quarter-sawn-refinish",
    "herringbone-over-radiant",
    "commercial-overnight-install",
    "code-compliant-hardwood-railing",
  ]);
  return catalog.filter((c) => worthTheDrive.has(c.slug));
}

function bandFor(citySlug: string, service: "stairs" | "install") {
  const input = {
    ...emptyEstimate(),
    city: citySlug,
    service,
    ...(service === "stairs" ? { stairs: 13 } : { sqft: 800 }),
  };
  const r = calculateEstimate(input);
  return { low: Math.round(r.low), high: Math.round(r.high) };
}

export const coverage: CoveragePin[] = cities.map((city) => {
  const centroid = CENTROIDS[city.slug];
  if (!centroid) {
    // A city without a coordinate would silently vanish from the map. Fail at
    // build time instead — tests/coverage.test.ts also asserts completeness.
    throw new Error(`data/coverage.ts: no centroid for "${city.slug}"`);
  }
  return {
    city,
    lat: centroid[0],
    lng: centroid[1],
    distanceKm: haversineKm([STUDIO.lat, STUDIO.lng], centroid),
    jobTypes: jobTypesFor(city),
    stairBand: bandFor(city.slug, "stairs"),
    installBand: bandFor(city.slug, "install"),
    confirmedJobs: [],
  };
});

export const coreCoverage = coverage.filter((p) => p.city.tier === "core");
export const extendedCoverage = coverage.filter((p) => p.city.tier === "extended");

/** Every pin that carries a real, permissioned job. Empty today. */
export const coverageWithJobs = coverage.filter((p) => p.confirmedJobs.length > 0);

/** The one-line honest summary the map header and /api/areas.json both use. */
export function coverageSummary() {
  return (
    `${coverage.length} municipalities across the Greater Toronto Area and Southern Ontario. ` +
    `${coreCoverage.length} inside the core radius with a free on-site measure for any qualified job; ` +
    `${extendedCoverage.length} we travel to for stair packages, whole-home installs and refinishing. ` +
    `Pins are service coverage and published bands — not a record of past jobs.`
  );
}

export { tierNote };

/* ══════════════════════════════════════════════════════════════════════════
   Local depth, computed.

   The 32 city hubs are the pages that rank for "hardwood flooring in {city}",
   and they were the thinnest pages on the site — 308 to 420 words of rendered
   content, against competitors running 800 to 1,500. Thin money pages are the
   single biggest remaining weakness in the program.

   The tempting fix is to write four paragraphs of local colour per town. That
   would be inventing knowledge about places this shop's owner knows and I do
   not — the same failure as the invented testimonials, wearing a municipal
   crest. `docs/HONEST-LIMITS.md` says one real job photo is worth the whole
   AI-generated set; the same is true of one real sentence about Barrie.

   So the depth here is *derived* rather than written. Every number below comes
   out of `calculateEstimate` with this municipality's own multiplier, every
   job type comes out of the catalogue the shop publishes, and every distance
   is haversine from the studio. It is unique per city because the inputs are
   unique per city — not because someone paraphrased a sentence 32 times. And
   it is all checkable: a reader can put the same inputs into /estimate and get
   the same band back.
   ══════════════════════════════════════════════════════════════════════════ */

/**
 * Which published service each estimator kind prices.
 *
 * Two of the eight services — custom inlays and commercial — have no estimator
 * kind, because neither is priceable from a sq-ft box: an inlay is quoted from
 * a drawing and a commercial fit-out from a phasing plan. They are named in
 * the copy rather than given a fake number.
 */
const KIND_TO_SERVICE: Record<ServiceKind, string> = {
  install: "hardwood-installation",
  refinish: "sanding-refinishing",
  stairs: "hardwood-stairs",
  railings: "hardwood-railings",
  repair: "hardwood-repairs",
  deck: "hardwood-decks",
};

/** The basis each band is quoted on. Stated, so the number is checkable. */
const KIND_BASIS: Record<
  ServiceKind,
  { basis: string; qty: number; unit: string; input: Partial<EstimateInput> }
> = {
  install: {
    basis: "800 sq ft, solid white oak, site-finished matte",
    qty: 800,
    unit: "sq ft",
    input: { sqft: 800 },
  },
  refinish: {
    basis: "800 sq ft, dust-contained, waterborne 2K",
    qty: 800,
    unit: "sq ft",
    input: { sqft: 800 },
  },
  stairs: { basis: "13 steps, treads and risers", qty: 13, unit: "step", input: { stairs: 13 } },
  railings: {
    basis: "24 linear feet, handrail and newels",
    qty: 24,
    unit: "lin ft",
    input: { railingFt: 24 },
  },
  repair: {
    basis: "120 sq ft affected, replace and blend",
    qty: 120,
    unit: "sq ft",
    input: { sqft: 120 },
  },
  deck: {
    basis: "300 sq ft, dense hardwood decking",
    qty: 300,
    unit: "sq ft",
    input: { sqft: 300 },
  },
};

export type LocalPrice = {
  kind: ServiceKind;
  label: string;
  serviceSlug: string;
  serviceName: string;
  basis: string;
  low: number;
  high: number;
  /** The same band expressed per unit, so it can be checked against the
   *  published range on the service page rather than merely coexisting
   *  with it. See `bandVsPublished` below for why that matters. */
  perUnitLow: number;
  perUnitHigh: number;
  unit: string;
  timeline: string;
};

/**
 * Every priceable service, banded for one municipality.
 *
 * Same estimator, same multiplier, same rounding as /estimate — so the city
 * page and the tool can never disagree. `tests/city-depth.test.ts` asserts
 * exactly that, and asserts the bands actually differ between a 1.10 town and
 * a 0.98 one, which is what makes the page worth having at all.
 */
export function localPricing(citySlug: string): LocalPrice[] {
  return serviceKinds.map(({ id, label }) => {
    const { basis, qty, unit, input } = KIND_BASIS[id];
    const result = calculateEstimate({ ...emptyEstimate(), city: citySlug, service: id, ...input });
    const service = getService(KIND_TO_SERVICE[id]);
    return {
      kind: id,
      label,
      serviceSlug: KIND_TO_SERVICE[id],
      serviceName: service?.name ?? label,
      basis,
      low: Math.round(result.low),
      high: Math.round(result.high),
      perUnitLow: result.low / qty,
      perUnitHigh: result.high / qty,
      unit,
      timeline: result.timeline,
    };
  });
}

/**
 * The nearest municipalities this shop also serves.
 *
 * Two jobs at once. For a reader it answers the question behind the question —
 * "you're in Vaughan, do you come to Maple" — with the neighbouring towns and
 * how far apart they actually are. For the site it builds a real geographic
 * link mesh between 32 hub pages that previously only linked upward to /areas,
 * so authority moves sideways between them instead of pooling at the top.
 *
 * Distances are centroid-to-centroid, which is honest about what it is: a way
 * to order the list, not a drive time.
 */
export function nearestServed(citySlug: string, limit = 5) {
  const origin = coverage.find((p) => p.city.slug === citySlug);
  if (!origin) return [];
  return coverage
    .filter((p) => p.city.slug !== citySlug)
    .map((p) => ({ pin: p, km: haversineKm([origin.lat, origin.lng], [p.lat, p.lng]) }))
    .sort((a, b) => a.km - b.km || a.pin.city.name.localeCompare(b.pin.city.name))
    .slice(0, limit);
}

/**
 * Where a computed local band sits against the published range — and why the
 * answer is sometimes "above it".
 *
 * ── The finding ───────────────────────────────────────────────────────────
 *
 * `data/services.ts` publishes installation at "From $11–$22 / sq ft
 * installed". The estimator's default configuration is solid white oak with a
 * site-applied matte finish, and in all 32 municipalities that configuration
 * prices at roughly $16–$24 / sq ft — through the top of the published range
 * and, in the dearest towns, past it.
 *
 * This is not a bug introduced by the city tables. It has been true of
 * /estimate since the estimator was written; the tables are simply the first
 * surface to render the number per square foot next to the published one,
 * where a reader can hold them side by side.
 *
 * ── Why both numbers are honest ───────────────────────────────────────────
 *
 * They measure different things. The published range is the envelope across
 * every specification this shop installs: $11 is engineered board, prefinished
 * — the estimator returns $11.50–$16.31 / sq ft for exactly that in Toronto —
 * and $22 is the premium end. The table prices ONE specification, and it is
 * not the cheap one. So the city pages say which specification they are
 * quoting, and say plainly that a budget specification lands lower.
 *
 * ── The decision that belongs to Franco, not to me ────────────────────────
 *
 * Two ways to close the gap, and both are business calls:
 *
 *   1. The published ceiling is wrong and should be about $25, because solid
 *      white oak site-finished in Oakville genuinely costs that.
 *   2. The published ceiling is right and the estimator's default spec is too
 *      rich — it should default to engineered/prefinished.
 *
 * Picking one silently would be me setting this shop's prices. Until it is
 * picked, `tests/city-depth.test.ts` bounds the drift so it cannot widen
 * unnoticed, and the copy tells the reader what they are looking at.
 */
export function bandVsPublished(row: LocalPrice, published: { low: number; high: number } | null) {
  if (!published) return "unpublished" as const;
  if (row.perUnitHigh > published.high) return "above" as const;
  if (row.perUnitLow < published.low) return "below" as const;
  return "inside" as const;
}
