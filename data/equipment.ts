import { getService } from "@/data/services";

/**
 * The machines that do the work.
 *
 * ── Why a flooring company should publish this ────────────────────────────
 *
 * No hardwood company in the GTA publishes its equipment class, and the reason
 * is that most of the differences between a good floor and a bad one are
 * decided by machines the homeowner never sees. "Dust-free sanding" is a
 * claim about an extraction system. "We match the repair" is a claim about a
 * moisture meter. "The stair is millwork" is a claim about a tread jig.
 *
 * Publishing the equipment turns those claims into checkable specifications,
 * and it is the single hardest page on this site for a competitor to copy —
 * because writing it requires knowing the trade, and getting it wrong is
 * obvious to anyone who does.
 *
 * ── The honesty rule this file lives under ────────────────────────────────
 *
 * These entries describe **what the work requires**, not an inventory of what
 * is parked at Sterling Road. This site does not have a verified equipment
 * list and will not publish one from memory — that would be asserting assets,
 * which is the same class of claim as an invented testimonial.
 *
 * So each entry answers three questions that can be answered honestly:
 * what the machine does, what it means for the floor you end up with, and how
 * you can tell whether the company quoting you has one. Where the shop's own
 * published method implies a capability — dust containment, moisture readings
 * before a firm number, site-finished two-component waterborne, through-bolted
 * newels — the entry says so and names the published practice it follows from.
 * It never says "we own a" anything.
 *
 * When Franco photographs the actual machines (blocker #12, which the Google
 * Business Profile video verification also needs), those photographs and a
 * verified inventory can replace the inference. Until then this is a
 * specification, and it is labelled as one.
 */

export type Equipment = {
  slug: string;
  /** The machine class, in the words the trade uses. */
  name: string;
  /** What a homeowner would call it, and what they search. */
  alsoCalled: string[];
  seoTitle: string;
  category: "sanding" | "dust" | "measurement" | "installation" | "finishing" | "stairs";
  /** One sentence: what it is. */
  summary: string;
  /** What it does to the floor, in plain terms. */
  whatItDoes: string[];
  /** Why the homeowner should care — the outcome difference. */
  whyItMatters: string[];
  /** What a shop without it does instead, and what that costs you. */
  without: { instead: string; consequence: string };
  /** How to tell, on a quote or a site visit, whether it is in play. */
  howToTell: string[];
  /** Which published services depend on it. */
  serviceSlugs: string[];
  relatedGuides: string[];
  relatedMethods: string[];
};

