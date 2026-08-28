export type GlossaryTerm = {
  slug: string;
  term: string;
  short: string;
  definition: string;
  cluster: "installation" | "stairs" | "finish" | "code";
  seeAlso: string[];
};

export const glossary: GlossaryTerm[] = [
  {
    slug: "nail-down",
    term: "Nail-down",
    short: "Hidden-fastened solid hardwood into a wood subfloor.",
    definition:
      "The classic house assembly: solid boards blind-nailed or stapled to a wood subfloor. Correct on dry joists. Wrong on concrete.",
    cluster: "installation",
    seeAlso: ["glue-down", "acclimation"],
  },
  {
    slug: "glue-down",
    term: "Glue-down",
    short: "Hardwood set in adhesive over a slab or substrate.",
    definition:
      "Engineered — and sometimes solid — boards trowelled into a mill-listed adhesive. The default on condo slabs and radiant floors.",
    cluster: "installation",
    seeAlso: ["nail-down", "engineered-hardwood"],
  },
  {
    slug: "floating-floor",
    term: "Floating floor",
    short: "A click system that rides on underlayment.",
    definition:
      "Boards lock to each other, not to the subfloor. Allowed when the mill requires it. Not a disguise for an unflat floor.",
    cluster: "installation",
    seeAlso: ["glue-down", "engineered-hardwood"],
  },
  {
    slug: "engineered-hardwood",
    term: "Engineered hardwood",
    short: "Real wood wear layer over a plywood or HDF core.",
    definition:
      "A hardwood floor with a sliced or sawn wear layer laminated to a stable core. Specify wear-layer thickness if you want a future sand.",
    cluster: "installation",
    seeAlso: ["solid-hardwood", "wear-layer"],
  },
  {
    slug: "solid-hardwood",
    term: "Solid hardwood",
    short: "A board milled from a single piece of timber.",
    definition:
      "Typically 3/4-inch oak, maple, or walnut. Maximum refinishing life. Moves with Ontario humidity. Belongs on a dry wood subfloor.",
    cluster: "installation",
    seeAlso: ["engineered-hardwood", "acclimation"],
  },
  {
    slug: "wear-layer",
    term: "Wear layer",
    short: "The real-wood thickness you can sand.",
    definition:
      "On engineered boards, the top wood layer. Under about 3 mm, a future full sand is a maybe. Photographic films are not wear layers.",
    cluster: "installation",
    seeAlso: ["engineered-hardwood"],
  },
  {
    slug: "acclimation",
    term: "Acclimation",
    short: "Letting boards reach the room's moisture content.",
    definition:
      "Material staged in the finished HVAC condition until wood moisture and room moisture agree. Closed cartons in a garage do not count.",
    cluster: "installation",
    seeAlso: ["nail-down"],
  },
  {
    slug: "tramex",
    term: "Moisture survey",
    short: "Metered readings of slab or wood before install.",
    definition:
      "A grid of moisture readings that decides whether we install, wait, change the spec, or walk. One number in the middle of the room is not a survey.",
    cluster: "installation",
    seeAlso: ["acclimation", "glue-down"],
  },
  {
    slug: "tread",
    term: "Tread",
    short: "The horizontal board you step on.",
    definition:
      "On a hardwood stair, a solid or thick-capped board. Leftover 3/4-inch flooring glued to a thin plywood tread is not a tread.",
    cluster: "stairs",
    seeAlso: ["riser", "nosing", "retread"],
  },
  {
    slug: "riser",
    term: "Riser",
    short: "The vertical board between treads.",
    definition:
      "Closed-riser stairs hide the structure. Open-riser stairs omit it and must still meet opening-size rules in Ontario.",
    cluster: "stairs",
    seeAlso: ["tread", "open-riser"],
  },
  {
    slug: "stringer",
    term: "Stringer",
    short: "The sawn or housed carriage that carries the treads.",
    definition:
      "If the stringer flexes, a retread is the wrong job. Sistering or a rebuild comes first.",
    cluster: "stairs",
    seeAlso: ["retread", "tread"],
  },
  {
    slug: "nosing",
    term: "Nosing",
    short: "The projecting edge of a tread or landing.",
    definition:
      "Code limits projection and requires uniformity. A floor thickness that does not match the tread becomes a trip at the landing.",
    cluster: "stairs",
    seeAlso: ["tread", "rise-run"],
  },
  {
    slug: "retread",
    term: "Retread",
    short: "Capping an existing stair with new solid treads.",
    definition:
      "The standard carpet-to-oak conversion when stringers are sound. Not the same as a rebuild.",
    cluster: "stairs",
    seeAlso: ["tread", "stringer"],
  },
  {
    slug: "open-riser",
    term: "Open riser",
    short: "A stair with no riser board.",
    definition:
      "Legal in Ontario only when openings and guards pass. Many feature stairs drawn from social media do not.",
    cluster: "stairs",
    seeAlso: ["riser", "rise-run"],
  },
  {
    slug: "rise-run",
    term: "Rise and run",
    short: "The height and depth of each step.",
    definition:
      "Must be uniform on a flight. Ontario Part 9 sets limits. Squeezing an extra step to make a stair 'float' is how inspections fail.",
    cluster: "code",
    seeAlso: ["nosing", "open-riser"],
  },
  {
    slug: "graspable-handrail",
    term: "Graspable handrail",
    short: "A rail profile you can actually close a hand around.",
    definition:
      "Required. A wide decorative cap is a guard detail, not a handrail. Green Hardwood mills profiles that pass and still match the stair.",
    cluster: "code",
    seeAlso: ["newel"],
  },
  {
    slug: "newel",
    term: "Newel",
    short: "The post a handrail lands on.",
    definition:
      "Must be fastened to structure. A hollow box trimmed onto drywall will fail in use even if it photographs well on handover day.",
    cluster: "stairs",
    seeAlso: ["graspable-handrail"],
  },
  {
    slug: "returned-tread",
    term: "Returned tread",
    short: "A tread with a finished end on the open side.",
    definition:
      "Required on open-side stairs if you do not want to see raw end grain and a gap at the drywall. A plank stuck to the wall is not this.",
    cluster: "stairs",
    seeAlso: ["tread", "retread"],
  },
  {
    slug: "site-finished",
    term: "Site-finished",
    short: "Sand and finish after the floor or stair is installed.",
    definition:
      "Allows one stain formula across floor, treads, and rail. Needs dust containment and a cure window.",
    cluster: "finish",
    seeAlso: ["screen-and-recoat"],
  },
  {
    slug: "screen-and-recoat",
    term: "Screen and recoat",
    short: "Abrading the existing finish and adding a new coat.",
    definition:
      "The high-ROI maintenance job when wear layer remains. Not a full sand. Not a colour change.",
    cluster: "finish",
    seeAlso: ["site-finished", "wear-layer"],
  },
  {
    slug: "janka",
    term: "Janka hardness",
    short: "A laboratory dent-resistance number.",
    definition:
      "Useful for comparing species. Not a substitute for the right finish in a house with dogs and winter grit.",
    cluster: "installation",
    seeAlso: ["solid-hardwood"],
  },
  {
    slug: "expansion-gap",
    term: "Expansion gap",
    short: "The space left at walls so the floor can move.",
    definition:
      "Covered by baseboard. Omitted by rushed installs. Ontario seasonal humidity makes this non-optional.",
    cluster: "installation",
    seeAlso: ["acclimation", "solid-hardwood"],
  },
];

export function getTerm(slug: string) {
  return glossary.find((t) => t.slug === slug);
}
