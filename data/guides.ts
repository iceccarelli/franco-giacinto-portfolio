import { guideExpansions } from "./guides-expansion";
import { calculateEstimate, cityMult, type EstimateInput } from "./estimate";
import { OBC_LIMITS } from "./obc";

/**
 * A worked example in a guide must come from the same estimator that prices
 * real jobs, or the two will drift and an answer engine will quote whichever
 * it read first. This scans every city multiplier so the band honestly spans
 * "in the GTA" rather than silently assuming Toronto.
 *
 * The bug this replaces: the cost guide said a 1,000 sq ft site-finished
 * white-oak main floor "lands around $13,000–$18,000" while /estimate computed
 * $16,900–$24,000 for the identical job. Same site, two answers.
 */
function gtaBand(input: Omit<EstimateInput, "city">) {
  let low = Infinity;
  let high = 0;
  for (const city of Object.keys(cityMult)) {
    const r = calculateEstimate({ ...input, city });
    low = Math.min(low, r.low);
    high = Math.max(high, r.high);
  }
  return { low, high };
}

const stairFlightRaw = gtaBand({
  service: "stairs",
  sqft: 0,
  species: "white-oak",
  pattern: "straight",
  finish: "matte",
  stairs: 13,
  railingFt: 0,
});

const cadRounded = (n: number) => `$${(Math.round(n / 100) * 100).toLocaleString("en-CA")}`;

/**
 * A 13-step flight, banded across every city multiplier. Typed as a literal
 * until now, which is how the carpet-to-hardwood guide came to quote a range
 * the estimator did not agree with.
 */
const stairFlightExample = {
  low: cadRounded(stairFlightRaw.low),
  high: cadRounded(stairFlightRaw.high),
};

const mainFloorExample = gtaBand({
  service: "install",
  sqft: 1000,
  species: "white-oak",
  pattern: "straight",
  finish: "matte",
  stairs: 0,
  railingFt: 0,
});

export type Guide = {
  slug: string;
  title: string;
  description: string;
  kicker: string;
  read: string;
  /** Display form shown on the page, e.g. "August 2026". */
  updated: string;
  /**
   * Optional exact revision date, ISO 8601. Set this when a guide is edited on
   * a known day; otherwise `updatedDate()` derives the first of the month named
   * in `updated`, which is the conservative reading of what the page claims.
   */
  updatedOn?: string;
  sections: { heading: string; paragraphs: string[] }[];
};

