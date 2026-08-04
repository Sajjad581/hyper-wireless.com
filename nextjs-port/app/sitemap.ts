import type { MetadataRoute } from "next";
import { posts } from "@aeon/lib/blog/posts";
import { docPages } from "@aeon/lib/docs";
import { SITE_URL } from "@aeon/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/platform`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/workflow`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/pricing`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/docs`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/blog`, changeFrequency: "daily", priority: 0.8 },
    ...docPages.map((d) => ({
      url: `${SITE_URL}/docs/${d.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...posts.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
