import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

import Navbar from "@/components/navbar";
import SiteFooter from "@/components/site-footer";
import type { Post } from "../../../../payload-types";
import { formatPublicationDate, getPostCover, getPublishedPosts, getReadingTime } from "@/lib/blog";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type BlogArchiveProps = {
  searchParams: Promise<{ page?: string | string[] }>;
};

function parsePage(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw || !/^\d+$/.test(raw)) return 1;
  const parsed = Number(raw);
  return Number.isSafeInteger(parsed) && parsed >= 1 ? parsed : 1;
}

export async function generateMetadata({ searchParams }: BlogArchiveProps): Promise<Metadata> {
  const page = parsePage((await searchParams).page);
  return pageMetadata({
    title: page > 1 ? `Blog — Page ${page}` : "Blog",
    description: "Published writing on products, interfaces, experiments, and the work behind them.",
    pathname: page > 1 ? `/blog?page=${page}` : "/blog",
  });
}

function BlogArchiveHeader() {
  return (
    <header className="blog-archive__header">
      <div>
        <span className="blog-archive__eyebrow">Writing</span>
        <h1 className="blog-archive__title">Blog</h1>
      </div>
      <div className="blog-archive__intro">
        <p>Notes on software, AI, and projects I’m building.</p>
      </div>
    </header>
  );
}

function numberedPages(page: number, totalPages: number) {
  const selected = new Set([1, totalPages, page - 1, page, page + 1]);
  return [...selected].filter((number) => number >= 1 && number <= totalPages).sort((a, b) => a - b);
}

function PagePagination({ page, totalPages }: { page: number; totalPages: number }) {
  if (totalPages < 2) return null;
  const pages = numberedPages(page, totalPages);
  const numbered = pages.map((number, index) => ({
    number,
    gap: index > 0 && number - pages[index - 1] > 1,
  }));

  return (
    <nav className="blog-pagination" aria-label="Blog pages">
      {page > 1 ? (
        <Link className="blog-pagination__step" href={page === 2 ? "/blog" : `/blog?page=${page - 1}`}>
          <ArrowLeft aria-hidden="true" size={16} /> Previous
        </Link>
      ) : <span className="blog-pagination__step is-disabled" aria-disabled="true">Previous</span>}
      <ol>
        {numbered.map(({ number, gap }) => {
          return (
            <li key={number}>
              {gap && <span className="blog-pagination__ellipsis" aria-hidden="true">…</span>}
              <Link
                href={number === 1 ? "/blog" : `/blog?page=${number}`}
                aria-current={number === page ? "page" : undefined}
                aria-label={`Page ${number}`}
              >
                {number}
              </Link>
            </li>
          );
        })}
      </ol>
      {page < totalPages ? (
        <Link className="blog-pagination__step" href={`/blog?page=${page + 1}`}>
          Next <ArrowRight aria-hidden="true" size={16} />
        </Link>
      ) : <span className="blog-pagination__step is-disabled" aria-disabled="true">Next</span>}
    </nav>
  );
}

function PostRow({ post, headingLevel = 3 }: { post: Post; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const publicationDate = post.publishedAt ?? post.createdAt;

  return (
    <article className="post-row">
      <div className="post-row__copy">
        <div className="post-card__meta">
          <time dateTime={publicationDate}>{formatPublicationDate(publicationDate)}</time>
          <span>{getReadingTime(post.content)}</span>
        </div>
        <Heading><Link href={`/blog/${post.slug}`}>{post.title}</Link></Heading>
        <p>{post.excerpt}</p>
      </div>
    </article>
  );
}

export default async function BlogArchivePage({ searchParams }: BlogArchiveProps) {
  const page = parsePage((await searchParams).page);
  let result: Awaited<ReturnType<typeof getPublishedPosts>>;

  try {
    result = await getPublishedPosts({ limit: 10, page });
  } catch {
    return (
      <>
        <a className="skip-link" href="#archive">Skip to blog archive</a>
        <Navbar />
        <main id="archive" className="blog-archive">
          <section className="shell blog-archive__listing" aria-label="Blog archive">
            <BlogArchiveHeader />
            <div className="blog-unavailable" role="alert">
              <h2>The archive is temporarily unavailable.</h2>
              <p>Published posts could not be loaded. Please retry in a moment.</p>
              <Link className="blog-action" href={page > 1 ? `/blog?page=${page}` : "/blog"}>Try again <ArrowUpRight aria-hidden="true" size={17} /></Link>
            </div>
          </section>
        </main>
        <SiteFooter />
      </>
    );
  }

  if (page > result.totalPages && (result.totalDocs > 0 || page > 1)) notFound();

  const posts = result.docs;
  const featuredPost = page === 1 ? posts[0] : null;
  const archivePosts = featuredPost ? posts.slice(1) : posts;
  const featuredCover = featuredPost ? getPostCover(featuredPost) : null;

  return (
    <>
      <a className="skip-link" href="#archive">Skip to blog posts</a>
      <Navbar />
      <main id="archive" className="blog-archive">
        <section className="shell blog-archive__listing" aria-label="Published posts">
          <BlogArchiveHeader />

          {featuredPost ? (
            <>
              <article className="post-feature">
                <Link
                  className="post-feature__media"
                  href={`/blog/${featuredPost.slug}`}
                  aria-label={`Read ${featuredPost.title}`}
                >
                  {featuredCover?.url ? (
                    <Image
                      src={featuredCover.url}
                      alt={featuredCover.alt ?? ""}
                      fill
                      priority
                      sizes="(min-width: 700px) 52vw, calc(100vw - 40px)"
                    />
                  ) : (
                    <span className="post-feature__media-fallback" aria-hidden="true" />
                  )}
                </Link>
                <div className="post-feature__copy">
                  <div className="post-card__meta">
                    <time dateTime={featuredPost.publishedAt ?? featuredPost.createdAt}>
                      {formatPublicationDate(featuredPost.publishedAt ?? featuredPost.createdAt)}
                    </time>
                    <span>{getReadingTime(featuredPost.content)}</span>
                  </div>
                  <h2><Link href={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link></h2>
                  <p>{featuredPost.excerpt}</p>
                  <Link className="blog-action" href={`/blog/${featuredPost.slug}`}>
                    Read post <ArrowUpRight aria-hidden="true" size={17} />
                  </Link>
                </div>
              </article>
              {archivePosts.length > 0 && (
                <section className="post-archive" aria-labelledby="more-posts-title">
                  <div className="post-archive__head">
                    <h2 id="more-posts-title">More posts</h2>
                  </div>
                  <div className="post-list">
                    {archivePosts.map((post) => <PostRow key={post.id} post={post} />)}
                  </div>
                </section>
              )}
            </>
          ) : result.totalDocs > 0 ? (
            <section className="post-archive" aria-labelledby="more-posts-title">
              <div className="post-archive__head">
                <h2 id="more-posts-title">Published posts</h2>
              </div>
              <div className="post-list">
                {archivePosts.map((post) => <PostRow key={post.id} post={post} headingLevel={2} />)}
              </div>
            </section>
          ) : (
            <div className="blog-empty" role="status">
              <div className="blog-empty__copy">
                <h2>No posts yet.</h2>
                <p>New writing will appear here.</p>
              </div>
            </div>
          )}

          <PagePagination page={page} totalPages={result.totalPages} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
