import type { Metadata } from "next";
import { type ReactNode } from "react";
import { QuoteForm } from "@/components/estimate/quote-form";
import { PageHero } from "@/components/page-hero";
import { company } from "@/data/company";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Call Green Hardwood at (416) 847-3366 or book a free hardwood, stair, or railing site visit. Sterling Road studio, Toronto. Serving the whole GTA.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact | Green Hardwood",
    description:
      "Call Green Hardwood at (416) 847-3366 or book a free hardwood, stair, or railing site visit in the Greater Toronto Area.",
    url: "/contact",
  },
};

export default function ContactPage() {
  const maps = `https://www.google.com/maps?q=${encodeURIComponent(
    `${company.address.line1}, ${company.address.city} ${company.address.region} ${company.address.postal}`,
  )}`;

  return (
    <>
      <PageHero
        kicker="Contact"
        title="Call the shop. Or send the job and we will call you."
        lede="Sterling Road studio, Toronto. We measure across the GTA. Sunday is by appointment because stairs do not respect weekends, but crews do."
      />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2">
        <div>
          <dl className="space-y-5">
            <Item label="Phone">
              <a className="text-primary hover:underline" href={`tel:${company.phone}`}>
                {company.phoneDisplay}
              </a>
            </Item>
            <Item label="Email">
              <a className="text-primary hover:underline" href={`mailto:${company.email}`}>
                {company.email}
              </a>
            </Item>
            <Item label="Studio">
              {company.address.line1}
              <br />
              {company.address.city}, {company.address.region} {company.address.postal}
              <br />
              <a
                className="text-sm text-accent hover:underline"
                href={maps}
                target="_blank"
                rel="noreferrer"
              >
                Open in maps
              </a>
            </Item>
            <Item label="Hours">{company.hoursSummary}</Item>
            <Item label="Coverage">{company.areaServed}</Item>
          </dl>
          <img
            src="/images/service-install.jpg"
            alt="Hardwood installation in progress with white oak planks and a pneumatic nailer."
            className="mt-8 aspect-[16/10] w-full rounded-xl object-cover"
          />
        </div>
        <div className="rounded-xl bg-surface p-6 shadow-[var(--shadow-card)] sm:p-8">
          <h2 className="font-display text-2xl">Request a site visit</h2>
          <p className="mt-2 mb-6 text-sm text-muted">
            Tell us the city, the service, and whether the stair is involved. It usually is.
          </p>
          <QuoteForm />
        </div>
      </div>
    </>
  );
}

function Item({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-xs tracking-[0.16em] text-muted uppercase">{label}</dt>
      <dd className="mt-1">{children}</dd>
    </div>
  );
}
