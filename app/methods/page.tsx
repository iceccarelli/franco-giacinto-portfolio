import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { methods } from "@/data/methods";
import { breadcrumbLd, itemListLd, webPageLd } from "@/lib/seo";

const description =
  "How Green Hardwood actually installs hardwood and builds stairs: nail-down, glue-down, floating, retreads, open risers, and railings, step by step.";

export const metadata: Metadata = {
  title: "Hardwood Installation & Stair Methods",
  description,
  keywords: [
    "hardwood installation methods",
    "nail down vs glue down hardwood",
    "stair retread method",
    "open riser stair construction",
    "hardwood installation process Toronto",
  ],
  alternates: { canonical: "/methods" },
  openGraph: {
    title: "Hardwood Installation & Stair Methods | Green Hardwood",
    description,
    url: "/methods",
  },
};

const clusters = [
  {
    id: "installation",
    label: "Installation",
    blurb: "How the floor is fastened to the building.",
  },
  { id: "stairs", label: "Stairs", blurb: "How a flight is rebuilt, capped, or made new." },
  {
    id: "railings",
    label: "Railings",
    blurb: "How the guard and handrail meet structure and code.",
  },
  { id: "prep", label: "Preparation", blurb: "What happens before a single board is opened." },
] as const;

export default function MethodsIndex() {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Methods", path: "/methods" },
  ];

  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd
        data={webPageLd({
          name: "Hardwood Installation & Stair Methods",
          description,
          path: "/methods",
        })}
      />
      <JsonLd
        data={itemListLd(
          methods.map((m) => ({
            name: m.name,
            path: `/methods/${m.slug}`,
            description: m.summary,
          })),
          "Green Hardwood — installation and stair methods",
        )}
      />

      <PageHero
        kicker="Methods"
        title="The assembly, not the sample. This is how the work is actually done."
        lede="Most hardwood failures are a fastening or a preparation decision, made before anyone chose a colour. These pages document the systems we use, when each one is correct, and — just as important — when it is not."
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Breadcrumbs items={crumbs} />
      </div>

      <div className="mx-auto max-w-6xl space-y-14 px-4 pb-16 sm:px-6">
        {clusters.map((cluster) => {
          const inCluster = methods.filter((m) => m.cluster === cluster.id);
          if (inCluster.length === 0) return null;

          return (
            <section key={cluster.id}>
              <h2 className="font-display text-3xl">{cluster.label}</h2>
              <p className="mt-1 text-muted">{cluster.blurb}</p>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {inCluster.map((m) => (
                  <Link
                    key={m.slug}
                    href={`/methods/${m.slug}`}
                    className="group overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-card)] transition-colors hover:bg-bg-warm"
                  >
                    <img
                      src={m.image}
                      alt={m.imageAlt}
                      loading="lazy"
                      className="aspect-[16/9] w-full object-cover"
                    />
                    <div className="p-5">
                      <h3 className="font-display text-2xl">{m.name}</h3>
                      <p className="mt-1 text-sm text-accent">{m.headline}</p>
                      <p className="mt-2 text-sm text-muted">{m.summary}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        <p className="text-sm text-muted">
          Looking for prices rather than process? The{" "}
          <Link href="/estimate" className="text-primary hover:underline">
            2026 estimator
          </Link>{" "}
          covers every service, and the{" "}
          <Link href="/guides" className="text-primary hover:underline">
            guides
          </Link>{" "}
          go deeper on specification. Terms you do not recognise are in the{" "}
          <Link href="/glossary" className="text-primary hover:underline">
            glossary
          </Link>
          .
        </p>
      </div>
    </>
  );
}
