import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { bandVsPublished, coverage, localPricing, nearestServed } from "../data/coverage";
import { calculateEstimate, emptyEstimate, cityMult, serviceKinds } from "../data/estimate";
import { cities } from "../data/areas";
import { getService, parsePriceBand } from "../data/services";

/**
 * The 32 city hubs rank for the highest commercial-intent query this shop has
 * — "hardwood flooring in {city}" — and were rendering 308 to 420 words each.
 *
 * The fix had to be depth that is *derived*, because the alternative is 32
 * paraphrases of the same three paragraphs, which is a doorway page with a
 * municipal crest on it. These tests are what keep it derived: every band must
 * come back out of the same estimator the tool uses, and the bands must
 * actually differ between towns, or the whole exercise is decoration.
 */

describe("local pricing is computed, not written", () => {
  test("every priceable service is banded for every municipality", () => {
    for (const city of cities) {
      const rows = localPricing(city.slug);
      assert.equal(rows.length, serviceKinds.length, `${city.slug} is missing a service band`);
      for (const row of rows) {
        assert.ok(row.high > row.low && row.low > 0, `${city.slug}/${row.kind}: incoherent band`);
        assert.ok(row.basis.length > 8, `${city.slug}/${row.kind}: no stated basis`);
        assert.ok(row.timeline.length > 0, `${city.slug}/${row.kind}: no timeline`);
      }
    }
  });

  test("a city page quotes exactly what /estimate would quote", () => {
    // The whole claim of the table is that a reader can check it. If these
    // ever diverge, the page is quoting a number the tool will not honour.
    for (const city of [cities[0]!, cities[20]!, cities[cities.length - 1]!]) {
      const stairs = localPricing(city.slug).find((r) => r.kind === "stairs")!;
      const direct = calculateEstimate({
        ...emptyEstimate(),
        city: city.slug,
        service: "stairs",
        stairs: 13,
      });
      assert.equal(stairs.low, Math.round(direct.low), `${city.slug}: table and estimator differ`);
      assert.equal(stairs.high, Math.round(direct.high), `${city.slug}: table and estimator differ`);
    }
  });

  test("the numbers actually differ between municipalities", () => {
    // If a cheap town and an expensive one quote the same figure, the pages
    // are 32 copies and the multiplier is doing nothing.
    const dearest = Object.entries(cityMult).sort((a, b) => b[1] - a[1])[0]![0];
    const cheapest = Object.entries(cityMult).sort((a, b) => a[1] - b[1])[0]![0];
    const a = localPricing(dearest);
    const b = localPricing(cheapest);
    for (let i = 0; i < a.length; i++) {
      assert.notEqual(
        a[i]!.low,
        b[i]!.low,
        `${a[i]!.kind}: ${dearest} and ${cheapest} quote the same number`,
      );
    }
  });

  test("every banded service links to a real service page", () => {
    for (const row of localPricing("toronto")) {
      assert.ok(getService(row.serviceSlug), `${row.kind} points at a missing service`);
    }
  });

  test("no dollar figure is typed into the component", () => {
    const src = readFileSync("components/areas/local-depth.tsx", "utf8");
    assert.ok(!/\$\d[\d,]{2,}/.test(src), "a hard-coded price crept into the city depth component");
  });
});

describe("the neighbour mesh", () => {
  test("every municipality has neighbours, and none is its own", () => {
    for (const city of cities) {
      const near = nearestServed(city.slug, 6);
      assert.ok(near.length > 0, `${city.slug} has no neighbours`);
      assert.ok(!near.some((n) => n.pin.city.slug === city.slug), `${city.slug} links to itself`);
    }
  });

  test("neighbours come back nearest first", () => {
    for (const city of cities) {
      const km = nearestServed(city.slug, 6).map((n) => n.km);
      assert.deepEqual([...km].sort((a, b) => a - b), km, `${city.slug}: neighbours are unordered`);
    }
  });

  test("the mesh is mutual enough to be a graph, not a star", () => {
    // Every hub used to link upward to /areas and nowhere sideways. Assert
    // that the sideways links exist in both directions often enough to matter.
    let mutual = 0;
    for (const city of cities) {
      for (const n of nearestServed(city.slug, 6)) {
        if (nearestServed(n.pin.city.slug, 6).some((m) => m.pin.city.slug === city.slug)) mutual++;
      }
    }
    assert.ok(mutual > cities.length, `only ${mutual} reciprocal links across ${cities.length} hubs`);
  });
});

describe("what a city page promises matches its tier", () => {
  test("an extended town is never offered the whole catalogue", () => {
    for (const pin of coverage.filter((p) => p.city.tier === "extended")) {
      assert.ok(
        pin.jobTypes.length < 12,
        `${pin.city.slug} lists every job type despite being outside the core radius`,
      );
    }
  });
});

