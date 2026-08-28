export type City = {
  slug: string;
  /** The municipality's full name, used in headings and body copy. */
  name: string;
  /**
   * Short form for <title> tags, where the full name would push the tag past
   * the ~70-character SERP limit once " | Green Hardwood" is appended.
   * Defaults to `name` via `titleNameOf()`.
   */
  titleName?: string;
  region: string;
  /**
   * How far this is from the Sterling Road shop, in commercial terms.
   *
   * "core"     — free site visit for any qualified job.
   * "extended" — we travel, but the job has to justify the drive. Saying so
   *              is better than taking the enquiry and disappointing someone,
   *              and it is the difference between a service area and a map
   *              with pins on it.
   */
  tier: "core" | "extended";
  blurb: string;
  housing: string;
  typical: string;
  jobs: string[];
};

/** The name to use in a <title>. Falls back to the full municipal name. */
export function titleNameOf(city: City) {
  return city.titleName ?? city.name;
}

/** What a visitor in this tier should expect before they call. */
export function tierNote(city: City) {
  return city.tier === "core"
    ? "Free on-site measure for any qualified hardwood, stair, or railing job."
    : "Outside our core radius. We work here regularly, but on stair packages, whole-home installs, and refinishing — not a single-room repair.";
}

export const cities: City[] = [
  {
    slug: "toronto",
    name: "Toronto",
    region: "Toronto",
    tier: "core",
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
    tier: "core",
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
    tier: "core",
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
    tier: "core",
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
    tier: "core",
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
    tier: "core",
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
    tier: "core",
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
    tier: "core",
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
    tier: "core",
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
    tier: "core",
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
    tier: "core",
    blurb: "Family houses, waterfront condos, and stairs that get used every hour of the day.",
    housing: "A mix of 1960s ranches, 1990s two-storeys, and newer infill near the lake.",
    typical: "Durable waterborne finishes, stair retreads, deck and porch work on the lake side.",
    jobs: ["Lake-side porch restoration", "Family-home oak", "Stair packages"],
  },
  {
    slug: "milton",
    name: "Milton",
    region: "Halton",
    tier: "core",
    blurb: "New-build stair and floor upgrades before the first winter salt hits the foyer.",
    housing:
      "Fast-growing detached and town stock. Builder-grade laminate and carpeted stairs are the baseline we replace.",
    typical: "Prefinished oak, solid treads, simple contemporary rails.",
    jobs: ["Pre-occupancy upgrades", "Townhome stairs", "Open-concept installs"],
  },
  {
    slug: "east-york",
    name: "East York",
    region: "Toronto",
    tier: "core",
    blurb:
      "Wartime and post-war semis with original strip oak hiding under sixty years of broadloom — and the tightest stairs in the city.",
    housing:
      '1930s–50s semi-detached and small detached houses, many never renovated below the carpet. Rooms are small, ceilings are low, and the original 2 1/4" strip oak is usually still there and usually worth saving.',
    typical:
      "Lifting broadloom to find intact oak, dust-contained refinishing in occupied houses, and steep narrow flights where every millimetre of run matters.",
    jobs: [
      "Broadloom removal and original-oak refinishing",
      "Narrow-flight stair retreads",
      "Kitchen-addition floor matching",
    ],
  },
  {
    slug: "pickering",
    name: "Pickering",
    region: "Durham",
    tier: "core",
    blurb:
      "Eighties two-storeys with builder carpet still on the stairs, and a whole new city going up at Seaton.",
    housing:
      "1970s–90s subdivisions through Amberlea and Liverpool, older lakefront stock around Frenchman's Bay, and thousands of new units at Seaton that arrive with the cheapest stair the builder could specify.",
    typical:
      "Carpet-to-oak stair conversions, main-floor engineered over 1980s subfloors, and matching new work to twenty-year-old red oak.",
    jobs: [
      "Builder carpet stair conversions",
      "Seaton pre-occupancy upgrades",
      "Bay-area lakefront refinishing",
    ],
  },
  {
    slug: "ajax",
    name: "Ajax",
    region: "Durham",
    tier: "core",
    blurb:
      "Family subdivisions where the stairs get more traffic than the floor, and the builder knew it would not be his problem.",
    housing:
      "Mostly 1990s–2010s detached and semi stock north of the 401, with older lakeshore houses in the south. Volume builder finishes throughout: prefinished floors, carpeted flights, MDF nosings.",
    typical:
      "Solid oak retreads over builder stringers, hallway and stair packages done together, hard-wearing waterborne finishes.",
    jobs: [
      "Carpet-to-hardwood stair packages",
      "Whole main-floor installs",
      "High-traffic finish upgrades",
    ],
  },
  {
    slug: "whitby",
    name: "Whitby",
    region: "Durham",
    tier: "core",
    blurb:
      "Brooklin estate builds at one end, downtown Whitby heritage at the other, and two completely different jobs.",
    housing:
      "Brooklin's newer executive homes want wide-plank white oak and an open-to-below feature stair. Downtown Whitby's Victorian and Edwardian stock wants careful restoration and a stair that respects the original newel.",
    typical:
      "Wide-plank installs and feature flights in the north, heritage refinishing and stair repair in the old town.",
    jobs: [
      "Brooklin feature staircases",
      "Downtown heritage restoration",
      "Wide-plank white oak installs",
    ],
  },
  {
    slug: "oshawa",
    name: "Oshawa",
    region: "Durham",
    tier: "extended",
    blurb:
      "Some of the most consistently good original oak in the region, most of it still under carpet in houses built for autoworkers.",
    housing:
      "Century homes downtown, dense 1940s–60s worker housing through the centre, and newer subdivisions in the north. The mid-century stock frequently has full-house strip oak in better condition than anything a big-box store sells today.",
    typical:
      "Whole-house sand and finish, board replacement where a radiator leaked, and stair retreads in tight 1950s flights.",
    jobs: [
      "Whole-house original-oak refinishing",
      "Century-home board replacement",
      "Mid-century stair retreads",
    ],
  },
  {
    slug: "clarington",
    name: "Clarington",
    region: "Durham",
    tier: "extended",
    blurb:
      "Bowmanville and Newcastle heritage streets, plus subdivision growth that has outrun the trades following it.",
    housing:
      "Nineteenth-century brick homes along the old main streets, farmhouses on the concessions, and fast newer growth around Bowmanville. Original pine and early oak floors are common and are often mistaken for beyond saving.",
    typical:
      "Heritage floor restoration, pine board repair, and full stair rebuilds where a previous owner boxed in an original flight.",
    jobs: [
      "Heritage pine and oak restoration",
      "Farmhouse stair rebuilds",
      "New-build stair upgrades",
    ],
  },
  {
    slug: "aurora",
    name: "Aurora",
    region: "York",
    tier: "core",
    blurb:
      "A heritage core that rewards restraint, and estate builds east of Yonge that want the stair to be the room.",
    housing:
      "Victorian and Edwardian houses through the old town with original quarter-sawn oak worth restoring rather than replacing, alongside large newer homes on the east side where the foyer stair is the first thing anyone sees.",
    typical:
      "Quarter-sawn restoration, walnut feature flights, and matching new hardwood into hundred-year-old rooms that are not square.",
    jobs: [
      "Quarter-sawn oak restoration",
      "Estate foyer staircases",
      "Heritage-to-addition floor matching",
    ],
  },
  {
    slug: "newmarket",
    name: "Newmarket",
    region: "York",
    tier: "core",
    blurb:
      "Main Street heritage and thirty years of family subdivisions, both of which eventually call about the stairs.",
    housing:
      "Century homes around Main Street South, 1980s–2000s detached stock through Glenway and Stonehaven, and newer infill. Builder-grade carpeted flights are the default in anything after 1985.",
    typical:
      "Carpet-to-oak conversions, whole-floor refinishing in occupied family homes, and railings brought up to current code.",
    jobs: [
      "Family-home stair conversions",
      "Occupied-house refinishing",
      "Railing replacement and code upgrades",
    ],
  },
  {
    slug: "king",
    name: "King",
    region: "York",
    tier: "core",
    blurb:
      "Estate properties and horse farms where the specification conversation starts with the species and ends with the newel post.",
    housing:
      "Large custom houses in King City and Nobleton, converted farmhouses on acreage, and outbuildings finished to house standard. Clients expect drawings, signed-off samples, and a crew that keeps a clean site.",
    typical:
      "Wide-plank walnut and white oak, hardwax oil, curved and open-riser flights, and millwork-grade railings.",
    jobs: [
      "Estate feature staircases",
      "Wide-plank walnut installs",
      "Farmhouse conversion floors",
    ],
  },
  {
    slug: "whitchurch-stouffville",
    name: "Whitchurch-Stouffville",
    titleName: "Stouffville",
    region: "York",
    tier: "core",
    blurb:
      "A small-town core surrounded by new subdivisions, every one of them delivered with a carpeted flight.",
    housing:
      "Older village houses on the original grid, plus a decade of rapid detached construction. New owners frequently upgrade the stair before they move in, while the floor is still bare.",
    typical:
      "Pre-occupancy stair and hallway packages, prefinished oak, and simple contemporary railings.",
    jobs: [
      "Pre-occupancy stair upgrades",
      "Village-core refinishing",
      "Open-concept main-floor installs",
    ],
  },
  {
    slug: "caledon",
    name: "Caledon",
    region: "Peel",
    tier: "extended",
    blurb:
      "Century farmhouses, Bolton subdivisions, and rural properties where the floor has to survive a mudroom and two dogs.",
    housing:
      "Nineteenth-century farmhouses with original pine, estate builds on acreage through the hills, and denser subdivision stock in Bolton. Heating is uneven and humidity swings hard, which decides the assembly.",
    typical:
      "Wide-plank installs specified for movement, pine restoration, hickory where dogs and gravel are involved.",
    jobs: ["Farmhouse pine restoration", "Wide-plank estate installs", "Bolton stair conversions"],
  },
  {
    slug: "halton-hills",
    name: "Halton Hills",
    region: "Halton",
    tier: "extended",
    blurb:
      "Georgetown's heritage streets and Acton's older stock, plus the subdivisions filling the space between them.",
    housing:
      "Brick Victorians through downtown Georgetown, older village housing in Acton, and newer detached growth on the edges. Original floors under carpet are common in anything pre-1960.",
    typical:
      "Heritage refinishing, board replacement, and stair rebuilds where an original flight was carpeted over rather than repaired.",
    jobs: [
      "Georgetown heritage refinishing",
      "Original-flight stair rebuilds",
      "Subdivision stair packages",
    ],
  },
  {
    slug: "hamilton",
    name: "Hamilton",
    region: "Hamilton",
    tier: "extended",
    blurb:
      "The best surviving century-home floor stock in Southern Ontario, and the most rewarding restoration work we do.",
    housing:
      "Durand, Kirkendall, and Strathcona Victorians with original quarter-sawn oak, maple, and pine; dense post-war stock on the mountain; and converted industrial space downtown. Much of it has been rented for decades and abused accordingly.",
    typical:
      "Deep restoration, patching in salvaged boards, stair rebuilds in tall narrow flights, and refinishing that respects the original grade.",
    jobs: [
      "Century-home quarter-sawn restoration",
      "Salvage board patching",
      "Tall narrow stair rebuilds",
    ],
  },
  {
    slug: "ancaster",
    name: "Ancaster",
    region: "Hamilton",
    tier: "extended",
    blurb:
      "An old village core and a lot of large newer executive homes that want a stair to match the entrance.",
    housing:
      "Stone and brick houses around the original village, plus substantial 1990s–2010s detached stock on the surrounding lands. Budgets support wide plank and a feature flight.",
    typical:
      "Wide-plank white oak, walnut stair features, and matched railings in open-to-below foyers.",
    jobs: ["Executive-home wide plank", "Open-to-below feature stairs", "Village-core restoration"],
  },
  {
    slug: "dundas",
    name: "Dundas",
    region: "Hamilton",
    tier: "extended",
    blurb:
      "A heritage valley town where the houses are old, the streets are tight, and nothing is square.",
    housing:
      "Nineteenth-century brick and stone homes on narrow lots, many with original pine and early oak. Access is genuinely difficult — parking, stairs, and material handling all need planning before a crew arrives.",
    typical:
      "Careful heritage restoration, pine repair, and stair work in flights that predate any modern rise-and-run expectation.",
    jobs: ["Heritage pine restoration", "Pre-code stair rebuilds", "Tight-access refinishing"],
  },
  {
    slug: "bradford-west-gwillimbury",
    name: "Bradford West Gwillimbury",
    titleName: "Bradford",
    region: "Simcoe",
    tier: "extended",
    blurb:
      "Commuter growth at speed: new detached stock arriving faster than the trades who finish it properly.",
    housing:
      "Predominantly 2000s onward detached and townhouse construction, with an older core near Holland Street. Builder finishes throughout, and carpeted stairs as standard.",
    typical:
      "Stair and hallway packages before move-in, prefinished oak, and durable finishes for young families.",
    jobs: [
      "Pre-occupancy stair packages",
      "Main-floor prefinished installs",
      "Townhouse stair conversions",
    ],
  },
  {
    slug: "barrie",
    name: "Barrie",
    region: "Simcoe",
    tier: "extended",
    blurb:
      "Lakefront houses, an older downtown, and a great deal of new build — our furthest regular work, and worth the drive on the right job.",
    housing:
      "Century homes near the waterfront and downtown, dense 1970s–90s stock through the middle, and extensive newer subdivisions on the south and east edges.",
    typical:
      "Whole-home installs and stair packages rather than small repairs — the drive only makes sense on work of that size.",
    jobs: [
      "Whole-home hardwood installs",
      "Lakefront restoration",
      "Full stair and railing packages",
    ],
  },
  {
    slug: "innisfil",
    name: "Innisfil",
    region: "Simcoe",
    tier: "extended",
    blurb:
      "Cottages becoming houses, and Friday Harbour units that need an assembly built for a building that is empty half the year.",
    housing:
      "Former seasonal cottages converted to year-round use, lakefront rebuilds, and newer resort-style condominium stock. Humidity swings are extreme where heating is intermittent.",
    typical:
      "Engineered assemblies specified for unheated shoulder seasons, and solid hardwood only where the building is genuinely conditioned year round.",
    jobs: [
      "Cottage-to-house conversions",
      "Friday Harbour engineered installs",
      "Seasonal-humidity remediation",
    ],
  },
  {
    slug: "orangeville",
    name: "Orangeville",
    region: "Dufferin",
    tier: "extended",
    blurb:
      "A heritage main street with real Victorian housing behind it, and newer subdivisions on every edge.",
    housing:
      "Late-nineteenth-century brick homes through the core, mid-century infill, and 1990s onward detached growth. Original floors survive more often here than closer to the city.",
    typical:
      "Heritage refinishing, original-stair repair, and hardwood specified for a colder, drier winter than Toronto's.",
    jobs: ["Victorian floor restoration", "Original stair repair", "Subdivision stair conversions"],
  },
  {
    slug: "guelph",
    name: "Guelph",
    region: "Wellington",
    tier: "extended",
    blurb:
      "Limestone century homes with floors worth restoring, and a rental market that has been hard on all of them.",
    housing:
      "Limestone and brick Victorians through the older wards, dense student rental stock near the university, and newer detached growth in the south end. Original floors are frequently sound under decades of neglect.",
    typical:
      "Restoration over replacement, board patching, and finishes chosen for houses that will keep taking abuse.",
    jobs: [
      "Century-home restoration",
      "Rental-grade durable refinishing",
      "South-end new installs",
    ],
  },
];

export const coreCities = cities.filter((c) => c.tier === "core");
export const extendedCities = cities.filter((c) => c.tier === "extended");

export function getCity(slug: string) {
  return cities.find((c) => c.slug === slug);
}
