import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Green Hardwood machinery and tooling";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    kicker: "Machinery & tooling",
    title: "The machines you never see decide the floor you end up with.",
    meta: "Sanding · Dust · Measurement · Installation · Finishing · Stairs",
  });
}