export const equipment: Equipment[] = [
  {
    slug: "belt-sander",
    name: "Belt sander (the big machine)",
    alsoCalled: ["drum sander", "floor sander", "big sander", "hardwood floor sanding machine"],
    seoTitle: "Belt vs drum floor sanders",
    category: "sanding",
    summary:
      "The primary cutting machine that takes a hardwood floor back to bare wood across the open field of a room.",
    whatItDoes: [
      "A continuous abrasive belt runs under tension across a drum, and the machine is walked forward and back in overlapping passes with the grain. It removes the old finish and enough wood beneath it to reach a uniform surface, and it does the vast majority of the material removal on any refinish.",
      "Belt machines and older drum machines are not the same tool. A belt runs a long abrasive loop under tension, which spreads the cut and makes it much harder to dig a gouge. A drum wraps a sheet around a rotating cylinder, which cuts faster and is far less forgiving — a drum machine stopped in one place for a second leaves a dish that no later grit removes.",
    ],
    whyItMatters: [
      "Every visible defect in a refinished floor is either a scratch pattern or a flatness error, and both are decided here. Chatter marks — a regular ripple across the boards, most visible in raking light from a window — are a machine that was not set up, a worn drum, or a belt at the wrong tension.",
      "The number of times a floor can be refinished in its life is set by how much wood comes off each time. A machine used well takes what it needs. A machine used badly takes a sanding out of your floor's remaining life.",
    ],
    without: {
      instead:
        "A rented consumer drum sander, or a shop that skips grits to save a pass on the big machine.",
      consequence:
        "Chatter and dish marks that only show up once stain goes on, because pigment collects in a scratch. At that point the fix is sanding the room again from a coarser grit, which costs another slice of your floor's life.",
    },
    howToTell: [
      "Ask what the grit sequence is. A shop with a real machine and a real method answers immediately and names the grits. A shop that says 'we sand it properly' does not have a sequence.",
      "Ask to see a floor they finished, in daylight, from a low angle looking toward a window. Raking light shows chatter that overhead light hides completely.",
    ],
    serviceSlugs: ["sanding-refinishing", "hardwood-repairs"],
    relatedGuides: ["dust-free-sanding-toronto", "hardwood-floor-maintenance-ontario"],
    relatedMethods: [],
  },
  {
    slug: "edger",
    name: "Edger",
    alsoCalled: ["edge sander", "perimeter sander", "corner sander"],
    seoTitle: "Floor edgers and the perimeter halo",
    category: "sanding",
    summary:
      "A hand-held disc machine that sands the six inches around the perimeter of a room that the big machine physically cannot reach.",
    whatItDoes: [
      "The belt machine cannot get closer to a wall than its own housing, so a band around every room, under every radiator and into every doorway is sanded with a disc instead. A disc cuts in a circle; a belt cuts in a line. They leave different scratch patterns on the same wood.",
      "Blending those two patterns so the join is invisible is the skill in the job. It is done by stepping the edger through the same grit sequence as the big machine and then blending both with a multi-disc machine before any finish goes near the floor.",
    ],
    whyItMatters: [
      "The 'halo' — a visibly darker or cloudier band around the edge of a refinished room — is the most common defect on an otherwise decent refinish, and it is an edging failure. It appears because circular scratches hold stain differently from linear ones, and it is permanent once coated.",
      "It is also the defect most visible from a doorway, which is where anyone standing in a hall looks first.",
    ],
    without: {
      instead: "Edging at one grit and going straight to finish, or skipping the blend entirely.",
      consequence:
        "A dark ring around every room. The only fix is resanding the whole floor, so it is worth more attention at quote stage than almost anything else on the estimate.",
    },
    howToTell: [
      "Look at a finished job at the wall line and in the doorways, not in the middle of the room. Then look at the same floor under a window.",
      "Ask specifically how the edge is blended into the field. 'With the buffer' is the right shape of answer.",
    ],
    serviceSlugs: ["sanding-refinishing"],
    relatedGuides: ["dust-free-sanding-toronto"],
    relatedMethods: [],
  },
  {
    slug: "multi-disc-sander",
    name: "Multi-disc sander (buffer)",
    alsoCalled: ["planetary sander", "floor buffer", "screening machine", "orbital floor sander"],
    seoTitle: "Multi-disc sanders and screening",
    category: "sanding",
    summary:
      "A machine with several counter-rotating heads that blends scratch patterns and abrades an existing finish without cutting into the wood.",
    whatItDoes: [
      "Several small heads rotate independently under a larger rotating plate, so no single scratch direction dominates. That is what lets it erase the difference between the belt machine's linear cut and the edger's circular one.",
      "The same machine does the other job that saves people the most money on this site: a screen-and-recoat. It abrades the existing finish enough for a new coat to bond, without touching the wood underneath — a day of work instead of a week, and no wear layer spent.",
    ],
    whyItMatters: [
      "This machine is the difference between a floor that reads as one surface and a floor that reads as a field with a border around it.",
      "It is also the machine that makes the honest recommendation possible. A shop that owns one can tell you your floor needs a recoat rather than a refinish. A shop that does not has a commercial reason to sell you the bigger job.",
    ],
    without: {
      instead: "Selling a full sand to a floor whose finish is merely dull.",
      consequence:
        "You spend several times the money and one of the limited number of sandings your floor has left, for a result a recoat would have delivered.",
    },
    howToTell: [
      "Ask directly: 'does this floor need a full refinish, or would a screen and recoat do?' A shop that answers 'recoat' on a floor that only needs one has just told you a great deal about how it operates.",
      "The tell that a recoat is not enough is wear through the finish into bare wood in the traffic lane. Once there is bare wood, a recoat cannot fix it.",
    ],
    serviceSlugs: ["sanding-refinishing"],
    relatedGuides: ["hardwood-floor-maintenance-ontario", "dust-free-sanding-toronto"],
    relatedMethods: [],
  },
  {
    slug: "dust-containment-system",
    name: "Dust containment and HEPA extraction",
    alsoCalled: [
      "dustless sanding",
      "dust free sanding equipment",
      "HEPA floor sanding",
      "vacuum sanding system",
    ],
    seoTitle: "Dust containment, not dustless",
    category: "dust",
    summary:
      "The extraction and isolation system that captures sanding dust at the machine and keeps the rest out of the house.",
    whatItDoes: [
      "Each sanding machine is ported to a HEPA-filtered vacuum, usually sited outside the working area or outside the building. That captures dust at the point it is made, which is the only place it can be captured efficiently.",
      "Around that, the work zone is isolated: zip walls at the openings, a negative-pressure fan so air moves into the room rather than out of it, and the HVAC returns in the area sealed so the furnace does not distribute fine dust through every duct in the house.",
    ],
    whyItMatters: [
      "This is the system behind the word 'dustless', and the honest word is contained. A professional system captures the large majority of airborne dust. It does not rewrite physics, and anyone promising zero dust is selling you a word.",
      "The consequence of getting it wrong is not only mess. Sanding dust that reaches the return air gets distributed through the whole house and keeps arriving on surfaces for weeks. In an occupied refinish with children or pets in the building, containment is what makes the job possible at all.",
      "It is also a finish-quality issue. Dust settling on a wet coat is a defect in the floor, not a cleaning problem.",
    ],
    without: {
      instead: "A shop vacuum on the machine and a sheet taped over the doorway.",
      consequence:
        "Fine dust through the ductwork and into every room, dust nibs cured into the finish, and a house that keeps producing dust for a month after the crew leaves.",
    },
    howToTell: [
      "Ask where the vacuum sits. 'Outside' or 'in the truck' is the answer you want.",
      "Ask whether the HVAC returns in the work area get sealed. A shop that has thought about it says yes before you finish the question.",
      "Ask what the containment looks like at the doorway. 'Zip wall and a negative air fan' is a specification; 'we tape plastic up' is not.",
    ],
    serviceSlugs: ["sanding-refinishing", "hardwood-repairs", "commercial-hardwood"],
    relatedGuides: ["dust-free-sanding-toronto"],
    relatedMethods: [],
  },
  {
    slug: "moisture-meter",
    name: "Moisture meters and hygrometers",
    alsoCalled: [
      "wood moisture meter",
      "hardwood moisture test",
      "concrete slab moisture test",
      "in-situ RH probe",
    ],
    seoTitle: "Moisture meters and slab probes",
    category: "measurement",
    summary:
      "The instruments that decide whether a floor can be installed at all, and the reason this shop will not give a firm number over the phone.",
    whatItDoes: [
      "A pin meter drives two probes into the wood and measures electrical resistance between them; a pinless meter reads a field through the surface without marking it. Both give a moisture content percentage, and both are used — pinless to survey a floor quickly, pin to confirm a reading where it matters.",
      "Concrete is a different problem and needs a different instrument. In-situ relative humidity probes are drilled into the slab and left to equilibrate, because what matters is the moisture that will eventually reach the surface, not what is at the top today. A slab that reads dry in August can read very differently in March.",
      "A room hygrometer measures the air the floor will live in, which is the other half of the equation. The wood, the subfloor and the air are three readings and the job depends on all three.",
    ],
    whyItMatters: [
      "Moisture is the cause of nearly every catastrophic hardwood failure — cupping, crowning, buckling, adhesive release, and the slow gapping that shows up in the second winter. None of it is visible at quote stage, and all of it is measurable.",
      "The specific number that matters is not the flooring alone but the difference between the flooring and the subfloor: more than about two percent for narrow strip, or one percent for wide plank, and one will move relative to the other after installation.",
      "This is why every price on this website is a band and not a quote. A firm number follows a moisture reading, and a company that gives you a firm price without one has either priced in the risk or is about to discover it at your expense.",
    ],
    without: {
      instead: "Quoting from a photograph or a phone call and starting on the scheduled day.",
      consequence:
        "A floor installed to a condition that was assumed rather than measured. The failure arrives in year one or two, and the argument about whose fault it is has no evidence on either side because nobody wrote a number down.",
    },
    howToTell: [
      "Did anyone put an instrument on your floor during the site visit? If the visit was a walk-through and a tape measure, no moisture reading was taken.",
      "Ask for the readings in writing. A shop that measures is happy to write the numbers on the quote; it protects them as much as you.",
      "On a slab, ask which test. 'In-situ RH probes' is the current standard. A plastic sheet taped down overnight is not a test.",
    ],
    serviceSlugs: [
      "hardwood-installation",
      "sanding-refinishing",
      "hardwood-repairs",
      "commercial-hardwood",
    ],
    relatedGuides: ["solid-vs-engineered-ontario", "water-damaged-hardwood-toronto"],
    relatedMethods: ["moisture-mapping-subfloor"],
  },
  {
    slug: "flooring-nailer",
    name: "Flooring nailer and cleat gun",
    alsoCalled: ["floor nailer", "cleat nailer", "flooring stapler", "hardwood nail gun"],
    seoTitle: "Flooring nailers and cleats",
    category: "installation",
    summary:
      "The pneumatic tool that drives fasteners through the tongue of each board at the angle the assembly needs.",
    whatItDoes: [
      "A flooring nailer sits on the edge of the board and drives a cleat or staple through the tongue at roughly 45 degrees, so the fastener is hidden by the next board. Spacing is typically every six to eight inches along the board with two fasteners near each end.",
      "Cleats and staples behave differently. A cleat is an L-shaped fastener that holds while allowing the board a little seasonal movement. A staple grips harder and allows less, which is an advantage in some assemblies and the cause of split tongues in others. The choice follows the species, the width and the season.",
    ],
    whyItMatters: [
      "Squeaks that appear a year after a new floor are usually underfastening, a subfloor that was never screwed down, or boards fastened over a subfloor that was not flat. All three are decided at this stage and none is repairable without lifting the floor.",
      "Fastener spacing is also the difference between a floor that moves as a unit through a Toronto winter and one that opens a gap wherever the fastening was thin.",
    ],
    without: {
      instead: "Wider fastener spacing to save time, or the wrong fastener for the board width.",
      consequence:
        "Squeaks, movement, and in the worst case split tongues that only reveal themselves as loose boards a season later.",
    },
    howToTell: [
      "Walk a floor the company installed at least a year ago. A year is long enough for one full humidity cycle, which is what exposes underfastening.",
      "Ask what fastener and what spacing they use for the board width you are buying. There is a right answer and it is specific.",
    ],
    serviceSlugs: ["hardwood-installation"],
    relatedGuides: ["solid-vs-engineered-ontario", "hardwood-flooring-cost-gta-2026"],
    relatedMethods: ["nail-down-solid-hardwood"],
  },
  {
    slug: "adhesive-trowel",
    name: "Adhesive system and notched trowel",
    alsoCalled: ["glue down hardwood", "flooring adhesive", "moisture barrier adhesive", "trowel notch"],
    seoTitle: "Flooring adhesive and trowel notch",
    category: "installation",
    summary:
      "The urethane adhesive and the specific notch profile that together decide whether a glue-down floor stays down.",
    whatItDoes: [
      "Adhesive is spread with a notched trowel whose notch size is specified by the adhesive manufacturer for the board being installed. The notch meters how much adhesive goes down; too little and coverage fails, too much and the board floats on it and squeezes up through the seams.",
      "Modern flooring adhesives are moisture-cure urethanes, and many double as a moisture barrier rated to a stated slab RH. That rating is the number the in-situ probe reading is checked against before anything is ordered.",
      "Open time matters as much as coverage. Adhesive spread too far ahead of the boards skins over, and a board laid into skinned adhesive is a hollow spot from the day it goes down.",
    ],
    whyItMatters: [
      "Glue-down is the assembly for condo slabs and for anything over radiant, which is a large share of the GTA market. It is also the assembly where the failure is worst: a delaminating glue-down floor cannot be repaired in place, it comes up.",
      "Herringbone raises the stakes again, because a pattern field has far more end-grain joints per square metre and coverage matters more, not less.",
    ],
    without: {
      instead:
        "A general-purpose adhesive chosen on price, the wrong notch, or spreading half a room ahead of the crew.",
      consequence:
        "Hollow spots underfoot within a year, and eventual delamination that is not a repair — it is the floor again.",
    },
    howToTell: [
      "Ask which adhesive, by name, and what slab RH it is rated to. Then ask what the slab actually read.",
      "Ask what trowel notch that adhesive specifies for your board. A shop that knows the answer has read the data sheet.",
    ],
    serviceSlugs: ["hardwood-installation", "commercial-hardwood"],
    relatedGuides: ["solid-vs-engineered-ontario", "best-hardwood-species-toronto-homes"],
    relatedMethods: ["glue-down-engineered-hardwood"],
  },
  {
    slug: "finish-application",
    name: "Finish application: T-bar, roller and cut-in",
    alsoCalled: [
      "waterborne floor finish",
      "two component finish",
      "polyurethane floor coating",
      "hardwax oil application",
    ],
    seoTitle: "Applying a floor finish",
    category: "finishing",
    summary:
      "The applicators and the sequence that put a two-component waterborne system on the floor without lap marks, and the cure schedule that follows.",
    whatItDoes: [
      "A two-component waterborne finish is mixed with its hardener and has a working life measured in hours, so the floor is coated in one continuous operation. The perimeter is cut in with a pad or brush and the field is pulled with a T-bar applicator or a roller, keeping a wet edge across the whole room.",
      "Between coats the surface is abraded so the next coat bonds. Skipping that inter-coat abrasion is why some floors delaminate in sheets years later.",
      "Hardwax oil is a different discipline entirely: applied thin, worked into the wood, and buffed off rather than built up. It is maintained rather than recoated, and it can be spot-repaired, which no film finish can.",
    ],
    whyItMatters: [
      "Lap marks — a visible line where one wet edge met a dried one — are permanent and only removable by sanding. They come from a room too big for the crew size or a finish that started setting before the field was closed.",
      "The cure schedule is what decides whether you can live in your house. Two-component waterborne typically allows sock traffic in about 24 hours, furniture back after several days, and rugs last, because a rug traps solvent and can print into a finish that is still curing.",
      "Finish choice is also a maintenance decision that lasts decades. Waterborne two-component is the durable, non-ambering default. Oil-modified polyurethane ambers and smells for days. Hardwax oil is repairable and wants attention.",
    ],
    without: {
      instead: "Single-component finish sold as equivalent, or coating a large open plan short-handed.",
      consequence:
        "Lap marks across the field, a wear layer that does not last, and in an occupied house a cure schedule that turns out to mean something different from what was promised.",
    },
    howToTell: [
      "Ask for the finish system by name and whether it is one- or two-component. Ask how many coats, and whether the floor is abraded between them.",
      "Ask for the cure schedule in writing: sock traffic, furniture, rugs. A shop that has done occupied houses gives you three different numbers without hesitating.",
    ],
    serviceSlugs: ["sanding-refinishing", "hardwood-installation", "commercial-hardwood"],
    relatedGuides: ["dust-free-sanding-toronto", "hardwood-floor-maintenance-ontario"],
    relatedMethods: [],
  },
  {
    slug: "stair-fabrication-bench",
    name: "Stair fabrication: saws, jigs and templates",
    alsoCalled: [
      "stair tread jig",
      "custom stair fabrication",
      "returned tread ends",
      "stair building tools",
    ],
    seoTitle: "Stair fabrication tools",
    category: "stairs",
    summary:
      "The bench work that makes a staircase millwork rather than flooring laid on steps — templates, a mitre saw, a table saw and a tread jig.",
    whatItDoes: [
      "Every tread in an old flight is a different width and rarely square to anything. Each is templated, cut to that template, and dry-fitted before it is fixed. A flight of thirteen treads is thirteen separate pieces of joinery, not thirteen cuts from one measurement.",
      "A returned tread end — where the tread wraps its own profile around the open side of a stair — is a mitred, glued assembly made at a bench. It is the single detail that separates a stair that reads as millwork from one that reads as a plank glued to drywall.",
      "The nosing profile has to run consistently down the flight and continue onto the landing so the eye follows one line, which means the profile is cut, not bought in mismatched pieces.",
    ],
    whyItMatters: [
      "The stair sits at eye level in the middle of the sightline from the front door. A mismatch that nobody would notice between two rooms is obvious on one flight.",
      "It is also the code surface. Nosing projection, tread depth and the first and last riser all change when a flight is retreaded, and getting them right is bench accuracy rather than site improvisation.",
      "This is the specific reason this shop does not subcontract the stair: a flooring crew has flooring tools, and a stair needs a bench.",
    ],
    without: {
      instead:
        "A leftover plank cut to length on site and glued down, with a strip of quarter round at the open side.",
      consequence:
        "An over-projecting nosing that fails inspection, tread ends that show end grain to the room, and a stair that never quite matches the floor it lands on.",
    },
    howToTell: [
      "Look at the open side of a stair they have built. Is the tread end returned and mitred, or is it a cut edge with trim over it?",
      "Ask whether the treads are templated individually. On any flight older than about twenty years the honest answer has to be yes.",
      "Ask who builds the stair — them, or a subcontractor. The answer decides whether the finish will match the floor.",
    ],
    serviceSlugs: ["hardwood-stairs", "hardwood-railings", "custom-inlays"],
    relatedGuides: [
      "ontario-stair-code-hardwood",
      "carpet-to-hardwood-stairs-gta",
      "best-hardwood-species-toronto-homes",
    ],
    relatedMethods: ["carpet-to-hardwood-stair-retread", "custom-box-stair-build"],
  },
  {
    slug: "railing-anchorage",
    name: "Railing anchorage: through-bolts and structural fixing",
    alsoCalled: [
      "newel post anchoring",
      "wobbly railing fix",
      "handrail bracket",
      "guard load requirement",
    ],
    seoTitle: "Newel and handrail anchorage",
    category: "stairs",
    summary:
      "The hardware and the method that make a guard resist a real lateral load instead of merely standing there.",
    whatItDoes: [
      "A newel post is through-bolted into structure — a stringer, a joist, or blocking installed for the purpose — rather than fastened into tread material or trimmed on top of a finished floor. The bolt is counterbored and plugged so the fixing is hidden but real.",
      "Where the structure to bolt into does not exist, it gets built: the landing is opened and blocking added. That is a carpentry job attached to a railing job, and a quote that does not mention it has assumed the structure is already there.",
    ],
    whyItMatters: [
      "A guard has to resist someone falling against it, not someone leaning on it. It fails at the moment it is needed, which is the only moment that counts.",
      "A wobbly banister is the most common stair complaint in the GTA and it is almost never the rail — it is the newel, and it is almost never fixable by tightening something.",
      "Once a stair is altered, the argument that the old railing was compliant when the house was built gets thin. And a rail that was never graspable was never compliant.",
    ],
    without: {
      instead: "Screwing the newel through the finished floor, or gluing it to a tread.",
      consequence:
        "A guard that moves in year one and fails a load it was always supposed to take. It is also a future service call the shop will lose money on, which is why the shops that do it properly are the ones still in business.",
    },
    howToTell: [
      "Push a newel post on a stair they have built. Firmly. It should not move at all.",
      "Ask what the newel is anchored into. 'Structure' with a specific noun after it — stringer, joist, blocking — is the answer. 'It's screwed down' is not.",
    ],
    serviceSlugs: ["hardwood-railings", "hardwood-stairs"],
    relatedGuides: ["ontario-stair-code-hardwood", "carpet-to-hardwood-stairs-gta"],
    relatedMethods: ["hardwood-railing-through-bolt"],
  },
];

export const equipmentCategories = [
  { id: "sanding", label: "Sanding", blurb: "The machines that take a floor back to bare wood." },
  { id: "dust", label: "Dust control", blurb: "What makes an occupied refinish possible." },
  {
    id: "measurement",
    label: "Measurement",
    blurb: "The instruments behind every band on this site being a band.",
  },
  { id: "installation", label: "Installation", blurb: "How the floor is fixed to the building." },
  { id: "finishing", label: "Finishing", blurb: "What goes on top, and how long you are out." },
  { id: "stairs", label: "Stairs & railings", blurb: "The bench work, and the anchorage." },
] as const;

export function getEquipment(slug: string) {
  return equipment.find((e) => e.slug === slug);
}

export function equipmentByCategory(category: Equipment["category"]) {
  return equipment.filter((e) => e.category === category);
}

/** Every published service this machine class is used on. */
export function servicesFor(item: Equipment) {
  return item.serviceSlugs.map(getService).filter((s) => s !== undefined);
}

/** The machine classes a given service depends on. */
export function equipmentForService(serviceSlug: string) {
  return equipment.filter((e) => e.serviceSlugs.includes(serviceSlug));
}
