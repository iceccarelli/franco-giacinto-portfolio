export type Service = {
  slug: string;
  /** Display name, used in headings and body copy. */
  name: string;
  /**
   * Keyword-first short form for <title> tags and service x city pages, where
   * the full display name would overflow the ~60 character SERP limit.
   * Defaults to `name` via `seoNameOf()`.
   */
  seoName?: string;
  shortName: string;
  navLabel: string;
  eyebrow: string;
  headline: string;
  summary: string;
  image: string;
  imageAlt: string;
  priceFrom: string;
  duration: string;
  keywords: string[];
  bullets: string[];
  body: string[];
  faqs: { q: string; a: string }[];
};

export const services: Service[] = [
  {
    slug: "hardwood-installation",
    name: "Hardwood Floor Installation",
    shortName: "Installation",
    navLabel: "Installation",
    eyebrow: "Solid & engineered · Nail-down, glue-down, floating",
    headline: "Hardwood floor installation in Toronto and the GTA, built for Ontario houses.",
    summary:
      "Precision solid and engineered hardwood installation for new builds, gut renovations, and room-by-room upgrades. Subfloor, moisture, and acclimation come first — the finish is the last 10%.",
    image: "/images/service-install.jpg",
    imageAlt:
      "Solid white oak hardwood planks being installed with a pneumatic nailer over a prepared subfloor in a Toronto renovation.",
    priceFrom: "From $11–$22 / sq ft installed",
    duration: "Typical 800 sq ft home: 4–8 days",
    keywords: [
      "hardwood floor installation Toronto",
      "engineered hardwood GTA",
      "solid hardwood install Mississauga",
    ],
    bullets: [
      "Moisture mapping and subfloor flattening before a single board is laid",
      "Solid nail-down, glue-down engineered, and floating systems",
      "Herringbone, chevron, mixed-width, and border layouts",
      "Radiant-heat compatible assemblies with manufacturer warranties intact",
    ],
    body: [
      "Most failed hardwood floors in the GTA were installed on a subfloor nobody measured. Ontario basements sweat, new-build slabs off-gas moisture, and century homes move with the seasons. Green Hardwood starts every install with a Tramex moisture survey, a flatness check, and an acclimation window matched to the species — not a calendar guess.",
      'We install solid hardwood (typically 3/4") where the structure can take it, and premium engineered hardwood over concrete, radiant, or when a thinner assembly is required. White oak is the workhorse of Toronto right now; walnut, maple, hickory, and red oak are specified when the architecture asks for them.',
      "Layout is not decoration. In a Rosedale hallway we run boards to carry the eye to the stair. In a King West condo we often switch to herringbone so a small floor reads as architecture, not leftover material. Transitions to tile, stair nosings, and flush vents are detailed on paper before we cut.",
      "You get a written scope, a species and grade sample signed off, and a three-year workmanship warranty. Material warranties stay with the mill — we do not void them with the wrong adhesive or the wrong relative humidity.",
    ],
    faqs: [
      {
        q: "How much does hardwood installation cost in Toronto?",
        a: "In the GTA in 2026, most residential hardwood installs land between $11 and $22 per square foot for material plus labour, depending on species, pattern, and site conditions. Herringbone and walnut sit at the high end. Use the Green Hardwood estimator for a range, then book a site visit for a firm quote.",
      },
      {
        q: "Solid or engineered hardwood for a Toronto house?",
        a: 'Solid 3/4" oak or maple is the right call on a dry, wood-framed subfloor you expect to refinish for decades. Engineered is the right call over concrete, radiant heat, below grade, or when you need more dimensional stability. We specify both — we do not upsell the one with more margin.',
      },
    ],
  },
  {
    slug: "hardwood-stairs",
    name: "Hardwood Stairs",
    shortName: "Stairs",
    navLabel: "Stairs",
    eyebrow: "Treads · Risers · Stringers · Nosing · Code",
    headline: "Custom hardwood stairs that match the floor and pass Ontario building code.",
    summary:
      "Box stairs, open-riser, replacement treads over carpet, curved flights, and full stair rebuilds. The stair is the first thing guests touch. We treat it as millwork, not leftover flooring.",
    image: "/images/service-stairs.jpg",
    imageAlt:
      "Custom walnut and white oak staircase with black metal balusters and a sculpted oak handrail in a contemporary GTA home.",
    priceFrom: "From $380–$850 per step, installed",
    duration: "Typical 13-step flight: 3–6 days",
    keywords: [
      "hardwood stairs Toronto",
      "oak stair treads GTA",
      "carpet to hardwood stairs Mississauga",
    ],
    bullets: [
      "Retread carpeted stairs with solid oak, maple, or walnut treads",
      "Box newels, open risers, floating stringers, and bullnose starts",
      "Matched species and stain to the adjacent hardwood floor",
      "Rise/run, nosing projection, and guards detailed to Ontario Building Code",
    ],
    body: [
      'Stairs are where cheap flooring companies get exposed. A 3/4" floor glued to a 5/8" plywood tread, a painted MDF riser next to a $14/sq ft oak floor, a nosing that trips the building inspector — we see it every week in the GTA.',
      "Green Hardwood builds and installs hardwood stairs as a system: treads, risers, stringers, scotia, nosing, and the first-floor landing, all in the same species and finish as the floor — or in a deliberate contrast, usually walnut against white oak.",
      "The most requested job in 2026 is converting builder-grade carpet stairs in Vaughan, Markham, and Milton new builds into solid oak box stairs. We pull the carpet, inspect the structure, sister anything that flexes, and install solid treads with returned ends on the open side.",
      "Ontario Building Code governs rise, run, nosing, guards, and graspable handrails. We do not install a beautiful stair that fails inspection. If your designer wants a 6\" run because it 'looks floating,' we will say no and show the drawing that will pass.",
    ],
    faqs: [
      {
        q: "Can you put hardwood treads over existing carpet stairs?",
        a: "Usually yes. We remove the carpet and nosing, inspect the stringers, and either cap with solid treads or rebuild if the structure is undersized. Open-side stairs often need returned treads and a proper false stringer — not a leftover plank glued to the drywall.",
      },
      {
        q: "How much do hardwood stairs cost in the GTA?",
        a: "A standard 13-step flight with oak treads, painted or wood risers, and a matching nosing typically runs $5,000–$11,000 installed. Custom walnut, curved flights, and iron balusters move that number up. Railings are quoted separately.",
      },
    ],
  },
  {
    slug: "hardwood-railings",
    name: "Hardwood Railings",
    shortName: "Railings",
    navLabel: "Railings",
    eyebrow: "Handrails · Newels · Balusters · Volutes",
    headline:
      "Hardwood railings with a graspable profile, a tight newel, and a finish that matches the stair.",
    summary:
      "Custom oak, maple, and walnut handrails, box and turned newels, metal or wood balusters, volutes, goosenecks, and wall-mounted rails that actually meet code.",
    image: "/images/service-railings.jpg",
    imageAlt:
      "Close-up of a craftsman checking an oil-finished white oak handrail join at a newel post.",
    priceFrom: "From $180–$420 / linear foot",
    duration: "Typical two-storey rail: 2–4 days",
    keywords: [
      "hardwood railings Toronto",
      "oak handrail installation GTA",
      "stair railing replacement Oakville",
    ],
    bullets: [
      "Graspable oak, maple, and walnut profiles, including farmhouse and contemporary",
      "Box newels, pin-top newels, and metal newel conversions",
      "Iron, steel, wood, and cable infill — mixed-material stairs done cleanly",
      "Wall rails on both sides where the code or a toddler requires them",
    ],
    body: [
      "A railing is a piece of millwork you put your full weight on at 11 p.m. If the newel is toe-nailed into a hollow newel block, it will fail. Green Hardwood through-bolts newels into structure, not into trim.",
      "We mill and install hardwood handrails in the same species as the stair, or we specify a painted newel with a clear-finish oak rail — a combination that reads expensive in Forest Hill and stays wipeable in a family house in Burlington.",
      "Ontario requires a graspable handrail and a guard height that depends on the drop. Decorative 2x6 caps with no graspable profile fail inspection. We will not install them. We will show you three profiles that pass and still match the architecture.",
      "Railing replacements are often paired with hardwood stair retreads. Doing both in one mobilization is cheaper, cleaner, and means one stain formula, not two.",
    ],
    faqs: [
      {
        q: "Do you install metal balusters with wood rails?",
        a: "Yes. Square, hammered, and contemporary steel balusters into a wood rail and newel is one of our most common GTA packages. We drill, shoe, and epoxy properly so they do not rattle in year three.",
      },
      {
        q: "Can you match an existing 1990s oak rail?",
        a: "We can get very close. Exact 30-year-old stain matches are honest-to-goodness hard because oak yellows. We sample on site, age the sample under light, and show you the match before we finish the whole run.",
      },
    ],
  },
  {
    slug: "sanding-refinishing",
    name: "Hardwood Sanding, Finishing & Refinishing",
    seoName: "Hardwood Refinishing",
    shortName: "Sanding & Refinishing",
    navLabel: "Refinishing",
    eyebrow: "Dust-contained sanding · Stain · Bona / Loba finish",
    headline: "Dust-contained hardwood sanding and refinishing that brings a 40-year floor back.",
    summary:
      "Screen-and-recoat or full sand-to-bare-wood. Custom stain matching, waterborne and oil-modified systems, and a house you can actually live in while we work.",
    image: "/images/service-refinish.jpg",
    imageAlt:
      "Professional dust-contained hardwood floor sander working across white oak planks in a sunlit Toronto home.",
    priceFrom: "From $4.50–$8.50 / sq ft",
    duration: "Typical 1,000 sq ft: 3–5 days including cure",
    keywords: [
      "hardwood floor refinishing Toronto",
      "dustless sanding GTA",
      "hardwood staining Mississauga",
    ],
    bullets: [
      "Bona dust containment — 99%+ capture, occupied-home friendly",
      "Full sand or screen-and-recoat depending on remaining wear layer",
      "Custom stain matching to stairs, millwork, and adjacent rooms",
      "Bona Traffic HD and Loba 2K systems for dogs, kids, and condos",
    ],
    body: [
      "Refinishing is the highest-ROI hardwood job in the GTA. A tired red-oak floor from 1998, sanded correctly and finished in a modern matte, outperforms a cheap vinyl plank at a fraction of replacement cost.",
      "We do not 'dustless-sand' with a shop vac taped to a rental drum. Green Hardwood runs professional containment: perimeter sealing, negative air where needed, and a sanding sequence (open-coat belts, then multi-disc) that does not dish the edges or leave chatter.",
      "Finish choice is a performance spec. Waterborne two-component (Bona Traffic HD, Loba 2K) for condos and commercial. Hardwax oil for owners who want a repairable, low-sheen European look and will maintain it. Oil-modified only when the client wants that warmer amber and accepts the odour window.",
      "If the floor has already been sanded to the nails, we will tell you and quote replacement. Sanding a floor that has no wear layer left is how you buy a new floor twice.",
    ],
    faqs: [
      {
        q: "How long before we can walk on a refinished floor?",
        a: "Sock traffic is typically 24 hours on waterborne two-component systems. Furniture at 3–5 days. Rugs at 7–14 days. We leave a written cure schedule specific to the product, not a generic flyer.",
      },
      {
        q: "Can you refinish in an occupied condo?",
        a: "Yes. Dust containment, elevator protection, and a schedule that respects condo quiet hours are standard. We have refinished 1,100 sq ft maple units in Richmond Hill with clients sleeping there the same night.",
      },
    ],
  },
  {
    slug: "hardwood-repairs",
    name: "Hardwood Repairs & Restoration",
    seoName: "Hardwood Floor Repair",
    shortName: "Repairs",
    navLabel: "Repairs",
    eyebrow: "Water · Pets · Gaps · Board replacement",
    headline:
      "Invisible hardwood repairs — cupping, floods, pet damage, and matching 20-year-old oak.",
    summary:
      "Board replacement, cupping correction, gap filling, structural sistering, and stain matching on heritage and contemporary floors. Emergency water-damage response across the GTA.",
    image: "/images/service-repair.jpg",
    imageAlt:
      "Craftsman fitting a grain-matched replacement white oak board into a water-damaged hardwood floor.",
    priceFrom: "From $650 minimum · $18–$35 / sq ft affected",
    duration: "Most repairs: 1–3 days plus finish cure",
    keywords: [
      "hardwood floor repair Toronto",
      "water damaged hardwood GTA",
      "board replacement oak floor",
    ],
    bullets: [
      "Flood and dishwasher leak board replacement with grain match",
      "Cupping and crowning correction after moisture events",
      "Pet stains, burns, and high-heel crater repair",
      "Heritage restoration on quarter-sawn oak in Forest Hill, Rosedale, High Park",
    ],
    body: [
      "The test of a hardwood company is not a new floor in a new house. It is replacing four boards in a 15-year-old red oak kitchen so the owner cannot find the seam.",
      "Water is the usual caller: ice-maker lines, second-floor baths, and spring seepage in older Toronto foundations. We measure moisture, isolate the wet zone, and do not sand the whole floor until the replacement boards have acclimated to the same moisture content as the field.",
      "Matching species, grade, and grain direction matters more than matching colour on day one. Colour we can stain. Grain we cannot invent. We keep a library of GTA-typical oak, maple, and walnut so we are not buying a 'close enough' board from a big-box store.",
    ],
    faqs: [
      {
        q: "My hardwood cupped after a leak. Can it be saved?",
        a: "Often. If the boards have not separated from the subfloor and moisture is coming down, they can be dried, sanded, and refinished. If they have delaminated or the tongues are broken, those boards come out. We tell you which, with moisture readings, before we quote.",
      },
    ],
  },
  {
    slug: "hardwood-decks",
    name: "Hardwood Decks",
    shortName: "Decks",
    navLabel: "Decks",
    eyebrow: "Ipe · Cumaru · Cedar · Hardwood porch",
    headline:
      "Hardwood decks and porches that survive Ontario winters without looking cheap in July.",
    summary:
      "Dense tropical hardwoods and properly detailed cedar for GTA decks, porches, and stoops. Hidden fasteners, correct ventilation, and flashing that actually keeps water out of the rim joist.",
    image: "/images/service-deck.jpg",
    imageAlt:
      "Golden-hour hardwood deck with cable railing and built-in benches in a landscaped Toronto backyard.",
    priceFrom: "From $28–$48 / sq ft for ipe-class decks",
    duration: "Typical 300 sq ft deck: 1–2 weeks",
    keywords: ["hardwood deck Toronto", "ipe deck installation GTA", "wood porch refinishing"],
    bullets: [
      "Ipe, cumaru, and other dense hardwoods with hidden fasteners",
      "Porch floor restoration on Victorian and Edwardian Toronto houses",
      "Stair and railing packages that match the interior millwork language",
      "Oil maintenance programs so the deck does not go grey in two seasons",
    ],
    body: [
      "Interior hardwood people who 'also do decks' are how you get a beautiful ipe surface on a rotten ledger. Green Hardwood details the envelope: ledger flashing, joist tape, ventilation, and a slope that drains.",
      "Ipe and cumaru earn their cost in the GTA because they take UV, ice, and barbecue fat without the cupping you see in under-specified cedar. Cedar is still the right material for some porches and budgets — we will say so.",
      "We also restore original tongue-and-groove porch floors on Toronto Victorians, a job that is closer to interior flooring than to a big-box deck.",
    ],
    faqs: [
      {
        q: "Is ipe worth it in Ontario?",
        a: "If you want a deck that still looks like furniture in year twelve, yes. If you want the lowest first cost, no — use a well-detailed cedar or a composite and spend the money on flashing. We quote both.",
      },
    ],
  },
  {
    slug: "custom-inlays",
    name: "Custom Inlays & Patterns",
    seoName: "Hardwood Inlays",
    shortName: "Inlays",
    navLabel: "Inlays",
    eyebrow: "Medallions · Herringbone · Borders · Crests",
    headline: "Hand-cut hardwood inlays, borders, and patterns — architecture underfoot.",
    summary:
      "Compass roses, herringbone fields, walnut borders, and custom crests cut from domestic and exotic hardwoods. Feature work for foyers, dining rooms, and boutique commercial.",
    image: "/images/project-inlay.jpg",
    imageAlt:
      "Hand-cut compass rose medallion in walnut, maple, and cherry set into a dining-room hardwood floor.",
    priceFrom: "Quoted per design · medallions from $2,800",
    duration: "Design + install: 2–6 weeks",
    keywords: ["hardwood inlay Toronto", "herringbone floor GTA", "custom medallion oak"],
    bullets: [
      "CAD layout and full-scale templates before a chisel hits the floor",
      "Species contrast that will still read in 20 years, not just on install day",
      "Borders that turn a builder-grade rectangle into a room",
    ],
    body: [
      "Pattern work is slow, and it should be. A 48-inch compass rose in a Rosedale dining room is a week of fitting, not an afternoon of glue. We cut, dry-fit, and only then commit finish.",
    ],
    faqs: [
      {
        q: "Can you inlay a family crest or logo?",
        a: 'Yes, within the limits of wood movement and grain. We will simplify a crest that would shatter at 1/8" detail. Commercial logos for boutique lobbies are a regular request.',
      },
    ],
  },
  {
    slug: "commercial-hardwood",
    name: "Commercial Hardwood",
    shortName: "Commercial",
    navLabel: "Commercial",
    eyebrow: "Restaurants · Boutiques · Lobbies · Offices",
    headline: "Commercial hardwood that survives Toronto traffic and still photographs well.",
    summary:
      "High-build finishes, night and weekend installs, and species that hide the lunch rush. Restaurants, hotels, showrooms, and professional offices across the GTA.",
    image: "/images/project-etobicoke.jpg",
    imageAlt:
      "Restaurant interior with wide-plank ash hardwood floors and a reclaimed barn-board feature wall.",
    priceFrom: "Quoted per project",
    duration: "Phased around your operations",
    keywords: ["commercial hardwood flooring Toronto", "restaurant wood floors GTA"],
    bullets: [
      "Bona Traffic HD and equivalent commercial systems",
      "After-hours and phased installs so you do not close for a week",
      "Feature walls, stair packages, and matching millwork",
    ],
    body: [
      "A restaurant floor is a different product than a bedroom. We specify species, finish, and maintenance with the chef and the cleaner in the conversation, not just the designer.",
    ],
    faqs: [
      {
        q: "Can you work overnight?",
        a: "Yes. Boutique retail and restaurant work is regularly staged 10 p.m. to 6 a.m. with a morning handoff.",
      },
    ],
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}

/** The name to use in a <title>. Falls back to the display name. */
export function seoNameOf(service: Service) {
  return service.seoName ?? service.name;
}
