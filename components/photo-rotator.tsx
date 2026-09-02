"use client";

import NextImage from "next/image";
import { useEffect, useRef, useState } from "react";
import { variantsOf } from "@/data/images";
import { cn } from "@/lib/utils";

/**
 * A photograph that crossfades between its two renditions.
 *
 * Reserved for the few surfaces a visitor actually dwells on — the showroom,
 * the workshop. Everywhere else the variant is picked once, deterministically,
 * by `Photo`'s `seed`: a page full of images quietly swapping themselves is
 * a page nobody can read.
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
  intervalMs = 7000,
  className,
}: {
  src: string;
  alt: string;
  /** Tailwind aspect class, e.g. "aspect-[4/3]". */
  ratio: string;
  sizes: string;
  intervalMs?: number;
  className?: string;
}) {
  const frames = variantsOf(src);
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
          // Only the visible frame carries the description; the other is the
          // same subject photographed twice, and announcing it again is noise.
          alt={i === index ? alt : ""}
          aria-hidden={i !== index}
          fill
          sizes={sizes}
          className={cn(
            "object-cover transition-opacity duration-1000 ease-in-out",
            i === index ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
    </div>
  );
}
