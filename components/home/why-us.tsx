import Link from "next/link";
import { whyUs } from "@/data/compare";

export function WhyUs() {
  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-xs tracking-[0.18em] text-accent uppercase">Why this shop</p>
        <h2 className="mt-2 max-w-2xl font-display text-3xl sm:text-4xl">
          A typical GTA flooring company sells a floor. We are in the stair business that happens to
          include floors.
        </h2>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[40rem] border-collapse text-sm">
            <thead>
              <tr className="text-left">
                <th className="border-b border-border p-3 font-medium text-muted"> </th>
                <th className="border-b border-border p-3 font-medium text-muted">
                  Typical GTA floor guy
                </th>
                <th className="border-b border-border bg-bg-warm p-3 font-display text-base">
                  Green Hardwood
                </th>
              </tr>
            </thead>
            <tbody>
              {whyUs.map((row) => (
                <tr key={row.topic} className="align-top">
                  <th className="border-b border-border p-3 text-left font-medium">{row.topic}</th>
                  <td className="border-b border-border p-3 text-muted">{row.typical}</td>
                  <td className="border-b border-border bg-bg-warm p-3">{row.us}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-sm">
          <Link href="/compare" className="font-medium text-primary hover:underline">
            Hardwood vs vinyl vs laminate
          </Link>
          {" · "}
          <Link href="/trade" className="font-medium text-primary hover:underline">
            Trade program
          </Link>
        </p>
      </div>
    </section>
  );
}
