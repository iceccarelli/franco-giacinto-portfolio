import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Green Hardwood stair studio";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    kicker: "Stair studio",
    title: "Build the flight. Check the Ontario code.",
    meta: "Hardwood stairs · Toronto & GTA",
  });
}
