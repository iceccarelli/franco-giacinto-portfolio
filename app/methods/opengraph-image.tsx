import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Green Hardwood installation and stair methods";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    kicker: "Methods",
    title: "The assembly, not the sample.",
    meta: "Installation · Stairs · Railings · Prep",
  });
}
