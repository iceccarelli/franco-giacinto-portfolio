import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

import { buildVCard } from "@/lib/vcard";
import { company } from "@/data/company";
import { allNavHrefs, footerColumns } from "@/data/navigation";

describe("the vCard", () => {
  const card = buildVCard();
  const lines = card.split("\r\n");
  const get = (key: string) => lines.find((l) => l.startsWith(key + ":") || l.startsWith(key + ";"));

  test("is a well-formed vCard 4.0", () => {
    assert.equal(lines[0], "BEGIN:VCARD");
    assert.equal(lines[1], "VERSION:4.0");
    assert.equal(lines.at(-2), "END:VCARD");
    assert.ok(card.endsWith("\r\n"), "must end with CRLF");
  });

  test("uses CRLF throughout — a bare LF is rejected by some Windows importers", () => {
    assert.ok(!/[^\r]\n/.test(card), "found a line ending that is not CRLF");
  });

  test("no line exceeds 75 octets unfolded", () => {
    for (const line of lines) {
      if (line.startsWith(" ")) continue; // a folded continuation
      assert.ok(
        Buffer.byteLength(line, "utf8") <= 75 || lines[lines.indexOf(line) + 1]?.startsWith(" "),
        `line over 75 octets and not folded: ${line.slice(0, 40)}…`,
      );
    }
  });

  test("carries the same NAP the site publishes", () => {
    /**
     * The whole point of shipping a vCard is that the number and address land
     * in someone's phone spelled the way every directory listing and the
     * Google Business Profile must spell them. If this drifts from
     * data/company.ts, the card actively creates the entity fragmentation the
     * rest of the site works to avoid.
     */
    // Compare against the escaped form: "88 Sterling Road, Unit 6" is stored
    // as "88 Sterling Road\, Unit 6", because RFC 6350 reserves the comma.
    const escaped = (v: string) => v.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;");
    // Unfold first — a long line is split across a CRLF plus one space.
    const unfolded = card.replace(/\r\n /g, "");

    assert.ok(unfolded.includes(company.phone), "phone missing");
    assert.ok(unfolded.includes(company.email), "email missing");
    assert.ok(unfolded.includes(escaped(company.address.line1)), "street missing");
    assert.ok(unfolded.includes(company.address.postal), "postal code missing");
    assert.ok(unfolded.includes(escaped(company.legalName)), "legal name missing");
    assert.ok(unfolded.includes(company.founder), "the founder is not named on the card");
  });

  test("escapes the characters RFC 6350 requires", () => {
    // company.tagline contains commas; they must be escaped inside NOTE.
    const note = get("NOTE");
    assert.ok(note, "NOTE missing");
    const body = note.slice(note.indexOf(":") + 1);
    const bare = body.replace(/\\[,;\\n]/g, "");
    assert.ok(!/[,;]/.test(bare), "an unescaped comma or semicolon survived into NOTE");
  });

  test("the address is structured, not a single blob", () => {
    const adr = get("ADR");
    assert.ok(adr, "ADR missing");
    // PO;ext;street;locality;region;postcode;country -> 7 fields
    assert.equal(adr.slice(adr.indexOf(":") + 1).split(";").length, 7);
  });
});

describe("the card page", () => {
  test("exists, with its own OG image and download route", () => {
    for (const f of [
      "app/card/page.tsx",
      "app/card/opengraph-image.tsx",
      "app/card.vcf/route.ts",
      "components/card/business-card.tsx",
    ]) {
      assert.ok(existsSync(f), `${f} is missing`);
    }
  });

  test("reuses the About page's Person node rather than minting a second one", () => {
    /**
     * Two Person nodes for one man is exactly the entity fragmentation that
     * stops an assistant resolving a small company to a real business. The
     * ProfilePage must point mainEntity at /about#franco.
     */
    const src = readFileSync("app/card/page.tsx", "utf8");
    assert.match(src, /mainEntity:\s*\{\s*"@id":\s*`\$\{SITE_URL\}\/about#franco`/);
    assert.ok(
      !/"@type":\s*"Person"/.test(src),
      "the card declares its own Person node; import personLd() instead",
    );
  });

  test("is reachable from the navigation, not just the sitemap", () => {
    assert.ok(allNavHrefs().includes("/card"), "/card is not in data/navigation.ts");
    const inFooter = footerColumns.flatMap((c) => c.links.map((l) => l.href));
    assert.ok(inFooter.includes("/card"), "/card is not in the footer");
  });

  test("the vCard is published where a machine will look", () => {
    for (const f of ["app/llms.txt/route.ts", "app/ai.txt/route.ts"]) {
      assert.ok(readFileSync(f, "utf8").includes("/card.vcf"), `${f} does not mention /card.vcf`);
    }
  });

  test("prints at a real business-card size", () => {
    const css = readFileSync("app/globals.css", "utf8");
    assert.match(css, /@media print/);
    assert.match(css, /3\.5in/, "the print rules do not set the standard card width");
    assert.match(css, /2in/, "the print rules do not set the standard card height");
    assert.match(
      css,
      /print-color-adjust:\s*exact/,
      "without print-color-adjust the forest-green card prints as a blank white rectangle",
    );
  });
});
