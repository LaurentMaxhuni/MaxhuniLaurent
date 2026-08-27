import config from "@payload-config";
import { getPayload } from "payload";
import { cache } from "react";

import type { Post } from "../../payload-types";

export const getPublishedPosts = cache(async function getPublishedPosts() {
  const payload = await getPayload({ config });

  return payload.find({
    collection: "posts",
    depth: 1,
    limit: 100,
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
