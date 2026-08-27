export type Project = {
  slug: string;
  title: string;
  location: string;
  citySlug: string;
  category: "install" | "refinish" | "stairs" | "repair" | "custom" | "commercial" | "deck";
  type: "Residential" | "Commercial";
  image: string;
  imageAlt: string;
  before?: string;
  after?: string;
  summary: string;
  details: string;
  specs: string[];
};

export const projects: Project[] = [
  {
    slug: "forest-hill-heritage",
    title: "Forest Hill heritage restoration",
    location: "Forest Hill, Toronto",
    citySlug: "toronto",
    category: "refinish",
    type: "Residential",
    image: "/images/project-forest-hill.jpg",
    imageAlt:
      "Restored quarter-sawn white oak floors in a 1920s Forest Hill home with original millwork.",
    before: "/images/before-worn.jpg",
    after: "/images/project-forest-hill.jpg",
    summary:
      "Complete restoration of 1920s quarter-sawn white oak. Hand-worked finish, custom walnut stain.",
    details:
      "The floors had been screen-coated twice in twenty years and still showed traffic lanes. We sanded to a honest grit sequence, repaired two water-stained boards at the butler's pantry, and finished in a custom walnut toner under a matte waterborne two-component. Stairs were included so the run from foyer to third floor reads as one piece of millwork.",
    specs: ["1,850 sq ft", "Quarter-sawn white oak", "Custom stain", "Matched 28 treads"],
  },
  {
    slug: "king-west-herringbone",
    title: "King West penthouse herringbone",
    location: "King West, Toronto",
    citySlug: "toronto",
    category: "install",
    type: "Residential",
    image: "/images/project-herringbone.jpg",
    imageAlt: "European oak herringbone hardwood floor in a King West penthouse with city views.",
    summary: "2,400 sq ft engineered European oak in herringbone over radiant heat.",
    details:
      'Concrete plus hydronic radiant is a specification, not a suggestion. We used a 5/8" engineered European oak, the adhesive the mill warrants over heat, and a herringbone field that is actually square to the lake view, not to the longest wall. Floating would have voided the warranty. We did not float it.',
    specs: ["2,400 sq ft", "Engineered European oak", "Herringbone", "Radiant compatible"],
  },
  {
    slug: "oakville-estate-stair",
    title: "Oakville estate staircase",
    location: "Southeast Oakville",
    citySlug: "oakville",
    category: "stairs",
    type: "Residential",
    image: "/images/project-oakville-stairs.jpg",
    imageAlt:
      "Three-storey custom walnut staircase with iron balusters in an Oakville estate foyer.",
    summary: "Custom walnut staircase, box newels, iron balusters, 32 steps across three floors.",
    details:
      "The designer wanted a floating look. The inspector wanted a graspable rail and a guard. We drew both, built walnut treads with returned ends, through-bolted the newels, and finished the rail in a hardwax oil that can be repaired without resanding three storeys.",
    specs: ["32 steps", "Walnut treads", "Iron balusters", "OBC-compliant rail"],
  },
  {
    slug: "rosedale-medallion",
    title: "Rosedale compass rose",
    location: "Rosedale, Toronto",
    citySlug: "toronto",
    category: "custom",
    type: "Residential",
    image: "/images/project-inlay.jpg",
    imageAlt:
      "Hand-cut compass rose medallion in walnut, maple, and cherry set into a dining-room floor.",
    summary: "48-inch hand-cut compass rose in walnut, maple, and cherry.",
    details:
      "Cut in the shop, dry-fitted on a template, then let into a white-oak dining field. The Persian rug was specified after, so the medallion is sized to read when the rug is pulled for holidays — not hidden under it.",
    specs: ["48 in medallion", "Walnut / maple / cherry", "White oak field"],
  },
  {
    slug: "richmond-hill-condo",
    title: "Richmond Hill occupied refinish",
    location: "Richmond Hill",
    citySlug: "richmond-hill",
    category: "refinish",
    type: "Residential",
    image: "/images/after-refinished.jpg",
    imageAlt: "Freshly refinished maple hardwood floors in a bright Toronto-area condo.",
    before: "/images/before-worn.jpg",
    after: "/images/after-refinished.jpg",
    summary: "Dust-contained refinishing of 1,100 sq ft maple. Same-night return.",
    details:
      "Occupied unit, two cats, condo quiet hours. Containment, elevator protection, and a waterborne system with a 24-hour sock window. The before photos are why people think they need vinyl. They did not.",
    specs: ["1,100 sq ft", "Hard maple", "Dust containment", "24-hour sock traffic"],
  },
  {
    slug: "etobicoke-restaurant",
    title: "Etobicoke dining room",
    location: "Etobicoke",
    citySlug: "etobicoke",
    category: "commercial",
    type: "Commercial",
    image: "/images/project-etobicoke.jpg",
    imageAlt:
      "Restaurant with wide-plank ash hardwood floors and a reclaimed barn-board feature wall.",
    summary:
      "Wide-plank ash and a reclaimed feature wall. Commercial-grade oil for dinner traffic.",
    details:
      "Installed overnight across four nights so the room opened Friday. Ash was chosen because it hides the scuffs a walnut floor would advertise by week three. Maintenance is a monthly clean and a yearly oil, written into the chef's closing list.",
    specs: ["Overnight phasing", "Wide-plank ash", "Commercial oil", "Feature wall"],
  },
  {
    slug: "vaughan-new-build",
    title: "Vaughan 4,200 sq ft new build",
    location: "Vaughan",
    citySlug: "vaughan",
    category: "install",
    type: "Residential",
    image: "/images/hero-living.jpg",
    imageAlt:
      "Wide-plank white oak hardwood floors in a sunlit living room with forest-green millwork.",
    summary: "Full-home solid white oak, site-finished matte, seamless through all living levels.",
    details:
      'Builder left carpet on stairs and a floating laminate on the main. We pulled both, flattened the subfloor, installed 7" white oak, and site-finished so the stair and the floor are the same formula. Move-in was a Thursday. We were off site Wednesday.',
    specs: ["4,200 sq ft", "7 in white oak", "Site-finished matte", "Matched stairs"],
  },
  {
    slug: "mississauga-water",
    title: "Mississauga water-damage repair",
    location: "Mississauga",
    citySlug: "mississauga",
    category: "repair",
    type: "Residential",
    image: "/images/service-repair.jpg",
    imageAlt: "Grain-matched replacement boards being fitted into a water-damaged oak floor.",
    summary:
      "Emergency board replacement after a supply-line flood. 15-year-old red oak, invisible seams.",
    details:
      "Insurance wanted a patch. The owner wanted it gone from the photograph. We sourced same-era red oak, acclimated it to the surviving field, and refinished the kitchen as a whole so there is no 'repair island.'",
    specs: ["Insurance coordination", "Red oak match", "Kitchen refinish"],
  },
  {
    slug: "high-park-deck",
    title: "High Park hardwood deck",
    location: "High Park, Toronto",
    citySlug: "toronto",
    category: "deck",
    type: "Residential",
    image: "/images/service-deck.jpg",
    imageAlt: "Hardwood deck with cable railing at golden hour behind a brick Toronto house.",
    summary: "Dense hardwood decking, hidden fasteners, cable rail, rebuilt ledger flashing.",
    details:
      "The old cedar had cooked the ledger. We rebuilt the envelope first, then the deck. Pretty boards on a wet rim joist is how you buy the job twice.",
    specs: ["Hidden fasteners", "Ledger rebuild", "Cable rail"],
  },
];

export const projectFilters = [
  { id: "all", label: "All work" },
  { id: "install", label: "Install" },
  { id: "refinish", label: "Refinish" },
  { id: "stairs", label: "Stairs" },
  { id: "repair", label: "Repair" },
  { id: "custom", label: "Custom" },
  { id: "commercial", label: "Commercial" },
  { id: "deck", label: "Decks" },
] as const;
