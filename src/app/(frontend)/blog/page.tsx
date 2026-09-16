import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import Navbar from "@/components/navbar";
import SiteFooter from "@/components/site-footer";
import { Starfield } from "@/components/ui/starfield-1";
import { formatPublicationDate, getPostCover, getPostTags, getPublishedPosts, getReadingTime } from "@/lib/blog";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = pageMetadata({
  title: "Blog",
  description: "Published writing on products, interfaces, experiments, and the work behind them.",
  pathname: "/blog",
});

export default async function BlogArchivePage() {
  let posts: Awaited<ReturnType<typeof getPublishedPosts>>["docs"] = [];

  try {
    ({ docs: posts } = await getPublishedPosts());
  } catch {
    // Keep the public archive indexable if the CMS is temporarily unavailable.
  }

  const featuredPost = posts[0];
  const archivePosts = posts.slice(1);
  const featuredCover = featuredPost ? getPostCover(featuredPost) : null;
  const featuredTags = featuredPost ? getPostTags(featuredPost) : [];

  return (
    <>
      <a className="skip-link" href="#archive">Skip to blog posts</a>
      <Navbar />
      <main id="archive" className="blog-archive">
        <section className="shell blog-archive__listing" aria-label="Published posts">
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
                      alt={featuredCover.alt}
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
                  {featuredTags.length > 0 && (
                    <ul className="post-tag-list" aria-label={`${featuredPost.title} tags`}>
                      {featuredTags.map((tag) => <li key={tag}>{tag}</li>)}
                    </ul>
                  )}
                  <Link className="blog-action" href={`/blog/${featuredPost.slug}`}>
                    Read post <ArrowUpRight aria-hidden="true" size={17} />
                  </Link>
                </div>
              </article>

              {archivePosts.length > 0 && (
                <section className="post-archive" aria-labelledby="more-posts-title">
                  <div className="post-archive__head">
                    <h2 id="more-posts-title">More posts</h2>
                    <span className="post-archive__count">{String(archivePosts.length).padStart(2, "0")} entries</span>
                  </div>
                  <div className="post-list">
                    {archivePosts.map((post, index) => {
                      const tags = getPostTags(post);
                      const publicationDate = post.publishedAt ?? post.createdAt;

                      return (
                        <article key={post.id} className="post-row">
                          <span className="post-row__index" aria-hidden="true">{String(index + 2).padStart(2, "0")}</span>
                          <div className="post-row__copy">
                            <div className="post-card__meta">
                              <time dateTime={publicationDate}>{formatPublicationDate(publicationDate)}</time>
                              <span>{getReadingTime(post.content)}</span>
                            </div>
                            <h3><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3>
                            <p>{post.excerpt}</p>
                            {tags.length > 0 && (
                              <ul className="post-tag-list post-row__tags" aria-label={`${post.title} tags`}>
                                {tags.map((tag) => <li key={tag}>{tag}</li>)}
                              </ul>
                            )}
                          </div>
                          <Link className="post-row__action" href={`/blog/${post.slug}`} aria-label={`Read ${post.title}`}>
                            <ArrowUpRight aria-hidden="true" size={19} />
                          </Link>
                        </article>
                      );
                    })}
                  </div>
                </section>
              )}
            </>
          ) : (
            <div className="blog-empty">
              <Starfield className="blog-empty__starfield" starCount={52} />
              <div className="blog-empty__signal" aria-hidden="true"><span /><span /><span /></div>
              <div>
                <h2>No posts yet.</h2>
                <p>The first note will appear here when it is published.</p>
              </div>
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
