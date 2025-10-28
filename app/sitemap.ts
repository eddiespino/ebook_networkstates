import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString().split("T")[0];

  return [
    {
      url: siteConfig.url,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 1.0,
    },
    {
      url: `${siteConfig.url}/audiobook`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.95, // Alta prioridad - contenido principal
    },
    {
      url: `${siteConfig.url}/read`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.95, // Alta prioridad - contenido principal
    },
  ];
}
