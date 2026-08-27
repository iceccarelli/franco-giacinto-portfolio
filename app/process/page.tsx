import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { Button } from "@/components/ui/button";
import { breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "How a Hardwood Job Runs",
  description:
    "Green Hardwood’s four-phase process for GTA hardwood floors, stairs, and railings: measure, specify, install as millwork, hand over a floor you can live on.",
  alternates: { canonical: "/process" },
  openGraph: {
    title: "How a Hardwood Job Runs | Green Hardwood — Toronto & GTA",
    description:
      "Green Hardwood’s four-phase process for GTA hardwood floors, stairs, and railings: measure, specify, install as millwork, hand over a floor you can live on.",
    url: "/process",
  },
};

const phases = [
  {
    n: "01",
    title: "Measure what the house is doing",
    body: "Moisture mapping, flatness, stair geometry, condo rules, and whether the existing floor has a wear layer left. We will not quote a firm number from a photo of a living room.",
  },
  {
    n: "02",
    title: "Specify the assembly",
    body: "Solid or engineered, species, grade, wear layer, adhesive, finish chemistry, pattern, and a stair that will pass inspection. You sign a sample, not a vibe.",
  },
  {
    n: "03",
    title: "Install like millwork",
    body: "Acclimation, layout drawings for pattern work, through-bolted newels, nosings that match the floor, dust contained when we sand. The crew on site is ours.",
  },
  {
    n: "04",
    title: "Hand over a floor you can live on",
    body: "Written cure schedule, maintenance sheet, and a three-year workmanship warranty. Then we pick up the phone if something moves.",
  },
];

export default function ProcessPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Process", path: "/process" },
        ])}
      />
      <section className="border-b border-border bg-bg-warm">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <p className="text-xs tracking-[0.18em] text-accent uppercase">Process</p>
          <h1 className="mt-3 font-display text-4xl leading-[1.08] sm:text-5xl">
            How a Green Hardwood job actually runs.
          </h1>
          <p className="mt-4 text-lg text-muted">
            Four phases. No mystery. No “we’ll figure out the stairs later.”
          </p>
        </div>
      </section>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <ol className="space-y-8">
          {phases.map((p) => (
            <li key={p.n} className="rounded-xl bg-surface p-6 shadow-[var(--shadow-card)]">
              <p className="font-display text-sm text-accent">{p.n}</p>
              <h2 className="mt-1 font-display text-2xl">{p.title}</h2>
              <p className="mt-2 text-muted">{p.body}</p>
            </li>
          ))}
        </ol>
        <Button asChild className="mt-10">
          <Link href="/estimate">Start with a measure</Link>
        </Button>
      </div>
    </>
  );
}
