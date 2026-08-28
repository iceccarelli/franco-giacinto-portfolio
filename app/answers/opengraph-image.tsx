import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Hardwood questions, answered";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    kicker: "Answers",
    title: "Straight answers on stairs and installation.",
    meta: "Toronto & the GTA",
  });
}
