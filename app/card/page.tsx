import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Download, Mail, MapPin, Navigation, Phone } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { Photo } from "@/components/photo";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CardBack, CardFront } from "@/components/card/business-card";
import { PrintButton } from "@/components/card/print-button";
import { Button } from "@/components/ui/button";
import { company } from "@/data/company";
import { services, priceBandOf } from "@/data/services";
import { coreCities, cities } from "@/data/areas";
import { breadcrumbLd, clampDescription, personLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site-url";

const DESCRIPTION = clampDescription(
  `${company.founderFull}, ${company.founderTitle} at ${company.name} — hardwood floors, ` +
    `stairs and railings in Toronto and the GTA. Phone ${company.phoneDisplay}. ` +
    `Save the contact card, get directions, or book a free measure.`,
);

export const metadata: Metadata = {
  title: `${company.founder} — Green Hardwood contact card`,
  description: DESCRIPTION,
  alternates: { canonical: "/card" },
  openGraph: {
    title: `${company.founder}, ${company.founderTitle} | ${company.name}`,
    description: DESCRIPTION,
    url: "/card",
    type: "profile",
  },
  other: {
    // Some contact managers and share sheets look for this.
    "profile:first_name": company.founder.split(" ")[0] ?? "",
    "profile:last_name": company.founder.split(" ").slice(1).join(" "),
  },
};

export default function CardPage() {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Contact card", path: "/card" },
  ];

  const maps = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${company.address.line1}, ${company.address.city} ${company.address.region} ${company.address.postal}`,
  )}`;

  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      {/*
        ProfilePage, not WebPage. This is the canonical page for the person, and
        `mainEntity` points at the SAME @id the About page already publishes
        (`/about#franco`) rather than minting a second Person node — two Person
        nodes for one man is exactly the entity fragmentation that stops an
        assistant resolving a small company to a real business.
      */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          "@id": `${SITE_URL}/card#profile`,
          url: `${SITE_URL}/card`,
          name: `${company.founderFull} — ${company.name}`,
          description: DESCRIPTION,
          inLanguage: "en-CA",
          isPartOf: { "@id": `${SITE_URL}/#website` },
          about: { "@id": `${SITE_URL}/#business` },
          mainEntity: { "@id": `${SITE_URL}/about#franco` },
          primaryImageOfPage: {
            "@type": "ImageObject",
            url: `${SITE_URL}/images/franco-giacinto-oller-grimaldi.jpg`,
          },
          significantLink: [
            `${SITE_URL}/card.vcf`,
            `${SITE_URL}/about`,
            `${SITE_URL}/estimate`,
            `${SITE_URL}/services/hardwood-stairs`,
          ],
        }}
      />
      <JsonLd data={personLd()} />

      <section className="border-b border-border bg-bg-warm print:hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Breadcrumbs items={crumbs} className="pt-4" />
        </div>
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-6 pb-12 sm:px-6 sm:pb-16 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-xs font-medium tracking-[0.18em] text-accent uppercase">
              Contact card
            </p>
            <h1 className="mt-3 font-display text-4xl leading-[1.08] font-medium sm:text-5xl">
              {company.founderFull}
            </h1>
            <p className="mt-2 font-display text-xl text-accent">{company.founderTitle}</p>
            <p className="mt-4 max-w-prose text-lg text-muted">
              {company.years} years on the tools in Toronto and the Greater Toronto Area.
              Floors, stairs and railings out of one shop, under one warranty.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              {/* A real download, not a mailto. On a phone this opens the
                  contact sheet with everything already filled in. */}
              <Button asChild>
                <a href="/card.vcf" download="green-hardwood.vcf">
                  <Download className="size-4" aria-hidden />
                  Save to contacts
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href={`tel:${company.phone}`}>
                  <Phone className="size-4" aria-hidden />
                  {company.phoneDisplay}
                </a>
              </Button>
            </div>

            <dl className="mt-8 space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                <div>
                  <dt className="sr-only">Studio</dt>
                  <dd>
                    {company.address.line1}
                    <br />
                    {company.address.city}, {company.address.region} {company.address.postal}
                    <br />
                    <a
                      href={maps}
                      rel="noopener noreferrer"
                      target="_blank"
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      <Navigation className="size-3.5" aria-hidden />
                      Directions
                    </a>
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                <div>
                  <dt className="sr-only">Email</dt>
                  <dd>
                    <a href={`mailto:${company.email}`} className="hover:underline">
                      {company.email}
                    </a>
                  </dd>
                </div>
              </div>
            </dl>
          </div>

          <Photo
            src="/images/franco-giacinto-oller-grimaldi.jpg"
            alt={`${company.founderFull}, ${company.founderTitle} at ${company.name}, in the Sterling Road workshop.`}
            ratio="4/5"
            slot="half"
            priority
            className="mx-auto w-full max-w-sm rounded-xl shadow-[var(--shadow-card)]"
          />
        </div>
      </section>

      {/* The card itself. Printable at 3.5in x 2in — see globals.css. */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 print:p-0">
        <div className="flex items-baseline justify-between gap-4 print:hidden">
          <h2 className="font-display text-2xl">The card</h2>
          <p className="text-sm text-muted">
            Prints at 3.5&Prime; × 2&Prime; — the standard size.
          </p>
        </div>
        <div className="print-cards mt-6 grid gap-6 sm:grid-cols-2 print:mt-0 print:gap-0">
          <CardFront />
          <CardBack />
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 print:hidden">
          <PrintButton />
          <Button asChild variant="outline">
            <a href="/card.vcf" download="green-hardwood.vcf">
              <Download className="size-4" aria-hidden />
              Download vCard
            </a>
          </Button>
          <span className="text-sm text-muted">
            Printed at true size on any home printer. Card stock optional.
          </span>
        </div>
      </section>

      <section className="border-t border-border bg-surface print:hidden">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-3">
          <div>
            <h2 className="font-display text-xl">What we do</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="group flex justify-between gap-4">
                    <span className="text-fg group-hover:underline">{s.shortName}</span>
                    <span className="shrink-0 text-right text-muted">{priceBandOf(s.slug)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-xl">Where we work</h2>
            <p className="mt-4 text-sm text-muted">
              {cities.length} cities across the GTA and Southern Ontario. Free on-site measure
              across the {coreCities.length} core areas:
            </p>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
              {coreCities.slice(0, 12).map((c) => (
                <li key={c.slug}>
                  <Link href={`/areas/${c.slug}`} className="text-fg hover:underline">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm">
              <Link href="/areas" className="inline-flex items-center gap-1 text-primary hover:underline">
                All {cities.length} areas
                <ArrowRight className="size-3.5" aria-hidden />
              </Link>
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">Credentials</h2>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              {company.licensed.map((c) => (
                <li key={c}>{c}</li>
              ))}
              <li>{company.warranty}</li>
            </ul>
            <p className="mt-6 text-sm text-muted">{company.hoursSummary}</p>
            <Button asChild className="mt-5">
              <Link href="/estimate">Book a free measure</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
