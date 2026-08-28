import { answers } from "@/data/answers";
import { cities } from "@/data/areas";
import { faqs } from "@/data/faq";
import { glossary } from "@/data/glossary";
import { guides } from "@/data/guides";
import { methods } from "@/data/methods";
import { problems } from "@/data/problems";
import { projects } from "@/data/projects";
import { services } from "@/data/services";
import { species } from "@/data/species";

/**
 * Static search index, built at module load and shipped to the client with the
 * search component. The whole corpus is a few hundred entries, so a fetchable
 * index or a search service would be more moving parts for no benefit — and a
 * local index means search works instantly and offline, with no query logging.
 */

export type SearchKind =
  | "Problem"
  | "Local"
  | "Service"
  | "Area"
  | "Guide"
  | "Method"
  | "Term"
  | "Project"
  | "Species"
  | "Page"
  | "Question";

export type SearchDoc = {
  id: string;
  kind: SearchKind;
  title: string;
  description: string;
  path: string;
  /**
   * The canonical name of the thing this document *is* — "Vaughan", "Hardwood
   * Stairs", "White Oak". An exact match here outranks everything else, so
   * typing a city name reaches that city's page rather than a project that
   * happens to mention it in its title.
   */
  primary: string;
  /** Extra terms that should match but do not need to be displayed. */
  keywords: string[];
};

const staticPages: SearchDoc[] = [
  {
    id: "page-stairs",
    kind: "Page",
    title: "Stair studio",
    primary: "Stair studio",
    description:
      "Build a hardwood flight, price it, and run the Ontario Building Code checks before you call anyone.",
    path: "/stairs",
    keywords: ["stair builder", "obc", "ontario building code", "rise run", "nosing", "treads"],
  },
  {
    id: "page-showroom",
    kind: "Page",
    title: "Species showroom",
    primary: "Species showroom",
    description:
      "White oak, red oak, walnut, maple, hickory, engineered — grain, Janka, and rooms.",
    path: "/showroom",
    keywords: ["wood species", "janka", "grain", "samples", "stain"],
  },
  {
    id: "page-estimate",
    kind: "Page",
    title: "2026 estimator",
    primary: "2026 estimator",
    description: "Price install, refinishing, stairs, railings, repairs, and decks for the GTA.",
    path: "/estimate",
    keywords: ["cost", "price", "quote", "calculator", "how much"],
  },
  {
    id: "page-compare",
    kind: "Page",
    title: "Hardwood vs vinyl vs laminate",
    primary: "Hardwood vs vinyl vs laminate",
    description: "When oak is the only grown-up answer, and the few times it is not.",
    path: "/compare",
    keywords: ["lvp", "vinyl plank", "laminate", "engineered", "comparison"],
  },
  {
    id: "page-process",
    kind: "Page",
    title: "How a hardwood job runs",
    primary: "How a hardwood job runs",
    description: "Site visit, moisture, acclimation, install, sanding, finish, cure.",
    path: "/process",
    keywords: ["timeline", "steps", "what to expect", "acclimation", "cure"],
  },
  {
    id: "page-care",
    kind: "Page",
    title: "Hardwood floor care in Ontario",
    primary: "Hardwood floor care in Ontario",
    description: "Humidity, cleaners, felt pads, and the winter salt problem.",
    path: "/care",
    keywords: ["maintenance", "cleaning", "humidifier", "scratches", "salt"],
  },
  {
    id: "page-emergency",
    kind: "Page",
    title: "Water-damaged hardwood",
    primary: "Water-damaged hardwood",
    description: "Cupping, crowning, and what insurance will actually close.",
    path: "/emergency",
    keywords: ["flood", "leak", "insurance", "cupping", "buckling", "emergency"],
  },
  {
    id: "page-warranty",
    kind: "Page",
    title: "Workmanship warranty",
    primary: "Workmanship warranty",
    description: "What our three-year warranty covers, and what it does not.",
    path: "/warranty",
    keywords: ["guarantee", "warranty", "coverage", "callback"],
  },
  {
    id: "page-trade",
    kind: "Page",
    title: "For builders, designers & realtors",
    primary: "For builders, designers & realtors",
    description: "Trade pricing, schedules, and spec support.",
    path: "/trade",
    keywords: ["contractor", "builder", "designer", "realtor", "trade", "wholesale"],
  },
  {
    id: "page-portfolio",
    kind: "Page",
    title: "Work",
    primary: "Work",
    description: "Floors, stairs, and railings completed across the GTA.",
    path: "/portfolio",
    keywords: ["gallery", "projects", "before after", "photos"],
  },
  {
    id: "page-about",
    kind: "Page",
    title: "About Franco Giacinto",
    primary: "About Franco Giacinto",
    description: "The founder, the shop, and how Green Hardwood works.",
    path: "/about",
    keywords: ["franco giacinto", "oller grimaldi", "founder", "team", "who we are"],
  },
  {
    id: "page-contact",
    kind: "Page",
    title: "Contact",
    primary: "Contact",
    description: "Phone, email, the Sterling Road studio, and a site-visit request.",
    path: "/contact",
    keywords: ["phone", "email", "address", "hours", "book", "call"],
  },
  {
    id: "page-problems",
    kind: "Page",
    title: "Diagnose a problem",
    primary: "Diagnose",
    description: "Cupping, gaps, squeaks, peeling finish, loose railings — cause and outlook.",
    path: "/problems",
    keywords: ["problem", "wrong", "broken", "damage", "why is my", "help", "diagnose", "fix"],
  },
  {
    id: "page-methods",
    kind: "Page",
    title: "Installation & stair methods",
    description:
      "Nail-down, glue-down, floating, retreads, open risers — how each assembly is built.",
    path: "/methods",
    primary: "Methods",
    keywords: ["how to install hardwood", "method", "assembly", "process", "technique"],
  },
  {
    id: "page-answers",
    kind: "Page",
    title: "Hardwood questions, answered",
    description: "Short, direct answers on stairs, installation, cost, and code.",
    path: "/answers",
    primary: "Answers",
    keywords: ["questions", "answers", "ask", "how much", "can you"],
  },
  {
    id: "page-glossary",
    kind: "Page",
    title: "Hardwood glossary",
    description: "Every term on a hardwood quote, defined in plain English.",
    path: "/glossary",
    primary: "Glossary",
    keywords: ["terms", "definitions", "vocabulary", "jargon", "what is"],
  },
  {
    id: "page-faq",
    kind: "Page",
    title: "Hardwood FAQ",
    primary: "Hardwood FAQ",
    description: "The questions Toronto homeowners actually ask.",
    path: "/faq",
    keywords: ["questions", "answers", "help"],
  },
];

