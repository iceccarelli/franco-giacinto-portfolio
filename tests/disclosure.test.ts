import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * FAQ answers must be in the HTML.
 *
 * They were not. `@radix-ui/react-accordion` unmounts the content of a closed
 * item, so on the homepage, /faq, 8 service pages, 224 service × city pages,
 * 32 city hubs and 9 method pages, the rendered <body> carried every question
 * and not one answer. /faq shipped 53 items with `data-state="closed"` and no
 * answer text at all. The copy existed only in the RSC flight payload and in
 * the FAQPage JSON-LD; Google renders JavaScript but does not click
 * accordions, and an answer engine reading HTML saw questions with nothing
 * under them.
 *
 * Nothing in the test suite noticed, because every assertion about FAQs was
 * about the DATA — that the questions exist, that the bands agree — and none
 * about whether the answer survived rendering. These are the ones that would
 * have caught it, and they are deliberately about the component's mechanism
 * rather than about a snapshot, so they keep holding if the markup is restyled.
 */

describe("disclosure content is not unmounted when collapsed", () => {
  const src = readFileSync("components/ui/accordion.tsx", "utf8");

  test("the accordion is built on native <details>", () => {
    assert.match(src, /<details/, "the disclosure no longer uses <details>");
    assert.match(src, /<summary/, "a disclosure needs a <summary> to be one");
  });

  test("no JavaScript accordion library is used for it", () => {
    // An import, not a mention: the file explains at length WHY Radix was
    // removed, and that explanation must not trip its own guard. (Third time
    // this session that a comment has failed a regex written against it.)
    const imports = src
      .split("\n")
      .filter((l) => /^\s*import\b/.test(l))
      .join("\n");
    assert.ok(
      !/radix-ui/.test(imports),
      "Radix unmounts closed content, which is what hid every FAQ answer from search",
    );
    assert.ok(
      !src.startsWith('"use client"'),
      "the disclosure should render on the server; it needs no client state",
    );
  });

  test("the dependency is gone from package.json too", () => {
    const pkg = readFileSync("package.json", "utf8");
    assert.ok(
      !pkg.includes("@radix-ui/react-accordion"),
      "the accordion package is still installed and can be reached for again",
    );
  });

  test("content is never conditionally rendered away", () => {
    // The specific failure mode: `open && <div>…` or a state check that
    // removes the answer from the tree.
    const content = src.slice(src.indexOf("export function AccordionContent"));
    assert.ok(
      !/\bopen\s*&&/.test(content) && !/useState/.test(content),
      "AccordionContent gates its children on open state — that is the original bug",
    );
  });

  test("every page that asks a question still renders through this component", () => {
    const pages: string[] = [];
    const walk = (dir: string) => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name);
        if (statSync(full).isDirectory()) walk(full);
        else if (entry.name === "page.tsx" && readFileSync(full, "utf8").includes("AccordionContent"))
          pages.push(full);
      }
    };
    walk("app");
    // homepage, /faq, services/[slug], services/[slug]/[city], areas/[city], methods/[slug]
    assert.ok(pages.length >= 6, `only ${pages.length} pages use the disclosure; expected 6`);
  });
});
