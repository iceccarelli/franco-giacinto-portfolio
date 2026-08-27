"use client";

import { getSpecies } from "@/data/species";

export type StairStyle = "box" | "open" | "retread";
export type RailStyle = "wood-iron" | "wood" | "wall";
export type NewelStyle = "box" | "turned" | "none";

export function StairVisual({
  speciesId,
  steps,
  style,
  rail,
  newel,
}: {
  speciesId: string;
  steps: number;
  style: StairStyle;
  rail: RailStyle;
  newel: NewelStyle;
}) {
  const s = getSpecies(speciesId);
  const n = Math.min(14, Math.max(7, steps));
  const rise = 26;
  const run = 34;
  const treadH = 5;
  const startX = 36;
  const baseY = 320;
  const w = startX + n * run + 90;
  const h = 360;

  const tread = (i: number) => ({ x: startX + i * run, y: baseY - (i + 1) * rise, i });

  // Non-empty tuple: `n` is clamped to 7..14, so first/top always exist.
  const first = tread(0);
  const treads: [ReturnType<typeof tread>, ...ReturnType<typeof tread>[]] = [
    first,
    ...Array.from({ length: n - 1 }, (_, k) => tread(k + 1)),
  ];

  const top = treads.at(-1) ?? first;
  const railY1 = first.y - 78;
  const railY2 = top.y - 78;
  const railX1 = first.x + 8;
  const railX2 = top.x + run - 4;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="h-auto w-full"
      role="img"
      aria-label={`${n}-step ${s.name} ${style} stair with ${rail} railing`}
    >
      <rect width={w} height={h} fill="var(--color-bg-warm)" />
      <rect x="0" y={baseY + 4} width={w} height="40" fill={s.plank} opacity="0.85" />
      {Array.from({ length: 8 }).map((_, i) => (
        <rect
          key={i}
          x={i * 42}
          y={baseY + 4}
          width="40"
          height="40"
          fill={s.plank}
          stroke={s.grain}
          strokeWidth="0.8"
        />
      ))}

      {treads.map((t) => (
        <g key={t.i}>
          {style !== "open" && (
            <rect
              x={t.x}
              y={t.y + treadH}
              width={run + 6}
              height={rise - treadH}
              fill={style === "retread" ? "var(--color-cream)" : s.plank}
              stroke={s.grain}
              strokeWidth="0.8"
            />
          )}
          {style === "open" && (
            <rect x={t.x} y={t.y + treadH} width="4" height={rise - treadH} fill={s.grain} />
          )}
          <rect
            x={t.x - 6}
            y={t.y}
            width={run + 16}
            height={treadH}
            fill={s.plank}
            stroke={s.grain}
            strokeWidth="0.9"
          />
        </g>
      ))}

      {rail !== "wall" &&
        treads.map((t) => (
          <line
            key={`b-${t.i}`}
            x1={t.x + run * 0.55}
            y1={t.y}
            x2={t.x + run * 0.55}
            y2={t.y - 78}
            stroke={rail === "wood-iron" ? "var(--color-ink)" : s.grain}
            strokeWidth={rail === "wood-iron" ? 1.4 : 2.2}
          />
        ))}

      {rail !== "wall" && (
        <path
          d={`M ${railX1} ${railY1} L ${railX2} ${railY2}`}
          fill="none"
          stroke={s.plank}
          strokeWidth="6"
          strokeLinecap="round"
        />
      )}

      {rail === "wall" && (
        <path
          d={`M ${railX1 - 18} ${railY1 + 10} L ${railX2 - 10} ${railY2 + 10}`}
          fill="none"
          stroke={s.plank}
          strokeWidth="5"
          strokeLinecap="round"
        />
      )}

      {newel !== "none" && (
        <g>
          <rect
            x={first.x - 8}
            y={first.y - 96}
            width={newel === "turned" ? 10 : 16}
            height={100}
            rx={newel === "turned" ? 4 : 1}
            fill={s.plank}
            stroke={s.grain}
          />
          <rect
            x={top.x + run - 6}
            y={top.y - 96}
            width={newel === "turned" ? 10 : 16}
            height={100}
            rx={newel === "turned" ? 4 : 1}
            fill={s.plank}
            stroke={s.grain}
          />
        </g>
      )}
    </svg>
  );
}
