import { company } from "@/data/company";
import { services } from "@/data/services";
import { SITE_URL } from "@/lib/site-url";

/**
 * A real vCard, generated from `data/company.ts`.
 *
 * This is what separates a business card from a picture of a business card.
 * Someone scans the QR on `/card`, taps "Add to contacts", and the shop's name,
 * number, address, hours and website land in their phone — spelled the way this
 * site spells them, which is the same way the Google Business Profile and every
 * directory listing must spell them. A card that has to be retyped is a card
 * that gets retyped wrong.
 *
 * Version 4.0 (RFC 6350). Older iOS and Outlook builds prefer 3.0, but every
 * shipping version of iOS, Android and macOS Contacts has read 4.0 for years,
 * and 4.0 is the one that carries `KIND`, so the card imports as an
 * organisation with a named contact rather than as a person who happens to have
 * a company field.
 */

/** RFC 6350 §3.4: escape backslash, comma, semicolon, and newline. */
function esc(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;")
    .replace(/\r?\n/g, "\\n");
}

/**
 * RFC 6350 §3.2: lines are folded at 75 octets, continuations begin with a
 * single space. Most parsers tolerate long lines; some Outlook builds do not,
 * and a truncated ADR is a wrong address in someone's phone.
 */
function fold(line: string): string {
  if (Buffer.byteLength(line, "utf8") <= 75) return line;
  const out: string[] = [];
  let current = "";
  for (const char of line) {
    if (Buffer.byteLength(current + char, "utf8") > 74) {
      out.push(current);
      current = " ";
    }
    current += char;
  }
  out.push(current);
  return out.join("\r\n");
}

export function buildVCard(): string {
  const [first = "", ...rest] = company.founder.split(" ");
  const last = rest.join(" ");

  const lines = [
    "BEGIN:VCARD",
    "VERSION:4.0",
    "KIND:org",
    `FN:${esc(company.name)}`,
    `N:${esc(last)};${esc(first)};;;`,
    `ORG:${esc(company.legalName)}`,
    `TITLE:${esc(company.founderTitle)}`,
    /**
     * FN is the org name, because "Green Hardwood" is what someone types into
     * their contacts app six months later — not "Franco". So the founder's
     * full name goes in NOTE, where a human reads it, as well as split across
     * N for the importer. Without this he appeared nowhere a person would see.
     */
    `NOTE:${esc(
      `${company.founderFull} — ${company.founderTitle}. ` +
        `${company.tagline} ${company.years}+ years in Toronto and the GTA. ` +
        `${company.licensed.join(", ")}. ${company.warranty}.`,
    )}`,
    `TEL;TYPE=work,voice;VALUE=uri:tel:${company.phone}`,
    `EMAIL;TYPE=work:${company.email}`,
    // ADR is structured: PO;ext;street;locality;region;postcode;country
    `ADR;TYPE=work:;;${esc(company.address.line1)};${esc(company.address.city)};${esc(
      company.address.region,
    )};${esc(company.address.postal)};${esc(company.address.country)}`,
    `GEO:geo:${company.geo.latitude},${company.geo.longitude}`,
    `URL;TYPE=work:${SITE_URL}`,
    `URL;TYPE=profile:${SITE_URL}/card`,
    `PHOTO;MEDIATYPE=image/jpeg:${SITE_URL}/images/franco-giacinto-oller-grimaldi.jpg`,
    `CATEGORIES:${esc(
      ["Hardwood flooring", "Hardwood stairs", "Hardwood railings", "Flooring contractor"].join(","),
    )}`,
    // What the shop does, so a search inside a contacts app finds it.
    `X-SERVICES:${esc(services.map((s) => s.shortName).join(", "))}`,
    `X-HOURS:${esc(company.hoursSummary)}`,
    ...company.sameAs.map((url) => `X-SOCIALPROFILE:${url}`),
    `REV:${new Date().toISOString().replace(/\.\d{3}Z$/, "Z")}`,
    "END:VCARD",
  ];

  // CRLF between lines, per spec. A vCard with bare LF is rejected outright by
  // some Windows importers.
  return lines.map(fold).join("\r\n") + "\r\n";
}
