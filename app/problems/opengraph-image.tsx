import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Diagnose a hardwood floor or stair problem";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    kicker: "Diagnose",
    title: "Something is wrong with the floor.",
    meta: "Cause · Outlook · When to call",
  });
}
