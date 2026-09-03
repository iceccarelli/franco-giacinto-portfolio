import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  DEFECT_IMAGE_DISCLOSURE,
  EQUIPMENT_IMAGE_DISCLOSURE,
  defectLibrary,
  equipment,
  equipmentByCategory,
  equipmentCategories,
  equipmentForProblem,
  equipmentForService,
  getEquipment,
  servicesFor,
} from "../data/equipment";
import { guides } from "../data/guides";
import { IMAGE_VARIANTS } from "../data/images";
import { problems } from "../data/problems";
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

describe("the imagery is labelled for what it is", () => {
  const index = readFileSync(new URL("../app/equipment/page.tsx", import.meta.url), "utf8");
  const detail = readFileSync(
    new URL("../app/equipment/[slug]/page.tsx", import.meta.url),
    "utf8",
  );
  const problemPage = readFileSync(
    new URL("../app/problems/[slug]/page.tsx", import.meta.url),
    "utf8",
  );

  test("the disclosure says the machine is not ours, in those words", () => {
    // The specific risk this closes: a photograph of a sander in a workshop
    // reads as OUR sander in OUR workshop. The words have to deny it.
    assert.match(EQUIPMENT_IMAGE_DISCLOSURE, /not a photograph of our own equipment/i);
    assert.match(DEFECT_IMAGE_DISCLOSURE, /not a photograph of a job/i);
  });

  test("the service and method cross-links disclose too", () => {
    // These two were missed on the first pass: thumbnails were added to the
    // "What this job runs on" and "What this method runs on" blocks, thirteen
    // pages rendered equipment photography, and no test knew those files
    // existed. The real guard is now in scripts/audit-site.mjs, which reads
    // every built page instead of the three files someone thought to name —
    // this assertion is the cheap early warning that runs before the build.
    for (const f of ["../app/services/[slug]/page.tsx", "../app/methods/[slug]/page.tsx"]) {
      const src = readFileSync(new URL(f, import.meta.url), "utf8");
      if (!/e\.image/.test(src)) continue;
      assert.match(
        src,
        /EQUIPMENT_IMAGE_DISCLOSURE/,
        `${f} renders an equipment thumbnail with no disclosure`,
      );
    }
  });

  test("the post-build audit checks every page, not just the ones we named", () => {
    const audit = readFileSync(new URL("../scripts/audit-site.mjs", import.meta.url), "utf8");
    assert.match(
      audit,
      /renders equipment imagery with no disclosure/,
      "the audit no longer catches an undisclosed equipment image on an unnamed page",
    );
  });

  test("every surface that renders an equipment image also renders the disclosure", () => {
    for (const [name, src] of [
      ["the index", index],
      ["the detail page", detail],
    ] as const) {
      assert.match(
        src,
        /EQUIPMENT_IMAGE_DISCLOSURE|DEFECT_IMAGE_DISCLOSURE/,
        `${name} renders equipment imagery with no disclosure`,
      );
    }
    assert.match(
      problemPage,
      /DEFECT_IMAGE_DISCLOSURE/,
      "a diagnosis page shows a defect photograph with nothing saying it is an illustration",
    );
  });

  test("having pictures did not soften the inventory rule", () => {
    // The failure mode: someone adds photographs, decides the page now looks
    // like proof, and quietly drops the sentence. Both must survive together.
    assert.match(index, /not an asset list/i);
    assert.match(detail, /not an inventory/i);
  });

  test("every entry has an image, and every image is in the variant manifest", () => {
    for (const e of equipment) {
      assert.ok(e.image?.startsWith("/images/equipment/"), `${e.slug} has no image`);
      assert.ok(e.imageAlt && e.imageAlt.length > 40, `${e.slug} has thin or missing alt text`);
      assert.equal(
        IMAGE_VARIANTS[e.image],
        4,
        `${e.image} is not declared with four renditions, so the rotator has nothing to rotate`,
      );
    }
  });

  test("alt text describes the work, never a customer", () => {
    const forbidden = /\b(client|customer|homeowner's|Mr\.|Mrs\.|Ms\.)\b/i;
    for (const e of equipment) {
      for (const alt of [e.imageAlt, e.defectAlt].filter(Boolean) as string[]) {
        assert.ok(!forbidden.test(alt), `${e.slug} alt text refers to a person: "${alt}"`);
      }
    }
  });

  test("a defect image always comes with a description, and vice versa", () => {
    for (const e of equipment) {
      assert.equal(
        e.defectImage === undefined,
        e.defectAlt === undefined,
        `${e.slug} has one half of a defect image`,
      );
    }
    assert.equal(defectLibrary().length, 6, "the defect library should be six entries");
  });

  test("the four with no honest defect image get none, not a stand-in", () => {
    // Filling the slot with a near-enough picture is the same failure as
    // inventing a price band for a job with no stated scale.
    const without = equipment.filter((e) => !e.defectImage).map((e) => e.slug);
    assert.deepEqual(
      without.sort(),
      [
        "dust-containment-system",
        "flooring-nailer",
        "multi-disc-sander",
        "stair-fabrication-bench",
      ],
      "the set of entries with no defect image has changed — was that deliberate?",
    );
  });
});

describe("the symptom joins to the machine that prevents it", () => {
  test("every problemSlug resolves to a real diagnosis page", () => {
    const known = new Set(problems.map((p) => p.slug));
    for (const e of equipment) {
      for (const slug of e.problemSlugs ?? []) {
        assert.ok(known.has(slug), `${e.slug} points at unknown problem "${slug}"`);
      }
    }
  });

  test("only an entry that HAS a defect image claims to illustrate a diagnosis", () => {
    for (const e of equipment) {
      if ((e.problemSlugs ?? []).length === 0) continue;
      assert.ok(
        e.defectImage,
        `${e.slug} claims a diagnosis page but has no image to put on it`,
      );
    }
  });

  test("the lookup returns the entry, and undefined rather than a near-enough one", () => {
    assert.equal(equipmentForProblem("hardwood-floor-cupping")?.slug, "moisture-meter");
    assert.equal(equipmentForProblem("loose-stair-railing")?.slug, "railing-anchorage");
    assert.equal(equipmentForProblem("squeaking-stairs"), undefined);
  });

  test("no two entries claim the same diagnosis page", () => {
    const seen = new Map<string, string>();
    for (const e of equipment) {
      for (const slug of e.problemSlugs ?? []) {
        const prior = seen.get(slug);
        assert.equal(prior, undefined, `${slug} is claimed by both ${prior} and ${e.slug}`);
        seen.set(slug, e.slug);
      }
    }
  });
});

describe("the motion is an enhancement, never the content", () => {
  const rotator = readFileSync(
    new URL("../components/photo-rotator.tsx", import.meta.url),
    "utf8",
  );
  const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

  test("it does not start under reduced motion", () => {
    assert.match(rotator, /prefers-reduced-motion: reduce/);
    assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]{0,200}\.gh-kenburns/);
  });

  test("the Ken Burns drift is explicitly cancelled, not merely clamped", () => {
    // The global reduced-motion block already clamps every animation to
    // 0.01ms, which freezes this one correctly but by accident. Deleting that
    // global rule must not silently re-enable a drifting photograph.
    const guard = css.slice(css.lastIndexOf(".gh-kenburns"));
    assert.match(guard, /animation: none/);
  });

  test("it pauses off-screen and in a hidden tab", () => {
    assert.match(rotator, /IntersectionObserver/);
    assert.match(rotator, /visibilityState|visibilitychange/);
  });

  test("exactly one frame can be eager, and it is the first", () => {
    assert.match(rotator, /priority && i === 0/);
  });

  test("only the visible frame is described to assistive technology", () => {
    assert.match(rotator, /aria-hidden=\{i !== index\}/);
  });

  test("the drift is slow enough not to compete with the text", () => {
    const m = css.match(/animation: gh-kenburns-drift (\d+)s/);
    assert.ok(m, "the Ken Burns animation has no duration");
    assert.ok(Number(m![1]) >= 12, `a ${m![1]}s drift is a slideshow effect, not a Ken Burns move`);
  });
});
