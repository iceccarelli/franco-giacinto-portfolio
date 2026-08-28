import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";
import { getProblem, problems, problemTitle } from "@/data/problems";

export const alt = "Hardwood floor or stair diagnosis";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return problems.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const problem = getProblem(slug);
  return renderOgImage({
    kicker: "Diagnose",
    title: problem ? problemTitle(problem) : "Hardwood diagnostics",
    meta: "Cause · Outlook · When to call",
  });
}
