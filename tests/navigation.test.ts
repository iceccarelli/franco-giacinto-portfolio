import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

import {
  allNavHrefs,
  flattenSections,
  footerColumns,
  legalLinks,
  navSections,
  utilityLinks,
} from "@/data/navigation";
import { services } from "@/data/services";
import { cities } from "@/data/areas";
import { guides } from "@/data/guides";

/* ------------------------------------------------------------------ routes */

/**
 * Every route the app actually defines, read off the filesystem. Dynamic
 * segments are expanded from the same data the pages use, so a nav link to
 * /guides/ontario-stair-code-hardwood is checked against the real guide list
 * rather than against a hand-kept allowlist that would rot.
 */
function realRoutes(): Set<string> {
  const out = new Set<string>();
  const walk = (dir: string, prefix: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      if (entry.name.startsWith("_") || entry.name === "api") continue;
      const full = join(dir, entry.name);
      const segment = entry.name.startsWith("(") ? "" : `/${entry.name}`;
      const path = `${prefix}${segment}`;
      if (existsSync(join(full, "page.tsx"))) out.add(path === "" ? "/" : path);
      walk(full, path);
    }
  };
  if (existsSync(join("app", "page.tsx"))) out.add("/");
  walk("app", "");

  // Expand the dynamic segments this site actually builds.
  for (const s of services) {
    out.add(`/services/${s.slug}`);
    for (const c of cities) out.add(`/services/${s.slug}/${c.slug}`);
  }
  for (const c of cities) out.add(`/areas/${c.slug}`);
  for (const g of guides) out.add(`/guides/${g.slug}`);
  return out;
}

const routes = realRoutes();

/* ------------------------------------------------------- link correctness */

describe("navigation links resolve", () => {
  test("every href in data/navigation.ts is a real route", () => {
    const dead = allNavHrefs().filter((href) => {
      const clean = href.split("#")[0] ?? href;
      // Skip the templated dynamic paths the expansion above already covers.
      return !routes.has(clean) && !clean.startsWith("/services/") && !clean.startsWith("/areas/");
    });
    assert.deepEqual(dead, [], `navigation points at routes that do not exist: ${dead.join(", ")}`);
  });

  test("dynamic nav links resolve to built pages", () => {
    const dynamic = allNavHrefs().filter(
      (h) => h.startsWith("/services/") || h.startsWith("/areas/") || h.startsWith("/guides/"),
    );
    assert.ok(dynamic.length > 0, "expected the nav to link at least one dynamic page");
    for (const href of dynamic) {
      assert.ok(routes.has(href), `${href} is in the navigation but is not a generated route`);
    }
  });

  test("no href is listed twice inside one footer column", () => {
    for (const column of footerColumns) {
      const seen = column.links.map((l) => l.href);
      assert.equal(
        new Set(seen).size,
        seen.length,
        `footer column "${column.heading}" repeats a link`,
      );
    }
  });
});

/* ------------------------------------------------ the parity that matters */

describe("web and mobile expose the same site", () => {
  /**
   * The bug this locks down: the header used to hold three hand-maintained
   * arrays. A desktop visitor could not reach /guides, /answers, /glossary,
   * /trade or /contact from the header; a phone visitor could. Nobody decided
   * that. It happened because there were two lists.
   *
   * The desktop mega-menu and the mobile drawer both render `navSections`, so
   * the assertion is now structural rather than a comparison of two lists —
   * but the test stays, because the next person to "just add one link for
   * mobile" should have to delete it.
   */
  test("the drawer and the mega-menu render the same source", () => {
    const flattened = flattenSections().map((l) => l.href);
    const fromSections = new Set<string>();
    for (const section of navSections) {
      fromSections.add(section.href);
      for (const group of section.groups) for (const link of group.links) fromSections.add(link.href);
      if (section.feature) fromSections.add(section.feature.href);
    }
    assert.deepEqual(
      [...new Set(flattened)].sort(),
      [...fromSections].sort(),
      "flattenSections() and navSections disagree — the drawer would show a different site than the menu",
    );
  });

  test("neither header component keeps a nav list of its own", () => {
    for (const file of [
      "components/layout/site-header.tsx",
      "components/layout/nav-menu.tsx",
      "components/layout/mobile-nav.tsx",
      "components/layout/site-footer.tsx",
    ]) {
      const src = readFileSync(file, "utf8");
      const inline = [...src.matchAll(/href:\s*"(\/[a-z0-9\-/]*)"/g)].map((m) => m[1]);
      assert.deepEqual(
        inline,
        [],
        `${file} declares its own nav hrefs (${inline.join(", ")}). Navigation belongs in data/navigation.ts, or web and mobile drift.`,
      );
    }
  });

  test("every top-level page is reachable from the header, not only the footer", () => {
    const topLevel = [...routes].filter((r) => r !== "/" && r.split("/").length === 2);
    const reachable = new Set(flattenSections().map((l) => l.href));
    for (const l of utilityLinks) reachable.add(l.href);

    // /search is reached through the search control, not a nav link.
    const unreachable = topLevel.filter((r) => !reachable.has(r) && r !== "/search");
    assert.deepEqual(
      unreachable,
      [],
      `these pages exist but no header navigation reaches them: ${unreachable.join(", ")}`,
    );
  });
});

