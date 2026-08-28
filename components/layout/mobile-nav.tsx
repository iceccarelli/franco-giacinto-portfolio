"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Phone } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { company } from "@/data/company";
import { navSections, utilityLinks } from "@/data/navigation";

/**
 * The phone and tablet drawer.
 *
 * It renders `navSections` — the same array the desktop mega-menu renders —
 * with the same section labels, the same group headings, in the same order.
 * The desktop shows the groups side by side because it has the width; the
 * phone shows them stacked behind disclosures because it does not. That is the
 * only difference, and it is a presentation difference.
 *
 * The old drawer was a separate hand-written list of thirteen links. It had
 * already drifted: /guides, /answers, /glossary, /trade and /contact were
 * reachable on a phone and unreachable from the desktop header.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(navSections[0]?.href ?? null);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open menu">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-[min(100%,23rem)] gap-0 overflow-y-auto p-0">
        <div className="border-b border-border px-5 py-4 pr-16">
          <Logo />
        </div>

        <nav aria-label="Primary" className="flex-1 px-3 py-3">
          {navSections.map((section) => {
            const isOpen = expanded === section.href;
            return (
              <div key={section.href} className="border-b border-border/70 last:border-b-0">
                <div className="flex items-center">
                  <Link
                    href={section.href}
                    aria-current={isActive(section.href) ? "page" : undefined}
                    className={`flex-1 rounded-md px-2 py-3.5 text-base font-medium ${
                      isActive(section.href) ? "text-accent" : "text-fg"
                    }`}
                  >
                    {section.label}
                  </Link>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-label={`${isOpen ? "Collapse" : "Expand"} ${section.label}`}
                    onClick={() => setExpanded(isOpen ? null : section.href)}
                    className="rounded-md p-2 text-muted hover:bg-bg-warm hover:text-fg"
                  >
                    <ChevronDown
                      aria-hidden
                      className={`size-4 transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>

                {isOpen ? (
                  <div className="pb-3">
                    {section.groups.map((group) => (
                      <div key={group.heading} className="mt-1 mb-3 last:mb-1">
                        <p className="px-2 text-[0.6875rem] font-semibold tracking-[0.14em] text-muted uppercase">
                          {group.heading}
                        </p>
                        <ul className="mt-1">
                          {group.links.map((link) => (
                            <li key={`${group.heading}-${link.href}`}>
                              <Link
                                href={link.href}
                                aria-current={isActive(link.href) ? "page" : undefined}
                                className={`block rounded-md px-2 py-2.5 text-sm ${
                                  isActive(link.href)
                                    ? "bg-bg-warm font-medium text-fg"
                                    : "text-fg/85 hover:bg-bg-warm"
                                }`}
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    {section.feature ? (
                      <Link
                        href={section.feature.href}
                        className="mx-2 block rounded-lg bg-bg-warm p-3"
                      >
                        <span className="text-[0.6875rem] font-semibold tracking-[0.14em] text-accent uppercase">
                          Most asked for
                        </span>
                        <span className="mt-1 block font-display text-base font-medium">
                          {section.feature.label}
                        </span>
                      </Link>
                    ) : null}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>

        {/* The desktop utility bar, in the place a phone can reach it. */}
        <div className="border-t border-border bg-bg-warm/60 px-3 py-3">
          <ul className="grid grid-cols-2 gap-x-2">
            {utilityLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-md px-2 py-2 text-sm text-muted hover:bg-bg-warm hover:text-fg"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="sticky bottom-0 flex flex-col gap-2 border-t border-border bg-bg p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <Button asChild>
            <Link href="/estimate">Free estimate</Link>
          </Button>
          <Button asChild variant="outline">
            <a href={`tel:${company.phone}`}>
              <Phone className="size-4" aria-hidden />
              {company.phoneDisplay}
            </a>
          </Button>
          <p className="text-center text-xs text-muted">{company.hoursSummary}</p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
