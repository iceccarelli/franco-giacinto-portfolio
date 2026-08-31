import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { CANONICAL_HOST, hostPolicy, isCorsPublicPath } from "../lib/canonical-host";

/**
 * The middleware host guard in one sentence: only greenhardwood.ca may be
 * indexed, www redirects to it, and every other host — every *.vercel.app
 * preview, alias, or mirror — is served with noindex.
 *
 * These tests pin the pure policy so a refactor of middleware.ts cannot
 * silently loosen it.
 */
describe("canonical host policy", () => {
  test("the canonical host derives from the business fact", () => {
    assert.equal(CANONICAL_HOST, "greenhardwood.ca");
  });

  test("the canonical apex serves normally", () => {
    assert.deepEqual(hostPolicy("greenhardwood.ca"), { action: "canonical" });
    assert.deepEqual(hostPolicy("GreenHardwood.ca"), { action: "canonical" });
  });

  test("www 308s to the apex", () => {
    assert.deepEqual(hostPolicy("www.greenhardwood.ca"), {
      action: "redirect",
      host: "greenhardwood.ca",
    });
  });

  test("every vercel.app host is noindexed", () => {
    for (const host of [
      "franco-giacinto-portfolio.vercel.app",
      "franco-giacinto-portfolio-git-main-x.vercel.app",
      "some-preview-abc123.vercel.app",
    ]) {
      assert.deepEqual(hostPolicy(host), { action: "noindex" }, host);
    }
  });

  test("an unknown mirror host is noindexed, not redirected", () => {
    assert.deepEqual(hostPolicy("greenhardwood.example.com"), { action: "noindex" });
    assert.deepEqual(hostPolicy("evil-greenhardwood.ca"), { action: "noindex" });
  });

  test("a lookalike subdomain of the canonical is not treated as canonical", () => {
    assert.deepEqual(hostPolicy("staging.greenhardwood.ca"), { action: "noindex" });
  });

  test("local development is exempt", () => {
    assert.deepEqual(hostPolicy("localhost:3000"), { action: "canonical" });
    assert.deepEqual(hostPolicy("127.0.0.1:3000"), { action: "canonical" });
  });

  test("a missing Host header fails closed", () => {
    assert.deepEqual(hostPolicy(null), { action: "noindex" });
    assert.deepEqual(hostPolicy(""), { action: "noindex" });
  });

  test("a port on the canonical host does not defeat the match", () => {
    assert.deepEqual(hostPolicy("greenhardwood.ca:443"), { action: "canonical" });
  });
});

/**
 * Which paths may be read cross-origin.
 *
 * Production was measured serving `Access-Control-Allow-Origin: *` on HTML —
 * on the canonical domain — from a Vercel dashboard header rule that exists in
 * no file in this repository. middleware.ts strips it everywhere except the
 * agent surfaces. If someone widens that list to include a page, this fails.
 */
describe("CORS surface", () => {
  test("the agent endpoints stay cross-origin readable", () => {
    for (const path of [
      "/api/facts.json",
      "/api/services.json",
      "/api/areas.json",
      "/api/ask",
      "/card.vcf",
      "/.well-known/agents.json",
      "/llms.txt",
      "/llms-full.txt",
      "/ai.txt",
      "/feed.xml",
    ]) {
      assert.ok(isCorsPublicPath(path), `${path} must keep CORS *`);
    }
  });

  test("no HTML page is cross-origin readable", () => {
    for (const path of [
      "/",
      "/estimate",
      "/stairs",
      "/areas/vaughan",
      "/services/hardwood-stairs/toronto",
      "/card",
      "/about",
      "/contact",
    ]) {
      assert.ok(!isCorsPublicPath(path), `${path} must not send ACAO *`);
    }
  });

  test("a path that merely starts with an endpoint name is not public", () => {
    assert.ok(!isCorsPublicPath("/card.vcf.html"));
    assert.ok(!isCorsPublicPath("/ai.txt-mirror"));
  });
});
