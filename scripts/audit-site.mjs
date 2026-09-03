#!/usr/bin/env node
/**
 * Post-build site audit.
 *
 * Runs against the prerendered HTML in .next/server/app, so it checks what a
 * crawler will actually receive rather than what the source intended. Every
 * failure here is something that would quietly cost rankings or break a visitor:
 * a dead internal link, two pages fighting over one title, a missing canonical,
 * a broken image path, malformed structured data.
 *
 * Exits non-zero on failure so it can gate a deploy.
 *
 *   npm run audit:site        (after npm run build)
 *   npm run verify            (typecheck + build + audit)
 */

import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const APP_DIR = ".next/server/app";
const PUBLIC_DIR = "public";

if (!existsSync(APP_DIR)) {
  console.error(`No build output at ${APP_DIR}. Run \`npm run build\` first.`);
  process.exit(1);
}

/* ------------------------------------------------------------------ collect */

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith(".html")) out.push(full);
  }
  return out;
}

const files = walk(APP_DIR);

/** ".next/server/app/services/hardwood-stairs/vaughan.html" -> "/services/hardwood-stairs/vaughan" */
function routeOf(file) {
  let route = "/" + relative(APP_DIR, file).replace(/\.html$/, "");
  route = route.replace(/\/index$/, "");
  return route === "" ? "/" : route;
}

const pages = files.map((file) => ({
  file,
  route: routeOf(file),
  html: readFileSync(file, "utf8"),
}));
const routes = new Set(pages.map((p) => p.route));

const failures = [];
const warnings = [];
const fail = (msg) => failures.push(msg);
const warn = (msg) => warnings.push(msg);

const first = (html, re) => html.match(re)?.[1]?.trim();
const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'");

/* ---------------------------------------------------- 1. head completeness */

const titles = new Map();
const descriptions = new Map();

for (const { route, html } of pages) {
  const title = first(html, /<title>([^<]*)<\/title>/);
  const desc = first(html, /<meta name="description" content="([^"]*)"/);
  const canonical = first(html, /rel="canonical" href="([^"]*)"/);
  const h1 = /<h1[\s>]/.test(html);
  const noindex = /<meta name="robots" content="[^"]*noindex/.test(html);

  if (!title) fail(`${route} — no <title>`);
  if (!desc) fail(`${route} — no meta description`);
  if (!canonical && !noindex) fail(`${route} — no canonical link`);
  if (!h1) fail(`${route} — no <h1>`);

  if (title) {
    const key = decode(title);
    titles.set(key, [...(titles.get(key) ?? []), route]);
    if (key.length > 70)
      warn(`${route} — title is ${key.length} chars, will be truncated in SERPs`);
  }
  if (desc) {
    const key = decode(desc);
    descriptions.set(key, [...(descriptions.get(key) ?? []), route]);
    if (key.length > 165)
      warn(`${route} — meta description is ${key.length} chars, will be truncated`);
  }
}

for (const [title, where] of titles) {
  if (where.length > 1) fail(`Duplicate <title> "${title}" on: ${where.join(", ")}`);
}
for (const [desc, where] of descriptions) {
  if (where.length > 1)
    fail(`Duplicate meta description on ${where.length} pages: ${where.slice(0, 4).join(", ")}…`);
}

/* -------------------------------------------------- 2. internal link graph */

const staticFileRoutes = new Set(
  existsSync(PUBLIC_DIR)
    ? readdirSync(PUBLIC_DIR)
        .filter((f) => statSync(join(PUBLIC_DIR, f)).isFile())
        .map((f) => `/${f}`)
    : [],
);
// Route handlers, metadata routes, and on-demand pages produce no .html file,
// so they are absent from `routes` even though they are perfectly real. /search
// is the on-demand one: it reads a query string, so it cannot be prerendered.
const generatedRoutes = new Set([
  "/search",
  "/card.vcf",
  "/sitemap.xml",
  "/robots.txt",
  "/manifest.webmanifest",
  "/feed.xml",
  "/llms.txt",
  "/llms-full.txt",
  "/ai.txt",
  "/opengraph-image",
]);

const linkedTo = new Set();

for (const { route, html } of pages) {
  for (const m of html.matchAll(/href="(\/[^"#?]*)/g)) {
    const target = m[1].replace(/\/$/, "") || "/";
    linkedTo.add(target);
    const known =
      routes.has(target) ||
      staticFileRoutes.has(target) ||
      generatedRoutes.has(target) ||
      target.startsWith("/_next/") ||
      target.startsWith("/images/") ||
      target.startsWith("/videos/");
    if (!known) fail(`${route} — links to ${target}, which is not a route or a public file`);
  }
}

/* ------------------------------------------------------- 3. orphaned pages */

for (const { route } of pages) {
  if (route === "/" || route === "/_not-found") continue;
  if (!linkedTo.has(route)) warn(`${route} — no internal page links to it (orphan)`);
}

/* -------------------------------------------------------- 4. media exists */

for (const { route, html } of pages) {
  for (const m of html.matchAll(/(?:src|content)="(\/(?:images|videos)\/[^"]+)"/g)) {
    if (!existsSync(join(PUBLIC_DIR, m[1]))) fail(`${route} — missing media ${m[1]}`);
  }
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt=/.test(m[0])) fail(`${route} — <img> without an alt attribute`);
  }
}

/* --------------------------------------------------- 5. structured data */

let ldCount = 0;
const ldTypes = new Set();

