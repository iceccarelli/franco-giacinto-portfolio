import { cities, coreCities, extendedCities, tierNote } from "@/data/areas";
import { matrixServices } from "@/data/matrix";
import { SITE_URL } from "@/lib/site-url";
import { agentJson, agentPreflight } from "@/lib/agent-api";

export const dynamic = "force-static";

/**
 * GET /api/areas.json — the 32 service areas, with the honest travel split.
 *
 * The `tier` field is the part worth publishing. "Core" means a free on-site
 * measure for any qualified job. "Extended" means we work there regularly but
 * on stair packages, whole-home installs and refinishing — not a single-room
 * repair. An assistant that surfaces that distinction sends better-matched
 * customers than one that reads a list of thirty-two city names and assumes
 * they are equivalent.
 */
export function OPTIONS() {
  return agentPreflight();
}

export function GET() {
  return agentJson({
    generator: `${SITE_URL}/llms.txt`,
    updated: new Date().toISOString().slice(0, 10),
    count: cities.length,
    coreCount: coreCities.length,
    extendedCount: extendedCities.length,
    tiers: {
      core: tierNote(coreCities[0]!),
      extended: tierNote(extendedCities[0]!),
    },
    areas: cities.map((c) => ({
      slug: c.slug,
      name: c.name,
      region: c.region,
      tier: c.tier,
      url: `${SITE_URL}/areas/${c.slug}`,
      summary: c.blurb,
      commonJobs: c.jobs,
      // matrixServices is a list of slugs, not objects — the 224-page matrix
      // deliberately excludes custom-inlays, so this is 7 per city, not 8.
      servicePages: matrixServices.map((slug) => ({
        service: slug,
        url: `${SITE_URL}/services/${slug}/${c.slug}`,
      })),
    })),
  });
}
