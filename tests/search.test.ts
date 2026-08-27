import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { searchSite, searchDocs } from "@/lib/search-index";

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

  test("all tokens must match — 'stairs vaughan' does not return every stair page", () => {
    const results = searchSite("stairs vaughan");
    assert.ok(results.length > 0, "should find something");
    for (const r of results) {
      const hay = `${r.title} ${r.description} ${r.keywords.join(" ")}`.toLowerCase();
      assert.ok(hay.includes("stair"), `${r.title} does not mention stairs`);
      assert.ok(hay.includes("vaughan"), `${r.title} does not mention Vaughan`);
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