const coreGuides: Guide[] = [
  {
    slug: "hardwood-flooring-cost-gta-2026",
    title: "Hardwood flooring cost in the GTA, 2026",
    description:
      "Real 2026 price ranges for hardwood installation, refinishing, stairs, and railings in Toronto and the Greater Toronto Area — and what actually moves the number.",
    kicker: "Pricing",
    read: "8 min",
    updated: "August 2026",
    sections: [
      {
        heading: "The short version",
        paragraphs: [
          `In the Greater Toronto Area in 2026, most homeowners should budget $11–$22 per square foot for a hardwood install (material + labour) and $4.50–$8.50 per square foot for a professional dust-contained refinish. Stairs are $380–$850 per step. Railings are $180–$420 per linear foot. A typical 1,000 sq ft main floor in white oak, straight lay, site-finished, lands around ${cadRounded(mainFloorExample.low)}–${cadRounded(mainFloorExample.high)} before HST and before the stair — the estimator computes the same number, city by city.`,
          "Anyone quoting $6/sq ft installed for solid oak in Toronto is either omitting material, omitting prep, or omitting the truth. Anyone quoting $40/sq ft for a straight white-oak field without herringbone or walnut is testing whether you will pay for atmosphere.",
        ],
      },
      {
        heading: "What moves the number",
        paragraphs: [
          'Species: white oak is the market; walnut is a premium; maple is mid-material but harder labour because it shows mistakes. Pattern: herringbone and chevron add 40–55% labour. Subfloor: a 3/8" hog in a 1920s house is a flattening job, not a flooring job. Access: a third-floor walk-up in Little Italy is not a Vaughan garage-to-foyer carry.',
          "Finish: prefinished is faster and slightly cheaper. Site-finished two-component waterborne is the better floor in a family house. Hardwax oil is a look and a maintenance contract.",
        ],
      },
      {
        heading: "Stairs and railings are not 'extra trim'",
        paragraphs: [
          "The #1 budget shock in GTA quotes is the stair. A 13-step flight with returned treads and a proper rail can rival a whole-floor refinish. If your flooring company says 'we'll figure out the stairs later,' they are not a stair company. Green Hardwood prices the floor, the treads, and the rail as one system because that is how the house is used.",
        ],
      },
      {
        heading: "How to use a range without getting burned",
        paragraphs: [
          "Use an estimator to see if the project is $8,000 or $28,000. Then pay for a site visit — moisture, flatness, stair structure, condo rules. A firm number without those readings is a marketing number. Ours is not.",
        ],
      },

      {
        heading: "What a real quote contains",
        paragraphs: [
          "A quote for a floor should name the species and cut, the finish system by type, the fastening assembly, the subfloor preparation allowance, and what happens if moisture readings come back outside limits. A quote that lists a square-foot rate and a total is a price for boards, not a price for a floor.",
          "Three numbers that look comparable are frequently three different assemblies. The cheapest is usually the one that has moved the subfloor work off the page and onto your invoice later.",
        ],
      },
      {
        heading: "Where the money actually goes",
        paragraphs: [
          "On a typical install, labour and preparation are the larger share, not the wood. That is counterintuitive to most homeowners, who shop species first, and it is why upgrading from red oak to white oak changes the total far less than a herringbone layout or a floor that has to be flattened.",
          "The variables with real leverage, roughly in order: pattern, subfloor condition, finish system, access, and only then species. Access is the one nobody prices mentally \u2014 a third-floor walk-up in Little Italy is not a Vaughan garage-to-foyer carry, and it is a real line.",
        ],
      },
      {
        heading: "Why your city changes the number",
        paragraphs: [
          "Every municipality on this site carries its own labour, access and travel multiplier, and the bands on each city page are computed with it rather than being a Toronto number with a place name attached. Barrie is not Brampton, and the drive is a genuine cost rather than a rounding.",
          "Use the estimator with your own city and job, then treat a site measure as the thing that produces a firm number. Nobody can hold a price before reading moisture.",
        ],
      },
      {
        heading: "The quotes to walk away from",
        paragraphs: [
          "A firm stair price given over the phone, because the first and last risers decide whether the job is a retread at all. A hardwood price with no subfloor line. A floating floor proposed over hydronic radiant. Solid 3/4-inch proposed over a slab. Any quote where the word 'dustless' appears without a description of containment.",
          "None of these are close calls and all of them are common, which is the uncomfortable part — they are not the marks of a cowboy operation, they are what a busy company does when it is quoting quickly and hoping the job is straightforward.",
        ],
      },
    ],

  },
  {
    slug: "solid-vs-engineered-ontario",
    title: "Solid vs engineered hardwood in Ontario",
    description:
      "Which hardwood assembly survives Ontario humidity, condos, radiant heat, and a 20-year refinishing plan.",
    kicker: "Specification",
    read: "7 min",
    updated: "August 2026",
    sections: [
      {
        heading: "Ontario is a humidity machine",
        paragraphs: [
          "Houses here go from about 20 percent indoor relative humidity in January to 60 percent in July if nobody runs a humidifier. Solid hardwood moves. Engineered hardwood moves less. That is physics, not a sales pitch. The wrong response is 'always engineered.' The right response is: what is under the floor, and how many times do you plan to sand it?",
        ],
      },
      {
        heading: "What the two things actually are",
        paragraphs: [
          "Solid is one piece of hardwood, typically 3/4 inch, that moves as a single body across its width. Engineered is a hardwood wear layer over a cross-laminated core, and the core's opposing grain directions are what resist that movement.",
          "The number that matters on engineered is the wear layer, not the total thickness. A 4 mm wear layer can be sanded two or three times over a long life. A 2 mm layer can take one careful sand. A 0.6 mm photographic veneer cannot be sanded at all \u2014 that is a laminate with better lighting in the showroom.",
          "Core quality matters nearly as much. A multi-ply birch or poplar core is a different product from an HDF core, particularly anywhere moisture is possible.",
        ],
      },
      {
        heading: "Choose solid when",
        paragraphs: [
          "You have a dry wood-framed subfloor above grade, you want a 3/4\" wear life you can sand several times over decades, and you are willing to keep indoor humidity in a civilised range \u2014 ideally 35 to 55 percent. Forest Hill, High Park, the Kingsway, southeast Oakville wood-frame houses: this is still the correct luxury spec.",
          "Solid also holds its value in a way engineered does not, because a buyer's inspector can see it is solid and knows it has life left. In the houses where that matters, it matters.",
        ],
      },
      {
        heading: "Choose engineered when",
        paragraphs: [
          "Concrete slab, below grade, hydronic radiant, or a condo. Also anywhere you want a plank wider than about 5 inches, because width multiplies seasonal movement and engineered is what makes wide plank behave.",
          "Demand a real wear layer \u2014 3 mm or more if you want a future refinish \u2014 and an adhesive or click system the mill will actually warrant for your assembly. Get the warranty language before you buy, not after.",
        ],
      },
      {
        heading: "The decision is usually made for you",
        paragraphs: [
          "In practice the subfloor decides. Slab means engineered. Radiant means engineered, glued. A dry wood subfloor above grade with a narrow-to-medium plank means solid is available and generally preferable.",
          "Where there is a genuine choice, the question to answer is how long you intend to own the house. Solid is the better thirty-year floor. Over ten years, in a condo, engineered is not a compromise \u2014 it is the correct specification.",
        ],
      },
    ],
  },
  {
    slug: "ontario-stair-code-hardwood",
    title: "Hardwood stairs and Ontario Building Code",
    description:
      "Rise, run, nosing, graspable handrails, and guards — the code details that get beautiful GTA stairs failed at inspection.",
    kicker: "Stairs",
    read: "6 min",
    updated: "August 2026",
    sections: [
      {
        heading: "Pretty is not the test",
        paragraphs: [
          "Ontario Building Code Part 9 governs most houses. Rise and run must be uniform. Nosing projection is limited. Guards have a height. Handrails must be graspable. A 2x6 cap with no fingers-around profile will fail. A rail mounted on the wrong side of a winders flight will fail. Draw the stair to pass, then make it beautiful.",
        ],
      },
      {
        heading: "The numbers, and where they interact",
        paragraphs: [
          `Rise must not exceed ${OBC_LIMITS.maxRiseMm} mm on a stair serving a dwelling unit. Run must be at least ${OBC_LIMITS.minRunMm} mm. Tread depth — run plus nosing projection, not run alone — must be at least ${OBC_LIMITS.minTreadMm} mm, and the nosing itself may project no more than ${OBC_LIMITS.maxNosingMm} mm.`,
          `Where a flight has ${OBC_LIMITS.handrailRiserTrigger} or more risers a handrail is required, between ${OBC_LIMITS.handrailMinMm} mm and ${OBC_LIMITS.handrailMaxMm} mm above the nosing line, with a circular profile graspable between ${OBC_LIMITS.graspMinMm} mm and ${OBC_LIMITS.graspMaxMm} mm in diameter. Guards at the side of a dwelling stair are at least ${OBC_LIMITS.minGuardMm} mm from the nosing line.`,
          "These interact, which is what people miss. A retread adds thickness to every tread, which does not change the rises in the middle of the flight but does change the first and last ones \u2014 and the finished floor heights at the top and bottom change them again. Those two risers are where most conversions go out of tolerance.",
          "The stair studio on this site checks a flight against these limits. It will not certify your stair \u2014 no tool can, and a building official is the only authority \u2014 but it will tell you which dimension is the problem before anyone quotes.",
        ],
      },
      {
        heading: "Uniformity is a rule, not a preference",
        paragraphs: [
          "A flight where every riser is inside the limit but one is noticeably taller than its neighbours is still a flight people trip on, and the variation between the tallest and the shortest in a run is itself limited.",
          "This is the reason a stair quote should follow a measurement of every riser, not a step count over the phone. In a house from the 1950s, stringers cut by eye are common and the answer is sometimes that the flight cannot be retreaded and needs rebuilding.",
        ],
      },
      {
        heading: "The conversions that go wrong",
        paragraphs: [
          "Carpet to oak on an open-side stair needs returned treads, not a leftover plank glued to drywall. Mixing a 3/4\" floor with a 5/8\" tread without a proper nosing creates a trip. We see both weekly in new builds from Milton to Markham.",
          "The other common one is the rail. Once a stair is altered, the argument that the old railing was compliant when the house was built gets thin \u2014 and a rail that was never graspable was never compliant anyway.",
        ],
      },
      {
        heading: "Railings are structural",
        paragraphs: [
          "A newel that is only trimmed on is a future service call. Through-bolt newels into structure. If that is not possible, rebuild the landing until it is. That is the difference between a railing and furniture.",
          "A guard has to resist a real lateral load \u2014 someone falling against it, not leaning on it. Fixing it to drywall and hoping is the failure mode that matters, because it fails at the moment it is needed.",
        ],
      },
    ],
  },
  {
    slug: "dust-free-sanding-toronto",
    title: "Dust-contained sanding in occupied Toronto homes",
    description:
      "What 'dustless' sanding actually means, how long you are out of the room, and how to refinish a condo without becoming a problem on the floor WhatsApp.",
    kicker: "Refinishing",
    read: "5 min",
    updated: "August 2026",
    sections: [
      {
        heading: "The honest word is contained, not dustless",
        paragraphs: [
          "A professional system captures the vast majority of airborne dust at the machine and with room sealing. It does not rewrite physics. If a company promises zero dust they are selling you a word. If they show you containment, negative air, and a grit sequence, they are selling you a floor.",
          "What containment actually looks like: the sanders vented to a HEPA-filtered vacuum outside the working area, zip walls at the openings with a negative-pressure fan so air moves into the work zone rather than out of it, HVAC returns in the area sealed so the furnace does not distribute dust through the whole house, and a final clean before any finish goes down.",
        ],
      },
      {
        heading: "The grit sequence is the job",
        paragraphs: [
          "Sanding is a sequence, and skipping a grit is the most common corner cut in the trade. Each grit removes the scratch pattern of the one before it. Jumping from a coarse cut straight to a fine one leaves deeper scratches that the fine paper polishes rather than removes \u2014 invisible on bare wood, and glaringly visible the moment stain goes on, because pigment collects in the scratch.",
          "Ask what the sequence is. A shop that answers immediately has one. A shop that says 'we sand it properly' does not.",
        ],
      },
      {
        heading: "Finish decides how long you are out of the house",
        paragraphs: [
          "Two-component waterborne systems are where most GTA site-finishing has landed: low odour, fast cure, no ambering. Typical practice is sock traffic in about 24 hours, furniture back after a few days, and rugs down last \u2014 rugs trap solvent and can print into a finish that is still curing.",
          "Oil-modified polyurethane smells strongly for days and ambers over time. Hardwax oil is low odour and repairable but wants a maintenance habit. The cure schedule should be in writing, because it is what determines whether you can sleep in the house.",
        ],
      },
      {
        heading: "Condos",
        paragraphs: [
          "Elevator pads, quiet hours, a written cure schedule, and a finish low-odour enough for an occupied building with shared corridor air. Most boards want a certificate of insurance and a booked service elevator before anything arrives.",
          "You can usually sleep in the unit. You cannot throw a dinner party on night two, and anyone who tells you otherwise has not lived with a curing floor.",
        ],
      },
      {
        heading: "Occupied houses with pets and children",
        paragraphs: [
          "Containment is what makes an occupied refinish possible at all. In practice it means working room by room rather than opening the whole floor, sealing the work zone at the end of each day, and being explicit about which rooms are usable that night.",
          "Cats are the hard case. A cat that gets onto a curing finish will leave prints that only sanding removes, and cats are extremely motivated to enter the one room they have been shut out of.",
        ],
      },
    ],
  },
  {
    slug: "best-hardwood-species-toronto-homes",
    title: "Best hardwood species for Toronto homes",
    description:
      "White oak, red oak, walnut, maple, and hickory — which one belongs in a High Park semi versus a Vaughan foyer versus a King West condo.",
    kicker: "Materials",
    read: "6 min",
    updated: "August 2026",
    sections: [
      {
        heading: "White oak is the default, and that is fine",
        paragraphs: [
          "It takes the grey and walnut stains people want, it is hard enough, and buyers in the GTA currently treat it as the 'real floor' signal. Rift and quartered if you want quiet, linear grain. Plain sawn if you want cathedral figure and a better price.",
          "Cut matters more than most people are told. Rift and quartered oak is more dimensionally stable across its width than plain sawn, which is why it is worth the premium on a wide plank or over radiant, and why it takes stain more evenly with less blotching.",
        ],
      },
      {
        heading: "Do not rip out good red oak",
        paragraphs: [
          "Half the 1990s houses in North York and Mississauga are sitting on perfectly refinishable red oak. Fashion is not a reason to send it to landfill. Tone it, change the sheen, keep the wear layer.",
          "Red oak takes a cool or grey stain badly \u2014 its natural pink fights the pigment and the result goes muddy. It takes a warm or neutral tone beautifully. If the look you want is grey, the honest answer is that red oak is the wrong substrate for it, not that you need a better stain.",
        ],
      },
      {
        heading: "Hardness is the least useful number",
        paragraphs: [
          "Janka ratings get quoted constantly and predict very little about how a floor looks after five years. What actually shows wear is the finish, and after that the grain: an open, busy grain hides dents that a smooth, uniform one displays.",
          "This is why hard maple disappoints people. It is harder than oak and looks worse sooner, because its tight, featureless grain shows every mark and it blotches under stain. It is a beautiful natural floor and a difficult stained one.",
        ],
      },
      {
        heading: "Walnut, maple, hickory",
        paragraphs: [
          "Walnut is softer and more expensive \u2014 use it where you will see it and not where the dog turns the corner at speed. Stairs and dining rooms, generally. It also lightens with UV rather than darkening, which surprises people.",
          "Maple is harder and shows everything; specify it natural or very lightly toned. Hickory is the dog floor: extremely hard, wildly variable in colour, and forgiving of abuse in a way nothing else on this list is. Ash is underrated and hides scuffs better than walnut in a commercial room.",
          "Engineered oak is the condo and radiant floor. We spec; we do not upsell the mill that is paying for lunch.",
        ],
      },
      {
        heading: "Sample in the room, not in the showroom",
        paragraphs: [
          "Every species reads differently under a north-facing Toronto window in November than under showroom lighting. Get sample boards of the actual species with the actual finish, put them on the actual floor, and look at them at the hour you use the room.",
          "Look at them for a few days. The floor you are choosing will be there for thirty years, and the decision is worth more than one afternoon under fluorescent light.",
        ],
      },
    ],
  },
  {
    slug: "hardwood-vs-vinyl-gta",
    title: "Hardwood vs vinyl in the GTA",
    description:
      "When a Toronto house should get real hardwood — and the few jobs where vinyl plank is the grown-up answer. Stairs, resale, water, and 20-year cost.",
    kicker: "Decide",
    read: "7 min",
    updated: "August 2026",
    sections: [
      {
        heading: "The honest split",
        paragraphs: [
          "Hardwood is a floor you can sand, stain, and keep. Vinyl is a photograph of a floor with a wear layer measured in mils. Laminate is a photograph on fibreboard. Those are not three flavours of the same product. They are three products, and only one of them belongs on a stair you will photograph for a listing.",
          "Green Hardwood does not install vinyl. That is why this page can tell you when vinyl is smarter: rental basements, true wet rooms, and budgets that cannot take oak. If that is your job, buy good vinyl from a retailer. Do not hire us to pretend otherwise.",
        ],
      },
      {
        heading: "Where vinyl genuinely wins",
        paragraphs: [
          "Below grade, where a slab can push moisture for decades. Laundry rooms and bathrooms where standing water is a matter of when. Rental units where the floor needs to survive tenants and be replaced cheaply rather than maintained. Basements with a history of even minor water.",
          "In those rooms a good rigid-core vinyl is not a compromise, it is the correct product, and specifying oak there would be us taking your money for a floor that will fail.",
        ],
      },
      {
        heading: "Where the comparison is sold dishonestly",
        paragraphs: [
          "'Waterproof' is the word doing the most work in vinyl marketing. The plank is waterproof; the assembly is not. Water that gets through the seams sits on the subfloor underneath, and a subfloor that stays wet is a mould problem you cannot see because it is under a waterproof lid.",
          "'Scratch resistant' is the other one. Vinyl wear layers scratch, and unlike a wood floor there is no repair \u2014 you cannot sand a photograph. A scratched vinyl floor is a replaced vinyl floor.",
          "The lifespan comparison is where the money actually is. A vinyl floor is a fifteen-year product with a replacement at the end. A solid oak floor sanded three times over its life is a fifty-year product with recoats in between. Compared over the life of a house they are not close, which is a different question from what you can afford this year.",
        ],
      },
      {
        heading: "Resale in Toronto",
        paragraphs: [
          "Buyers in Forest Hill, Rosedale, the Kingsway and southeast Oakville still stop on a real oak floor. Vinyl in those houses reads as a concession. Vinyl in a basement suite reads as competent. Know which house you have.",
          "In the middle of the market it matters less than agents claim \u2014 but the stair is the exception, because it is the one surface a buyer touches.",
        ],
      },
      {
        heading: "Stairs decide the argument",
        paragraphs: [
          "Vinyl on a stair is a slip. Laminate on a stair is a lawsuit waiting for a toddler. Neither takes a proper nosing, and the nosing is the part of a stair that has to be right.",
          "If the flight is in the scope, you are in hardwood territory \u2014 treads, nosings, and a rail that can pass the Ontario Building Code. That is our whole business.",
        ],
      },
    ],
  },
  {
    slug: "carpet-to-hardwood-stairs-gta",
    title: "Carpet to hardwood stairs in the GTA",
    description:
      "How to convert builder-grade carpeted stairs to solid oak or walnut treads in Vaughan, Markham, Milton, and the rest of the Greater Toronto Area.",
    kicker: "Stairs",
    read: "6 min",
    updated: "August 2026",
    sections: [
      {
        heading: "The most requested job of 2026",
        paragraphs: [
          "New builds from Vaughan to Milton still ship with carpet on the stairs and a laminate or cheap engineered floor in the field. The first winter, the carpet looks like a rental. We pull it, inspect the stringers, sister anything that flexes, and install solid treads with returned ends on the open side.",
          "It is the highest-return interior change available in most of those houses, because the flight sits in the sightline from the front door and nothing else in the hall competes with it.",
        ],
      },
      {
        heading: "What is actually under the carpet",
        paragraphs: [
          "Usually a plywood or MDF tread that was never meant to be seen, a pine or poplar riser, and a few hundred staples. That is not a defect \u2014 it was specified to be finished later.",
          "The good news is that a factory-cut flight in a 2010s house is generally square and consistent, which makes a retread predictable. A 1926 Toronto flight cut by eye is a different proposition, and that is why every riser gets measured before anything is quoted.",
        ],
      },
      {
        heading: "What goes wrong when you hire a floor guy",
        paragraphs: [
          "A leftover plank glued to drywall on the open side. A 5/8\" tread next to a 3/4\" floor. A rail that is furniture, not structure. The inspector fails the nosing. The stain does not match. This is not a flooring accessory. It is millwork.",
          "The nosing is the specific failure. A retread cap sitting on top of the old tread wants to hang further than the code allows, and letting it is the fastest route to a failed inspection. Removing the original nosing so the new tread beds flat is the step that separates a stair job from a covering job.",
        ],
      },
      {
        heading: "What it costs",
        paragraphs: [
          `A standard 13-step flight with oak treads, wood or painted risers and a matching nosing typically runs ${stairFlightExample.low}–${stairFlightExample.high} installed in 2026 across the GTA — computed from the same estimator that prices every other job on this site, so it cannot drift from what you will actually be quoted.`,
          "Custom walnut, curved flights, winders and iron balusters move that number up. Railings are quoted as a system, not an extra, because the rail is frequently a bigger share of the work than the treads.",
          "Your own city carries its own labour and travel multiplier. Use the estimator with your step count and municipality rather than assuming a Toronto number applies in Barrie.",
        ],
      },
      {
        heading: "Sequence it with the floors",
        paragraphs: [
          "If the main floor is being installed or refinished as part of the work, do the stair in the same visit. The first and last risers depend on the finished floor heights at both ends, and the finish only matches if it is applied to both from the same batch on the same day.",
          "Doing the floor in spring and the stair in autumn guarantees a visible difference, and it is the single most common reason a stair and a floor do not match in an otherwise well-built house.",
        ],
      },
    ],
  },
  {
    slug: "water-damaged-hardwood-toronto",
    title: "Water-damaged hardwood in Toronto",
    description:
      "What to do after a leak, dishwasher failure, or ice-maker line on a hardwood floor — moisture readings, board replacement, and when the floor is actually finished.",
    kicker: "Repairs",
    read: "5 min",
    updated: "August 2026",
    sections: [
      {
        heading: "The first six hours decide most of it",
        paragraphs: [
          "Stop the water. Lift rugs and anything holding moisture against the boards. Get air moving across the floor, not blowing at one spot. Do not put heat on it \u2014 drying the top faster than the bottom is what turns a wet floor into a cupped one.",
          "Do not rent a drum sander at 9 p.m. Sanding a wet floor is how you buy it twice: the boards are swollen, you sand the crowns flat, and when they dry you have a floor that is thin in exactly the places that will move again.",
        ],
      },
      {
        heading: "Cupping is not always death",
        paragraphs: [
          "Cupping means the underside of each board is wetter than the top \u2014 the edges rise. It is a symptom of a moisture gradient, and gradients can reverse. If the boards are still fastened, the tongues are intact, and the source is stopped, a cupped floor will often flatten as it dries and then sand and refinish normally.",
          "Crowning is the opposite \u2014 the middle high, the edges low \u2014 and it usually means someone sanded a cupped floor before it dried. That one is expensive.",
          "The boards that come out are the ones where the tongue has broken, an engineered wear layer has delaminated, or the board has moved off the fastener. We tell you which, with readings, before we quote.",
        ],
      },
      {
        heading: "Drying is measured, not guessed",
        paragraphs: [
          "The floor is dry when the meter says so and the numbers have stopped moving over several days \u2014 not when it looks dry. That usually means readings at the flooring, the subfloor and, in a basement or a condo, the slab.",
          "Rushing this is the most common way a restoration fails twice. A floor sanded at 12 percent moisture content and finished will keep drying under its new finish, and it will shrink and gap while it does.",
        ],
      },
      {
        heading: "Insurance, plainly",
        paragraphs: [
          "Most GTA policies cover sudden discharge \u2014 a supply line, a dishwasher, a burst pipe \u2014 and exclude long-term seepage. The distinction is in the documentation, which means photographs and moisture readings from the first visit, dated.",
          "Adjusters routinely approve a patch where the floor needs a room. A patch is a defensible repair when the damaged area is bounded and the surrounding floor is sound; it is not defensible when it will leave a visible island in the middle of an open plan. Both positions can be argued with readings and neither can be argued with opinions.",
          "We write the paperwork either way and we do not inflate a claim. That is not generosity \u2014 it is the only way to keep doing insurance work.",
        ],
      },
      {
        heading: "Matching an older floor",
        paragraphs: [
          "A fifteen-year-old red oak floor is not the same colour as new red oak, because oak ambers with light. Sourcing same-era material and blending the refinish across a whole room, rather than stopping at the damaged patch, is what makes the repair disappear.",
          "That is why the honest quote for a kitchen leak is often 'the kitchen', not 'the four square feet by the dishwasher'.",
        ],
      },
    ],
  },
  {
    slug: "hardwood-floor-maintenance-ontario",
    title: "Hardwood floor maintenance in Ontario",
    description:
      "Humidity, cleaning, and recoat schedules for hardwood floors and stairs that have to survive a GTA winter and a GTA summer.",
    kicker: "Care",
    read: "5 min",
    updated: "August 2026",
    sections: [
      {
        heading: "35 to 55 percent",
        paragraphs: [
          "That is the relative humidity band a hardwood floor wants. Ontario houses routinely miss both ends. A humidifier in January is cheaper than a refinish in April. Gaps in February are not a defect if the house is at 18 percent. They are physics.",
          "A cheap hygrometer in the main living space is the single most useful thing a hardwood owner can buy. It turns an argument about whether a floor is faulty into a reading anyone can check, and it tells you when to run the humidifier rather than guessing.",
        ],
      },
      {
        heading: "What actually wears a floor out",
        paragraphs: [
          "Grit. Not heels, not dogs, not furniture \u2014 grit tracked in on shoes, which is sandpaper being walked across a finish. A mat at every exterior door and a habit of taking shoes off does more for a floor's life than any product sold to protect it.",
          "After grit, the two big ones are UV and water. UV ambers oak unevenly, so a rug left in one place for five years leaves a shadow that only sanding removes \u2014 rotate rugs occasionally. Water sits in the seams at the dishwasher, the fridge line and the back door, which is where nearly every failure we are called to starts.",
        ],
      },
      {
        heading: "Cleaning, briefly",
        paragraphs: [
          "Dry first: sweep or vacuum with a hard-floor head. Then a barely damp microfibre with a cleaner made for the finish on your floor. That is the whole method.",
          "Steam mops are not cleaning. They are a slow flood with a warranty exclusion attached, and most finish manufacturers say so explicitly. Vinegar and water is a folk remedy that dulls a waterborne finish over time. Oil soaps leave a residue that stops the next recoat bonding, which is a problem you discover years later when the recoat peels.",
        ],
      },
      {
        heading: "Recoat before you sand",
        paragraphs: [
          "A screen-and-recoat every four to eight years in a family house keeps the wear layer you already paid for. It is abrading the finish and adding a fresh coat, not touching the wood \u2014 a day's work rather than a week's, at a fraction of the cost, with no dust of consequence.",
          "The window matters. Once traffic lanes have worn through the finish into bare wood, a recoat cannot fix it and the floor needs a full sand. The tell is a dulled path that stays dull after cleaning, usually from the back door to the kitchen. That is the moment to book a recoat, not to wait another year.",
          "A full sand is for colour changes and for floors whose finish is genuinely gone. Solid hardwood has a limited number of sands in it; spending one on something a recoat would have solved is spending wear life you cannot get back.",
        ],
      },
      {
        heading: "Hardwax oil is a different relationship",
        paragraphs: [
          "An oil-finished floor is maintained rather than recoated: it takes a refresher oil periodically, and in exchange it can be spot-repaired without touching the rest of the room. A film finish cannot \u2014 a scratch through polyurethane means resanding to a break line.",
          "Neither is better. One is lower attention with harder repairs; the other is higher attention with easier ones. Choose knowing which you are buying.",
        ],
      },
    ],
  },
];

