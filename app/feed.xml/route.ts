import { agentText } from "@/lib/agent-api";
import { company } from "@/data/company";
import { SITE_URL } from "@/lib/site-url";
import { guides, updatedDate } from "@/data/guides";

export const dynamic = "force-static";

function esc(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * RSS 2.0 for the guides. Aggregators, newsreaders, and several AI crawlers
 * discover new content through a feed long before they re-crawl a sitemap.
 */
export function GET() {
  /**
   * Newest first, with a real <pubDate>. The feed previously had neither — and
   * pubDate is the single field an aggregator uses to decide an item is new, so
   * a feed without it announces nothing no matter how often it is fetched.
   */
  const sorted = [...guides].sort((a, b) => updatedDate(b).getTime() - updatedDate(a).getTime());

  const items = sorted
    .map(
      (g) => `    <item>
      <title>${esc(g.title)}</title>
      <link>${SITE_URL}/guides/${g.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/guides/${g.slug}</guid>
      <description>${esc(g.description)}</description>
      <category>${esc(g.kicker)}</category>
      <pubDate>${updatedDate(g).toUTCString()}</pubDate>
    </item>`,
    )
    .join("\n");

  const newest = sorted[0];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(company.name)} — Hardwood Guides</title>
    <link>${SITE_URL}/guides</link>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Hardwood flooring, stairs, and railings guidance for Toronto and the GTA.</description>
    <language>en-ca</language>
    <copyright>${esc(company.legalName)}</copyright>
    <lastBuildDate>${(newest ? updatedDate(newest) : new Date()).toUTCString()}</lastBuildDate>
    <ttl>1440</ttl>
${items}
  </channel>
</rss>`;

  return agentText(xml, "application/rss+xml; charset=utf-8");
}
