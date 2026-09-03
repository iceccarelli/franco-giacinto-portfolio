import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { projectBand, projectScale, projects } from "../data/projects";
import { catalog } from "../data/catalog";
import { calculateEstimate, emptyEstimate } from "../data/estimate";
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

/**
 * The job pages were the thinnest content on the site after the guides were
 * fixed — 237 words median — sitting at the end of the most persuasive click
 * path there is. A visitor who looked at a photograph and wanted to see the
 * job arrived at a spec list.
 *
 * The depth added is derived, not written: the scale comes out of the entry's
 * own `specs`, which is the same list the page displays, so the number cannot
 * disagree with what the reader can see above it.
 */
describe("a job page prices the specification it shows", () => {
  test("every entry that states a scale gets a band", () => {
    const withScale = projects.filter((p) => {
      const s = projectScale(p);
      return s.sqft !== undefined || s.stairs !== undefined;
    });
    // Five of the nine state a size or a step count. The other four —
    // the medallion, the restaurant, the water-damage repair and the deck —
    // describe themselves by method ("Insurance coordination", "Hidden
    // fasteners") rather than by scale, and inventing a size for them to fill
    // the slot is exactly what this file exists to prevent.
    assert.equal(withScale.length, 5, `${withScale.length} entries state a scale, expected 5`);
    for (const p of withScale) {
      const band = projectBand(p);
      assert.ok(band, `${p.slug} states a scale but produces no band`);
      assert.ok(band.high > band.low && band.low > 0, `${p.slug}: incoherent band`);
      assert.ok(band.basis.length > 0, `${p.slug}: no stated basis`);
    }
  });

  test("an entry with no stated scale gets no invented number", () => {
    // "Insurance coordination, Red oak match, Kitchen refinish" states no size.
    // A band there would be a number made up to fill a slot.
    for (const p of projects) {
      const s = projectScale(p);
      if (s.sqft === undefined && s.stairs === undefined) {
        assert.equal(projectBand(p), null, `${p.slug} invented a band from nothing`);
      }
    }
  });

  test("the scale is read from the specs the page displays", () => {
    const forestHill = projects.find((p) => p.slug === "forest-hill-heritage")!;
    assert.equal(projectScale(forestHill).sqft, 1850, "1,850 sq ft did not parse");
    assert.equal(projectScale(forestHill).stairs, 28, '"Matched 28 treads" did not parse');

    const oakville = projects.find((p) => p.slug === "oakville-estate-stair")!;
    assert.equal(projectScale(oakville).stairs, 32, "32 steps did not parse");
  });

  test("the band matches what the estimator would say for the same inputs", () => {
    // The whole claim is that a reader can check it against /estimate.
    const p = projects.find((p) => p.slug === "vaughan-new-build")!;
    const band = projectBand(p)!;
    const direct = calculateEstimate({
      ...emptyEstimate(),
      city: p.citySlug,
      service: "install",
      sqft: 4200,
      stairs: 0,
    });
    assert.equal(band.low, Math.round(direct.low));
    assert.equal(band.high, Math.round(direct.high));
  });

  test("a job the estimator cannot price says so rather than implying coverage", () => {
    const src = readFileSync("app/portfolio/[slug]/page.tsx", "utf8");
    assert.match(src, /not priceable by the square foot/i, "the inlay caveat is gone");
    assert.match(src, /quoted per project/i, "the commercial phasing caveat is gone");
  });

  test("the page names what goes wrong, not only what it looks like", () => {
    const src = readFileSync("app/portfolio/[slug]/page.tsx", "utf8");
    assert.match(src, /What goes wrong on a job like this/);
    assert.match(src, /failureModes/, "the failure modes are not rendered");
    // Quoted from the catalogue, which owns them — not restated here.
    assert.match(src, /All \{archetypes\[0\]!\.failureModes\.length\} failure modes/);
  });
});
