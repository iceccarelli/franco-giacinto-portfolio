import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { catalog, bandFor, exampleFor, catalogWithTestimonials } from "../data/catalog";
import { services } from "../data/services";
import { projects } from "../data/projects";
import { methods } from "../data/methods";
import { problems } from "../data/problems";

/**
 * The catalogue replaced six invented customers. These tests exist so it
 * cannot quietly become six invented customers again.
 */

describe("the invented testimonials are gone and cannot return", () => {
  test("data/testimonials.ts no longer exists", () => {
    assert.ok(
      !existsSync("data/testimonials.ts"),
      "the fabricated testimonial file is back; it held six people who do not exist",
    );
  });

  test("none of the invented names appears anywhere in the repo", () => {
    // The six fabricated customers, by name. If any reappears in any surface,
    // something has restored the file or copied its contents.
    const invented = [
      "Amelia Hart",
      "Daniel Cho",
      "Sofia Rahman",
      "Marcus Bell",
      "Priya Nandakumar",
      "Jonah Reid",
    ];
    for (const file of [
      "app/page.tsx",
      "data/catalog.ts",
      "app/api/facts.json/route.ts",
      "app/ai.txt/route.ts",
      "app/llms.txt/route.ts",
      "app/llms-full.txt/route.ts",
    ]) {
      if (!existsSync(file)) continue;
      const src = readFileSync(file, "utf8");
      for (const name of invented) {
        assert.ok(!src.includes(name), `${file} still names the invented customer "${name}"`);
      }
    }
  });

  test("the homepage no longer claims to show what clients say", () => {
    const src = readFileSync("app/page.tsx", "utf8");
    assert.ok(
      !src.includes("What clients actually say"),
      "that heading asserted six fabricated quotes were real customer feedback",
    );
  });

  test("no catalogue entry quotes or characterises a customer", () => {
    for (const entry of catalog) {
      assert.equal(
        entry.testimonial,
        null,
        `${entry.slug} carries a testimonial; it may only do so when a real permissioned one exists`,
      );
    }
    assert.equal(catalogWithTestimonials.length, 0);
  });

  test("a testimonial, if one is ever added, must carry permission, a date and a city", () => {
    // Guards the shape rather than the current (empty) state, so the first
    // real one cannot be added as a bare string.
    for (const entry of catalog) {
      if (entry.testimonial === null) continue;
      const t = entry.testimonial;
      assert.equal(t.permission, true, `${entry.slug}: testimonial without recorded permission`);
      assert.ok(t.date && !Number.isNaN(Date.parse(t.date)), `${entry.slug}: unparseable date`);
      assert.ok(t.city?.length, `${entry.slug}: testimonial without a city`);
      assert.ok(t.body?.length > 20, `${entry.slug}: testimonial body too short to be real`);
    }
  });

  test("no catalogue page emits Review or aggregateRating markup", () => {
    const src = readFileSync("app/catalog/[slug]/page.tsx", "utf8");
    assert.ok(!src.includes("aggregateRating"), "a rating cannot be asserted without a source");
    assert.ok(
      !/"@type":\s*"Review"/.test(src),
      "Review markup requires a real, permissioned review; there are none",
    );
  });
});

