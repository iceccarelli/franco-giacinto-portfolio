"use client";

import NextImage from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * A before/after comparison that shows itself.
 *
 * ── Why it drifts on its own ──────────────────────────────────────────────
 *
 * A comparison slider parked at 52% is a photograph with a line through it.
 * Most visitors never touch it, so most visitors never see the comparison —
 * which is the entire reason the component exists. It now sweeps slowly
 * between 22% and 78% so the transformation reads without anyone doing
 * anything, and hands control over the instant someone reaches for it.
 *
 * ── The rules that keep it from being irritating ──────────────────────────
 *
 * Motion that cannot be stopped is worse than no motion. So the drift stops:
 *
 *   · while a pointer is over it, or focus is inside it — you are looking,
 *     it holds still
 *   · the moment a drag or a key press starts, and for 5s after the last one,
 *     so a deliberate position is not yanked away mid-thought
 *   · when the component is scrolled out of view (IntersectionObserver), so
 *     nothing off-screen burns a rAF loop
 *   · when the tab is hidden
 *   · entirely, under `prefers-reduced-motion: reduce`
 *
 * A sine sweep rather than a linear one: it decelerates at each end, which is
 * where the eye needs a beat to read the difference, and it never snaps.
 *
 * ── Accessibility ─────────────────────────────────────────────────────────
 *
 * The control is a real `<input type="range">`, so arrow keys work, the value
 * is announced, and the whole thing is operable without a pointer. The visible
 * handle is decoration drawn at the same position. `useId` because /portfolio
 * renders three of these and three elements cannot share one DOM id.
 */

const MIN = 22;
const MAX = 78;
/** One full there-and-back sweep. Slow enough to read, not slow enough to feel stuck. */
const PERIOD_MS = 9000;
/** How long a deliberate position is respected before the drift resumes. */
const HANDOVER_MS = 5000;

export function BeforeAfter({
  before,
  after,
  beforeAlt,
  afterAlt,
  /** Opt out where the motion would compete with something else on the page. */
  autoplay = true,
  className,
}: {
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
  autoplay?: boolean;
  className?: string;
}) {
  const [pos, setPos] = useState(52);
  const rangeId = useId();
  const wrap = useRef<HTMLDivElement>(null);

  /**
   * Held in refs, not state: the animation frame reads them every tick and
   * re-rendering 60 times a second to store "is the mouse over it" would be
   * absurd.
   */
  const paused = useRef(false);
  const heldUntil = useRef(0);
  const onScreen = useRef(false);

  const hold = useCallback(() => {
    heldUntil.current = Date.now() + HANDOVER_MS;
  }, []);

  useEffect(() => {
    if (!autoplay) return;
    const node = wrap.current;
    if (!node) return;

    // Someone who has asked their system to stop animating things means it.
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (reduced?.matches) return;

    const io =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(
            (entries) => {
              onScreen.current = entries.some((e) => e.isIntersecting);
            },
            { threshold: 0.25 },
          );
    if (io) io.observe(node);
    else onScreen.current = true;

    let raf = 0;
    let start = 0;
    /**
     * Phase is tracked separately from elapsed time so that resuming after a
     * pause continues the sweep from where it stopped instead of jumping to
     * wherever the clock happens to be.
     */
    let phase = 0;
    let last = 0;

    const tick = (now: number) => {
      if (!start) {
        start = now;
        last = now;
      }
      const dt = now - last;
      last = now;

      const running =
        !paused.current &&
        onScreen.current &&
        Date.now() > heldUntil.current &&
        document.visibilityState === "visible";

      if (running) {
        phase += dt / PERIOD_MS;
        const mid = (MIN + MAX) / 2;
        const amp = (MAX - MIN) / 2;
        // Sine: slowest at the extremes, which is where the eye compares.
        setPos(mid + amp * Math.sin(phase * Math.PI * 2));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onVisibility = () => {
      last = performance.now();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [autoplay]);

  return (
    <div
      ref={wrap}
      className={cn(
        "relative overflow-hidden rounded-xl bg-bg-warm shadow-[var(--shadow-card)]",
        className,
      )}
      onPointerEnter={() => {
        paused.current = true;
      }}
      onPointerLeave={() => {
        paused.current = false;
      }}
      onFocusCapture={() => {
        paused.current = true;
      }}
      onBlurCapture={() => {
        paused.current = false;
      }}
    >
      <div className="relative aspect-[4/3] w-full select-none">
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
      <label className="sr-only" htmlFor={rangeId}>
        Drag to compare before and after
      </label>
      <input
        id={rangeId}
        type="range"
        min={4}
        max={96}
        value={Math.round(pos)}
        onChange={(e) => {
          hold();
          setPos(Number(e.target.value));
        }}
        onPointerDown={hold}
        onKeyDown={hold}
        className="absolute inset-0 z-20 cursor-ew-resize opacity-0"
      />
    </div>
  );
}
