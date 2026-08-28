import { company } from "@/data/company";
import { services } from "@/data/services";

/**
 * The single source of truth for every navigation surface on the site.
 *
 * Why this file exists
 * -------------------
 * Before it, the header held three hand-maintained arrays (`mega`, `primary`,
 * `mobile`) and the footer held sixteen hand-written <li> elements. They had
 * already drifted: a desktop visitor could not reach /guides, /answers,
 * /glossary, /trade or /contact from the header at all, while a phone visitor
 * could. Two navigations means two chances to forget a page, and the one that
 * gets forgotten is always the one you are not looking at.
 *
 * Everything below is rendered by BOTH the desktop mega-menu and the mobile
 * drawer, and by BOTH the desktop footer columns and the mobile footer
 * accordion. The breakpoint changes the presentation. It never changes the
 * information architecture. `tests/navigation.test.ts` asserts that.
 *
 * Structure follows aws.amazon.com, which is the reference the site is being
 * held to: a thin utility bar of secondary links, a primary bar of a few broad
 * sections that open into grouped panels, and a four-column footer matrix.
 */

export type NavLink = {
  label: string;
  href: string;
  /** One line shown under the label in the mega-menu. Keep it under ~70 chars. */
  blurb?: string;
};

export type NavGroup = {
  heading: string;
  /** When set, the heading itself links to a landing page. */
  href?: string;
  links: NavLink[];
};

export type NavSection = {
  label: string;
  /** The section's own landing page. Every section must have one. */
  href: string;
  /** Shown at the top of the open panel. */
  summary: string;
  groups: NavGroup[];
  /** Optional promoted link rendered in the panel's right rail. */
  feature?: { label: string; href: string; blurb: string };
};

/* ------------------------------------------------------------------ utility */

/**
 * The thin bar above the logo. Secondary, high-intent, low-frequency links —
 * the equivalent of AWS's "Contact us / Marketplace / Support / My account".
 * Rendered as a bar on desktop and as the first block of the mobile drawer,
 * so a phone visitor is never offered less than a laptop visitor.
 */
export const utilityLinks: NavLink[] = [
  { label: "Service areas", href: "/areas" },
  { label: "Trade & builders", href: "/trade" },
  { label: "Water damage", href: "/emergency" },
  { label: "Warranty", href: "/warranty" },
  { label: "Contact", href: "/contact" },
];

/* ------------------------------------------------------------- primary nav */

const serviceLinks: NavLink[] = services.map((s) => ({
  label: s.navLabel,
  href: `/services/${s.slug}`,
  blurb: s.eyebrow,
}));

/** Floors vs stairs — the two halves of the business, split the way a customer thinks. */
const floorServices = serviceLinks.filter(
  (l) => !/stair|railing|inlay/i.test(l.href.replace("/services/", "")),
);
const stairServices = serviceLinks.filter((l) =>
  /stair|railing|inlay/i.test(l.href.replace("/services/", "")),
);

export const navSections: NavSection[] = [
  {
    label: "Services",
    href: "/services",
    summary: "Every hardwood service we run, priced and explained before you call.",
    groups: [
      { heading: "Floors", href: "/services", links: floorServices },
      { heading: "Stairs & railings", href: "/services/hardwood-stairs", links: stairServices },
      {
        heading: "Get a number",
        href: "/estimate",
        links: [
          { label: "Instant estimator", href: "/estimate", blurb: "A real price band in about a minute" },
          { label: "Stair studio", href: "/stairs", blurb: "Build your staircase and see it costed" },
          { label: "Showroom", href: "/showroom", blurb: "Species, grades, and finishes side by side" },
          { label: "Compare materials", href: "/compare", blurb: "Hardwood against vinyl and laminate" },
        ],
      },
    ],
    feature: {
      label: "Carpet to hardwood stairs",
      href: "/services/hardwood-stairs",
      blurb: "The job we are asked for most. What it costs, how long it takes, what changes.",
    },
  },
  {
    label: "Learn",
    href: "/guides",
    summary: "The reference library. Written to be quoted, not to rank.",
    groups: [
      {
        heading: "Diagnose",
        href: "/problems",
        links: [
          { label: "Problems & symptoms", href: "/problems", blurb: "Cupping, squeaks, peeling, worn treads" },
          { label: "Floor care", href: "/care", blurb: "What keeps a finish alive, and what kills it" },
          { label: "Water damage", href: "/emergency", blurb: "What to do in the first 48 hours" },
        ],
      },
      {
        heading: "Understand",
        href: "/guides",
        links: [
          { label: "Guides", href: "/guides", blurb: "Long-form, one subject each" },
          { label: "Methods", href: "/methods", blurb: "Nail-down, glue-down, floating, and when each applies" },
          { label: "Answers", href: "/answers", blurb: "Direct answers to the questions we get asked" },
          { label: "Glossary", href: "/glossary", blurb: "The vocabulary, defined once" },
        ],
      },
      {
        heading: "Decide",
        href: "/compare",
        links: [
          { label: "Hardwood vs vinyl", href: "/compare", blurb: "Including when vinyl is the better call" },
          { label: "Our process", href: "/process", blurb: "Measure to final coat, step by step" },
          { label: "Warranty", href: "/warranty", blurb: company.warranty },
          { label: "FAQ", href: "/faq", blurb: "The short version of everything above" },
        ],
      },
    ],
    feature: {
      label: "Ontario stair code",
      href: "/guides/ontario-stair-code-hardwood",
      blurb: "Rise, run, nosing and handrail limits — with the thresholds quoted, not paraphrased.",
    },
  },
  {
    label: "Work",
    href: "/portfolio",
    summary: "Finished jobs, the neighbourhoods they are in, and who did them.",
    groups: [
      {
        heading: "See it",
        href: "/portfolio",
        links: [
          { label: "Portfolio", href: "/portfolio", blurb: "Completed floors, stairs, and railings" },
          { label: "Stair studio", href: "/stairs", blurb: "Configure a staircase and price it" },
          { label: "Showroom", href: "/showroom", blurb: "Species and finishes in daylight" },
        ],
      },
      {
        heading: "Where we work",
        href: "/areas",
        links: [
          { label: "All service areas", href: "/areas", blurb: "32 cities, split by travel honestly" },
          { label: "Toronto", href: "/areas/toronto" },
          { label: "Mississauga", href: "/areas/mississauga" },
          { label: "Vaughan", href: "/areas/vaughan" },
        ],
      },
      {
        heading: "Who we are",
        href: "/about",
        links: [
          { label: "About Green Hardwood", href: "/about", blurb: `${company.founder}, ${company.years} years on the tools` },
          { label: "Trade & builders", href: "/trade", blurb: "Contract pricing and scheduling" },
          { label: "Contact", href: "/contact", blurb: company.hoursSummary },
          { label: "For AI agents", href: "/for-agents", blurb: "Machine-readable facts about this company" },
        ],
      },
    ],
  },
];

