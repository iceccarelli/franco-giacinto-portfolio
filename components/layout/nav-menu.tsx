"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ArrowRight } from "lucide-react";
import { navSections } from "@/data/navigation";

/**
 * The desktop mega-menu.
 *
 * The previous implementation was a CSS `group-hover` div. That looks the same
 * in a screenshot and behaves worse in every other way: no `aria-expanded`, so
 * a screen reader announced a link rather than a menu; no Escape; no way to
 * open it from the keyboard other than tabbing into it; and on a touch laptop
 * the first tap opened it and navigated away in the same gesture.
 *
 * This is a real disclosure. Hover opens it with a small close delay so the
 * diagonal trip from trigger to panel does not dismiss it, click toggles it,
 * Escape closes it and returns focus to the trigger, and a click outside
 * closes it. Same panel content either way.
 */
export function NavMenu() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();
  const pathname = usePathname();

  // A navigation closes the menu. Without this the panel stays open over the
  // page you just asked for.
  useEffect(() => {
    setOpenIndex(null);
  }, [pathname]);

  useEffect(() => {
    if (openIndex === null) return;

    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      const i = openIndex;
      setOpenIndex(null);
      if (i !== null) triggerRefs.current[i]?.focus();
    }
    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpenIndex(null);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [openIndex]);

  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current); }, []);

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenIndex(null), 140);
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div ref={rootRef} className="hidden lg:flex lg:items-center lg:gap-0.5">
      {navSections.map((section, i) => {
        const open = openIndex === i;
        const panelId = `${baseId}-panel-${i}`;
        return (
          <div
            key={section.href}
            className="relative"
            onMouseEnter={() => {
              cancelClose();
              setOpenIndex(i);
            }}
            onMouseLeave={scheduleClose}
          >
            <button
              type="button"
              ref={(el) => {
                triggerRefs.current[i] = el;
              }}
              aria-expanded={open}
              aria-controls={panelId}
              aria-current={isActive(section.href) ? "page" : undefined}
              onClick={() => setOpenIndex(open ? null : i)}
              className={`inline-flex h-11 items-center gap-1 rounded-md px-3 text-sm font-medium transition-colors hover:bg-bg-warm hover:text-fg ${
                open || isActive(section.href) ? "bg-bg-warm text-fg" : "text-fg/80"
              }`}
            >
              {section.label}
              <ChevronDown
                aria-hidden
                className={`size-3.5 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
              />
            </button>

            <div
              id={panelId}
              hidden={!open}
              onMouseEnter={cancelClose}
              onMouseLeave={scheduleClose}
              className="absolute top-full left-0 z-50 pt-2"
            >
              <div className="w-[min(58rem,calc(100vw-3rem))] overflow-hidden rounded-xl border border-border bg-surface shadow-[var(--shadow-card)]">
                <div className="border-b border-border bg-bg-warm/60 px-6 py-3">
                  <Link
                    href={section.href}
                    className="group inline-flex items-center gap-1.5 text-sm font-medium text-fg"
                  >
                    {section.summary}
                    <ArrowRight
                      aria-hidden
                      className="size-3.5 text-accent transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                </div>

                <div className={`grid gap-6 p-6 ${section.feature ? "grid-cols-4" : "grid-cols-3"}`}>
                  {section.groups.map((group) => (
                    <div key={group.heading}>
                      <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-muted uppercase">
                        {group.href ? (
                          <Link href={group.href} className="hover:text-fg">
                            {group.heading}
                          </Link>
                        ) : (
                          group.heading
                        )}
                      </p>
                      <ul className="mt-2.5 space-y-0.5">
                        {group.links.map((link) => (
                          <li key={`${group.heading}-${link.href}`}>
                            <Link
                              href={link.href}
                              className="block rounded-md px-2 py-1.5 transition-colors hover:bg-bg-warm"
                            >
                              <span className="block text-sm font-medium text-fg">{link.label}</span>
                              {link.blurb ? (
                                <span className="mt-0.5 block text-xs leading-snug text-muted">
                                  {link.blurb}
                                </span>
                              ) : null}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  {section.feature ? (
                    <div className="rounded-lg bg-bg-warm p-4">
                      <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase">
                        Most asked for
                      </p>
                      <Link
                        href={section.feature.href}
                        className="mt-2 block font-display text-lg leading-snug font-medium text-fg hover:underline"
                      >
                        {section.feature.label}
                      </Link>
                      <p className="mt-1.5 text-xs leading-relaxed text-muted">
                        {section.feature.blurb}
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
