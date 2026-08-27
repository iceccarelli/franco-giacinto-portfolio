import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";
import { cities, getCity } from "@/data/areas";

export const alt = "Green Hardwood service area";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return cities.map((c) => ({ city: c.slug }));
}

export default async function Image({ params }: { params: Promise<{ city: string }> }) {
  const { city: slug } = await params;
  const city = getCity(slug);
  return renderOgImage({
    kicker: city?.region ?? "Greater Toronto Area",
    title: `Hardwood floors & stairs in ${city?.name ?? "the GTA"}`,
    meta: "Free on-site measure",
  });
}
