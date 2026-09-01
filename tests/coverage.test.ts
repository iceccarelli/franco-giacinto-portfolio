import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  STUDIO,
  coreCoverage,
  coverage,
  coverageSummary,
  coverageWithJobs,
  extendedCoverage,
} from "../data/coverage";
import { cities } from "../data/areas";
import { catalog } from "../data/catalog";

/**
 * The map must never become a claim about work that was not done.
 *
 * data/projects.ts carries AI-generated photography (docs/HONEST-LIMITS.md).
 * Putting those entries on a map would place invented jobs at real addresses
 * in real neighbourhoods — checkable by anyone, and materially worse than the
 * invented testimonials because a pin reads as a record.
 */

describe("the map shows coverage, never a job history", () => {
  test("no pin carries a job", () => {
    assert.equal(coverageWithJobs.length, 0);
    for (const p of coverage) {
      assert.deepEqual(p.confirmedJobs, [], `${p.city.slug} has a job pin with nothing behind it`);
    }
  });

  test("a job, if one is ever added, needs permission, a date and a real archetype", () => {
    const slugs = new Set(catalog.map((c) => c.slug));
    for (const pin of coverage) {
      for (const job of pin.confirmedJobs) {
        assert.equal(job.permission, true, `${pin.city.slug}: job shown without client permission`);
        assert.ok(
          job.date && !Number.isNaN(Date.parse(job.date)),
          `${pin.city.slug}: unparseable date`,
        );
        assert.ok(slugs.has(job.catalogSlug), `${pin.city.slug}: job is not a known job type`);
        assert.ok(job.area?.length, `${pin.city.slug}: job needs a neighbourhood`);
        assert.ok(
          !/\d+\s+\w+\s+(street|st|road|rd|avenue|ave|drive|dr|crescent|cres)\b/i.test(job.area),
          `${pin.city.slug}: a job must never carry a street address`,
        );
      }
    }
  });

  test("the portfolio is not wired into the map", () => {
    // An actual import, not a mention: the file explains at length WHY the
    // portfolio is excluded, and that explanation must not trip its own guard.
    const src = readFileSync("data/coverage.ts", "utf8");
    const imports = src
      .split("\n")
      .filter((l) => /^\s*import\b/.test(l))
      .join("\n");
    assert.ok(
      !/projects/.test(imports),
      "coverage imports the portfolio — those entries carry AI-generated photography",
    );
  });

  test("the disclosure says what the pins mean, in the page and in the summary", () => {
    assert.match(coverageSummary(), /not a record of past jobs/i);
    const map = readFileSync("components/map/coverage-map.tsx", "utf8");
    assert.ok(map.includes("CoverageDisclosure"), "the map ships without its disclosure");
    const city = readFileSync("app/areas/[city]/page.tsx", "utf8");
    assert.match(city, /Not a record of past jobs/i, "the city locator has no disclosure");
  });
});

describe("every municipality is on the map, in the right place", () => {
  test("one pin per city, none missing, none invented", () => {
    assert.equal(coverage.length, cities.length);
    assert.deepEqual(coverage.map((p) => p.city.slug).sort(), cities.map((c) => c.slug).sort());
  });

  test("every coordinate is inside Southern Ontario", () => {
    // A transposed sign or a swapped pair puts a pin in the Indian Ocean.
    for (const p of coverage) {
      assert.ok(
        p.lat > 42.8 && p.lat < 44.8,
        `${p.city.slug}: latitude ${p.lat} is not Southern Ontario`,
      );
      assert.ok(
        p.lng > -80.6 && p.lng < -78.4,
        `${p.city.slug}: longitude ${p.lng} is not Southern Ontario`,
      );
    }
  });

  test("distance from the studio is plausible and ordered", () => {
    for (const p of coverage) {
      assert.ok(
        p.distanceKm >= 0 && p.distanceKm < 140,
        `${p.city.slug}: ${p.distanceKm} km is implausible`,
      );
    }
    const furthestCore = Math.max(...coreCoverage.map((p) => p.distanceKm));
    const nearestExtended = Math.min(...extendedCoverage.map((p) => p.distanceKm));
    // Tiers are commercial, not purely geometric, so they may interleave —
    // but the extremes must not invert, or the tiering is simply wrong.
    assert.ok(
      Math.max(...extendedCoverage.map((p) => p.distanceKm)) > furthestCore,
      "the furthest extended town is closer than the furthest core one",
    );
    assert.ok(nearestExtended > 0);
  });

  test("the studio is the Sterling Road address from data/company.ts", () => {
    assert.ok(STUDIO.label.includes("Sterling Road"));
    assert.ok(STUDIO.lat > 43.6 && STUDIO.lat < 43.7);
  });
});

