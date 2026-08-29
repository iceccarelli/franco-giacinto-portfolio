import { NextResponse } from "next/server";

/**
 * Shared plumbing for the public agent-facing JSON endpoints.
 *
 * These endpoints exist because an AI assistant answering "what do hardwood
 * stairs cost in Vaughan" should not have to parse an 87 KB text file to find
 * a number. `llms.txt` is prose for a language model; this is data for a
 * program. Both are generated from the same `data/` modules, so they cannot
 * disagree.
 *
 * Every response here is public, non-personal, already published on the site,
 * and safe to cache — so CORS is wide open by design. The previous state was
 * the opposite mistake: `/api/ask` had no CORS headers at all, which meant any
 * browser-based agent, any third-party page, and any in-browser tool was
 * blocked from an endpoint built specifically for them to call.
 */

export const AGENT_CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
} as const;

/** Public, cacheable JSON with CORS. `sMaxAge` seconds at the edge. */
export function agentJson(body: unknown, sMaxAge = 3600) {
  return NextResponse.json(body, {
    headers: {
      ...AGENT_CORS,
      "Cache-Control": `public, max-age=0, s-maxage=${sMaxAge}, stale-while-revalidate=86400`,
      "X-Robots-Tag": "all",
    },
  });
}

/** Preflight. Without this, a browser-based agent never gets to the GET. */
export function agentPreflight() {
  return new Response(null, { status: 204, headers: AGENT_CORS });
}
