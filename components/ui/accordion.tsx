import type { ComponentProps, ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Disclosure built on native <details>, not on a JavaScript accordion.
 *
 * ── Why this was rewritten ────────────────────────────────────────────────
 *
 * This was `@radix-ui/react-accordion`. Radix unmounts the content of a closed
 * item, which means the answer text existed in the browser only after a human
 * clicked. Measured on the built output before this change:
 *
 *   /faq                 53 items with data-state="closed", 0 answers in <body>
 *   /                    0 answers in <body>
 *   /areas/barrie        0 answers in <body>
 *
 * The answers were reachable in exactly two places: the RSC flight payload
 * (inside a <script>, which is not page content) and the FAQPage JSON-LD.
 * Google renders JavaScript but does not click accordions, so on 275 pages —
 * the homepage, /faq, 8 service pages, 224 service × city pages, 32 city hubs
 * and 9 method pages — the visible body carried the questions and none of the
 * answers.
 *
 * That is the whole long-tail phrasing of every FAQ this shop has written,
 * invisible to search and to any answer engine that reads HTML rather than
 * parsing JSON-LD. On a site whose stated first priority is discoverability,
 * it was the most expensive thing on the page being thrown away by a
 * component choice.
 *
 * ── What <details> buys ───────────────────────────────────────────────────
 *
 * The content is in the DOM whether the item is open or shut, so it is
 * crawlable and quotable. Screen readers get correct disclosure semantics from
 * the browser rather than from an ARIA reimplementation. It works with
 * JavaScript off. And it is a server component, so 275 pages stop shipping an
 * accordion library they no longer need.
 *
 * ── What was given up, honestly ───────────────────────────────────────────
 *
 * Two things, both cheap.
 *
 * 1. Exclusive open ("type=single collapsible"). Items now open independently.
 *    The native `name` attribute would restore it, but it needs a shared
 *    identifier that a server component cannot mint, and reading several
 *    answers at once is not worse behaviour for an FAQ.
 * 2. The open/close animation. It was already dead: the classes referenced
 *    `animate-accordion-up` / `animate-accordion-down`, and no such keyframes
 *    exist anywhere in this repo. It has been animating nothing for as long as
 *    it has been here.
 *
 * The call sites are unchanged — `type` and `collapsible` are accepted and
 * ignored so no page had to be touched.
 */

export function Accordion({
  className,
  children,
  // Accepted and discarded: the Radix API that call sites still pass.
  type: _type,
  collapsible: _collapsible,
  ...props
}: ComponentProps<"div"> & { type?: "single" | "multiple"; collapsible?: boolean }) {
  return (
    <div className={cn("border-t border-border", className)} {...props}>
      {children}
    </div>
  );
}

export function AccordionItem({
  className,
  children,
  /** Radix required a value per item; kept in the signature, off the DOM. */
  value: _value,
  defaultOpen,
  ...props
}: Omit<ComponentProps<"details">, "open"> & { value?: string; defaultOpen?: boolean }) {
  return (
    <details
      className={cn("group border-b border-border", className)}
      open={defaultOpen}
      {...props}
    >
      {children}
    </details>
  );
}

export function AccordionTrigger({
  className,
  children,
  ...props
}: ComponentProps<"summary">) {
  return (
    <summary
      className={cn(
        "flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left font-display text-lg font-medium transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent [&::-webkit-details-marker]:hidden",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDown
        className="size-5 shrink-0 text-muted transition-transform duration-200 group-open:rotate-180"
        aria-hidden
      />
    </summary>
  );
}

export function AccordionContent({
  className,
  children,
  ...props
}: ComponentProps<"div"> & { children?: ReactNode }) {
  return (
    <div className={cn("pb-5 leading-relaxed text-muted", className)} {...props}>
      {children}
    </div>
  );
}