export const searchDocs: SearchDoc[] = [
  ...problems.map<SearchDoc>((p) => ({
    id: `problem-${p.slug}`,
    kind: "Problem",
    title: p.name,
    description: p.looksLike,
    path: `/problems/${p.slug}`,
    primary: p.name,
    keywords: [...p.alsoCalled, p.category, p.urgency, ...p.causes.map((c) => c.cause)],
  })),
  ...methods.map<SearchDoc>((m) => ({
    id: `method-${m.slug}`,
    kind: "Method",
    title: m.name,
    description: m.summary,
    path: `/methods/${m.slug}`,
    primary: m.name,
    keywords: [m.cluster, m.headline, m.when],
  })),
  ...answers.map<SearchDoc>((a) => ({
    id: `answer-${a.slug}`,
    kind: "Question",
    title: a.q,
    description: a.a,
    path: `/answers/${a.slug}`,
    primary: a.q,
    keywords: [a.intent, a.primaryService],
  })),
  ...glossary.map<SearchDoc>((t) => ({
    id: `term-${t.slug}`,
    kind: "Term",
    title: t.term,
    description: t.short,
    path: `/glossary#${t.slug}`,
    primary: t.term,
    keywords: [t.cluster, ...t.seeAlso],
  })),
  ...services.map<SearchDoc>((s) => ({
    id: `service-${s.slug}`,
    kind: "Service",
    title: s.name,
    description: s.summary,
    path: `/services/${s.slug}`,
    primary: s.name,
    keywords: [...s.keywords, s.shortName, s.eyebrow, s.priceFrom],
  })),
  ...cities.map<SearchDoc>((c) => ({
    id: `area-${c.slug}`,
    kind: "Area",
    title: `Hardwood flooring in ${c.name}`,
    description: c.blurb,
    path: `/areas/${c.slug}`,
    primary: c.name,
    keywords: [c.name, c.region, ...c.jobs],
  })),
  ...guides.map<SearchDoc>((g) => ({
    id: `guide-${g.slug}`,
    kind: "Guide",
    title: g.title,
    description: g.description,
    path: `/guides/${g.slug}`,
    primary: g.title,
    keywords: [g.kicker],
  })),
  ...projects.map<SearchDoc>((p) => ({
    id: `project-${p.slug}`,
    kind: "Project",
    title: p.title,
    description: p.summary,
    path: "/portfolio",
    primary: p.title,
    keywords: [p.location, p.type, ...p.specs],
  })),
  ...species.map<SearchDoc>((sp) => ({
    id: `species-${sp.id}`,
    kind: "Species",
    title: sp.name,
    description: sp.bestFor,
    path: "/showroom",
    primary: sp.name,
    keywords: [sp.hardness, sp.tone, ...sp.rooms],
  })),
  ...faqs.map<SearchDoc>((f, i) => ({
    id: `faq-${i}`,
    kind: "Question",
    title: f.q,
    description: f.a,
    path: "/faq",
    primary: f.q,
    keywords: [],
  })),
  ...staticPages,
];

/** Lowercased haystack per doc, computed once. */
const haystacks = new Map(
  searchDocs.map((d) => [
    d.id,
    `${d.primary} ${d.title} ${d.description} ${d.keywords.join(" ")}`.toLowerCase(),
  ]),
);