for (const { route, html } of pages) {
  for (const m of html.matchAll(
    /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
  )) {
    ldCount++;
    try {
      const parsed = JSON.parse(m[1]);
      const nodes = Array.isArray(parsed) ? parsed : [parsed];
      for (const n of nodes) {
        const t = n["@type"];
        (Array.isArray(t) ? t : [t]).forEach((x) => x && ldTypes.add(x));
      }
    } catch {
      fail(`${route} — JSON-LD block does not parse`);
    }
  }
  if (!/application\/ld\+json/.test(html)) warn(`${route} — no structured data`);
}

/* ------------------------------- 5b. the equipment imagery says what it is */

/**
 * Every page that renders an equipment or defect photograph must also render
 * the sentence saying it is a commissioned illustration of the machine class
 * rather than a photograph of our own equipment.
 *
 * This check lives HERE, in the post-build audit, and not in the unit tests,
 * and the reason is a bug it caught on the day it was written.
 * `tests/equipment.test.ts` asserted the disclosure by reading the SOURCE of
 * three files — the equipment index, the equipment detail page and the
 * diagnosis page. It passed. Meanwhile thirteen service and method pages had
 * been given equipment thumbnails, rendered them, and carried no disclosure
 * at all, because no test knew those files existed.
 *
 * A source-reading test can only check the files you thought to name. Reading
 * the built HTML checks all 404 pages and cannot be out of date, because the
 * thing it inspects is the thing the crawler gets.
 */

const EQUIPMENT_IMAGE = "%2Fimages%2Fequipment%2F";
const DISCLOSURES = [
  "not a photograph of our own equipment",
  "not a photograph of a job we were called to",
];

for (const { route, html } of pages) {
  if (!html.includes(EQUIPMENT_IMAGE) && !html.includes("/images/equipment/")) continue;
  if (!DISCLOSURES.some((d) => html.includes(d))) {
    fail(
      `${route} — renders equipment imagery with no disclosure. A photograph of a machine ` +
        "reads as a photograph of OUR machine unless the page says otherwise.",
    );
  }
}

/* ------------------------------------------------- 6. the layout system */

/**
 * These three checks read the SOURCE, not the build output, because they are
 * about the rules the codebase holds itself to rather than about what a
 * crawler sees. Each one exists because the rule had already been broken:
 *
 *   - a third container width had appeared on exactly two pages, so
 *     /problems/[slug] sat at a different measure than its own siblings;
 *   - the h1 scale had forked into two `leading` values;
 *   - every raw <img> loaded eagerly, which on a phone means eight images
 *     before the fold on /services.
 *
 * A convention that is not enforced is a convention that lasts two patches.
 */

const SOURCE_DIRS = ["app", "components"];
const ALLOWED_WIDTHS = new Set(["max-w-3xl", "max-w-6xl"]);

function walkSource(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walkSource(full, out);
    else if (entry.name.endsWith(".tsx")) out.push(full);
  }
  return out;
}

const sourceFiles = SOURCE_DIRS.flatMap((d) => walkSource(d));

for (const file of sourceFiles) {
  const src = readFileSync(file, "utf8");

  // 6a. Page rails use one of two widths. `mx-auto` marks a page rail; a
  //     `max-w-*` on an inline element (a heading, a paragraph) is fine.
  for (const m of src.matchAll(/className="([^"]*\bmx-auto\b[^"]*\bpx-4\b[^"]*)"/g)) {
    for (const cls of m[1].split(/\s+/)) {
      if (!/^max-w-(\d|s|m|l|x|f|p|n)/.test(cls)) continue;
      if (cls.startsWith("max-w-[")) continue; // a deliberate one-off measure
      if (!ALLOWED_WIDTHS.has(cls)) {
        fail(`${file} — page rail uses ${cls}; only max-w-6xl (wide) and max-w-3xl (prose) are allowed`);
      }
    }
  }

  // 6b. One h1 scale across the site.
  for (const m of src.matchAll(/<h1\b[^>]*className="([^"]*)"/g)) {
    const cls = m[1];
    if (!/\btext-4xl\b/.test(cls)) continue;
    if (!/leading-\[1\.08\]/.test(cls)) {
      fail(`${file} — <h1> does not use the site h1 scale (leading-[1.08] font-medium sm:text-5xl)`);
    }
  }

  // 6c. Photography goes through next/image, so the AVIF/WebP + srcset
  //     pipeline configured in next.config.mjs actually applies to it.
  if (!["components/photo.tsx", "components/before-after.tsx"].includes(file)) {
    for (const m of src.matchAll(/<img\b[\s\S]*?\/>/g)) {
      const line = src.slice(0, m.index).split("\n").length;
      fail(`${file}:${line} — raw <img> bypasses the image optimizer; use <Photo>`);
    }
  }
}

/* --------------------------------------------------------- 7. the report */

const line = "─".repeat(64);
console.log(line);
console.log(`Green Hardwood — site audit`);
console.log(line);
console.log(`Prerendered pages   ${pages.length}`);
console.log(`Unique titles       ${titles.size}`);
console.log(`JSON-LD blocks      ${ldCount}`);
console.log(`Schema types        ${[...ldTypes].sort().join(", ")}`);
console.log(line);

if (warnings.length) {
  console.log(`\n${warnings.length} warning${warnings.length === 1 ? "" : "s"}:`);
  for (const w of warnings) console.log(`  ~ ${w}`);
}

if (failures.length) {
  console.log(`\n${failures.length} failure${failures.length === 1 ? "" : "s"}:`);
  for (const f of failures) console.log(`  ✗ ${f}`);
  console.log("");
  process.exit(1);
}

console.log(`\n✓ No broken links, no duplicate titles, no missing canonicals or alt text.\n`);
