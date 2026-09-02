"use client";

// Leaflet's stylesheet. Next code-splits it with this component, so it is
// still not on the critical path — it ships when the map does.
import "leaflet/dist/leaflet.css";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { Map as LeafletMap, CircleMarker, Marker } from "leaflet";
import { ChevronDown, Expand, Minus, Plus, RotateCcw, Shrink } from "lucide-react";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * The interactive layer, loaded only when the browser asks for it.
 *
 * Leaflet is ~144 KB of JavaScript plus its stylesheet, which is more than the
 * entire shared bundle this site ships today. It is imported dynamically and
 * only once the map scrolls into view, so a visitor who never reaches the map
 * — or who is on a crawler, or has JavaScript off — pays nothing for it.
 *
 * The list underneath is the real content. This is decoration on top of it.
 *
 * ── The chrome, and why it is React rather than Leaflet controls ──────────
 *
 * Everything overlaid on the tiles — the stats card, the control column, the
 * legend — is ordinary DOM in a sibling layer, not a Leaflet control. Three
 * reasons. It can be styled with the site's own tokens instead of overriding
 * Leaflet's; it renders before Leaflet loads, so the frame does not pop in
 * empty; and it stays in the accessibility tree while the tile canvas below is
 * `aria-hidden`, which is the right split — a legend that names the statuses
 * is readable content, and a field of SVG circles is not.
 *
 * The overlay sits at z-index 650: above Leaflet's marker panes (400–600) and
 * below its popup pane (700), so an open popup is never buried under the
 * legend.
 */

export type MapCityPin = {
  slug: string;
  name: string;
  tier: "core" | "extended";
  lat: number;
  lng: number;
  distanceKm: number;
  jobTypeCount: number;
  stairLow: number;
  stairHigh: number;
  href: string;
  estimateHref: string;
};

export type MapShowcasePin = {
  slug: string;
  title: string;
  summary: string;
  location: string;
  citySlug: string;
  cityName: string;
  categoryLabel: string;
  lat: number;
  lng: number;
  href: string;
};

export type MapStat = { label: string; value: string };

