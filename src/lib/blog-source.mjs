/**
 * Small dependency-injected boundary around Payload so publication behavior can
 * be checked without a live database.
 */
export class PublishedPostsUnavailableError extends Error {
  constructor() {
    super("Published posts are temporarily unavailable.");
    this.name = "PublishedPostsUnavailableError";
  }
}

export function createBlogSource({ isConfigured, getPayload, onFailure }) {
  async function payloadOrThrow() {
    if (!isConfigured()) {
      onFailure?.("database_not_configured");
      throw new PublishedPostsUnavailableError();
    }

    try {
      return await getPayload();
    } catch {
      onFailure?.("payload_initialization_failed");
      throw new PublishedPostsUnavailableError();
    }
  }

  async function getPublishedPosts({ limit = 100, page = 1 } = {}) {
    const payload = await payloadOrThrow();
    const normalizedLimit = Math.max(1, Math.min(100, Math.floor(Number(limit) || 100)));
    const normalizedPage = Math.max(1, Math.floor(Number(page) || 1));

    try {
      return await payload.find({
        collection: "posts",
        depth: 1,
        limit: normalizedLimit,
        page: normalizedPage,
        overrideAccess: false,
        sort: "-publishedAt",
        where: {
          _status: { equals: "published" },
        },
      });
    } catch {
      onFailure?.("published_posts_query_failed");
      throw new PublishedPostsUnavailableError();
    }
  }

  async function getPublishedPost(slug) {
    const payload = await payloadOrThrow();

    try {
      const result = await payload.find({
        collection: "posts",
        depth: 1,
        limit: 1,
        page: 1,
        overrideAccess: false,
        where: {
          _status: { equals: "published" },
          slug: { equals: slug },
        },
      });

      return result.docs[0] ?? null;
    } catch {
      onFailure?.("published_post_query_failed");
      throw new PublishedPostsUnavailableError();
    }
  }

  async function getAllPublishedPosts() {
    const firstPage = await getPublishedPosts({ limit: 100, page: 1 });
    const posts = [...firstPage.docs];

    for (let page = 2; page <= firstPage.totalPages; page += 1) {
      const nextPage = await getPublishedPosts({ limit: 100, page });
      posts.push(...nextPage.docs);
    }

    return posts;
  }

  return { getPublishedPosts, getPublishedPost, getAllPublishedPosts };
}
