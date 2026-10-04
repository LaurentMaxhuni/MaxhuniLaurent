import type { PaginatedDocs } from "payload";
import type { Post } from "../../payload-types";

type PostsFindOptions = {
  collection: "posts";
  depth?: number;
  limit?: number;
  page?: number;
  overrideAccess?: boolean;
  sort?: string;
  where?: { _status: { equals: string }; slug?: { equals: string } };
};

export type PublishedPostsOptions = {
  limit?: number;
  page?: number;
};

export class PublishedPostsUnavailableError extends Error {}

export function createBlogSource(options: {
  isConfigured: () => boolean;
  getPayload: () => Promise<{
    find: (options: PostsFindOptions) => Promise<PaginatedDocs<Post>>;
  }>;
  onFailure?: (reason: string) => void;
}): {
  getPublishedPosts: (options?: PublishedPostsOptions) => Promise<PaginatedDocs<Post>>;
  getPublishedPost: (slug: string) => Promise<Post | null>;
  getAllPublishedPosts: () => Promise<Post[]>;
};
