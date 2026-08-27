export type SpeciesId = "white-oak" | "red-oak" | "walnut" | "maple" | "hickory" | "engineered-oak";

export type Species = {
  id: SpeciesId;
  name: string;
  hardness: string;
  janka: number;
  bestFor: string;
  tone: string;
  verdict: string;
  plank: string;
  grain: string;
  rooms: string[];
};

// Non-empty tuple: makes getSpecies() total, so callers never handle `undefined`.
export const species: [Species, ...Species[]] = [
  {
    id: "white-oak",
    name: "White Oak",
    hardness: "1360 Janka",
    janka: 1360,
    bestFor: "Almost every GTA house",
    tone: "Straw to brown, takes grey and walnut stains cleanly",
    verdict:
      "The default correct answer in Toronto right now. Hard, stable enough, stains well, resale-friendly. Specify rift/quartered if you hate cathedral grain.",
    plank: "#c9a36e",
    grain: "#8a6840",
    rooms: ["Whole home", "Foyer", "Kitchen", "Stairs"],
  },
  {
    id: "red-oak",
    name: "Red Oak",
    hardness: "1290 Janka",
    janka: 1290,
    bestFor: "Refinishing existing 80s–2000s floors",
    tone: "Warm pink-brown, loud grain",
    verdict:
      "Do not rip out good red oak to chase fashion. Sand it, tone it cooler if you must, and keep the decades of wear layer you already paid for.",
    plank: "#c0854a",
    grain: "#7a4a28",
    rooms: ["Existing houses", "Hallways", "Bedrooms"],
  },
  {
    id: "walnut",
    name: "Walnut",
    hardness: "1010 Janka",
    janka: 1010,
    bestFor: "Feature stairs, dining rooms, low-grit households",
    tone: "Chocolate, purple-brown, ages amber",
    verdict:
      "Beautiful and softer. We love it on stairs and borders. We hesitate on kitchens with chefs who drop Dutch ovens.",
    plank: "#5c3a24",
    grain: "#3a2418",
    rooms: ["Stairs", "Dining", "Library"],
  },
  {
    id: "maple",
    name: "Hard Maple",
    hardness: "1450 Janka",
    janka: 1450,
    bestFor: "Light Scandinavian rooms, gyms, tight-grain looks",
    tone: "Cream, little figure",
    verdict:
      "Harder than oak, shows every dent and every drop of water as a black spot if the finish is breached. Stain is unforgiving. Specify only if you mean it.",
    plank: "#e4d3ae",
    grain: "#c4b08a",
    rooms: ["Bedrooms", "Studios", "Gyms"],
  },
  {
    id: "hickory",
    name: "Hickory",
    hardness: "1820 Janka",
    janka: 1820,
    bestFor: "Dogs, kids, mudrooms, rustic rooms",
    tone: "Wild contrast, blond to dark",
    verdict:
      "The toughest domestic. Grain is busy. If you want quiet architecture, pick oak. If you want a floor that wins against Labradors, pick hickory.",
    plank: "#c4a06a",
    grain: "#6b4423",
    rooms: ["Family rooms", "Mudrooms", "Dog houses"],
  },
  {
    id: "engineered-oak",
    name: "Engineered Oak",
    hardness: "Varies with wear layer",
    janka: 1360,
    bestFor: "Condos, slabs, radiant heat, below grade",
    tone: "Whatever the mill stains",
    verdict:
      "Not a downgrade when specified correctly. Wear layer thickness decides whether you can refinish. We will not install a 0.6 mm photograph of wood and call it hardwood.",
    plank: "#c7ae7e",
    grain: "#8d6b45",
    rooms: ["Condos", "Radiant", "Basements"],
  },
];

export function getSpecies(id: string): Species {
  return species.find((s) => s.id === id) ?? species[0];
}
