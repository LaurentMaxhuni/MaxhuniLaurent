import type { MetadataRoute } from "next";

import { getPublishedPosts } from "@/lib/blog";
import { projects } from "@/content/portfolio";
import { CORE_SITE_PATHS, absoluteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = CORE_SITE_PATHS.map((pathname) => ({
    url: absoluteUrl(pathname),
    lastModified: new Date("2026-08-27T00:00:00.000Z"),
    changeFrequency: pathname === "/blog" ? "daily" : "monthly",
    priority: pathname === "/" ? 1 : pathname.startsWith("/developers") ? 0.7 : 0.8,
  }));
  const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
    url: absoluteUrl(`/projects/${project.id}`),
    lastModified: new Date("2026-08-27T00:00:00.000Z"),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  try {
    const { docs: posts } = await getPublishedPosts();
    return [
      ...staticPages,
      ...projectPages,
      ...posts.map((post) => ({
        url: absoluteUrl(`/blog/${post.slug}`),
        lastModified: new Date(post.updatedAt),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
    ];
  } catch {
    // The static routes remain discoverable if the CMS is temporarily unavailable.
    return [...staticPages, ...projectPages];
  }
}
