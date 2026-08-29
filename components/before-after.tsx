"use client";
import NextImage from "next/image";

import { useState } from "react";

export function BeforeAfter({
  before,
  after,
  beforeAlt,
  afterAlt,
}: {
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
}) {
  const [pos, setPos] = useState(52);

  return (
    <div className="relative overflow-hidden rounded-xl bg-bg-warm shadow-[var(--shadow-card)]">
      <div className="relative aspect-[4/3] w-full select-none">
        {/* next/image directly rather than <Photo>: the slider clips the
            "before" image with a percentage width, so these two need to be
            absolutely positioned siblings without a frame wrapper between
            them. Both still go through the optimizer. */}
        <NextImage
          src={after}
          alt={afterAlt}
          fill
          sizes="(min-width: 1024px) 592px, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
          <NextImage
            src={before}
            alt={beforeAlt}
            fill
            sizes="(min-width: 1024px) 592px, 100vw"
            className="max-w-none object-cover"
            style={{ width: `${10000 / pos}%` }}
          />
        </div>
        <div
          className="absolute inset-y-0 w-px bg-primary-fg"
          style={{ left: `${pos}%` }}
          aria-hidden
        >
          <span className="absolute top-1/2 left-1/2 size-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border bg-surface shadow-md" />
        </div>
        <span className="absolute top-3 left-3 rounded-full bg-fg/70 px-2.5 py-1 text-xs font-medium text-primary-fg">
          Before
        </span>
        <span className="absolute top-3 right-3 rounded-full bg-primary/80 px-2.5 py-1 text-xs font-medium text-primary-fg">
          After
        </span>
      </div>
      <label className="sr-only" htmlFor="ba-range">
        Drag to compare before and after
      </label>
      <input
        id="ba-range"
        type="range"
        min={4}
        max={96}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        className="absolute inset-0 z-10 cursor-ew-resize opacity-0"
      />
    </div>
  );
}
