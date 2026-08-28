import { services, priceBandOf, parsePriceBand } from "@/data/services";
import { SITE_URL } from "@/lib/site-url";
import { agentJson, agentPreflight } from "@/lib/agent-api";

export const dynamic = "force-static";

/**
 * GET /api/services.json — every service, with its price band as numbers.
 *
 * `llms.txt` gives an assistant prose it can quote. This gives a program
 * something it can compare, sort, and put in a table. Both are generated from
 * `data/services.ts`, so a price change moves the page, the JSON-LD, the text
 * files, and this endpoint in one edit.
 *
 * `priceLow` / `priceHigh` are parsed from the same `priceFrom` string the
 * page displays. A service quoted per project has no parseable band and
 * returns null rather than a number nobody can stand behind.
 */

export function OPTIONS() {
  return agentPreflight();
}

export function GET() {
  return agentJson({
    "@context": "https://schema.org",
    generator: `${SITE_URL}/llms.txt`,
    updated: new Date().toISOString().slice(0, 10),
    count: services.length,
    services: services.map((s) => ({
      slug: s.slug,
      name: s.name,
      shortName: s.shortName,
      summary: s.summary,
      url: `${SITE_URL}/services/${s.slug}`,
      priceDisplay: priceBandOf(s.slug),
      // Null where the string carries no genuine range — "Quoted per project"
      // has no ceiling, and inventing one is worse than saying so.
      priceLow: parsePriceBand(s.priceFrom)?.low ?? null,
      priceHigh: parsePriceBand(s.priceFrom)?.high ?? null,
      priceUnit: parsePriceBand(s.priceFrom)?.unit ?? null,
      priceCurrency: "CAD",
      priceNote:
        "Estimate band, before HST. A firm quote follows an on-site moisture reading.",
      duration: s.duration,
      keywords: s.keywords,
    })),
    excludes: [
      "laminate",
      "vinyl plank",
      "luxury vinyl tile",
      "tile",
      "carpet",
      "floating floors that are not real wood",
    ],
  });
}
