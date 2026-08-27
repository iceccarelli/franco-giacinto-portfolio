export type ObcInput = {
  riseMm: number;
  runMm: number;
  nosingMm: number;
  risers: number;
  guardMm: number;
  handrailMm: number;
  railDiameterMm: number;
};

export type ObcCheck = {
  id: string;
  label: string;
  ok: boolean;
  detail: string;
};

/** Typical dwelling-unit stair rules under OBC Part 9. The inspector still wins. */
export function checkObc(input: ObcInput) {
  const tread = input.runMm + input.nosingMm;
  const checks: ObcCheck[] = [
    {
      id: "rise",
      label: "Maximum rise",
      ok: input.riseMm > 0 && input.riseMm <= 200,
      detail:
        input.riseMm <= 200
          ? `${input.riseMm} mm is within the 200 mm dwelling maximum.`
          : `${input.riseMm} mm exceeds 200 mm. This flight will fail inspection.`,
    },
    {
      id: "run",
      label: "Minimum run",
      ok: input.runMm >= 210,
      detail:
        input.runMm >= 210
          ? `${input.runMm} mm meets the 210 mm minimum run.`
          : `${input.runMm} mm is short of 210 mm. Lengthen the run or rebuild the stringer.`,
    },
    {
      id: "tread",
      label: "Tread depth (run + nosing)",
      ok: tread >= 235,
      detail:
        tread >= 235
          ? `${tread} mm tread depth meets the 235 mm minimum.`
          : `${tread} mm is short. Add nosing or increase run until you clear 235 mm.`,
    },
    {
      id: "nosing",
      label: "Nosing projection",
      ok: input.nosingMm >= 0 && input.nosingMm <= 25,
      detail:
        input.nosingMm <= 25
          ? `${input.nosingMm} mm nosing is inside the typical 0–25 mm window.`
          : `${input.nosingMm} mm nosing is a trip. Cut it back to 25 mm or less.`,
    },
    {
      id: "handrail-req",
      label: "Handrail required",
      ok: input.risers <= 2 || (input.handrailMm >= 865 && input.handrailMm <= 965),
      detail:
        input.risers <= 2
          ? "Fewer than three risers — a handrail is not the usual trigger."
          : input.handrailMm >= 865 && input.handrailMm <= 965
            ? `${input.handrailMm} mm handrail height sits in the 865–965 mm band.`
            : `Handrail at ${input.handrailMm} mm is outside 865–965 mm.`,
    },
    {
      id: "grasp",
      label: "Graspable profile",
      ok: input.railDiameterMm >= 30 && input.railDiameterMm <= 45,
      detail:
        input.railDiameterMm >= 30 && input.railDiameterMm <= 45
          ? `${input.railDiameterMm} mm circular profile is graspable.`
          : `${input.railDiameterMm} mm is not a graspable circular profile. A 2x6 cap will fail.`,
    },
    {
      id: "guard",
      label: "Guard height",
      ok: input.guardMm >= 900,
      detail:
        input.guardMm >= 900
          ? `${input.guardMm} mm meets the 900 mm dwelling-stair guard.`
          : `${input.guardMm} mm is under 900 mm. Do not install a pretty short guard.`,
    },
  ];

  const pass = checks.every((c) => c.ok);
  const notes = [
    "Figures follow Ontario Building Code Part 9 for typical dwelling stairs. Curved flights, winders, and public stairs have additional rules.",
    "Uniformity matters: rise and run should not vary more than a few millimetres in the same flight.",
    "Green Hardwood will not build a stair that fails these checks, even if the rendering looks floating.",
  ];

  return { pass, checks, notes, tread };
}

export const defaultObc = (): ObcInput => ({
  riseMm: 180,
  runMm: 255,
  nosingMm: 25,
  risers: 13,
  guardMm: 900,
  handrailMm: 915,
  railDiameterMm: 40,
});
