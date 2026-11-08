import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "", priority: 1, changeFrequency: "weekly" as const },
    { path: "/menu", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/pre-order", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/visit", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/story", priority: 0.5, changeFrequency: "monthly" as const },
  ];
  return pages.map((p) => ({
    url: `${siteUrl}${p.path}`,
    lastModified: new Date(),
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));
}
