import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  SHOWCASE_DISCLOSURE,
  serviceShowcaseCategory,
  showcase,
  showcaseCategoryLabel,
  showcaseCountByCity,
  showcaseFor,
} from "../data/showcase";
import { coverage } from "../data/coverage";
import { projects } from "../data/projects";
import { services } from "../data/services";

/**
 * The worked examples are the one place where portfolio entries touch a map,
 * and the portfolio photography is AI-generated (docs/HONEST-LIMITS.md). So
 * the rules that make it defensible are pinned here rather than left to a
 * comment: municipality precision, an explicit illustrative flag, no customer,
 * and a disclosure that renders wherever the pins do.
 *
 * If any of these fail, the map has quietly become a claim about work that
 * cannot be evidenced — which is the invented-testimonial mistake with a
 * coordinate attached.
 */

describe("a worked example is a specification, not a job record", () => {
  test("every pin is flagged illustrative and municipality-precise", () => {
    assert.ok(showcase.length > 0, "no worked examples at all");
    for (const s of showcase) {
      assert.equal(s.illustrative, true, `${s.slug} is not flagged illustrative`);
      assert.equal(s.precision, "municipality", `${s.slug} claims a finer precision`);
    }
  });

  test("a pin sits exactly on the municipality centroid, never nearer the job", () => {
    for (const s of showcase) {
      const pin = coverage.find((c) => c.city.slug === s.citySlug);
      assert.ok(pin, `${s.slug} names a municipality that is not served`);
      // Exact equality, deliberately. A jittered or "approximate" coordinate
      // would be a fabricated location dressed up as an honest one.
      assert.equal(s.lat, pin.lat, `${s.slug} has been moved off the centroid`);
      assert.equal(s.lng, pin.lng, `${s.slug} has been moved off the centroid`);
    }
  });

  test("no pin carries a street address", () => {
    for (const s of showcase) {
      assert.ok(
        !/\d+\s+\w+\s+(street|st|road|rd|avenue|ave|drive|dr|crescent|cres|lane|ln|court|crt)\b/i.test(
          s.location,
        ),
        `${s.slug}: "${s.location}" reads as a street address`,
      );
    }
  });

  test("no pin carries a customer, a date, a quote or a rating", () => {
    for (const s of showcase) {
      const keys = Object.keys(s);
      for (const forbidden of ["author", "client", "customer", "name", "quote", "rating", "date"]) {
        assert.ok(!keys.includes(forbidden), `${s.slug} carries a "${forbidden}" field`);
      }
    }
  });

  test("the disclosure says what a pin is, and is not, in plain words", () => {
    assert.match(SHOWCASE_DISCLOSURE, /not a client record/i);
    assert.match(SHOWCASE_DISCLOSURE, /municipality/i);
  });

  test("the disclosure and the status name actually render with the pins", () => {
    const server = readFileSync("components/map/coverage-map.tsx", "utf8");
    assert.ok(server.includes("SHOWCASE_DISCLOSURE"), "the map ships without the showcase note");
    assert.match(server, /label: "Worked example"/, "the legend does not name the status");
    // The wording that keeps the ring honest.
    assert.match(server, /Not a client record and not an address/i);

    const client = readFileSync("components/map/coverage-map-client.tsx", "utf8");
    assert.match(
      client,
      /not a client record/i,
      "the popup implies a delivered job without saying otherwise",
    );
  });

  test("a hollow ring, because the location is imprecise", () => {
    const css = readFileSync("app/globals.css", "utf8");
    assert.match(
      css,
      /\.gh-marker--showcase \.gh-marker__ring/,
      "the worked-example marker has no ring rule",
    );
    // Shape, not just colour: a legend that relies on hue alone is unreadable
    // to roughly one man in twelve.
    assert.match(css, /\.gh-marker--core \.gh-marker__dot/);
  });

  test("the glow stops for anyone who has asked motion to stop", () => {
    const css = readFileSync("app/globals.css", "utf8");
    const block = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)"));
    assert.match(block, /gh-marker__pulse/);
    assert.match(block, /animation: none/);
  });
});

describe("worked examples are complete and correctly filed", () => {
  test("every portfolio entry is on the map exactly once", () => {
    assert.equal(showcase.length, projects.length);
    assert.deepEqual(
      showcase.map((s) => s.slug).sort(),
      projects.map((p) => p.slug).sort(),
    );
  });

  test("every project category has a display label", () => {
    for (const p of projects) {
      assert.ok(showcaseCategoryLabel[p.category], `no legend label for "${p.category}"`);
    }
  });

  test("each pin links to its own job page, not to the grid", () => {
    for (const s of showcase) {
      assert.equal(s.href, `/portfolio/${s.slug}`);
    }
  });

  test("filtering by service returns only that service's work", () => {
    for (const [slug, category] of Object.entries(serviceShowcaseCategory)) {
      assert.ok(
        services.some((s) => s.slug === slug),
        `serviceShowcaseCategory names "${slug}", which is not a published service`,
      );
      for (const s of showcaseFor(category)) {
        assert.equal(s.category, category);
      }
    }
    assert.equal(showcaseFor().length, showcase.length);
  });

  test("the per-city count is what the numbered marker badge will show", () => {
    const counts = showcaseCountByCity();
    let total = 0;
    for (const [city, n] of counts) {
      assert.equal(n, showcase.filter((s) => s.citySlug === city).length);
      total += n;
    }
    assert.equal(total, showcase.length);
  });

  test("coverage still does not import the portfolio; the join lives here", () => {
    const src = readFileSync("data/coverage.ts", "utf8");
    const imports = src
      .split("\n")
      .filter((l) => /^\s*import\b/.test(l))
      .join("\n");
    assert.ok(!/projects|showcase/.test(imports), "coverage now depends on the portfolio");
  });
});
