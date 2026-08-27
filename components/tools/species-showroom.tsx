"use client";

import { useState } from "react";
import Link from "next/link";
import { FloorPreview } from "@/components/tools/floor-preview";
import { Button } from "@/components/ui/button";
import { species, type SpeciesId } from "@/data/species";
import { cn } from "@/lib/utils";

const patterns = [
  { id: "straight" as const, label: "Straight lay" },
  { id: "herringbone" as const, label: "Herringbone" },
  { id: "chevron" as const, label: "Chevron" },
];

const sheens = [
  { id: "matte" as const, label: "Matte 2K" },
  { id: "satin" as const, label: "Satin 2K" },
  { id: "oil" as const, label: "Hardwax oil" },
  { id: "prefinished" as const, label: "Prefinished" },
];

export function SpeciesShowroom() {
  const [id, setId] = useState<SpeciesId>("white-oak");
  const [pattern, setPattern] = useState<(typeof patterns)[number]["id"]>("straight");
  const [sheen, setSheen] = useState<(typeof sheens)[number]["id"]>("matte");
  const current = species.find((s) => s.id === id) ?? species[0];

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div>
        <FloorPreview
          speciesId={id}
          pattern={pattern}
          sheen={sheen}
          className="aspect-[16/10] w-full shadow-[var(--shadow-card)]"
        />
        <div className="mt-4 flex flex-wrap gap-2">
          {patterns.map((p) => (
            <Chip key={p.id} active={pattern === p.id} onClick={() => setPattern(p.id)}>
              {p.label}
            </Chip>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {sheens.map((p) => (
            <Chip key={p.id} active={sheen === p.id} onClick={() => setSheen(p.id)}>
              {p.label}
            </Chip>
          ))}
        </div>
      </div>
      <div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {species.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setId(s.id)}
              className={cn(
                "rounded-lg p-3 text-left shadow-[var(--shadow-card)]",
                id === s.id ? "bg-primary text-primary-fg" : "bg-surface hover:bg-bg-warm",
              )}
            >
              <span
                className="mb-2 block h-8 rounded-md"
                style={{ background: s.plank, boxShadow: `inset 0 0 0 1px ${s.grain}` }}
              />
              <span className="block text-sm font-medium">{s.name}</span>
              <span
                className={cn("block text-xs", id === s.id ? "text-primary-fg/70" : "text-muted")}
              >
                {s.hardness}
              </span>
            </button>
          ))}
        </div>
        <h2 className="mt-6 font-display text-3xl">{current.name}</h2>
        <p className="mt-1 text-sm text-accent">{current.bestFor}</p>
        <p className="mt-3 text-muted">{current.verdict}</p>
        <p className="mt-3 text-sm text-muted">{current.tone}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {current.rooms.map((r) => (
            <li key={r} className="rounded-full bg-bg-warm px-3 py-1 text-xs">
              {r}
            </li>
          ))}
        </ul>
        <Button asChild className="mt-6">
          <Link href="/estimate">Estimate this species</Link>
        </Button>
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-10 rounded-full px-4 text-sm",
        active ? "bg-primary text-primary-fg" : "border border-border bg-surface hover:bg-bg-warm",
      )}
    >
      {children}
    </button>
  );
}
