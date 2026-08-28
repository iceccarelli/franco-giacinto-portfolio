import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";
import { getMethod, methods } from "@/data/methods";

export const alt = "Green Hardwood method";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return methods.map((m) => ({ slug: m.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const method = getMethod(slug);
  return renderOgImage({
    kicker: method ? `${method.cluster} method` : "Method",
    title: method?.name ?? "Hardwood methods",
    meta: "How the work is actually done",
  });
}
