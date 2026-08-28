import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container, type ContainerWidth } from "@/components/layout/container";

/**
 * The vertical rhythm. One scale, applied responsively.
 *
 * The site previously used py-10, py-12, py-14, py-16, py-20, pb-6, pb-8,
 * pb-10, pb-12, pb-14 and pb-16 for what was structurally the same slot, and
 * only the homepage stepped its padding up at `sm:`. The result was that a
 * hand-rolled hero was visibly tighter on a laptop than a `<PageHero>` one on
 * the same site.
 *
 *   tight   — dense rows: breadcrumb rails, meta strips
 *   default — the standard section
 *   loose   — the one or two sections a page wants to breathe
 *
 * Each step grows at `sm:`, so a phone gets a compact page and a desktop gets
 * an airy one from the same markup.
 */
export type SectionSpace = "tight" | "default" | "loose";

const SPACE: Record<SectionSpace, string> = {
  tight: "py-6 sm:py-8",
  default: "py-12 sm:py-16",
  loose: "py-16 sm:py-24",
};

const TONE = {
  base: "",
  warm: "bg-bg-warm",
  surface: "bg-surface",
  ink: "bg-primary text-primary-fg",
} as const;

export function Section({
  space = "default",
  tone = "base",
  width = "wide",
  bordered = false,
  className,
  containerClassName,
  id,
  "aria-labelledby": labelledBy,
  children,
}: {
  space?: SectionSpace;
  tone?: keyof typeof TONE;
  width?: ContainerWidth;
  bordered?: boolean;
  className?: string;
  containerClassName?: string;
  id?: string;
  "aria-labelledby"?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(TONE[tone], bordered && "border-t border-border", className)}
    >
      <Container width={width} className={cn(SPACE[space], containerClassName)}>
        {children}
      </Container>
    </section>
  );
}

/**
 * The rounded sheet that lifts page content over a full-bleed hero — the move
 * aws.amazon.com uses between its gradient hero and the first white section.
 * It reads as "the page starts here" without needing a rule or a heading.
 */
export function ContentSheet({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("relative z-10 -mt-6 rounded-t-[1.75rem] bg-bg sm:-mt-10", className)}>
      {children}
    </div>
  );
}
