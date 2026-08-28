import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { QuoteForm } from "@/components/estimate/quote-form";
import { breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "For Builders, Designers & Realtors",
  description:
    "Green Hardwood trade program for GTA builders, interior designers, and realtors: samples, drawings, stair packages, and a crew that shows up to the schedule.",
  alternates: { canonical: "/trade" },
  openGraph: {
    title: "For Builders, Designers & Realtors | Green Hardwood",
    description:
      "Green Hardwood trade program for GTA builders, interior designers, and realtors: samples, drawings, stair packages, and a crew that shows up to the schedule.",
    url: "/trade",
  },
};

export default function TradePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Trade", path: "/trade" },
        ])}
      />
      <section className="border-b border-border bg-bg-warm">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16 sm:px-6">
          <p className="text-xs tracking-[0.18em] text-accent uppercase">Trade</p>
          <h1 className="mt-3 font-display text-4xl leading-[1.08] font-medium sm:text-5xl">
            Builders, designers, realtors — one shop for the floor and the stair.
          </h1>
          <p className="mt-4 text-lg text-muted">
            We are tired of being the fifth sub on a finish schedule. If you need the floor, the
            treads, and the rail to match on closing day, start here.
          </p>
        </div>
      </section>
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-12 sm:py-16 sm:px-6 lg:grid-cols-2">
        <div className="space-y-6">
          <section>
            <h2 className="font-display text-2xl">What you get</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-muted">
              <li>Sample boards and stain draws that leave your office, not a dropbox of jpgs.</li>
              <li>
                Stair drawings with rise, run, nosing, and guard — before the inspector is in the
                foyer.
              </li>
              <li>
                One mobilization for floor + stair + rail so your painter is not waiting on a stair
                guy.
              </li>
              <li>Repeat-client scheduling. We keep a crew slot for shops we already know.</li>
              <li>A warranty the homeowner can call without going through three trades.</li>
            </ul>
          </section>
          <section>
            <h2 className="font-display text-2xl">Who this is for</h2>
            <p className="mt-3 text-muted">
              Custom and semi-custom builders in Vaughan, Oakville, and Toronto. Interior designers
              who specify millwork, not flooring commodities. Realtors staging a listing that still
              has builder carpet on the stairs.
            </p>
          </section>
        </div>
        <div className="h-fit rounded-xl bg-surface p-6 shadow-[var(--shadow-card)]">
          <h2 className="font-display text-2xl">Open a trade file</h2>
          <p className="mt-2 mb-4 text-sm text-muted">
            Tell us the project, the city, and whether the stair is in the scope. It should be.
          </p>
          <QuoteForm />
        </div>
      </div>
    </>
  );
}
