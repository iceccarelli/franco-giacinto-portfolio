/**
 * Two renditions of every photograph, and how the site chooses between them.
 *
 * ── Why there are two ─────────────────────────────────────────────────────
 *
 * The site has 393 pages and 224 of them are service × city combinations. If
 * every one of those shows the identical staircase photograph, the long tail
 * reads as exactly what it is — one template stamped 224 times — and that is
 * the impression a doorway page gives whether or not the words are unique.
 *
 * Two independent sets were commissioned to the same brief. They are not two
 * crops of one render: different rooms, different light, different angles,
 * both holding the discipline that makes a comparison work. So the site can
 * vary which one a page shows and stop looking stamped.
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
 * Canonical paths that have a `-2` sibling on disk.
 *
 * Written out rather than read from the filesystem so this module stays pure
 * and usable from a client component. `tests/images.test.ts` walks
 * `public/images` and fails the build if this list and the disk disagree.
 */
export const IMAGES_WITH_VARIANTS: readonly string[] = [
  "/images/after-refinished.jpg",
  "/images/ba-deck-after.jpg",
  "/images/ba-deck-before.jpg",
  "/images/ba-install-after.jpg",
  "/images/ba-install-before.jpg",
  "/images/ba-railings-after.jpg",
  "/images/ba-railings-before.jpg",
  "/images/ba-refinish-after.jpg",
  "/images/ba-refinish-before.jpg",
  "/images/ba-repair-after.jpg",
  "/images/ba-repair-before.jpg",
  "/images/ba-stairs-after.jpg",
  "/images/ba-stairs-before.jpg",
  "/images/before-worn.jpg",
  "/images/franco-giacinto-oller-grimaldi.jpg",
  "/images/hero-living.jpg",
  "/images/hero-stairs.jpg",
  "/images/methods/method-glue-down-engineered.jpg",
  "/images/methods/method-moisture-map.jpg",
  "/images/methods/method-open-riser-stair.jpg",
  "/images/methods/method-stair-retread.jpg",
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
  "/images/species-board.jpg",
  "/images/stair-studio-poster.jpg",
  "/images/stair-studio.jpg",
  "/images/workshop.jpg",
];

const VARIANT_SET = new Set(IMAGES_WITH_VARIANTS);

/** Both renditions of a photograph, canonical first. One entry if there is no pair. */
export function variantsOf(src: string): string[] {
  if (!VARIANT_SET.has(src)) return [src];
  const dot = src.lastIndexOf(".");
  return [src, `${src.slice(0, dot)}-2${src.slice(dot)}`];
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
