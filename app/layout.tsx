import type { Metadata, Viewport } from "next";
import { Figtree, Fraunces } from "next/font/google";
import "./globals.css";
import { SiteShell } from "@/components/layout/site-shell";
import { JsonLd } from "@/components/json-ld";
import { company } from "@/data/company";
import { localBusinessLd, websiteLd } from "@/lib/seo";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-figtree",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(company.website),
  title: {
    default: "Hardwood Flooring & Stairs Toronto | Green Hardwood",
    template: "%s | Green Hardwood",
  },
  description:
    "Hardwood floor installation, custom hardwood stairs, railings, sanding and refinishing across Toronto and the GTA. Free on-site estimates.",
  applicationName: company.name,
  authors: [{ name: company.legalName, url: company.website }],
  creator: company.legalName,
  publisher: company.legalName,
  keywords: [
    "hardwood flooring Toronto",
    "hardwood installation GTA",
    "hardwood stairs Toronto",
    "hardwood stair installation",
    "oak stair treads GTA",
    "carpet to hardwood stairs",
    "hardwood railings Toronto",
    "dust free sanding Toronto",
    "hardwood refinishing Mississauga",
    "hardwood floor repair GTA",
    "hardwood buffing and recoating",
    "Green Hardwood",
  ],
  category: "Home improvement",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: company.website,
    siteName: company.name,
    title: "Hardwood Flooring, Stairs & Railings in Toronto | Green Hardwood",
    description: company.description,
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Green Hardwood — hardwood flooring and stairs in the Greater Toronto Area",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Green Hardwood — Hardwood Floors, Stairs & Railings",
    description: company.tagline,
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: { icon: "/favicon.svg", apple: "/favicon.svg" },
  other: {
    "geo.region": "CA-ON",
    "geo.placename": "Toronto",
    "geo.position": `${company.geo.latitude};${company.geo.longitude}`,
    ICBM: `${company.geo.latitude}, ${company.geo.longitude}`,
  },
};

export const viewport: Viewport = {
  themeColor: "#1B3A2A",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-CA"
      className={`${figtree.variable} ${fraunces.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="alternate" type="text/plain" href="/llms.txt" title="llms.txt" />
        <link rel="author" href="/humans.txt" />
      </head>
      <body>
        <JsonLd data={localBusinessLd()} />
        <JsonLd data={websiteLd()} />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
