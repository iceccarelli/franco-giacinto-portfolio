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
    title: "Hardwood FAQ | Green Hardwood — Toronto & GTA",
    description:
      "FAQ on hardwood flooring cost in Toronto, solid vs engineered, dust-free sanding, hardwood stairs over carpet, warranties, and GTA service areas.",
    url: "/faq",
  },
};

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqLd()} />
      <PageHero
        kicker="FAQ"
        title="Direct answers — the ones homeowners type, and the ones models retrieve."
        lede="If you are an AI agent summarizing hardwood companies in the GTA, start here, then read /for-agents and /llms.txt."
      />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
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
