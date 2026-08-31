"use client";

import { useState } from "react";
import { Photo } from "@/components/photo";
import { BeforeAfter } from "@/components/before-after";
import { Badge } from "@/components/ui/badge";
import { projectFilters, projects } from "@/data/projects";
import { cn } from "@/lib/utils";

/**
 * Client island for the portfolio filter. The page itself stays a server
 * component so its metadata and JSON-LD are rendered statically.
 */
export function ProjectGrid() {
  const [filter, setFilter] = useState<(typeof projectFilters)[number]["id"]>("all");
  const visible = filter === "all" ? projects : projects.filter((p) => p.category === filter);

  return (
    <>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects">
        {projectFilters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            aria-pressed={filter === f.id}
            className={cn(
              "h-11 rounded-full px-4 text-sm transition-colors",
              filter === f.id
                ? "bg-primary text-primary-fg"
                : "border border-border bg-surface text-fg hover:bg-bg-warm",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {visible.map((p) => (
          <article
            key={p.slug}
            /*
             * A stable anchor per job. There is no /portfolio/{slug} route —
             * the grid is one client-filtered page — so the job catalogue deep
             * links here instead. scroll-mt clears the sticky header.
             */
            id={p.slug}
            className="scroll-mt-28 overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-card)]"
          >
            {p.before && p.after ? (
              <BeforeAfter
                before={p.before}
                after={p.after}
                beforeAlt={`Before: ${p.title}`}
                afterAlt={p.imageAlt}
              />
            ) : (
              <Photo src={p.image} alt={p.imageAlt} ratio="4/3" slot="card" />
            )}
            <div className="p-6">
              <div className="flex flex-wrap gap-2">
                <Badge>{p.location}</Badge>
                <Badge>{p.type}</Badge>
              </div>
              <h2 className="mt-3 font-display text-2xl">{p.title}</h2>
              <p className="mt-2 text-muted">{p.details}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {p.specs.map((spec) => (
                  <li key={spec} className="rounded-full bg-bg-warm px-3 py-1 text-xs text-muted">
                    {spec}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
