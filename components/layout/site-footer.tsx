import Link from "next/link";
import { Logo } from "@/components/logo";
import { company } from "@/data/company";
import { cities } from "@/data/areas";
import { services } from "@/data/services";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-primary text-primary-fg">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo invert />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-primary-fg/75">
            {company.tagline} Serving Toronto and the Greater Toronto Area for {company.years}+
            years.
          </p>
          <p className="mt-4 text-sm text-primary-fg/80">
            {company.address.line1}
            <br />
            {company.address.city}, {company.address.region} {company.address.postal}
            <br />
            <a className="underline-offset-2 hover:underline" href={`tel:${company.phone}`}>
              {company.phoneDisplay}
            </a>
            <br />
            <a className="underline-offset-2 hover:underline" href={`mailto:${company.email}`}>
              {company.email}
            </a>
          </p>
          <p className="mt-3 text-xs text-primary-fg/60">{company.hoursSummary}</p>
        </div>
        <div>
          <h2 className="font-display text-sm tracking-wide text-primary-fg/60 uppercase">
            Services
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            {services.slice(0, 8).map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="text-primary-fg/80 hover:text-primary-fg"
                >
                  {s.shortName}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-display text-sm tracking-wide text-primary-fg/60 uppercase">
            Service areas
          </h2>
          <ul className="mt-4 columns-2 space-y-2 text-sm">
            {cities.map((c) => (
              <li key={c.slug} className="break-inside-avoid">
                <Link
                  href={`/areas/${c.slug}`}
                  className="text-primary-fg/80 hover:text-primary-fg"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-display text-sm tracking-wide text-primary-fg/60 uppercase">
            Company
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/stairs" className="text-primary-fg/80 hover:text-primary-fg">
                Stair studio
              </Link>
            </li>
            <li>
              <Link href="/showroom" className="text-primary-fg/80 hover:text-primary-fg">
                Showroom
              </Link>
            </li>
            <li>
              <Link href="/compare" className="text-primary-fg/80 hover:text-primary-fg">
                Hardwood vs vinyl
              </Link>
            </li>
            <li>
              <Link href="/process" className="text-primary-fg/80 hover:text-primary-fg">
                Process
              </Link>
            </li>
            <li>
              <Link href="/warranty" className="text-primary-fg/80 hover:text-primary-fg">
                Warranty
              </Link>
            </li>
            <li>
              <Link href="/trade" className="text-primary-fg/80 hover:text-primary-fg">
                Trade
              </Link>
            </li>
            <li>
              <Link href="/emergency" className="text-primary-fg/80 hover:text-primary-fg">
                Water damage
              </Link>
            </li>
            <li>
              <Link href="/care" className="text-primary-fg/80 hover:text-primary-fg">
                Floor care
              </Link>
            </li>
            <li>
              <Link href="/guides" className="text-primary-fg/80 hover:text-primary-fg">
                Guides
              </Link>
            </li>
            <li>
              <Link href="/faq" className="text-primary-fg/80 hover:text-primary-fg">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/for-agents" className="text-primary-fg/80 hover:text-primary-fg">
                For AI agents
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-primary-fg/80 hover:text-primary-fg">
                Contact
              </Link>
            </li>
          </ul>
          <p className="mt-6 text-xs leading-relaxed text-primary-fg/55">
            WSIB covered · Liability insured · Bona Certified Craftsman · Work follows NWFA
            guidelines · {company.warranty}
          </p>
        </div>
      </div>
      <div className="border-t border-primary-fg/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-primary-fg/50 sm:flex-row sm:justify-between sm:px-6">
          <p>
            © {new Date().getFullYear()} {company.legalName}. All rights reserved.
          </p>
          <p>Hardwood flooring · Stairs · Railings · Toronto & GTA</p>
        </div>
      </div>
    </footer>
  );
}
