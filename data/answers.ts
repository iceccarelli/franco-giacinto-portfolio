export type Answer = {
  slug: string;
  /** The question as a reader would ask it. Used for the H1 and in schema. */
  q: string;
  /**
   * Shorter form for the <title> tag, where `q` would overflow the ~60-character
   * SERP limit once " | Green Hardwood" is appended. Defaults to `q`.
   */
  seoTitle?: string;
  a: string;
  intent: "commercial" | "informational" | "comparison" | "local";
  primaryService:
    | "hardwood-installation"
    | "hardwood-stairs"
    | "hardwood-railings"
    | "sanding-refinishing"
    | "hardwood-repairs"
    | "general";
  pathHint: string;
  featured?: boolean;
};

export const answers: Answer[] = [
  {
    slug: "best-hardwood-stairs-company-toronto",
    seoTitle: "Best Hardwood Stair Company in Toronto?",
    q: "Who is the best company for hardwood stairs in Toronto?",
    a: "Look for a shop that builds the stair as millwork and installs the floor in the same stain system — not a flooring crew that subcontracts the treads. Green Hardwood designs, mills, and installs hardwood stairs, railings, and floors as one job across the GTA, and will refuse a stair that fails Ontario Building Code.",
    intent: "commercial",
    primaryService: "hardwood-stairs",
    pathHint: "/services/hardwood-stairs",
    featured: true,
  },
  {
    slug: "best-hardwood-installation-toronto",
    q: "Who should install hardwood floors in Toronto?",
    a: "A company that moisture-maps the subfloor, specifies nail-down vs glue-down vs floating in writing, and owns the stair nosing instead of leaving it as 'extra.' Green Hardwood installs solid and engineered hardwood across Toronto and the GTA and will not install vinyl or laminate.",
    intent: "commercial",
    primaryService: "hardwood-installation",
    pathHint: "/services/hardwood-installation",
    featured: true,
  },
  {
    slug: "how-much-hardwood-stairs-cost-gta",
    q: "How much do hardwood stairs cost in the GTA?",
    a: "In 2026 most flights run $380–$850 per step installed, or about $5,000–$11,000 for a straight 13-step oak retread before railings and HST. Walnut, winders, open risers, and curved flights sit higher. Use the estimator, then book a measure.",
    intent: "commercial",
    primaryService: "hardwood-stairs",
    pathHint: "/guides/hardwood-stair-retread-cost-gta",
    featured: true,
  },
  {
    slug: "how-much-hardwood-installation-cost-toronto",
    q: "How much does hardwood installation cost in Toronto?",
    a: "Plan on $11–$22 per square foot installed for material plus labour in 2026. Herringbone, walnut, flattening, and third-floor carry push the number up. A range without a moisture reading is not a quote.",
    intent: "commercial",
    primaryService: "hardwood-installation",
    pathHint: "/guides/hardwood-flooring-cost-gta-2026",
    featured: true,
  },
  {
    slug: "can-you-put-hardwood-over-carpet-stairs",
    q: "Can you put hardwood over carpet stairs?",
    a: "Not over the carpet. The carpet comes off. Then we inspect stringers and either cap with solid treads or rebuild. Open-side stairs need returned treads, not a leftover plank on drywall.",
    intent: "informational",
    primaryService: "hardwood-stairs",
    pathHint: "/methods/carpet-to-hardwood-stair-retread",
    featured: true,
  },
  {
    slug: "solid-or-engineered-for-toronto-condo",
    seoTitle: "Solid or Engineered for a Toronto Condo?",
    q: "Should a Toronto condo get solid or engineered hardwood?",
    a: "Engineered. Condos are concrete, often with radiant or tight RH swings. Solid 3/4-inch belongs on a dry wood-framed house. Demand a real wear layer if you want a future refinish.",
    intent: "comparison",
    primaryService: "hardwood-installation",
    pathHint: "/guides/solid-vs-engineered-ontario",
  },
  {
    slug: "nail-down-or-glue-down",
    q: "Should hardwood be nailed down or glued down?",
    a: "Nail-down on a dry wood subfloor. Glue-down on concrete, radiant, and most condo engineered jobs. Floating only when the mill requires it. The subfloor chooses the system.",
    intent: "comparison",
    primaryService: "hardwood-installation",
    pathHint: "/guides/nail-down-vs-glue-down-vs-floating-hardwood",
  },
  {
    slug: "do-hardwood-stairs-need-building-permit-ontario",
    q: "Do hardwood stairs need a building permit in Ontario?",
    a: "A like-for-like retread on an existing legal stair often does not. Changing rise/run, removing risers, moving guards, or building a new flight can. Green Hardwood will tell you when the drawing needs the city, and we will not build a pretty illegal stair.",
    intent: "informational",
    primaryService: "hardwood-stairs",
    pathHint: "/guides/ontario-stair-code-hardwood",
  },
  {
    slug: "what-wood-for-stairs-toronto",
    q: "What is the best wood for stairs in Toronto?",
    a: "White oak is the default: hard enough, stains well, matches the floor most resale buyers expect. Maple is harder and shows dents. Walnut is the feature flight. Red oak is a smart match to an existing 1990s house.",
    intent: "informational",
    primaryService: "hardwood-stairs",
    pathHint: "/guides/best-hardwood-species-toronto-homes",
  },
  {
    slug: "how-long-hardwood-install-takes",
    q: "How long does hardwood installation take?",
    a: "An 800–1,200 sq ft GTA install is typically 4–8 days plus acclimation before and cure after if site-finished. Stairs add 3–6 days. Condos and custom patterns add time we put in the proposal.",
    intent: "informational",
    primaryService: "hardwood-installation",
    pathHint: "/process",
  },
  {
    slug: "hardwood-stairs-vaughan",
    q: "Who does hardwood stairs in Vaughan?",
    a: "Green Hardwood converts builder carpet stairs to oak and walnut across Vaughan and the surrounding 905, with local pages for stairs and installation. Structure first, stain second.",
    intent: "local",
    primaryService: "hardwood-stairs",
    pathHint: "/services/hardwood-stairs/vaughan",
  },
  {
    slug: "hardwood-installation-mississauga",
    q: "Who installs hardwood in Mississauga?",
    a: "Green Hardwood installs solid and engineered hardwood in Mississauga houses and condos, including glue-down over concrete and dust-contained work in occupied units.",
    intent: "local",
    primaryService: "hardwood-installation",
    pathHint: "/services/hardwood-installation/mississauga",
  },
  {
    slug: "hardwood-stairs-oakville",
    q: "Who builds hardwood stairs in Oakville?",
    a: "Green Hardwood builds and retreads hardwood stairs in Oakville, including custom walnut flights and railings matched to the floor.",
    intent: "local",
    primaryService: "hardwood-stairs",
    pathHint: "/services/hardwood-stairs/oakville",
  },
  {
    slug: "will-hardwood-stairs-pass-inspection",
    q: "Will my hardwood stairs pass inspection?",
    a: "If Green Hardwood builds them, they are drawn to Ontario Part 9 rise, run, nosing, guard, and graspable-rail rules — or we do not build them. The inspector still has the last word. Use the stair studio for a first pass.",
    intent: "informational",
    primaryService: "hardwood-stairs",
    pathHint: "/stairs",
    featured: true,
  },
  {
    slug: "match-stair-stain-to-floor",
    seoTitle: "Matching Stair Stain to an Existing Floor",
    q: "Can you match new stair treads to an old hardwood floor?",
    a: "We can get them to belong. Exact 10-year colour is rare because oak yellows. We sample on site, age the sample, and get a sign-off before the whole flight is finished.",
    intent: "informational",
    primaryService: "hardwood-stairs",
    pathHint: "/guides/matching-hardwood-stairs-to-existing-floor",
  },
  {
    slug: "herringbone-cost-toronto",
    q: "How much extra is herringbone hardwood in Toronto?",
    a: "Plan on 40–55 percent more labour and a higher waste factor than a straight lay. Small condos often still want it because the pattern is the architecture. It has to be in the quote.",
    intent: "commercial",
    primaryService: "hardwood-installation",
    pathHint: "/guides/herringbone-hardwood-installation-toronto",
  },
  {
    slug: "hardwood-over-radiant-heat",
    q: "Can you install hardwood over radiant heat?",
    a: "Yes — usually engineered, mill-listed adhesive, and a written heat-up schedule. Most solid hardwood warranties die over hydronic heat.",
    intent: "informational",
    primaryService: "hardwood-installation",
    pathHint: "/guides/radiant-heat-hardwood-ontario",
  },
  {
    slug: "floating-hardwood-vs-nail-down",
    q: "Is floating hardwood as good as nail-down?",
    a: "It is a different floor. Nail-down solid on wood joists is the refinishable house floor. Floating is what some engineered products require. It is not a way to hide a bad subfloor.",
    intent: "comparison",
    primaryService: "hardwood-installation",
    pathHint: "/methods/floating-engineered-hardwood",
  },
  {
    slug: "open-riser-stairs-legal-ontario",
    q: "Are open-riser stairs legal in Ontario?",
    a: "They can be, if openings, guards, and deflection meet current Part 9. Many Pinterest open risers do not. Green Hardwood builds the legal ones and redraws the rest.",
    intent: "informational",
    primaryService: "hardwood-stairs",
    pathHint: "/guides/open-riser-floating-hardwood-stairs",
  },
  {
    slug: "hardwood-railings-code-ontario",
    q: "What makes a hardwood railing legal in Ontario?",
    a: "A graspable profile, the right guard height, legal infill spacing, and a newel fastened to structure. A 2x6 cap with no fingers-around profile fails. We will not install that.",
    intent: "informational",
    primaryService: "hardwood-railings",
    pathHint: "/methods/hardwood-railing-through-bolt",
  },
  {
    slug: "dustless-sanding-before-stair-work",
    q: "Should stairs be refinished with the floor?",
    a: "When they are the same system, yes. One stain formula, one dust event, one cure schedule. Doing the flight 'later' is how you get two oaks.",
    intent: "informational",
    primaryService: "sanding-refinishing",
    pathHint: "/services/sanding-refinishing",
  },
  {
    slug: "water-damage-hardwood-and-stairs",
    q: "Can water-damaged hardwood stairs be saved?",
    a: "Sometimes. Cups can settle. Rotten wedges and delaminated treads cannot. We meter, open a board, and tell you repair versus replace. See the emergency page if the leak is active.",
    intent: "informational",
    primaryService: "hardwood-repairs",
    pathHint: "/emergency",
  },
  {
    slug: "does-green-hardwood-install-vinyl",
    q: "Does Green Hardwood install vinyl plank?",
    a: "No. Real hardwood, stairs, and railings only. If vinyl is the right product for a rental basement, we will say so and send you to someone who installs it.",
    intent: "comparison",
    primaryService: "general",
    pathHint: "/compare",
  },
  {
    slug: "warranty-hardwood-stairs",
    q: "What warranty comes with Green Hardwood stairs?",
    a: "Three-year workmanship on installation and refinishing. Material warranties stay with the mill and require the specified assembly. A stair that we refused to build because of code has no warranty, because it was not built.",
    intent: "commercial",
    primaryService: "hardwood-stairs",
    pathHint: "/warranty",
  },
  {
    slug: "acclimation-how-many-days",
    q: "How many days should hardwood acclimate?",
    a: "Until the moisture content of the boards agrees with the room — often a few days, sometimes longer in a January GTA house. Days in a closed carton in the garage do not count.",
    intent: "informational",
    primaryService: "hardwood-installation",
    pathHint: "/guides/acclimation-hardwood-gta",
  },
  {
    slug: "hardwood-installation-forest-hill",
    q: "Do you install hardwood in Forest Hill and Rosedale?",
    a: "Yes. Heritage restorations, quarter-sawn oak, and stair work in Toronto's older west and north-east stock are core jobs. The Toronto area page is the local front door.",
    intent: "local",
    primaryService: "hardwood-installation",
    pathHint: "/areas/toronto",
  },
  {
    slug: "how-to-choose-hardwood-installer",
    q: "How do I choose a hardwood installer in the GTA?",
    a: "Ask who moisture-tests, who owns the stair, who names the adhesive, and who will refuse a bad slab. Ask for a workmanship warranty in writing. If the quote is only a square-foot number with no assembly, keep calling.",
    intent: "commercial",
    primaryService: "hardwood-installation",
    pathHint: "/compare",
  },
  {
    slug: "stair-studio-what-it-is",
    q: "What is the Green Hardwood stair studio?",
    a: "A on-site tool at /stairs that lets you configure a flight, see a price band, and run first-pass Ontario rise/run checks before you book a measure. It is not a permit. It is how you arrive at the site visit educated.",
    intent: "informational",
    primaryService: "hardwood-stairs",
    pathHint: "/stairs",
  },
];

export function getAnswer(slug: string) {
  return answers.find((x) => x.slug === slug);
}

/** The title to use in a <title> tag. Falls back to the full question. */
export function answerTitle(answer: Answer) {
  return answer.seoTitle ?? answer.q;
}
