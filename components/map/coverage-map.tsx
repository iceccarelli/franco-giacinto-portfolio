import Link from "next/link";
import { CoverageMapClient } from "@/components/map/coverage-map-client";
import { MapPin } from "lucide-react";
import {
  STUDIO,
  coreCoverage,
  coverage,
  coverageSummary,
  extendedCoverage,
  type CoveragePin,
} from "@/data/coverage";

/**
 * Coverage: a crawlable list, with a map on top of it.
 *
 * The order matters and is deliberate. Everything a search engine or an answer
 * engine can use — the municipality, the tier, the distance, the band, the
 * link — is server-rendered HTML. The Leaflet layer is loaded client-side,
 * only when it scrolls into view, and is marked aria-hidden because it repeats
 * information the list already carries in a form a screen reader can read.
 *
 * Build it the other way round and you get a page that looks impressive and is
 * invisible to every crawler and every assistant — 32 municipalities' worth of
 * local signal locked inside a canvas.
 */

/**
 * No `next/dynamic` with `ssr: false` here — Next 15 forbids that inside a
 * Server Component, and it was never needed. CoverageMapClient renders an
 * empty container on the server and only reaches for Leaflet inside an effect,
 * after an IntersectionObserver says the map is about to be seen.
 *
 * The "use client" boundary already puts it in its own chunk, and the
 * `await import("leaflet")` inside the effect puts the 144 KB library in a
 * second chunk that is fetched on demand. So nothing about the map is on the
 * critical path, and the shared bundle is untouched.
 */

function serialise(p: CoveragePin) {
  return {
    slug: p.city.slug,
    name: p.city.name,
    tier: p.city.tier,
    lat: p.lat,
    lng: p.lng,
    distanceKm: p.distanceKm,
    jobTypeCount: p.jobTypes.length,
    stairLow: p.stairBand.low,
    stairHigh: p.stairBand.high,
    href: `/areas/${p.city.slug}`,
    estimateHref: `/estimate?city=${p.city.slug}&service=hardwood-stairs`,
    note: p.city.typical,
  };
}

export function CoverageMap({ focus, height }: { focus?: string; height?: number }) {
  return (
    <CoverageMapClient
      pins={coverage.map(serialise)}
      studio={{ lat: STUDIO.lat, lng: STUDIO.lng, label: STUDIO.label }}
      focus={focus}
      height={height}
    />
  );
}

/** The list. This is the content; the map above is the decoration. */
export function CoverageList() {
  const groups = [
    {
      key: "core",
      heading: "Core service area",
      note: "Free on-site measure for any qualified hardwood, stair or railing job.",
      pins: coreCoverage,
    },
    {
      key: "extended",
      heading: "We travel here",
      note: "Outside the core radius. Stair packages, whole-home installs and refinishing — not a single-room repair. Saying so is better than taking the enquiry and disappointing someone.",
      pins: extendedCoverage,
    },
  ];

  return (
    <div className="space-y-10">
      {groups.map((group) => (
        <section key={group.key}>
          <h3 className="font-display text-2xl">{group.heading}</h3>
          <p className="mt-2 max-w-2xl text-sm text-muted">{group.note}</p>
          <ul className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {group.pins.map((p) => (
              <li key={p.city.slug}>
                <Link
                  href={`/areas/${p.city.slug}`}
                  className="group flex h-full flex-col rounded-xl border border-border bg-surface p-5 transition-shadow hover:shadow-[var(--shadow-card)]"
                >
                  <p className="text-xs text-accent">{p.city.region}</p>
                  <p className="mt-1 flex items-center gap-1.5 font-display text-xl">
                    <MapPin className="size-4 shrink-0 text-accent" aria-hidden />
                    Hardwood flooring in {p.city.name}
                  </p>
                  <p className="mt-2 flex-1 text-sm text-muted">{p.city.blurb}</p>
                  <p className="mt-3 text-xs text-muted">
                    {p.distanceKm} km from the studio · {p.jobTypes.length} job types taken here
                  </p>
                  <p className="mt-1 text-sm tabular-nums">
                    13-step stair conversion{" "}
                    <span className="font-medium">
                      ${p.stairBand.low.toLocaleString()} – ${p.stairBand.high.toLocaleString()}
                    </span>
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

/**
 * The disclaimer, stated once and rendered near the map.
 *
 * A map pin reads as a record even when nothing says it is one. This says what
 * the pins mean before anyone has to guess.
 */
export function CoverageDisclosure() {
  return (
    <p className="mt-4 max-w-3xl text-sm text-muted">
      {coverageSummary()}{" "}
      <span className="text-fg">
        Bands are computed from the published 2026 rates and this municipality&rsquo;s travel and
        labour multiplier — HST extra, and a firm number follows a moisture reading on site.
      </span>
    </p>
  );
}
