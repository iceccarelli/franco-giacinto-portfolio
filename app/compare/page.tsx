import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { Button } from "@/components/ui/button";
import { compareRows } from "@/data/compare";
import { breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Hardwood vs Vinyl vs Laminate in the GTA",
  description:
    "Honest comparison of hardwood, vinyl plank, and laminate for Toronto homes — resale, stairs, water, dogs, and 20-year cost. Green Hardwood installs hardwood only.",
  alternates: { canonical: "/compare" },
  openGraph: {
    title: "Hardwood vs Vinyl vs Laminate in the GTA | Green Hardwood",
    description:
      "Honest comparison of hardwood, vinyl plank, and laminate for Toronto homes — resale, stairs, water, dogs, and 20-year cost. Green Hardwood installs hardwood only.",
    url: "/compare",
  },
};

export default function ComparePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Hardwood vs vinyl", path: "/compare" },
        ])}
      />
      <section className="border-b border-border bg-bg-warm">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <p className="text-xs tracking-[0.18em] text-accent uppercase">The decision</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl leading-[1.08] sm:text-5xl">
            Hardwood vs vinyl vs laminate — without the showroom lighting.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            We do not install vinyl or laminate. That is exactly why this page can tell you when
            vinyl is the smarter product. Most of the time, it is not.
          </p>
        </div>
      </section>
      <div className="mx-auto max-w-6xl overflow-x-auto px-4 py-12 sm:px-6">
        <table className="w-full min-w-[52rem] border-collapse text-sm">
          <thead>
            <tr className="text-left">
              <th className="border-b border-border p-3 font-medium text-muted"> </th>
              <th className="border-b border-border p-3 font-display text-lg">Hardwood</th>
              <th className="border-b border-border p-3 font-display text-lg">Vinyl plank</th>
              <th className="border-b border-border p-3 font-display text-lg">Laminate</th>
            </tr>
          </thead>
          <tbody>
            {compareRows.map((row) => (
              <tr key={row.topic} className="align-top">
                <th className="border-b border-border p-3 text-left font-medium">{row.topic}</th>
                <td className="border-b border-border bg-surface p-3">{row.hardwood}</td>
                <td className="border-b border-border p-3 text-muted">{row.vinyl}</td>
                <td className="border-b border-border p-3 text-muted">{row.laminate}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-8 max-w-3xl text-muted">
          If you have a true wet basement rental and a number that cannot take oak, buy a good vinyl
          from a retailer and hire a vinyl installer. If you have a house you intend to live in — or
          sell to someone who cares — install hardwood, and install the stair as millwork.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/estimate">Price hardwood</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/showroom">Open the showroom</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
