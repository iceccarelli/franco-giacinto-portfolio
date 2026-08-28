import Link from "next/link";
import { Phone } from "lucide-react";
import { company } from "@/data/company";
import { utilityLinks } from "@/data/navigation";

/**
 * The thin dark strip above the logo — AWS's top bar, in this company's terms.
 *
 * Secondary destinations and the two facts a hardwood customer wants before
 * anything else: are you open, and what is the number. Hidden below `lg`,
 * where the same links appear at the top of the mobile drawer instead, so the
 * information architecture is identical at every width.
 */
export function UtilityBar() {
  return (
    <div className="hidden bg-primary text-primary-fg lg:block">
      <div className="mx-auto flex h-9 max-w-6xl items-center justify-between px-4 text-xs sm:px-6">
        <p className="text-primary-fg/70">
          {company.hoursSummary} · {company.address.city}, {company.address.region}
        </p>
        <nav aria-label="Secondary" className="flex items-center gap-1">
          {utilityLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded px-2 py-1 text-primary-fg/75 transition-colors hover:bg-primary-fg/10 hover:text-primary-fg"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={`tel:${company.phone}`}
            className="ml-1 inline-flex items-center gap-1.5 rounded px-2 py-1 font-medium text-primary-fg transition-colors hover:bg-primary-fg/10"
          >
            <Phone className="size-3.5" aria-hidden />
            {company.phoneDisplay}
          </a>
        </nav>
      </div>
    </div>
  );
}
