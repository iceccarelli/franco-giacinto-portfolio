import type { MetadataRoute } from "next";
import { company } from "@/data/company";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${company.name} — Hardwood Floors, Stairs & Railings`,
    short_name: company.shortName,
    description: company.description,
    start_url: "/",
    display: "standalone",
    background_color: "#f3eee6",
    theme_color: "#1b3a2a",
    lang: "en-CA",
    categories: ["business", "home improvement", "construction"],
    icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
