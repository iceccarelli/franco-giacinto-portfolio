import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { clampDescription, breadcrumbLd, localBusinessLd, personLd } from "@/lib/seo";

describe("clampDescription", () => {
  test("leaves a short description alone", () => {
    assert.equal(clampDescription("Short and fine."), "Short and fine.");
  });

  test("never exceeds the limit", () => {
    const long = "Hardwood stairs in the Greater Toronto Area. ".repeat(20);
    assert.ok(clampDescription(long).length <= 156);
  });

  test("prefers to cut on a sentence boundary", () => {
    const text = `${"a".repeat(100)}. ${"b".repeat(100)}`;
    const out = clampDescription(text);
    assert.ok(out.endsWith("."), "should end on the sentence, not mid-word");
  });

  test("never cuts mid-word", () => {
    const out = clampDescription("supercalifragilistic ".repeat(20));
    assert.ok(!/[a-z]…$/.test(out.replace(/\s+…$/, "…")) || out.endsWith("…"));
    assert.ok(!out.includes("  "));
  });

  test("collapses whitespace", () => {
    assert.equal(clampDescription("a\n\n  b   c"), "a b c");
  });
});

describe("structured data", () => {
  test("breadcrumb positions are 1-indexed and sequential", () => {
    const ld = breadcrumbLd([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: "Stairs", path: "/services/hardwood-stairs" },
    ]);
    const items = ld.itemListElement;
    assert.deepEqual(
      items.map((i) => i.position),
      [1, 2, 3],
    );
  });

  test("the business node and the founder node reference each other", () => {
    const business = localBusinessLd();
    const person = personLd();
    assert.equal(business.founder["@id"], person["@id"]);
    assert.equal(person.worksFor["@id"], business["@id"]);
  });

  test("the business declares every service it sells", () => {
    const offers = localBusinessLd().hasOfferCatalog.itemListElement;
    assert.ok(offers.length >= 8, "offer catalogue is missing services");
  });

  test("opening hours exclude the day with no hours", () => {
    const hours = localBusinessLd().openingHoursSpecification;
    assert.ok(hours.every((h) => h.opens && h.closes));
    assert.ok(!hours.some((h) => h.dayOfWeek === "Sunday"), "Sunday is by appointment, not a slot");
  });
});
