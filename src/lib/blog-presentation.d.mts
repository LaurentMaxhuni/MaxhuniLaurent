export function createPublishedPostMetadata(
  post: {
    slug: string;
    title: string;
    excerpt: string;
    publishedAt?: string | null;
    createdAt: string;
    updatedAt: string;
    cover?: unknown;
    tags?: unknown[] | null;
  },
  options: { siteName: string; siteUrl: string; defaultImage: string },
): {
  canonicalUrl: string;
  title: string;
  description: string;
  publicationDate: string;
  updatedDate: string;
  imageUrl: string;
  imageAlt: string;
  authorName: string;
  authorUrl: string;
  tags: string[];
};
