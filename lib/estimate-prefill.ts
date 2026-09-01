import { cities } from "@/data/areas";
import { emptyEstimate, serviceKinds, type EstimateInput, type ServiceKind } from "@/data/estimate";

/**
 * Seeding the estimator from where the visitor came from, and remembering it.
 *
 * Two defects this exists to close.
 *
 * 1. The catalogue already links `/estimate?service=hardwood-stairs`, and the
 *    brief asks city pages to link `/estimate?city=vaughan`. Nothing read
 *    either parameter. They were passed into a void, and every visitor landed
 *    on the same default — 800 sq ft of white oak in Toronto — no matter which
 *    page sent them or what they had just been reading about.
 *
 * 2. `/estimate` rendered the calculator and the lead form as two unrelated
 *    components. Somebody who set city, service and size on the calculator
 *    then had to type city, service and size again into the form directly
 *    beneath it. On a page whose only job is to capture a lead, asking for the
 *    same three answers twice is the most expensive friction available.
 */

/**
 * `data/services.ts` slugs and `data/estimate.ts` ServiceKind ids are two
 * different vocabularies — "hardwood-stairs" versus "stairs". Every link into
 * the estimator names a *service slug*, because that is what the URL space
 * uses, so the translation lives here instead of being reinvented per call site.
 */
const SERVICE_SLUG_TO_KIND: Record<string, ServiceKind> = {
  "hardwood-installation": "install",
  "hardwood-stairs": "stairs",
  "hardwood-railings": "railings",
  "sanding-refinishing": "refinish",
  "hardwood-repairs": "repair",
  "hardwood-decks": "deck",
  // Commercial and inlay work is quoted as an install. The estimator has no
  // separate line for either, and inventing one would produce a number the
  // shop cannot stand behind.
  "commercial-hardwood": "install",
  "custom-inlays": "install",
};

const KINDS = new Set<string>(serviceKinds.map((s) => s.id));
const CITY_SLUGS = new Set<string>(cities.map((c) => c.slug));

/** A service kind from either vocabulary, or undefined if it is neither. */
export function serviceKindFrom(value: string | undefined | null): ServiceKind | undefined {
  if (!value) return undefined;
  const v = value.trim().toLowerCase();
  if (KINDS.has(v)) return v as ServiceKind;
  return SERVICE_SLUG_TO_KIND[v];
}

/** A city slug the estimator actually prices, or undefined. */
export function cityFrom(value: string | undefined | null): string | undefined {
  if (!value) return undefined;
  const v = value.trim().toLowerCase();
  return CITY_SLUGS.has(v) ? v : undefined;
}

/**
 * Build the estimator's starting state from a URL.
 *
 * Unknown values are ignored rather than rejected: a stale link naming a
 * service that no longer exists should still open a working estimator, not an
 * error page.
 */
export function prefillFrom(
  params: Record<string, string | string[] | undefined>,
): Partial<EstimateInput> {
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const out: Partial<EstimateInput> = {};

  const service = serviceKindFrom(one(params.service));
  if (service) out.service = service;

  const city = cityFrom(one(params.city));
  if (city) out.city = city;

  const sqft = Number(one(params.sqft));
  if (Number.isFinite(sqft) && sqft >= 120 && sqft <= 4500) out.sqft = Math.round(sqft);

  const steps = Number(one(params.steps));
  if (Number.isFinite(steps) && steps >= 0 && steps <= 40) out.stairs = Math.round(steps);

  return out;
}

/**
 * Where an abandoned configuration is kept.
 *
 * Deliberately narrow: only the four fields that describe the *job*. Never a
 * name, a phone number or an email — those belong in the inbox and nowhere
 * else, least of all in a browser store that any script on the page can read.
 *
 * No expiry games, no re-engagement nagging, no dark patterns. If somebody
 * comes back, their configuration is where they left it. That is all it does.
 */
export const ESTIMATE_STORAGE_KEY = "gh.estimate.v1";

type Stored = Pick<EstimateInput, "service" | "city" | "sqft" | "stairs">;

export function readStoredEstimate(): Partial<EstimateInput> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(ESTIMATE_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Partial<Stored>;
    const out: Partial<EstimateInput> = {};
    const service = serviceKindFrom(parsed.service);
    if (service) out.service = service;
    const city = cityFrom(parsed.city);
    if (city) out.city = city;
    if (typeof parsed.sqft === "number" && parsed.sqft >= 120 && parsed.sqft <= 4500)
      out.sqft = parsed.sqft;
    if (typeof parsed.stairs === "number" && parsed.stairs >= 0 && parsed.stairs <= 40)
      out.stairs = parsed.stairs;
    return out;
  } catch {
    // Private mode, cleared storage, a browser that blocks it, corrupt JSON.
    // None of these deserves an error: the estimator just starts fresh.
    return {};
  }
}

export function writeStoredEstimate(input: EstimateInput) {
  if (typeof window === "undefined") return;
  try {
    const slim: Stored = {
      service: input.service,
      city: input.city,
      sqft: input.sqft,
      stairs: input.stairs,
    };
    window.localStorage.setItem(ESTIMATE_STORAGE_KEY, JSON.stringify(slim));
  } catch {
    /* Storage unavailable. The estimator works without it. */
  }
}

/** The default state with a prefill applied over it. */
export function seedEstimate(prefill: Partial<EstimateInput>): EstimateInput {
  return { ...emptyEstimate(), ...prefill };
}