/* ----------------------------------------------------------------- footer */

/**
 * Four columns, deliberately balanced, mirroring AWS's Learn / Resources /
 * Developers / Help. The previous footer had one "Company" column holding
 * sixteen unrelated links, which is a list, not a structure.
 *
 * On a phone these render as <details> accordions — the same markup, the same
 * order, the same links, one disclosure per column.
 */
export const footerColumns: NavGroup[] = [
  {
    heading: "Services",
    href: "/services",
    links: [
      ...services.map((s) => ({ label: s.shortName, href: `/services/${s.slug}` })),
      { label: "All services", href: "/services" },
    ],
  },
  {
    heading: "Learn",
    href: "/guides",
    links: [
      { label: "Guides", href: "/guides" },
      { label: "Methods", href: "/methods" },
      { label: "Diagnose a problem", href: "/problems" },
      { label: "Answers", href: "/answers" },
      { label: "Glossary", href: "/glossary" },
      { label: "FAQ", href: "/faq" },
      { label: "Floor care", href: "/care" },
      { label: "Hardwood vs vinyl", href: "/compare" },
      { label: "Water damage", href: "/emergency" },
    ],
  },
  {
    heading: "Tools",
    href: "/estimate",
    links: [
      { label: "Instant estimator", href: "/estimate" },
      { label: "Stair studio", href: "/stairs" },
      { label: "Showroom", href: "/showroom" },
      { label: "Portfolio", href: "/portfolio" },
      { label: "Search the site", href: "/search" },
      { label: "Service areas", href: "/areas" },
    ],
  },
  {
    heading: "Company",
    href: "/about",
    links: [
      { label: "About", href: "/about" },
      { label: "Our process", href: "/process" },
      { label: "Warranty", href: "/warranty" },
      { label: "Trade & builders", href: "/trade" },
      { label: "Contact", href: "/contact" },
      { label: "For AI agents", href: "/for-agents" },
    ],
  },
];

/** The bottom legal strip. */
export const legalLinks: NavLink[] = [
  { label: "Contact", href: "/contact" },
  { label: "Warranty", href: "/warranty" },
  { label: "For AI agents", href: "/for-agents" },
];

/* ------------------------------------------------------------------ helpers */

/** Every internal href this file points at, deduped. Used by the tests and the audit. */
export function allNavHrefs(): string[] {
  const out = new Set<string>();
  for (const l of utilityLinks) out.add(l.href);
  for (const s of navSections) {
    out.add(s.href);
    if (s.feature) out.add(s.feature.href);
    for (const g of s.groups) {
      if (g.href) out.add(g.href);
      for (const l of g.links) out.add(l.href);
    }
  }
  for (const c of footerColumns) {
    if (c.href) out.add(c.href);
    for (const l of c.links) out.add(l.href);
  }
  for (const l of legalLinks) out.add(l.href);
  return [...out].sort();
}

/**
 * Flattened primary navigation, in reading order. The mobile drawer renders
 * exactly this, which is what makes drift between breakpoints impossible
 * rather than merely unlikely.
 */
export function flattenSections(): NavLink[] {
  const out: NavLink[] = [];
  for (const s of navSections) {
    out.push({ label: s.label, href: s.href });
    for (const g of s.groups) for (const l of g.links) out.push(l);
    if (s.feature) out.push({ label: s.feature.label, href: s.feature.href });
  }
  return out;
}
