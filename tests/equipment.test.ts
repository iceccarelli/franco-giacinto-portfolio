import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  equipment,
  equipmentByCategory,
  equipmentCategories,
  equipmentForService,
  getEquipment,
  servicesFor,
} from "../data/equipment";
import { guides } from "../data/guides";
import { methods } from "../data/methods";
import { services } from "../data/services";
import { searchDocs } from "../lib/search-index";
import { allNavHrefs } from "../data/navigation";

/**
 * The equipment layer is the one place on this site where the temptation to
 * assert an asset is strongest — "we run a Bona Belt", "our Festool extractor"
 * — and every one of those sentences would be the invented-testimonial mistake
 * with a model number attached. `data/equipment.ts` therefore lives under an
 * explicit rule: it describes what the work requires, never what we own.
 *
 * A comment cannot enforce that. These tests can.
 */

describe("the equipment layer describes requirements, never inventory", () => {
  const source = readFileSync(new URL("../data/equipment.ts", import.meta.url), "utf8");

  test("no entry claims ownership of a machine", () => {
    // Prose fields only. The file's header comment explains the rule, and a
    // rule that fails on its own explanation is a rule that gets deleted.
    const prose = equipment.flatMap((e) => [
      e.summary,
      ...e.whatItDoes,
      ...e.whyItMatters,
      e.without.instead,
      e.without.consequence,
      ...e.howToTell,
    ]);

    const ownership =
      /\b(we|our|green hardwood)\s+(own|owns|run|runs|use|uses|operate|operates|keep|keeps|have|has)\b/i;

    for (const p of prose) {
      assert.ok(
        !ownership.test(p),
        `an equipment entry asserts ownership, which this file may not do: "${p.slice(0, 90)}"`,
      );
    }
  });

  test("no brand or model name appears anywhere in the data", () => {
    // Naming a brand turns a specification into a purchase claim, and it is
    // the first thing that will get typed in when someone edits this file.
    const brands = [
      "bona",
      "lagler",
      "festool",
      "clarke",
      "galaxy",
      "hummel",
      "trio",
      "wagner",
      "delmhorst",
      "tramex",
      "bostik",
      "mapei",
      "sika",
      "loba",
      "pallmann",
      "rubio",
    ];
    const hay = JSON.stringify(equipment).toLowerCase();
    for (const b of brands) {
      assert.ok(
        !new RegExp(`\\b${b}\\b`).test(hay),
        `data/equipment.ts names the brand "${b}" — this layer is a specification, not a kit list`,
      );
    }
  });

  test("the honesty rule is stated in the file, not only in a review comment", () => {
    assert.match(
      source,
      /never says "we own a"|not an inventory/i,
      "the header rule that keeps this file defensible has been removed",
    );
  });

  test("the reader is told, on the page, that this is a specification", () => {
    const index = readFileSync(new URL("../app/equipment/page.tsx", import.meta.url), "utf8");
    const detail = readFileSync(
      new URL("../app/equipment/[slug]/page.tsx", import.meta.url),
      "utf8",
    );
    assert.match(index, /not an asset list/i, "the index no longer discloses what it is");
    assert.match(detail, /not an inventory/i, "the detail page no longer discloses what it is");
  });

  test("the schema node is a DefinedTerm, never a Product", () => {
    const detail = readFileSync(
      new URL("../app/equipment/[slug]/page.tsx", import.meta.url),
      "utf8",
    );
    assert.match(detail, /"@type": "DefinedTerm"/);
    assert.ok(
      !/"@type":\s*"Product"/.test(detail),
      "a Product node asserts a thing we own and sell — this page describes neither",
    );
  });
});

