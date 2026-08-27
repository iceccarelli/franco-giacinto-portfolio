import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHero } from "@/components/page-hero";
import { searchDocs, searchSite, type SearchDoc } from "@/lib/search-index";

export const metadata: Metadata = {
  title: "Search",
  description: "Search Green Hardwood services, service areas, guides, species, and projects.",
  alternates: { canonical: "/search" },
  // A results page is not a landing page. Crawlers should follow the links out
  // of it and index those instead.
  robots: { index: false, follow: true },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const results = query ? searchSite(query, 40) : [];

  const grouped = new Map<string, SearchDoc[]>();
  for (const doc of query ? results : searchDocs) {
    const list = grouped.get(doc.kind) ?? [];
    list.push(doc);
    grouped.set(doc.kind, list);
  }

  return (
    <>
      <PageHero
        kicker="Search"
        title={query ? `Results for “${query}”` : "Everything on this site, in one list."}
        lede={
          query
            ? `${results.length} match${results.length === 1 ? "" : "es"} across services, areas, guides, species, and projects.`
            : "Press ⌘K anywhere to search. This page exists so every page is reachable in one hop — for you and for a crawler."
        }
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Search", path: "/search" },
          ]}
        />
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
        {query && results.length === 0 ? (
          <p className="py-10 text-muted">
            Nothing matched. Try a service like{" "}
            <Link href="/services/hardwood-stairs" className="text-primary hover:underline">
              hardwood stairs
            </Link>
            , a city like{" "}
            <Link href="/areas/vaughan" className="text-primary hover:underline">
              Vaughan
            </Link>
            , or browse{" "}
            <Link href="/services" className="text-primary hover:underline">
              all services
            </Link>
            .
          </p>
        ) : (
          <div className="space-y-10">
            {[...grouped.entries()].map(([kind, docs]) => (
              <section key={kind}>
                <h2 className="font-display text-2xl">{kind}</h2>
                <ul className="mt-4 grid gap-3 md:grid-cols-2">
                  {docs.map((doc) => (
                    <li key={doc.id}>
                      <Link
                        href={doc.path}
                        className="block rounded-xl bg-surface p-4 shadow-[var(--shadow-card)] transition-colors hover:bg-bg-warm"
                      >
                        <p className="font-medium text-fg">{doc.title}</p>
                        <p className="mt-1 line-clamp-2 text-sm text-muted">{doc.description}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
