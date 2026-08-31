"use client";

import { useEffect } from "react";
import { track, type AnalyticsEvent } from "@/lib/analytics";

/**
 * One delegated listener for every outbound, phone, SMS, portfolio and
 * download click on the site.
 *
 * The alternative — an onClick on each link — was rejected on purpose. There
 * are tel: links in the utility bar, the header, the mobile bar, the footer,
 * the estimate sidebar, the success state, the 404, every city page and every
 * one of the 224 matrix pages. Instrumenting them individually means ~500 edit
 * sites, a client component boundary pushed into server-rendered chrome that
 * currently ships no JavaScript, and a permanent gap the day someone adds link
 * 501 and forgets. Delegation instruments all of them, including the ones not
 * written yet, from a single 2 KB island.
 *
 * `capture: true` so the event is recorded before any handler can stop
 * propagation, and before the browser leaves the page on a tel: navigation.
 */
export function ClickTracker() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement | null)?.closest?.("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href") ?? "";
      if (!href) return;

      const where = locationOf(anchor);
      const event = classify(href, anchor, where);
      if (event) track(event);
    }

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}

/**
 * Where on the page the click happened, as a coarse, stable label.
 *
 * Explicit `data-track-location` wins — the chrome components set it. Anything
 * else falls back to the nearest landmark, so a link inside prose still
 * reports "main" rather than an empty string, and no click is silently
 * attributed to nowhere.
 */
function locationOf(anchor: HTMLElement): string {
  const tagged = anchor.closest<HTMLElement>("[data-track-location]");
  if (tagged) return tagged.dataset.trackLocation ?? "unknown";

  if (anchor.closest("[data-mobile-cta]")) return "mobile_bar";
  if (anchor.closest("header")) return "header";
  if (anchor.closest("footer")) return "footer";
  if (anchor.closest("form")) return "form";
  if (anchor.closest("main")) return "main";
  return "unknown";
}

function classify(
  href: string,
  anchor: HTMLAnchorElement,
  location: string,
): AnalyticsEvent | null {
  if (href.startsWith("tel:")) return { event: "tel_click", location };
  if (href.startsWith("sms:")) return { event: "sms_click", location };

  // Downloads: an explicit download attribute, or a document extension.
  if (anchor.hasAttribute("download") || /\.(pdf|vcf|zip)(\?|$)/i.test(href)) {
    return { event: "file_download", file: fileNameOf(href) };
  }

  if (/^https?:/i.test(href)) {
    const host = safeHost(href);
    if (!host) return null;
    if (host.endsWith("instagram.com")) return { event: "outbound_instagram", location };
    // Every shape a Google Business Profile link takes.
    if (
      host === "g.page" ||
      host.endsWith("google.com") ||
      host.endsWith("goo.gl") ||
      host.endsWith("business.site")
    ) {
      return { event: "outbound_gbp", location };
    }
    return null;
  }

  // Internal routes worth naming.
  if (href === "/stairs" || href.startsWith("/stairs?") || href.startsWith("/stairs#")) {
    return { event: "stair_studio_click", location };
  }

  // Both shapes: a future /portfolio/{slug} route, and the anchor form the
  // job catalogue uses today against the single filtered grid.
  const job = /^\/portfolio(?:\/|#)([^/?#]+)/.exec(href);
  if (job?.[1]) return { event: "portfolio_job_open", slug: job[1] };

  return null;
}

function safeHost(href: string): string | null {
  try {
    return new URL(href, window.location.origin).hostname.toLowerCase();
  } catch {
    return null;
  }
}

function fileNameOf(href: string): string {
  const clean = href.split(/[?#]/)[0] ?? href;
  return clean.slice(clean.lastIndexOf("/") + 1) || clean;
}