describe("every entry is complete enough to be worth a URL", () => {
  test("the shape is filled in, not stubbed", () => {
    assert.ok(equipment.length >= 10, "too few entries to call this a layer");
    for (const e of equipment) {
      assert.match(e.slug, /^[a-z0-9-]+$/, `${e.slug} is not a clean slug`);
      assert.ok(e.alsoCalled.length >= 2, `${e.slug} lists too few search aliases`);
      assert.ok(e.whatItDoes.length >= 1, `${e.slug} does not say what it does`);
      assert.ok(e.whyItMatters.length >= 2, `${e.slug} does not say why it matters`);
      assert.ok(e.howToTell.length >= 2, `${e.slug} gives the reader nothing to check`);
      assert.ok(e.serviceSlugs.length >= 1, `${e.slug} is attached to no service`);
      assert.ok(
        e.without.instead.length > 20 && e.without.consequence.length > 60,
        `${e.slug} does not say what happens without it`,
      );
    }
  });

  test("the substance is real prose, not a caption", () => {
    for (const e of equipment) {
      const words = [...e.whatItDoes, ...e.whyItMatters].join(" ").split(/\s+/).length;
      assert.ok(words >= 120, `${e.slug} carries only ${words} words of substance`);
    }
  });

  test("slugs are unique", () => {
    assert.equal(new Set(equipment.map((e) => e.slug)).size, equipment.length);
  });

  test("every category declared is a category used, and vice versa", () => {
    const declared = new Set(equipmentCategories.map((c) => c.id));
    for (const e of equipment) {
      assert.ok(declared.has(e.category), `${e.slug} is filed under an undeclared category`);
    }
    for (const c of equipmentCategories) {
      assert.ok(
        equipmentByCategory(c.id).length > 0,
        `category "${c.id}" is declared but empty, so the index renders a heading over nothing`,
      );
    }
  });
});

describe("every cross-reference resolves", () => {
  test("service slugs point at real services", () => {
    const known = new Set(services.map((s) => s.slug));
    for (const e of equipment) {
      for (const s of e.serviceSlugs) {
        assert.ok(known.has(s), `${e.slug} points at unknown service "${s}"`);
      }
      assert.equal(servicesFor(e).length, e.serviceSlugs.length);
    }
  });

  test("guide and method slugs point at real pages", () => {
    const g = new Set(guides.map((x) => x.slug));
    const m = new Set(methods.map((x) => x.slug));
    for (const e of equipment) {
      for (const x of e.relatedGuides) assert.ok(g.has(x), `${e.slug} → unknown guide "${x}"`);
      for (const x of e.relatedMethods) assert.ok(m.has(x), `${e.slug} → unknown method "${x}"`);
    }
  });

  test("the two money services both have equipment attached", () => {
    for (const slug of ["hardwood-stairs", "hardwood-installation", "sanding-refinishing"]) {
      assert.ok(
        equipmentForService(slug).length >= 2,
        `${slug} carries fewer than two equipment classes, so its service page block looks thin`,
      );
    }
  });

  test("getEquipment finds what exists and nothing else", () => {
    assert.ok(getEquipment("belt-sander"));
    assert.equal(getEquipment("nonexistent-machine"), undefined);
  });
});

describe("the layer is reachable", () => {
  test("/equipment is in the navigation", () => {
    assert.ok(allNavHrefs().includes("/equipment"), "the section cannot be reached from any menu");
  });

  test("every entry is in the site search index", () => {
    const paths = new Set(searchDocs.map((d) => d.path));
    assert.ok(paths.has("/equipment"), "the index page is unsearchable");
    for (const e of equipment) {
      assert.ok(paths.has(`/equipment/${e.slug}`), `${e.slug} is unsearchable`);
    }
  });

  test("the aliases people actually type are indexed", () => {
    const hay = searchDocs
      .filter((d) => d.path.startsWith("/equipment/"))
      .flatMap((d) => d.keywords)
      .join(" ")
      .toLowerCase();
    // "buffer" and "drum sander" are the two searches a homeowner makes; the
    // trade names for those machines are not what they type.
    for (const term of ["buffer", "drum sander", "moisture meter"]) {
      assert.ok(hay.includes(term), `no equipment entry is findable by "${term}"`);
    }
  });

  test("every entry is in the sitemap", () => {
    const src = readFileSync(new URL("../app/sitemap.ts", import.meta.url), "utf8");
    assert.match(src, /\/equipment\/\$\{e\.slug\}/, "equipment detail pages are not in the sitemap");
    assert.match(src, /path: "\/equipment"/, "the equipment index is not in the sitemap");
  });

  test("the agent surfaces carry the layer and its caveat", () => {
    for (const f of ["../app/llms.txt/route.ts", "../app/llms-full.txt/route.ts"]) {
      const src = readFileSync(new URL(f, import.meta.url), "utf8");
      assert.match(src, /equipment/i, `${f} does not mention the equipment layer`);
      assert.match(
        src,
        /not an inventory/i,
        `${f} publishes the equipment layer without the caveat that stops it reading as a kit list`,
      );
    }
  });
});