export type MapLegendItem = {
  key: string;
  /** The status name. This is the thing the user asked to see named. */
  label: string;
  /** One clause saying what the status actually means. */
  note: string;
  swatch: "studio" | "core" | "extended" | "showcase";
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function Swatch({ kind }: { kind: MapLegendItem["swatch"] }) {
  const base = "mt-0.5 inline-block size-3 shrink-0 rounded-full";
  if (kind === "studio")
    return <span className={cn(base, "border-[3px] border-primary bg-surface")} aria-hidden />;
  if (kind === "core")
    return <span className={cn(base, "border border-surface bg-primary")} aria-hidden />;
  if (kind === "extended")
    return (
      <span
        className={cn(base, "border border-surface")}
        style={{ background: "var(--color-map-extended)" }}
        aria-hidden
      />
    );
  return <span className={cn(base, "border-2 border-primary bg-surface")} aria-hidden />;
}

export function CoverageMapClient({
  pins,
  studio,
  showcase = [],
  legend,
  stats,
  title,
  subtitle,
  focus,
  height = 520,
  compact = false,
}: {
  pins: MapCityPin[];
  studio: { lat: number; lng: number; label: string };
  showcase?: MapShowcasePin[];
  legend: MapLegendItem[];
  stats: MapStat[];
  title: string;
  subtitle: string;
  /** Slug to centre on. Used by the small locator on a city page. */
  focus?: string;
  height?: number;
  /** Homepage and city-page size: legend starts closed, chrome is trimmed. */
  compact?: boolean;
}) {
  const legendId = useId();
  const wrap = useRef<HTMLDivElement>(null);
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const showcaseMarkers = useRef(new Map<string, Marker | CircleMarker>());
  const resetView = useRef<(() => void) | null>(null);

  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  /*
   * The legend is the most useful thing on the map and the most expensive in
   * space. Open it by default only when there is room: a 380px homepage map or
   * a 280px city locator would be mostly legend, which defeats the point of
   * putting a map there at all.
   */
  const [legendOpen, setLegendOpen] = useState(!compact && height >= 400);
  const [fullscreen, setFullscreen] = useState(false);

  // Only start loading Leaflet when the map is actually about to be seen.
  useEffect(() => {
    const node = el.current;
    if (!node || visible) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [visible]);

  useEffect(() => {
    if (!visible || !el.current || map.current) return;
    let cancelled = false;

    (async () => {
      try {
        const L = (await import("leaflet")).default;
        if (cancelled || !el.current) return;

        const focused = focus ? pins.find((p) => p.slug === focus) : undefined;
        const instance = L.map(el.current, {
          center: focused ? [focused.lat, focused.lng] : [43.72, -79.55],
          zoom: focused ? 10 : 8,
          scrollWheelZoom: false, // never hijack a page scroll
          zoomControl: false, // replaced by the styled control column
          attributionControl: true,
        });
        map.current = instance;

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 17,
          // Required by the OpenStreetMap tile usage policy. Do not remove.
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(instance);

        const icon = (className: string, html: string) =>
          L.divIcon({ className, html, iconSize: [28, 28], iconAnchor: [14, 14] });

        // ── Coverage discs ────────────────────────────────────────────────
        for (const p of pins) {
          const core = p.tier === "core";
          const marker = L.marker([p.lat, p.lng], {
            icon: icon(
              `gh-marker gh-marker--${core ? "core" : "extended"}`,
              '<span class="gh-marker__dot"></span>',
            ),
            keyboard: false,
            title: p.name,
            zIndexOffset: core ? 100 : 0,
          }).addTo(instance);

          marker.bindPopup(
            `<div class="gh-pop">
               <p class="gh-pop__eyebrow">${core ? "Core service area" : "Extended range"}</p>
               <p class="gh-pop__title">${escapeHtml(p.name)}</p>
               <p class="gh-pop__meta">${p.distanceKm} km from the Sterling Road studio · ${p.jobTypeCount} job types taken here</p>
               <div class="gh-pop__band"><strong>13-step stair conversion</strong><br>$${p.stairLow.toLocaleString()} – $${p.stairHigh.toLocaleString()}<br><span style="opacity:.7">2026 band · HST extra · not a quote</span></div>
               <a class="gh-pop__cta" href="${p.estimateHref}">Price a job in ${escapeHtml(p.name)}</a>
               <a class="gh-pop__secondary" href="${p.href}">Everything we do in ${escapeHtml(p.name)}</a>
             </div>`,
          );
          marker.on("popupopen", () =>
            track({ event: "stair_studio_click", location: `map:${p.slug}` }),
          );
        }

        // ── Worked examples: hollow, pulsing, municipality-level ───────────
        const byCity = new Map<string, MapShowcasePin[]>();
        for (const s of showcase) {
          byCity.set(s.citySlug, [...(byCity.get(s.citySlug) ?? []), s]);
        }

        for (const [citySlug, group] of byCity) {
          const first = group[0];
          if (!first) continue;
          const count = group.length;
          const marker = L.marker([first.lat, first.lng], {
            icon: icon(
              "gh-marker gh-marker--showcase",
              `<span class="gh-marker__pulse"></span><span class="gh-marker__ring"></span>${
                count > 1 ? `<span class="gh-marker__count">${count}</span>` : ""
              }`,
            ),
            keyboard: false,
            title: `${count} worked example${count > 1 ? "s" : ""} — ${first.cityName}`,
            zIndexOffset: 500,
          }).addTo(instance);

          const body = group
            .map(
              (s) =>
                `<div style="margin-top:8px">
                   <p class="gh-pop__eyebrow">${escapeHtml(s.categoryLabel)}</p>
                   <p class="gh-pop__title">${escapeHtml(s.title)}</p>
                   <p class="gh-pop__meta">${escapeHtml(s.summary)}</p>
                   <a class="gh-pop__cta" href="${s.href}">Open this job</a>
                 </div>`,
            )
            .join("");

          marker.bindPopup(
            `<div class="gh-pop">
               <p class="gh-pop__eyebrow">Worked example${count > 1 ? `s · ${count}` : ""}</p>
               <p class="gh-pop__title">${escapeHtml(first.cityName)}</p>
               ${body}
               <p class="gh-pop__meta" style="margin-top:10px;font-size:11px">Pinned at the municipality centre. A specification we build to — not a client record.</p>
             </div>`,
            { maxWidth: 280 },
          );
          marker.on("popupopen", () =>
            track({ event: "portfolio_job_open", slug: `map:${citySlug}` }),
          );
          showcaseMarkers.current.set(citySlug, marker);
        }

        // ── The shop itself ───────────────────────────────────────────────
        L.marker([studio.lat, studio.lng], {
          icon: icon("gh-marker gh-marker--studio", '<span class="gh-marker__dot"></span>'),
          keyboard: false,
          title: "The studio",
          zIndexOffset: 900,
        })
          .addTo(instance)
          .bindPopup(
            `<div class="gh-pop">
               <p class="gh-pop__eyebrow">Studio &amp; workshop</p>
               <p class="gh-pop__title">${escapeHtml(studio.label)}</p>
               <p class="gh-pop__meta">Stair components are built here, then fitted on site. Every drive starts from this door.</p>
               <a class="gh-pop__cta" href="/contact">Book a site visit</a>
             </div>`,
          );

        // Frame every pin, so nobody has to hunt for the service area.
        const bounds = pins.map((p) => [p.lat, p.lng] as [number, number]);
        const fit = () => {
          if (focused) instance.setView([focused.lat, focused.lng], 10);
          else if (bounds.length) instance.fitBounds(bounds, { padding: [34, 34] });
        };
        resetView.current = fit;
        if (!focused) fit();
        setReady(true);
      } catch {
        // Tiles blocked, offline, a browser Leaflet does not support. The
        // list below is the content; the map was never load-bearing.
        if (!cancelled) setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
      showcaseMarkers.current.clear();
      resetView.current = null;
      map.current?.remove();
      map.current = null;
    };
  }, [visible, pins, studio, focus, showcase]);

  // Fullscreen: the browser's own, so Escape works and nothing is trapped.
  useEffect(() => {
    const onChange = () => {
      const active = document.fullscreenElement === wrap.current;
      setFullscreen(active);
      // Leaflet caches the container size; without this the tiles stay the
      // old shape and half the viewport is grey.
      window.setTimeout(() => map.current?.invalidateSize(), 120);
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void wrap.current?.requestFullscreen?.();
  }, []);

  const flyToShowcase = useCallback((citySlug: string) => {
    const marker = showcaseMarkers.current.get(citySlug);
    const instance = map.current;
    if (!marker || !instance) return;
    instance.flyTo(marker.getLatLng(), 11, { duration: 0.8 });
    window.setTimeout(() => marker.openPopup(), 850);
  }, []);

  if (failed) return null;

  const controlClass =
    "flex size-9 items-center justify-center rounded-lg border border-border bg-surface/95 text-fg shadow-sm backdrop-blur transition-colors hover:bg-bg-warm disabled:opacity-40";

  return (
    <div
      ref={wrap}
      style={{ ["--map-h" as string]: `${height}px` }}
      className={cn(
        "relative w-full overflow-hidden rounded-xl border border-border bg-bg-warm",
        "h-[min(var(--map-h),60vh)]",
        fullscreen && "h-screen max-h-none rounded-none",
      )}
    >
      {/*
        The tile canvas. Hidden from assistive technology on purpose: every
        fact it draws is also server-rendered as text, and a screen reader
        reading 32 unlabelled SVG nodes is worse than silence.
      */}
      <div ref={el} className="absolute inset-0" aria-hidden="true" />

      <div className="pointer-events-none absolute inset-0 z-[650] flex min-h-0 flex-col justify-between gap-3 p-3 sm:p-4">
        <div className="flex shrink-0 items-start justify-between gap-3">
          <div className="pointer-events-auto max-w-[min(20rem,72%)] rounded-xl border border-border bg-surface/95 px-3.5 py-3 shadow-[var(--shadow-card)] backdrop-blur">
            <p className="text-xs font-medium tracking-[0.14em] text-accent uppercase">{subtitle}</p>
            <p className="mt-1 font-display text-base leading-snug sm:text-lg">{title}</p>
            <dl className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="text-[11px] text-muted">{s.label}</dt>
                  <dd className="font-display text-lg leading-none tabular-nums">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="pointer-events-auto flex flex-col gap-1.5">
            <button
              type="button"
              className={controlClass}
              onClick={() => map.current?.zoomIn()}
              disabled={!ready}
              aria-label="Zoom in"
            >
              <Plus className="size-4" aria-hidden />
            </button>
            <button
              type="button"
              className={controlClass}
              onClick={() => map.current?.zoomOut()}
              disabled={!ready}
              aria-label="Zoom out"
            >
              <Minus className="size-4" aria-hidden />
            </button>
            <button
              type="button"
              className={controlClass}
              onClick={() => resetView.current?.()}
              disabled={!ready}
              aria-label="Reset the view to the whole service area"
            >
              <RotateCcw className="size-4" aria-hidden />
            </button>
            <button
              type="button"
              className={controlClass}
              onClick={toggleFullscreen}
              disabled={!ready}
              aria-label={fullscreen ? "Exit full screen" : "View the map full screen"}
            >
              {fullscreen ? (
                <Shrink className="size-4" aria-hidden />
              ) : (
                <Expand className="size-4" aria-hidden />
              )}
            </button>
          </div>
        </div>

        <div className="pointer-events-auto flex min-h-0 w-full max-w-sm flex-col rounded-xl border border-border bg-surface/95 shadow-[var(--shadow-card)] backdrop-blur">
          <button
            type="button"
            onClick={() => setLegendOpen((o) => !o)}
            aria-expanded={legendOpen}
            className="flex w-full shrink-0 items-center justify-between gap-3 px-3.5 py-2.5 text-left"
          >
            <span className="text-sm font-medium">
              Legend
              {showcase.length > 0 && (
                <span className="ml-1.5 text-muted">
                  · {showcase.length} worked example{showcase.length > 1 ? "s" : ""}
                </span>
              )}
            </span>
            <ChevronDown
              className={cn("size-4 shrink-0 transition-transform", legendOpen && "rotate-180")}
              aria-hidden
            />
          </button>

          {legendOpen && (
            <div className="min-h-0 flex-1 overflow-y-auto border-t border-border px-3.5 py-3">
              <ul className="space-y-2">
                {legend.map((item) => (
                  <li key={item.key} className="flex gap-2.5">
                    <Swatch kind={item.swatch} />
                    <span className="text-xs leading-snug">
                      <span className="font-medium">{item.label}</span>
                      <span className="text-muted"> — {item.note}</span>
                    </span>
                  </li>
                ))}
              </ul>

              {showcase.length > 0 && (
                <>
                  {/*
                    A control, not content. Clicking one flies the map to its
                    municipality and opens the popup.

                    It deliberately does NOT repeat the strip's heading. The
                    legend is server-rendered whenever it starts open, so an
                    identical heading put the same nine names in the document
                    twice and a screen reader read the list through twice —
                    once as disabled buttons, once as links. Different verb,
                    different job, and the strip below stays the canonical
                    place those names are linked from.
                  */}
                  <p
                    id={`${legendId}-jump`}
                    className="mt-3.5 border-t border-border pt-3 text-[11px] font-medium tracking-[0.12em] text-accent uppercase"
                  >
                    Jump the map to
                  </p>
                  <ul className="mt-2 space-y-1" aria-labelledby={`${legendId}-jump`}>
                    {showcase.map((s) => (
                      <li key={s.slug}>
                        <button
                          type="button"
                          onClick={() => flyToShowcase(s.citySlug)}
                          disabled={!ready}
                          className="w-full rounded-md px-1.5 py-1 text-left text-xs transition-colors hover:bg-bg-warm disabled:opacity-50"
                        >
                          <span className="font-medium">{s.title}</span>
                          <span className="block text-muted">
                            {s.categoryLabel} · {s.location}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
