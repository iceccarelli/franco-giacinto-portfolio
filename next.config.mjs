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
      // Legacy portfolio-site URLs -> the hardwood service architecture.
      { source: "/work", destination: "/portfolio", permanent: true },
      { source: "/services/hardwood-sanding", destination: "/services/sanding-refinishing", permanent: true },
      { source: "/services/hardwood-refinishing", destination: "/services/sanding-refinishing", permanent: true },
      { source: "/services/hardwood-finishing", destination: "/services/sanding-refinishing", permanent: true },
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
        ],
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
