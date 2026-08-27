"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, Phone } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SiteSearch } from "@/components/search/site-search";
import { company } from "@/data/company";
import { services } from "@/data/services";

const mega: { heading: string; items: { label: string; href: string }[] }[] = [
  {
    heading: "Floors",
    items: [
      { label: "Hardwood installation", href: "/services/hardwood-installation" },
      { label: "Sanding & refinishing", href: "/services/sanding-refinishing" },
      { label: "Repairs & restoration", href: "/services/hardwood-repairs" },
      { label: "Hardwood decks", href: "/services/hardwood-decks" },
    ],
  },
  {
    heading: "Stairs & rails",
    items: [
      { label: "Stair studio", href: "/stairs" },
      { label: "Hardwood stairs", href: "/services/hardwood-stairs" },
      { label: "Hardwood railings", href: "/services/hardwood-railings" },
      { label: "Custom inlays", href: "/services/custom-inlays" },
    ],
  },
  {
    heading: "Specify",
    items: [
      { label: "Showroom", href: "/showroom" },
      { label: "Estimator", href: "/estimate" },
      { label: "Hardwood vs vinyl", href: "/compare" },
      { label: "Our process", href: "/process" },
    ],
  },
];

const primary: { label: string; href: string }[] = [
  { label: "Stairs", href: "/stairs" },
  { label: "Railings", href: "/services/hardwood-railings" },
  { label: "Showroom", href: "/showroom" },
  { label: "Work", href: "/portfolio" },
  { label: "Areas", href: "/areas" },
  { label: "About", href: "/about" },
];

const mobile: { label: string; href: string }[] = [
  { label: "Services", href: "/services" },
  { label: "Stair studio", href: "/stairs" },
  { label: "Showroom", href: "/showroom" },
  { label: "Work", href: "/portfolio" },
  { label: "Areas", href: "/areas" },
  { label: "Guides", href: "/guides" },
  { label: "About", href: "/about" },
  { label: "Trade", href: "/trade" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  /** Marks the section you are in, for both sighted users and screen readers. */
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-bg/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:h-[4.25rem] sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          <div className="group relative">
            <Link
              href="/services"
              aria-current={isActive("/services") ? "page" : undefined}
              className={`inline-flex h-11 items-center rounded-md px-3 text-sm font-medium transition-colors hover:bg-bg-warm hover:text-fg ${
                isActive("/services") ? "bg-bg-warm text-fg" : "text-fg/80"
              }`}
            >
              Services
            </Link>
            <div className="invisible absolute top-full left-0 pt-2 opacity-0 transition-opacity duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <div className="grid w-[38rem] grid-cols-3 gap-6 rounded-xl bg-surface p-6 shadow-[var(--shadow-card)]">
                {mega.map((col) => (
                  <div key={col.heading}>
                    <p className="text-xs tracking-[0.14em] text-muted uppercase">{col.heading}</p>
                    <ul className="mt-2 space-y-1">
                      {col.items.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className="block rounded-md px-2 py-1.5 text-sm hover:bg-bg-warm"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {primary.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-bg-warm hover:text-fg ${
                isActive(item.href) ? "bg-bg-warm text-fg" : "text-fg/80"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <SiteSearch />
          <a
            href={`tel:${company.phone}`}
            className="inline-flex h-11 items-center gap-2 px-2 text-sm font-medium text-primary"
          >
            <Phone className="size-4" />
            {company.phoneDisplay}
          </a>
          <Button asChild>
            <Link href="/estimate">Free estimate</Link>
          </Button>
        </div>

        <SiteSearch className="inline-flex size-11 items-center justify-center rounded-md border border-border bg-surface text-muted transition-colors hover:bg-bg-warm hover:text-fg focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none md:hidden" />

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open menu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <Logo className="mb-8" />
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {mobile.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`rounded-md px-3 py-3 text-base font-medium hover:bg-bg-warm ${
                    isActive(item.href) ? "bg-bg-warm" : ""
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {services.map((child) => (
                <Link
                  key={child.slug}
                  href={`/services/${child.slug}`}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2 pl-5 text-sm text-muted hover:bg-bg-warm hover:text-fg"
                >
                  {child.shortName}
                </Link>
              ))}
            </nav>
            <div className="mt-auto flex flex-col gap-2 pt-8">
              <Button asChild>
                <Link href="/estimate" onClick={() => setOpen(false)}>
                  Free estimate
                </Link>
              </Button>
              <Button asChild variant="outline">
                <a href={`tel:${company.phone}`}>Call {company.phoneDisplay}</a>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
