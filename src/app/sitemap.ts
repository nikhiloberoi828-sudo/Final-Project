import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://final-project-em3w.onrender.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${siteUrl}/destinations`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/accommodation`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/gallery`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/how-to-reach`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/nai-raahein`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/cancel-booking`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${siteUrl}/privacy-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/terms-of-use`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/sitemap`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
  ];

  const districts = [
    "Shimla", "Kullu", "Kangra", "Chamba", "Kinnaur",
    "Lahaul & Spiti", "Mandi", "Solan", "Hamirpur", "Bilaspur",
  ];

  const districtRoutes: MetadataRoute.Sitemap = districts.map((d) => ({
    url: `${siteUrl}/destinations?district=${encodeURIComponent(d)}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const categories = ["trek", "adventure", "lake", "pilgrimage", "offbeat", "cultural", "hill-station"];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${siteUrl}/destinations?cat=${c}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...districtRoutes, ...categoryRoutes];
}
