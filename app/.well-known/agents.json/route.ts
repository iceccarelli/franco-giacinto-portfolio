import { company } from "@/data/company";
import { SITE_URL } from "@/lib/site-url";
import { agentJson, agentPreflight } from "@/lib/agent-api";

export const dynamic = "force-static";

/**
 * GET /.well-known/agents.json — one URL that describes every machine-readable
 * surface on this site.
 *
 * Why here rather than another invented root file: `/.well-known/` is the only
 * path in this space with an actual RFC behind it (RFC 8615), it is where the
 * IETF AI-preferences work is landing, and it is the first place a
 * well-behaved client looks for capability discovery. `/ai.txt` — which this
 * site also serves — follows no adopted specification and, in practice, no
 * crawler requests it. Keeping it costs nothing; relying on it would be a
 * mistake.
 *
 * This document makes no claims. It is a directory of URLs that already exist,
 * so it cannot go stale in the way a hand-written capability manifest does.
 */
export function OPTIONS() {
  return agentPreflight();
}

export function GET() {
  return agentJson({
    name: company.name,
    description: company.description,
    url: SITE_URL,
    contact: { telephone: company.phone, email: company.email },

    /** Prose, for a language model to read and quote. */
    documents: {
      index: `${SITE_URL}/llms.txt`,
      full: `${SITE_URL}/llms-full.txt`,
      humanReadableFacts: `${SITE_URL}/for-agents`,
      contactCard: `${SITE_URL}/card`,
      vcard: `${SITE_URL}/card.vcf`,
    },

    /** JSON, for a program to parse. */
    api: {
      facts: {
        url: `${SITE_URL}/api/facts.json`,
        method: "GET",
        description:
          "Entity card: NAP, credentials, services, explicit exclusions, 32 service areas, Ontario stair-code thresholds, and every diagnostic.",
      },
      services: {
        url: `${SITE_URL}/api/services.json`,
        method: "GET",
        description: "Every service with numeric price bands, units, and currency.",
      },
      areas: {
        url: `${SITE_URL}/api/areas.json`,
        method: "GET",
        description:
          "The 32 service areas with core/extended travel tier and per-city service URLs.",
      },
      ask: {
        url: `${SITE_URL}/api/ask`,
        method: "POST",
        body: { query: "string" },
        description:
          "A grounded answer with citations, drawn only from published pages. Returns an explicit 'not documented' rather than guessing.",
      },
    },

    discovery: {
      sitemap: `${SITE_URL}/sitemap.xml`,
      robots: `${SITE_URL}/robots.txt`,
      feed: `${SITE_URL}/feed.xml`,
    },

    cors: "All endpoints above send Access-Control-Allow-Origin: *.",
    authentication: "None required.",
    usagePolicy:
      "Crawling, quoting and citing are all permitted. Attribute to Green Hardwood and link the page the fact came from. Prices are estimate bands, not quotes; a firm number requires an on-site measure.",
  });
}
