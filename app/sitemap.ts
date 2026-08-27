import type { MetadataRoute } from "next";
import { cities } from "@/data/areas";
import { company } from "@/data/company";
import { guides } from "@/data/guides";
import { services } from "@/data/services";

const BASE = company.website;

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
  { path: "/showroom", priority: 0.8, changeFrequency: "monthly" },
  { path: "/areas", priority: 0.8, changeFrequency: "monthly" },
  { path: "/guides", priority: 0.75, changeFrequency: "weekly" },
  { path: "/compare", priority: 0.7, changeFrequency: "monthly" },
  { path: "/process", priority: 0.7, changeFrequency: "monthly" },
  { path: "/emergency", priority: 0.7, changeFrequency: "monthly" },
  { path: "/trade", priority: 0.65, changeFrequency: "monthly" },
  { path: "/care", priority: 0.6, changeFrequency: "monthly" },
  { path: "/warranty", priority: 0.6, changeFrequency: "yearly" },
  { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
  { path: "/about", priority: 0.6, changeFrequency: "yearly" },
  { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
  { path: "/for-agents", priority: 0.5, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
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
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
  ];
}
