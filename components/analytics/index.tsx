import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ClickTracker } from "@/components/analytics/click-tracker";
import { GoogleTagManager, GoogleTagManagerNoScript } from "@/components/analytics/gtm";

export { GoogleTagManagerNoScript };

/**
 * The whole measurement layer, in the order it should load.
 *
 * Three vendors, three jobs, no overlap:
 *
 *   GTM              marketing tags and GA4. Owner-configurable without a
 *                    deploy. Absent until NEXT_PUBLIC_GTM_ID is set.
 *   Vercel Analytics privacy-first pageviews and referrers. No cookie, no
 *                    consent banner, works the day it is deployed — so there
 *                    is real traffic data even before the owner has pasted a
 *                    GTM container in.
 *   Speed Insights   field Core Web Vitals from real GTA phones on real LTE.
 *                    The only honest source for whether the Stage 1 LCP work
 *                    actually landed; a lab Lighthouse score is a guess.
 *
 * ClickTracker is ours: one delegated listener that turns every tel:, sms:,
 * outbound and portfolio click on all 371 pages into a typed dataLayer event.
 */
export function Analytics() {
  return (
    <>
      <GoogleTagManager />
      <ClickTracker />
      <VercelAnalytics />
      <SpeedInsights />
    </>
  );
}
