import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The horizontal rail. Two widths, and only two.
 *
 * Before this component the site used `max-w-6xl` on 19 pages, `max-w-3xl` on
 * 9, and `max-w-4xl` on exactly 2 — so `/problems/[slug]` sat at a different
 * measure than its own siblings `/answers/[slug]` and `/guides/[slug]`, and
 * `/glossary` put its breadcrumbs on a wider gutter than its own body text.
 * Nobody chose that; it accumulated.
 *
 *   wide  — the page rail. Grids, cards, heroes, footers. 72rem.
 *   prose — a single column of reading text. Capped near 68 characters,
 *           which is where line length stops helping.
 *
 * `scripts/audit-site.mjs` fails the build on any third width.
 */
export type ContainerWidth = "wide" | "prose";

const WIDTH: Record<ContainerWidth, string> = {
  wide: "max-w-6xl",
  prose: "max-w-3xl",
};

export function Container({
  as: Tag = "div",
  width = "wide",
  className,
  children,
}: {
  as?: ElementType;
  width?: ContainerWidth;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag className={cn("mx-auto w-full px-4 sm:px-6", WIDTH[width], className)}>{children}</Tag>
  );
}
