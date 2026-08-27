import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Green Hardwood — hardwood floors, stairs, and railings in Toronto & the GTA";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    kicker: "Toronto · GTA · Southern Ontario",
    title: "Hardwood floors. Hardwood stairs. One shop.",
  });
}
