/**
 * Content-Security-Policy, report-only first.
 *
 * Stage 1 ships this as Content-Security-Policy-Report-Only so a week of real
 * traffic can surface anything the policy would break before it breaks it.
 * After ~7 clean days, flip CSP_ENFORCE to true — same policy, enforcing
 * header — in its own PR.
 *
 * The analytics origins (googletagmanager, google-analytics, Vercel
 * scripts/vitals) are allowed now so Stage 2's measurement layer lands
 * without a CSP change. 'unsafe-inline' on style-src is required by Tailwind's
 * inlined critical styles and Next's style hydration; scripts stay 'self' +
 * the named origins.
 */
const CSP_ENFORCE = false;

const CSP_POLICY = [
  "default-src 'self'",
  // Already permissive enough for OpenStreetMap raster tiles; named here so
  // the dependency is visible rather than incidental.
  "img-src 'self' data: blob: https:",
  "script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://va.vercel-scripts.com",
  "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://vitals.vercel-insights.com",
  "style-src 'self' 'unsafe-inline'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [420, 640, 828, 1080, 1200, 1600, 1920],
  },
  async redirects() {
    return [
      /**
       * One host, one entity: www → apex, 308, path and query preserved.
       * The apex is the canonical (matches every canonical tag and JSON-LD
       * @id on the site). middleware.ts repeats this for any path its
       * matcher covers; this rule catches everything else, media included.
       */
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.greenhardwood.ca" }],
        destination: "https://greenhardwood.ca/:path*",
        permanent: true,
      },
      // Legacy portfolio-site URLs -> the hardwood service architecture.
      { source: "/work", destination: "/portfolio", permanent: true },
      {
        source: "/services/hardwood-sanding",
        destination: "/services/sanding-refinishing",
        permanent: true,
      },
      {
        source: "/services/hardwood-refinishing",
        destination: "/services/sanding-refinishing",
        permanent: true,
      },
      {
        source: "/services/hardwood-finishing",
        destination: "/services/sanding-refinishing",
        permanent: true,
      },
      { source: "/services/stairs", destination: "/services/hardwood-stairs", permanent: true },
      { source: "/services/railings", destination: "/services/hardwood-railings", permanent: true },
      { source: "/stairs-toronto", destination: "/stairs", permanent: true },
      { source: "/quote", destination: "/estimate", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        /**
         * greenhardwood.ca is the only host that may enter an index.
         *
         * The meta-level noindex in lib/site-url.ts only covers
         * VERCEL_ENV=preview. The production deployment is ALSO reachable at
         * its own *.vercel.app alias, where VERCEL_ENV is "production" — same
         * bytes, second host, and it has been observed serving
         * "index, follow". A crawler that indexes it splits the entity in
         * two. This header closes that hole for every *.vercel.app host,
         * previews included, without touching the canonical domain.
         */
        source: "/:path*",
        has: [{ type: "host", value: "(?<host>.*\\.vercel\\.app)" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          /**
           * Two years, subdomains, preload-list eligible. The site is
           * HTTPS-only on Vercel; there is no HTTP variant to protect.
           */
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          /**
           * This site never asks for the camera, the microphone, or a
           * location. Saying so explicitly stops any embedded third-party
           * from asking on its behalf.
           */
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: CSP_ENFORCE ? "Content-Security-Policy" : "Content-Security-Policy-Report-Only",
            value: CSP_POLICY,
          },
        ],
      },
      /**
       * Vercel serves every prerendered page and static asset with
       * `Access-Control-Allow-Origin: *`. Measured on production:
       *
       *   /stairs   x-vercel-cache: PRERENDER   access-control-allow-origin: *
       *   /search   (function-rendered)         no CORS header at all
       *
       * It is platform behaviour for static file serving, not a rule anyone
       * configured — an earlier commit in this repo blamed a Vercel dashboard
       * setting, which was wrong. It also means middleware cannot remove it:
       * `response.headers.delete()` runs before the CDN attaches its own, and
       * the local test that appeared to prove otherwise was vacuous, because
       * `next start` never sets the header in the first place.
       *
       * A header declared here IS compiled into the build output's routing
       * config, which is the layer that can actually override the default.
       * Scoped by negative lookahead so the agent surfaces keep their `*` —
       * they are meant to be cross-origin readable and now set it themselves
       * via agentText()/agentJson().
       *
       * Same-origin rather than absent: `headers()` can only set a value, not
       * unset one. Naming our own origin makes the page unreadable from any
       * other origin, which is the point.
       */
      {
        source:
          "/((?!api/|_next/|images/|videos/|ai\\.txt|llms\\.txt|llms-full\\.txt|feed\\.xml|card\\.vcf|\\.well-known/).*)",
        headers: [{ key: "Access-Control-Allow-Origin", value: "https://greenhardwood.ca" }],
      },
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/videos/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