/**
 * The rule the last stage broke.
 *
 * `tests/showcase.test.ts` asserted the disclosure exists in the map
 * component's source. It did — and 32 city pages still rendered worked-example
 * rings with nothing naming or qualifying them, because the assertion was
 * about a file rather than about every page that draws a pin. This is the
 * version that would have caught it.
 */
describe("every map placement carries its own disclosure", () => {
  const pagesWithMaps: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (statSync(full).isDirectory()) walk(full);
      else if (entry.name === "page.tsx" && readFileSync(full, "utf8").includes("<CoverageMap")) {
        pagesWithMaps.push(full);
      }
    }
  };
  walk("app");

  test("the placements are the ones we think they are", () => {
    assert.ok(pagesWithMaps.length >= 6, `only ${pagesWithMaps.length} map placements found`);
  });

  test("a page that draws pins also names what they are", () => {
    for (const file of pagesWithMaps) {
      const src = readFileSync(file, "utf8");
      assert.ok(
        src.includes("<MapWorkedExamples"),
        `${file} draws worked-example rings but nothing on the page names them`,
      );
    }
  });

  test("a focused map and its strip are focused on the same city", () => {
    for (const file of pagesWithMaps) {
      const src = readFileSync(file, "utf8");
      const mapFocused = /<CoverageMap[^>]*focus=/.test(src);
      const stripFocused = /<MapWorkedExamples[^>]*focus=/.test(src);
      assert.equal(
        mapFocused,
        stripFocused,
        `${file}: the map and its strip disagree about which city they show`,
      );
    }
  });

  test("the legend does not repeat the strip's heading", () => {
    // Both are server-rendered when the legend starts open, so an identical
    // heading put the same names in the document twice.
    const client = readFileSync("components/map/coverage-map-client.tsx", "utf8");
    assert.ok(
      !client.includes("Worked examples on this map"),
      "the legend repeats the crawlable strip's heading verbatim",
    );
  });
});

/**
 * The published range and the computed band.
 *
 * These two numbers were never compared on a page before the city tables put
 * them side by side, and they do not agree for installation: the estimator's
 * default specification prices above the published ceiling in all 32
 * municipalities. `bandVsPublished()` documents why both are honest and what
 * the decision is.
 *
 * What must not happen is the gap widening unnoticed, or spreading to services
 * where it is not currently true. So this records the state exactly and bounds
 * the drift.
 */
describe("computed bands against published ranges", () => {
  const outOfRange = () => {
    const rows: { city: string; kind: string; verdict: string; ratio: number }[] = [];
    for (const city of cities) {
      for (const row of localPricing(city.slug)) {
        const published = parsePriceBand(getService(row.serviceSlug)?.priceFrom);
        const verdict = bandVsPublished(row, published);
        if (verdict !== "inside" && verdict !== "unpublished" && published) {
          rows.push({
            city: city.slug,
            kind: row.kind,
            verdict,
            ratio: row.perUnitHigh / published.high,
          });
        }
      }
    }
    return rows;
  };

  test("only installation and decking sit outside their published range", () => {
    const kinds = [...new Set(outOfRange().map((r) => r.kind))].sort();
    assert.deepEqual(
      kinds,
      ["deck", "install"],
      "a service has drifted outside its published range — either the estimator or " +
        "data/services.ts moved, and the city tables now contradict the service page",
    );
  });

  test("no computed band exceeds its published ceiling by more than 15%", () => {
    for (const row of outOfRange()) {
      assert.ok(
        row.ratio < 1.15,
        `${row.city}/${row.kind} prices ${((row.ratio - 1) * 100).toFixed(0)}% above the ` +
          "published ceiling — that is no longer a specification difference, it is a wrong number",
      );
    }
  });

  test("no computed band ever falls BELOW its published floor", () => {
    // Quoting under the published minimum is the dangerous direction: it is a
    // number this shop would have to honour.
    assert.deepEqual(
      outOfRange().filter((r) => r.verdict === "below"),
      [],
      "a city page quotes below the published floor",
    );
  });

  test("the cheap specification really is cheaper, which is what the copy claims", () => {
    // The page tells a reader a budget spec lands lower. If that stops being
    // true, the page is making an excuse rather than a statement.
    const premium = calculateEstimate({ ...emptyEstimate(), city: "toronto", service: "install" });
    const budget = calculateEstimate({
      ...emptyEstimate(),
      city: "toronto",
      service: "install",
      species: "engineered",
      finish: "prefinished",
    });
    assert.ok(budget.high < premium.low, "engineered prefinished is not meaningfully cheaper");
  });

  test("the page says which specification it is quoting", () => {
    const src = readFileSync("components/areas/local-depth.tsx", "utf8");
    assert.match(src, /engineered board, prefinished/i, "the copy does not name the cheap end");
    assert.match(src, /solid white oak/i, "the copy does not name the specification it quotes");
  });
});
