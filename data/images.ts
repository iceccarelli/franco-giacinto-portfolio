/**
 * Every rendition of every photograph, and how the site chooses between them.
 *
 * ── Why there is more than one ────────────────────────────────────────────
 *
 * The site has 393 pages and 224 of them are service × city combinations. If
 * every one of those shows the identical staircase photograph, the long tail
 * reads as exactly what it is — one template stamped 224 times — and that is
 * the impression a doorway page gives whether or not the words are unique.
 *
 * Independent sets were commissioned to the same brief. They are not crops of
 * one render: different rooms, different light, different angles, all holding
 * the discipline that makes a comparison work. So the site can vary which one
 * a page shows and stop looking stamped.
 *
 * Most photographs have two renditions. The equipment and defect library has
 * FOUR, because two agents each delivered a full pair to the same brief and
 * throwing half of them away would have been vandalism — four renditions is
 * also what makes a slow cross-fade worth watching rather than a two-frame
 * flicker.
 *
 * ── How the choice is made ────────────────────────────────────────────────
 *
 * Deterministically, from a seed the page already has — its city slug, its
 * service, its own slug. Never randomly. Three reasons that matters:
 *
 *   1. These pages are prerendered and served from the edge cache for an
 *      hour. A random pick would be frozen at build time anyway, so the
 *      randomness would be a lie that also made builds irreproducible.
 *   2. A server-rendered random value and a client-rendered one disagree,
 *      which is a hydration error.
 *   3. Deterministic means /services/hardwood-stairs/vaughan looks the same
 *      on every visit, which is what a returning visitor expects, while
 *      /services/hardwood-stairs/markham looks different — which is the
 *      whole point.
 *
 * Without a seed, the canonical file is returned unchanged. So every existing
 * call site keeps its current image and nothing moved by accident.
 */

/**
 * Canonical path -> how many renditions exist, counting the canonical file.
 *
 * A count of 2 means `x.jpg` and `x-2.jpg`. A count of 4 adds `-3` and `-4`.
 *
 * Written out rather than read from the filesystem so this module stays pure
 * and usable from a client component. `tests/images.test.ts` walks
 * `public/images` and fails the build if this map and the disk disagree — in
 * BOTH directions, so a file that arrives without an entry is caught too.
 */
