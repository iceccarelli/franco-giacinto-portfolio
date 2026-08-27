import { cities } from "@/data/areas";
import { faqs } from "@/data/faq";
import { guides } from "@/data/guides";
import { projects } from "@/data/projects";
import { services } from "@/data/services";
import { species } from "@/data/species";

/**
 * Static search index, built at module load and shipped to the client with the
 * search component. The whole corpus is a few hundred entries, so a fetchable
 * index or a search service would be more moving parts for no benefit — and a
 * local index means search works instantly and offline, with no query logging.
 */

export type SearchKind = "Service" | "Area" | "Guide" | "Project" | "Species" | "Page" | "Question";

export type SearchDoc = {
  id: string;
  kind: SearchKind;
  title: string;
  description: string;
  path: string;
  /** Extra terms that should match but do not need to be displayed. */
  keywords: string[];
};

const staticPages: SearchDoc[] = [
  {
    id: "page-stairs",
    kind: "Page",
    title: "Stair studio",
    description:
      "Build a hardwood flight, price it, and run the Ontario Building Code checks before you call anyone.",
    path: "/stairs",
    keywords: ["stair builder", "obc", "ontario building code", "rise run", "nosing", "treads"],
  },
  {
    id: "page-showroom",
    kind: "Page",
    title: "Species showroom",
    description:
      "White oak, red oak, walnut, maple, hickory, engineered — grain, Janka, and rooms.",
    path: "/showroom",
    keywords: ["wood species", "janka", "grain", "samples", "stain"],
  },
  {
    id: "page-estimate",
    kind: "Page",
    title: "2026 estimator",
    description: "Price install, refinishing, stairs, railings, repairs, and decks for the GTA.",
    path: "/estimate",
    keywords: ["cost", "price", "quote", "calculator", "how much"],
  },
  {
    id: "page-compare",
    kind: "Page",
    title: "Hardwood vs vinyl vs laminate",
    description: "When oak is the only grown-up answer, and the few times it is not.",
    path: "/compare",
    keywords: ["lvp", "vinyl plank", "laminate", "engineered", "comparison"],
  },
  {
    id: "page-process",
    kind: "Page",
    title: "How a hardwood job runs",
    description: "Site visit, moisture, acclimation, install, sanding, finish, cure.",
    path: "/process",
    keywords: ["timeline", "steps", "what to expect", "acclimation", "cure"],
  },
  {
    id: "page-care",
    kind: "Page",
    title: "Hardwood floor care in Ontario",
    description: "Humidity, cleaners, felt pads, and the winter salt problem.",
    path: "/care",
    keywords: ["maintenance", "cleaning", "humidifier", "scratches", "salt"],
  },
  {
    id: "page-emergency",
    kind: "Page",
    title: "Water-damaged hardwood",
    description: "Cupping, crowning, and what insurance will actually close.",
    path: "/emergency",
    keywords: ["flood", "leak", "insurance", "cupping", "buckling", "emergency"],
  },
  {
    id: "page-warranty",
    kind: "Page",
    title: "Workmanship warranty",
    description: "What our three-year warranty covers, and what it does not.",
    path: "/warranty",
    keywords: ["guarantee", "warranty", "coverage", "callback"],
  },
  {
    id: "page-trade",
    kind: "Page",
    title: "For builders, designers & realtors",
    description: "Trade pricing, schedules, and spec support.",
    path: "/trade",
    keywords: ["contractor", "builder", "designer", "realtor", "trade", "wholesale"],
  },
  {
    id: "page-portfolio",
    kind: "Page",
    title: "Work",
    description: "Floors, stairs, and railings completed across the GTA.",
    path: "/portfolio",
    keywords: ["gallery", "projects", "before after", "photos"],
  },
  {
    id: "page-about",
    kind: "Page",
    title: "About Franco Giacinto",
    description: "The founder, the shop, and how Green Hardwood works.",
    path: "/about",
    keywords: ["franco giacinto", "oller grimaldi", "founder", "team", "who we are"],
  },
  {
    id: "page-contact",
    kind: "Page",
    title: "Contact",
    description: "Phone, email, the Sterling Road studio, and a site-visit request.",
    path: "/contact",
    keywords: ["phone", "email", "address", "hours", "book", "call"],
  },
  {
    id: "page-faq",
    kind: "Page",
    title: "Hardwood FAQ",
    description: "The questions Toronto homeowners actually ask.",
    path: "/faq",
    keywords: ["questions", "answers", "help"],
  },
];

export const searchDocs: SearchDoc[] = [
  ...services.map<SearchDoc>((s) => ({
    id: `service-${s.slug}`,
    kind: "Service",
    title: s.name,
    description: s.summary,
    path: `/services/${s.slug}`,
    keywords: [...s.keywords, s.shortName, s.eyebrow, s.priceFrom],
  })),
  ...cities.map<SearchDoc>((c) => ({
    id: `area-${c.slug}`,
    kind: "Area",
    title: `Hardwood flooring in ${c.name}`,
    description: c.blurb,
    path: `/areas/${c.slug}`,
    keywords: [c.name, c.region, ...c.jobs],
  })),
  ...guides.map<SearchDoc>((g) => ({
    id: `guide-${g.slug}`,
    kind: "Guide",
    title: g.title,
    description: g.description,
    path: `/guides/${g.slug}`,
    keywords: [g.kicker],
  })),
  ...projects.map<SearchDoc>((p) => ({
    id: `project-${p.slug}`,
    kind: "Project",
    title: p.title,
    description: p.summary,
    path: "/portfolio",
    keywords: [p.location, p.type, ...p.specs],
  })),
  ...species.map<SearchDoc>((sp) => ({
    id: `species-${sp.id}`,
    kind: "Species",
    title: sp.name,
    description: sp.bestFor,
    path: "/showroom",
    keywords: [sp.hardness, sp.tone, ...sp.rooms],
  })),
  ...faqs.map<SearchDoc>((f, i) => ({
    id: `faq-${i}`,
    kind: "Question",
    title: f.q,
    description: f.a,
    path: "/faq",
    keywords: [],
  })),
  ...staticPages,
];

/** Lowercased haystack per doc, computed once. */
const haystacks = new Map(
  searchDocs.map((d) => [
    d.id,
    `${d.title} ${d.description} ${d.keywords.join(" ")}`.toLowerCase(),
  ]),
);

const KIND_WEIGHT: Record<SearchKind, number> = {
  Service: 6,
  Page: 5,
  Area: 4,
  Guide: 3,
  Species: 2,
  Project: 2,
  Question: 1,
};

/**
 * Scores every token independently and requires all of them to appear, so
 * "stairs vaughan" finds the Vaughan page rather than everything about stairs.
 */
export function searchSite(query: string, limit = 8): SearchDoc[] {
  const tokens = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];

  const scored: { doc: SearchDoc; score: number }[] = [];

  for (const doc of searchDocs) {
    const hay = haystacks.get(doc.id) ?? "";
    const title = doc.title.toLowerCase();
    let score = 0;
    let matchedAll = true;

    for (const token of tokens) {
      if (!hay.includes(token)) {
        matchedAll = false;
        break;
      }
      if (title.startsWith(token)) score += 12;
      else if (title.includes(token)) score += 8;
      else score += 2;
    }

    if (!matchedAll) continue;
    score += KIND_WEIGHT[doc.kind];
    scored.push({ doc, score });
  }

  return scored
    .sort((a, b) => b.score - a.score || a.doc.title.localeCompare(b.doc.title))
    .slice(0, limit)
    .map((s) => s.doc);
}
