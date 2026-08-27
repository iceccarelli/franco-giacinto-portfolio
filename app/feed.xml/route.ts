import { company } from "@/data/company";
import { guides } from "@/data/guides";

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
  const items = guides
    .map(
      (g) => `    <item>
      <title>${esc(g.title)}</title>
      <link>${company.website}/guides/${g.slug}</link>
      <guid isPermaLink="true">${company.website}/guides/${g.slug}</guid>
      <description>${esc(g.description)}</description>
      <category>${esc(g.kicker)}</category>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(company.name)} — Hardwood Guides</title>
    <link>${company.website}/guides</link>
    <atom:link href="${company.website}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Hardwood flooring, stairs, and railings guidance for Toronto and the GTA.</description>
    <language>en-ca</language>
    <copyright>${esc(company.legalName)}</copyright>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
