import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import {
  comparisons,
  comparisonFor,
  hasVerifiedPair,
  ILLUSTRATIVE_NOTE,
  SYNTHETIC_IMAGES,
} from "../data/comparisons";
import { serviceKinds } from "../data/estimate";

/**
 * A before/after slider is the most persuasive element a trade site can carry
 * and the easiest to fake. Two frames either side of a divider are not
 * decoration — they assert that *this floor became that floor*.
 *
 * Every photograph in public/images is AI-generated (docs/HONEST-LIMITS.md).
 * So the rule enforced here is narrow and absolute: a comparison may be
 * presented as evidence only when both frames are real photographs of the same
 * real place. Everything else renders as a single image with a line saying
 * what the missing frame would show.
 */

describe("no manufactured before-and-after can ship", () => {
  test("no verified pair uses a known AI-generated image", () => {
    const synthetic = new Set<string>(SYNTHETIC_IMAGES);
    for (const c of Object.values(comparisons)) {
      if (c.mode !== "pair" || !c.verified) continue;
      assert.ok(
        !synthetic.has(c.before) && !synthetic.has(c.after),
        `${c.kind} claims a verified before/after built from AI-generated frames`,
      );
    }
  });

  test("nothing is verified today, and the file says why", () => {
    // This will flip when Franco shoots the pairs in blocker #12. Until then a
    // `verified: true` appearing here is either a real photograph or a mistake,
    // and the test above decides which.
    for (const kind of serviceKinds) {
      assert.equal(
        hasVerifiedPair(kind.id),
        false,
        `${kind.id} is marked verified — if that is a real photographed pair, update this test`,
      );
    }
    const src = readFileSync("data/comparisons.ts", "utf8");
    assert.match(src, /AI-generated/, "the file must state the provenance problem it exists for");
  });

  test("an unverified pair is labelled as a rendering wherever it renders", () => {
    assert.match(ILLUSTRATIVE_NOTE, /not documentary/i);
    const ui = readFileSync("components/comparison/service-comparison.tsx", "utf8");
    assert.ok(
      ui.includes("ILLUSTRATIVE_NOTE"),
      "the comparison renders without its provenance note",
    );
    assert.match(ui, /c\.verified/, "the UI does not branch on whether the pair is real");
  });

  test("a slot with no pair says so out loud rather than hiding", () => {
    for (const c of Object.values(comparisons)) {
      if (c.mode !== "still") continue;
      assert.ok(c.pending.length > 40, `${c.kind}: no explanation of the missing comparison`);
    }
    const ui = readFileSync("components/comparison/service-comparison.tsx", "utf8");
    assert.match(ui, /No before-and-after here yet/i);
  });
});

describe("every service has a visual, and every file exists", () => {
  test("all six estimator services are covered", () => {
    for (const kind of serviceKinds) {
      const c = comparisonFor(kind.id);
      assert.ok(c, `${kind.id} has no visual`);
      assert.equal(c.kind, kind.id);
      assert.ok(c.lookFor.length > 30, `${kind.id}: tell the reader what to look at`);
    }
  });

  test("every referenced image is actually in the repository", () => {
    for (const c of Object.values(comparisons)) {
      const files = c.mode === "pair" ? [c.before, c.after] : [c.image];
      for (const f of files) {
        assert.ok(existsSync(`public${f}`), `${c.kind} points at a missing file: ${f}`);
      }
    }
  });

  test("alt text describes the floor, never a client", () => {
    for (const c of Object.values(comparisons)) {
      const alts = c.mode === "pair" ? [c.beforeAlt, c.afterAlt] : [c.alt];
      for (const alt of alts) {
        assert.ok(alt.length > 25, `${c.kind}: alt text too thin to be useful`);
        assert.ok(
          !/\b(mr|mrs|ms|family|client|customer)\b/i.test(alt),
          `${c.kind}: alt text names a person`,
        );
      }
    }
  });
});

/**
 * The autoplay rules. Motion that cannot be escaped is an accessibility
 * failure, and motion that burns a frame loop off-screen is a performance one.
 */
describe("the slider moves on its own, and stops when it should", () => {
  const src = readFileSync("components/before-after.tsx", "utf8");

  test("it drifts without being touched", () => {
    assert.match(src, /requestAnimationFrame/, "the comparison never moves on its own");
    assert.match(src, /Math\.sin/, "a linear sweep snaps at the ends; use an easing");
  });

  test("a pointer or focus takes control immediately", () => {
    assert.match(src, /onPointerEnter/);
    assert.match(src, /onFocusCapture/);
    assert.match(src, /heldUntil/, "a deliberate position is not respected after release");
  });

  test("reduced motion stops it entirely, not merely slows it", () => {
    assert.match(src, /prefers-reduced-motion: reduce/);
    // The check must bail out before the loop starts, not just skip a frame.
    const effect = src.slice(src.indexOf("const reduced"));
    assert.match(effect.slice(0, 200), /return;/, "reduced motion must abort the animation setup");
  });

  test("it does not animate off-screen or in a hidden tab", () => {
    assert.match(src, /IntersectionObserver/);
    assert.match(src, /visibilityState/);
  });

  test("the control is a real range input, so it works without a pointer", () => {
    assert.match(src, /type="range"/);
    assert.match(src, /useId/, "several sliders on one page cannot share a DOM id");
  });
});
