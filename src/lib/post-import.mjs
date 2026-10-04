/** Imports source records as drafts and never edits an existing CMS document. */
export async function importDraftPosts(posts, { findExistingPost, findOrUploadCover, createPost }) {
  const imported = [];
  const skipped = [];

  for (const post of posts) {
    const existing = await findExistingPost(post.slug);
    if (existing) {
      skipped.push(post.slug);
      continue;
    }

    const sourceCover = typeof post.cover === "object" && post.cover ? post.cover : null;
    const coverId = sourceCover ? await findOrUploadCover(sourceCover) : undefined;
    const created = await createPost({
      data: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        tags: post.tags ?? [],
        ...(coverId === undefined ? {} : { cover: coverId }),
        _status: "draft",
      },
      draft: true,
      overrideAccess: true,
    });
    imported.push(created.slug);
  }

  return { imported, skipped };
}