describe("what each pin promises matches what the site says elsewhere", () => {
  test("core municipalities get the whole catalogue; extended get the larger packages only", () => {
    for (const p of coreCoverage) {
      assert.equal(p.jobTypes.length, catalog.length, `${p.city.slug} should offer every job type`);
    }
    for (const p of extendedCoverage) {
      assert.ok(
        p.jobTypes.length < catalog.length && p.jobTypes.length > 0,
        `${p.city.slug} offers ${p.jobTypes.length} job types — extended towns take packages, not everything`,
      );
      // The prose in tierNote() rules out single-room repairs out there. The
      // map must not contradict it.
      assert.ok(
        !p.jobTypes.some((j) => j.slug === "water-damage-board-replacement"),
        `${p.city.slug} offers a single-room repair, which tierNote() says it does not`,
      );
    }
  });

  test("every band is coherent and locally adjusted", () => {
    for (const p of coverage) {
      assert.ok(
        p.stairBand.high > p.stairBand.low && p.stairBand.low > 0,
        `${p.city.slug}: bad stair band`,
      );
      assert.ok(
        p.installBand.high > p.installBand.low && p.installBand.low > 0,
        `${p.city.slug}: bad install band`,
      );
    }
    const toronto = coverage.find((p) => p.city.slug === "toronto")!;
    const barrie = coverage.find((p) => p.city.slug === "barrie")!;
    assert.ok(
      barrie.stairBand.low !== toronto.stairBand.low,
      "every city quotes the same number — the travel multiplier is not being applied",
    );
  });

  test("no band is restated in the component; they are computed", () => {
    const src = readFileSync("components/map/coverage-map.tsx", "utf8");
    assert.ok(!/\$\d{1,3},\d{3}/.test(src), "a hard-coded dollar figure in the map component");
  });
});

describe("the map is an enhancement, not the content", () => {
  test("Leaflet is never in the shared bundle", () => {
    const client = readFileSync("components/map/coverage-map-client.tsx", "utf8");
    assert.ok(client.startsWith('"use client"'), "the map layer must be a client island");
    assert.match(
      client,
      /await import\("leaflet"\)/,
      "Leaflet must be imported inside the effect, on demand — it is larger than the whole shared bundle",
    );
    // `import type` is erased at compile time and costs nothing at runtime;
    // a VALUE import of leaflet would ship the library on the critical path.
    assert.ok(
      !/^import (?!type\b)[^;]*from "leaflet";/m.test(client),
      "a static value import of Leaflet would put 144 KB on the critical path",
    );
    assert.ok(
      client.includes("IntersectionObserver"),
      "the map should load when it is about to be seen, not on mount",
    );
  });

  test("the same facts are server-rendered as a list", () => {
    const src = readFileSync("components/map/coverage-map.tsx", "utf8");
    assert.ok(src.includes("export function CoverageList"), "no crawlable list alongside the map");
    // The list must not itself be client-only.
    assert.ok(!src.startsWith('"use client"'), "the list must render on the server");
  });

  test("/areas renders the list, so the service area survives with JavaScript off", () => {
    const src = readFileSync("app/areas/page.tsx", "utf8");
    assert.ok(src.includes("CoverageMap"), "/areas has no map");
    assert.ok(
      src.includes("coreCities.map") || src.includes("CoverageList"),
      "/areas would lose its 32 municipalities if the map failed",
    );
  });

  test("the map is hidden from assistive technology, because the list is not", () => {
    const src = readFileSync("components/map/coverage-map-client.tsx", "utf8");
    assert.ok(src.includes('aria-hidden="true"'), "a canvas of pins is noise to a screen reader");
  });

  test("OpenStreetMap attribution is present, as its licence requires", () => {
    const src = readFileSync("components/map/coverage-map-client.tsx", "utf8");
    assert.match(src, /openstreetmap\.org\/copyright/i, "OSM tiles require attribution");
  });

  test("tiles come from OSM directly — no keyed third-party map provider", () => {
    const src = readFileSync("components/map/coverage-map-client.tsx", "utf8");
    assert.ok(
      !/api[_-]?key|access[_-]?token|mapbox|googleapis/i.test(src),
      "a keyed map provider crept in",
    );
  });

  test("the map does not hijack page scrolling", () => {
    const src = readFileSync("components/map/coverage-map-client.tsx", "utf8");
    assert.ok(src.includes("scrollWheelZoom: false"), "a scroll-jacking map on a phone is a trap");
  });
});
