/**
 * The event taxonomy. One file, one vocabulary.
 *
 * Rule 10 of the program: a page without events is unfinished. This module is
 * the contract that makes that checkable — every event this site can emit is
 * named here, with its payload typed, so a call site cannot invent an event
 * name that no GTM trigger is listening for, and `tests/analytics.test.ts`
 * can assert the taxonomy has not drifted from docs/analytics.md.
 *
 * Transport is `window.dataLayer`. GTM owns GA4 (see components/analytics),
 * so nothing here calls gtag directly — double-firing an event through both
 * GTM and a raw gtag snippet is the single most common way a conversion count
 * ends up doubled, and a doubled conversion count is worse than none.
 *
 * PRIVACY, and it is not negotiable: no parameter here carries a name, a
 * phone number, an email, a street address, or free text a visitor typed. The
 * coarse dimensions — city slug, service kind, step number, band bounds — are
 * enough to optimise on and carry nothing that identifies a person. A lead's
 * details go to the server action and the inbox, never to an analytics vendor.
 */

export type AnalyticsEvent =
  /** Tap on any tel: link. `location` says which chrome it lives in. */
  | { event: "tel_click"; location: string }
  /** Tap on any sms: link. */
  | { event: "sms_click"; location: string }
  /** First meaningful interaction with the estimator. */
  | { event: "estimate_start"; entry: string }
  /** Advancing the estimator. `step` is 1-indexed. */
  | { event: "estimate_step"; step: number; step_name: string }
  /** The band was computed and shown. Bounds are CAD, integers. */
  | {
      event: "estimate_band_shown";
      min: number;
      max: number;
      city: string;
      service: string;
    }
  /** A lead was accepted by the server action. A conversion. */
  | {
      event: "estimate_submit";
      city: string;
      service: string;
      has_photos: boolean;
      has_stairs: boolean;
      source: string;
    }
  /** The grounded assistant was opened. */
  | { event: "chat_open"; location: string }
  /** Entry into the stair studio from anywhere. */
  | { event: "stair_studio_click"; location: string }
  /** A portfolio case was opened. */
  | { event: "portfolio_job_open"; slug: string }
  /** Outbound to a profile we control. Corroborates the entity. */
  | { event: "outbound_instagram"; location: string }
  | { event: "outbound_gbp"; location: string }
  /** A downloadable spec or binder was taken. */
  | { event: "file_download"; file: string };

export type AnalyticsEventName = AnalyticsEvent["event"];

/**
 * The three that are marked as conversions in GA4.
 *
 * Deliberately short. A shop with one phone line converts when the phone
 * rings, when a text arrives, or when a qualified lead lands in the inbox.
 * Everything else on the list above is diagnostic — it explains a conversion,
 * it is not one, and marking it as one would flatter the numbers into
 * uselessness.
 */
export const CONVERSION_EVENTS = [
  "tel_click",
  "sms_click",
  "estimate_submit",
] as const satisfies readonly AnalyticsEventName[];

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/**
 * Push one typed event onto the dataLayer.
 *
 * Safe everywhere: no-ops during SSR, and no-ops when GTM was never
 * configured (no NEXT_PUBLIC_GTM_ID), so a developer running `next dev`
 * without analytics env vars sees no errors and no phantom queue. The array
 * is created if GTM has not booted yet — GTM drains whatever it finds.
 */
export function track(event: AnalyticsEvent) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ ...event });
}

/** Configured GTM container, or "" when measurement is not wired up yet. */
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "";
