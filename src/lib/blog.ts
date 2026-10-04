import config from "@payload-config";
import { getPayload, type PaginatedDocs } from "payload";
import { cache } from "react";

import { builtInPosts } from "@/content/posts";
import type { Post } from "../../payload-types";
import { createBlogSource, PublishedPostsUnavailableError } from "./blog-source.mjs";

function hasConfiguredDatabase() {
  const value = process.env.DATABASE_URI?.trim();
  if (!value) return false;

  try {
    const databaseURL = new URL(value);
    const hostname = databaseURL.hostname.toLowerCase();

    return (
      (databaseURL.protocol === "postgres:" || databaseURL.protocol === "postgresql:") &&
      hostname.length > 0 &&
      !/^(host|your-host|your-endpoint|example\.com)$/.test(hostname)
    );
  } catch {
    return false;
  }
}

const source = createBlogSource({
  isConfigured: hasConfiguredDatabase,
  getPayload: async () => getPayload({ config }),
  onFailure: (reason) => console.error(`[blog] Public content service unavailable (${reason}).`),
});

type PublishedPostsOptions = {
  limit?: number;
  page?: number;
};

function postDate(post: Post) {
  return new Date(post.publishedAt ?? post.createdAt).getTime();
}

function mergePublishedPosts(cmsPosts: Post[]) {
  const postsBySlug = new Map(builtInPosts.map((post) => [post.slug, post]));

  for (const post of cmsPosts) {
    postsBySlug.set(post.slug, post);
  }

  return [...postsBySlug.values()].sort((first, second) => postDate(second) - postDate(first));
}

function paginatePosts(posts: Post[], limit: number, page: number): PaginatedDocs<Post> {
  const normalizedLimit = Math.max(1, Math.min(100, Math.floor(Number(limit) || 10)));
  const normalizedPage = Math.max(1, Math.floor(Number(page) || 1));
  const totalDocs = posts.length;
  const totalPages = totalDocs === 0 ? 0 : Math.ceil(totalDocs / normalizedLimit);
  const start = (normalizedPage - 1) * normalizedLimit;

  return {
    docs: posts.slice(start, start + normalizedLimit),
    hasNextPage: normalizedPage < totalPages,
    hasPrevPage: normalizedPage > 1 && totalDocs > 0,
    limit: normalizedLimit,
    nextPage: normalizedPage < totalPages ? normalizedPage + 1 : null,
    page: normalizedPage,
    pagingCounter: totalDocs === 0 ? 1 : start + 1,
    prevPage: normalizedPage > 1 ? normalizedPage - 1 : null,
    totalDocs,
    totalPages,
  };
}

async function getCmsPosts() {
  if (!hasConfiguredDatabase()) return [];

  try {
    return await source.getAllPublishedPosts();
  } catch {
    // Keep the checked-in articles available if the CMS cannot be read.
    return [];
  }
}

export const getPublishedPosts = cache(async function getPublishedPosts({ limit = 10, page = 1 }: PublishedPostsOptions = {}) {
  return paginatePosts(mergePublishedPosts(await getCmsPosts()), limit, page);
});

export const getPublishedPost = cache(async function getPublishedPost(slug: string) {
  if (hasConfiguredDatabase()) {
    try {
      const cmsPost = await source.getPublishedPost(slug);
      if (cmsPost) return cmsPost;
    } catch {
      // Keep the existing articles readable while Payload is unavailable.
    }
  }

  return builtInPosts.find((post) => post.slug === slug) ?? null;
});

export const getAllPublishedPosts = cache(async function getAllPublishedPosts() {
  return mergePublishedPosts(await getCmsPosts());
});
export { PublishedPostsUnavailableError };

export function formatPublicationDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function getReadingTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 220))} min read`;
}

export function getPostTags(post: { tags?: { tag?: string | null }[] | null }) {
  return post.tags?.map(({ tag }) => tag).filter((tag): tag is string => Boolean(tag)) ?? [];
}

export function getPostCover(post: { cover?: unknown }) {
  return typeof post.cover === "object" && post.cover ? post.cover as { url?: string | null; alt?: string | null } : null;
}

export function getMarkdownHeadings(content: string) {
  const counts = new Map<string, number>();
  let inFence = false;
  return content.split(/\r?\n/).flatMap((line) => {
      if (/^\s*(```|~~~)/.test(line)) {
        inFence = !inFence;
        return [];
      }
      if (inFence) return [];
      const match = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
      if (!match) return [];

      const title = match[2].replace(/[`*_~]/g, "").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").trim();
      const base = title
        .normalize("NFKD")
        .toLocaleLowerCase()
        .replace(/[^\p{L}\p{N}\s-]/gu, "")
        .trim()
        .replace(/[\s-]+/g, "-") || "section";
      const count = counts.get(base) ?? 0;
      counts.set(base, count + 1);

      return [{ depth: match[1].length, title, id: count === 0 ? base : `${base}-${count}` }];
    });
}
