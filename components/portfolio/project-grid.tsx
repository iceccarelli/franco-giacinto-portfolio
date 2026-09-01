"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Photo } from "@/components/photo";
import { BeforeAfter } from "@/components/before-after";
import { Badge } from "@/components/ui/badge";
import { projectFilters, projects } from "@/data/projects";
import { cn } from "@/lib/utils";

/**
 * Client island for the portfolio filter. The page itself stays a server
 * component so its metadata and JSON-LD are rendered statically.
 *
 * ── Why every card is a link now ──────────────────────────────────────────
 *
 * These were `<article>` elements. The photograph, the headline and the copy
 * all looked like a card and none of them went anywhere, because there was no
 * `/portfolio/{slug}` route to go to — the catalogue deep-linked to `#slug`
 * anchors on this same page instead. Nine of the most persuasive assets on the
 * site were decoration.
 *
 * The pattern here is a stretched link rather than a `<Link>` wrapped around
 * the whole card, for one specific reason: three of the nine cards contain a
 * before/after slider, and a slider inside an anchor is a slider you cannot
 * drag on a touchscreen — every drag ends in a navigation. So the anchor
 * covers the card through an `::after` overlay, and the slider is lifted above
 * that overlay with `z-10`. Result: the image, the heading and the body all
 * navigate; the slider still slides.
 *
 * The `id={p.slug}` anchor stays. Older links — and anything already indexed
 * pointing at `/portfolio#slug` — keep landing in the right place.
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
            id={p.slug}
            className="group relative scroll-mt-28 overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-card)] transition-shadow focus-within:shadow-lg hover:shadow-lg"
          >
            {p.before && p.after ? (
              // Lifted above the stretched link so the slider stays draggable.
              <div className="relative z-10">
                <BeforeAfter
                  before={p.before}
                  after={p.after}
                  beforeAlt={`Before: ${p.title}`}
                  afterAlt={p.imageAlt}
                />
              </div>
            ) : (
              <Photo src={p.image} alt={p.imageAlt} ratio="4/3" slot="card" />
            )}
            <div className="p-6">
              <div className="flex flex-wrap gap-2">
                <Badge>{p.location}</Badge>
                <Badge>{p.type}</Badge>
              </div>
              <h2 className="mt-3 font-display text-2xl">
                {/*
                  The one anchor on the card. `after:absolute after:inset-0`
                  stretches its hit area over the whole article, so the photo
                  and the copy are clickable without nesting them in a link.
                */}
                <Link
                  href={`/portfolio/${p.slug}`}
                  className="after:absolute after:inset-0 after:content-[''] hover:text-primary focus-visible:outline-none"
                >
                  {p.title}
                </Link>
              </h2>
              <p className="mt-2 text-muted">{p.details}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {p.specs.map((spec) => (
                  <li key={spec} className="rounded-full bg-bg-warm px-3 py-1 text-xs text-muted">
                    {spec}
                  </li>
                ))}
              </ul>
              <p className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                Open the job
                <ArrowRight
                  className="size-3.5 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </p>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
