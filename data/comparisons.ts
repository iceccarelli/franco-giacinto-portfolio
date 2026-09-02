import type { ServiceKind } from "@/data/estimate";

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

/** Files known to be AI-generated. A verified pair may never use one. */
export const SYNTHETIC_IMAGES = [
  "/images/before-worn.jpg",
  "/images/after-refinished.jpg",
  "/images/hero-living.jpg",
  "/images/hero-stairs.jpg",
  "/images/project-etobicoke.jpg",
  "/images/project-forest-hill.jpg",
  "/images/project-herringbone.jpg",
  "/images/project-inlay.jpg",
  "/images/project-oakville-stairs.jpg",
  "/images/railing-join.jpg",
  "/images/service-deck.jpg",
  "/images/service-install.jpg",
  "/images/service-railings.jpg",
  "/images/service-refinish.jpg",
  "/images/service-repair.jpg",
  "/images/service-stairs.jpg",
  "/images/stair-studio.jpg",
  "/images/workshop.jpg",
] as const;

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
    before: "/images/before-worn.jpg",
    after: "/images/after-refinished.jpg",
    beforeAlt: "Worn, grey-toned hardwood boards with visible traffic wear before refinishing.",
    afterAlt: "Refinished oak flooring in a hallway, grain legible under a matte finish.",
    // The two frames are not the same room. Until they are photographs of one
    // real floor, this is a demonstration of the control, not evidence.
    verified: false,
  },
  install: {
    kind: "install",
    label: "New hardwood install",
    lookFor: "Board width, how the run meets the doorways, and whether the pattern is square to the room.",
    mode: "still",
    image: "/images/service-install.jpg",
    alt: "Wide-plank white oak flooring running through a bright living room.",
    pending:
      "A subfloor before, and the finished field from the same doorway after. Two photographs, one job.",
  },
  stairs: {
    kind: "stairs",
    label: "Hardwood stairs",
    lookFor: "The nosing line, the returned tread ends, and whether the stair matches the floor it lands on.",
    mode: "still",
    image: "/images/service-stairs.jpg",
    alt: "White oak box stairs with iron balusters and a matched hardwood floor.",
    pending:
      "The carpeted flight before, and the finished flight from the same step after. This is the shop's signature job and it has no before frame.",
  },
  railings: {
    kind: "railings",
    label: "Hardwood railings",
    lookFor: "Whether the rail is graspable, how the newel meets the floor, and the joint at the turn.",
    mode: "still",
    image: "/images/service-railings.jpg",
    alt: "Hardwood handrail with through-bolted newel post and iron balusters.",
    pending: "The original rail before, and the code-compliant replacement from the same landing.",
  },
  repair: {
    kind: "repair",
    label: "Repair & restoration",
    lookFor: "Where the replaced boards are. On a job that went right, you should not be able to tell.",
    mode: "still",
    image: "/images/service-repair.jpg",
    alt: "Grain-matched replacement boards being fitted into a damaged oak floor.",
    pending:
      "The damage before, and the same square metre after. This is the service where a comparison does the most work, because the whole claim is that the repair disappears.",
  },
  deck: {
    kind: "deck",
    label: "Hardwood deck / porch",
    lookFor: "The fastener pattern, the ledger detail at the wall, and how the boards meet the rail posts.",
    mode: "still",
    image: "/images/service-deck.jpg",
    alt: "Hardwood deck with hidden fasteners and a cable rail behind a brick house.",
    pending: "The weathered deck before, and the rebuilt one from the same corner of the yard.",
  },
};

export function comparisonFor(kind: ServiceKind) {
  return comparisons[kind];
}

/** True when a real, photographed comparison exists for this service. */
export function hasVerifiedPair(kind: ServiceKind) {
  const c = comparisons[kind];
  return c.mode === "pair" && c.verified;
}
