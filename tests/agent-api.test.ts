import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

import { services, parsePriceBand, priceBandOf } from "@/data/services";
import { company } from "@/data/company";
import { guides, updatedDate, updatedIso } from "@/data/guides";
import { localBusinessLd, websiteLd, serviceLd, offersFromBand } from "@/lib/seo";

/**
 * Source with comments removed.
 *
 * The first version of the two checks below matched their own explanatory
 * comments — "reviewCount `testimonials.length * 18`" in a docblock, and the
 * string "2026-08-27" quoted in a note about having removed it. A test that
 * fails on the comment describing the fix is a test that will be deleted, so
 * strip comments and assert against code.
 */
function code(file: string): string {
  return readFileSync(file, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");
}

/* ------------------------------------------------------------ price bands */

describe("price band parsing", () => {
  /**
   * The bug this exists for: the first parser took the first two dollar
   * figures in the string. On "From $650 minimum · $18–$35 / sq ft affected"
   * that yielded low 650, high 18 — a high below the low, published to the
   * JSON API and emitted as an AggregateOffer, where it is invalid. It was
   * caught by reading the endpoint's own output, which is not a strategy.
   */
  test("a high price is never below its low", () => {
    for (const s of services) {
      const band = parsePriceBand(s.priceFrom);
      if (!band) continue;
      assert.ok(
        band.high > band.low,
        `${s.slug}: parsed ${band.low}–${band.high} from "${s.priceFrom}"`,
      );
    }
  });

  test("a string with no range yields nothing rather than a guess", () => {
    assert.equal(parsePriceBand("Quoted per project"), null);
    assert.equal(parsePriceBand("Quoted per design · medallions from $2,800"), null);
    assert.equal(parsePriceBand(undefined), null);
  });

  test("the range is taken from the range, not from stray dollar figures", () => {
    const repairs = parsePriceBand("From $650 minimum · $18–$35 / sq ft affected");
    assert.deepEqual(repairs, { low: 18, high: 35, unit: "square foot" });
  });

  test("decimals and thousands separators survive", () => {
    assert.deepEqual(parsePriceBand("From $4.50–$8.50 / sq ft"), {
      low: 4.5,
      high: 8.5,
      unit: "square foot",
    });
    assert.deepEqual(parsePriceBand("From $1,200–$2,400 per flight"), {
      low: 1200,
      high: 2400,
      unit: null,
    });
  });

  test("units are read from the same string the page displays", () => {
    assert.equal(parsePriceBand("From $380–$850 per step, installed")?.unit, "step");
    assert.equal(parsePriceBand("From $180–$420 / linear foot")?.unit, "linear foot");
    assert.equal(parsePriceBand("From $11–$22 / sq ft installed")?.unit, "square foot");
  });

  test("every service still has a displayable band", () => {
    for (const s of services) {
      assert.ok(priceBandOf(s.slug).length > 0, `${s.slug} has no price string`);
      assert.ok(
        !priceBandOf(s.slug).startsWith("From"),
        `${s.slug}: priceBandOf should strip the leading "From"`,
      );
    }
  });
});

/* ------------------------------------------------------------ the rating */

describe("no fabricated review data", () => {
  /**
   * `aggregateRating` was `ratingValue: "4.9"` with `reviewCount:
   * String(testimonials.length * 18)`. Neither had a source. It shipped on all
   * 358 pages. Google's penalty for uncorroborated review markup is a manual
   * action that strips every rich result from the domain — the HowTo, the FAQ,
   * the QAPage, the AggregateOffer on 224 city pages.
   */
  test("no rating is emitted while company.reviews is null", () => {
    const business = localBusinessLd() as Record<string, unknown>;
    if (company.reviews === null) {
      assert.ok(
        !("aggregateRating" in business),
        "a rating is being asserted with nothing behind it",
      );
      assert.ok(!("review" in business), "review nodes are being asserted with nothing behind them");
    }
  });

  test("no rating value appears anywhere in the emitted graph without a source", () => {
    const json = JSON.stringify(localBusinessLd());
    if (company.reviews === null) {
      assert.ok(
        !/ratingValue/.test(json),
        "ratingValue is present in the LocalBusiness node but company.reviews is null",
      );
    }
  });

  test("the source of truth is a real field, not a derivation", () => {
    assert.ok(
      !/testimonials\.length\s*\*/.test(code("lib/seo.ts")),
      "a review count is being computed by multiplying the testimonial array",
    );
  });
});

/* ------------------------------------------------- structured data health */

describe("structured data resolves", () => {
  function appRoutes(): Set<string> {
    const out = new Set<string>();
    const walk = (dir: string, prefix: string) => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        if (!entry.isDirectory() || entry.name.startsWith("_")) continue;
        const full = join(dir, entry.name);
        const path = `${prefix}/${entry.name}`;
        if (existsSync(join(full, "page.tsx"))) out.add(path);
        walk(full, path);
      }
    };
    walk("app", "");
    return out;
  }

  test("the sitelinks SearchAction points at a route that exists", () => {
    const site = websiteLd() as {
      potentialAction: { target: { urlTemplate: string } | string };
    };
    const target = site.potentialAction.target;
    const url = typeof target === "string" ? target : target.urlTemplate;
    // It used to be /guides/{search_term_string}. /guides/[slug] sets
    // dynamicParams = false, so every expansion of that template was a 404.
    const path = new URL(url).pathname;
    assert.ok(
      appRoutes().has(path),
      `SearchAction target ${path} is not a route — a searchbox that 404s is worse than none`,
    );
    assert.match(url, /\{search_term_string\}/, "the template lost its placeholder");
  });

  test("no @id is built from company.website while it differs from SITE_URL", () => {
    const offenders: string[] = [];
    const walk = (dir: string) => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (/\.tsx?$/.test(entry.name)) {
          const src = readFileSync(full, "utf8");
          // company.website is the intended final domain. Until the domain cuts
          // over it is NOT the deployed origin, so an @id built from it points
          // at a node that does not exist in the graph.
          if (/company\.website\}[^`]*#/.test(src)) offenders.push(full);
        }
      }
    };
    walk("app");
    walk("lib");
    assert.deepEqual(offenders, [], `@id built from company.website in:\n${offenders.join("\n")}`);
  });

  test("service pages carry structured prices, like the city pages do", () => {
    for (const s of services) {
      const ld = serviceLd(s) as { offers?: { lowPrice: string; highPrice: string } };
      const band = parsePriceBand(s.priceFrom);
      if (!band) {
        assert.ok(!ld.offers, `${s.slug} has no parseable band but emitted an offer`);
        continue;
      }
      assert.ok(ld.offers, `${s.slug} has a price band on the page but none in its JSON-LD`);
      assert.ok(
        Number(ld.offers.highPrice) > Number(ld.offers.lowPrice),
        `${s.slug} emitted highPrice <= lowPrice`,
      );
    }
  });

  test("offersFromBand never emits an incoherent offer", () => {
    for (const junk of ["Quoted per project", "$650 minimum", "", "free"]) {
      assert.deepEqual(offersFromBand(junk, "https://example.com"), {});
    }
  });
});

/* ------------------------------------------------------------------ dates */

describe("dates are real", () => {
  test("every guide's date parses, and none is in the future", () => {
    const now = Date.now();
    for (const g of guides) {
      const d = updatedDate(g);
      assert.ok(!Number.isNaN(d.getTime()), `${g.slug}: unparseable date "${g.updated}"`);
      assert.ok(d.getTime() <= now, `${g.slug}: claims a revision date in the future`);
    }
  });

  test("the ISO date agrees with the month the page shows the reader", () => {
    for (const g of guides) {
      if (g.updatedOn) continue;
      const iso = updatedIso(g);
      const display = updatedDate(g).toLocaleDateString("en-CA", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      });
      assert.equal(
        display.toLowerCase(),
        g.updated.toLowerCase(),
        `${g.slug}: page says "${g.updated}" but the emitted date is ${iso}`,
      );
    }
  });

  test("no page hardcodes a date string", () => {
    const offenders: string[] = [];
    const walk = (dir: string) => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (/\.tsx?$/.test(entry.name)) {
          for (const m of code(full).matchAll(/["']20\d{2}-\d{2}-\d{2}["']/g)) {
            // The Anthropic API version header is a version string that happens
            // to look like a date. It is not a content date.
            if (m[0].includes("2023-06-01")) continue;
            offenders.push(`${full}: ${m[0]}`);
          }
        }
      }
    };
    walk("app");
    assert.deepEqual(
      offenders,
      [],
      `hardcoded dates — derive them from data instead:\n${offenders.join("\n")}`,
    );
  });
});

/* ------------------------------------------------------- the agent surface */

describe("the agent surface is reachable", () => {
  const AGENT_ROUTES = [
    "app/api/ask/route.ts",
    "app/api/facts.json/route.ts",
    "app/api/services.json/route.ts",
    "app/api/areas.json/route.ts",
    "app/.well-known/agents.json/route.ts",
  ];

  test("every agent endpoint exists", () => {
    for (const r of AGENT_ROUTES) assert.ok(existsSync(r), `${r} is missing`);
  });

  test("every agent endpoint answers a CORS preflight", () => {
    for (const r of AGENT_ROUTES) {
      const src = readFileSync(r, "utf8");
      assert.match(
        src,
        /export function OPTIONS/,
        `${r} has no OPTIONS handler — a browser-based agent never reaches it`,
      );
    }
  });

  test("every agent endpoint sends CORS headers", () => {
    for (const r of AGENT_ROUTES) {
      const src = readFileSync(r, "utf8");
      assert.match(
        src,
        /AGENT_CORS|agentJson/,
        `${r} returns a response without Access-Control-Allow-Origin`,
      );
    }
  });

  test("the JSON endpoints are published where a machine will look", () => {
    const llms = readFileSync("app/llms.txt/route.ts", "utf8");
    const ai = readFileSync("app/ai.txt/route.ts", "utf8");
    for (const endpoint of ["/api/facts.json", "/api/services.json", "/api/areas.json", "/api/ask"]) {
      assert.ok(llms.includes(endpoint), `llms.txt does not mention ${endpoint}`);
      assert.ok(ai.includes(endpoint), `ai.txt does not mention ${endpoint}`);
    }
  });

  test("robots.txt lists only real sitemaps", () => {
    const src = readFileSync("app/robots.ts", "utf8");
    const sitemapLine = /sitemap:\s*`\$\{SITE_URL\}\/sitemap\.xml`/;
    assert.match(
      src,
      sitemapLine,
      "the Sitemap directive should name sitemap.xml and nothing else — a non-XML URL there shows as a read error in Search Console",
    );
  });
});

/* -------------------------------------------------------------- indexnow */

describe("indexnow", () => {
  const src = readFileSync("scripts/indexnow.mjs", "utf8");

  test("derives its URL list from the sitemap rather than a second copy", () => {
    assert.match(src, /<loc>/, "indexnow should read the built sitemap");
    assert.ok(
      !/matrixPages|cities\.map|services\.map/.test(src),
      "indexnow is rebuilding the route list — it will drift from the sitemap",
    );
  });

  test("refuses to announce a preview host", () => {
    assert.match(
      src,
      /vercel\.app/,
      "submitting a preview host teaches four search engines the wrong domain",
    );
  });

  test("does not fail a deploy when the key is absent", () => {
    assert.match(src, /INDEXNOW_KEY is not set[\s\S]*?process\.exit\(0\)/);
  });

  test("is wired to a workflow, not left as a manual chore", () => {
    assert.ok(
      existsSync(".github/workflows/announce.yml"),
      "indexnow has no automation — a manual chore is a chore that does not happen",
    );
  });
});
