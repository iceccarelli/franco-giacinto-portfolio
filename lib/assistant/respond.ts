import "server-only";
import { company } from "@/data/company";
import { formatCad, getMatrixPage } from "@/data/matrix";
import {
  detectCity,
  detectIntent,
  detectService,
  retrieve,
  type Passage,
} from "@/lib/assistant/knowledge";

/**
 * Composing a reply.
 *
 * The rule this module exists to enforce: **the assistant never states a fact
 * that is not already on the site.** Every sentence it returns is either
 * verbatim from `data/`, or a template whose variables come from `data/`.
 *
 * That is a deliberate trade against a free-form LLM. A flooring contractor
 * whose chat widget invents a price, or says a stair passes code when it does
 * not, has a liability problem, not a feature. When the assistant does not know,
 * it says so and hands over a phone number.
 *
 * `ANTHROPIC_API_KEY` enables a phrasing layer on top of this — see
 * `app/api/ask/route.ts`. Even then, the retrieved passages are the only
 * material the model is allowed to use.
 */

export type Source = { title: string; path: string; kind: Passage["kind"] };

export type AssistantReply = {
  answer: string;
  sources: Source[];
  followUps: string[];
  cta: { label: string; href: string } | null;
  /** "grounded" = quoted from site content. "fallback" = no confident match. */
  basis: "grounded" | "fallback";
};

const CALL_CTA = { label: `Call ${company.phoneDisplay}`, href: `tel:${company.phone}` };
const ESTIMATE_CTA = { label: "Get a free estimate", href: "/estimate" };
const STAIRS_CTA = { label: "Open the stair studio", href: "/stairs" };

const toSource = (p: Passage): Source => ({ title: p.title, path: p.path, kind: p.kind });

/** Small helper so inline source literals keep their narrow `kind` type. */
const source = (title: string, path: string, kind: Passage["kind"]): Source => ({
  title,
  path,
  kind,
});

const DEFAULT_FOLLOW_UPS = [
  "How much do hardwood stairs cost?",
  "Do you work in Vaughan?",
  "Solid or engineered for a condo?",
  "Will my stairs pass inspection?",
];

