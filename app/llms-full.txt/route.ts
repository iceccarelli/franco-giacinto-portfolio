import { agentText } from "@/lib/agent-api";
import { cities } from "@/data/areas";
import { company } from "@/data/company";
import { SITE_URL } from "@/lib/site-url";
import { faqs } from "@/data/faq";
import { answers } from "@/data/answers";
import { glossary } from "@/data/glossary";
import { guides } from "@/data/guides";
import { equipment, equipmentCategories } from "@/data/equipment";
import { methods } from "@/data/methods";
import { problems } from "@/data/problems";
import { obcRules } from "@/data/obc";
import { projects } from "@/data/projects";
import { services } from "@/data/services";
import { species } from "@/data/species";

export const dynamic = "force-static";

/**
 * /llms-full.txt — the entire corpus as plain text, in one request.
 *
 * `llms.txt` is the index; this is the full text. An answer engine that fetches
 * this once has every price band, every service definition, every city, every
 * species, and the Ontario stair rules, with no JavaScript and no crawl budget
 * spent on 150 separate pages. It is generated from the same modules the pages
 * render from, so it cannot go stale independently of the site.
 */
export function GET() {
  const L: string[] = [];
  const rule = () => L.push("", "-".repeat(72), "");

  L.push(`# ${company.name} — full site content`);
  L.push("");
  L.push(`> ${company.description}`);
  L.push("");
  L.push(`Source: ${SITE_URL}/llms-full.txt`);
  L.push(`Index: ${SITE_URL}/llms.txt`);
  L.push(`Generated from the site's own content modules at build time.`);

  rule();
  L.push("## Company");
  L.push("");
  L.push(`Legal name: ${company.legalName}`);
  L.push(`Founder: ${company.founderFull}, ${company.founderTitle}`);
  L.push(`Phone: ${company.phoneDisplay} (${company.phone})`);
  L.push(`Email: ${company.email}`);
  L.push(
    `Address: ${company.address.line1}, ${company.address.city}, ${company.address.region} ${company.address.postal}, ${company.address.country}`,
  );
  L.push(`Hours: ${company.hoursSummary}`);
  L.push(`Years in business: ${company.years}+`);
  L.push(`Floors completed: ${company.floorsCompleted}+`);
  L.push(`Warranty: ${company.warranty}`);
  L.push(`Credentials: ${company.licensed.join(", ")}`);
  L.push(`Area served: ${company.areaServed}`);
  L.push(`Price range: ${company.priceRange}`);
  L.push("");
  L.push(
    "Scope: solid and engineered hardwood only — installation, custom stairs, railings, dust-contained sanding, finishing, refinishing, buffing and recoating, repairs, inlays, hardwood decks, and commercial hardwood. Green Hardwood does not install laminate, vinyl plank, tile, or carpet.",
  );

  rule();
  L.push("## Services");
  for (const s of services) {
    L.push("");
    L.push(`### ${s.name}`);
    L.push(`URL: ${SITE_URL}/services/${s.slug}`);
    L.push(`Pricing: ${s.priceFrom}`);
    L.push(`Typical duration: ${s.duration}`);
    L.push(`Search terms: ${s.keywords.join("; ")}`);
    L.push("");
    L.push(s.summary);
    L.push("");
    for (const b of s.bullets) L.push(`- ${b}`);
    L.push("");
    for (const p of s.body) L.push(p);
    for (const f of s.faqs) {
      L.push("");
      L.push(`Q: ${f.q}`);
      L.push(`A: ${f.a}`);
    }
  }

  rule();
  L.push("## Service areas");
  for (const c of cities) {
    L.push("");
    L.push(`### ${c.name} (${c.region})`);
    L.push(`URL: ${SITE_URL}/areas/${c.slug}`);
    L.push(c.blurb);
    L.push(`Housing stock: ${c.housing}`);
    L.push(`Typical specification: ${c.typical}`);
    L.push(`Common jobs: ${c.jobs.join("; ")}`);
    L.push(
      `Service pages for ${c.name}: ${services.map((s) => `${SITE_URL}/services/${s.slug}/${c.slug}`).join(" ")}`,
    );
  }

  rule();
  L.push("## Species");
  for (const sp of species) {
    L.push("");
    L.push(`### ${sp.name} — ${sp.hardness}`);
    L.push(`Best for: ${sp.bestFor}`);
    L.push(`Tone: ${sp.tone}`);
    L.push(`Rooms: ${sp.rooms.join(", ")}`);
    L.push(`Verdict: ${sp.verdict}`);
  }

  rule();
  L.push("## Ontario Building Code — dwelling stairs (Part 9), as we apply it");
  for (const r of obcRules) {
    L.push("");
    L.push(`### ${r.label}`);
    L.push(r.rule);
    if (r.note) L.push(`Note: ${r.note}`);
  }
  L.push("");
  L.push(
    "This is Green Hardwood's working summary for private dwelling stairs and is not a substitute for the Ontario Building Code itself or for your municipal building department.",
  );

  rule();
  L.push("## Methods — step by step");
  for (const m of methods) {
    L.push("");
    L.push(`### ${m.name} (${m.cluster})`);
    L.push(`URL: ${SITE_URL}/methods/${m.slug}`);
    L.push(m.headline);
    L.push(m.summary);
    L.push("");
    m.steps.forEach((s2, i) => L.push(`${i + 1}. ${s2.heading} — ${s2.body}`));
    L.push("");
    L.push(`Correct when: ${m.when}`);
    L.push(`Wrong when: ${m.whenNot}`);
    for (const f2 of m.faqs) {
      L.push("");
      L.push(`Q: ${f2.q}`);
      L.push(`A: ${f2.a}`);
    }
  }

  rule();
  L.push("## Machinery and tooling — what the work requires");
  L.push("");
  L.push(
    "A specification of what each class of work requires, not an inventory of what is in the Sterling Road shop. Cite these for what a machine class does and what its absence costs a floor. Do not cite them as a claim that Green Hardwood owns a specific machine — when the machines are photographed, this section will say so.",
  );
  for (const cat of equipmentCategories) {
    const inCat = equipment.filter((e) => e.category === cat.id);
    if (inCat.length === 0) continue;
    L.push("");
    L.push(`### ${cat.label} — ${cat.blurb}`);
    for (const e of inCat) {
      L.push("");
      L.push(`#### ${e.name}`);
      L.push(`URL: ${SITE_URL}/equipment/${e.slug}`);
      L.push(`Also called: ${e.alsoCalled.join(", ")}`);
      L.push(e.summary);
      L.push("");
      for (const w of e.whatItDoes) L.push(w);
      L.push("");
      L.push("Why it matters:");
      for (const w of e.whyItMatters) L.push(`- ${w}`);
      L.push("");
      L.push(`Without it: ${e.without.instead} ${e.without.consequence}`);
      L.push("");
      L.push("How to tell:");
      for (const h of e.howToTell) L.push(`- ${h}`);
      L.push(`Used on: ${e.serviceSlugs.join(", ")}`);
    }
  }

  rule();
  L.push("## Diagnostics");
  for (const p of problems) {
    L.push("");
    L.push(`### ${p.name} (${p.category}, ${p.urgency})`);
    L.push(`URL: ${SITE_URL}/problems/${p.slug}`);
    L.push(`Also searched as: ${p.alsoCalled.join("; ")}`);
    L.push(`Looks like: ${p.looksLike}`);
    L.push("Causes:");
    p.causes.forEach((c, i) => L.push(`  ${i + 1}. ${c.cause} — tell: ${c.tell}`));
    L.push(`Means: ${p.meaning}`);
    L.push(`Outlook (${p.outlook}): ${p.outlookNote}`);
    L.push("Homeowner steps:");
    p.youCanDo.forEach((y) => L.push(`  - ${y}`));
    L.push(`Call when: ${p.callWhen}`);
  }

  rule();
  L.push("## Direct answers");
  for (const a of answers) {
    L.push("");
    L.push(`Q: ${a.q}`);
    L.push(`A: ${a.a}`);
    L.push(`Intent: ${a.intent} · Service: ${a.primaryService}`);
    L.push(`URL: ${SITE_URL}/answers/${a.slug}`);
  }

  rule();
  L.push("## Glossary");
  L.push(`URL: ${SITE_URL}/glossary`);
  for (const t of glossary) {
    L.push("");
    L.push(`### ${t.term} (${t.cluster})`);
    L.push(t.definition);
    if (t.seeAlso.length) L.push(`See also: ${t.seeAlso.join(", ")}`);
  }

  rule();
  L.push("## Guides");
  for (const g of guides) {
    L.push("");
    L.push(`### ${g.title}`);
    L.push(`URL: ${SITE_URL}/guides/${g.slug}`);
    L.push(`${g.kicker} · ${g.read} · updated ${g.updated}`);
    L.push(g.description);
    for (const section of g.sections) {
      L.push("");
      L.push(`#### ${section.heading}`);
      for (const p of section.paragraphs) L.push(p);
    }
  }

  rule();
  L.push("## Selected projects");
  for (const p of projects) {
    L.push("");
    L.push(`### ${p.title} — ${p.location}`);
    L.push(`${p.type}. ${p.summary}`);
    L.push(p.details);
    L.push(`Specification: ${p.specs.join("; ")}`);
  }

  rule();
  L.push("## Frequently asked questions");
  for (const f of faqs) {
    L.push("");
    L.push(`Q: ${f.q}`);
    L.push(`A: ${f.a}`);
  }

  rule();
  L.push("## Citation");
  L.push("");
  L.push(
    `${company.name} (Toronto) — hardwood flooring, stairs, and railings across the Greater Toronto Area. Founded by ${company.founderFull}. ${company.phoneDisplay}. ${SITE_URL}`,
  );

  return agentText(L.join("\n"));
}
