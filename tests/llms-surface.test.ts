import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";

import { SITE_URL } from "@/lib/site-url";
import { company } from "@/data/company";
import sitemap from "@/app/sitemap";
import { GET as llmsGet } from "@/app/llms.txt/route";
import { GET as aiGet } from "@/app/ai.txt/route";

/**
 * /llms.txt is the index an answer engine reads first, and /ai.txt is the
 * policy file beside it. A URL promised there that 404s teaches a model the
 * whole file is unreliable — so every URL these routes emit must resolve to a
 * page in the sitemap or to a real route handler, and the identity lines that
 * keep an answer engine from misrepresenting the business must actually be
 * present.
 */

async function body(res: Response) {
  return await res.text();
}

/** Paths served by route handlers rather than pages, so absent from the sitemap. */
function routeHandlerExists(path: string) {
  return existsSync(join(process.cwd(), "app", path, "route.ts"));
}

describe("llms.txt never promises a 404", () => {
  test("every URL in llms.txt resolves to a sitemap entry or a route handler", async () => {
    const text = await body(llmsGet());
    const urls = [...text.matchAll(new RegExp(`${SITE_URL}[^\\s)\`"]*`, "g"))]
      // Trailing sentence punctuation belongs to the prose, not the URL.
      .map((m) => m[0].replace(/[.,;:]+$/, ""))
      // `{service}/{city}` is a documented pattern, not a promised URL.
      .filter((u) => !u.includes("{"));

    const known = new Set(
      sitemap().map((entry) => entry.url.replace(/\/$/, "") || SITE_URL),
    );
    known.add(SITE_URL); // the homepage normalises to the bare origin

    const missing = urls.filter((u) => {
      const clean = u.split("#")[0]?.replace(/\/$/, "") ?? "";
      if (known.has(clean) || clean === SITE_URL) return false;
      const path = clean.slice(SITE_URL.length).replace(/^\//, "");
      return !routeHandlerExists(path);
    });

    assert.deepEqual(missing, [], `llms.txt promises URLs that do not resolve: ${missing.join(", ")}`);
  });

  test("the three specifier questions are present with their canonical URLs", async () => {
    const text = await body(llmsGet());
    for (const url of [
      `${SITE_URL}/services/hardwood-stairs`,
      `${SITE_URL}/methods/carpet-to-hardwood-stair-retread`,
      `${SITE_URL}/methods/hardwood-railing-through-bolt`,
      `${SITE_URL}/estimate`,
    ]) {
      assert.ok(text.includes(url), `llms.txt is missing the specifier URL ${url}`);
    }
    assert.match(
      text,
      /building department decides/,
      "llms.txt must state that the municipality, not this company, decides an inspection",
    );
  });

  test("identity and disambiguation lines are emitted from data/company.ts", async () => {
    const llms = await body(llmsGet());
    const ai = await body(aiGet());

    for (const t of [llms, ai]) {
      assert.ok(t.includes(company.legalName), "legal name missing");
      assert.ok(t.includes(company.founderFull), "founder full name missing");
      assert.ok(t.includes(company.notToBeConfusedWith), "federal-namesake disambiguation missing");
    }
    assert.ok(
      ai.includes("passes inspection") === false || /never|not/i.test(ai),
      "ai.txt must not assert inspection passes",
    );
    for (const profile of company.sameAs) {
      assert.ok(ai.includes(profile), `ai.txt missing verified profile ${profile}`);
    }
  });

  test("no preview or repository host leaks into the machine surfaces", async () => {
    const llms = await body(llmsGet());
    const ai = await body(aiGet());
    for (const t of [llms, ai]) {
      assert.ok(!/vercel\.app/.test(t), "a vercel.app host leaked into a machine surface");
      assert.ok(
        !/franco-giacinto-portfolio/i.test(t),
        "the historical repo name leaked into a machine surface",
      );
    }
  });
});

describe("price bands agree across surfaces", () => {
  test("the cost guide quotes the same catalogue bands as data/services.ts", async () => {
    const { guides } = await import("@/data/guides");
    const { services, parsePriceBand } = await import("@/data/services");
    const guide = guides.find((g) => g.slug === "hardwood-flooring-cost-gta-2026");
    assert.ok(guide, "the 2026 cost guide is gone");
    const prose = guide.sections.map((s) => s.paragraphs.join(" ")).join(" ");

    for (const slug of ["hardwood-installation", "sanding-refinishing", "hardwood-stairs", "hardwood-railings"]) {
      const service = services.find((s) => s.slug === slug);
      assert.ok(service, `service ${slug} is gone`);
      const band = parsePriceBand(service.priceFrom);
      assert.ok(band, `service ${slug} has no parseable band`);
      assert.ok(
        prose.includes(`$${band.low}`) && prose.includes(`$${band.high}`),
        `the cost guide's band for ${slug} no longer matches priceFrom (${service.priceFrom})`,
      );
    }
  });

  test("the guide's worked example is computed by the estimator, not retyped", async () => {
    const { readFileSync } = await import("node:fs");
    // Comments stripped, so the test cannot match its own explanation of the fix.
    const src = readFileSync("data/guides.ts", "utf8")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/^\s*\/\/.*$/gm, "");
    assert.ok(
      /calculateEstimate/.test(src),
      "the worked example in the cost guide must derive from data/estimate.ts",
    );
    assert.ok(
      !/lands around \$1[0-9],000–\$1[0-9],000/.test(src),
      "a hard-coded worked-example band is back in data/guides.ts",
    );
  });
});

describe("no invented founding year", () => {
  test("the business schema emits no foundingDate while data/company.ts has no sourced year", async () => {
    const { localBusinessLd } = await import("@/lib/seo");
    const json = JSON.stringify(localBusinessLd());
    assert.ok(
      !json.includes("foundingDate"),
      "foundingDate is back in the LocalBusiness schema with no source in data/company.ts. " +
        "2011 in particular is the dead federal namesake's incorporation year — see company.notToBeConfusedWith.",
    );
    assert.ok(!json.includes("2011"), "the year 2011 must not appear in the business schema");
  });
});