const KIND_WEIGHT: Record<SearchKind, number> = {
  // Symptom words (cupping, squeak, peeling) appear nowhere else, so a
  // diagnosis wins those on token match alone. It does not need a weight that
  // also beats the service page for a bare service word like "stairs".
  Problem: 4,
  Local: 7,
  Service: 6,
  Page: 5,
  Area: 4,
  Method: 4,
  Guide: 3,
  Term: 3,
  Species: 2,
  Project: 2,
  Question: 1,
};

/**
 * Words that carry no signal here. Every token must match for a document to
 * qualify, so without this "my stairs squeak" finds nothing — "my" appears
 * nowhere in a corpus about flooring. People type in sentences; the index has
 * to meet them there.
 */
const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "can",
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
  "why",
  "will",
  "with",
  "would",
  "you",
  "your",
]);

/**
 * Service slugs that have a page for every city.
 *
 * Held locally rather than imported from data/matrix.ts on purpose: this module
 * ships to the browser, and importing the matrix would drag 224 fully-built
 * page objects into the client bundle to read seven strings. `tests/search`
 * asserts this list still matches `matrixServices`, so it cannot drift.
 */
const MATRIX_SERVICE_SLUGS = new Set([
  "hardwood-stairs",
  "hardwood-installation",
  "sanding-refinishing",
  "hardwood-railings",
  "hardwood-repairs",
  "hardwood-decks",
  "commercial-hardwood",
]);

/**
 * A service x city page, synthesised at query time.
 *
 * "stairs vaughan" should reach /services/hardwood-stairs/vaughan. Indexing all
 * 224 of those would add roughly 60 KB to every page load for pages a visitor
 * can only reach by naming both halves — so we detect both halves instead and
 * build the one result.
 */
function matrixMatch(tokens: string[]): SearchDoc | null {
  const city = cities.find((c) =>
    tokens.some((t) => c.name.toLowerCase().includes(t) && t.length > 3),
  );
  if (!city) return null;

  const service = services.find(
    (sv) =>
      MATRIX_SERVICE_SLUGS.has(sv.slug) &&
      tokens.some(
        (t) => t.length > 3 && (sv.shortName.toLowerCase().includes(t) || sv.slug.includes(t)),
      ),
  );
  if (!service) return null;

  return {
    id: `matrix-${service.slug}-${city.slug}`,
    kind: "Local",
    title: `${service.shortName} in ${city.name}`,
    description: `Local price band, housing stock, and FAQs for ${service.shortName.toLowerCase()} in ${city.name}.`,
    path: `/services/${service.slug}/${city.slug}`,
    primary: `${service.shortName} ${city.name}`,
    keywords: [],
  };
}

/**
 * Ranking.
 *
 * A short query must match completely — "stairs vaughan" should find the
 * Vaughan stair page, not every page mentioning stairs. But a sentence should
 * tolerate a word the corpus happens not to contain: "how much are stairs in
 * vaughan" reduces to three meaningful words, and demanding all three finds
 * nothing because "much" appears nowhere.
 *
 * So the threshold scales: every token for one or two, a clear majority beyond
 * that, with the match ratio folded into the score so completeness still wins.
 */
export function searchSite(query: string, limit = 8): SearchDoc[] {
  const raw = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  // Keep the meaningful words. If a query is nothing but stop words, fall back
  // to the raw tokens rather than silently returning nothing.
  const meaningful = raw.filter((t) => !STOP_WORDS.has(t));
  const tokens = meaningful.length > 0 ? meaningful : raw;
  if (tokens.length === 0) return [];

  const required = tokens.length <= 2 ? tokens.length : Math.ceil(tokens.length * 0.6);
  const scored: { doc: SearchDoc; score: number }[] = [];

  for (const doc of searchDocs) {
    const hay = haystacks.get(doc.id) ?? "";
    const title = doc.title.toLowerCase();
    const primary = doc.primary.toLowerCase();
    let score = 0;
    let hits = 0;

    for (const token of tokens) {
      if (!hay.includes(token)) continue;
      hits++;
      // The name of the thing beats a mention of the thing. Typing "vaughan"
      // should reach the Vaughan page, not a project that starts with the word.
      if (primary === token) score += 40;
      else if (primary.startsWith(token)) score += 24;
      else if (title.startsWith(token)) score += 12;
      else if (title.includes(token)) score += 8;
      else score += 2;
    }

    if (hits < required) continue;
    // Completeness still wins: a document matching every word outranks one
    // matching the minimum, even where the partial match hit a stronger field.
    score *= hits / tokens.length;
    score += KIND_WEIGHT[doc.kind];
    scored.push({ doc, score });
  }

  const ranked = scored
    .sort((a, b) => b.score - a.score || a.doc.title.localeCompare(b.doc.title))
    .map((s) => s.doc);

  // A query naming both a service and a city has one best answer, and it is
  // the page written for exactly that pair.
  const local = matrixMatch(tokens);
  if (local) {
    return [local, ...ranked.filter((d) => d.path !== local.path)].slice(0, limit);
  }

  return ranked.slice(0, limit);
}