/**
 * The published guide library. `coreGuides` are the original nine; the
 * expansion pack adds the installation- and stair-method long form. Both are
 * the same shape and both are prerendered, indexed, and searchable — the split
 * exists only to keep either file from becoming unreadable.
 */
export const guides: Guide[] = [...coreGuides, ...guideExpansions];

const MONTHS = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];

/**
 * The one place a guide's date is decided.
 *
 * Before this, three surfaces each invented their own answer: the sitemap
 * stamped `new Date()` on all 358 URLs at build time (so every deploy claimed
 * all 358 pages changed at once, which is noise a crawler discounts), the
 * Article node carried the string "2026-08-27" hardcoded onto all 19 guides,
 * and the RSS feed had no date at all — while `guide.updated` sat on the page,
 * unused by any of them.
 *
 * This derives from what the page already tells a reader. "August 2026"
 * becomes 2026-08-01: the earliest day consistent with the claim, so the date
 * is never newer than what is stated. `updatedOn` overrides it when a real one
 * is known. Nothing here asserts a freshness the page does not.
 */
export function updatedDate(guide: Pick<Guide, "updated" | "updatedOn">): Date {
  if (guide.updatedOn) {
    const exact = new Date(`${guide.updatedOn}T00:00:00Z`);
    if (!Number.isNaN(exact.getTime())) return exact;
  }
  const match = /^([A-Za-z]+)\s+(\d{4})$/.exec(guide.updated.trim());
  const monthName = match?.[1]?.toLowerCase();
  const year = match?.[2];
  const monthIndex = monthName ? MONTHS.indexOf(monthName) : -1;
  if (monthIndex >= 0 && year) return new Date(Date.UTC(Number(year), monthIndex, 1));
  // An unparseable string is a data error, not a reason to invent today's date.
  throw new Error(
    `updatedDate: guide "${guide.updated}" is neither an ISO updatedOn nor "Month YYYY"`,
  );
}

/** ISO calendar date, the form schema.org and sitemaps want. */
export function updatedIso(guide: Pick<Guide, "updated" | "updatedOn">): string {
  return updatedDate(guide).toISOString().slice(0, 10);
}

export function getGuide(slug: string) {
  return guides.find((g) => g.slug === slug);
}
