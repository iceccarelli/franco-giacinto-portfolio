import NextImage from "next/image";
import { cn } from "@/lib/utils";

/**
 * The only way an image reaches a page.
 *
 * Why this exists
 * ---------------
 * `next.config.mjs` has declared `formats: ["image/avif", "image/webp"]` and
 * seven `deviceSizes` since the first patch. That configuration only applies to
 * `next/image` — and the site used `next/image` in exactly one file while
 * serving nineteen raw `<img>` elements everywhere else. The optimizer was
 * configured, paid for, and reaching one photograph.
 *
 * The measured cost: the homepage shipped **10.79 MB** of media. Every source
 * file is a 1,600–1,800px JPEG, and a phone rendering one in a 360px card
 * downloaded all of it. `service-deck.jpg` alone is 1,024 KB for a card that is
 * never wider than a third of a 72rem rail.
 *
 * Through this component the same photograph is served as AVIF, resized to the
 * breakpoint that will actually display it, and lazily unless it is the LCP
 * element. The source files do not change.
 *
 * `sizes` is the part that is easy to get wrong and expensive when you do — a
 * missing or too-generous `sizes` makes the browser fetch the largest variant
 * and undoes the whole exercise. So it is not a free-form string here: pick the
 * preset that matches the layout slot, and the presets are defined once,
 * against the real container widths of a `max-w-6xl` rail.
 */

/** Layout slots that actually occur in this site. */
export type PhotoSlot = "full" | "half" | "card" | "thumb";

const SIZES: Record<PhotoSlot, string> = {
  /** Edge to edge — heroes and banners. */
  full: "100vw",
  /** One half of a two-column grid inside a 72rem rail. */
  half: "(min-width: 1024px) 592px, 100vw",
  /** One cell of a three-column card grid; two-up on tablets. */
  card: "(min-width: 1024px) 368px, (min-width: 640px) 50vw, 100vw",
  /** Small inline figures — species swatches, avatars. */
  thumb: "(min-width: 640px) 208px, 40vw",
};

/** Aspect ratios the design system uses. Adding one is a design decision. */
export type PhotoRatio = "21/9" | "16/8" | "16/9" | "16/10" | "4/3" | "3/2" | "5/4" | "1/1" | "4/5";

const RATIO: Record<PhotoRatio, string> = {
  "21/9": "aspect-[21/9]",
  "16/8": "aspect-[16/8]",
  "16/9": "aspect-[16/9]",
  "16/10": "aspect-[16/10]",
  "4/3": "aspect-[4/3]",
  "3/2": "aspect-[3/2]",
  "5/4": "aspect-[5/4]",
  "1/1": "aspect-square",
  "4/5": "aspect-[4/5]",
};

export function Photo({
  src,
  alt,
  ratio = "4/3",
  slot = "card",
  priority = false,
  className,
  imageClassName,
}: {
  src: string;
  /** Never optional, and never decorative on this site — every photo is a claim. */
  alt: string;
  ratio?: PhotoRatio;
  slot?: PhotoSlot;
  /**
   * Set on the one image that is the page's LCP element, and nowhere else.
   * Marking several defeats the purpose: the browser fetches them all eagerly
   * and the real one arrives later than it would have.
   */
  priority?: boolean;
  /** Classes for the frame — rounding, shadow, border. */
  className?: string;
  /** Classes for the image itself — hover transforms, object-position. */
  imageClassName?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden", RATIO[ratio], className)}>
      <NextImage
        src={src}
        alt={alt}
        fill
        sizes={SIZES[slot]}
        priority={priority}
        // `priority` already implies eager; being explicit keeps the intent
        // readable next to the nineteen images that are not the LCP element.
        loading={priority ? "eager" : "lazy"}
        className={cn("object-cover", imageClassName)}
      />
    </div>
  );
}
