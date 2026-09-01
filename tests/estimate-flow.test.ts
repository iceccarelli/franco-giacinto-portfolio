import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { cityFrom, prefillFrom, seedEstimate, serviceKindFrom } from "../lib/estimate-prefill";
import { serviceKinds } from "../data/estimate";
import { services } from "../data/services";
import { cities } from "../data/areas";

/**
 * The estimator is the site's only lead capture. These pin the two defects
 * that made it leak.
 */

describe("links into the estimator are actually honoured", () => {
  test("every service slug the site links with maps to a real estimator kind", () => {
    const kinds = new Set(serviceKinds.map((s) => s.id));
    for (const service of services) {
      const kind = serviceKindFrom(service.slug);
      assert.ok(kind, `/estimate?service=${service.slug} maps to nothing — the link is a no-op`);
      assert.ok(kinds.has(kind), `${service.slug} maps to "${kind}", which is not a service kind`);
    }
  });

  test("every city the site links with is priceable", () => {
    for (const city of cities) {
      assert.equal(cityFrom(city.slug), city.slug, `/estimate?city=${city.slug} is not recognised`);
    }
  });

  test("the estimator's own vocabulary is accepted too", () => {
    for (const kind of serviceKinds) assert.equal(serviceKindFrom(kind.id), kind.id);
  });

  test("a stale or hostile parameter is ignored, never fatal", () => {
    assert.equal(serviceKindFrom("service-that-was-deleted"), undefined);
    assert.equal(cityFrom("atlantis"), undefined);
    assert.equal(serviceKindFrom(null), undefined);
    assert.deepEqual(prefillFrom({ service: "nope", city: "nope" }), {});
    // Out-of-range numbers are dropped rather than clamped into a lie.
    assert.deepEqual(prefillFrom({ sqft: "999999" }), {});
    assert.deepEqual(prefillFrom({ sqft: "-5" }), {});
    assert.deepEqual(prefillFrom({ steps: "500" }), {});
  });

  test("a prefill produces a complete, valid estimator state", () => {
    const seeded = seedEstimate(
      prefillFrom({ service: "hardwood-stairs", city: "vaughan", steps: "13" }),
    );
    assert.equal(seeded.service, "stairs");
    assert.equal(seeded.city, "vaughan");
    assert.equal(seeded.stairs, 13);
    // Untouched fields keep their defaults rather than becoming undefined.
    assert.ok(seeded.sqft > 0);
    assert.ok(seeded.species);
  });

  test("array-valued query parameters take the first value", () => {
    assert.deepEqual(prefillFrom({ city: ["toronto", "vaughan"] }), { city: "toronto" });
  });
});

describe("the pages that link in actually pass the parameters", () => {
  const has = (file: string, needle: string) => readFileSync(file, "utf8").includes(needle);

  test("city hubs prefill the city", () => {
    assert.ok(
      has("app/areas/[city]/page.tsx", "/estimate?city=$"),
      "a city hub still links to a bare /estimate — the reader retypes a city the page knows",
    );
  });

  test("service pages prefill the service", () => {
    assert.ok(has("app/services/[slug]/page.tsx", "/estimate?service=$"));
  });

  test("service x city pages prefill both", () => {
    const src = readFileSync("app/services/[slug]/[city]/page.tsx", "utf8");
    assert.ok(src.includes("/estimate?service=$") && src.includes("&city=$"));
  });

  test("/estimate reads the query string it is sent", () => {
    const flow = readFileSync("components/estimate/estimate-flow.tsx", "utf8");
    assert.ok(flow.includes("useSearchParams"), "the estimator ignores its own parameters");
    assert.ok(flow.includes("prefillFrom"), "the estimator is not seeded from the URL");
  });

  test("/estimate stays prerendered — the prefill must not cost the edge cache", () => {
    const src = readFileSync("app/estimate/page.tsx", "utf8");
    assert.ok(
      !src.includes("searchParams"),
      "resolving the query string on the server makes /estimate a per-request render",
    );
    assert.match(src, /export const revalidate/, "/estimate should declare its ISR interval");
    const flow = readFileSync("components/estimate/estimate-flow.tsx", "utf8");
    assert.ok(
      flow.includes("Suspense"),
      "useSearchParams needs a Suspense boundary in a static page",
    );
  });

  test("/estimate keeps one canonical whatever the query string says", () => {
    const src = readFileSync("app/estimate/page.tsx", "utf8");
    assert.match(
      src,
      /canonical:\s*"\/estimate"/,
      "a parameterised estimate URL must not become a second indexable page",
    );
  });
});

describe("the configuration is asked for once, not twice", () => {
  test("the estimator can be driven by an owner above it", () => {
    const src = readFileSync("components/estimate/quote-estimator.tsx", "utf8");
    assert.ok(
      src.includes("onChange") && src.includes("value?:"),
      "QuoteEstimator is not controllable",
    );
  });

  test("the flow hands the estimator's state to the lead form", () => {
    const src = readFileSync("components/estimate/estimate-flow.tsx", "utf8");
    for (const prop of [
      "defaultService={input.service}",
      "defaultCity={input.city}",
      "defaultSqft=",
    ]) {
      assert.ok(src.includes(prop), `the form is not prefilled with ${prop}`);
    }
  });

  test("/estimate renders the joined flow, not two disconnected components", () => {
    const src = readFileSync("app/estimate/page.tsx", "utf8");
    assert.ok(src.includes("EstimateFlow"), "/estimate does not use the joined flow");
    assert.ok(
      !src.includes("<QuoteForm") || src.includes("EstimateFlow"),
      "/estimate mounts a second, unconnected form",
    );
  });
});

describe("what is remembered, and what is never remembered", () => {
  test("only the job is stored — never a person", () => {
    const src = readFileSync("lib/estimate-prefill.ts", "utf8");
    const stored = src.slice(
      src.indexOf("type Stored"),
      src.indexOf("export function readStoredEstimate"),
    );
    for (const banned of ["name", "phone", "email", "message"]) {
      assert.ok(
        !new RegExp(`\\b${banned}\\b`).test(stored),
        `localStorage would hold "${banned}" — personal data belongs in the inbox, not a browser store`,
      );
    }
  });

  test("storage failure is survivable, not fatal", () => {
    const src = readFileSync("lib/estimate-prefill.ts", "utf8");
    assert.equal(
      (src.match(/catch\s*\{/g) ?? []).length,
      2,
      "both the read and the write must tolerate storage being blocked (private mode, cleared data)",
    );
  });

  test("a restored session is disclosed and reversible, not silent", () => {
    const src = readFileSync("components/estimate/estimate-flow.tsx", "utf8");
    assert.ok(
      src.includes("Picked up where you left off"),
      "a silent state change is worse than none",
    );
    assert.ok(src.includes("Start over"), "a restored configuration must be dismissable");
  });

  test("an explicit link beats a remembered configuration", () => {
    const src = readFileSync("components/estimate/estimate-flow.tsx", "utf8");
    assert.ok(
      src.includes("...stored, ...prefill"),
      "a URL parameter must override storage — somebody who clicked a stair link means it",
    );
  });
});
