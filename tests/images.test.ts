import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, statSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { IMAGES_WITH_VARIANTS, pickVariant, variantsOf } from "../data/images";
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
 * Two independent photo sets were commissioned to one brief, so 224 service ×
 * city pages can stop showing the identical staircase. These tests keep the
 * manifest honest — it is written out rather than read from the filesystem so
 * the module stays pure, which means nothing but a test can catch it drifting.
 */

describe("the variant manifest matches what is actually on disk", () => {
  test("every listed image exists, and so does its -2 sibling", () => {
    const set = new Set(onDisk);
    for (const src of IMAGES_WITH_VARIANTS) {
      assert.ok(set.has(src), `manifest lists ${src}, which is not in public/images`);
      const [, second] = variantsOf(src);
      assert.ok(set.has(second!), `${src} has no -2 sibling on disk`);
    }
  });

  test("no image on disk has a sibling the manifest forgot", () => {
    const missing = onDisk
      .filter((f) => !f.includes("-2."))
      .filter((f) => onDisk.includes(f.replace(/\.jpg$/, "-2.jpg")))
      .filter((f) => !IMAGES_WITH_VARIANTS.includes(f));
    assert.deepEqual(missing, [], "a second rendition exists but the site will never show it");
  });

  test("a -2 file is never referenced directly in source", () => {
    // Call sites name the canonical file and let pickVariant choose. A direct
    // reference would pin one rendition and silently opt out of rotation.
    const offenders: string[] = [];
    const scan = (dir: string) => {
      for (const e of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, e.name);
        if (statSync(full).isDirectory()) scan(full);
        else if (/\.tsx?$/.test(e.name) && full !== "data/images.ts") {
          if (/["']\/images\/[a-z0-9/-]+-2\.jpg["']/.test(readFileSync(full, "utf8"))) {
            offenders.push(full);
          }
        }
      }
    };
    for (const d of ["app", "components", "data", "lib"]) scan(d);
    assert.deepEqual(offenders, [], "a second-rendition path is hard-coded");
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
    const second = picks.filter((p) => p.includes("-2")).length;
    assert.ok(
      second > 6 && second < cities.length - 6,
      `${second}/${cities.length} cities got the second rendition — the split is lopsided`,
    );
  });
});

describe("both photo sets are complete and correctly shaped", () => {
  test("74 images: two full sets", () => {
    assert.equal(onDisk.length, 74, `expected 74 images, found ${onDisk.length}`);
    assert.equal(IMAGES_WITH_VARIANTS.length, 37);
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
