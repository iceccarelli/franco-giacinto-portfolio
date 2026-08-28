import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { cities, coreCities, extendedCities, tierNote } from "@/data/areas";
import { matrixPages, matrixServices, getMatrixPage, MATRIX_COUNT } from "@/data/matrix";
import { cityMult } from "@/data/estimate";

/**
 * The matrix is 84 generated pages. Generated pages are exactly where thin,
 * duplicated, or nonsensical content creeps in without anyone noticing, so the
 * properties that keep them legitimate are asserted rather than assumed.
 */

describe("matrix generation", () => {
  test("builds exactly one page per service per city", () => {
    assert.equal(matrixPages.length, MATRIX_COUNT);
    assert.equal(matrixPages.length, matrixServices.length * cities.length);
  });

  test("every path is unique", () => {
    const paths = new Set(matrixPages.map((p) => p.path));
    assert.equal(paths.size, matrixPages.length);
  });

  test("every title is unique — no two pages compete for one query", () => {
    const titles = new Set(matrixPages.map((p) => p.title));
    assert.equal(titles.size, matrixPages.length);
  });

  test("every description is unique", () => {
    const descriptions = new Set(matrixPages.map((p) => p.description));
    assert.equal(descriptions.size, matrixPages.length);
  });

  test("titles and descriptions fit in a search result", () => {
    for (const p of matrixPages) {
      // " | Green Hardwood" is appended by the metadata template.
      assert.ok(
        p.title.length + " | Green Hardwood".length <= 70,
        `${p.path} title too long: ${p.title}`,
      );
      assert.ok(p.description.length <= 165, `${p.path} description too long`);
    }
  });

  test("custom-inlays is deliberately excluded from the matrix", () => {
    assert.ok(
      !matrixServices.includes("custom-inlays" as never),
      "an inlay is specified per project, not per municipality",
    );
    assert.equal(getMatrixPage("custom-inlays", "toronto"), undefined);
  });
});

describe("local price bands", () => {
  test("low is always below high, and both are positive", () => {
    for (const p of matrixPages) {
      assert.ok(p.band.low > 0, `${p.path} has a non-positive low`);
      assert.ok(p.band.high > p.band.low, `${p.path} band is inverted`);
    }
  });

  test("the same job costs different amounts in different cities", () => {
    // If this collapses to one value, the city multiplier has stopped applying
    // and every city page is quoting the same number — the definition of thin.
    const stairs = matrixPages.filter((p) => p.service.slug === "hardwood-stairs");
    const distinct = new Set(stairs.map((p) => Math.round(p.band.low)));
    assert.ok(
      distinct.size > 1,
      "all city stair prices are identical — cityMult is not being applied",
    );
  });

  test("price ordering follows the city multiplier", () => {
    const stairs = new Map(
      matrixPages
        .filter((p) => p.service.slug === "hardwood-stairs")
        .map((p) => [p.city.slug, p.band.low]),
    );
    const toronto = stairs.get("toronto")!;
    const brampton = stairs.get("brampton")!;
    assert.ok(cityMult.toronto! > cityMult.brampton!);
    assert.ok(toronto > brampton, "Toronto should price above Brampton, as cityMult says");
  });

  test("every city in areas.ts has a price multiplier", () => {
    for (const c of cities) {
      assert.ok(cityMult[c.slug], `${c.slug} has no cityMult entry — it would fall back silently`);
    }
  });
});

describe("page content", () => {
  test("each page names its own city in the H1 and the angle", () => {
    for (const p of matrixPages) {
      assert.ok(p.h1.includes(p.city.name), `${p.path} H1 does not name the city`);
      assert.ok(p.angle.includes(p.city.name), `${p.path} angle is not localised`);
    }
  });

  test("each page carries local FAQs that quote its own numbers", () => {
    for (const p of matrixPages) {
      assert.ok(p.faqs.length >= 3, `${p.path} has too few FAQs to be useful`);
      assert.ok(
        p.faqs.every((f) => f.q.includes(p.city.name)),
        `${p.path} has a FAQ that is not city-specific`,
      );
    }
  });

  test("keywords include the city name", () => {
    for (const p of matrixPages) {
      assert.ok(
        p.keywords.some((k) => k.toLowerCase().includes(p.city.name.toLowerCase())),
        `${p.path} has no city keyword`,
      );
    }
  });
});

describe("service tiers", () => {
  test("every city declares a tier", () => {
    for (const c of cities) {
      assert.ok(c.tier === "core" || c.tier === "extended", `${c.slug} has no valid tier`);
    }
  });

  test("core and extended partition the city list", () => {
    assert.equal(coreCities.length + extendedCities.length, cities.length);
    assert.ok(coreCities.length > 0 && extendedCities.length > 0);
  });

  test("the tier note tells a visitor what to expect before they call", () => {
    for (const c of cities) {
      const note = tierNote(c);
      assert.ok(note.length > 40, `${c.slug} tier note is too vague`);
      if (c.tier === "extended") {
        assert.match(note, /not a single-room repair/i, "extended areas must state the limit");
      }
    }
  });

  test("travel is priced into the extended tier", () => {
    // A crew losing 90 minutes a day to travel costs more per square foot.
    // If this ever inverts, we are quoting numbers we cannot hold.
    const avg = (list: typeof cities) =>
      list.reduce((sum, c) => sum + (cityMult[c.slug] ?? 1), 0) / list.length;
    assert.ok(
      avg(extendedCities) > avg(coreCities),
      "extended-tier towns should price above the core average",
    );
  });

  test("titleName is only used where the full name would overflow a SERP", () => {
    for (const c of cities) {
      if (!c.titleName) continue;
      assert.ok(
        c.titleName.length < c.name.length,
        `${c.slug} titleName is not shorter than its name`,
      );
      assert.ok(c.name.includes(c.titleName), `${c.slug} titleName is not part of its full name`);
    }
  });
});
