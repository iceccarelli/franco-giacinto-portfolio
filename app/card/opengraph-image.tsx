import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";
import { company } from "@/data/company";

export const alt = `${company.founderFull}, ${company.founderTitle} at ${company.name}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    kicker: "Contact card",
    title: company.founderFull,
    meta: `${company.founderTitle} · ${company.phoneDisplay}`,
  });
}
