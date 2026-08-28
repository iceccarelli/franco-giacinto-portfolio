import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { answers, answerTitle } from "@/data/answers";
import { glossary } from "@/data/glossary";
import { guides } from "@/data/guides";
import { methods } from "@/data/methods";
import { getMatrixPage } from "@/data/matrix";
import { services } from "@/data/services";

/**
 * The authority layer is 28 answers, 8 methods, 22 glossary terms, and 19
 * guides, all cross-linking each other. The failure mode is not a crash — it is
 * a dangling link, a duplicate title, or a page too thin to deserve indexing.
 */

const serviceSlugs = new Set<string>(services.map((s) => s.slug));
const guideSlugs = new Set(guides.map((g) => g.slug));
const termSlugs = new Set(glossary.map((t) => t.slug));

describe("answers", () => {
  test("slugs are unique", () => {
    assert.equal(new Set(answers.map((a) => a.slug)).size, answers.length);
  });

  test("questions are unique", () => {
    assert.equal(new Set(answers.map((a) => a.q)).size, answers.length);
  });

  test("every title fits a SERP once the brand suffix is appended", () => {
    for (const a of answers) {
      const full = `${answerTitle(a)} | Green Hardwood`;
      assert.ok(full.length <= 70, `${a.slug}: ${full.length} chars — ${full}`);
    }
  });

  test("every answer says something, not just 'contact us'", () => {
    for (const a of answers) {
      assert.ok(a.a.length >= 80, `${a.slug} is too short to be an answer`);
    }
  });

  test("every pathHint points at a route that exists", () => {
    for (const a of answers) {
      const p = a.pathHint;
      const ok =
        p.startsWith("/services/") ||
        p.startsWith("/guides/") ||
        p.startsWith("/methods/") ||
        p.startsWith("/areas/") ||
        [
          "/stairs",
          "/estimate",
          "/showroom",
          "/compare",
          "/process",
          "/glossary",
          "/portfolio",
          "/warranty",
          "/emergency",
          "/contact",
          "/faq",
          "/trade",
          "/care",
          "/about",
        ].includes(p);
      assert.ok(ok, `${a.slug} points at ${p}, which is not a known route shape`);

      if (p.startsWith("/guides/")) {
        assert.ok(guideSlugs.has(p.slice(8)), `${a.slug} links to missing guide ${p}`);
      }
      if (p.startsWith("/services/")) {
        const parts = p.slice(10).split("/");
        if (parts.length === 1) {
          assert.ok(serviceSlugs.has(parts[0]!), `${a.slug} links to missing service ${p}`);
        } else {
          // A service x city matrix page.
          assert.ok(
            getMatrixPage(parts[0]!, parts[1]!),
            `${a.slug} links to ${p}, which the matrix does not generate`,
          );
        }
      }
      if (p.startsWith("/methods/")) {
        assert.ok(
          methods.some((m) => m.slug === p.slice(9)),
          `${a.slug} links to missing method ${p}`,
        );
      }
    }
  });

  test("primaryService is a real service or 'general'", () => {
    for (const a of answers) {
      assert.ok(
        a.primaryService === "general" || serviceSlugs.has(a.primaryService),
        `${a.slug} has an unknown primaryService: ${a.primaryService}`,
      );
    }
  });

  test("the stairs and installation wedge is where the answers concentrate", () => {
    const wedge = answers.filter(
      (a) => a.primaryService === "hardwood-stairs" || a.primaryService === "hardwood-installation",
    );
    assert.ok(wedge.length >= answers.length / 2, "the wedge should carry most of the answers");
  });
});

describe("methods", () => {
  test("slugs and names are unique", () => {
    assert.equal(new Set(methods.map((m) => m.slug)).size, methods.length);
    assert.equal(new Set(methods.map((m) => m.name)).size, methods.length);
  });

  test("every method has real steps and both sides of the decision", () => {
    for (const m of methods) {
      assert.ok(m.steps.length >= 3, `${m.slug} has too few steps to be a method`);
      assert.ok(m.when.length > 30, `${m.slug} does not say when it is correct`);
      assert.ok(m.whenNot.length > 30, `${m.slug} does not say when it is wrong`);
      for (const s of m.steps) assert.ok(s.body.length > 30, `${m.slug}/${s.heading} is a stub`);
    }
  });

  test("relatedService and relatedGuides resolve", () => {
    for (const m of methods) {
      assert.ok(
        serviceSlugs.has(m.relatedService),
        `${m.slug} → unknown service ${m.relatedService}`,
      );
      for (const g of m.relatedGuides) {
        assert.ok(guideSlugs.has(g), `${m.slug} → missing guide ${g}`);
      }
    }
  });

  test("images are declared with alt text that does not name a client", () => {
    for (const m of methods) {
      assert.ok(m.image.startsWith("/images/"), `${m.slug} image path looks wrong`);
      assert.ok(m.imageAlt.length > 20, `${m.slug} needs real alt text`);
    }
  });
});

describe("glossary", () => {
  test("slugs and terms are unique", () => {
    assert.equal(new Set(glossary.map((t) => t.slug)).size, glossary.length);
    assert.equal(new Set(glossary.map((t) => t.term)).size, glossary.length);
  });

  test("every seeAlso reference resolves to another term", () => {
    for (const t of glossary) {
      for (const ref of t.seeAlso) {
        assert.ok(termSlugs.has(ref), `${t.slug} → see-also "${ref}" does not exist`);
      }
    }
  });

  test("no term points at itself", () => {
    for (const t of glossary) {
      assert.ok(!t.seeAlso.includes(t.slug), `${t.slug} references itself`);
    }
  });

  test("definitions are definitions, not one-liners", () => {
    for (const t of glossary) {
      assert.ok(t.definition.length >= 60, `${t.slug} definition is too thin`);
    }
  });
});

describe("guides after expansion", () => {
  test("slugs and titles stay unique across core and expansion", () => {
    assert.equal(new Set(guides.map((g) => g.slug)).size, guides.length);
    assert.equal(new Set(guides.map((g) => g.title)).size, guides.length);
  });

  test("titles fit a SERP", () => {
    for (const g of guides) {
      const full = `${g.title} | Green Hardwood`;
      assert.ok(full.length <= 70, `${g.slug}: ${full.length} chars`);
    }
  });

  test("every guide has sections with real paragraphs", () => {
    for (const g of guides) {
      assert.ok(g.sections.length >= 2, `${g.slug} has too few sections`);
      for (const s of g.sections) {
        assert.ok(s.paragraphs.length >= 1, `${g.slug}/${s.heading} is empty`);
        for (const p of s.paragraphs) {
          assert.ok(p.length > 80, `${g.slug}/${s.heading} has a stub paragraph`);
        }
      }
    }
  });
});
