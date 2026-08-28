import "server-only";
import { answers } from "@/data/answers";
import { cities, type City } from "@/data/areas";
import { company } from "@/data/company";
import { glossary } from "@/data/glossary";
import { guides } from "@/data/guides";
import { matrixPages, formatCad } from "@/data/matrix";
import { methods } from "@/data/methods";
import { OBC_LIMITS, obcRules } from "@/data/obc";
import { problems } from "@/data/problems";
import { getService, services } from "@/data/services";
import { species } from "@/data/species";

/**
 * The assistant's knowledge base.
 *
 * Everything here is derived from the same `data/` modules the pages render
 * from. There is no separate copy of the facts, so the assistant cannot answer
 * with a price, a code threshold, or a service description that disagrees with
 * what a visitor reads two clicks later.
 *
 * This module is server-only. Retrieval runs in the route handler, which keeps
 * roughly 90 KB of corpus out of the client bundle and means the widget ships as
 * a few kilobytes of UI.
 */

export type Passage = {
  id: string;
  /** What this passage is, for the citation chip. */
  kind:
    | "Problem"
    | "Answer"
    | "Service"
    | "Method"
    | "Guide"
    | "Term"
    | "Area"
    | "Local"
    | "Company"
    | "Code"
    | "Species";
  title: string;
  /** The text the assistant is allowed to say, verbatim. */
  body: string;
  path: string;
  /** Extra matchable terms not shown to the reader. */
  terms: string[];
  /** Baseline ranking weight; a direct Q&A outranks a definition. */
  weight: number;
};

