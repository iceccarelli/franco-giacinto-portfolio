"use client";

import { getSpecies, type SpeciesId } from "@/data/species";

type Pattern = "straight" | "herringbone" | "chevron";
type Sheen = "matte" | "satin" | "oil" | "prefinished";

export function FloorPreview({
  speciesId,
  pattern = "straight",
  sheen = "matte",
  className,
}: {
  speciesId: SpeciesId | string;
  pattern?: Pattern;
  sheen?: Sheen;
  className?: string;
}) {
  const s = getSpecies(speciesId);
  const gloss =
    sheen === "satin" ? 0.22 : sheen === "oil" ? 0.08 : sheen === "prefinished" ? 0.16 : 0.05;

  return (
    <div
      className={`relative overflow-hidden rounded-lg ${className ?? "aspect-[16/10] w-full"}`}
      style={{ background: s.plank }}
      aria-label={`${s.name} ${pattern} floor preview`}
    >
      {pattern === "straight" ? (
        <Straight planks={s.plank} grain={s.grain} />
      ) : pattern === "chevron" ? (
        <Chevron planks={s.plank} grain={s.grain} />
      ) : (
        <Herringbone planks={s.plank} grain={s.grain} />
      )}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(115deg, rgb(255 255 255 / ${gloss}), transparent 42%, rgb(0 0 0 / 0.12))`,
        }}
      />
    </div>
  );
}

function Straight({ planks, grain }: { planks: string; grain: string }) {
  return (
    <svg viewBox="0 0 800 500" className="h-full w-full" preserveAspectRatio="none" aria-hidden>
      {Array.from({ length: 9 }).map((_, row) => {
        const y = row * 56;
        const offset = row % 2 === 0 ? 0 : -90;
        return Array.from({ length: 7 }).map((_, col) => {
          const x = offset + col * 160;
          return (
            <g key={`${row}-${col}`}>
              <rect x={x} y={y} width="158" height="54" fill={planks} />
              <rect x={x + 158} y={y} width="2" height="54" fill={grain} opacity="0.55" />
              <rect x={x} y={y + 54} width="160" height="2" fill={grain} opacity="0.7" />
            </g>
          );
        });
      })}
    </svg>
  );
}

function Herringbone({ planks, grain }: { planks: string; grain: string }) {
  const w = 92;
  const h = 28;
  return (
    <svg
      viewBox="0 0 800 500"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      {Array.from({ length: 18 }).map((_, row) =>
        Array.from({ length: 14 }).map((_, col) => {
          const x = col * 70 - 40;
          const y = row * 36 - 20;
          const flip = (row + col) % 2 === 0;
          return (
            <g key={`${row}-${col}`} transform={`translate(${x} ${y}) rotate(${flip ? 45 : -45})`}>
              <rect
                x={-w / 2}
                y={-h / 2}
                width={w}
                height={h}
                fill={planks}
                stroke={grain}
                strokeWidth="1.2"
              />
            </g>
          );
        }),
      )}
    </svg>
  );
}

function Chevron({ planks, grain }: { planks: string; grain: string }) {
  return (
    <svg
      viewBox="0 0 800 500"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      {Array.from({ length: 16 }).map((_, row) =>
        Array.from({ length: 8 }).map((_, col) => {
          const y = row * 34 - 10;
          const x = col * 110 - 20;
          return (
            <g key={`${row}-${col}`}>
              <polygon
                points={`${x},${y} ${x + 52},${y + 17} ${x},${y + 34}`}
                fill={planks}
                stroke={grain}
                strokeWidth="1"
              />
              <polygon
                points={`${x + 52},${y + 17} ${x + 104},${y} ${x + 104},${y + 34}`}
                fill={planks}
                stroke={grain}
                strokeWidth="1"
              />
            </g>
          );
        }),
      )}
    </svg>
  );
}
