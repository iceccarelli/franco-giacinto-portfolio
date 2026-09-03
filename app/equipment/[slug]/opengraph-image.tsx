import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";
import { equipment, getEquipment } from "@/data/equipment";

export const alt = "Green Hardwood equipment";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return equipment.map((e) => ({ slug: e.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getEquipment(slug);

  return renderOgImage({
    kicker: "Equipment",
    title: item?.name ?? "Machinery & tooling",
    meta: item?.without.instead ?? "What the work actually requires",
  });
}
