import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, statSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  IMAGE_VARIANTS,
  IMAGES_WITH_VARIANTS,
  pickVariant,
  variantsFrom,
  variantsOf,
} from "../data/images";
import { comparisons, SYNTHETIC_IMAGES } from "../data/comparisons";

const walk = (dir: string, out: string[] = []) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, e.name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (e.name.endsWith(".jpg")) out.push(full.replace(/^public/, ""));
  }
  return out;
};
const onDisk = walk("public/images").sort();

/**
 * Independent photo sets were commissioned to one brief, so 224 service × city
 * pages can stop showing the identical staircase. Most subjects have two
 * renditions; the equipment and defect library has four, because two agents
 * each delivered a full pair.
 *
 * These tests keep the manifest honest — it is written out rather than read
 * from the filesystem so the module stays pure, which means nothing but a test
 * can catch it drifting. The check runs in BOTH directions: a listed file that
 * is missing, and a file on disk the manifest forgot.
 */

describe("the variant manifest matches what is actually on disk", () => {
  test("every listed image exists, and so does every rendition it claims", () => {
    const set = new Set(onDisk);
    for (const src of IMAGES_WITH_VARIANTS) {
      assert.ok(set.has(src), `manifest lists ${src}, which is not in public/images`);
      for (const rendition of variantsOf(src)) {
        assert.ok(set.has(rendition), `${src} claims ${rendition}, which is not on disk`);
      }
    }
  });

  test("no rendition on disk is one the manifest forgot", () => {
    // The failure this catches: a set arrives, the files are committed, and
    // the manifest is not updated — so the images ship in the repository,
    // cost their bytes in every clone, and are never once served.
    const orphans: string[] = [];
    for (const f of onDisk) {
      const m = f.match(/^(.*)-(\d+)\.jpg$/);
      if (!m) continue;
      const canonical = `${m[1]}.jpg`;
      if (!onDisk.includes(canonical)) continue;
      const claimed = variantsOf(canonical);
      if (!claimed.includes(f)) orphans.push(f);
    }
    assert.deepEqual(orphans, [], "renditions exist on disk that the site will never show");
  });

  test("the declared count matches the renditions actually present", () => {
    for (const [src, count] of Object.entries(IMAGE_VARIANTS)) {
      const present = variantsOf(src).filter((r) => onDisk.includes(r)).length;
      assert.equal(present, count, `${src} declares ${count} renditions but ${present} are on disk`);
    }
  });

  test("a numbered rendition is never referenced directly in source", () => {
    // Call sites name the canonical file and let pickVariant choose. A direct
    // reference would pin one rendition and silently opt out of rotation.
    const offenders: string[] = [];
    const scan = (dir: string) => {
      for (const e of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, e.name);
        if (statSync(full).isDirectory()) scan(full);
        else if (/\.tsx?$/.test(e.name) && full !== "data/images.ts") {
          if (/["']\/images\/[a-z0-9/-]+-\d+\.jpg["']/.test(readFileSync(full, "utf8"))) {
            offenders.push(full);
          }
        }
      }
    };
    for (const d of ["app", "components", "data", "lib"]) scan(d);
    assert.deepEqual(offenders, [], "a numbered rendition path is hard-coded");
  });
});

describe("the choice is deterministic, never random", () => {
  test("the same seed always gives the same rendition", () => {
    const src = IMAGES_WITH_VARIANTS[0]!;
    for (const seed of ["vaughan", "markham", "hardwood-stairs-toronto"]) {
      const first = pickVariant(src, seed);
      for (let i = 0; i < 50; i++) assert.equal(pickVariant(src, seed), first);
    }
  });

  test("no seed means the canonical file, so unseeded call sites did not move", () => {
    for (const src of IMAGES_WITH_VARIANTS) assert.equal(pickVariant(src, undefined), src);
  });

  test("an image with no second rendition is returned untouched", () => {
    assert.deepEqual(variantsOf("/images/does-not-exist.jpg"), ["/images/does-not-exist.jpg"]);
    assert.equal(pickVariant("/images/does-not-exist.jpg", "anything"), "/images/does-not-exist.jpg");
  });

  test("the 32 city slugs actually spread across both renditions", () => {
    // A hash that sent every city to the same rendition would compile, pass
    // every other test, and leave the long tail looking exactly as templated
    // as before. This is the assertion that the exercise worked.
    const cities = [
      "toronto", "etobicoke", "north-york", "scarborough", "east-york", "mississauga",
      "brampton", "caledon", "vaughan", "markham", "richmond-hill", "aurora", "newmarket",
      "king", "whitchurch-stouffville", "oakville", "burlington", "milton", "halton-hills",
      "pickering", "ajax", "whitby", "oshawa", "clarington", "hamilton", "ancaster",
      "dundas", "bradford-west-gwillimbury", "barrie", "innisfil", "orangeville", "guelph",
    ];
    const src = "/images/service-stairs.jpg";
    const picks = cities.map((c) => pickVariant(src, c));
    const second = picks.filter((p) => /-\d+\.jpg$/.test(p)).length;
    assert.ok(
      second > 6 && second < cities.length - 6,
      `${second}/${cities.length} cities got the second rendition — the split is lopsided`,
    );
  });
});

