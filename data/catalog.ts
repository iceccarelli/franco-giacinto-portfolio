import { calculateEstimate, emptyEstimate, type EstimateInput } from "@/data/estimate";
import { getService } from "@/data/services";

/**
 * The job catalogue: the twelve shapes of work this shop actually takes.
 *
 * ── Why this file exists, stated plainly ──────────────────────────────────
 *
 * It replaces `data/testimonials.ts`, which held six invented customers —
 * names, five-star ratings and quotes for people who do not exist. They were
 * already stripped out of the structured data (see `lib/seo.ts`), but they
 * still rendered on the homepage under the heading "What clients actually
 * say", which is a sentence that was not true.
 *
 * Deleting them outright would have thrown away something real, though. The
 * fabrication was the attribution, not the *subject matter*: a heritage
 * quarter-sawn refinish with matched treads, herringbone over hydronic radiant
 * on a slab, an occupied condo sanded dust-contained, a builder's carpeted
 * flight converted to white oak. Those are the jobs. Franco does them. What
 * was invented was a person praising them.
 *
 * So the substance is kept and the pretence is dropped. Each entry below
 * describes a job the way a specifier would: what it is, what it is called
 * when a homeowner searches for it, the typical specification, the real
 * published band, the timeline, and — most usefully — what goes wrong when it
 * is done badly. Nobody is quoted. Nothing is claimed about a customer.
 *
 * ── Why this is worth more than the testimonials were ─────────────────────
 *
 * A stranger's five-star quote persuades nobody who is spending $18,000; it is
 * the single most discounted signal on a contractor's website, precisely
 * because it is the easiest to fake. A page that says "here is the failure
 * mode of a stair retread and here is the number it costs in your city" is
 * something a competitor cannot copy without knowing the trade, and it is
 * exactly the shape of content an answer engine quotes.
 *
 * ── The honesty rules this file lives under ───────────────────────────────
 *
 * 1. No entry names, quotes, or characterises a customer. Ever.
 * 2. `priceFrom` is never written here. It is read from `data/services.ts` at
 *    render time, so the catalogue cannot drift from the published bands, and
 *    `tests/navigation.test.ts` fails a hard-coded range anyway.
 * 3. The worked example is *computed* by `calculateEstimate`, not typed. If
 *    the estimator changes, the catalogue changes with it.
 * 4. `illustrative: true` marks an archetype with no delivered job behind it
 *    yet, and the UI labels it as a capability rather than a record. Lying by
 *    omission is still lying.
 * 5. `testimonial` is `null` on every entry and stays null until a real,
 *    permissioned one exists. When one does, it drops in here and renders
 *    against the job it actually belongs to — which is worth ten floating
 *    quotes on a homepage.
 */

export type CatalogEntry = {
  slug: string;
  /** What the trade calls it. */
  name: string;
  /**
   * Keyword-first short form for <title>. The display name plus a descriptive
   * suffix plus the brand template overflows the ~60 character SERP limit on
   * most entries — the site audit flags it, and a truncated title loses the
   * keyword that was the point. Kept under ~40 so the brand suffix fits.
   */
  seoTitle: string;
  /** What a homeowner types into Google. Drives the H1 and the keywords. */
  alsoCalled: string[];
  /** Which published service owns the price band. Never restate the band. */
  serviceSlug: string;
  category: "install" | "refinish" | "stairs" | "railings" | "repair" | "commercial" | "deck";
  /** One sentence: what this job is. */
  summary: string;
  /** The situation that produces this job. Written to be recognised. */
  trigger: string;
  /** Typical specification, as a specifier would write it. */
  spec: string[];
  /** What is actually done, in order. */
  sequence: string[];
  /**
   * What goes wrong. The most valuable field in the file and the hardest to
   * fake — this is the part a homeowner cannot get from a competitor's
   * brochure, and the part an answer engine has nothing else to cite.
   */
  failureModes: { problem: string; consequence: string; avoidedBy: string }[];
  /** Inputs for the worked example. Rendered through calculateEstimate. */
  example: Partial<EstimateInput> & { label: string };
  /** Slugs from data/projects.ts, when a real photographed job exists. */
  relatedProjects: string[];
  /** Method pages that explain the technique. */
  relatedMethods: string[];
  /** Diagnostic pages this job answers. */
  relatedProblems: string[];
  /**
   * True when no delivered job of this exact shape is documented yet. The UI
   * says "capability" rather than implying a record.
   */
  illustrative: boolean;
  /**
   * A real, permissioned customer testimonial for THIS job type. Null on every
   * entry, and it stays null until one exists in writing. `tests/catalog.test.ts`
   * fails the build if one appears without a source and a date.
   */
  testimonial: null | {
    authorDisplay: string;
    city: string;
    date: string;
    body: string;
    permission: true;
    offsiteUrl?: string;
  };
};

