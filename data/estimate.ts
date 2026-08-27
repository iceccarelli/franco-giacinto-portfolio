export type ServiceKind = "install" | "refinish" | "stairs" | "railings" | "repair" | "deck";

export const serviceKinds: { id: ServiceKind; label: string; hint: string }[] = [
  { id: "install", label: "New hardwood install", hint: "Solid or engineered, room or whole home" },
  { id: "refinish", label: "Sanding & refinishing", hint: "Existing hardwood, dust-contained" },
  { id: "stairs", label: "Hardwood stairs", hint: "Retreads, box stairs, new flights" },
  { id: "railings", label: "Hardwood railings", hint: "Handrails, newels, balusters" },
  { id: "repair", label: "Repair & restoration", hint: "Water, pets, board replacement" },
  { id: "deck", label: "Hardwood deck / porch", hint: "Ipe-class or porch restoration" },
];

export const speciesOptions = [
  { id: "white-oak", label: "White oak", material: 8.4, labourMult: 1 },
  { id: "red-oak", label: "Red oak", material: 6.6, labourMult: 1 },
  { id: "walnut", label: "Walnut", material: 13.8, labourMult: 1.08 },
  { id: "maple", label: "Hard maple", material: 7.4, labourMult: 1.06 },
  { id: "hickory", label: "Hickory", material: 8.1, labourMult: 1.05 },
  { id: "engineered", label: "Engineered oak", material: 7.2, labourMult: 0.92 },
] as const;

export const patternOptions = [
  { id: "straight", label: "Straight / mixed width", mult: 1 },
  { id: "herringbone", label: "Herringbone", mult: 1.42 },
  { id: "chevron", label: "Chevron", mult: 1.52 },
  { id: "border", label: "Field + decorative border", mult: 1.18 },
] as const;

export const finishOptions = [
  { id: "prefinished", label: "Prefinished", add: 0, labourMult: 0.88 },
  { id: "matte", label: "Site-finished matte (waterborne 2K)", add: 3.4, labourMult: 1 },
  { id: "satin", label: "Site-finished satin (waterborne 2K)", add: 3.5, labourMult: 1 },
  { id: "oil", label: "Hardwax oil", add: 4.1, labourMult: 1.04 },
] as const;

export const cityMult: Record<string, number> = {
  toronto: 1.08,
  etobicoke: 1.05,
  "north-york": 1.04,
  scarborough: 1.0,
  mississauga: 1.02,
  brampton: 0.98,
  vaughan: 1.03,
  markham: 1.03,
  "richmond-hill": 1.03,
  oakville: 1.07,
  burlington: 1.04,
  milton: 0.99,
};

export type EstimateInput = {
  service: ServiceKind;
  sqft: number;
  species: (typeof speciesOptions)[number]["id"];
  pattern: (typeof patternOptions)[number]["id"];
  finish: (typeof finishOptions)[number]["id"];
  stairs: number;
  railingFt: number;
  city: string;
};

export type EstimateResult = {
  low: number;
  mid: number;
  high: number;
  perSqft?: number;
  timeline: string;
  notes: string[];
  lines: { label: string; amount: number }[];
};

export function emptyEstimate(): EstimateInput {
  return {
    service: "install",
    sqft: 800,
    species: "white-oak",
    pattern: "straight",
    finish: "matte",
    stairs: 0,
    railingFt: 0,
    city: "toronto",
  };
}

export function calculateEstimate(input: EstimateInput): EstimateResult {
  const species = speciesOptions.find((s) => s.id === input.species) ?? speciesOptions[0];
  const pattern = patternOptions.find((p) => p.id === input.pattern) ?? patternOptions[0];
  const finish = finishOptions.find((f) => f.id === input.finish) ?? finishOptions[1];
  const loc = cityMult[input.city] ?? 1.03;
  const sqft = Math.max(80, input.sqft);
  const stairs = Math.max(0, input.stairs);
  const rail = Math.max(0, input.railingFt);
  const notes: string[] = [];
  const lines: { label: string; amount: number }[] = [];

  let mid = 0;
  let timeline = "";

  if (input.service === "install") {
    const labour = 6.4 * species.labourMult * finish.labourMult;
    const material = species.material + finish.add;
    const unit = (labour + material) * pattern.mult * loc;
    mid = unit * sqft;
    lines.push({ label: `Floor field · ${sqft} sq ft`, amount: mid });
    timeline =
      sqft < 600 ? "3–5 working days" : sqft < 1500 ? "5–8 working days" : "8–14 working days";
    notes.push("Includes subfloor prep within 3/16\" over 10'. Extreme flattening is extra.");
    notes.push("HST extra. Site measure confirms moisture, transitions, and stair nosings.");
    if (pattern.id !== "straight")
      notes.push("Pattern work includes layout drawings before we cut.");
  } else if (input.service === "refinish") {
    const unit = 6.2 * loc * (finish.id === "oil" ? 1.08 : 1);
    mid = unit * sqft;
    lines.push({ label: `Dust-contained sand & finish · ${sqft} sq ft`, amount: mid });
    timeline = sqft < 900 ? "3–4 days incl. cure window" : "4–6 days incl. cure window";
    notes.push("Assumes a remaining wear layer. We stop and requote if we hit nails or plywood.");
    notes.push("Sock traffic typically 24 hours on waterborne 2K.");
  } else if (input.service === "stairs") {
    const per = 560 * species.labourMult * loc;
    const count = Math.max(7, stairs || 13);
    mid = per * count;
    lines.push({ label: `Hardwood treads & risers · ${count} steps`, amount: mid });
    timeline = count <= 14 ? "3–5 days" : "5–8 days";
    notes.push(
      "Open-side returned treads, curved flights, and painted-to-wood conversions add cost.",
    );
  } else if (input.service === "railings") {
    const per = 265 * loc;
    const ft = Math.max(8, rail || 24);
    mid = per * ft;
    lines.push({ label: `Handrail, newels, infill · ${ft} lin ft`, amount: mid });
    timeline = "2–4 days";
    notes.push("Through-bolted newels. Iron balusters quoted as an allowance in this range.");
  } else if (input.service === "repair") {
    const unit = 26 * loc;
    mid = Math.max(850, unit * Math.min(sqft, 250));
    lines.push({ label: "Board replacement, match, and blend refinish", amount: mid });
    timeline = "1–3 days plus finish cure";
    notes.push("Water-damage jobs start after moisture readings. Insurance paperwork included.");
  } else {
    const unit = 36 * loc;
    mid = unit * sqft;
    lines.push({ label: `Hardwood deck / porch · ${sqft} sq ft`, amount: mid });
    timeline = sqft < 250 ? "1 week" : "1–2 weeks";
    notes.push("Range assumes sound framing. Ledger rebuilds and permits are extra.");
  }

  if (input.service === "install" || input.service === "refinish") {
    if (stairs > 0) {
      const stairCost = stairs * 560 * loc * species.labourMult;
      mid += stairCost;
      lines.push({ label: `Add stair package · ${stairs} steps`, amount: stairCost });
    }
    if (rail > 0) {
      const railCost = rail * 265 * loc;
      mid += railCost;
      lines.push({ label: `Add railing · ${rail} lin ft`, amount: railCost });
    }
  }

  const low = mid * 0.86;
  const high = mid * 1.22;
  const perSqft =
    input.service === "install" || input.service === "refinish" || input.service === "deck"
      ? mid / sqft
      : undefined;

  return { low, mid, high, perSqft, timeline, notes, lines };
}
