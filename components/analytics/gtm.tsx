import Script from "next/script";
import { GTM_ID } from "@/lib/analytics";

/**
 * Google Tag Manager, and nothing else.
 *
 * GTM owns GA4. There is deliberately no second gtag.js snippet anywhere in
 * this codebase: two tags on one page means every pageview and every
 * conversion is counted twice, and a doubled conversion count silently
 * corrupts every optimisation decision made after it.
 *
 * Renders nothing at all until NEXT_PUBLIC_GTM_ID is set, so the site ships
 * zero third-party bytes — and needs zero consent banner — until the owner
 * pastes the container ID into Vercel. `afterInteractive` keeps it off the
 * LCP path; a marketing tag has no business competing with the hero image.
 */
export function GoogleTagManager() {
  if (!GTM_ID) return null;

  return (
    <Script id="gtm-init" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
    </Script>
  );
}

/**
 * The <noscript> half of GTM. Belongs immediately after <body>.
 *
 * It exists for the crawler and the no-JS visitor; it fires no dataLayer
 * events, so nothing in the taxonomy depends on it.
 */
export function GoogleTagManagerNoScript() {
  if (!GTM_ID) return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
