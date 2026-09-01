import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { projects } from "../data/projects";
import { catalog } from "../data/catalog";
import { searchDocs } from "../lib/search-index";

/**
 * Why this file exists.
 *
 * The portfolio grid rendered nine `<article>` elements. They had a photo, a
 * headline, a spec list and a card shadow — everything that makes a thing look
 * clickable — and none of them went anywhere, because there was no
 * `/portfolio/{slug}` route to go to. The catalogue deep-linked to `#slug`
 * fragments on the same page, site search sent all nine results to the same
 * grid, and every "related work" card on a service page had the same problem.
 *
 * That is a dead end on the most persuasive content the site has, and it is
 * the kind of regression that no type checker and no build catches, because
 * nothing is broken — it just does nothing. So it is asserted here.
 */

describe("every job has a page of its own", () => {
  test("the detail route exists", () => {
    assert.ok(
      existsSync("app/portfolio/[slug]/page.tsx"),
      "there is no /portfolio/{slug} route; the cards have nowhere to go",
    );
  });

  test("the route is statically generated for all nine jobs", () => {
    const src = readFileSync("app/portfolio/[slug]/page.tsx", "utf8");
    assert.match(src, /export function generateStaticParams/);
    assert.match(src, /projects\.map/);
    // A dynamic page here would drop the whole portfolio out of the ISR cache
    // and into a function invocation on every crawl.
    assert.match(src, /export const revalidate/);
  });

  test("each job page declares its own canonical", () => {
    const src = readFileSync("app/portfolio/[slug]/page.tsx", "utf8");
    assert.match(src, /alternates: \{ canonical: `\/portfolio\/\$\{project\.slug\}` \}/);
  });

  test("the job page carries no rating, review or customer markup", () => {
    const src = readFileSync("app/portfolio/[slug]/page.tsx", "utf8");
    for (const forbidden of ["aggregateRating", '"@type": "Review"', "reviewRating", "ratingValue"]) {
      assert.ok(!src.includes(forbidden), `the job page emits ${forbidden}`);
    }
  });

  test("the job page says the photography is a rendering, not evidence", () => {
    const src = readFileSync("app/portfolio/[slug]/page.tsx", "utf8");
    assert.match(
      src,
      /not documentary job photography/i,
      "docs/HONEST-LIMITS.md records that this photography is AI-generated; the page must say so",
    );
  });
});

describe("the cards actually navigate", () => {
  test("the grid card is a link, not a bare article", () => {
    const src = readFileSync("components/portfolio/project-grid.tsx", "utf8");
    assert.match(
      src,
      /href=\{`\/portfolio\/\$\{p\.slug\}`\}/,
      "the portfolio card does not link to the job page",
    );
    assert.match(
      src,
      /after:absolute after:inset-0/,
      "the card headline does not stretch its hit area over the card",
    );
    // The anchor id has to survive: /portfolio#slug is already linked from
    // outside this repo's control.
    assert.match(src, /id=\{p\.slug\}/, "the fragment anchors were dropped");
  });

  test("a before/after slider is not swallowed by the card link", () => {
    const grid = readFileSync("components/portfolio/project-grid.tsx", "utf8");
    assert.match(
      grid,
      /relative z-10/,
      "the comparison slider sits under the stretched link and cannot be dragged",
    );
    const slider = readFileSync("components/before-after.tsx", "utf8");
    assert.match(slider, /z-20/, "the slider's drag surface is below the card link overlay");
  });

  test("three sliders on one page do not share one DOM id", () => {
    const src = readFileSync("components/before-after.tsx", "utf8");
    assert.ok(!src.includes('id="ba-range"'), "a literal id repeats on /portfolio");
    assert.match(src, /useId/);
  });

  test("every page that renders a project card links it", () => {
    for (const file of [
      "app/page.tsx",
      "app/stairs/page.tsx",
      "app/services/[slug]/page.tsx",
      "app/services/[slug]/[city]/page.tsx",
      "app/areas/[city]/page.tsx",
    ]) {
      const src = readFileSync(file, "utf8");
      assert.match(
        src,
        /href=\{`\/portfolio\/\$\{p\.slug\}`\}/,
        `${file} renders project cards that go nowhere`,
      );
    }
  });
});

describe("everything that pointed at a fragment now points at a page", () => {
  test("the catalogue links to the job page", () => {
    const src = readFileSync("app/catalog/[slug]/page.tsx", "utf8");
    assert.ok(!src.includes("/portfolio#"), "the catalogue still deep-links to a fragment");
    assert.match(src, /href=\{`\/portfolio\/\$\{p\.slug\}`\}/);
  });

  test("site search sends each project to its own page", () => {
    const docs = searchDocs.filter((d) => d.kind === "Project");
    assert.equal(docs.length, projects.length);
    for (const d of docs) {
      assert.notEqual(d.path, "/portfolio", `"${d.title}" still resolves to the grid`);
      assert.match(d.path, /^\/portfolio\/[a-z0-9-]+$/);
    }
  });

  test("the sitemap lists the nine job pages", () => {
    const src = readFileSync("app/sitemap.ts", "utf8");
    assert.match(src, /\$\{BASE\}\/portfolio\/\$\{p\.slug\}/, "the job pages are not in the sitemap");
  });

  test("every catalogue relatedProjects slug resolves to a real job page", () => {
    const slugs = new Set(projects.map((p) => p.slug));
    for (const entry of catalog) {
      for (const slug of entry.relatedProjects) {
        assert.ok(slugs.has(slug), `catalog/${entry.slug} points at missing job "${slug}"`);
      }
    }
  });
});
