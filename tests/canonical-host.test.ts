import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { CANONICAL_HOST, hostPolicy } from "../lib/canonical-host";

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
