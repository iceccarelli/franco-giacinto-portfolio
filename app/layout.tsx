import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  metadataBase: new URL("https://franco-giacinto-portfolio.vercel.app"),
  title: "Franco Giacinto Oller Grimaldi — Master Hardwood Flooring Craftsman | Toronto & GTA",
  description:
    "Heritage hardwood, modern precision. Franco Giacinto delivers bespoke hardwood installation, refinishing, custom inlays, staircase renovation, and dust-free sanding across the Greater Toronto Area.",
  keywords: [
    "hardwood flooring Toronto",
    "custom hardwood installation GTA",
    "floor refinishing",
    "staircase renovation",
    "dust-free sanding",
    "Franco Giacinto",
    "luxury flooring",
    "Bona certified craftsman",
  ],
  openGraph: {
    title: "Franco Giacinto — Master Hardwood Flooring Craftsman",
    description:
      "Bespoke hardwood installation, refinishing, and custom inlays for luxury residential and commercial spaces across the GTA.",
    url: "https://franco-giacinto-portfolio.vercel.app",
    siteName: "Franco Giacinto Flooring",
    locale: "en_CA",
    type: "website",
    images: [{ url: "/portrait.jpg", width: 800, height: 1000, alt: "Franco Giacinto" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Franco Giacinto — Master Hardwood Flooring Craftsman",
    description: "Heritage hardwood. Modern precision. Serving Toronto & GTA since 2009.",
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Franco Giacinto Flooring",
  description:
    "Master hardwood flooring craftsman specializing in bespoke installation, refinishing, custom inlays, staircase renovation, and dust-free sanding across the Greater Toronto Area.",
  url: "https://franco-giacinto-portfolio.vercel.app",
  image: "https://franco-giacinto-portfolio.vercel.app/portrait.jpg",
  telephone: "+1-416-555-0199",
  email: "franco@fghardwood.ca",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Toronto",
    addressRegion: "ON",
    addressCountry: "CA",
  },
  areaServed: [
    "Toronto", "Mississauga", "Oakville", "Vaughan", "Markham",
    "Richmond Hill", "Etobicoke", "Scarborough", "Brampton", "Burlington",
  ],
  priceRange: "$$-$$$",
  openingHours: "Mo-Sa 07:00-18:00",
  sameAs: ["https://www.instagram.com/francogiacinto/"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <footer className="site-footer">
          <div className="footer-inner">
            <div className="footer-brand">
              <span className="footer-monogram">FG</span>
              <p className="footer-tagline">Heritage Hardwood. Modern Precision.</p>
            </div>
            <div className="footer-links">
              <div className="footer-col">
                <h4>Services</h4>
                <a href="#about">Installation</a>
                <a href="#about">Refinishing</a>
                <a href="#about">Staircases</a>
                <a href="#about">Custom Inlays</a>
              </div>
              <div className="footer-col">
                <h4>Company</h4>
                <a href="#portfolio">Portfolio</a>
                <a href="#experience">Experience</a>
                <a href="#certifications">Certifications</a>
                <a href="#contact">Contact</a>
              </div>
              <div className="footer-col">
                <h4>Connect</h4>
                <a href="https://www.instagram.com/francogiacinto/" target="_blank" rel="noopener noreferrer">Instagram</a>
                <a href="mailto:franco@fghardwood.ca">Email</a>
                <a href="tel:+14165550199">Phone</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>Crafted with passion since 2009 &middot; Franco Giacinto Oller Grimaldi</p>
            <p className="footer-copy">&copy; {new Date().getFullYear()} FG Hardwood Flooring. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
