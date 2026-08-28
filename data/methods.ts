export type Method = {
  slug: string;
  name: string;
  cluster: "installation" | "stairs" | "railings" | "prep";
  headline: string;
  summary: string;
  image: string;
  imageAlt: string;
  relatedService: string;
  relatedGuides: string[];
  steps: { heading: string; body: string }[];
  when: string;
  whenNot: string;
  faqs: { q: string; a: string }[];
};

export const methods: Method[] = [
  {
    slug: "nail-down-solid-hardwood",
    name: "Nail-down solid hardwood",
    cluster: "installation",
    headline: "The default hardwood assembly on a dry wood-framed GTA house.",
    summary:
      "Solid 3/4-inch oak, maple, or walnut, hidden-fastened into a prepared wood subfloor, with expansion detailed at every wall and obstruction.",
    image: "/images/service-install.jpg",
    imageAlt: "Solid oak hardwood being fastened with a pneumatic nailer over a prepared subfloor.",
    relatedService: "hardwood-installation",
    relatedGuides: [
      "nail-down-vs-glue-down-vs-floating-hardwood",
      "hardwood-subfloor-prep-ontario",
    ],
    steps: [
      {
        heading: "Moisture and flatness",
        body: "Meter the subfloor. Flatten. Fix squeaks. Do not start the first row on a wave.",
      },
      {
        heading: "Acclimate to the room",
        body: "Material lives in the finished HVAC condition, not in a closed carton in the garage.",
      },
      {
        heading: "Layout line",
        body: "Snap a line that agrees with the stair nosing and the main view, not only with the longest wall.",
      },
      {
        heading: "Fasten and rack",
        body: "Blind nail or staple to spec. Rack joints. Leave the expansion gap the species actually needs.",
      },
    ],
    when: "Dry wood-framed houses in Toronto, Etobicoke, the Kingsway, Oakville, and similar stock where you want a refinishable solid floor.",
    whenNot:
      "Concrete slabs, radiant heat, below-grade rooms, or any site that fails a moisture test.",
    faqs: [
      {
        q: "Is nail-down louder than glue-down?",
        a: "A properly fastened nail-down floor on a flat subfloor sounds like wood. Hollow spots are a prep failure, not a personality of the method.",
      },
    ],
  },
  {
    slug: "glue-down-engineered-hardwood",
    name: "Glue-down engineered hardwood",
    cluster: "installation",
    headline: "The correct engineered assembly on condo slabs and radiant floors.",
    summary:
      "Engineered hardwood set in the mill-listed adhesive over a moisture-tested, flattened concrete or wood substrate.",
    image: "/images/methods/method-glue-down-engineered.jpg",
    imageAlt: "Engineered white oak being rolled into adhesive on a concrete condo slab.",
    relatedService: "hardwood-installation",
    relatedGuides: ["radiant-heat-hardwood-ontario", "nail-down-vs-glue-down-vs-floating-hardwood"],
    steps: [
      {
        heading: "Slab moisture",
        body: "Calcium chloride or in-situ RH, per the adhesive and mill. Wrong number means wait or change the spec.",
      },
      {
        heading: "Flatness",
        body: "Trowel ridges become telegraphing. Levelling is not optional on a glossy engineered face.",
      },
      {
        heading: "Adhesive",
        body: "The glue in the mill warranty, not the glue that was on sale. Open time and trowel notch matter.",
      },
      {
        heading: "Roll and weight",
        body: "Roll the field. Protect the perimeter. Do not walk a fresh glue-down like it is laminate.",
      },
    ],
    when: "Condos, concrete, radiant, and engineered products whose warranty requires glue-down.",
    whenNot:
      "A wet slab, a slab nobody measured, or a click product that the mill says must float.",
    faqs: [
      {
        q: "Can you glue-down over existing vinyl?",
        a: "Sometimes, if the vinyl is sound, compatible, and the mill allows it. Often the honest move is to take it up. We decide on site.",
      },
    ],
  },
  {
    slug: "floating-engineered-hardwood",
    name: "Floating engineered hardwood",
    cluster: "installation",
    headline: "A click-engineered floor that rides on underlayment when the mill requires it.",
    summary:
      "Engineered click systems over the specified underlayment, with transitions and stair nosings detailed so the floor does not read as laminate.",
    image: "/images/hero-living.jpg",
    imageAlt: "Finished wide-plank engineered oak floor in a bright living room.",
    relatedService: "hardwood-installation",
    relatedGuides: ["nail-down-vs-glue-down-vs-floating-hardwood"],
    steps: [
      {
        heading: "Underlayment",
        body: "The one in the mill packet. Thickness, density, and vapour control are a spec, not a preference.",
      },
      {
        heading: "Expansion",
        body: "Floating floors move as a sheet. Doorways and long runs need breaks. Ignore that and the floor peaks.",
      },
      {
        heading: "Stair and vent details",
        body: "Nosings and flush vents have to be designed for a floating thickness, not borrowed from a 3/4-inch solid job.",
      },
    ],
    when: "Mills that require floating, some retrofit rooms, and sites where glue-down is not warranted.",
    whenNot:
      "As a way to hide a bad subfloor. Waves still telegraph. Cheap click plank is not a Green Hardwood product.",
    faqs: [
      {
        q: "Does a floating floor feel hollow?",
        a: "On a cheap underlayment, yes. On a specified pad over a flat floor, it should feel quiet and even. If it sounds like a stage, the assembly is wrong.",
      },
    ],
  },
  {
    slug: "moisture-mapping-subfloor",
    name: "Moisture mapping before install",
    cluster: "prep",
    headline: "The first trade on a hardwood job is measurement, not the nailer.",
    summary:
      "Wood-moisture and slab-moisture survey, documented, before Green Hardwood agrees to an assembly.",
    image: "/images/methods/method-moisture-map.jpg",
    imageAlt:
      "Technician taking a moisture reading on an OSB subfloor before hardwood installation.",
    relatedService: "hardwood-installation",
    relatedGuides: ["hardwood-subfloor-prep-ontario", "acclimation-hardwood-gta"],
    steps: [
      {
        heading: "Grid the room",
        body: "Readings at edges, at plumbing walls, at exterior corners, and in the middle — not one heroic number.",
      },
      {
        heading: "Compare to the material",
        body: "Boards have a moisture content. The room has one. The gap between them is the risk.",
      },
      {
        heading: "Write the decision",
        body: "Install, wait, change to engineered, or refuse. A smile is not a moisture plan.",
      },
    ],
    when: "Every install and every refinish that might have a leak history.",
    whenNot: "Never skipped because the client is in a hurry.",
    faqs: [
      {
        q: "What if the slab is wet?",
        a: "We wait, we mitigate, or we change the spec. We do not glue premium oak onto a wet slab and hope winter saves us.",
      },
    ],
  },
  {
    slug: "carpet-to-hardwood-stair-retread",
    name: "Carpet-to-hardwood stair retread",
    cluster: "stairs",
    headline: "The volume stair job in Vaughan, Markham, Milton, and Brampton new builds.",
    summary:
      "Carpet off, structure checked, solid treads on, risers and nosing in the same species or a deliberate contrast.",
    image: "/images/methods/method-stair-retread.jpg",
    imageAlt: "Solid oak treads dry-fit on an exposed stair stringer after carpet removal.",
    relatedService: "hardwood-stairs",
    relatedGuides: [
      "hardwood-stair-retread-cost-gta",
      "builder-grade-stairs-upgrade-vaughan-markham",
      "carpet-to-hardwood-stairs-gta",
    ],
    steps: [
      {
        heading: "Strip and inspect",
        body: "Carpet, staples, and fake nosing come off. Stringers get a bounce test. Rise gets measured.",
      },
      {
        heading: "Decide retread vs rebuild",
        body: "Flex, illegal rise, or rotten wedges turn this into a rebuild. That call is made before stain.",
      },
      {
        heading: "Returned treads on the open side",
        body: "A plank glued to drywall is not a tread. Open sides get returned ends and a real false stringer if needed.",
      },
      {
        heading: "Nosing and landing",
        body: "The first-floor landing and the top nosing are part of the stair, not leftover flooring.",
      },
    ],
    when: "Builder carpet stairs with sound stringers and a legal or correctable rise.",
    whenNot:
      "A bouncing stringer, a stair that already fails rise/run, or a client who wants leftover flooring glued to plywood.",
    faqs: [
      {
        q: "Can we live in the house?",
        a: "Usually. One flight at a time, protected edges, and a temporary path. Full rebuilds are a different conversation.",
      },
    ],
  },
  {
    slug: "custom-box-stair-build",
    name: "Custom box stair build",
    cluster: "stairs",
    headline: "A hardwood stair built as millwork, not as leftover flooring standing on end.",
    summary:
      "Closed-riser box stairs in oak, maple, or walnut, with treads, risers, stringers, scotia, and landing in one system.",
    image: "/images/service-stairs.jpg",
    imageAlt: "Custom hardwood staircase with closed risers and a sculpted handrail.",
    relatedService: "hardwood-stairs",
    relatedGuides: ["ontario-stair-code-hardwood", "hardwood-stair-nosing-and-transitions"],
    steps: [
      {
        heading: "Measure rise and run",
        body: "Total rise divided into legal, uniform risers. We do not squeeze an extra step to 'make it float.'",
      },
      {
        heading: "Draw to Part 9",
        body: "Nosing, guards, graspable rail, and headroom are on the drawing before anyone mills.",
      },
      {
        heading: "Mill as a set",
        body: "Treads and risers from the same species and grade as the floor, or a specified contrast.",
      },
      {
        heading: "Install and finish as one",
        body: "Site-finished with the floor when that is the spec. Prefinished when the schedule requires it.",
      },
    ],
    when: "New houses, gut renovations, and replacements where the existing stair is not worth capping.",
    whenNot: "A decorative stair that cannot pass inspection.",
    faqs: [
      {
        q: "Can you copy a curved heritage stair?",
        a: "We can rebuild or closely follow a curved flight. It is millwork pricing, not retread pricing. Bring photos and expect a site template.",
      },
    ],
  },
  {
    slug: "open-riser-steel-and-oak",
    name: "Open-riser steel and oak stair",
    cluster: "stairs",
    headline: "Oak treads on a steel carriage — only when the openings and the deflection pass.",
    summary:
      "Open-riser feature stairs with hardwood treads, steel stringers, and a graspable oak rail.",
    image: "/images/methods/method-open-riser-stair.jpg",
    imageAlt: "Open-riser white oak staircase with steel stringer and oak handrail.",
    relatedService: "hardwood-stairs",
    relatedGuides: ["open-riser-floating-hardwood-stairs", "ontario-stair-code-hardwood"],
    steps: [
      {
        heading: "Engineering before beauty",
        body: "Carriage design, opening sizes, and guard infill are checked against current Ontario Part 9.",
      },
      {
        heading: "Tread thickness",
        body: "A thin decorative cap on a skinny plate will bounce. Tread thickness is structural.",
      },
      {
        heading: "Rail that you can actually hold",
        body: "A 2x6 cap is not a handrail. The oak rail gets a graspable profile and real blocking.",
      },
    ],
    when: "Contemporary GTA houses whose drawings already respect code, or whose drawings we are allowed to fix.",
    whenNot: "A screenshot with illegal gaps and no rail.",
    faqs: [
      {
        q: "Are open risers safe for kids?",
        a: "Only if openings meet code. If you have toddlers and you want air, we will show legal infill options. We will not install a ladder.",
      },
    ],
  },
  {
    slug: "hardwood-railing-through-bolt",
    name: "Through-bolted hardwood railing",
    cluster: "railings",
    headline: "A newel that is fastened into structure, not into trim.",
    summary:
      "Oak, maple, or walnut handrails with newels through-bolted to framing, graspable profiles, and mixed-metal balusters when specified.",
    image: "/images/railing-join.jpg",
    imageAlt: "Close-up of a hardwood handrail joining a newel post.",
    relatedService: "hardwood-railings",
    relatedGuides: ["ontario-stair-code-hardwood", "matching-hardwood-stairs-to-existing-floor"],
    steps: [
      {
        heading: "Find the framing",
        body: "If the landing has no blocking, we add it. A newel into drywall is a future service call.",
      },
      {
        heading: "Through-bolt",
        body: "Hardware into structure. Trim hides the hardware. The hardware does not live in the trim.",
      },
      {
        heading: "Profile and height",
        body: "Graspable rail, legal guard height, consistent reveal. Decorative and legal are not opposites if you mill it right.",
      },
    ],
    when: "Every railing Green Hardwood installs.",
    whenNot: "A hollow half-newel glued to plaster and called custom.",
    faqs: [
      {
        q: "Can you mix iron balusters with an oak rail?",
        a: "Yes. It is one of the most common GTA packages. Drilled, shoed, and epoxied so they do not rattle in year three.",
      },
    ],
  },
];

export function getMethod(slug: string) {
  return methods.find((m) => m.slug === slug);
}
