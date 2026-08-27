import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { Button } from "@/components/ui/button";
import { breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Hardwood Floor Care in Ontario",
  description:
    "How to maintain hardwood floors and stairs in Ontario: humidity 35–55%, cleaning, recoat schedules, and when to call Green Hardwood for a screen-and-recoat.",
  alternates: { canonical: "/care" },
  openGraph: {
    title: "Hardwood Floor Care in Ontario | Green Hardwood",
    description:
      "How to maintain hardwood floors and stairs in Ontario: humidity 35–55%, cleaning, recoat schedules, and when to call Green Hardwood for a screen-and-recoat.",
    url: "/care",
  },
};

export default function CarePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Floor care", path: "/care" },
        ])}
      />
      <section className="border-b border-border bg-bg-warm">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <p className="text-xs tracking-[0.18em] text-accent uppercase">Care</p>
          <h1 className="mt-3 font-display text-4xl leading-[1.08] sm:text-5xl">
            Ontario will try to wreck your floor. This is how it lasts.
          </h1>
          <p className="mt-4 text-lg text-muted">
            Winter dryness, summer humidity, grit at the door, and a steam mop someone sold you on
            Instagram. The finish is a system. Treat it like one.
          </p>
        </div>
      </section>
      <article className="mx-auto max-w-3xl space-y-8 px-4 py-12 sm:px-6">
        <section>
          <h2 className="font-display text-2xl">Humidity</h2>
          <p className="mt-3 text-muted">
            Keep indoor relative humidity between 35% and 55%. Below that, boards shrink and gaps
            open. Above that, they cup. A $200 humidifier in January is cheaper than a refinish in
            April.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl">Cleaning</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-muted">
            <li>Dry dust. Damp mop with a cleaner the finish manufacturer actually lists.</li>
            <li>No steam. No oil soap. No vinegar folklore.</li>
            <li>Felt pads on furniture. A mat at every exterior door — grit is sandpaper.</li>
          </ul>
        </section>
        <section>
          <h2 className="font-display text-2xl">Recoat, don’t sand, if you can</h2>
          <p className="mt-3 text-muted">
            A screen-and-recoat every 4–8 years in a family house keeps the wear layer you already
            paid for. Full sand is for when the finish is gone or the colour has to change. We will
            tell you which.
          </p>
        </section>
        <Button asChild>
          <Link href="/estimate">Book a maintenance visit</Link>
        </Button>
      </article>
    </>
  );
}
