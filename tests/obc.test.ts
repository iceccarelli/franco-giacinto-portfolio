import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { checkObc, defaultObc, OBC_LIMITS, obcRules } from "@/data/obc";

/**
 * The stair checker is the site's most load-bearing claim: it tells a homeowner
 * whether a flight would pass inspection. A wrong threshold here is worse than
 * no checker at all.
 */

describe("checkObc", () => {
  test("the default flight passes", () => {
    const { pass, checks } = checkObc(defaultObc());
    assert.equal(pass, true);
    assert.ok(checks.every((c) => c.ok));
  });

  test("a rise over the maximum fails", () => {
    const result = checkObc({ ...defaultObc(), riseMm: OBC_LIMITS.maxRiseMm + 1 });
    assert.equal(result.pass, false);
    assert.equal(result.checks.find((c) => c.id === "rise")?.ok, false);
  });

  test("a rise exactly at the maximum passes — boundaries are inclusive", () => {
    const result = checkObc({ ...defaultObc(), riseMm: OBC_LIMITS.maxRiseMm });
    assert.equal(result.checks.find((c) => c.id === "rise")?.ok, true);
  });

  test("a run below the minimum fails", () => {
    const result = checkObc({ ...defaultObc(), runMm: OBC_LIMITS.minRunMm - 1 });
    assert.equal(result.checks.find((c) => c.id === "run")?.ok, false);
  });

  test("tread depth is run plus nosing, not run alone", () => {
    const runOnly = OBC_LIMITS.minTreadMm - 10;
    const result = checkObc({ ...defaultObc(), runMm: runOnly, nosingMm: 20 });
    assert.equal(result.tread, runOnly + 20);
    assert.equal(result.checks.find((c) => c.id === "tread")?.ok, true);
  });

  test("an over-projecting nosing fails — the classic retread mistake", () => {
    const result = checkObc({ ...defaultObc(), nosingMm: OBC_LIMITS.maxNosingMm + 5 });
    assert.equal(result.checks.find((c) => c.id === "nosing")?.ok, false);
  });

  test("a flat cap rail is not graspable", () => {
    const result = checkObc({ ...defaultObc(), railDiameterMm: 140 });
    assert.equal(result.checks.find((c) => c.id === "grasp")?.ok, false);
  });

  test("two risers do not trigger the handrail rule; three do", () => {
    const noRail = { ...defaultObc(), handrailMm: 0 };
    assert.equal(
      checkObc({ ...noRail, risers: OBC_LIMITS.handrailRiserTrigger - 1 }).checks.find(
        (c) => c.id === "handrail-req",
      )?.ok,
      true,
    );
    assert.equal(
      checkObc({ ...noRail, risers: OBC_LIMITS.handrailRiserTrigger }).checks.find(
        (c) => c.id === "handrail-req",
      )?.ok,
      false,
    );
  });

  test("a short guard fails", () => {
    const result = checkObc({ ...defaultObc(), guardMm: OBC_LIMITS.minGuardMm - 1 });
    assert.equal(result.checks.find((c) => c.id === "guard")?.ok, false);
  });

  test("every check carries a detail a homeowner can act on", () => {
    for (const c of checkObc(defaultObc()).checks) {
      assert.ok(c.detail.length > 20, `${c.id} needs a real explanation`);
      assert.ok(c.label.length > 0);
    }
  });
});

describe("obcRules", () => {
  test("the prose quotes the same numbers the checker enforces", () => {
    const byId = new Map(obcRules.map((r) => [r.id, r.rule]));
    assert.match(byId.get("rise") ?? "", new RegExp(String(OBC_LIMITS.maxRiseMm)));
    assert.match(byId.get("run") ?? "", new RegExp(String(OBC_LIMITS.minRunMm)));
    assert.match(byId.get("tread") ?? "", new RegExp(String(OBC_LIMITS.minTreadMm)));
    assert.match(byId.get("guard") ?? "", new RegExp(String(OBC_LIMITS.minGuardMm)));
  });
});
