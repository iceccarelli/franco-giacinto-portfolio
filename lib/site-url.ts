/**
 * Where this deployment actually lives.
 *
 * Every canonical tag, every JSON-LD `@id`, `metadataBase`, the sitemap, the
 * RSS feed, and llms.txt are built from this one value. Hard-coding it means a
 * deployment on a different host tells search engines the real content is
 * somewhere else — which, on a site with 359 pages, is 359 wrong signals.
 *
 * Resolution order, most specific first:
 *
 *   1. NEXT_PUBLIC_SITE_URL      set this by hand to override everything
 *   2. VERCEL_PROJECT_PRODUCTION_URL
 *                                Vercel sets this to the project's production
 *                                domain. Today that is the .vercel.app host;
 *                                the moment greenhardwood.ca is added as the
 *                                production domain, this becomes that, with no
 *                                code change and no forgotten TODO.
 *   3. localhost                 in `next dev`
 *   4. company.website           the intended final domain, for any other CI
 *
 * Note the deliberate asymmetry: `company.website` stays in data/company.ts as
 * a *business fact* — it is what the company's website is called, and it is what
 * the llms.txt citation line should say. SITE_URL is an *infrastructure fact* —
 * it is where these bytes are being served from right now. They converge once
 * the domain is live.
 */

import { company } from "@/data/company";

function normalise(url: string) {
  const withProtocol = /^https?:\/\//.test(url) ? url : `https://${url}`;
  return withProtocol.replace(/\/+$/, "");
}

function resolve() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return normalise(explicit);

  const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProduction) return normalise(vercelProduction);

  if (process.env.NODE_ENV === "development") return "http://localhost:3000";

  return normalise(company.website);
}

export const SITE_URL = resolve();

/**
 * True on a Vercel preview deployment.
 *
 * Preview builds are real, crawlable, publicly-addressable copies of the whole
 * site. Left alone they compete with production for the same queries and split
 * the ranking signal. Every page on a preview is marked noindex and robots.txt
 * disallows everything.
 *
 * Note the gap this flag does NOT cover: the production deployment is also
 * reachable at the project's *.vercel.app alias, where VERCEL_ENV is
 * "production". That host is noindexed by a host-matched X-Robots-Tag header
 * in next.config.mjs instead.
 */
export const IS_PREVIEW = process.env.VERCEL_ENV === "preview";
