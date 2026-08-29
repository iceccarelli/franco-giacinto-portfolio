import type { MetadataRoute } from "next";
import { IS_PREVIEW, SITE_URL } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  // A preview deployment is a full, publicly-reachable copy of the site. Let it
  // be indexed and it competes with production for its own queries.
  if (IS_PREVIEW) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      { userAgent: "*", allow: "/" },
      // Answer engines are a distribution channel, not a threat. Let them in.
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" },
      { userAgent: "Bingbot", allow: "/" },
      { userAgent: "DuckDuckBot", allow: "/" },
      { userAgent: "Amazonbot", allow: "/" },
      { userAgent: "Bytespider", allow: "/" },
      { userAgent: "CCBot", allow: "/" },
      { userAgent: "cohere-ai", allow: "/" },
      { userAgent: "Diffbot", allow: "/" },
      { userAgent: "FacebookBot", allow: "/" },
      { userAgent: "meta-externalagent", allow: "/" },
      { userAgent: "MistralAI-User", allow: "/" },
      { userAgent: "YouBot", allow: "/" },
      { userAgent: "Timpibot", allow: "/" },
      { userAgent: "omgili", allow: "/" },
    ],
    /**
     * Only real sitemaps go here. Listing /llms.txt under `Sitemap:` would
     * advertise it to every crawler in one line — and would also make Search
     * Console and Bing Webmaster Tools fetch it, fail to parse XML, and show a
     * standing "sitemap could not be read" error. llms.txt is advertised on
     * /.well-known/agents.json, on /for-agents, and via <link rel="alternate">
     * instead.
     */
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