describe("catalogue integrity", () => {
  test("twelve entries, unique slugs and unique names", () => {
    assert.equal(catalog.length, 12);
    assert.equal(new Set(catalog.map((c) => c.slug)).size, 12);
    assert.equal(new Set(catalog.map((c) => c.name)).size, 12);
  });

  test("every entry points at a real service, and reads its band from there", () => {
    const slugs = new Set(services.map((s) => s.slug));
    for (const entry of catalog) {
      assert.ok(
        slugs.has(entry.serviceSlug),
        `${entry.slug} → unknown service ${entry.serviceSlug}`,
      );
      const band = bandFor(entry);
      assert.ok(band.length > 0, `${entry.slug} resolves to an empty band`);
      const service = services.find((s) => s.slug === entry.serviceSlug);
      assert.equal(
        band,
        service?.priceFrom,
        `${entry.slug} does not use the published band verbatim`,
      );
    }
  });

  test("no entry hard-codes a price band of its own", () => {
    const src = readFileSync("data/catalog.ts", "utf8");
    for (const s of services) {
      const band = s.priceFrom.replace(/^From\s+/i, "");
      assert.ok(
        !src.includes(band),
        `data/catalog.ts restates "${band}"; bands live in data/services.ts and are read at render`,
      );
    }
  });

  test("every worked example is computed by the estimator and is coherent", () => {
    for (const entry of catalog) {
      const ex = exampleFor(entry);
      assert.ok(ex.low > 0, `${entry.slug}: non-positive low`);
      assert.ok(ex.high > ex.low, `${entry.slug}: high is not above low`);
      assert.ok(ex.timeline.length > 0, `${entry.slug}: no timeline`);
      assert.ok(ex.label.length > 0, `${entry.slug}: unlabelled example`);
    }
  });

  test("every title fits a SERP once the brand suffix is appended", () => {
    for (const entry of catalog) {
      const full = `${entry.seoTitle} | Green Hardwood`;
      assert.ok(
        full.length <= 60,
        `${entry.slug}: title is ${full.length} chars and will be truncated — "${full}"`,
      );
      assert.ok(
        entry.seoTitle.length > 10,
        `${entry.slug}: seoTitle is too thin to carry a keyword`,
      );
    }
  });

  test("every entry carries real substance, not filler", () => {
    for (const entry of catalog) {
      assert.ok(entry.spec.length >= 3, `${entry.slug}: fewer than three spec lines`);
      assert.ok(entry.sequence.length >= 4, `${entry.slug}: sequence too thin to be useful`);
      assert.ok(entry.failureModes.length >= 3, `${entry.slug}: fewer than three failure modes`);
      assert.ok(entry.trigger.length > 120, `${entry.slug}: trigger is a slogan, not a situation`);
      assert.ok(entry.alsoCalled.length >= 2, `${entry.slug}: needs the phrasings people search`);
      for (const f of entry.failureModes) {
        assert.ok(f.consequence.length > 60, `${entry.slug}: consequence too vague to be useful`);
        assert.ok(f.avoidedBy.length > 20, `${entry.slug}: "avoided by" is not actionable`);
      }
    }
  });

  test("every cross-reference resolves", () => {
    const projectSlugs = new Set(projects.map((p) => p.slug));
    const methodSlugs = new Set(methods.map((m) => m.slug));
    const problemSlugs = new Set(problems.map((p) => p.slug));
    for (const entry of catalog) {
      for (const p of entry.relatedProjects) {
        assert.ok(projectSlugs.has(p), `${entry.slug} → unknown project ${p}`);
      }
      for (const m of entry.relatedMethods) {
        assert.ok(methodSlugs.has(m), `${entry.slug} → unknown method ${m}`);
      }
      for (const p of entry.relatedProblems) {
        assert.ok(problemSlugs.has(p), `${entry.slug} → unknown problem ${p}`);
      }
    }
  });

  test("an entry with no delivered job is labelled a capability, not a case study", () => {
    // The point of the illustrative flag is that the page SAYS so. A flag
    // nothing renders is the same omission the testimonials made.
    const page = readFileSync("app/catalog/[slug]/page.tsx", "utf8");
    assert.ok(page.includes("entry.illustrative"), "the page must render the illustrative flag");
    assert.ok(
      page.includes("Capability, not a case study"),
      "the label a reader actually sees has been removed or reworded away",
    );
    for (const entry of catalog) {
      if (!entry.illustrative) continue;
      assert.equal(
        entry.relatedProjects.length,
        0,
        `${entry.slug} is marked illustrative but links a real photographed job — one of the two is wrong`,
      );
    }
  });

  test("the catalogue is published where machines look", () => {
    const facts = readFileSync("app/api/facts.json/route.ts", "utf8");
    assert.ok(facts.includes("jobCatalogue"), "facts.json does not expose the catalogue");
    assert.ok(
      facts.includes("illustrativeOnly"),
      "facts.json must tell an agent which entries are capability-only",
    );
    const ai = readFileSync("app/ai.txt/route.ts", "utf8");
    assert.ok(ai.includes("/catalog/"), "/ai.txt does not point agents at the catalogue");
    assert.ok(
      ai.includes("attribute a quote or an opinion to a customer"),
      "/ai.txt must forbid attributing an opinion to a customer",
    );
  });

  test("the catalogue is reachable from navigation, not only the sitemap", () => {
    const nav = readFileSync("data/navigation.ts", "utf8");
    assert.ok(nav.includes('"/catalog"'), "no navigation entry links the catalogue");
    const sitemap = readFileSync("app/sitemap.ts", "utf8");
    assert.ok(sitemap.includes("catalog"), "the catalogue is missing from the sitemap");
  });
});