export const catalog: CatalogEntry[] = [
  {
    slug: "carpet-to-hardwood-stairs",
    name: "Carpet-to-hardwood stair conversion",
    seoTitle: "Carpet to Hardwood Stairs",
    alsoCalled: [
      "carpet to hardwood stairs",
      "stair retread",
      "removing carpet from stairs",
      "hardwood stairs over existing stairs",
    ],
    serviceSlug: "hardwood-stairs",
    category: "stairs",
    summary:
      "Builder-grade carpeted flight stripped to the rough stringer and rebuilt in solid hardwood treads and matched risers.",
    trigger:
      "A house built after about 1985 with carpet on the stairs and hardwood everywhere else. The carpet is worn in the centre of each tread, the flight is the first thing anyone sees from the front door, and the stairs are the only surface in the house that still looks like a builder chose it.",
    spec: [
      "Solid hardwood treads, 1 inch nominal, species matched to the adjacent floor",
      "Matched risers, or painted risers where the design calls for contrast",
      "Nosing profile matched to the existing floor edge",
      "Site-finished to the same sheen as the floor, or prefinished where the schedule is tight",
    ],
    sequence: [
      "Lift carpet, pad, and every staple. The staples are the hours nobody quotes for.",
      "Assess the rough stringer — builder flights are frequently out of level by more than the tread thickness.",
      "Shim and true each rise so the finished flight meets Ontario Building Code rise tolerance.",
      "Cut and fit treads and risers, mitred returns on the open side.",
      "Sand, stain to the approved floor sample, finish.",
      "Reinstall or rebuild the railing to code height with a graspable profile.",
    ],
    failureModes: [
      {
        problem: "Retreads laid straight onto an untrued builder stringer",
        consequence:
          "Rise varies from step to step. The Ontario Building Code tolerance between the tallest and shortest rise in a flight is tight, and a flight outside it is both a trip hazard and an inspection problem on any permitted work.",
        avoidedBy: "Measuring every rise before cutting anything, then shimming the stringer.",
      },
      {
        problem: "A nosing that projects further than the floor's edge profile",
        consequence:
          "The classic retread mistake. It reads as wrong from the hallway even to someone who cannot say why, and an over-projecting nosing is its own code failure.",
        avoidedBy:
          "Matching the nosing profile to the existing floor before the first tread is cut.",
      },
      {
        problem: "Stain approved under a work light rather than in the actual stairwell",
        consequence:
          "The treads read a different colour from the floor they meet. Stairwells are the worst-lit space in most houses and colour shifts hard under warm artificial light.",
        avoidedBy: "Signing off the sample in the stairwell itself, in daylight and at night.",
      },
    ],
    example: {
      label: "13-step flight, white oak, Vaughan",
      service: "stairs",
      stairs: 13,
      city: "vaughan",
    },
    relatedProjects: ["oakville-estate-stair"],
    relatedMethods: ["carpet-to-hardwood-stair-retread"],
    relatedProblems: ["squeaking-stairs", "loose-stair-nosing"],
    illustrative: false,
    testimonial: null,
  },
  {
    slug: "heritage-quarter-sawn-refinish",
    name: "Heritage quarter-sawn oak restoration",
    seoTitle: "Heritage Oak Floor Restoration",
    alsoCalled: [
      "refinishing 1920s hardwood floors",
      "restoring original oak floors Toronto",
      "century home floor refinishing",
    ],
    serviceSlug: "sanding-refinishing",
    category: "refinish",
    summary:
      "Original quarter-sawn oak in a pre-war house sanded back honestly, repaired where it is damaged, and refinished to match surviving millwork.",
    trigger:
      "A house from roughly 1900 to 1940 whose floors have been screen-coated two or three times and still show traffic lanes. The floor is not worn out — it has been maintained badly. There is usually more wood left than the owner assumes.",
    spec: [
      "Depth check before any commitment: quarter-sawn face over the tongue is finite and non-renewable",
      "Honest grit sequence — no jumping grits to save a pass",
      "Board-level repair at water damage, usually a butler's pantry, radiator, or entry",
      "Custom toner matched to surviving trim, not to a fan deck",
      "Matte waterborne two-component, or oil where the house calls for it",
    ],
    sequence: [
      "Measure remaining wear layer at several points. If it will not take a full sand, say so before quoting one.",
      "Lift and replace damaged boards with salvage or milled-to-match stock.",
      "Full sand through the grit sequence; no skipped steps.",
      "Sample the toner against the original trim in daylight and sign it off.",
      "Finish, then cut in by hand where the floor meets original millwork.",
    ],
    failureModes: [
      {
        problem: "Sanding a floor that has already been sanded to its limit",
        consequence:
          "The tongue is exposed and the board is finished — permanently. On quarter-sawn stock this destroys the ray fleck that is the entire reason the floor is worth restoring.",
        avoidedBy:
          "Measuring the wear layer first and recommending a buff-and-recoat when that is the honest answer.",
      },
      {
        problem: "Colour approved against a modern trim sample",
        consequence:
          "Century trim has ambered for a hundred years. A stain matched to new stock reads pink or grey beside it, and the mismatch is permanent.",
        avoidedBy: "Sampling against the surviving original millwork in the room itself.",
      },
      {
        problem: "Jumping grits to save a pass",
        consequence:
          "Scratch from the coarse pass is sealed under the finish, invisible while wet and obvious in raking light for the life of the floor.",
        avoidedBy: "Running the full sequence, and inspecting in raking light between passes.",
      },
    ],
    example: {
      label: "1,850 sq ft, quarter-sawn oak, Toronto",
      service: "refinish",
      sqft: 1850,
      city: "toronto",
    },
    relatedProjects: ["forest-hill-heritage"],
    relatedMethods: [],
    relatedProblems: ["hardwood-floor-cupping"],
    illustrative: false,
    testimonial: null,
  },
  {
    slug: "occupied-condo-dust-contained-refinish",
    name: "Occupied condo refinish, dust-contained",
    seoTitle: "Dust-Free Refinish, Occupied Condo",
    alsoCalled: [
      "dust free sanding Toronto",
      "refinishing floors while living there",
      "condo floor refinishing occupied",
    ],
    serviceSlug: "sanding-refinishing",
    category: "refinish",
    summary:
      "Existing hardwood in an occupied unit sanded and refinished under containment, with the residents and their pets staying in the home.",
    trigger:
      "A condo or a house where moving out for a week is not an option — young children, pets, a home office, or a building that will not permit an empty unit. The assumption is that refinishing means leaving. It usually does not.",
    spec: [
      "Vacuum-integrated sanding equipment at every stage, edger included",
      "Zip-wall containment with negative air pressure at the work boundary",
      "Waterborne two-component finish — low odour, fast recoat window",
      "Staged room-by-room so a bedroom and a bathroom stay reachable every night",
    ],
    sequence: [
      "Walk the unit and agree the containment line and the nightly reachable path.",
      "Seal the boundary, set negative pressure, protect the corridor and the elevator route to the building's rules.",
      "Sand under containment, edger included — the edger is where dust escapes.",
      "Finish waterborne, staged so the resident always has a route to a bed and a bathroom.",
      "Pull containment, wipe down, walk the unit with the owner.",
    ],
    failureModes: [
      {
        problem: "Containment on the drum sander but not the edger",
        consequence:
          "The edger produces the fine dust that travels. It reaches closets and HVAC returns, and it is found weeks later on every horizontal surface in the unit.",
        avoidedBy:
          "Vacuum integration at every machine, and negative pressure across the boundary.",
      },
      {
        problem: "Solvent finish in an occupied unit",
        consequence:
          "The odour is not merely unpleasant; it makes the unit genuinely uninhabitable for days and can carry into neighbouring units through shared HVAC.",
        avoidedBy: "Waterborne two-component finish, which is also the harder-wearing product.",
      },
      {
        problem: "Ignoring the building's own rules on corridor protection and elevator booking",
        consequence:
          "The job gets stopped mid-sand by property management, and the resident lives with a bare, unfinished floor until it can be rebooked.",
        avoidedBy: "Reading the building's contractor rules before the schedule is promised.",
      },
    ],
    example: {
      label: "1,100 sq ft occupied unit, Richmond Hill",
      service: "refinish",
      sqft: 1100,
      city: "richmond-hill",
    },
    relatedProjects: ["richmond-hill-condo"],
    relatedMethods: [],
    relatedProblems: [],
    illustrative: false,
    testimonial: null,
  },
  {
    slug: "herringbone-over-radiant",
    name: "Herringbone over hydronic radiant on slab",
    seoTitle: "Herringbone Over Radiant Heat",
    alsoCalled: [
      "herringbone floor over radiant heat",
      "hardwood over concrete slab Toronto",
      "engineered herringbone install",
    ],
    serviceSlug: "hardwood-installation",
    category: "install",
    summary:
      "Engineered European oak in a herringbone field, glued over a concrete slab with hydronic radiant beneath, to a specification the mill will still warrant.",
    trigger:
      "A condo or a new build with a concrete slab and radiant heat, where the design calls for herringbone. This is the specification most likely to be quoted wrong, because the pattern is chosen before the substrate is understood.",
    spec: [
      "Engineered construction only — solid over radiant is a warranty void, not a preference",
      "Moisture testing of the slab, in-situ RH, before adhesive is ordered",
      "The adhesive the mill warrants over heat, not the adhesive on the truck",
      "Field set square to the sightline the room is actually read from",
      "Radiant commissioned and cycled before installation, not after",
    ],
    sequence: [
      "In-situ relative humidity test in the slab. The number decides the whole system.",
      "Confirm the radiant has been run through a full heat cycle and is at operating temperature.",
      "Set the field line against the room's main sightline — usually a window wall, not the longest wall.",
      "Glue down in the mill-warranted adhesive, working the pattern from the centre line out.",
      "Ramp the radiant back up on the mill's schedule, not all at once.",
    ],
    failureModes: [
      {
        problem: "Floating a herringbone floor over radiant",
        consequence:
          "Voids the mill warranty outright, and a floating herringbone field telegraphs every slab imperfection as hollow spots underfoot.",
        avoidedBy: "Full-spread glue-down in the warranted adhesive. There is no shortcut here.",
      },
      {
        problem: "Adhesive chosen without an in-situ slab moisture reading",
        consequence:
          "Bond failure months later, under a finished floor, with the furniture in. The remedy is a full tear-out.",
        avoidedBy: "Testing the slab and buying the adhesive to the reading.",
      },
      {
        problem: "Field squared to the longest wall",
        consequence:
          "The pattern runs visibly out of square against the view the room is actually read from. It cannot be corrected without lifting the floor.",
        avoidedBy:
          "Setting the centre line to the dominant sightline and dry-laying it before glue.",
      },
    ],
    example: {
      label: "2,400 sq ft engineered oak, herringbone, Toronto",
      service: "install",
      sqft: 2400,
      pattern: "herringbone",
      city: "toronto",
    },
    relatedProjects: ["king-west-herringbone"],
    relatedMethods: ["glue-down-engineered-hardwood"],
    relatedProblems: [],
    illustrative: false,
    testimonial: null,
  },
  {
    slug: "whole-home-install-plus-stairs",
    name: "Whole-home install with the stairs in the same mobilisation",
    seoTitle: "Whole-Home Hardwood and Stairs",
    alsoCalled: [
      "replacing builder laminate with hardwood",
      "whole house hardwood installation",
      "new build floor upgrade",
    ],
    serviceSlug: "hardwood-installation",
    category: "install",
    summary:
      "Builder-grade flooring and carpeted stairs removed together, replaced with one species and one finish through the whole house.",
    trigger:
      "A newer house delivered with laminate through the main floor and carpet on the stairs. Two contractors would normally do this in two visits, with two finishes that never quite match. One shop, one mobilisation, one finish.",
    spec: [
      "One species and one finish specified across floor and treads",
      "Subfloor flatness checked and corrected before any board is laid",
      "Transitions designed rather than covered with a strip",
      "Stairs and floor finished in the same batch so the sheen matches",
    ],
    sequence: [
      "Remove existing flooring and stair carpet in one lift.",
      "Check and correct subfloor flatness to the mill's tolerance.",
      "Lay the field, working from the main sightline.",
      "Build the stairs to the same species, matched nosing to the floor edge.",
      "Finish floor and treads together, one batch, one sheen.",
    ],
    failureModes: [
      {
        problem: "Floor and stairs finished in separate batches",
        consequence:
          "Sheen and tone differ at the exact point where the eye compares them — the bottom step. It is the most visible mismatch in the house.",
        avoidedBy: "One mobilisation, one finish batch, floor and treads together.",
      },
      {
        problem: "Subfloor flatness accepted as-built",
        consequence:
          "Hollow spots and squeaks across a floor that is otherwise correctly installed, and the mill will decline the warranty claim.",
        avoidedBy: "Measuring flatness and correcting it before the first board.",
      },
      {
        problem: "Stairs subcontracted to a second trade",
        consequence:
          "Two warranties, two schedules, and nobody responsible when the tread colour does not match the floor.",
        avoidedBy: "One shop that builds both. That is the whole argument for this business.",
      },
    ],
    example: {
      label: "4,200 sq ft plus 14 steps, white oak, Vaughan",
      service: "install",
      sqft: 4200,
      stairs: 14,
      city: "vaughan",
    },
    relatedProjects: ["vaughan-new-build"],
    relatedMethods: ["nail-down-solid-hardwood"],
    relatedProblems: [],
    illustrative: false,
    testimonial: null,
  },
  {
    slug: "code-compliant-hardwood-railing",
    name: "Hardwood railing rebuilt to Ontario Building Code",
    seoTitle: "Hardwood Railing to Ontario Code",
    alsoCalled: [
      "hardwood railing Ontario building code",
      "graspable handrail",
      "stair railing replacement Toronto",
      "wobbly banister repair",
    ],
    serviceSlug: "hardwood-railings",
    category: "railings",
    summary:
      "Handrail, newels and balusters rebuilt in hardwood to Ontario Building Code thresholds for height, graspability and guard opening.",
    trigger:
      "A rail that moves when you lean on it, a flat decorative cap that cannot be gripped, or a renovation that has to satisfy a municipal inspector. Often discovered during a sale or an insurance review.",
    spec: [
      "Handrail height and guard height set to the Ontario Building Code thresholds published on this site",
      "A graspable profile — a flat cap is not a handrail regardless of how it looks",
      "Newel posts anchored to structure, not to finished tread material",
      "Baluster spacing to the guard-opening limit",
    ],
    sequence: [
      "Measure the existing flight against the code thresholds and write down every number.",
      "Locate structure for the newel anchors; add blocking where there is none.",
      "Set newels first, plumb and anchored, before any rail is cut.",
      "Cut and fit the rail to the graspable profile, continuous over the flight.",
      "Fit balusters to the opening limit and finish to match the treads.",
    ],
    failureModes: [
      {
        problem: "Newels anchored into tread material instead of structure",
        consequence:
          "The rail is solid on the day and loose within a year. This is the single most common reason a railing wobbles.",
        avoidedBy:
          "Finding or adding real structure and anchoring to it, before anything else is built.",
      },
      {
        problem: "A flat decorative cap specified as the handrail",
        consequence:
          "Not graspable, therefore not a compliant handrail, however expensive the timber. It fails inspection on permitted work and it fails the person who slips.",
        avoidedBy: "A profile that a hand can close around, checked against the code thresholds.",
      },
      {
        problem: "Baluster spacing set by eye",
        consequence:
          "Guard openings exceed the limit, which is the rule written specifically to protect small children.",
        avoidedBy:
          "Setting spacing from the published limit and measuring the widest gap, not the average.",
      },
    ],
    example: {
      label: "24 linear feet of rail, oak, Toronto",
      service: "railings",
      railingFt: 24,
      city: "toronto",
    },
    relatedProjects: [],
    relatedMethods: ["hardwood-railing-through-bolt"],
    relatedProblems: ["loose-stair-railing"],
    illustrative: false,
    testimonial: null,
  },
  {
    slug: "water-damage-board-replacement",
    name: "Water damage: board replacement and blend refinish",
    seoTitle: "Hardwood Water Damage Repair",
    alsoCalled: [
      "hardwood water damage repair",
      "replacing damaged hardwood boards",
      "dishwasher leak floor repair",
      "cupped floor repair Toronto",
    ],
    serviceSlug: "hardwood-repairs",
    category: "repair",
    summary:
      "Boards destroyed by a leak lifted and replaced, the floor dried to equilibrium, then blend-sanded so the repair disappears.",
    trigger:
      "A dishwasher, a fridge line, a radiator or a basement event. The floor is cupped or crowned across a defined area and the owner has usually been told the whole floor needs replacing. It usually does not.",
    spec: [
      "Moisture mapping before any board is cut — the wet area is always larger than the visible one",
      "Dry to equilibrium with the surrounding floor before replacement, not before drying is complete",
      "Replacement stock matched for species, grade, cut and width",
      "Blend sand across the repair boundary so there is no visible edge",
    ],
    sequence: [
      "Map moisture across the whole room and find the true boundary of the wet area.",
      "Establish and fix the source. Replacing boards over a live leak is money set on fire.",
      "Dry to equilibrium, measured, not assumed from how it looks.",
      "Lift and replace the destroyed boards with matched stock.",
      "Blend sand across the boundary and refinish the affected field.",
    ],
    failureModes: [
      {
        problem: "Replacing boards before the floor has dried to equilibrium",
        consequence:
          "The new boards move as the surrounding floor releases moisture. Gaps or cupping appear at the repair edge within a season, and the work is done twice.",
        avoidedBy: "Metering to equilibrium and waiting for the number, not for the schedule.",
      },
      {
        problem: "A repair patched in without blending the sand",
        consequence:
          "A visible rectangle in the middle of the floor, permanently. The repair is technically sound and cosmetically obvious.",
        avoidedBy: "Blend-sanding well past the repair boundary and refinishing the field.",
      },
      {
        problem: "Treating cupping as a sanding problem",
        consequence:
          "Sanding a cupped floor flat while it is still wet produces a crowned floor when it dries — a worse and less reversible defect.",
        avoidedBy: "Drying first, then assessing. Cupping frequently relaxes on its own.",
      },
    ],
    example: {
      label: "220 sq ft affected area, Etobicoke",
      service: "repair",
      sqft: 220,
      city: "etobicoke",
    },
    relatedProjects: ["mississauga-water"],
    relatedMethods: ["moisture-mapping-subfloor"],
    relatedProblems: ["hardwood-floor-cupping", "hardwood-floor-crowning"],
    illustrative: false,
    testimonial: null,
  },
  {
    slug: "commercial-overnight-install",
    name: "Commercial install on overnight shifts",
    seoTitle: "Commercial Install, Overnight",
    alsoCalled: [
      "restaurant hardwood floor",
      "commercial hardwood installation Toronto",
      "retail floor install after hours",
    ],
    serviceSlug: "commercial-hardwood",
    category: "commercial",
    summary:
      "Hardwood installed or refinished in a trading business across consecutive overnight shifts, with the space open for service each day.",
    trigger:
      "A restaurant, retail unit or office that cannot close. Every day dark is revenue gone, so the work is scheduled around trading hours rather than the other way round.",
    spec: [
      "Species and finish chosen for commercial traffic, not for a residential look book",
      "Finish with a cure window that fits between close and open",
      "Work sectioned so each shift ends in a servable state",
      "Containment that leaves no dust on a service surface",
    ],
    sequence: [
      "Agree the shift window and what 'servable' means to the operator, in writing.",
      "Section the floor so each night's work ends at a defensible boundary.",
      "Work the shift, contained, with the service areas protected.",
      "Hand back servable each morning, every morning.",
      "Final coat on the last shift, with the longest available cure window.",
    ],
    failureModes: [
      {
        problem: "A residential finish specified for a commercial floor",
        consequence:
          "It wears through in the traffic lane inside a year, and the recoat closes the business anyway — the exact outcome the overnight schedule was bought to avoid.",
        avoidedBy: "Specifying for the traffic the floor will actually take.",
      },
      {
        problem: "A cure window that does not fit between close and open",
        consequence:
          "Either service opens onto an uncured floor and marks it permanently, or the business loses the day it was promised it would not.",
        avoidedBy:
          "Choosing the product to the schedule, and being honest when the schedule will not take it.",
      },
      {
        problem: "Section boundaries chosen for the crew's convenience",
        consequence:
          "A hand-back that is technically finished but not servable, and an operator who cannot open.",
        avoidedBy:
          "Setting boundaries with the operator against their floor plan, before the first shift.",
      },
    ],
    example: {
      label: "1,600 sq ft white oak, Etobicoke",
      service: "install",
      sqft: 1600,
      city: "etobicoke",
    },
    relatedProjects: ["etobicoke-restaurant"],
    relatedMethods: [],
    relatedProblems: [],
    illustrative: false,
    testimonial: null,
  },
  {
    slug: "open-riser-feature-stair",
    name: "Open-riser feature stair",
    seoTitle: "Open-Riser Feature Stair",
    alsoCalled: [
      "floating stairs Toronto",
      "open riser staircase hardwood",
      "feature staircase design",
    ],
    serviceSlug: "hardwood-stairs",
    category: "stairs",
    summary:
      "A stair built as architecture rather than circulation — thick hardwood treads, no risers, and a guard designed to the code limits that open risers trigger.",
    trigger:
      "A renovation or new build where the stair is a designed object in a sightline. The aesthetic is simple; the code constraints are not, and they decide what is buildable before any drawing is worth having.",
    spec: [
      "Tread thickness engineered for span without a riser behind it",
      "Open-riser opening limit respected — this is what most open-stair designs fail on",
      "Structure designed with the stair, not concealed after it",
      "Guard and handrail designed as part of the object, to code thresholds",
    ],
    sequence: [
      "Establish the code envelope first: rise, run, opening limits, guard height.",
      "Design the tread section for span, then the structure that carries it.",
      "Confirm the design against the envelope before any material is ordered.",
      "Fabricate, dry-fit, and adjust in the shop rather than on site.",
      "Install, then build the guard and rail to the same drawing.",
    ],
    failureModes: [
      {
        problem: "Designing the look before checking the open-riser opening limit",
        consequence:
          "A drawing everyone has approved and nobody can build. The redesign lands after the client is emotionally committed to it.",
        avoidedBy: "Establishing the code envelope before the first sketch is shown.",
      },
      {
        problem: "Tread thickness chosen visually rather than for span",
        consequence:
          "Perceptible deflection underfoot on a stair sold as a feature. Irreparable without rebuilding.",
        avoidedBy: "Sizing the tread for the span, then adjusting the aesthetic within that.",
      },
      {
        problem: "Structure resolved after the stair is designed",
        consequence:
          "Visible supports added late, which is precisely the look an open stair was bought to avoid.",
        avoidedBy: "Designing stair and structure together from the start.",
      },
    ],
    example: {
      label: "15 treads, white oak, Oakville",
      service: "stairs",
      stairs: 15,
      city: "oakville",
    },
    relatedProjects: [],
    relatedMethods: ["open-riser-steel-and-oak"],
    relatedProblems: [],
    illustrative: true,
    testimonial: null,
  },
  {
    slug: "buff-and-recoat",
    name: "Buff and recoat, before a full sand is needed",
    seoTitle: "Buff and Recoat Hardwood Floors",
    alsoCalled: [
      "screen and recoat",
      "hardwood floor refresh",
      "recoat hardwood floors Toronto",
      "do I need to refinish my floors",
    ],
    serviceSlug: "sanding-refinishing",
    category: "refinish",
    summary:
      "The existing finish abraded and a fresh coat applied, without sanding to bare wood — the right answer far more often than a full refinish.",
    trigger:
      "A floor that looks tired but is not damaged: dull, micro-scratched in the traffic lanes, no grey, no black rings, no bare patches. Most homeowners in this position have been quoted a full refinish.",
    spec: [
      "Finish must be intact — any wear through to bare wood disqualifies a recoat",
      "Contaminant test before scheduling; a waxed or oiled floor will reject the new coat",
      "Compatible chemistry with the existing finish",
      "One day in, one day out, in most homes",
    ],
    sequence: [
      "Inspect for wear-through, greying and black staining. Any of those and the honest answer is a full sand.",
      "Test for contamination in a discreet area and let it cure.",
      "Abrade the existing finish thoroughly and evenly.",
      "Apply the compatible coat and cut in by hand at the edges.",
    ],
    failureModes: [
      {
        problem: "Recoating a floor with wear-through to bare wood",
        consequence:
          "The bare areas absorb differently and stay visible under the new coat. The full sand still has to happen, and the recoat has been wasted.",
        avoidedBy: "Inspecting honestly and declining the recoat when the floor needs a sand.",
      },
      {
        problem: "Skipping the contaminant test on a floor that has been waxed or oiled",
        consequence:
          "The new coat will not bond. It peels in sheets, and removing a failed coat costs more than the original job.",
        avoidedBy: "A test patch, left to cure, before anything is scheduled.",
      },
      {
        problem: "Selling a full refinish to a floor that only needed a recoat",
        consequence:
          "Thousands of dollars spent, and a non-renewable millimetre of wear layer gone forever.",
        avoidedBy: "Recommending the smaller job when the smaller job is correct.",
      },
    ],
    example: {
      label: "1,200 sq ft recoat, Mississauga",
      service: "refinish",
      sqft: 1200,
      city: "mississauga",
    },
    relatedProjects: [],
    relatedMethods: [],
    relatedProblems: [],
    illustrative: false,
    testimonial: null,
  },
  {
    slug: "winter-gap-and-movement",
    name: "Winter gapping and seasonal movement",
    seoTitle: "Winter Gaps in Hardwood Floors",
    alsoCalled: [
      "gaps in hardwood floor winter",
      "hardwood floor gaps closing summer",
      "hardwood shrinkage Toronto winter",
    ],
    serviceSlug: "hardwood-repairs",
    category: "repair",
    summary:
      "Assessment of seasonal gapping to separate normal winter movement — which needs no work at all — from a genuine installation or humidity fault.",
    trigger:
      "Gaps appear between boards every January and close again by June. Toronto's indoor relative humidity swings hard across the year, and most of what this produces is normal. Some of it is not.",
    spec: [
      "Measure gap width at several points and record the indoor relative humidity with it",
      "Compare against the species' expected seasonal movement for the board width",
      "Distinguish uniform gapping (normal) from isolated wide gaps (a fault)",
      "Humidity management recommended before any carpentry is quoted",
    ],
    sequence: [
      "Measure indoor RH and gap width together, in winter.",
      "Compare against expected movement for that species and board width.",
      "If it is within range, say so and recommend humidity control. Quote nothing.",
      "If it is outside range, or isolated, investigate fastening, subfloor moisture or the original acclimation.",
    ],
    failureModes: [
      {
        problem: "Filling normal winter gaps",
        consequence:
          "The filler is compressed when the boards expand in summer and pushed out or cracked. It has to be removed, and it may have damaged the board edges.",
        avoidedBy: "Identifying normal seasonal movement and leaving it alone.",
      },
      {
        problem: "Diagnosing gapping without measuring humidity",
        consequence:
          "A carpentry solution sold for a climate-control problem. The gaps come back the following winter regardless.",
        avoidedBy:
          "Recording RH with every gap measurement. The two numbers only mean something together.",
      },
      {
        problem: "Treating one wide isolated gap as seasonal",
        consequence:
          "A real fault — fastening failure, subfloor moisture, or a board that was never acclimated — is left to get worse.",
        avoidedBy: "Distinguishing uniform gapping across the field from an isolated one.",
      },
    ],
    example: {
      label: "Assessment, 900 sq ft, North York",
      service: "repair",
      sqft: 900,
      city: "north-york",
    },
    relatedProjects: [],
    relatedMethods: ["moisture-mapping-subfloor"],
    relatedProblems: ["gaps-in-hardwood-floor-winter"],
    illustrative: false,
    testimonial: null,
  },
  {
    slug: "ipe-class-deck",
    name: "Ipe-class hardwood deck",
    seoTitle: "Ipe Hardwood Deck",
    alsoCalled: ["ipe deck Toronto", "hardwood deck installation GTA", "exotic hardwood decking"],
    serviceSlug: "hardwood-decks",
    category: "deck",
    summary:
      "Exterior deck in a dense tropical hardwood, detailed for Ontario's freeze-thaw cycle and fastened so the boards can move without splitting.",
    trigger:
      "A deck rebuild where the owner wants a material that will outlast pressure-treated softwood and is prepared to pay for it. The species is the easy decision; the detailing is what decides whether it lasts.",
    spec: [
      "Dense tropical hardwood, ipe or equivalent — pre-drilled at every fastener without exception",
      "Hidden fasteners or stainless, sized for movement",
      "Ventilated substructure with drainage designed in",
      "Ends sealed on every cut before installation",
    ],
    sequence: [
      "Assess and correct the substructure; the boards will outlast it otherwise.",
      "Design drainage and ventilation before laying anything.",
      "Pre-drill every fastener point. Ipe splits without it, every time.",
      "Seal every cut end as it is made, not at the end of the day.",
      "Fasten for movement, and set the gap for the season it is being installed in.",
    ],
    failureModes: [
      {
        problem: "Fastening ipe without pre-drilling",
        consequence:
          "Split boards at the ends, immediately and permanently, in the most expensive material on the job.",
        avoidedBy: "Pre-drilling every hole. There is no exception to this.",
      },
      {
        problem: "Cut ends left unsealed",
        consequence: "Checking and splitting at the end grain through the first freeze-thaw cycle.",
        avoidedBy: "Sealing each cut as it is made.",
      },
      {
        problem: "Board gap set without regard to the season of installation",
        consequence:
          "A deck laid tight in a dry winter buckles in July; one laid wide in a wet summer gaps badly in January.",
        avoidedBy:
          "Setting the gap for the moisture content at installation, against the seasonal range.",
      },
    ],
    example: {
      label: "420 sq ft ipe deck, Burlington",
      service: "deck",
      sqft: 420,
      city: "burlington",
    },
    relatedProjects: ["high-park-deck"],
    relatedMethods: [],
    relatedProblems: [],
    illustrative: false,
    testimonial: null,
  },
];

/** The published band for an entry, read from data/services.ts. Never restated. */
export function bandFor(entry: CatalogEntry): string {
  return getService(entry.serviceSlug)?.priceFrom ?? "";
}

/**
 * The worked example, computed rather than typed.
 *
 * `tests/catalog.test.ts` asserts these are produced by `calculateEstimate`,
 * so an entry cannot quietly acquire a number nobody can reproduce.
 */
export function exampleFor(entry: CatalogEntry) {
  const input: EstimateInput = { ...emptyEstimate(), ...entry.example };
  return { label: entry.example.label, ...calculateEstimate(input) };
}

export function getCatalogEntry(slug: string) {
  return catalog.find((c) => c.slug === slug);
}

export function catalogByCategory(category: CatalogEntry["category"]) {
  return catalog.filter((c) => c.category === category);
}

/** Entries with a real, permissioned testimonial attached. Empty today. */
export const catalogWithTestimonials = catalog.filter((c) => c.testimonial !== null);
