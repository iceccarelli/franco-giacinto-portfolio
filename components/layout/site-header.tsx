import Link from "next/link";
import { Phone } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { SiteSearch } from "@/components/search/site-search";
import { UtilityBar } from "@/components/layout/utility-bar";
import { NavMenu } from "@/components/layout/nav-menu";
import { MobileNav } from "@/components/layout/mobile-nav";
import { company } from "@/data/company";

/**
 * The site header, in the shape aws.amazon.com uses:
 *
 *   row 1  utility bar — secondary links, hours, phone        (lg and up)
 *   row 2  logo · primary nav · search · phone · CTA
 *
 * On a phone row 2 becomes hamburger · centred logo · search — which is the
 * arrangement AWS ships on mobile, and it is better than left-aligning the
 * logo next to the hamburger because the wordmark stays the optical centre of
 * the bar at the width where it is the only branding on screen.
 *
 * The component itself is a server component now. Only the two pieces that
 * genuinely need state — the mega-menu and the drawer — are client islands.
 * Previously the whole header was `"use client"`, so `usePathname`,
 * `useState`, the entire nav data and every label shipped to the browser on
 * all 358 pages.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-bg/90 backdrop-blur-md">
      <UtilityBar />

      <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4 sm:px-6 lg:h-[4.25rem] lg:gap-4">
        {/* Phone: hamburger left. Desktop: hidden, and the logo leads the bar.
            `flex-1` here and on the action cluster below makes the two sides
            equal, which is what actually centres the wordmark — matching it by
            eye drifts as soon as the icon count changes. */}
        <div className="flex flex-1 justify-start lg:hidden">
          <MobileNav />
        </div>

        <Logo className="shrink-0" />

        <NavMenu />

        {/* Desktop actions. */}
        <div className="ml-auto hidden items-center gap-2 lg:flex">
          <SiteSearch />
          <a
            href={`tel:${company.phone}`}
            className="inline-flex h-11 items-center gap-2 rounded-md px-2 text-sm font-medium text-primary transition-colors hover:bg-bg-warm"
          >
            <Phone className="size-4" aria-hidden />
            {company.phoneDisplay}
          </a>
          <Button asChild>
            <Link href="/estimate">Free estimate</Link>
          </Button>
        </div>

        {/* Phone actions. Search only: the phone number is already a full-width
            button in the sticky bottom bar and again in the drawer, and a third
            copy here made the two sides of the bar unequal, which pushed the
            wordmark off centre. One control each side, wordmark dead centre. */}
        <div className="flex flex-1 items-center justify-end lg:hidden">
          <SiteSearch className="inline-flex size-11 items-center justify-center rounded-md text-muted transition-colors hover:bg-bg-warm hover:text-fg focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none" />
        </div>

      </div>
    </header>
  );
}
