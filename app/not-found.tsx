import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { company } from "@/data/company";
import { services } from "@/data/services";

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "That page is not here. Jump to hardwood services, the stair studio, or a free estimate.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
      <p className="text-xs tracking-[0.18em] text-accent uppercase">404</p>
      <h1 className="mt-3 font-display text-4xl leading-[1.08] font-medium sm:text-5xl">That page was sanded off.</h1>
      <p className="mt-4 text-lg text-muted">
        The floor, the stair, and the rail are all still here. Pick a direction, or call{" "}
        <a className="text-primary hover:underline" href={`tel:${company.phone}`}>
          {company.phoneDisplay}
        </a>
        .
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/">Home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/stairs">Stair studio</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/estimate">Free estimate</Link>
        </Button>
      </div>
      <ul className="mt-10 grid gap-2 sm:grid-cols-2">
        {services.map((s) => (
          <li key={s.slug}>
            <Link href={`/services/${s.slug}`} className="text-primary hover:underline">
              {s.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
