import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { respond } from "@/lib/assistant/respond";
import { detectCity, detectIntent, detectService, retrieve } from "@/lib/assistant/knowledge";

/**
 * The assistant speaks for the business. These tests exist because the failure
 * mode is not a crash — it is a confident wrong number, or a claim that a stair
 * passes inspection.
 */

describe("intent detection", () => {
  test("recognises a price question", () => {
    for (const q of [
      "how much do stairs cost",
      "what's the price of refinishing",
      "give me an estimate",
      "is it expensive",
    ]) {
      assert.equal(detectIntent(q), "pricing", q);
    }
  });

  test("recognises a code question", () => {
    assert.equal(detectIntent("will my stairs pass inspection"), "code");
    assert.equal(detectIntent("what is the max rise under OBC"), "code");
  });

  test("recognises an out-of-scope question", () => {
    assert.equal(detectIntent("do you install vinyl plank"), "scope");
    assert.equal(detectIntent("can you do laminate"), "scope");
    assert.equal(detectIntent("do you sell carpet"), "scope");
  });

  test("does NOT treat a carpet-to-hardwood conversion as out of scope", () => {
    // The single most valuable query on the site. Reading the word "carpet"
    // and replying "we do not install carpet" would be true and catastrophic.
    for (const q of [
      "carpet to hardwood stairs",
      "replacing carpet on stairs with oak",
      "can you put hardwood over carpet stairs",
      "we want to rip out the carpet and do hardwood",
      "convert carpeted stairs to wood",
    ]) {
      assert.notEqual(detectIntent(q), "scope", q);
    }
  });

  test("recognises a contact question", () => {
    assert.equal(detectIntent("what are your hours"), "contact");
    assert.equal(detectIntent("can I call you"), "contact");
  });
});

describe("entity detection", () => {
  test("finds a city named anywhere in the question", () => {
    assert.equal(detectCity("do you do stairs in Vaughan?")?.slug, "vaughan");
    assert.equal(detectCity("RICHMOND HILL refinishing")?.slug, "richmond-hill");
    assert.equal(detectCity("somewhere in Alberta"), undefined);
  });

  test("infers the service from vocabulary, not just its name", () => {
    assert.equal(detectService("my treads are worn")?.slug, "hardwood-stairs");
    assert.equal(detectService("the handrail is loose")?.slug, "hardwood-railings");
    assert.equal(detectService("can you sand and recoat")?.slug, "sanding-refinishing");
    assert.equal(detectService("water damage in the kitchen")?.slug, "hardwood-repairs");
  });
});

describe("grounded replies", () => {
  test("a city + service price question returns that city's band", () => {
    const r = respond("how much are hardwood stairs in Vaughan");
    assert.equal(r.basis, "grounded");
    assert.match(r.answer, /Vaughan/);
    assert.match(r.answer, /\$[\d,]+–\$[\d,]+/, "must quote a real range");
    assert.ok(r.sources.some((s) => s.path === "/services/hardwood-stairs/vaughan"));
  });

  test("different cities produce different quoted numbers", () => {
    const toronto = respond("hardwood stairs cost in Toronto").answer;
    const brampton = respond("hardwood stairs cost in Brampton").answer;
    assert.notEqual(toronto, brampton, "the city multiplier must reach the assistant");
  });

  test("a price question without a city asks for one instead of guessing", () => {
    const r = respond("what does hardwood installation cost");
    assert.equal(r.basis, "grounded");
    assert.match(r.answer, /city/i);
  });

  test("a code question never says a specific stair passes", () => {
    const r = respond("will my stairs pass inspection");
    assert.match(r.answer, /building department|municipal/i);
    assert.ok(
      !/your stair (passes|will pass)/i.test(r.answer),
      "must not certify a stair it has not seen",
    );
  });

  test("a carpet-to-hardwood question answers the conversion, not the refusal", () => {
    const r = respond("carpet to hardwood stairs");
    assert.equal(r.basis, "grounded");
    assert.ok(
      !/we do not install/i.test(r.answer),
      "must not answer the flagship query with a refusal",
    );
    assert.match(r.answer, /carpet|tread|stringer/i);
  });

  test("an out-of-scope question is declined plainly", () => {
    const r = respond("do you install vinyl plank flooring");
    assert.match(r.answer, /do not install/i);
    assert.match(r.answer, /vinyl/i);
  });

  test("a contact question returns the real NAP", () => {
    const r = respond("how do I reach you");
    assert.match(r.answer, /\(416\) 847-3366/);
    assert.match(r.answer, /Sterling Road/);
  });

  test("an unknown question admits it and escalates", () => {
    const r = respond("what is your position on quantum mechanics");
    assert.equal(r.basis, "fallback");
    assert.match(r.answer, /do not have|rather say so/i);
    assert.match(r.answer, /\(416\) 847-3366/);
  });

  test("every reply that cites a source cites an internal path", () => {
    for (const q of [
      "hardwood stairs Oakville price",
      "what is acclimation",
      "who is Franco",
      "nail down vs glue down",
      "do you do decks",
    ]) {
      const r = respond(q);
      for (const s of r.sources) {
        assert.ok(s.path.startsWith("/"), `${q} → source ${s.path} is not internal`);
      }
    }
  });

  test("never returns an empty answer", () => {
    for (const q of ["", "  ", "?", "stairs", "asdfghjkl", "hello"]) {
      assert.ok(respond(q).answer.length > 20, `empty-ish reply for ${JSON.stringify(q)}`);
    }
  });
});

describe("retrieval", () => {
  test("ranks a direct answer above a glossary term for a question", () => {
    const hits = retrieve("how much do hardwood stairs cost");
    assert.ok(hits.length > 0);
    assert.notEqual(hits[0]?.passage.kind, "Term");
  });

  test("an empty query retrieves nothing", () => {
    assert.deepEqual(retrieve(""), []);
    assert.deepEqual(retrieve("the a of"), []);
  });
});
