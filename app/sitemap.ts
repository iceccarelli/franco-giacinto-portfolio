import type { MetadataRoute } from "next";
import { answers } from "@/data/answers";
import { catalog } from "@/data/catalog";
import { cities } from "@/data/areas";
import { SITE_URL } from "@/lib/site-url";
import { guides, updatedDate } from "@/data/guides";
import { methods } from "@/data/methods";
import { problems } from "@/data/problems";
import { matrixPages } from "@/data/matrix";
import { services } from "@/data/services";

const BASE = SITE_URL;

/**
 * Priority reflects commercial intent, not vanity.
 * Stairs and installation are the niche we intend to own, so they sit at the top
 * alongside the homepage. City pages carry the local long tail.
 */
const staticRoutes: {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/stairs", priority: 0.95, changeFrequency: "weekly" },
  { path: "/services", priority: 0.9, changeFrequency: "monthly" },
  { path: "/estimate", priority: 0.9, changeFrequency: "monthly" },
  { path: "/portfolio", priority: 0.8, changeFrequency: "weekly" },
  { path: "/catalog", priority: 0.85, changeFrequency: "monthly" },
  { path: "/showroom", priority: 0.8, changeFrequency: "monthly" },
  { path: "/areas", priority: 0.8, changeFrequency: "monthly" },
  { path: "/guides", priority: 0.75, changeFrequency: "weekly" },
  { path: "/methods", priority: 0.85, changeFrequency: "monthly" },
  { path: "/answers", priority: 0.8, changeFrequency: "weekly" },
  { path: "/problems", priority: 0.85, changeFrequency: "monthly" },
  { path: "/glossary", priority: 0.7, changeFrequency: "monthly" },
  { path: "/compare", priority: 0.7, changeFrequency: "monthly" },
  { path: "/process", priority: 0.7, changeFrequency: "monthly" },
  { path: "/emergency", priority: 0.7, changeFrequency: "monthly" },
  { path: "/trade", priority: 0.65, changeFrequency: "monthly" },
  { path: "/care", priority: 0.6, changeFrequency: "monthly" },
  { path: "/warranty", priority: 0.6, changeFrequency: "yearly" },
  { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
  { path: "/about", priority: 0.6, changeFrequency: "yearly" },
  { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
  { path: "/card", priority: 0.7, changeFrequency: "yearly" },
  { path: "/for-agents", priority: 0.5, changeFrequency: "monthly" },
  { path: "/llms.txt", priority: 0.5, changeFrequency: "weekly" },
  { path: "/llms-full.txt", priority: 0.4, changeFrequency: "weekly" },
  { path: "/ai.txt", priority: 0.4, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  /**
   * Build time, used for pages whose content genuinely does change with every
   * deploy because it is generated from `data/`. Guides get their own date
   * from `updatedDate()` instead — stamping one identical timestamp on every
   * URL tells a crawler nothing, and Google discounts a `lastmod` it cannot
   * corroborate against the page.
   */
  const lastModified = new Date();

  return [
    ...staticRoutes.map((r) => ({
      url: `${BASE}${r.path}`,
      lastModified,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    })),
    ...services.map((s) => ({
      url: `${BASE}/services/${s.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      // The two money services outrank the rest of the catalogue.
      priority: s.slug === "hardwood-stairs" || s.slug === "hardwood-installation" ? 0.95 : 0.85,
    })),
    ...cities.map((c) => ({
      url: `${BASE}/areas/${c.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...guides.map((g) => ({
      url: `${BASE}/guides/${g.slug}`,
      // The one route type with a real per-page revision date. Use it.
      lastModified: updatedDate(g),
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
    ...methods.map((m) => ({
      url: `${BASE}/methods/${m.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: m.cluster === "stairs" || m.cluster === "installation" ? 0.8 : 0.7,
      images: [`${BASE}${m.image}`],
    })),
    ...problems.map((p) => ({
      url: `${BASE}/problems/${p.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: p.category === "stairs" ? 0.8 : 0.75,
    })),
    // The job catalogue. Priority sits with the money services: these pages
    // carry the specification and the failure modes, which is what both a
    // buyer and an answer engine are actually looking for.
    ...catalog.map((c) => ({
      url: `${BASE}/catalog/${c.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: c.category === "stairs" ? 0.85 : 0.75,
    })),
    ...answers.map((a) => ({
      url: `${BASE}/answers/${a.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: a.featured ? 0.7 : 0.6,
    })),
    // Service × city. These sit just below their parent service page: they are
    // the long-tail capture layer, not the canonical description of the service.
    ...matrixPages.map((p) => ({
      url: `${BASE}${p.path}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: p.service.slug === "hardwood-stairs" ? 0.8 : 0.7,
      images: [`${BASE}${p.service.image}`],
    })),
  ];
}
