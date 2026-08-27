#!/usr/bin/env node
/**
 * IndexNow submission.
 *
 * IndexNow tells Bing, Yandex, Seznam, Naver — and, through them, several answer
 * engines — that URLs changed, instead of waiting for a crawl. Google does not
 * participate, but Google reads the sitemap; between the two, every page is
 * announced rather than discovered.
 *
 * Setup, once:
 *   1. Pick a key: `node -e "console.log(crypto.randomUUID().replace(/-/g,''))"`
 *   2. Save it as public/<key>.txt containing exactly that key, and commit it.
 *   3. Put the same value in INDEXNOW_KEY (Vercel env, and .env.local for dev).
 *
 * Then after a deploy that changed content:  npm run indexnow
 */

import { cities } from "../data/areas.ts";
import { company } from "../data/company.ts";
import { guides } from "../data/guides.ts";
import { matrixPages } from "../data/matrix.ts";
import { services } from "../data/services.ts";

const key = process.env.INDEXNOW_KEY;
if (!key) {
  console.error("INDEXNOW_KEY is not set. See the header of this file for setup.");
  process.exit(1);
}

const host = new URL(company.website).host;

const staticPaths = [
  "/",
  "/services",
  "/stairs",
  "/areas",
  "/guides",
  "/portfolio",
  "/showroom",
  "/estimate",
  "/compare",
  "/process",
  "/care",
  "/warranty",
  "/trade",
  "/emergency",
  "/faq",
  "/about",
  "/contact",
  "/for-agents",
];

const urlList = [
  ...staticPaths,
  ...services.map((s) => `/services/${s.slug}`),
  ...cities.map((c) => `/areas/${c.slug}`),
  ...guides.map((g) => `/guides/${g.slug}`),
  ...matrixPages.map((p) => p.path),
].map((p) => `${company.website}${p}`);

console.log(`Submitting ${urlList.length} URLs for ${host}…`);

const res = await fetch("https://api.indexnow.org/IndexNow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host,
    key,
    keyLocation: `${company.website}/${key}.txt`,
    urlList,
  }),
});

// 200 = accepted, 202 = accepted but key not yet verified.
if (res.ok) {
  console.log(`IndexNow accepted ${urlList.length} URLs (HTTP ${res.status}).`);
} else {
  console.error(`IndexNow rejected the submission: HTTP ${res.status}`);
  console.error(await res.text().catch(() => ""));
  process.exit(1);
}