export function respond(query: string): AssistantReply {
  const trimmed = query.trim();

  if (trimmed.length < 3) {
    return {
      answer:
        "Ask me about hardwood stairs, installation, refinishing, what a job costs in your city, or whether a flight will pass Ontario code.",
      sources: [],
      followUps: DEFAULT_FOLLOW_UPS,
      cta: null,
      basis: "fallback",
    };
  }

  const intent = detectIntent(trimmed);
  const city = detectCity(trimmed);
  const service = detectService(trimmed);
  const hits = retrieve(trimmed, 4);
  const top = hits[0];

  // ---------------------------------------------------------------- pricing
  // A price question naming both a service and a city has one correct answer:
  // that city's computed band. Never a national average, never a guess.
  if (intent === "pricing" && service && city) {
    const page = getMatrixPage(service.slug, city.slug);
    if (page) {
      return {
        answer: `In ${city.name}, ${page.band.basis} of ${service.shortName.toLowerCase()} typically runs ${formatCad(page.band.low)}–${formatCad(page.band.high)} before HST, and takes ${page.band.timeline}. That range is calibrated to 2026 Greater Toronto labour and mill pricing. It becomes a firm number after a site visit, because moisture readings and the condition of the subfloor or stringers move it more than anything you can tell me in a chat.`,
        sources: [
          source(`${service.shortName} in ${city.name}`, page.path, "Local"),
          source("2026 estimator", "/estimate", "Service"),
        ],
        followUps: [
          `What affects the price of ${service.shortName.toLowerCase()}?`,
          `Do you work anywhere else near ${city.name}?`,
          "How long does a site visit take?",
        ],
        cta: ESTIMATE_CTA,
        basis: "grounded",
      };
    }
  }

  if (intent === "pricing" && service && !city) {
    return {
      answer: `${service.name}: ${service.priceFrom}. ${service.duration}. ${service.summary} Tell me your city and I will give you the local band — pricing varies across the GTA with labour and access.`,
      sources: [
        source(service.name, `/services/${service.slug}`, "Service"),
        source("2026 estimator", "/estimate", "Service"),
      ],
      followUps: [
        `${service.shortName} in Toronto?`,
        `${service.shortName} in Vaughan?`,
        `${service.shortName} in Mississauga?`,
      ],
      cta: ESTIMATE_CTA,
      basis: "grounded",
    };
  }

  // ------------------------------------------------------------------- code
  // Code questions get the thresholds and an explicit disclaimer. We do not
  // tell anyone their specific stair passes.
  if (intent === "code") {
    const codeHits = hits.filter((h) => h.passage.kind === "Code");
    const chosen = codeHits.length > 0 ? codeHits : hits.slice(0, 2);
    const body = chosen.map((h) => h.passage.body).join(" ");
    return {
      answer: `${body} Those are the thresholds we build to for private dwelling stairs under Ontario Building Code Part 9. The stair studio runs the full check against a flight you describe — but only your municipal building department can sign off on the stair you actually have.`,
      sources: [
        ...chosen.map((h) => toSource(h.passage)),
        source("Stair studio and code checker", "/stairs", "Service"),
      ].slice(0, 4),
      followUps: [
        "What makes a handrail graspable?",
        "Can you fix a stair that failed inspection?",
        "How much is a stair rebuild?",
      ],
      cta: STAIRS_CTA,
      basis: "grounded",
    };
  }

  // ------------------------------------------------------------------ scope
  // The refusal is part of the brand, and it is honest. Say it plainly.
  if (intent === "scope") {
    return {
      answer: `Green Hardwood works in solid and engineered hardwood only — installation, custom stairs, railings, dust-contained sanding, finishing, refinishing, repairs, inlays, decks, and commercial hardwood. We do not install laminate, vinyl plank, tile, or carpet. If vinyl is genuinely the smarter product for your situation — a rental basement, say — we will tell you that, and we still will not install it.`,
      sources: [
        source("Hardwood vs vinyl vs laminate", "/compare", "Company"),
        source("All services", "/services", "Service"),
      ],
      followUps: [
        "Why not vinyl?",
        "What is engineered hardwood?",
        "Can you refinish instead of replacing?",
      ],
      cta: null,
      basis: "grounded",
    };
  }

  // ---------------------------------------------------------------- contact
  if (intent === "contact") {
    return {
      answer: `Call ${company.phoneDisplay} or email ${company.email}. The studio is at ${company.address.line1}, ${company.address.city}, ${company.address.region} ${company.address.postal}. Hours are ${company.hoursSummary}. Site visits are free across ${company.areaServed} for qualified hardwood, stair, and railing work — and for a flood or a stair that failed inspection, call rather than using the form.`,
      sources: [source("Contact", "/contact", "Company")],
      followUps: [
        "Do you work in my city?",
        "How soon can you visit?",
        "What happens on a site visit?",
      ],
      cta: CALL_CTA,
      basis: "grounded",
    };
  }

  // ------------------------------------------------------- grounded default
  if (top && top.score >= 4) {
    const supporting = hits.slice(1, 3).map((h) => toSource(h.passage));

    // Where the question named a city, add the local page as a second source.
    if (city && service) {
      const page = getMatrixPage(service.slug, city.slug);
      if (page) {
        supporting.unshift(source(`${service.shortName} in ${city.name}`, page.path, "Local"));
      }
    }

    return {
      answer: top.passage.body,
      sources: [toSource(top.passage), ...supporting].slice(0, 3),
      followUps: hits
        .slice(1, 4)
        .filter((h) => h.passage.kind === "Answer" || h.passage.kind === "Method")
        .map((h) => h.passage.title)
        .slice(0, 3),
      cta: ESTIMATE_CTA,
      basis: "grounded",
    };
  }

  // --------------------------------------------------------------- fallback
  // No confident match. Say so rather than improvising.
  return {
    answer: `I do not have a documented answer for that one, and I would rather say so than guess. Franco can answer it directly — call ${company.phoneDisplay}, or book a free site visit and ask in person. If it helps, I can cover hardwood stairs, installation, refinishing, repairs, railings, decks, local pricing across the GTA, and Ontario stair code.`,
    sources: [
      source("Contact", "/contact", "Company"),
      source("All answers", "/answers", "Answer"),
    ],
    followUps: DEFAULT_FOLLOW_UPS,
    cta: CALL_CTA,
    basis: "fallback",
  };
}

/**
 * The context block handed to the optional LLM layer. Passing the retrieved
 * passages, and only these, is what keeps the model from inventing a price.
 */
export function contextFor(query: string) {
  return retrieve(query, 6).map(({ passage }) => ({
    title: passage.title,
    kind: passage.kind,
    path: passage.path,
    body: passage.body,
  }));
}