function corpus(): Passage[] {
  const out: Passage[] = [];

  // Diagnostics. Someone describing a symptom is the highest-intent visitor on
  // the site, and the honest answer includes when the floor cannot be saved.
  for (const p of problems) {
    out.push({
      id: `problem:${p.slug}`,
      kind: "Problem",
      title: p.name,
      body: `${p.looksLike} Most likely cause: ${p.causes[0]?.cause ?? ""} — ${p.causes[0]?.tell ?? ""} ${p.outlookNote}`,
      path: `/problems/${p.slug}`,
      terms: [...p.alsoCalled, p.category, ...p.causes.map((c) => c.cause)],
      weight: 12,
    });
  }

  // Direct question/answer pairs — the highest-confidence source there is.
  for (const a of answers) {
    out.push({
      id: `answer:${a.slug}`,
      kind: "Answer",
      title: a.q,
      body: a.a,
      path: `/answers/${a.slug}`,
      terms: [a.intent, a.primaryService.replace(/-/g, " ")],
      weight: 10,
    });
  }

  // Services: what it is, what it costs, how long it takes.
  for (const s of services) {
    out.push({
      id: `service:${s.slug}`,
      kind: "Service",
      title: s.name,
      body: `${s.summary} ${s.priceFrom}. ${s.duration}.`,
      path: `/services/${s.slug}`,
      terms: [...s.keywords, s.shortName, s.eyebrow],
      weight: 9,
    });
  }

  // Service x city: a real local price band per combination.
  for (const p of matrixPages) {
    out.push({
      id: `local:${p.service.slug}:${p.city.slug}`,
      kind: "Local",
      title: `${p.service.shortName} in ${p.city.name}`,
      body: `In ${p.city.name}, ${p.band.basis} typically runs ${formatCad(p.band.low)}–${formatCad(p.band.high)} before HST, and takes ${p.band.timeline}. ${p.angle}`,
      path: p.path,
      terms: [p.city.name, p.city.region, p.service.shortName, ...p.keywords],
      weight: 11,
    });
  }

  // Methods: how the work is performed, and when it is the wrong choice.
  for (const m of methods) {
    out.push({
      id: `method:${m.slug}`,
      kind: "Method",
      title: m.name,
      body: `${m.summary} Correct when: ${m.when} Wrong when: ${m.whenNot}`,
      path: `/methods/${m.slug}`,
      terms: [m.cluster, m.headline, ...m.steps.map((s) => s.heading)],
      weight: 9,
    });
    for (const f of m.faqs) {
      out.push({
        id: `method-faq:${m.slug}:${f.q.slice(0, 24)}`,
        kind: "Method",
        title: f.q,
        body: f.a,
        path: `/methods/${m.slug}`,
        terms: [m.name, m.cluster],
        weight: 9,
      });
    }
  }

  // Service FAQs.
  for (const s of services) {
    for (const f of s.faqs) {
      out.push({
        id: `service-faq:${s.slug}:${f.q.slice(0, 24)}`,
        kind: "Answer",
        title: f.q,
        body: f.a,
        path: `/services/${s.slug}`,
        terms: [s.shortName, ...s.keywords],
        weight: 10,
      });
    }
  }

  // Guides — the long form, summarised.
  for (const g of guides) {
    out.push({
      id: `guide:${g.slug}`,
      kind: "Guide",
      title: g.title,
      body: g.description,
      path: `/guides/${g.slug}`,
      terms: [g.kicker],
      weight: 7,
    });
  }

  // Glossary.
  for (const t of glossary) {
    out.push({
      id: `term:${t.slug}`,
      kind: "Term",
      title: t.term,
      body: t.definition,
      path: `/glossary#${t.slug}`,
      terms: [t.cluster, t.short, ...t.seeAlso],
      weight: 6,
    });
  }

  // Cities.
  for (const c of cities) {
    out.push({
      id: `area:${c.slug}`,
      kind: "Area",
      title: `Hardwood work in ${c.name}`,
      body: `${c.blurb} ${c.typical}`,
      path: `/areas/${c.slug}`,
      terms: [c.name, c.region, ...c.jobs],
      weight: 8,
    });
  }

  // Species.
  for (const sp of species) {
    out.push({
      id: `species:${sp.id}`,
      kind: "Species",
      title: sp.name,
      body: `${sp.hardness}. Best for: ${sp.bestFor}. ${sp.verdict}`,
      path: "/showroom",
      terms: [sp.tone, ...sp.rooms],
      weight: 7,
    });
  }

  // Ontario Building Code thresholds.
  for (const r of obcRules) {
    out.push({
      id: `code:${r.id}`,
      kind: "Code",
      title: `Ontario stair code — ${r.label}`,
      body: r.note ? `${r.rule} ${r.note}` : r.rule,
      path: "/stairs",
      terms: [
        "ontario building code",
        "obc",
        "inspection",
        "inspector",
        "part 9",
        "legal",
        r.label,
      ],
      weight: 9,
    });
  }

  // The company itself.
  out.push(
    {
      id: "company:contact",
      kind: "Company",
      title: "Reaching Green Hardwood",
      body: `Call ${company.phoneDisplay} or email ${company.email}. The studio is at ${company.address.line1}, ${company.address.city}, ${company.address.region} ${company.address.postal}. Hours: ${company.hoursSummary}.`,
      path: "/contact",
      terms: [
        "phone",
        "call",
        "email",
        "address",
        "hours",
        "open",
        "location",
        "contact",
        "book",
        "appointment",
        "reach",
      ],
      weight: 10,
    },
    {
      id: "company:scope",
      kind: "Company",
      title: "What Green Hardwood does and does not install",
      body: `Green Hardwood works in solid and engineered hardwood only — installation, custom stairs, railings, dust-contained sanding, finishing, refinishing, repairs, inlays, decks, and commercial hardwood. We do not install laminate, vinyl plank, tile, or carpet. If vinyl is genuinely the better product for your situation, we will say so, and we still will not install it.`,
      path: "/compare",
      terms: [
        "vinyl",
        "laminate",
        "lvp",
        "carpet",
        "tile",
        "do you do",
        "do you install",
        "scope",
        "luxury vinyl",
      ],
      weight: 11,
    },
    {
      id: "company:warranty",
      kind: "Company",
      title: "Warranty and credentials",
      body: `${company.warranty}. ${company.licensed.join(", ")}. ${company.years}+ years across ${company.areaServed}.`,
      path: "/warranty",
      terms: [
        "warranty",
        "guarantee",
        "insured",
        "wsib",
        "licensed",
        "certified",
        "bona",
        "nwfa",
        "credentials",
        "covered",
      ],
      weight: 9,
    },
    {
      id: "company:founder",
      kind: "Company",
      title: `${company.founderFull}, ${company.founderTitle}`,
      body: `Green Hardwood was founded by ${company.founderFull}, a master hardwood craftsman who has worked under Toronto floors since 2009. He runs the specification on every job and still shows up with the moisture meter. The company exists because the GTA was full of good floors with nobody responsible for the stairs.`,
      path: "/about",
      terms: [
        "franco",
        "giacinto",
        "oller",
        "grimaldi",
        "founder",
        "owner",
        "who",
        "team",
        "experience",
        "about",
      ],
      weight: 10,
    },
    {
      id: "company:areas",
      kind: "Company",
      title: "Where Green Hardwood works",
      body: `${company.areaServed}: ${cities.map((c) => c.name).join(", ")}. Site visits are free inside the service area for qualified hardwood, stair, and railing work.`,
      path: "/areas",
      terms: ["where", "area", "serve", "coverage", "near me", "do you come to", "travel", "gta"],
      weight: 9,
    },
  );

  return out;
}

export const passages: Passage[] = corpus();

/** Lowercased search text per passage, computed once at module load. */
const haystacks = new Map(
  passages.map((p) => [p.id, `${p.title} ${p.body} ${p.terms.join(" ")}`.toLowerCase()]),
);

/** Words that carry no signal in a query about flooring. */
const STOP = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "can",
  "could",
  "do",
  "does",
  "for",
  "from",
  "get",
  "has",
  "have",
  "how",
  "i",
  "if",
  "in",
  "is",
  "it",
  "me",
  "my",
  "of",
  "on",
  "or",
  "our",
  "should",
  "so",
  "than",
  "that",
  "the",
  "their",
  "there",
  "they",
  "this",
  "to",
  "was",
  "we",
  "what",
  "when",
  "where",
  "which",
  "who",
  "will",
  "with",
  "would",
  "you",
  "your",
]);

