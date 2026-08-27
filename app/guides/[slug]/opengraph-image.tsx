import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";
import { getGuide, guides } from "@/data/guides";

export const alt = "Green Hardwood guide";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  return renderOgImage({
    kicker: guide?.kicker ?? "Guide",
    title: guide?.title ?? "Hardwood guides",
    meta: guide ? `Updated ${guide.updated}` : undefined,
  });
}
