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

/**
 * Single source of truth for the dimensional limits. `checkObc` evaluates
 * against these and `obcRules` describes them in prose, so the interactive
 * checker, the stair pages, and /llms-full.txt can never disagree about a number.
 */
export const OBC_LIMITS = {
  maxRiseMm: 200,
  minRunMm: 210,
  minTreadMm: 235,
  maxNosingMm: 25,
  handrailMinMm: 865,
  handrailMaxMm: 965,
  graspMinMm: 30,
  graspMaxMm: 45,
  minGuardMm: 900,
  handrailRiserTrigger: 3,
} as const;

export const obcRules: { id: string; label: string; rule: string; note?: string }[] = [
  {
    id: "rise",
    label: "Maximum rise",
    rule: `Rise must not exceed ${OBC_LIMITS.maxRiseMm} mm on a stair serving a dwelling unit.`,
  },
  {
    id: "run",
    label: "Minimum run",
    rule: `Run must be at least ${OBC_LIMITS.minRunMm} mm.`,
  },
  {
    id: "tread",
    label: "Minimum tread depth",
    rule: `Tread depth — run plus nosing projection — must be at least ${OBC_LIMITS.minTreadMm} mm.`,
  },
  {
    id: "nosing",
    label: "Nosing projection",
    rule: `Nosing projects no more than ${OBC_LIMITS.maxNosingMm} mm.`,
    note: "An over-projecting nosing is the single most common reason a retread flight fails inspection.",
  },
  {
    id: "handrail",
    label: "Handrail height",
    rule: `Where a stair has ${OBC_LIMITS.handrailRiserTrigger} or more risers, a handrail is required between ${OBC_LIMITS.handrailMinMm} mm and ${OBC_LIMITS.handrailMaxMm} mm above the tread nosing line.`,
  },
  {
    id: "grasp",
    label: "Graspable profile",
    rule: `A circular handrail profile is graspable between ${OBC_LIMITS.graspMinMm} mm and ${OBC_LIMITS.graspMaxMm} mm in diameter.`,
    note: "A flat 2x6 cap rail is not a graspable profile, however good it looks in a photo.",
  },
  {
    id: "guard",
    label: "Guard height",
    rule: `Guards at the side of a dwelling stair must be at least ${OBC_LIMITS.minGuardMm} mm high measured from the tread nosing line.`,
  },
  {
    id: "uniformity",
    label: "Uniformity",
    rule: "Rise and run must be uniform within a flight; small accumulated differences are how a stair becomes a trip hazard.",
  },
];

/** Typical dwelling-unit stair rules under OBC Part 9. The inspector still wins. */
export function checkObc(input: ObcInput) {
  const tread = input.runMm + input.nosingMm;
  const checks: ObcCheck[] = [
    {
      id: "rise",
      label: "Maximum rise",
      ok: input.riseMm > 0 && input.riseMm <= OBC_LIMITS.maxRiseMm,
      detail:
        input.riseMm <= OBC_LIMITS.maxRiseMm
          ? `${input.riseMm} mm is within the ${OBC_LIMITS.maxRiseMm} mm dwelling maximum.`
          : `${input.riseMm} mm exceeds ${OBC_LIMITS.maxRiseMm} mm. This flight will fail inspection.`,
    },
    {
      id: "run",
      label: "Minimum run",
      ok: input.runMm >= OBC_LIMITS.minRunMm,
      detail:
        input.runMm >= OBC_LIMITS.minRunMm
          ? `${input.runMm} mm meets the ${OBC_LIMITS.minRunMm} mm minimum run.`
          : `${input.runMm} mm is short of ${OBC_LIMITS.minRunMm} mm. Lengthen the run or rebuild the stringer.`,
    },
    {
      id: "tread",
      label: "Tread depth (run + nosing)",
      ok: tread >= OBC_LIMITS.minTreadMm,
      detail:
        tread >= OBC_LIMITS.minTreadMm
          ? `${tread} mm tread depth meets the ${OBC_LIMITS.minTreadMm} mm minimum.`
          : `${tread} mm is short. Add nosing or increase run until you clear ${OBC_LIMITS.minTreadMm} mm.`,
    },
    {
      id: "nosing",
      label: "Nosing projection",
      ok: input.nosingMm >= 0 && input.nosingMm <= OBC_LIMITS.maxNosingMm,
      detail:
        input.nosingMm <= OBC_LIMITS.maxNosingMm
          ? `${input.nosingMm} mm nosing is inside the typical 0–${OBC_LIMITS.maxNosingMm} mm window.`
          : `${input.nosingMm} mm nosing is a trip. Cut it back to ${OBC_LIMITS.maxNosingMm} mm or less.`,
    },
    {
      id: "handrail-req",
      label: "Handrail required",
      ok:
        input.risers < OBC_LIMITS.handrailRiserTrigger ||
        (input.handrailMm >= OBC_LIMITS.handrailMinMm &&
          input.handrailMm <= OBC_LIMITS.handrailMaxMm),
      detail:
        input.risers < OBC_LIMITS.handrailRiserTrigger
          ? `Fewer than ${OBC_LIMITS.handrailRiserTrigger} risers — a handrail is not the usual trigger.`
          : input.handrailMm >= OBC_LIMITS.handrailMinMm &&
              input.handrailMm <= OBC_LIMITS.handrailMaxMm
            ? `${input.handrailMm} mm handrail height sits in the ${OBC_LIMITS.handrailMinMm}–${OBC_LIMITS.handrailMaxMm} mm band.`
            : `Handrail at ${input.handrailMm} mm is outside ${OBC_LIMITS.handrailMinMm}–${OBC_LIMITS.handrailMaxMm} mm.`,
    },
    {
      id: "grasp",
      label: "Graspable profile",
      ok:
        input.railDiameterMm >= OBC_LIMITS.graspMinMm &&
        input.railDiameterMm <= OBC_LIMITS.graspMaxMm,
      detail:
        input.railDiameterMm >= OBC_LIMITS.graspMinMm &&
        input.railDiameterMm <= OBC_LIMITS.graspMaxMm
          ? `${input.railDiameterMm} mm circular profile is graspable.`
          : `${input.railDiameterMm} mm is not a graspable circular profile. A 2x6 cap will fail.`,
    },
    {
      id: "guard",
      label: "Guard height",
      ok: input.guardMm >= OBC_LIMITS.minGuardMm,
      detail:
        input.guardMm >= OBC_LIMITS.minGuardMm
          ? `${input.guardMm} mm meets the ${OBC_LIMITS.minGuardMm} mm dwelling-stair guard.`
          : `${input.guardMm} mm is under ${OBC_LIMITS.minGuardMm} mm. Do not install a pretty short guard.`,
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