describe("both photo sets are complete and correctly shaped", () => {
  test("138 images: the original pairs plus the equipment library's quartets", () => {
    assert.equal(onDisk.length, 138, `expected 138 images, found ${onDisk.length}`);
    assert.equal(IMAGES_WITH_VARIANTS.length, 53);
    const quartets = Object.values(IMAGE_VARIANTS).filter((n) => n === 4).length;
    assert.equal(quartets, 16, "the equipment and defect library should be 16 subjects x 4");
  });

  test("every equipment and defect subject has all four renditions", () => {
    for (const [src, count] of Object.entries(IMAGE_VARIANTS)) {
      if (!src.startsWith("/images/equipment/")) continue;
      assert.equal(count, 4, `${src} is in the equipment library but does not have four`);
    }
  });

  test("every comparison frame has both renditions", () => {
    for (const c of Object.values(comparisons)) {
      if (c.mode !== "pair") continue;
      for (const f of [c.before, c.after]) {
        assert.equal(variantsOf(f).length, 2, `${f} has only one rendition`);
      }
    }
  });

  test("every service now has a real pair, not a single still", () => {
    for (const c of Object.values(comparisons)) {
      assert.equal(c.mode, "pair", `${c.kind} is still a single image`);
    }
  });

  test("both renditions of every frame are still declared synthetic", () => {
    // The photographs are commissioned renderings. Both sets hold the room
    // fixed across a pair, which is what makes the slider work — it does not
    // make them documentary, and `verified` stays false until real ones exist.
    const syn = new Set<string>(SYNTHETIC_IMAGES);
    for (const f of onDisk) {
      assert.ok(
        syn.has(f),
        `${f} is not declared synthetic; the honesty guard has a hole. If this is a REAL ` +
          "photograph, that is the good case — decide deliberately how it is labelled rather " +
          "than letting the guard shrink by accident.",
      );
    }
  });
});

describe("the rotator opens on the frame the still would have shown", () => {
  const src = "/images/equipment/eq-belt-sander.jpg";

  test("the first frame is exactly pickVariant's answer", () => {
    // This is the safety property that lets the rotator be an enhancement:
    // the server renders frames[0], so a crawler and a reader with JavaScript
    // off see the same correct image as everyone else's first paint.
    for (const seed of ["belt-sander", "edger", "hardwood-floor-cupping", "x"]) {
      assert.equal(variantsFrom(src, seed)[0], pickVariant(src, seed));
    }
  });

  test("every rendition appears exactly once, so the cycle shows them all", () => {
    const frames = variantsFrom(src, "belt-sander");
    assert.equal(frames.length, 4);
    assert.equal(new Set(frames).size, 4);
    assert.deepEqual([...frames].sort(), [...variantsOf(src)].sort());
  });

  test("without a seed it is the plain order, so unseeded call sites did not move", () => {
    assert.deepEqual(variantsFrom(src), variantsOf(src));
  });

  test("sibling cards do not all open on the same frame", () => {
    // Ten equipment cards in a grid, each seeded by its own slug. If they all
    // opened on the canonical file they would cross-fade in lockstep, which
    // reads worse than a static grid because it advertises the repetition.
    const slugs = [
      "belt-sander", "edger", "multi-disc-sander", "dust-containment-system",
      "moisture-meter", "flooring-nailer", "adhesive-trowel", "finish-application",
      "stair-fabrication-bench", "railing-anchorage",
    ];
    const openers = new Set(
      slugs.map((slug) => variantsFrom(`/images/equipment/eq-${slug}.jpg`, slug)[0]!.slice(-6)),
    );
    assert.ok(openers.size >= 3, `only ${openers.size} distinct opening frames across ten cards`);
  });
});
