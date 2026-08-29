#!/usr/bin/env node
/**
 * IndexNow submission.
 *
 * IndexNow tells Bing, Yandex, Seznam and Naver — and, through them, several
 * answer engines — that URLs changed, instead of waiting for a crawl. Google
 * does not participate, but Google reads the sitemap; between the two, every
 * page is announced rather than discovered.
 *
 * Three things were wrong with the previous version, and together they meant
 * it had almost certainly never successfully run:
 *
 *   1. It was wired to nothing. `npm run indexnow` existed and no workflow
 *      called it, which makes it a chore, and chores do not happen.
 *   2. No key file was ever committed, so verification would have 403'd.
 *   3. Its URL list was a second, hand-maintained copy of the sitemap's route
 *      logic — and it omitted /methods, /problems, /answers and /glossary,
 *      which is precisely the AI-targeted content the site was built around.
 *
 * This version derives the URL list from the built sitemap, so the two cannot
 * drift, and exits 0 with an explanation when it is not configured — a missing
 * optional key should not fail a deploy.
 *
 * Setup, once:
 *   1. node scripts/indexnow.mjs --init      (prints a key and the file to add)
 *   2. Commit the printed public/<key>.txt.
 *   3. Set INDEXNOW_KEY in Vercel and in the repo's Actions secrets.
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";

const SITEMAP = ".next/server/app/sitemap.xml.body";
const PUBLIC_DIR = "public";

/* ----------------------------------------------------------------- --init */

if (process.argv.includes("--init")) {
  const key = randomUUID().replace(/-/g, "");
  console.log(`\nIndexNow key: ${key}\n`);
  console.log(`1. Create public/${key}.txt containing exactly:\n\n   ${key}\n`);
  console.log(`2. Commit it. It must be fetchable at https://<your-domain>/${key}.txt`);
  console.log(`3. Set INDEXNOW_KEY=${key} in Vercel and in GitHub Actions secrets.\n`);
  process.exit(0);
}

/* ------------------------------------------------------------ preflight */

const key = process.env.INDEXNOW_KEY;
if (!key) {
  // Not an error. A deploy without the key configured should still succeed.
  console.log("INDEXNOW_KEY is not set — skipping submission.");
  console.log("Run `node scripts/indexnow.mjs --init` to set it up.");
  process.exit(0);
}

const keyFile = join(PUBLIC_DIR, `${key}.txt`);
if (!existsSync(keyFile)) {
  console.error(`\n✗ ${keyFile} does not exist.`);
  console.error("  IndexNow verifies ownership by fetching that file. Without it every");
  console.error("  submission is rejected, silently, forever.\n");
  const present = existsSync(PUBLIC_DIR)
    ? readdirSync(PUBLIC_DIR).filter((f) => /^[0-9a-f]{16,}\.txt$/.test(f))
    : [];
  if (present.length) console.error(`  Found a key file for a different key: ${present.join(", ")}`);
  console.error("  Run `node scripts/indexnow.mjs --init` and commit the file it names.\n");
  process.exit(1);
}

/* ------------------------------------------------- URLs, from the sitemap */

/**
 * The sitemap is the single source for what this site publishes. Reading it
 * rather than rebuilding the route list means /problems, /methods, /answers
 * and everything added next month are included automatically.
 */
function urlsFromSitemap() {
  const candidates = [
    SITEMAP,
    ".next/server/app/sitemap.xml/route.body",
    "public/sitemap.xml",
  ].filter(existsSync);

  for (const file of candidates) {
    const xml = readFileSync(file, "utf8");
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    if (urls.length) return urls;
  }
  return [];
}

let urlList = urlsFromSitemap();

if (urlList.length === 0) {
  console.error("\n✗ Could not read a built sitemap.");
  console.error("  Run `npm run build` first — this script submits what was actually built,");
  console.error("  not what the source says should exist.\n");
  process.exit(1);
}

// The text surfaces are not in the sitemap but do change with every content
// edit, and they are the files an answer engine reads first.
const base = new URL(urlList[0]).origin;
urlList = [...urlList, `${base}/llms.txt`, `${base}/llms-full.txt`, `${base}/ai.txt`];

const host = new URL(base).host;

if (host.endsWith(".vercel.app")) {
  console.error(`\n✗ Refusing to submit ${host}.`);
  console.error("  Submitting a preview host teaches four search engines that the brand");
  console.error("  lives on vercel.app, and every one of those URLs has to be redirected");
  console.error("  later. Attach the real domain first.\n");
  process.exit(1);
}

/* ----------------------------------------------------------- submission */

console.log(`Submitting ${urlList.length} URLs for ${host}…`);

const res = await fetch("https://api.indexnow.org/IndexNow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key, keyLocation: `${base}/${key}.txt`, urlList }),
});

// 200 = accepted. 202 = accepted, key not yet verified — normal on first run.
if (res.ok) {
  console.log(`✓ IndexNow accepted ${urlList.length} URLs (HTTP ${res.status}).`);
  if (res.status === 202) {
    console.log(`  202 means the key file has not been fetched yet. Confirm ${base}/${key}.txt resolves.`);
  }
} else {
  console.error(`✗ IndexNow rejected the submission: HTTP ${res.status}`);
  console.error(await res.text().catch(() => ""));
  process.exit(1);
}
