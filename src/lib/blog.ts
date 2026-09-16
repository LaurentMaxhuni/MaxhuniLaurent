import config from "@payload-config";
import { getPayload, type PaginatedDocs } from "payload";
import { cache } from "react";

import { builtInPosts } from "@/content/posts";
import type { Post } from "../../payload-types";

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
  const normalizedLimit = Math.max(1, Math.min(100, Math.floor(limit)));
  const normalizedPage = Math.max(1, Math.floor(page));
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

export const getPublishedPosts = cache(async function getPublishedPosts({ limit = 100, page = 1 }: PublishedPostsOptions = {}) {
  let cmsPosts: Post[] = [];

  if (hasConfiguredDatabase()) {
    try {
      const payload = await getPayload({ config });
      const result = await payload.find({
        collection: "posts",
        depth: 1,
        limit: 100,
        page: 1,
        overrideAccess: false,
        sort: "-publishedAt",
        where: {
          _status: {
            equals: "published",
          },
        },
      });
      cmsPosts = result.docs;
    } catch {
      // The checked-in notes keep the public archive available during a CMS outage.
    }
  }

  return paginatePosts(mergePublishedPosts(cmsPosts), limit, page);
});

export const getPublishedPost = cache(async function getPublishedPost(slug: string) {
  if (hasConfiguredDatabase()) {
    try {
      const payload = await getPayload({ config });
      const result = await payload.find({
        collection: "posts",
        depth: 1,
        limit: 1,
        overrideAccess: false,
        where: {
          _status: {
            equals: "published",
          },
          slug: {
            equals: slug,
          },
        },
      });

      if (result.docs[0]) return result.docs[0];
    } catch {
      // Fall through to the checked-in notes when the CMS cannot be reached.
    }
  }

  return builtInPosts.find((post) => post.slug === slug) ?? null;
});

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

export function getPostTags(post: Post) {
  return post.tags?.map(({ tag }) => tag).filter((tag): tag is string => Boolean(tag)) ?? [];
}

export function getPostCover(post: Post) {
  return typeof post.cover === "object" && post.cover ? post.cover : null;
}
