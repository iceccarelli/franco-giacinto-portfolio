import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { CONVERSION_EVENTS, track } from "../lib/analytics";

/**
 * The measurement layer's failure mode is silent: an event renamed at the call
 * site still compiles, still fires, and simply never reaches the GTM trigger
 * listening for the old name. Nobody notices until a month of conversion data
 * is missing. These tests make that loud.
 */

/** Every event name declared in the AnalyticsEvent union, read from source. */
function declaredEvents(): string[] {
  const src = readFileSync("lib/analytics.ts", "utf8");
  const union = src.slice(
    src.indexOf("export type AnalyticsEvent"),
    src.indexOf("export type AnalyticsEventName"),
  );
  return [...union.matchAll(/event:\s*"([a-z_]+)"/g)].map((m) => m[1] as string);
}

describe("analytics taxonomy", () => {
  test("every declared event is documented in docs/analytics.md", () => {
    const docs = readFileSync("docs/analytics.md", "utf8");
    for (const name of declaredEvents()) {
      assert.ok(
        docs.includes(`\`${name}\``),
        `${name} is emitted by the code but missing from docs/analytics.md`,
      );
    }
  });

  test("the conversion list is exactly the three reachability events", () => {
    assert.deepEqual([...CONVERSION_EVENTS], ["tel_click", "sms_click", "estimate_submit"]);
  });

  test("every conversion event is a real event in the union", () => {
    const declared = declaredEvents();
    for (const name of CONVERSION_EVENTS) {
      assert.ok(declared.includes(name), `${name} is marked a conversion but is not an event`);
    }
  });

  test("no second GA4 tag is loaded outside GTM", () => {
    for (const file of [
      "app/layout.tsx",
      "components/analytics/index.tsx",
      "components/analytics/gtm.tsx",
    ]) {
      const src = readFileSync(file, "utf8");
      assert.ok(
        !src.includes("gtag/js") && !src.includes("googletagmanager.com/gtag"),
        `${file} loads gtag.js directly — GTM already owns GA4, and two tags double every conversion`,
      );
    }
  });

  test("no event parameter is named after personal data", () => {
    const src = readFileSync("lib/analytics.ts", "utf8");
    // Whole parameter names only: `step_name` is a label, `name` would be a person.
    for (const banned of ["name", "email", "phone", "address", "message", "postal", "note"]) {
      assert.ok(
        !new RegExp(`(?<![a-z_])${banned}\\??:`).test(src),
        `lib/analytics.ts declares a "${banned}" parameter — no PII may reach an analytics vendor`,
      );
    }
  });

  test("the submit conversion is fired from the server verdict, not the button", () => {
    const form = readFileSync("components/estimate/quote-form.tsx", "utf8");
    assert.ok(
      form.includes('state.status !== "success"'),
      "estimate_submit must be gated on the action returning success, or failed submissions inflate it",
    );
    assert.ok(
      !/onSubmit=\{[^}]*track\(/.test(form),
      "estimate_submit must not fire from onSubmit — that counts validation bounces as leads",
    );
  });

  test("track() is a no-op on the server rather than a crash", () => {
    // No `window` in this runtime; this must not throw.
    assert.doesNotThrow(() => track({ event: "tel_click", location: "test" }));
  });
});