/* ------------------------------------------------------------- the footer */

describe("footer structure", () => {
  test("four columns, none of them a dumping ground", () => {
    assert.equal(footerColumns.length, 4, "the footer matrix is four columns, like the reference");
    for (const column of footerColumns) {
      assert.ok(
        column.links.length >= 4 && column.links.length <= 12,
        `footer column "${column.heading}" has ${column.links.length} links; between 4 and 12 keeps the columns balanced`,
      );
    }
  });

  test("every service has a footer link", () => {
    const inFooter = new Set(footerColumns.flatMap((c) => c.links.map((l) => l.href)));
    for (const s of services) {
      assert.ok(inFooter.has(`/services/${s.slug}`), `${s.shortName} is not linked from the footer`);
    }
  });

  test("the legal strip stays short", () => {
    assert.ok(legalLinks.length <= 4, "the legal strip is not a second navigation");
  });
});

/* --------------------------------------------------- the layout contract */

describe("layout system", () => {
  const sourceFiles: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(".tsx")) sourceFiles.push(full);
    }
  };
  walk("app");
  walk("components");

  test("page rails use one of exactly two widths", () => {
    const allowed = new Set(["max-w-3xl", "max-w-6xl"]);
    const offenders: string[] = [];
    for (const file of sourceFiles) {
      const src = readFileSync(file, "utf8");
      for (const m of src.matchAll(/className="([^"]*\bmx-auto\b[^"]*\bpx-4\b[^"]*)"/g)) {
        for (const cls of (m[1] ?? "").split(/\s+/)) {
          if (!cls.startsWith("max-w-") || cls.startsWith("max-w-[")) continue;
          if (!allowed.has(cls)) offenders.push(`${file} → ${cls}`);
        }
      }
    }
    assert.deepEqual(offenders, [], `page rails outside the two-width system:\n${offenders.join("\n")}`);
  });

  test("every raw <img> declares how it loads", () => {
    const offenders: string[] = [];
    for (const file of sourceFiles) {
      const src = readFileSync(file, "utf8");
      for (const m of src.matchAll(/<img\b[\s\S]*?\/>/g)) {
        if (!/\bloading=|\bfetchPriority=/.test(m[0])) {
          offenders.push(`${file}:${src.slice(0, m.index).split("\n").length}`);
        }
      }
    }
    assert.deepEqual(offenders, [], `images with no loading hint:\n${offenders.join("\n")}`);
  });

  test("h1 elements share one scale", () => {
    const offenders: string[] = [];
    for (const file of sourceFiles) {
      const src = readFileSync(file, "utf8");
      for (const m of src.matchAll(/<h1\b[^>]*className="([^"]*)"/g)) {
        const cls = m[1] ?? "";
        if (/\btext-4xl\b/.test(cls) && !/leading-\[1\.08\]/.test(cls)) offenders.push(file);
      }
    }
    assert.deepEqual(offenders, [], `h1 scale forked in:\n${offenders.join("\n")}`);
  });

  test("the mobile CTA bar and the assistant do not overlap", () => {
    const cta = readFileSync("components/layout/mobile-cta.tsx", "utf8");
    const assistant = readFileSync("components/assistant/ask-green-hardwood.tsx", "utf8");
    assert.match(cta, /md:hidden/, "the mobile CTA bar must not render on desktop");
    // The assistant must clear the bar on phones. bottom-24 is 6rem; the bar is
    // 4rem plus safe-area. A regression here covers the phone number with a
    // chat bubble, which for a contractor is a lost call.
    assert.match(
      assistant,
      /bottom-24[\s\S]*md:bottom-6/,
      "the assistant must sit above the mobile CTA bar and drop back down on desktop",
    );
  });
});

/* ------------------------------------------------------------ price drift */

describe("prices have one home", () => {
  test("no page hard-codes a dollar range that data/services.ts owns", () => {
    const bands = services.map((s) => s.priceFrom.replace(/^From\s+/i, ""));
    const offenders: string[] = [];
    const walkApp = (dir: string) => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name);
        if (statSync(full).isDirectory()) walkApp(full);
        else if (entry.name.endsWith(".tsx")) {
          const src = readFileSync(full, "utf8");
          for (const band of bands) {
            if (src.includes(band)) offenders.push(`${full} repeats "${band}"`);
          }
        }
      }
    };
    walkApp("app");
    assert.deepEqual(
      offenders,
      [],
      `price bands belong in data/services.ts and nowhere else:\n${offenders.join("\n")}`,
    );
  });
});
