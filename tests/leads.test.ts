import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { parseLead, cityLabel, serviceLabel } from "@/lib/leads";

/**
 * Lead validation is the last thing standing between a visitor and a lost
 * enquiry. Every rule here corresponds to a way a real submission can fail.
 */

function form(overrides: Record<string, string> = {}) {
  const fd = new FormData();
  const base = {
    name: "Franco Test",
    phone: "(416) 847-3366",
    email: "someone@example.com",
    city: "vaughan",
    service: "stairs",
    sqft: "",
    message: "Carpet stairs in a 2019 build, thirteen steps, want solid oak.",
    ...overrides,
  };
  for (const [k, v] of Object.entries(base)) fd.set(k, v);
  return fd;
}

describe("parseLead", () => {
  test("accepts a well-formed request", () => {
    const result = parseLead(form(), "/contact");
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.lead.city, "vaughan");
    assert.equal(result.lead.source, "/contact");
    assert.equal(result.lead.sqft, null, "blank sq ft is null, not 0 or NaN");
    assert.ok(Date.parse(result.lead.receivedAt), "receivedAt is a valid timestamp");
  });

  test("normalises email to lowercase so duplicates collapse", () => {
    const result = parseLead(form({ email: "Someone@Example.COM" }), "x");
    assert.equal(result.ok, true);
    if (result.ok) assert.equal(result.lead.email, "someone@example.com");
  });

  test("accepts the phone formats people actually type", () => {
    for (const phone of [
      "(416) 847-3366",
      "416-847-3366",
      "4168473366",
      "+1 416 847 3366",
      "1-416-847-3366",
    ]) {
      const result = parseLead(form({ phone }), "x");
      assert.equal(result.ok, true, `should accept ${phone}`);
    }
  });

  test("rejects a phone number that cannot be dialled", () => {
    for (const phone of ["", "12345", "call me"]) {
      const result = parseLead(form({ phone }), "x");
      assert.equal(result.ok, false, `should reject ${JSON.stringify(phone)}`);
      if (!result.ok) assert.ok(result.errors.phone);
    }
  });

  test("rejects an unreachable email", () => {
    for (const email of ["", "franco", "franco@", "franco@localhost", "a b@c.com"]) {
      const result = parseLead(form({ email }), "x");
      assert.equal(result.ok, false, `should reject ${JSON.stringify(email)}`);
    }
  });

  test("rejects a city or service that is not on the list", () => {
    // Guards against a tampered <select> reaching the crew router.
    assert.equal(parseLead(form({ city: "montreal" }), "x").ok, false);
    assert.equal(parseLead(form({ service: "carpet" }), "x").ok, false);
  });

  test("parses sq ft written the way people write it", () => {
    const result = parseLead(form({ sqft: "1,200 sq ft" }), "x");
    assert.equal(result.ok, true);
    if (result.ok) assert.equal(result.lead.sqft, 1200);
  });

  test("rejects an absurd sq ft rather than quoting it", () => {
    assert.equal(parseLead(form({ sqft: "999999" }), "x").ok, false);
  });

  test("returns every error at once, not just the first", () => {
    const result = parseLead(form({ name: "", phone: "1", email: "nope" }), "x");
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.ok(result.errors.name);
    assert.ok(result.errors.phone);
    assert.ok(result.errors.email);
  });

  test("echoes values back so a failed round trip does not clear the form", () => {
    const result = parseLead(form({ email: "bad", message: "Water damage in the kitchen." }), "x");
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.values.message, "Water damage in the kitchen.");
      assert.equal(result.values.email, "bad");
    }
  });

  test("trims whitespace instead of storing it", () => {
    const result = parseLead(form({ name: "  Franco  " }), "x");
    assert.equal(result.ok, true);
    if (result.ok) assert.equal(result.lead.name, "Franco");
  });

  test("rejects a one-word message that tells the crew nothing", () => {
    assert.equal(parseLead(form({ message: "hi" }), "x").ok, false);
  });
});

describe("labels", () => {
  test("resolve to human-readable names for the notification email", () => {
    assert.equal(cityLabel("richmond-hill"), "Richmond Hill");
    assert.equal(serviceLabel("stairs"), "Hardwood stairs");
  });

  test("fall back to the raw value rather than throwing", () => {
    assert.equal(cityLabel("atlantis"), "atlantis");
    assert.equal(serviceLabel("unknown"), "unknown");
  });
});
