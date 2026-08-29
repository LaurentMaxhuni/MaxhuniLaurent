import type { MetadataRoute } from "next";

import { getPublishedPosts } from "@/lib/blog";
import { projects } from "@/content/portfolio";
import { INDEXABLE_SITE_PATHS, SITE_URL, absoluteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function sitemapUrl(pathname: string): string {
  return pathname === "/" ? SITE_URL : absoluteUrl(pathname);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = INDEXABLE_SITE_PATHS.map((pathname) => ({
    url: sitemapUrl(pathname),
    changeFrequency: pathname === "/blog" ? "daily" : "monthly",
    priority: pathname === "/" ? 1 : pathname.startsWith("/developers") ? 0.7 : 0.8,
  }));
  const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
    url: absoluteUrl(`/projects/${project.id}`),
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
