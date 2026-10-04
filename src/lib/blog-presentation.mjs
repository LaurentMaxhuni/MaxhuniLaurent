export function createPublishedPostMetadata(post, { siteName, siteUrl, defaultImage }) {
  const pathname = `/blog/${encodeURIComponent(post.slug)}`;
  const canonicalUrl = new URL(pathname, siteUrl).toString();
  const sourceImage = post.cover && typeof post.cover === "object" ? post.cover.url : null;
  const imageUrl = new URL(sourceImage || defaultImage, siteUrl).toString();
  const tags = Array.isArray(post.tags)
    ? post.tags.map((item) => typeof item === "string" ? item : item?.tag).filter(Boolean)
    : [];

  return {
    canonicalUrl,
    title: `${post.title} | Blog`,
    description: post.excerpt,
    publicationDate: post.publishedAt || post.createdAt,
    updatedDate: post.updatedAt,
    imageUrl,
    imageAlt: post.cover?.alt || `${post.title} article cover`,
    authorName: siteName,
    authorUrl: new URL("/about", siteUrl).toString(),
    tags,
  };
}
