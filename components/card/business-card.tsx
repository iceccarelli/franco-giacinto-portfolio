import { Mail, MapPin, Phone } from "lucide-react";
import { LogoMark } from "@/components/logo";
import { QR } from "@/components/qr";
import { company } from "@/data/company";
import { SITE_URL } from "@/lib/site-url";

/**
 * The business card. One component, two renderings.
 *
 * On screen it is a pair of cards at a readable size. On paper — `@media print`
 * in globals.css — it becomes two 3.5in x 2in rectangles, the North American
 * standard, so `/card` is genuinely printable rather than a web page that
 * happens to be shaped like a card.
 *
 * Everything on it comes from `data/company.ts`. A card that disagrees with the
 * website about the phone number is worse than no card, and the only reliable
 * way to prevent that is to give them one source.
 */

const CARD_FRAME =
  "print-card relative flex flex-col justify-between overflow-hidden rounded-xl " +
  "aspect-[7/4] w-full max-w-[26rem] p-6 shadow-[var(--shadow-card)]";

export function CardFront() {
  return (
    <div className={`${CARD_FRAME} bg-primary text-primary-fg`}>
      <div className="flex items-start justify-between">
        <LogoMark className="size-9 text-moss" />
        <p className="text-right text-[0.625rem] leading-tight tracking-[0.16em] text-primary-fg/55 uppercase">
          Est. 2011
          <br />
          Toronto
        </p>
      </div>

      <div>
        <p className="font-display text-2xl leading-none font-medium">
          Green <span className="font-semibold">Hardwood</span>
        </p>
        <p className="mt-1.5 text-[0.8125rem] leading-snug text-primary-fg/70">
          Hardwood floors · Stairs · Railings
        </p>
      </div>

      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-display text-base leading-tight">{company.founder}</p>
          <p className="text-[0.6875rem] text-primary-fg/60">{company.founderTitle}</p>
        </div>
        <a
          href={`tel:${company.phone}`}
          className="font-display text-lg leading-none whitespace-nowrap"
        >
          {company.phoneDisplay}
        </a>
      </div>
    </div>
  );
}

export function CardBack() {
  return (
    <div className={`${CARD_FRAME} border border-border bg-surface text-fg`}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1.5 text-[0.8125rem] leading-snug">
          <p className="flex items-start gap-2">
            <MapPin className="mt-0.5 size-3.5 shrink-0 text-accent" aria-hidden />
            <span>
              {company.address.line1}
              <br />
              {company.address.city}, {company.address.region} {company.address.postal}
            </span>
          </p>
          <p className="flex items-center gap-2">
            <Phone className="size-3.5 shrink-0 text-accent" aria-hidden />
            <a href={`tel:${company.phone}`}>{company.phoneDisplay}</a>
          </p>
          <p className="flex items-center gap-2">
            <Mail className="size-3.5 shrink-0 text-accent" aria-hidden />
            <a href={`mailto:${company.email}`}>{company.email}</a>
          </p>
        </div>

        {/* Scans to /card, not to the homepage: whoever scans it lands on the
            page with the "add to contacts" button rather than on a hero. */}
        <QR
          value={`${SITE_URL}/card`}
          title="Scan for Green Hardwood contact details"
          className="block w-[4.5rem] shrink-0 [&>svg]:w-full"
        />
      </div>

      {/* Fits the on-screen card; at 3.5in x 2in it pushes the footer off the
          card, so print drops it. The services are on the site the QR points to. */}
      <p data-card-services className="text-[0.6875rem] leading-snug text-fg/70">
        Installation · Custom stairs · Railings · Sanding &amp; refinishing · Repairs · Decks
      </p>

      <div className="border-t border-border pt-2.5">
        <p data-card-credentials className="text-[0.625rem] leading-relaxed text-muted">
          {company.licensed.join(" · ")}
        </p>
        <p className="mt-1 flex items-baseline justify-between gap-3 text-[0.6875rem]">
          <span className="font-medium text-primary">greenhardwood.ca</span>
          <span className="text-muted">{company.hoursSummary}</span>
        </p>
      </div>
    </div>
  );
}
