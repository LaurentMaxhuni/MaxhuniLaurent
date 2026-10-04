import assert from "node:assert/strict";
import { test } from "node:test";

import { createBlogSource, PublishedPostsUnavailableError } from "../src/lib/blog-source.mjs";
import { createPublishedPostMetadata } from "../src/lib/blog-presentation.mjs";
import { importDraftPosts } from "../src/lib/post-import.mjs";

function makePost(slug, index = 0, status = "published") {
  const date = new Date(Date.UTC(2026, 0, 1 + index)).toISOString();
  return {
    id: index + 1,
    title: `Post ${index + 1}`,
    slug,
    excerpt: `Summary ${index + 1}`,
    content: `## Section ${index + 1}`,
    tags: [{ tag: "TypeScript" }],
    publishedAt: date,
    createdAt: date,
    updatedAt: date,
    _status: status,
  };
}

function makePayload(records, calls = []) {
  return {
    async find(options) {
      calls.push(options);
      let filtered = records.filter((post) => post._status === "published");
      const requestedSlug = options.where?.slug?.equals;
      if (requestedSlug) filtered = filtered.filter((post) => post.slug === requestedSlug);
      const limit = options.limit ?? 100;
      const page = options.page ?? 1;
      const totalDocs = filtered.length;
      const totalPages = totalDocs === 0 ? 0 : Math.ceil(totalDocs / limit);
      const start = (page - 1) * limit;
      return {
        docs: filtered.slice(start, start + limit),
        totalDocs,
        totalPages,
        limit,
        page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1 && totalDocs > 0,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
        pagingCounter: totalDocs === 0 ? 1 : start + 1,
      };
    },
  };
}

test("published lookup follows CMS publish and unpublish state and has no built-in fallback", async () => {
  const matchingPost = makePost("matching-post");
  const records = [matchingPost, makePost("draft-post", 1, "draft")];
  const source = createBlogSource({ isConfigured: () => true, getPayload: async () => makePayload(records) });

  assert.equal((await source.getPublishedPost("matching-post")).slug, "matching-post");
  assert.equal(await source.getPublishedPost("draft-post"), null);
  assert.equal(await source.getPublishedPost("missing-post"), null);

  matchingPost._status = "draft";
  assert.equal(await source.getPublishedPost("matching-post"), null);
});

test("database configuration and query failures become sanitized unavailable errors", async () => {
  const failures = [];
  const unconfigured = createBlogSource({
    isConfigured: () => false,
    getPayload: async () => { throw new Error("must not connect"); },
    onFailure: (reason) => failures.push(reason),
  });
  await assert.rejects(unconfigured.getPublishedPosts(), PublishedPostsUnavailableError);
  assert.deepEqual(failures, ["database_not_configured"]);

  const broken = createBlogSource({
    isConfigured: () => true,
    getPayload: async () => ({ find: async () => { throw new Error("connection string and credential must not leak"); } }),
    onFailure: (reason) => failures.push(reason),
  });
  await assert.rejects(broken.getPublishedPosts(), (error) => {
    assert.ok(error instanceof PublishedPostsUnavailableError);
    assert.doesNotMatch(error.message, /credential|connection string/);
    return true;
  });
  assert.equal(failures.at(-1), "published_posts_query_failed");
});

test("sitemap reader collects records beyond Payload's first 100 and passes page limits through", async () => {
  const records = Array.from({ length: 237 }, (_, index) => makePost(`post-${index + 1}`, index));
  const calls = [];
  const source = createBlogSource({ isConfigured: () => true, getPayload: async () => makePayload(records, calls) });
  const allPosts = await source.getAllPublishedPosts();

  assert.equal(allPosts.length, 237);
  assert.deepEqual(calls.map((call) => [call.limit, call.page]), [[100, 1], [100, 2], [100, 3]]);
  assert.deepEqual(calls[0].where, { _status: { equals: "published" } });
  assert.equal(calls[0].overrideAccess, false);

  const pageTwo = await source.getPublishedPosts({ limit: 7, page: 2 });
  assert.equal(pageTwo.docs.length, 7);
  assert.deepEqual(calls.at(-1) && [calls.at(-1).limit, calls.at(-1).page], [7, 2]);
});

test("core post import creates drafts once, preserves slugs and skips existing records", async () => {
  const records = [{ slug: "already-exists", title: "Keep this edit", _status: "draft" }];
  const created = [];
  const covers = [];
  const posts = [
    { slug: "already-exists", title: "Seed title", excerpt: "Seed", content: "Draft content", tags: [], cover: { url: "/cover.svg", alt: "Cover" } },
    { slug: "new-seed", title: "New seed", excerpt: "Seed", content: "Draft content", tags: [{ tag: "Notes" }], cover: { url: "/cover.svg", alt: "Cover" } },
  ];
  const dependencies = {
    findExistingPost: async (slug) => records.find((record) => record.slug === slug) ?? null,
    findOrUploadCover: async (cover) => { covers.push(cover.url); return 42; },
    createPost: async (options) => {
      created.push(options);
      const record = { ...options.data, slug: options.data.slug };
      records.push(record);
      return record;
    },
  };

  const first = await importDraftPosts(posts, dependencies);
  const second = await importDraftPosts(posts, dependencies);

  assert.deepEqual(first, { imported: ["new-seed"], skipped: ["already-exists"] });
  assert.deepEqual(second, { imported: [], skipped: ["already-exists", "new-seed"] });
  assert.equal(created.length, 1);
  assert.equal(created[0].data._status, "draft");
  assert.equal(created[0].draft, true);
  assert.equal(created[0].data.slug, "new-seed");
  assert.equal(created[0].data.cover, 42);
  assert.deepEqual(covers, ["/cover.svg"]);
  assert.equal(records[0].title, "Keep this edit");
});

test("article metadata has a resolvable canonical and author and preserves actual cover URLs", () => {
  const metadata = createPublishedPostMetadata({
    slug: "case-study",
    title: "Case study",
    excerpt: "A useful summary.",
    publishedAt: "2026-01-02T00:00:00.000Z",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-03T00:00:00.000Z",
    cover: { url: "https://cdn.example.test/cover.svg", alt: "Editorial cover" },
    tags: [{ tag: "Research" }],
  }, {
    siteName: "Laurent Maxhuni",
    siteUrl: "https://portfolio.example.test",
    defaultImage: "/opengraph-image",
  });

  assert.equal(metadata.canonicalUrl, "https://portfolio.example.test/blog/case-study");
  assert.equal(metadata.authorUrl, "https://portfolio.example.test/about");
  assert.equal(metadata.imageUrl, "https://cdn.example.test/cover.svg");
  assert.deepEqual(metadata.tags, ["Research"]);
  assert.equal(metadata.publicationDate, "2026-01-02T00:00:00.000Z");
});
