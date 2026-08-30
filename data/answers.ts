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

  /* ------------------------------------------------------------------
   * 2026 demand expansion. Each of these answers a query mapped in
   * docs/QUERY-INVENTORY.md that no existing URL answered directly.
   * Prices are never typed here beyond the catalogue bands data/services.ts
   * already owns; timelines echo the estimator; code questions defer to the
   * building department per the standing rule.
   * ------------------------------------------------------------------ */
  {
    slug: "refinish-or-replace-hardwood-toronto",
    seoTitle: "Refinish or Replace Hardwood in Toronto?",
    q: "Should I refinish my hardwood or replace it?",
    a: "If a wear layer remains and the boards are flat and dry, refinishing wins: a dust-contained sand and a two-component waterborne finish costs a fraction of a new floor and keeps the original boards. Replacement is for floors sanded to the tongue, structurally wet, or failing across whole runs. We measure the wear layer and tell you which side of the line you are on — and we say so when a floor cannot be saved.",
    intent: "comparison",
    primaryService: "sanding-refinishing",
    pathHint: "/services/sanding-refinishing",
    featured: true,
  },
  {
    slug: "wide-plank-white-oak-toronto",
    seoTitle: "Wide-Plank White Oak in Toronto Homes?",
    q: "Is wide-plank white oak a good idea in a Toronto house?",
    a: "Yes, specified correctly — wide plank is the most-requested look in the GTA right now, and white oak takes stain and wear better than red. The catch is movement: the wider the board, the more a dry February and a humid July show. Past about five inches we spec engineered construction or quarter-sawn stock, check the subfloor moisture, and insist on humidity control. The plank does not fail; the specification does.",
    intent: "commercial",
    primaryService: "hardwood-installation",
    pathHint: "/services/hardwood-installation",
  },
  {
    slug: "herringbone-vs-chevron-cost-difference",
    seoTitle: "Herringbone vs Chevron: the Difference?",
    q: "What is the difference between herringbone and chevron, and which costs more?",
    a: "Herringbone is rectangular boards lapped at 90 degrees; chevron is boards cut at an angle so the rows meet in a continuous point. Chevron reads more tailored and wastes more material at the mitres, so it typically sits at the top of the pattern premium — both add roughly 40–55% labour over a straight lay. Same species, same finish, very different room.",
    intent: "comparison",
    primaryService: "hardwood-installation",
    pathHint: "/guides/herringbone-hardwood-installation-toronto",
  },
  {
    slug: "how-long-hardwood-stairs-take",
    seoTitle: "How Long Do Hardwood Stairs Take?",
    q: "How long does a hardwood stair job take?",
    a: "A straight flight up to about 14 steps typically runs 3–5 working days; longer or multi-landing work runs 5–8. Site-finished treads add cure time before sock traffic. We stage the work so you are never without a way upstairs overnight, and we put the schedule in writing before the crew arrives.",
    intent: "informational",
    primaryService: "hardwood-stairs",
    pathHint: "/services/hardwood-stairs",
  },
  {
    slug: "refinish-stairs-or-replace-treads",
    seoTitle: "Refinish Stairs or Replace the Treads?",
    q: "Can my stairs be refinished, or do the treads need replacing?",
    a: "Refinish when the treads are solid hardwood with life left in the wear layer and the nosing profile is intact. Replace when treads are builder-grade softwood or MDF under carpet, cupped, split at the nosing, or thinner than the floor they meet. Most carpet-off projects in the GTA end up as retreads — new oak treads and risers over the existing stringers — because what carpet hides is rarely worth sanding.",
    intent: "comparison",
    primaryService: "hardwood-stairs",
    pathHint: "/methods/carpet-to-hardwood-stair-retread",
  },
  {
    slug: "best-finish-for-hardwood-stairs",
    seoTitle: "Best Finish for Hardwood Stairs?",
    q: "What is the most durable finish for hardwood stairs?",
    a: "A two-component waterborne commercial finish in matte or satin. Stairs concentrate a whole floor's traffic onto twelve small surfaces, so the finish matters more than anywhere else in the house. High gloss shows every scratch and dust nib; hardwax oil is repairable but asks for maintenance a family staircase rarely gets. We finish treads with the same system we put on the floor, so sheen and colour match at the bottom step.",
    intent: "informational",
    primaryService: "hardwood-stairs",
    pathHint: "/services/hardwood-stairs",
  },
  {
    slug: "hardwood-installation-winter-toronto",
    seoTitle: "Can Hardwood Be Installed in Winter?",
    q: "Can hardwood be installed in a Toronto winter?",
    a: "Yes — winter is a normal installation season, and often an easier booking. What matters is not the month but the building: heat on, humidity in the living range, concrete and subfloor moisture verified, and the wood acclimated to the house it will live in. A January install into a stable house beats a July install into a humid one.",
    intent: "informational",
    primaryService: "hardwood-installation",
    pathHint: "/guides/acclimation-hardwood-gta",
  },
  {
    slug: "pet-friendly-hardwood-toronto",
    seoTitle: "Best Hardwood for Dogs and Pets?",
    q: "What hardwood holds up best with dogs?",
    a: "Harder species, lower sheen, stronger finish. Hickory and hard maple resist denting; white oak with a matte two-component waterborne finish hides claw micro-scratches far better than gloss on a soft species. Character-grade boards camouflage what family life adds later. No floor is scratch-proof — the honest goal is a floor that wears in instead of wearing out.",
    intent: "informational",
    primaryService: "hardwood-installation",
    pathHint: "/showroom",
  },
  {
    slug: "live-at-home-during-refinishing",
    seoTitle: "Can I Stay Home During Refinishing?",
    q: "Can we live in the house while floors are refinished?",
    a: "Usually, yes. Dust-contained sanding and low-odour waterborne finishes make occupied refinishing the normal case in GTA houses and condos — we sequence rooms so you keep a bedroom and a path to the kitchen. The real constraint is cure windows: sock traffic typically after 24 hours on waterborne two-component, furniture later. We put the sequence in writing before we start.",
    intent: "informational",
    primaryService: "sanding-refinishing",
    pathHint: "/services/sanding-refinishing",
  },
  {
    slug: "walk-on-floors-after-refinishing",
    seoTitle: "When Can I Walk on Refinished Floors?",
    q: "How soon can I walk on my floors after refinishing?",
    a: "Sock traffic typically after about 24 hours on a waterborne two-component finish; shoes and furniture later, and rugs last, once the finish has hard-cured. Oil-modified systems take longer at every stage. We leave the exact schedule for your finish in writing, because the most common way a new finish fails is a felt pad dragged across it on day two.",
    intent: "informational",
    primaryService: "sanding-refinishing",
    pathHint: "/services/sanding-refinishing",
  },
  {
    slug: "runner-on-hardwood-stairs",
    seoTitle: "Carpet Runner on Hardwood Stairs?",
    q: "Should I put a runner on new hardwood stairs?",
    a: "A runner is a legitimate choice — it quiets the flight and adds grip for pets and older family members — and it changes the build. Treads under a runner still need a finished reveal at both edges, and the nosing profile still has to meet Ontario Building Code whether carpet covers it or not. Tell us before we mill: a stair built for a runner is detailed differently from a stair built to be seen.",
    intent: "informational",
    primaryService: "hardwood-stairs",
    pathHint: "/services/hardwood-stairs",
  },
];

export function getAnswer(slug: string) {
  return answers.find((x) => x.slug === slug);
}

/** The title to use in a <title> tag. Falls back to the full question. */
export function answerTitle(answer: Answer) {
  return answer.seoTitle ?? answer.q;
}
