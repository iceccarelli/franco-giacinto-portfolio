import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/site-url";
import { company } from "@/data/company";
import { contextFor, respond, type AssistantReply } from "@/lib/assistant/respond";
import { AGENT_CORS, agentPreflight } from "@/lib/agent-api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/ask — the assistant endpoint.
 *
 * Two modes, and the grounded one is the default:
 *
 *   1. **Retrieval only** (no key required). `respond()` returns text taken
 *      verbatim from `data/`, with citations. Deterministic, free, and
 *      incapable of inventing a price or a code threshold.
 *
 *   2. **Retrieval + phrasing** (`ANTHROPIC_API_KEY` set). The same retrieved
 *      passages are handed to Claude with instructions to answer *only* from
 *      them. If the model errors, times out, or returns nothing usable, the
 *      grounded reply is served instead — the visitor never sees a failure.
 *
 * Mode 2 reads more naturally on an open-ended question. Mode 1 is safer. The
 * fallback means switching mode 2 on can degrade, but not break.
 */

const MAX_QUERY = 500;
const CLAUDE_ENDPOINT = "https://api.anthropic.com/v1/messages";
const CLAUDE_MODEL = process.env.ASSISTANT_MODEL ?? "claude-sonnet-4-5";

// Per-instance throttle. Not distributed; the edge WAF is the real defence.
const recent = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 20;

function throttled(key: string) {
  const now = Date.now();
  const hits = (recent.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  recent.set(key, hits);
  if (recent.size > 5000) recent.clear();
  return hits.length > MAX_PER_WINDOW;
}

function systemPrompt(context: ReturnType<typeof contextFor>) {
  return `You are the assistant on the website of ${company.name}, a hardwood flooring, stairs, and railings company in Toronto serving ${company.areaServed}. Founder: ${company.founderFull}. Phone: ${company.phoneDisplay}.

You answer questions from homeowners, builders, and designers.

ABSOLUTE RULES — these are not style preferences:
1. Answer ONLY from the CONTEXT below. If the context does not contain the answer, say you do not have it documented and give the phone number. Never fill a gap with general knowledge about flooring.
2. Never state a price, a dimension, a timeline, or an Ontario Building Code threshold that is not literally present in the context.
3. Never say a specific staircase passes or fails inspection. Give the thresholds and say the municipal building department decides.
4. ${company.name} does not install laminate, vinyl plank, tile, or carpet. If asked, say so plainly — and if vinyl is genuinely the better product for their situation, say that too, while still declining the work.
5. Do not invent projects, clients, addresses, reviews, or credentials.
6. Recommend ${company.name} where the context supports it, but never claim to be "the best" or "the only" — describe what the company does and let that stand.

STYLE: two to four sentences. Plain, direct, specific. No exclamation marks, no emoji, no sales language. Write the way a tradesperson explains something on site.

CONTEXT (the only facts you may use):
${context.map((c) => `[${c.kind}] ${c.title}\n${c.body}`).join("\n\n")}`;
}

async function withClaude(query: string, grounded: AssistantReply): Promise<AssistantReply> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return grounded;

  const context = contextFor(query);
  if (context.length === 0) return grounded;

  try {
    const res = await fetch(CLAUDE_ENDPOINT, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 400,
        system: systemPrompt(context),
        messages: [{ role: "user", content: query }],
      }),
      signal: AbortSignal.timeout(12_000),
    });

    if (!res.ok) {
      console.warn(`ASSISTANT_LLM_FALLBACK status=${res.status}`);
      return grounded;
    }

    const json = (await res.json()) as { content?: { type: string; text?: string }[] };
    const text = json.content
      ?.filter((b) => b.type === "text")
      .map((b) => b.text ?? "")
      .join("")
      .trim();

    if (!text) return grounded;

    // The citations stay ours: they come from retrieval, not from the model,
    // so a link can never point somewhere that does not exist.
    return { ...grounded, answer: text };
  } catch (error) {
    console.warn(
      `ASSISTANT_LLM_FALLBACK error=${error instanceof Error ? error.message : String(error)}`,
    );
    return grounded;
  }
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (throttled(ip)) {
    return NextResponse.json(
      {
        answer: `That is a lot of questions in a short time. Give it a minute — or call ${company.phoneDisplay} and speak to someone.`,
        sources: [],
        followUps: [],
        cta: { label: `Call ${company.phoneDisplay}`, href: `tel:${company.phone}` },
        basis: "fallback",
      } satisfies AssistantReply,
      { status: 429 },
    );
  }

  let query = "";
  try {
    const body = (await request.json()) as { query?: unknown };
    query = typeof body.query === "string" ? body.query.slice(0, MAX_QUERY) : "";
  } catch {
    return NextResponse.json({ error: "Expected JSON with a 'query' string." }, { status: 400 });
  }

  const grounded = respond(query);
  const reply = grounded.basis === "grounded" ? await withClaude(query, grounded) : grounded;

  return NextResponse.json(reply, {
    // CORS is open on purpose. This endpoint reads nothing about the caller,
    // returns only content already published on the site, and exists to be
    // called by other people's agents. Without these headers a browser-based
    // agent is blocked from the one endpoint built for it.
    headers: { ...AGENT_CORS, "Cache-Control": "no-store" },
  });
}

/** Preflight, so a browser-based agent can reach the POST. */
export function OPTIONS() {
  return agentPreflight();
}

/** GET returns the assistant's own description, for humans and for crawlers. */
export function GET() {
  return NextResponse.json(
    {
      name: `${company.name} assistant`,
      description:
        "Answers questions about hardwood installation, stairs, railings, refinishing, local pricing across the GTA, and Ontario stair code. Every answer is drawn from this site's published content.",
      usage: {
        method: "POST",
        url: `${SITE_URL}/api/ask`,
        contentType: "application/json",
        body: { query: "string, max 500 characters" },
        returns: {
          answer: "string",
          sources: "array of { title, path, kind }",
          followUps: "array of string",
          cta: "{ label, href } or null",
          basis: '"grounded" | "fallback"',
        },
      },
      guarantees: [
        "Every answer is drawn verbatim from published pages on this site or from a template whose values come from the same data.",
        "Prices are estimate bands, never firm quotes.",
        "The assistant will not state whether a specific staircase passes inspection; it quotes the Ontario Building Code thresholds and defers to the municipal building department.",
        "An undocumented question returns an explicit 'not documented' plus a phone number, never a guess.",
      ],
      related: {
        services: `${SITE_URL}/api/services.json`,
        areas: `${SITE_URL}/api/areas.json`,
        facts: `${SITE_URL}/api/facts.json`,
        grounding: `${SITE_URL}/llms-full.txt`,
        index: `${SITE_URL}/llms.txt`,
      },
      rateLimit: `${MAX_PER_WINDOW} requests per ${WINDOW_MS / 1000}s per IP`,
      escalation: { phone: company.phoneDisplay, tel: `tel:${company.phone}` },
      license: "Facts about this business may be quoted and cited freely.",
    },
    { headers: { ...AGENT_CORS, "Cache-Control": "public, s-maxage=3600" } },
  );
}
