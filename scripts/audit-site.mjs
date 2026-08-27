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
// Route handlers and metadata routes produce no .html file.
const generatedRoutes = new Set([
  "/sitemap.xml",
  "/robots.txt",
  "/manifest.webmanifest",
  "/feed.xml",
  "/llms-full.txt",
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

/* --------------------------------------------------------- 6. the report */

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
