export type Guide = {
  slug: string;
  title: string;
  description: string;
  kicker: string;
  read: string;
  updated: string;
  sections: { heading: string; paragraphs: string[] }[];
};

export const guides: Guide[] = [
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
          "In the Greater Toronto Area in 2026, most homeowners should budget $11–$22 per square foot for a hardwood install (material + labour) and $4.50–$8.50 per square foot for a professional dust-contained refinish. Stairs are $380–$850 per step. Railings are $180–$420 per linear foot. A typical 1,000 sq ft main floor in white oak, straight lay, site-finished, lands around $13,000–$18,000 before HST and before the stair.",
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
          "Houses here go from 20% indoor relative humidity in January to 60% in July if nobody runs a humidifier. Solid hardwood moves. Engineered hardwood moves less. That is physics, not a sales pitch. The wrong response is 'always engineered.' The right response is: what is under the floor, and how many times do you plan to sand it?",
        ],
      },
      {
        heading: "Choose solid when",
        paragraphs: [
          'You have a dry wood-framed subfloor, you want a 3/4" wear life, and you are willing to keep indoor humidity in a civilized range (ideally 35–55%). Forest Hill, High Park, Oakville wood-frame houses — this is still the correct luxury spec.',
        ],
      },
      {
        heading: "Choose engineered when",
        paragraphs: [
          "Concrete slab, below grade, radiant heat, or a condo. Demand a real wear layer (3 mm+ if you want a future refinish) and an adhesive or click system the mill will warrant. A 0.6 mm photographic oak is vinyl with better lighting in the showroom.",
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
          "Ontario Building Code Part 9 governs most houses. Rise and run must be uniform. Nosing projection is limited. Guards have a height. Handrails must be graspable. A 2x6 cap with no fingers-around profile will fail. A rail mounted on the wrong side of a winders flight will fail. We draw the stair to pass, then we make it beautiful.",
        ],
      },
      {
        heading: "The conversions that go wrong",
        paragraphs: [
          'Carpet to oak on an open-side stair needs returned treads, not a leftover plank glued to drywall. Mixing a 3/4" floor with a 5/8" tread without a proper nosing creates a trip. We see both weekly in new builds from Milton to Markham.',
        ],
      },
      {
        heading: "Railings are structural",
        paragraphs: [
          "A newel that is only trimmed on is a future service call. Green Hardwood through-bolts newels into structure. If we cannot, we rebuild the landing until we can. That is the difference between a railing and furniture.",
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
          "A professional system captures the vast majority of airborne dust at the machine and with room sealing. It does not rewrite physics. If a company promises 'zero dust' they are selling you a word. If they show you containment, negative air, and a grit sequence, they are selling you a floor.",
        ],
      },
      {
        heading: "Condos",
        paragraphs: [
          "Elevator pads, quiet hours, a written cure schedule, and a finish that is low-odour enough for an occupied building. We have done this in Richmond Hill, North York, and downtown. You can usually sleep in the unit. You cannot throw a dinner party on night two.",
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
          "It takes the grey and walnut stains people want, it is hard enough, and buyers in the GTA currently treat it as the 'real floor' signal. Rift and quartered if you want quiet grain. Plain sawn if you want cathedral figure and a better price.",
        ],
      },
      {
        heading: "Do not rip good red oak",
        paragraphs: [
          "Half the 1990s houses in North York and Mississauga are sitting on perfectly refinishable red oak. Fashion is not a reason to send it to landfill. Tone it. Change the sheen. Keep the wear layer.",
        ],
      },
      {
        heading: "Walnut and maple are not interchangeable with oak",
        paragraphs: [
          "Walnut is softer and more expensive — use it where you will see it (stairs, dining). Maple is harder and shows everything. Hickory is the dog floor. Engineered oak is the condo and radiant floor. We spec; we do not upsell the mill that is paying for lunch.",
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
        heading: "Resale in Toronto",
        paragraphs: [
          "Buyers in Forest Hill, Rosedale, the Kingsway, and southeast Oakville still stop on a real oak floor. Vinyl in those houses reads as a concession. Vinyl in a basement suite reads as competent. Know which house you have.",
        ],
      },
      {
        heading: "Stairs decide the argument",
        paragraphs: [
          "Vinyl on a stair is a slip. Laminate on a stair is a lawsuit waiting for a toddler. If the flight is in the scope, you are in hardwood territory — treads, nosings, and a rail that can pass Ontario Building Code. That is our whole business.",
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
        ],
      },
      {
        heading: "What goes wrong when you hire a floor guy",
        paragraphs: [
          'A leftover plank glued to drywall on the open side. A 5/8" tread next to a 3/4" floor. A rail that is furniture, not structure. The inspector fails the nosing. The stain does not match. This is not a flooring accessory. It is millwork.',
        ],
      },
      {
        heading: "What it costs",
        paragraphs: [
          "A standard 13-step flight with oak treads, wood or painted risers, and a matching nosing typically runs $5,000–$11,000 installed in 2026. Custom walnut, curved flights, and iron balusters move that number up. Railings are quoted as a system, not an extra.",
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
        heading: "Do not sand it wet",
        paragraphs: [
          "Stop the water. Pull the rugs. Air the room. Do not rent a drum sander at 9 p.m. Sanding a wet floor is how you buy it twice. Call a shop that owns a moisture meter and a library of GTA-typical oak.",
        ],
      },
      {
        heading: "Cupping is not always death",
        paragraphs: [
          "If the boards have not separated from the subfloor and moisture is coming down, they can often dry, sand, and refinish. If tongues are broken or the field has delaminated, those boards come out. We tell you which, with readings, before we quote.",
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
          "That is the relative humidity band a hardwood floor wants. Ontario houses routinely miss both ends. A humidifier in January is cheaper than a refinish in April. Gaps in February are not a defect if the house is at 18%. They are physics.",
        ],
      },
      {
        heading: "Recoat before you sand",
        paragraphs: [
          "A screen-and-recoat every 4–8 years in a family house keeps the wear layer you already paid for. Full sand is for colour changes and for floors whose finish is gone. Steam mops are not cleaning. They are a slow flood.",
        ],
      },
    ],
  },
];

export function getGuide(slug: string) {
  return guides.find((g) => g.slug === slug);
}
