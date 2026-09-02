import Link from "next/link";
import { MapPin } from "lucide-react";
import {
  CoverageMapClient,
  type MapCityPin,
  type MapLegendItem,
  type MapShowcasePin,
  type MapStat,
} from "@/components/map/coverage-map-client";
import {
  STUDIO,
  coreCoverage,
  coverage,
  coverageSummary,
  extendedCoverage,
  type CoveragePin,
} from "@/data/coverage";
import { getService } from "@/data/services";
import {
  SHOWCASE_DISCLOSURE,
  serviceShowcaseCategory,
  showcase,
  showcaseCategoryLabel,
  type ShowcasePin,
} from "@/data/showcase";

/**
 * Coverage: a crawlable list, with a map on top of it.
 *
 * The order matters and is deliberate. Everything a search engine or an answer
 * engine can use — the municipality, the tier, the distance, the band, the
 * link — is server-rendered HTML. The Leaflet layer is loaded client-side,
 * only when it scrolls into view, and the tile canvas is marked aria-hidden
 * because it repeats information the list already carries in a form a screen
 * reader can read.
 *
 * Build it the other way round and you get a page that looks impressive and is
 * invisible to every crawler and every assistant — 32 municipalities' worth of
 * local signal locked inside a canvas.
 *
 * ── Filtering ─────────────────────────────────────────────────────────────
 *
 * Pass `serviceSlug` and the map narrows to that department: the stairs page
 * shows the municipalities where stair work is taken and the stair worked
 * examples, the installation page shows install, and so on. The filter reads
 * `CatalogEntry.serviceSlug` off the job types each municipality is actually
 * offered, so an extended town that only justifies the drive for a package
 * drops off the repairs map by itself. That is the same commercial position
 * `tierNote()` states in prose — the map cannot contradict the copy because
 * both are computed from the same field.
 */

/**
 * No `next/dynamic` with `ssr: false` here — Next 15 forbids that inside a
 * Server Component, and it was never needed. CoverageMapClient renders an
 * empty container on the server and only reaches for Leaflet inside an effect,
 * after an IntersectionObserver says the map is about to be seen.
 */

function serialise(p: CoveragePin): MapCityPin {
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
  };
}

function serialiseShowcase(s: ShowcasePin): MapShowcasePin {
  return {
    slug: s.slug,
    title: s.title,
    summary: s.summary,
    location: s.location,
    citySlug: s.citySlug,
    cityName: s.cityName,
    categoryLabel: showcaseCategoryLabel[s.category],
    lat: s.lat,
    lng: s.lng,
    href: s.href,
  };
}

/**
 * The legend, written out.
 *
 * Every status has a name and a clause saying what it means, because a colour
 * key that reads "green / bronze / ring" tells a homeowner nothing. The fourth
 * status is the one that has to be worded carefully: a hollow ring is a
 * specification we build to, pinned at the centre of a municipality, and the
 * wording says so rather than letting a pin imply a job on someone's street.
 */
function legendFor(hasShowcase: boolean): MapLegendItem[] {
  const items: MapLegendItem[] = [
    {
      key: "studio",
      label: "Studio & workshop",
      note: "Sterling Road. Stair components are built here, then fitted on site.",
      swatch: "studio",
    },
    {
      key: "core",
      label: "Core service area",
      note: "Free on-site measure for any qualified hardwood, stair or railing job.",
      swatch: "core",
    },
    {
      key: "extended",
      label: "Extended range",
      note: "We travel here for stair packages, whole-home installs and refinishing — not a single-room repair.",
      swatch: "extended",
    },
  ];

  if (hasShowcase) {
    items.push({
      key: "showcase",
      label: "Worked example",
      note: "A specification we build to, pinned at the municipality centre. Not a client record and not an address.",
      swatch: "showcase",
    });
  }

  return items;
}

/**
 * Which worked examples belong on one particular map. One rule, used by both
 * the map and the crawlable strip beneath it, so they can never disagree.
 *
 * `focus` narrows to that municipality. Without it, a locator centred on
 * Barrie drew nine pulsing rings, none of them in Barrie and none of them
 * explained anywhere on the page — a ring reads as a claim, and an unexplained
 * ring reads as a claim about the town you are looking at.
 */
function shownShowcase({ serviceSlug, focus }: { serviceSlug?: string; focus?: string }) {
  const service = serviceSlug ? getService(serviceSlug) : undefined;
  const category = service ? serviceShowcaseCategory[service.slug] : undefined;

  let shown = showcase;
  if (service) shown = category ? shown.filter((s) => s.category === category) : [];
  if (focus) shown = shown.filter((s) => s.citySlug === focus);
  return shown;
}

export function CoverageMap({
  focus,
  height,
  serviceSlug,
  compact,
}: {
  focus?: string;
  height?: number;
  /** Narrow the map to one published service. Omit for the whole network. */
  serviceSlug?: string;
  compact?: boolean;
}) {
  const service = serviceSlug ? getService(serviceSlug) : undefined;

  const matched = service
    ? coverage.filter((p) => p.jobTypes.some((j) => j.serviceSlug === service.slug))
    : coverage;
  /**
   * `custom-inlays` has no catalogue archetype yet, so a strict filter would
   * empty the map rather than narrow it. An empty map is a worse answer than
   * the whole network, so fall back — and the caption below still names only
   * the worked examples that belong to this service.
   */
  const pins = matched.length > 0 ? matched : coverage;

  const shown = shownShowcase({ serviceSlug, focus });

  const core = pins.filter((p) => p.city.tier === "core").length;
  const stats: MapStat[] = [
    { label: "Municipalities", value: String(pins.length) },
    { label: "Core", value: String(core) },
    { label: "We travel", value: String(pins.length - core) },
  ];
  if (shown.length > 0) {
    stats.push({ label: "Worked examples", value: String(shown.length) });
  }

  return (
    <CoverageMapClient
      pins={pins.map(serialise)}
      studio={{ lat: STUDIO.lat, lng: STUDIO.lng, label: STUDIO.label }}
      showcase={shown.map(serialiseShowcase)}
      legend={legendFor(shown.length > 0)}
      stats={stats}
      subtitle={service ? service.shortName : "Service network"}
      title={
        service
          ? `${service.name} across the GTA`
          : "Where we work, and what we take on there"
      }
      focus={focus}
      height={height}
      compact={compact}
    />
  );
}

/**
 * The worked examples, named, in server-rendered HTML.
 *
 * The legend inside the map names them too, but that legend is client-side —
 * it does not exist for a crawler, and it does not exist with JavaScript off.
 * This strip is the same information as real links, which is also what turns
 * every service page into an internal link into the nine job pages.
 */
export function MapWorkedExamples({
  serviceSlug,
  focus,
}: {
  serviceSlug?: string;
  focus?: string;
}) {
  const shown = shownShowcase({ serviceSlug, focus });

  if (shown.length === 0) return null;

  return (
    <div className="mt-4">
      <h3 className="text-xs font-medium tracking-[0.14em] text-accent uppercase">
        Worked examples on this map
      </h3>
      <ul className="mt-2 flex flex-wrap gap-x-2 gap-y-1.5 text-sm">
        {shown.map((s, i) => (
          <li key={s.slug} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden className="text-border">·</span>}
            <Link href={s.href} className="text-primary hover:underline">
              {s.title}
            </Link>
            <span className="text-muted">
              {showcaseCategoryLabel[s.category]}, {s.location}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-2 max-w-3xl text-xs text-muted">{SHOWCASE_DISCLOSURE}</p>
    </div>
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
