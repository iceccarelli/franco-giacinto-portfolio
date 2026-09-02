import type { ServiceKind } from "@/data/estimate";
import { IMAGES_WITH_VARIANTS, pickVariant, variantsOf } from "@/data/images";

/**
 * One visual per estimator service — the thing a homeowner actually decides on.
 *
 * ── Why this file is mostly empty slots ───────────────────────────────────
 *
 * A before/after slider is the most persuasive element a trade website can
 * carry, and it is also the easiest to fake. Two frames placed side by side
 * are not decoration; they are an assertion that *this floor became that
 * floor*. That assertion is either true or it is a lie, and no caption
 * softens it.
 *
 * `docs/HONEST-LIMITS.md` records that every photograph in `public/images` is
 * AI-generated. There is exactly one pair in the repository —
 * `before-worn.jpg` and `after-refinished.jpg` — and the two frames are not
 * even the same room: the "before" is a bare-boarded floor by a window, the
 * "after" is a hallway with a staircase. They are two unrelated renders that
 * happen to sit either side of a slider.
 *
 * So this file does two things. It gives every service a real visual, because
 * people buy with their eyes and an empty section helps nobody. And it marks
 * which of those visuals is a *comparison* — currently none — so the UI can
 * never quietly present a manufactured transformation as evidence.
 *
 * ── What turns a slot into a pair ─────────────────────────────────────────
 *
 * `verified: true` is set when, and only when, both frames are photographs of
 * the same place from the same position, taken by this shop, of a job it did.
 * `tests/comparisons.test.ts` fails the build if a pair is marked verified
 * while pointing at any file in the AI-generated set.
 *
 * The shot list Franco needs is written out in `docs/OFFSITE_BLOCKERS.md`
 * item 12. It is twelve photographs, it needs no equipment beyond the phone
 * already in his pocket, and it is worth more than every rendering on this
 * site put together.
 */

export type Comparison = {
  kind: ServiceKind;
  /** Heading for the block. */
  label: string;
  /** One line on what the eye should be looking for. */
  lookFor: string;
} & (
  | {
      mode: "pair";
      before: string;
      after: string;
      beforeAlt: string;
      afterAlt: string;
      /** Both frames are real photographs of the same real place. */
      verified: boolean;
    }
  | {
      mode: "still";
      image: string;
      alt: string;
      /** Why there is no comparison here yet. Rendered, not hidden. */
      pending: string;
    }
);

/**
 * Every photograph on this site is a commissioned rendering, so the synthetic
 * set is simply all of them — derived rather than typed, because a list of 74
 * literals is a list that goes stale the first time a file is added.
 *
 * The day a real photograph lands it will not be in `IMAGES_WITH_VARIANTS`,
 * will therefore not be here, and `tests/images.test.ts` will fail with
 * "the honesty guard has a hole". That failure is the point: it forces someone
 * to decide deliberately whether the new file is documentary or another
 * rendering, instead of the guard quietly shrinking.
 */
export const SYNTHETIC_IMAGES: readonly string[] = IMAGES_WITH_VARIANTS.flatMap(variantsOf);

/** The sentence that renders under any slot that is not a verified pair. */
export const ILLUSTRATIVE_NOTE =
  "Illustrative rendering, not documentary job photography. We will not put a manufactured before-and-after in front of you.";

export const comparisons: Record<ServiceKind, Comparison> = {
  refinish: {
    kind: "refinish",
    label: "Sanding & refinishing",
    lookFor:
      "The traffic lanes and the grey, and whether the grain comes back rather than gets buried under a darker stain.",
    mode: "pair",
    before: "/images/ba-refinish-before.jpg",
    after: "/images/ba-refinish-after.jpg",
    beforeAlt:
      "A bay-window living room with red oak boards dulled grey, finish worn through along the traffic lane to the hall.",
    afterAlt:
      "The same room after sanding and refinishing, the oak grain legible under a warm matte finish.",
    verified: false,
  },
  install: {
    kind: "install",
    label: "New hardwood install",
    lookFor:
      "Board width, how the run meets the doorways, and whether the pattern is square to the room rather than to the longest wall.",
    mode: "pair",
    before: "/images/ba-install-before.jpg",
    after: "/images/ba-install-after.jpg",
    beforeAlt:
      "An empty main floor with a bare plywood subfloor, chalk snap-lines still visible, trim not yet installed.",
    afterAlt:
      "The same floor with wide-plank white oak installed and site-finished, running toward the windows.",
    verified: false,
  },
  stairs: {
    kind: "stairs",
    label: "Hardwood stairs",
    lookFor:
      "The nosing line, the returned tread ends, and whether the stair matches the floor it lands on.",
    mode: "pair",
    before: "/images/ba-stairs-before.jpg",
    after: "/images/ba-stairs-after.jpg",
    beforeAlt:
      "A straight interior flight covered in worn builder-grade carpet with a dated oak-veneer handrail.",
    afterAlt:
      "The same flight in solid white oak treads with painted risers and slim iron balusters.",
    verified: false,
  },
  railings: {
    kind: "railings",
    label: "Hardwood railings",
    lookFor:
      "Whether the rail is graspable, how the newel meets the floor, and the joint at the turn.",
    mode: "pair",
    before: "/images/ba-railings-before.jpg",
    after: "/images/ba-railings-after.jpg",
    beforeAlt:
      "An open-to-below landing with a low flat-top wooden railing and wide-spaced spindles.",
    afterAlt:
      "The same landing with a graspable oak handrail at code height, through-bolted newel and iron balusters.",
    verified: false,
  },
  repair: {
    kind: "repair",
    label: "Repair & restoration",
    lookFor:
      "Where the replaced boards are. On a job that went right, you should not be able to tell.",
    mode: "pair",
    before: "/images/ba-repair-before.jpg",
    after: "/images/ba-repair-after.jpg",
    beforeAlt:
      "Red oak flooring by a kitchen toe-kick, cupped and blackened across a patch about a metre wide.",
    afterAlt:
      "The same square metre with grain-matched boards let in and blended, the repair no longer findable.",
    verified: false,
  },
  deck: {
    kind: "deck",
    label: "Hardwood deck / porch",
    lookFor:
      "The fastener pattern, the ledger detail at the wall, and how the boards meet the rail posts.",
    mode: "pair",
    before: "/images/ba-deck-before.jpg",
    after: "/images/ba-deck-after.jpg",
    beforeAlt:
      "A weathered grey back deck on a brick house, boards splitting and a section sagging near the wall.",
    afterAlt:
      "The same deck rebuilt in dense dark hardwood with hidden fasteners and a stainless cable rail.",
    verified: false,
  },
};

/**
 * The comparison for one service, optionally in its second rendition.
 *
 * Two sets were commissioned, so the estimator and the service page can show
 * different rooms for the same job — which reads as a shop that has done this
 * many times rather than one that owns a single photograph.
 */
export function comparisonFor(kind: ServiceKind, seed?: string): Comparison {
  const c = comparisons[kind];
  if (!seed || c.mode !== "pair") return c;
  return {
    ...c,
    before: pickVariant(c.before, seed),
    after: pickVariant(c.after, seed),
  };
}

/** True when a real, photographed comparison exists for this service. */
export function hasVerifiedPair(kind: ServiceKind) {
  const c = comparisons[kind];
  return c.mode === "pair" && c.verified;
}