export function tokenize(query: string) {
  return query
    .toLowerCase()
    .replace(/[^a-z0-9$\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP.has(t));
}

export function retrieve(query: string, limit = 4): { passage: Passage; score: number }[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  const scored: { passage: Passage; score: number }[] = [];

  for (const p of passages) {
    const hay = haystacks.get(p.id) ?? "";
    const title = p.title.toLowerCase();
    let hits = 0;
    let score = 0;

    for (const token of tokens) {
      if (!hay.includes(token)) continue;
      hits++;
      score += title.includes(token) ? 6 : 2;
    }

    if (hits === 0) continue;
    // Reward passages that match more of the question, not just one rare word.
    score *= hits / tokens.length;
    score += p.weight * 0.35;
    scored.push({ passage: p, score });
  }

  return scored.sort((a, b) => b.score - a.score).slice(0, limit);
}

/** City named in the query, if any. */
export function detectCity(query: string): City | undefined {
  const q = query.toLowerCase();
  return cities.find((c) => q.includes(c.name.toLowerCase()));
}

/** Service named or implied by the query, if any. */
export function detectService(query: string) {
  const q = query.toLowerCase();
  const direct = services.find(
    (s) => q.includes(s.shortName.toLowerCase()) || q.includes(s.name.toLowerCase()),
  );
  if (direct) return direct;

  if (/\bstair|tread|riser|stringer|nosing|flight\b/.test(q)) return getService("hardwood-stairs");
  if (/\brail|handrail|newel|baluster|guard\b/.test(q)) return getService("hardwood-railings");
  if (/\brefinish|sand|recoat|buff|screen\b/.test(q)) return getService("sanding-refinishing");
  if (/\brepair|damage|water|flood|scratch|pet\b/.test(q)) return getService("hardwood-repairs");
  if (/\bdeck|porch\b/.test(q)) return getService("hardwood-decks");
  if (/\binstall|new floor|lay|nail.down|glue.down|floating\b/.test(q))
    return getService("hardwood-installation");
  return undefined;
}

export type Intent =
  "diagnosis" | "pricing" | "code" | "scope" | "contact" | "process" | "comparison" | "general";

/** Materials Green Hardwood does not install. */
const OTHER_MATERIAL = /\b(vinyl|laminate|lvp|luxury vinyl|carpet|carpeted|tile)\b/;
/** Language that means "get rid of it", not "supply it". */
const CONVERSION =
  /\b(to|from|over|onto|instead of|replace|replacing|convert|converting|rip|remove|removing|swap|pull|off|under|underneath)\b/;
const HARDWOOD_TERM =
  /\b(hardwood|oak|maple|walnut|hickory|wood|stair|stairs|tread|treads|riser|floor|flooring)\b/;

/**
 * True only when the visitor is asking whether we *supply* a material we do not
 * install — not when they mention it as the thing being torn out.
 *
 * "carpet to hardwood stairs" is our single most valuable query. Reading the
 * word "carpet" and answering "we do not install carpet" would be technically
 * true and commercially catastrophic.
 */
function isScopeQuestion(q: string) {
  const asksIfWeSupply =
    /\b(do|can|will|would) you\s+\w*\s*(do|install|sell|offer|lay|supply|fit|put in)\b/.test(q);
  if (asksIfWeSupply && OTHER_MATERIAL.test(q)) return true;
  if (!OTHER_MATERIAL.test(q)) return false;
  // A bare material mention is a scope question only if it is not framed as a
  // conversion away from that material.
  return !(CONVERSION.test(q) && HARDWOOD_TERM.test(q));
}

/** Words that mean something has already gone wrong. */
const SYMPTOM =
  /\b(cupping|cupped|crowning|crowned|buckl|squeak|creak|gap|gaps|peel|flak|haze|hazy|cloudy|scratch|worn|wearing|stain|hollow|bouncy|spongy|loose|wobbl|lifting|splitting|cracked|damaged|broken|smell)\b/;

export function detectIntent(query: string): Intent {
  const q = query.toLowerCase();
  // A symptom outranks everything except an explicit price question — the
  // visitor has a problem in front of them right now.
  if (SYMPTOM.test(q) && !/\b(cost|price|how much|quote)\b/.test(q)) return "diagnosis";
  if (
    /\b(cost|price|pricing|how much|quote|estimate|budget|expensive|cheap|\$|per step|per square|per sq)\b/.test(
      q,
    )
  )
    return "pricing";
  if (
    /\b(code|obc|inspect|inspector|legal|pass|permit|rise|run|nosing|guard height|graspable|building code)\b/.test(
      q,
    )
  )
    return "code";
  if (isScopeQuestion(q)) return "scope";
  if (/\b(call|phone|email|contact|hours|open|address|book|appointment|reach|visit)\b/.test(q))
    return "contact";
  if (/\b(how (do|does|is|are)|process|steps|method|prepare|acclimat)\b/.test(q)) return "process";
  if (/\b(vs|versus|better|difference|compare|instead of|or engineered|or solid)\b/.test(q))
    return "comparison";
  return "general";
}

export { OBC_LIMITS, company };
