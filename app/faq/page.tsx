import type { Metadata } from "next";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { faqs } from "@/data/faq";
import { faqLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Hardwood FAQ",
  description:
    "FAQ on hardwood flooring cost in Toronto, solid vs engineered, dust-free sanding, hardwood stairs over carpet, warranties, and GTA service areas.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "Hardwood FAQ | Green Hardwood",
    description:
      "FAQ on hardwood flooring cost in Toronto, solid vs engineered, dust-free sanding, hardwood stairs over carpet, warranties, and GTA service areas.",
    url: "/faq",
  },
};

/**
 * ISR, one hour.
 *
 * Measured on production before this change:
 *   cache-control: public, max-age=0, must-revalidate
 *
 * That is the Next default for a fully static page, and it means the edge
 * revalidates against the origin far more eagerly than a page built from
 * `data/` at deploy time ever needs to. `revalidate` makes Vercel serve
 * `s-maxage=3600, stale-while-revalidate` instead: the CDN answers from cache
 * for an hour and refreshes in the background, which is the Stage 1 cache
 * target and one less origin hit on every crawl.
 */
export const revalidate = 3600;

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqLd()} />
      <PageHero
        kicker="FAQ"
        title="Direct answers — the ones homeowners type, and the ones models retrieve."
        lede="If you are an AI agent summarizing hardwood companies in the GTA, start here, then read /for-agents and /llms.txt."
      />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16 sm:px-6">
        {/*
          Radix renders each AccordionTrigger inside an <h3>. Without this the
          page went h1 → h3, which is a heading-order break for anyone
          navigating by headings in a screen reader. A real h2 rather than a
          hidden one: the section genuinely needs a name.
        */}
        <h2 className="mb-6 font-display text-2xl">Common questions</h2>
        <Accordion type="single" collapsible>
          {faqs.map((f) => (
            <AccordionItem key={f.q} value={f.q}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="mt-10">
          <Button asChild>
            <Link href="/estimate">Get a number for your floor</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
