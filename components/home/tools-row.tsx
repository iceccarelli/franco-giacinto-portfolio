import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteTools } from "@/data/tools";

export function ToolsRow() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="text-xs tracking-[0.18em] text-accent uppercase">Tools, not brochures</p>
      <h2 className="mt-2 font-display text-3xl sm:text-4xl">
        Price it. Specify it. Check the code.
      </h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {siteTools.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="group rounded-xl bg-surface p-6 shadow-[var(--shadow-card)]"
          >
            <p className="text-xs tracking-[0.16em] text-accent uppercase">{t.kicker}</p>
            <h3 className="mt-2 flex items-center justify-between gap-3 font-display text-2xl">
              {t.title}
              <ArrowRight className="size-4 shrink-0 opacity-40 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100" />
            </h3>
            <p className="mt-2 text-sm text-muted">{t.blurb}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
