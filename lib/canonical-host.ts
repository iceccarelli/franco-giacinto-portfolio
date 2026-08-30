/**
 * Host policy for the request-time guard in middleware.ts.
 *
 * The canonical host derives from `company.website` — the *business* fact —
 * and deliberately not from SITE_URL. SITE_URL follows the deployment
 * (VERCEL_PROJECT_PRODUCTION_URL), so on a misconfigured project it can be the
 * .vercel.app alias; a guard built on it would then noindex the real domain
 * and index the clone. Built on the business fact, a misconfiguration fails
 * closed: an unexpected host is noindexed, the canonical host never is.
 *
 * Three outcomes, decided from the Host header alone:
 *
 *   "canonical"  greenhardwood.ca (or local dev) — serve normally, no marker.
 *   "redirect"   www.greenhardwood.ca — 308 to the apex, path and query kept.
 *   "noindex"    everything else — every *.vercel.app preview and alias, any
 *                mirror, any stapled domain. Serve the page (previews must
 *                stay viewable) but stamp X-Robots-Tag: noindex, nofollow.
 */

import { company } from "@/data/company";

export const CANONICAL_HOST = new URL(company.website).host;

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]", "0.0.0.0"]);

export type HostPolicy =
  | { action: "canonical" }
  | { action: "redirect"; host: string }
  | { action: "noindex" };

export function hostPolicy(rawHost: string | null | undefined): HostPolicy {
  const host = (rawHost ?? "").trim().toLowerCase();
  const bare = host.replace(/:\d+$/, "");

  if (bare === CANONICAL_HOST) return { action: "canonical" };
  if (bare === `www.${CANONICAL_HOST}`) return { action: "redirect", host: CANONICAL_HOST };
  if (LOCAL_HOSTS.has(bare)) return { action: "canonical" };

  // Unknown host — includes every *.vercel.app deployment URL. Never indexable.
  return { action: "noindex" };
}
