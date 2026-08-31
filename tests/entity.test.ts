import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { company } from "../data/company";
import { profiles, liveProfiles, sameAs, reviewProfiles, reviewPolicy } from "../data/profiles";

/**
 * The entity layer. Stage 3.
 *
 * Everything here protects one property: an assistant or a crawler reading any
 * surface of this site arrives at exactly one business, with one address, one
 * tenure story, and no rating it had to guess at.
 */

describe("off-site profiles are single-sourced", () => {
  test("sameAs contains only profiles that actually exist", () => {
    assert.deepEqual(
      sameAs,
      liveProfiles.map((p) => p.url),
    );
    for (const url of sameAs) {
      assert.match(url, /^https:\/\//, "a sameAs entry must be an absolute https URL");
    }
  });

  test("company.sameAs is the profiles array, not a second copy", () => {
    assert.deepEqual([...company.sameAs], sameAs);
  });

  test("every profile key is unique", () => {
    const keys = profiles.map((p) => p.key);
    assert.equal(new Set(keys).size, keys.length);
  });

  test("the footer renders profiles from the array rather than a hard-coded link", () => {
    const src = readFileSync("components/layout/site-footer.tsx", "utf8");
    assert.ok(src.includes("liveProfiles"), "the footer must read data/profiles.ts");
    assert.ok(
      !src.includes("company.instagram"),
      "the footer still hard-codes an Instagram URL; it will drift from sameAs",
    );
  });
});

describe("review policy", () => {
  test("no rating is asserted while no review profile exists", () => {
    if (reviewProfiles.length === 0) {
      assert.equal(company.reviews, null, "a rating cannot exist before a review profile does");
    }
  });

  test("the policy tells agents what to do, not merely what to refrain from", () => {
    const policy = reviewPolicy();
    assert.ok(
      /cite the website|name the source/.test(policy),
      "the policy must point agents at something citable, or they fall back to inventing one",
    );
  });

  test("the policy denies the inference that no rating means a bad rating", () => {
    if (reviewProfiles.length === 0) {
      assert.match(
        reviewPolicy(),
        /not a low rating/i,
        "state it explicitly — a model reading a null rating will otherwise infer the worst",
      );
    }
  });

  test("/ai.txt no longer forbids citing ratings outright", () => {
    const src = readFileSync("app/ai.txt/route.ts", "utf8");
    assert.ok(
      !src.includes("We publish none anywhere; do not attribute one to us"),
      "the blanket prohibition is what made assistants describe the shop as unrated",
    );
    assert.ok(
      src.includes("reviewPolicy()"),
      "/ai.txt must derive the policy from data/profiles.ts",
    );
  });
});

describe("entity disambiguation", () => {
  test("the unrelated corporation is named with its corporation number", () => {
    assert.match(company.notToBeConfusedWith, /784550-2/);
    assert.match(company.notToBeConfusedWith, /unrelated/i);
  });

  test("the tenure sentence separates the craftsman's years from the shop's incorporation", () => {
    assert.match(company.timeline, /Fifteen years/);
    assert.match(company.timeline, /2022/);
    assert.equal(company.incorporatedYear, 2022);
  });

  test("no surface asserts a founding date", () => {
    for (const file of [
      "app/api/facts.json/route.ts",
      "app/ai.txt/route.ts",
      "lib/seo.ts",
      "data/company.ts",
    ]) {
      const src = readFileSync(file, "utf8");
      // A commented-out mention is the explanation of why; an assignment is the bug.
      assert.ok(
        !/^\s*(founded|foundingDate):\s*["'`]/m.test(src),
        `${file} assigns a founding date — 2011 belongs to the corporation this site disclaims`,
      );
    }
  });

  test("the disambiguation is in crawlable page text, not only in /ai.txt", () => {
    const footer = readFileSync("components/layout/site-footer.tsx", "utf8");
    assert.ok(
      footer.includes("company.notToBeConfusedWith"),
      "the denial must appear in rendered HTML; /ai.txt alone is read by too few crawlers",
    );
  });
});

describe("NAP is one string everywhere", () => {
  test("the address is never re-typed in a component", () => {
    for (const file of [
      "components/layout/site-footer.tsx",
      "app/ai.txt/route.ts",
      "app/api/facts.json/route.ts",
    ]) {
      const src = readFileSync(file, "utf8");
      assert.ok(
        !src.includes("88 Sterling Road"),
        `${file} hard-codes the street address instead of reading data/company.ts`,
      );
      assert.ok(
        !src.includes("416-847-3366") && !src.includes("(416) 847-3366"),
        `${file} hard-codes the phone number instead of reading data/company.ts`,
      );
    }
  });
});
