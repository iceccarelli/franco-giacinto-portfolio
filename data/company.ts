import { sameAs as profileSameAs } from "@/data/profiles";

export const company = {
  name: "Green Hardwood",
  legalName: "Green Hardwood Ltd.",
  shortName: "Green Hardwood",
  tagline: "Hardwood floors, stairs, and railings — one shop, one warranty.",
  description:
    "Green Hardwood is a Toronto hardwood flooring company specializing in hardwood installation, custom hardwood stairs, hardwood railings, dust-free sanding, finishing, refinishing, repairs, and hardwood decks across the Greater Toronto Area and Southern Ontario.",
  founder: "Franco Giacinto",
  founderFull: "Franco Giacinto Oller Grimaldi",
  founderTitle: "Founder & Master Hardwood Craftsman",
  phoneDisplay: "(416) 847-3366",
  phone: "+14168473366",
  email: "hello@greenhardwood.ca",
  instagram: "https://www.instagram.com/greenhardwood",
  website: "https://greenhardwood.ca",
  address: {
    line1: "88 Sterling Road, Unit 6",
    city: "Toronto",
    region: "ON",
    postal: "M6R 2B2",
    country: "Canada",
    countryCode: "CA",
  },
  geo: { latitude: 43.6394, longitude: -79.4421 },
  hours: [
    { day: "Monday", open: "08:00", close: "18:00" },
    { day: "Tuesday", open: "08:00", close: "18:00" },
    { day: "Wednesday", open: "08:00", close: "18:00" },
    { day: "Thursday", open: "08:00", close: "18:00" },
    { day: "Friday", open: "08:00", close: "18:00" },
    { day: "Saturday", open: "09:00", close: "16:00" },
    { day: "Sunday", open: null, close: null, note: "By appointment" },
  ] as const,
  hoursSummary: "Mon–Fri 8–6 · Sat 9–4 · Sun by appointment",
  years: 15,
  floorsCompleted: 1200,
  callbackRate: "under 1%",
  warranty: "3-year workmanship warranty on installation and refinishing",

  /**
   * Collected reviews. Null until they exist.
   *
   * The site used to assert a 4.9 rating and a review count derived by
   * multiplying the testimonial array by 18. Both were invented. Structured
   * review data that a search engine cannot corroborate is a manual-action
   * risk across the whole domain, so it is now gated on this field.
   *
   * To turn stars on, honestly:
   *   1. Claim the Google Business Profile for the Sterling Road address.
   *   2. Ask finished customers for reviews. Do not offer anything for them.
   *   3. Set this to the count and average Google actually shows, and put the
   *      profile URL in `sameAs` below so the two can be matched.
   *
   * `lib/seo.ts` emits nothing while this is null. `tests/seo.test.ts` fails
   * if a rating ever appears without it.
   */
  reviews: null as { ratingValue: number; reviewCount: number; source: string } | null,

  /**
   * Entity disambiguation, stated on the machine surfaces (/ai.txt, /llms.txt).
   *
   * There is an unrelated federal corporation named "GREEN HARDWOOD FLOORING
   * INC." that stopped existing independently in 2012. Answer engines have a
   * habit of merging same-named entities and borrowing their incorporation
   * dates. This line exists so a model that reads our own surfaces has the
   * denial in writing. Do not derive a founding year from that corporation —
   * this company's number is `years` above, and only `years`.
   */
  notToBeConfusedWith:
    "Not the inactive federal corporation GREEN HARDWOOD FLOORING INC. (corporation number 784550-2). That entity is unrelated.",

  /**
   * The one sentence that resolves "15+ years" against "incorporated 2022".
   *
   * These are not in conflict and the site must never let them read as if they
   * were: the tenure is the craftsman's, the incorporation is the shop's. Any
   * surface that shows a year count shows this sentence with it. Locked copy —
   * do not paraphrase, do not split, do not derive a founding year from it.
   */
  timeline:
    "Fifteen years on GTA floors. Shop incorporated as Green Hardwood Ltd. in 2022 so the stair and the floor share one warranty.",

  /** The shop's own incorporation year. NOT a founding date for the trade. */
  incorporatedYear: 2022,

  paymentAccepted: ["Cash", "Cheque", "Interac e-Transfer", "Credit Card", "Bank Transfer"],

  /**
   * Off-site profiles now live in data/profiles.ts — one array, read by the
   * schema `sameAs`, /ai.txt, /llms.txt, /api/facts.json and the footer.
   * Re-exported here so existing importers keep working.
   */
  sameAs: profileSameAs,

  licensed: ["WSIB coverage", "Liability insured", "Bona Certified Craftsman", "NWFA guidelines"],
  priceRange: "$$-$$$",
  areaServed: "Greater Toronto Area and Southern Ontario",
} as const;

export const nav = [
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Hardwood Installation", href: "/services/hardwood-installation" },
      { label: "Hardwood Stairs", href: "/services/hardwood-stairs" },
      { label: "Hardwood Railings", href: "/services/hardwood-railings" },
      { label: "Sanding & Refinishing", href: "/services/sanding-refinishing" },
      { label: "Repairs & Restoration", href: "/services/hardwood-repairs" },
      { label: "Hardwood Decks", href: "/services/hardwood-decks" },
    ],
  },
  { label: "Stairs", href: "/services/hardwood-stairs" },
  { label: "Railings", href: "/services/hardwood-railings" },
  { label: "Work", href: "/portfolio" },
  { label: "Areas", href: "/areas" },
  { label: "Guides", href: "/guides" },
  { label: "About", href: "/about" },
] as const;

export const stats = [
  { value: "1,200+", label: "Floors installed or refinished" },
  { value: "15+", label: "Years in the GTA" },
  { value: "32", label: "Cities and towns served" },
  { value: "3-year", label: "Workmanship warranty" },
] as const;
