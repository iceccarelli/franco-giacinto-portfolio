import { test, describe } from "node:test";
import assert from "node:assert/strict";

/**
 * The production deployment is reachable on two hosts: greenhardwood.ca and
 * the project's *.vercel.app alias. Only the first may be indexed.
 *
 * The bug this exists for: `IS_PREVIEW` (VERCEL_ENV === "preview") never
 * matches the production deployment's own .vercel.app alias, so that alias
 * shipped "index, follow" and competed with greenhardwood.ca for its own
 * queries. The fix is a host-matched X-Robots-Tag header in next.config.mjs.
 * This test fails if that header rule is ever removed or loosened.
 */
describe("the vercel.app alias can never be indexed", () => {
  test("next.config.mjs sends X-Robots-Tag noindex for every *.vercel.app host", async () => {
    const config = (await import("../next.config.mjs")).default;
    const rules = await config.headers();

    const rule = rules.find(
      (r) =>
        Array.isArray(r.has) &&
        r.has.some((h) => h.type === "host" && /vercel\\?\.app/.test(h.value ?? "")),
    );

    assert.ok(rule, "no host-matched header rule for *.vercel.app in next.config.mjs");

    const robots = rule.headers.find((h) => h.key.toLowerCase() === "x-robots-tag");
    assert.ok(robots, "the vercel.app host rule does not set X-Robots-Tag");
    assert.match(robots.value, /noindex/, "X-Robots-Tag on vercel.app hosts must say noindex");
    assert.equal(rule.source, "/:path*", "the noindex must cover every path, not a subset");
  });

  test("the canonical host is not caught by the noindex rule", async () => {
    const config = (await import("../next.config.mjs")).default;
    const rules = await config.headers();

    for (const r of rules) {
      if (!Array.isArray(r.has)) continue;
      for (const h of r.has) {
        if (h.type !== "host") continue;
        const pattern = new RegExp(`^${h.value}$`);
        assert.ok(
          !pattern.test("greenhardwood.ca"),
          `host pattern ${h.value} would apply its headers to the canonical domain`,
        );
      }
    }
  });
});
