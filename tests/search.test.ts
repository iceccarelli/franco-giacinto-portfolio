import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { searchSite, searchDocs } from "@/lib/search-index";
import { matrixServices } from "@/data/matrix";
import { problems } from "@/data/problems";

describe("site search", () => {
  test("an empty query returns nothing rather than everything", () => {
    assert.deepEqual(searchSite(""), []);
    assert.deepEqual(searchSite("   "), []);
  });

  test("a service name ranks its own page first", () => {
    assert.equal(searchSite("hardwood stairs")[0]?.path, "/services/hardwood-stairs");
  });

  test("a city name finds its area page", () => {
    const top = searchSite("vaughan")[0];
    assert.equal(top?.path, "/areas/vaughan");
  });

  test("a two-word query still requires both words", () => {
    const results = searchSite("stairs vaughan");
    assert.ok(results.length > 0);
    for (const r of results) {
      const hay = `${r.primary} ${r.title} ${r.description} ${r.keywords.join(" ")}`.toLowerCase();
      assert.ok(hay.includes("stair"), `${r.title} does not mention stairs`);
      assert.ok(hay.includes("vaughan"), `${r.title} does not mention Vaughan`);
    }
  });

  test("a service plus a city returns that pair's own page first", () => {
    assert.equal(searchSite("stairs vaughan")[0]?.path, "/services/hardwood-stairs/vaughan");
    assert.equal(
      searchSite("refinishing in oakville")[0]?.path,
      "/services/sanding-refinishing/oakville",
    );
  });

  test("the local matrix shortcut knows the same services the matrix builds", () => {
    // lib/search-index.ts holds its own copy of the matrix service slugs so the
    // client bundle does not have to carry 224 built pages. Guard the drift.
    for (const slug of matrixServices) {
      const hit = searchSite(`${slug.replace(/-/g, " ")} vaughan`, 1)[0];
      assert.ok(
        hit?.path.startsWith("/services/"),
        `${slug} did not resolve to a service path for a city query`,
      );
    }
  });

  test("people type in sentences, and sentences still find the page", () => {
    const cases: [string, string][] = [
      ["my stairs squeak", "/problems/squeaking-stairs"],
      ["why is my hardwood floor cupping", "/problems/hardwood-floor-cupping"],
      ["the finish is peeling off my floor", "/problems/peeling-hardwood-finish"],
      ["what is a stair nosing", "/glossary#nosing"],
      ["how much are stairs in vaughan", "/services/hardwood-stairs/vaughan"],
    ];
    for (const [query, expected] of cases) {
      assert.equal(searchSite(query, 1)[0]?.path, expected, `"${query}"`);
    }
  });

  test("a bare service word reaches the service, not a symptom page", () => {
    assert.equal(searchSite("stairs", 1)[0]?.path, "/services/hardwood-stairs");
    assert.equal(searchSite("hardwood stairs", 1)[0]?.path, "/services/hardwood-stairs");
  });

  test("a symptom word reaches the diagnosis", () => {
    for (const [symptom, expected] of [
      ["cupping", "/problems/hardwood-floor-cupping"],
      ["crowning", "/problems/hardwood-floor-crowning"],
      ["buckling", "/problems/hardwood-floor-buckling"],
    ] as const) {
      assert.equal(searchSite(symptom, 1)[0]?.path, expected, symptom);
    }
  });

  test("nonsense returns no results instead of noise", () => {
    assert.deepEqual(searchSite("zzzzqqqq"), []);
  });

  test("is case-insensitive", () => {
    assert.deepEqual(
      searchSite("WHITE OAK").map((d) => d.id),
      searchSite("white oak").map((d) => d.id),
    );
  });

  test("respects the result limit", () => {
    assert.ok(searchSite("hardwood", 3).length <= 3);
  });

  test("finds a term only present in keywords, not in visible text", () => {
    // "lvp" appears only as a keyword on the compare page.
    assert.ok(searchSite("lvp").some((d) => d.path === "/compare"));
  });
});

describe("search index integrity", () => {
  test("every document has a unique id", () => {
    const ids = new Set(searchDocs.map((d) => d.id));
    assert.equal(ids.size, searchDocs.length);
  });

  test("every document has a title, description and internal path", () => {
    for (const d of searchDocs) {
      assert.ok(d.title.length > 0, `${d.id} has no title`);
      assert.ok(d.description.length > 0, `${d.id} has no description`);
      assert.ok(d.path.startsWith("/"), `${d.id} path is not internal: ${d.path}`);
    }
  });
});

describe("the diagnostic library is reachable", () => {
  test("every problem is findable by at least one of its own search phrasings", () => {
    for (const p of problems) {
      const found = p.alsoCalled.some((phrase) =>
        searchSite(phrase, 5).some((d) => d.path === `/problems/${p.slug}`),
      );
      assert.ok(found, `${p.slug} is not reachable by any of: ${p.alsoCalled.join(" / ")}`);
    }
  });
});
