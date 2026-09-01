"use client";

// Leaflet's stylesheet. Next code-splits it with this component, so it is
// still not on the critical path — it ships when the map does.
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap } from "leaflet";
import { track } from "@/lib/analytics";

/**
 * The interactive layer, loaded only when the browser asks for it.
 *
 * Leaflet is ~144 KB of JavaScript plus its stylesheet, which is more than the
 * entire shared bundle this site ships today. It is imported dynamically and
 * only once the map scrolls into view, so a visitor who never reaches the map
 * — or who is on a crawler, or has JavaScript off — pays nothing for it.
 *
 * The list underneath is the real content. This is decoration on top of it.
 */

type Serialisable = {
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
  note: string;
};

export function CoverageMapClient({
  pins,
  studio,
  focus,
  height = 520,
}: {
  pins: Serialisable[];
  studio: { lat: number; lng: number; label: string };
  /** Slug to centre on. Used by the small locator on a city page. */
  focus?: string;
  height?: number;
}) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const [visible, setVisible] = useState(false);
  const [failed, setFailed] = useState(false);

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
          attributionControl: true,
        });
        map.current = instance;

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 17,
          // Required by the OpenStreetMap tile usage policy. Do not remove.
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(instance);

        // The shop itself.
        L.circleMarker([studio.lat, studio.lng], {
          radius: 9,
          weight: 3,
          color: "#1B3A2A",
          fillColor: "#ffffff",
          fillOpacity: 1,
        })
          .addTo(instance)
          .bindPopup(
            `<strong>The studio</strong><br>${studio.label}<br><span style="opacity:.7">Every drive starts here.</span>`,
          );

        for (const p of pins) {
          const core = p.tier === "core";
          const marker = L.circleMarker([p.lat, p.lng], {
            radius: core ? 8 : 6,
            weight: 2,
            color: core ? "#1B3A2A" : "#8A6A3B",
            fillColor: core ? "#1B3A2A" : "#8A6A3B",
            fillOpacity: core ? 0.75 : 0.4,
          }).addTo(instance);

          marker.bindPopup(
            `<div style="min-width:210px">
               <strong style="font-size:15px">${p.name}</strong>
               <div style="margin-top:2px;opacity:.7">${core ? "Core service area" : "Extended — we travel"} · ${p.distanceKm} km from the studio</div>
               <div style="margin-top:8px"><strong>13-step stair conversion</strong><br>$${p.stairLow.toLocaleString()} – $${p.stairHigh.toLocaleString()}<br>
                 <span style="opacity:.7">2026 band · HST extra · not a quote</span></div>
               <div style="margin-top:8px">${p.jobTypeCount} job types taken here</div>
               <div style="margin-top:8px;opacity:.7;font-size:11px">Service coverage — not a record of past jobs.</div>
               <div style="margin-top:10px">
                 <a href="${p.href}">${p.name} page</a> · <a href="${p.estimateHref}">Price it</a>
               </div>
             </div>`,
          );
          marker.on("popupopen", () =>
            track({ event: "stair_studio_click", location: `map:${p.slug}` }),
          );
        }

        // Frame every pin, so nobody has to hunt for the service area.
        if (!focused) {
          instance.fitBounds(
            pins.map((p) => [p.lat, p.lng] as [number, number]),
            { padding: [28, 28] },
          );
        }
      } catch {
        // Tiles blocked, offline, a browser Leaflet does not support. The
        // list below is the content; the map was never load-bearing.
        if (!cancelled) setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
    };
  }, [visible, pins, studio, focus]);

  if (failed) return null;

  return (
    <div
      ref={el}
      // 520px is a lot of a 667px phone screen. The CSS variable lets the
      // stylesheet drop it at narrow widths without the component knowing.
      style={{ ["--map-h" as string]: `${height}px` }}
      className="h-[min(var(--map-h),60vh)] w-full overflow-hidden rounded-xl border border-border bg-bg-warm"
      aria-hidden="true"
    />
  );
}
