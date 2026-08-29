import { buildVCard } from "@/lib/vcard";
import { AGENT_CORS, agentPreflight } from "@/lib/agent-api";

export const dynamic = "force-static";

/**
 * GET /card.vcf — the contact card, downloadable.
 *
 * `Content-Disposition: attachment` with a real filename, because a vCard
 * served inline is rendered as plain text by desktop browsers instead of
 * offering to save it. iOS and Android both act on the MIME type regardless,
 * so this only affects the desktop case — which is the one where someone is
 * looking at the page and wants the card in Outlook.
 */
export function OPTIONS() {
  return agentPreflight();
}

export function GET() {
  return new Response(buildVCard(), {
    headers: {
      ...AGENT_CORS,
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": 'attachment; filename="green-hardwood.vcf"',
      "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
