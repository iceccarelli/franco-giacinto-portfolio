import { cities } from "@/data/areas";
import { serviceKinds } from "@/data/estimate";

/**
 * Lead validation and normalisation.
 *
 * Deliberately dependency-free. A quote request has six fields and four rules;
 * pulling in a schema library to express that would be more code, not less, and
 * this module has to be importable from both the client and a Server Action.
 */

export type LeadField = "name" | "phone" | "email" | "city" | "service" | "sqft" | "message";

export type Lead = {
  name: string;
  phone: string;
  email: string;
  city: string;
  service: string;
  sqft: number | null;
  message: string;
  /** Where on the site the request came from, for attribution. */
  source: string;
  receivedAt: string;
};

export type LeadErrors = Partial<Record<LeadField | "form", string>>;

/**
 * The only part of an accepted lead that is allowed to reach an analytics
 * vendor.
 *
 * City slug, service kind, whether a size was given, and which surface the
 * form was on. No name, no phone, no email, no free text — those go to the
 * inbox and stop there. Typed separately from `values` so the boundary is
 * something a reviewer can see rather than a convention someone has to
 * remember.
 */
export type LeadAnalytics = {
  city: string;
  service: string;
  has_photos: boolean;
  has_stairs: boolean;
  source: string;
};

export type LeadState = {
  status: "idle" | "success" | "error";
  errors: LeadErrors;
  /** Echoed back so the form can repopulate after a failed round trip. */
  values: Partial<Record<LeadField, string>>;
  /** Present only on `status: "success"`. Coarse dimensions, never PII. */
  analytics?: LeadAnalytics;
};

export const initialLeadState: LeadState = { status: "idle", errors: {}, values: {} };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Digits only, so (416) 847-3366, 416-847-3366 and +1 416 847 3366 all pass. */
function digits(value: string) {
  return value.replace(/\D/g, "");
}

const cityValues = new Set<string>(cities.map((c) => c.slug));
const serviceValues = new Set<string>(serviceKinds.map((s) => s.id));

export function parseLead(
  form: FormData,
  source: string,
):
  | { ok: true; lead: Lead }
  | { ok: false; errors: LeadErrors; values: Partial<Record<LeadField, string>> } {
  const read = (key: LeadField) => String(form.get(key) ?? "").trim();

  const values = {
    name: read("name"),
    phone: read("phone"),
    email: read("email"),
    city: read("city"),
    service: read("service"),
    sqft: read("sqft"),
    message: read("message"),
  };

  const errors: LeadErrors = {};

  if (values.name.length < 2) {
    errors.name = "Tell us who to ask for.";
  } else if (values.name.length > 120) {
    errors.name = "That name is too long for our system.";
  }

  const phoneDigits = digits(values.phone);
  if (phoneDigits.length < 10 || phoneDigits.length > 15) {
    errors.phone = "We need a reachable number — 10 digits, area code included.";
  }

  if (!EMAIL.test(values.email)) {
    errors.email = "That email address will not reach you.";
  }

  if (!cityValues.has(values.city)) {
    errors.city = "Pick a city from the list so we can route the crew.";
  }

  if (!serviceValues.has(values.service)) {
    errors.service = "Pick the closest service. We will sort out the detail on site.";
  }

  let sqft: number | null = null;
  if (values.sqft) {
    const parsed = Number(digits(values.sqft));
    if (!Number.isFinite(parsed) || parsed <= 0 || parsed > 200_000) {
      errors.sqft = "Enter a number of square feet, or leave this blank.";
    } else {
      sqft = parsed;
    }
  }

  if (values.message.length < 10) {
    errors.message = "A sentence is enough — what are we walking into?";
  } else if (values.message.length > 4000) {
    errors.message = "Please keep this under 4,000 characters.";
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors, values };

  return {
    ok: true,
    lead: {
      name: values.name,
      phone: values.phone,
      email: values.email.toLowerCase(),
      city: values.city,
      service: values.service,
      sqft,
      message: values.message,
      source,
      receivedAt: new Date().toISOString(),
    },
  };
}

export function cityLabel(slug: string) {
  return cities.find((c) => c.slug === slug)?.name ?? slug;
}

export function serviceLabel(id: string) {
  return serviceKinds.find((s) => s.id === id)?.label ?? id;
}
