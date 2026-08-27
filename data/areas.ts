export type City = {
  slug: string;
  name: string;
  region: string;
  blurb: string;
  housing: string;
  typical: string;
  jobs: string[];
};

export const cities: City[] = [
  {
    slug: "toronto",
    name: "Toronto",
    region: "Toronto",
    blurb:
      "From quarter-sawn oak in Forest Hill to herringbone in King West, Toronto is the core of our hardwood, stair, and railing work.",
    housing:
      "Victorian and Edwardian houses in the west end, mid-century bungalows in North York, glass condos downtown, and heritage estates in Rosedale and Forest Hill. Each needs a different assembly.",
    typical:
      "Solid white oak on wood joists, engineered over concrete condos, stair retreads in 3-storey semis, and porch restorations on Parkdale and High Park Victorians.",
    jobs: [
      "Forest Hill heritage restorations",
      "King West / Yorkville condo installs",
      "Rosedale inlays and borders",
      "West-end stair and railing packages",
    ],
  },
  {
    slug: "etobicoke",
    name: "Etobicoke",
    region: "Toronto",
    blurb:
      "Kingsway millwork, lakeshore condos, and family houses that want oak stairs instead of builder carpet.",
    housing:
      "The Kingsway's 1930s–50s homes still hide original oak under tired finish. Newer lakeshore towers need engineered over concrete and dust-contained refinishing that respects condo rules.",
    typical:
      "Site-finished oak, walnut stair features, restaurant and boutique commercial along Bloor and the lake.",
    jobs: ["Kingsway restorations", "Lakeshore condo refinishing", "Commercial restaurant floors"],
  },
  {
    slug: "north-york",
    name: "North York",
    region: "Toronto",
    blurb:
      "Post-war bungalows, custom infill, and condos along Yonge — a lot of red oak that deserves a modern finish.",
    housing:
      '1960s–80s houses with original red oak, plus oversized infill homes that want 7–9" white oak and a statement stair.',
    typical: "Full-house sand-and-finish, infill new-build installs, maple kitchen repairs.",
    jobs: ["Bungalow refinishing", "Infill white oak installs", "Open-riser feature stairs"],
  },
  {
    slug: "scarborough",
    name: "Scarborough",
    region: "Toronto",
    blurb:
      "Solid, honest hardwood work in family houses, plus water-damage repairs that insurance actually closes.",
    housing:
      "Detached and semi-detached stock from the 1960s on, with a growing custom-stair market in newer pockets.",
    typical: "Red oak refinishing, board replacement after leaks, carpet-to-oak stair conversions.",
    jobs: ["Insurance water-damage repairs", "Stair retreads", "Whole-home refinishing"],
  },
  {
    slug: "mississauga",
    name: "Mississauga",
    region: "Peel",
    blurb:
      "Mississauga is engineered hardwood over concrete, maple in occupied condos, and oak stairs in two-storey family homes.",
    housing:
      "High-rise along Hurontario, 1980s–2000s detached in Erin Mills and Streetsville, and custom work in Lorne Park and Mineola.",
    typical:
      "Dust-free refinishing in occupied units, glue-down engineered, matching existing 15-year-old oak.",
    jobs: ["Condo refinishing", "Lorne Park custom installs", "Stair and railing packages"],
  },
  {
    slug: "brampton",
    name: "Brampton",
    region: "Peel",
    blurb:
      "High-volume family houses, new-build stair upgrades, and durable finishes that survive kids and winter salt.",
    housing:
      "1990s–2020s detached and towns. Builder carpet on stairs is the #1 replacement we are called for.",
    typical: "Prefinished oak, solid stair retreads, Bona Traffic HD in hallways.",
    jobs: ["New-build stair upgrades", "Hall and kitchen installs", "Pet-damage repairs"],
  },
  {
    slug: "vaughan",
    name: "Vaughan",
    region: "York",
    blurb:
      "New builds that want the builder floor ripped out and a real oak floor and stair put in before move-in day.",
    housing:
      "Woodbridge, Kleinburg, Maple, Thornhill-Vaughan — large two-storey homes, open-to-below foyers, 4,000+ sq ft.",
    typical:
      'Whole-home site-finished white oak, box-stair conversions, iron balusters, 7"+ planks.',
    jobs: ["4,000 sq ft new-build installs", "Foyer feature stairs", "Kleinburg custom homes"],
  },
  {
    slug: "markham",
    name: "Markham",
    region: "York",
    blurb:
      "Precision installs for new construction and exacting refinishing in occupied family homes.",
    housing:
      "Unionville heritage, 1990s executive houses, and dense new communities that still ship with carpeted stairs.",
    typical: "White oak and walnut, herringbone in dining rooms, matched stair packages.",
    jobs: ["Unionville heritage", "Executive-home refinishing", "Dining-room herringbone"],
  },
  {
    slug: "richmond-hill",
    name: "Richmond Hill",
    region: "York",
    blurb: "Condo refinishing with dust containment, and oak floors in family houses off Yonge.",
    housing:
      "A mix of high-rise living and large detached homes. Occupied-unit work is a core skill here.",
    typical: "Maple and oak refinishing, same-day return dust containment, stair rails.",
    jobs: ["Occupied condo refinishing", "Detached whole-home oak", "Railing replacements"],
  },
  {
    slug: "oakville",
    name: "Oakville",
    region: "Halton",
    blurb:
      "Estate stairs, wide-plank white oak, and millwork-level railings — Oakville is our custom workroom.",
    housing:
      "Southeast Oakville estates, new West Oak Trails builds, and Old Oakville heritage. Clients expect samples, drawings, and no surprises.",
    typical: 'Walnut feature stairs, 8" white oak, custom newels, hardwax oil.',
    jobs: ["Estate staircases", "Old Oakville restorations", "Wide-plank installs"],
  },
  {
    slug: "burlington",
    name: "Burlington",
    region: "Halton",
    blurb: "Family houses, waterfront condos, and stairs that get used every hour of the day.",
    housing: "A mix of 1960s ranches, 1990s two-storeys, and newer infill near the lake.",
    typical: "Durable waterborne finishes, stair retreads, deck and porch work on the lake side.",
    jobs: ["Lake-side porch restoration", "Family-home oak", "Stair packages"],
  },
  {
    slug: "milton",
    name: "Milton",
    region: "Halton",
    blurb: "New-build stair and floor upgrades before the first winter salt hits the foyer.",
    housing:
      "Fast-growing detached and town stock. Builder-grade laminate and carpeted stairs are the baseline we replace.",
    typical: "Prefinished oak, solid treads, simple contemporary rails.",
    jobs: ["Pre-occupancy upgrades", "Townhome stairs", "Open-concept installs"],
  },
];

export function getCity(slug: string) {
  return cities.find((c) => c.slug === slug);
}
