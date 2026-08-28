import Link from "next/link";
import { ArrowUp, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/logo";
import { Container } from "@/components/layout/container";
import { company } from "@/data/company";
import { coreCities } from "@/data/areas";
import { footerColumns, legalLinks } from "@/data/navigation";

/**
 * The footer, in the shape aws.amazon.com uses: an action row, a four-column
 * link matrix, a back-to-top, then the legal strip.
 *
 * The four columns come from `data/navigation.ts`. The previous footer had
 * sixteen hand-written <li> elements in a single "Company" column — which is a
 * list, not a structure, and it drifted from the header within two patches.
 *
 * On a phone each column is a `<details>` disclosure, which is what AWS ships
 * ("Help +" in the mobile footer). Above `lg` the CSS in globals.css hides the
 * summaries and forces the content open, so the same markup renders as four
 * columns with no JavaScript and no second copy of the links.
 */
export function SiteFooter() {
  return (
    <footer className="mt-auto bg-primary text-primary-fg">
      {/* Action row — AWS's "Create an AWS account" + language selector line. */}
      <div className="border-b border-primary-fg/10">
        <Container className="flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-xl leading-snug font-medium">
              Get a real number before anyone visits.
            </p>
            <p className="mt-1 text-sm text-primary-fg/70">
              Free on-site measure across our core service area.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/estimate"
              className="inline-flex h-11 items-center rounded-full bg-primary-fg px-6 text-sm font-medium text-primary transition-opacity hover:opacity-90"
            >
              Free estimate
            </Link>
            <a
              href={`tel:${company.phone}`}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-primary-fg/30 px-6 text-sm font-medium transition-colors hover:bg-primary-fg/10"
            >
              <Phone className="size-4" aria-hidden />
              {company.phoneDisplay}
            </a>
          </div>
        </Container>
      </div>

      {/* The link matrix. */}
      <Container className="py-10 sm:py-14">
        <div className="grid gap-x-8 gap-y-1 lg:grid-cols-5 lg:gap-y-10">
          {/* Identity + NAP. First column on desktop, top block on a phone. */}
          <div className="mb-6 lg:mb-0">
            <Logo invert />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-primary-fg/75">
              {company.tagline}
            </p>
            <address className="mt-4 space-y-1.5 text-sm not-italic text-primary-fg/80">
              <span className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary-fg/50" aria-hidden />
                <span>
                  {company.address.line1}
                  <br />
                  {company.address.city}, {company.address.region} {company.address.postal}
                </span>
              </span>
              <a
                className="flex items-center gap-2 underline-offset-2 hover:underline"
                href={`tel:${company.phone}`}
              >
                <Phone className="size-4 shrink-0 text-primary-fg/50" aria-hidden />
                {company.phoneDisplay}
              </a>
              <a
                className="flex items-center gap-2 underline-offset-2 hover:underline"
                href={`mailto:${company.email}`}
              >
                <Mail className="size-4 shrink-0 text-primary-fg/50" aria-hidden />
                {company.email}
              </a>
              <a
                className="flex items-center gap-2 underline-offset-2 hover:underline"
                href={company.instagram}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Instagram className="size-4 shrink-0 text-primary-fg/50" aria-hidden />
                Instagram
              </a>
            </address>
            <p className="mt-3 text-xs text-primary-fg/60">{company.hoursSummary}</p>
          </div>

          {footerColumns.map((column) => (
            <details
              key={column.heading}
              data-footer-column
              className="border-b border-primary-fg/10 lg:border-b-0"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between py-3.5 text-sm font-semibold tracking-wide text-primary-fg uppercase [&::-webkit-details-marker]:hidden">
                {column.heading}
                <span
                  aria-hidden
                  className="relative size-4 shrink-0 before:absolute before:top-1/2 before:left-0 before:h-px before:w-4 before:-translate-y-1/2 before:bg-primary-fg/60 after:absolute after:top-0 after:left-1/2 after:h-4 after:w-px after:-translate-x-1/2 after:bg-primary-fg/60 after:transition-transform"
                />
              </summary>
              <div>
                <h2 className="hidden text-sm font-semibold tracking-wide text-primary-fg/60 uppercase lg:block">
                  {column.href ? (
                    <Link href={column.href} className="hover:text-primary-fg">
                      {column.heading}
                    </Link>
                  ) : (
                    column.heading
                  )}
                </h2>
                <ul className="space-y-2 pb-4 text-sm lg:mt-4 lg:pb-0">
                  {column.links.map((link) => (
                    <li key={`${column.heading}-${link.href}`}>
                      <Link
                        href={link.href}
                        className="text-primary-fg/80 transition-colors hover:text-primary-fg"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          ))}

          {/* Service areas span the matrix on desktop — 20 city links need width. */}
          <details
            data-footer-column
            className="border-b border-primary-fg/10 lg:col-span-5 lg:border-t lg:border-b-0 lg:border-primary-fg/10 lg:pt-8"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between py-3.5 text-sm font-semibold tracking-wide text-primary-fg uppercase [&::-webkit-details-marker]:hidden">
              Service areas
              <span
                aria-hidden
                className="relative size-4 shrink-0 before:absolute before:top-1/2 before:left-0 before:h-px before:w-4 before:-translate-y-1/2 before:bg-primary-fg/60 after:absolute after:top-0 after:left-1/2 after:h-4 after:w-px after:-translate-x-1/2 after:bg-primary-fg/60"
              />
            </summary>
            <div>
              <h2 className="hidden text-sm font-semibold tracking-wide text-primary-fg/60 uppercase lg:block">
                <Link href="/areas" className="hover:text-primary-fg">
                  Service areas
                </Link>
              </h2>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-2 pb-4 text-sm sm:grid-cols-3 lg:mt-4 lg:grid-cols-6 lg:pb-0">
                {coreCities.map((city) => (
                  <li key={city.slug}>
                    <Link
                      href={`/areas/${city.slug}`}
                      className="text-primary-fg/80 transition-colors hover:text-primary-fg"
                    >
                      {city.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/areas" className="font-medium text-primary-fg hover:underline">
                    All 32 areas →
                  </Link>
                </li>
              </ul>
            </div>
          </details>
        </div>

        {/* Back to top — AWS puts one here and it is the right call on a footer this tall. */}
        <div className="mt-10 flex justify-center">
          <a
            href="#main"
            className="inline-flex items-center gap-2 rounded-full border border-primary-fg/20 px-5 py-2 text-sm text-primary-fg/80 transition-colors hover:bg-primary-fg/10 hover:text-primary-fg"
          >
            Back to top
            <ArrowUp className="size-4" aria-hidden />
          </a>
        </div>

        <p className="mt-8 text-center text-xs leading-relaxed text-primary-fg/55">
          {company.licensed.join(" · ")} · {company.warranty}
        </p>
      </Container>

      <div className="border-t border-primary-fg/10">
        <Container className="flex flex-col gap-3 py-5 text-xs text-primary-fg/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            {/* legalName already ends in "Ltd." — do not add a second period. */}
            © {new Date().getFullYear()} {company.legalName} All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-primary-fg/80">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </footer>
  );
}
