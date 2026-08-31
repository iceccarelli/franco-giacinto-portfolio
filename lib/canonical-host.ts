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
  { action: "canonical" } | { action: "redirect"; host: string } | { action: "noindex" };

export function hostPolicy(rawHost: string | null | undefined): HostPolicy {
  const host = (rawHost ?? "").trim().toLowerCase();
  const bare = host.replace(/:\d+$/, "");

  if (bare === CANONICAL_HOST) return { action: "canonical" };
  if (bare === `www.${CANONICAL_HOST}`) return { action: "redirect", host: CANONICAL_HOST };
  if (LOCAL_HOSTS.has(bare)) return { action: "canonical" };

  // Unknown host — includes every *.vercel.app deployment URL. Never indexable.
  return { action: "noindex" };
}

/**
 * The public, cross-origin surfaces. These are the ONLY paths that may send
 * `Access-Control-Allow-Origin: *`.
 *
 * Why this list exists at all: production was observed sending ACAO `*` on
 * *HTML* — on greenhardwood.ca itself:
 *
 *   $ curl -sI https://greenhardwood.ca/
 *   access-control-allow-origin: *
 *
 * That header is set by no file in this repository, and — contrary to what an
 * earlier version of this comment claimed — it is not a Vercel dashboard
 * setting either. It is what Vercel attaches to everything it serves out of
 * static/prerendered storage. Measured on production:
 *
 *   /stairs   x-vercel-cache: PRERENDER   access-control-allow-origin: *
 *   /images/… (static asset)              access-control-allow-origin: *
 *   /search   (function-rendered)         no CORS header at all
 *
 * Which means middleware cannot remove it: the delete below runs before the
 * CDN attaches its own header. The local test that appeared to prove the
 * delete worked was vacuous — `next start` never sets the header, so there was
 * nothing to delete. The override that actually bites is declared in
 * next.config.mjs, where it becomes part of the build output routing config.
 *
 * This list still governs which paths may be cross-origin readable at all, and
 * that scoping is what next.config.mjs excludes from the override. The delete
 * stays as a second layer for any host or proxy that does set it upstream.
 */
const CORS_PUBLIC_PREFIXES = [
  "/api/", // facts.json, services.json, areas.json, ask
  "/card.vcf", // vCard 4.0, fetched by contact managers
  "/.well-known/", // agents.json
  "/llms.txt",
  "/llms-full.txt",
  "/ai.txt",
  "/feed.xml",
];

/** True when this path is deliberately readable from any origin. */
export function isCorsPublicPath(pathname: string) {
  return CORS_PUBLIC_PREFIXES.some((p) =>
    p.endsWith("/") ? pathname.startsWith(p) : pathname === p,
  );
}