export const IMAGE_VARIANTS: Readonly<Record<string, number>> = {
  "/images/after-refinished.jpg": 2,
  "/images/ba-deck-after.jpg": 2,
  "/images/ba-deck-before.jpg": 2,
  "/images/ba-install-after.jpg": 2,
  "/images/ba-install-before.jpg": 2,
  "/images/ba-railings-after.jpg": 2,
  "/images/ba-railings-before.jpg": 2,
  "/images/ba-refinish-after.jpg": 2,
  "/images/ba-refinish-before.jpg": 2,
  "/images/ba-repair-after.jpg": 2,
  "/images/ba-repair-before.jpg": 2,
  "/images/ba-stairs-after.jpg": 2,
  "/images/ba-stairs-before.jpg": 2,
  "/images/before-worn.jpg": 2,
  "/images/franco-giacinto-oller-grimaldi.jpg": 2,
  "/images/hero-living.jpg": 2,
  "/images/hero-stairs.jpg": 2,
  "/images/methods/method-glue-down-engineered.jpg": 2,
  "/images/methods/method-moisture-map.jpg": 2,
  "/images/methods/method-open-riser-stair.jpg": 2,
  "/images/methods/method-stair-retread.jpg": 2,
  "/images/project-etobicoke.jpg": 2,
  "/images/project-forest-hill.jpg": 2,
  "/images/project-herringbone.jpg": 2,
  "/images/project-inlay.jpg": 2,
  "/images/project-oakville-stairs.jpg": 2,
  "/images/railing-join.jpg": 2,
  "/images/service-deck.jpg": 2,
  "/images/service-install.jpg": 2,
  "/images/service-railings.jpg": 2,
  "/images/service-refinish.jpg": 2,
  "/images/service-repair.jpg": 2,
  "/images/service-stairs.jpg": 2,
  "/images/species-board.jpg": 2,
  "/images/stair-studio-poster.jpg": 2,
  "/images/stair-studio.jpg": 2,
  "/images/workshop.jpg": 2,

  // The equipment library. Four renditions each: two independent sets, each
  // of which delivered its own pair. Four is what makes the cross-fade on
  // these pages a sequence rather than a two-frame flicker.
  "/images/equipment/eq-belt-sander.jpg": 4,
  "/images/equipment/eq-edger.jpg": 4,
  "/images/equipment/eq-multi-disc-sander.jpg": 4,
  "/images/equipment/eq-dust-containment-system.jpg": 4,
  "/images/equipment/eq-moisture-meter.jpg": 4,
  "/images/equipment/eq-flooring-nailer.jpg": 4,
  "/images/equipment/eq-adhesive-trowel.jpg": 4,
  "/images/equipment/eq-finish-application.jpg": 4,
  "/images/equipment/eq-stair-fabrication-bench.jpg": 4,
  "/images/equipment/eq-railing-anchorage.jpg": 4,

  // The defect library. The most valuable images on the site: a homeowner
  // can be taught to find each of these in a room, which is the whole
  // argument the equipment pages are making.
  "/images/equipment/defect-chatter.jpg": 4,
  "/images/equipment/defect-edge-halo.jpg": 4,
  "/images/equipment/defect-lap-lines.jpg": 4,
  "/images/equipment/defect-hollow-spot.jpg": 4,
  "/images/equipment/defect-cupping.jpg": 4,
  "/images/equipment/defect-loose-newel.jpg": 4,
};

/**
 * Every canonical path that has more than one rendition.
 *
 * Kept as a derived array because several call sites — `data/comparisons.ts`
 * most importantly — need the list of synthetic photographs and must not have
 * to know how many renditions each one has.
 */
export const IMAGES_WITH_VARIANTS: readonly string[] = Object.keys(IMAGE_VARIANTS);

/**
 * Every rendition of a photograph, canonical first. A single-element array if
 * the image has no siblings, so an unlisted call site is unchanged.
 */
export function variantsOf(src: string): string[] {
  const count = IMAGE_VARIANTS[src] ?? 1;
  if (count <= 1) return [src];
  const dot = src.lastIndexOf(".");
  const stem = src.slice(0, dot);
  const ext = src.slice(dot);
  // -1 is never a filename: the canonical file IS rendition one.
  return [src, ...Array.from({ length: count - 1 }, (_, i) => `${stem}-${i + 2}${ext}`)];
}

/**
 * FNV-1a, 32-bit.
 *
 * Any stable string-to-integer would do; this one is four lines, has no
 * dependencies, and spreads short similar strings ("vaughan", "markham")
 * across the range — which a naive character sum does not.
 */
function hash(seed: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
}

/**
 * Which rendition this page should show. Same seed always gives the same
 * answer; no seed always gives the canonical file.
 */
export function pickVariant(src: string, seed?: string): string {
  const all = variantsOf(src);
  if (all.length === 1 || !seed) return all[0]!;
  return all[hash(seed) % all.length]!;
}

/**
 * Every rendition, rotated so the one `pickVariant` would have chosen comes
 * first.
 *
 * This is what the cross-fading rotator renders. It matters that the FIRST
 * element is exactly what the static `Photo` would have shown: the rotator
 * server-renders that frame, so a crawler, a reader with JavaScript off, and
 * the first paint for everyone else all see the same image the deterministic
 * picker chose. The motion is an enhancement layered on top of a correct
 * still, never a replacement for one.
 */
export function variantsFrom(src: string, seed?: string): string[] {
  const all = variantsOf(src);
  if (all.length === 1 || !seed) return all;
  const offset = hash(seed) % all.length;
  return [...all.slice(offset), ...all.slice(0, offset)];
}
