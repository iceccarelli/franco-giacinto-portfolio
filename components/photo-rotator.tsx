"use client";

import NextImage from "next/image";
import { useEffect, useRef, useState } from "react";
import { variantsFrom, variantsOf } from "@/data/images";
import { cn } from "@/lib/utils";

/**
 * A photograph that crossfades between its renditions, optionally drifting.
 *
 * Reserved for the few surfaces a visitor actually dwells on — the showroom,
 * the workshop, and now the equipment and defect library. Everywhere else the
 * variant is picked once, deterministically, by `Photo`'s `seed`: a page full
 * of images quietly swapping themselves is a page nobody can read.
 *
 * ── Two renditions, or four ───────────────────────────────────────────────
 *
 * Most photographs have two. The equipment library has four, because two
 * agents each delivered a full pair to the same brief. `variantsOf` returns
 * however many exist, so nothing here counts frames.
 *
 * ── seed: which rendition a page opens on ─────────────────────────────────
 *
 * Without a seed every instance starts on the canonical file, which means ten
 * cards in a grid all open on the same frame and cross-fade in lockstep — a
 * worse impression than a static grid, because it draws the eye to the fact
 * that they are identical. With a seed the sequence is ROTATED so each card
 * opens somewhere different, and the opening frame is exactly the one
 * `pickVariant` would have chosen for that seed. The server renders that
 * frame. A crawler, a reader with JavaScript off, and the first paint for
 * everyone else therefore all see the same correct still.
 *
 * ── kenBurns ──────────────────────────────────────────────────────────────
 *
 * A very slow scale-and-drift on the visible frame, so a photograph that
 * holds for seven seconds is not seven seconds of nothing. It is off by
 * default and opt-in per call site, because it costs a compositor layer and
 * it is wrong on anything a reader needs to study closely — a moisture-meter
 * screen should hold still while it is being read.
 *
 * Same discipline as the comparison slider, for the same reasons:
 *
 *   · both frames are in the DOM from the first render, so there is no layout
 *     shift and no second network request mid-fade
 *   · it holds while a pointer is over it — you are looking, it stops
 *   · it stops off-screen and in a hidden tab
 *   · it does not start at all under `prefers-reduced-motion: reduce`
 *
 * The first frame renders identically to a plain `Photo`, so a visitor who
 * never triggers the effect — crawler, reduced motion, JavaScript off — sees
 * exactly the image the server rendered.
 */
export function PhotoRotator({
  src,
  alt,
  ratio,
  sizes,
  seed,
  intervalMs = 7000,
  kenBurns = false,
  priority = false,
  className,
}: {
  src: string;
  alt: string;
  /** Tailwind aspect class, e.g. "aspect-[4/3]". */
  ratio: string;
  sizes: string;
  /**
   * A string the page already owns — its slug, its city. Rotates the sequence
   * so sibling instances do not open on the same frame or fade in lockstep.
   */
  seed?: string;
  intervalMs?: number;
  /** Slow scale-and-drift on the visible frame. Off unless asked for. */
  kenBurns?: boolean;
  /**
   * Marks the FIRST frame as the LCP element. Never more than one per page,
   * and never more than one frame — `tests/layout.test.ts` counts them.
   */
  priority?: boolean;
  className?: string;
}) {
  const frames = seed ? variantsFrom(src, seed) : variantsOf(src);
  const [index, setIndex] = useState(0);
  const wrap = useRef<HTMLDivElement>(null);
  const paused = useRef(false);

  useEffect(() => {
    if (frames.length < 2) return;
    const node = wrap.current;
    if (!node) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    let onScreen = false;
    const io =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver((es) => {
            onScreen = es.some((e) => e.isIntersecting);
          }, { threshold: 0.3 });
    if (io) io.observe(node);
    else onScreen = true;

    const id = window.setInterval(() => {
      if (paused.current || !onScreen || document.visibilityState !== "visible") return;
      setIndex((i) => (i + 1) % frames.length);
    }, intervalMs);

    return () => {
      window.clearInterval(id);
      io?.disconnect();
    };
  }, [frames.length, intervalMs]);

  return (
    <div
      ref={wrap}
      className={cn("relative overflow-hidden", ratio, className)}
      onPointerEnter={() => {
        paused.current = true;
      }}
      onPointerLeave={() => {
        paused.current = false;
      }}
    >
      {frames.map((f, i) => (
        <NextImage
          key={f}
          src={f}
          // Only the visible frame carries the description; the others are the
          // same subject photographed again, and announcing it again is noise.
          alt={i === index ? alt : ""}
          aria-hidden={i !== index}
          fill
          sizes={sizes}
          // Exactly one eager image, and it is the frame the server rendered.
          priority={priority && i === 0}
          loading={priority && i === 0 ? "eager" : "lazy"}
          className={cn(
            "object-cover transition-opacity duration-1000 ease-in-out",
            i === index ? "opacity-100" : "opacity-0",
            // The drift runs only on the frame being looked at, so three
            // hidden images are not animating a transform for nobody.
            kenBurns && i === index && "gh-kenburns",
          )}
        />
      ))}
    </div>
  );
}
