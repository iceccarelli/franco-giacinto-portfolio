import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";
import { getService, services } from "@/data/services";

export const alt = "Green Hardwood service";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  return renderOgImage({
    kicker: service?.shortName ?? "Service",
    title: service?.name ?? "Hardwood services",
    meta: service?.priceFrom,
  });
}
