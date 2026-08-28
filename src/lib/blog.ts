import config from "@payload-config";
import { getPayload, type PaginatedDocs } from "payload";
import { cache } from "react";

import type { Post } from "../../payload-types";

const EMPTY_POSTS_RESULT: PaginatedDocs<Post> = {
  docs: [],
  hasNextPage: false,
  hasPrevPage: false,
  limit: 100,
  nextPage: null,
  page: 1,
  pagingCounter: 1,
  prevPage: null,
  totalDocs: 0,
  totalPages: 0,
};

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

export const getPublishedPosts = cache(async function getPublishedPosts({ limit = 100, page = 1 }: PublishedPostsOptions = {}) {
  if (!hasConfiguredDatabase()) {
    return {
      ...EMPTY_POSTS_RESULT,
      limit,
      page,
    };
  }

  const payload = await getPayload({ config });

  return payload.find({
    collection: "posts",
    depth: 1,
    limit,
    page,
    overrideAccess: false,
    sort: "-publishedAt",
    where: {
      _status: {
        equals: "published",
      },
    },
  });
});

export const getPublishedPost = cache(async function getPublishedPost(slug: string) {
  if (!hasConfiguredDatabase()) return null;

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

  return result.docs[0] ?? null;
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
