import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Radio } from "lucide-react";

import Navbar from "@/components/navbar";
import SiteFooter from "@/components/site-footer";
import { Starfield } from "@/components/ui/starfield-1";
import { formatPublicationDate, getPostCover, getPostTags, getPublishedPosts, getReadingTime } from "@/lib/blog";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = pageMetadata({
  title: "Notes",
  description: "Notes on products, interfaces, experiments, and the work behind them.",
  pathname: "/blog",
});

export default async function BlogArchivePage() {
  let posts: Awaited<ReturnType<typeof getPublishedPosts>>["docs"] = [];

  try {
    ({ docs: posts } = await getPublishedPosts());
  } catch {
    // Keep the public archive indexable if the CMS is temporarily unavailable.
  }

  return (
    <>
      <a className="skip-link" href="#archive">Skip to blog posts</a>
      <Navbar />
      <main id="archive" className="blog-archive">
        <section className="blog-archive__intro" aria-labelledby="blog-title">
          <Starfield className="blog-archive__starfield" starCount={88} />
          <div className="shell blog-archive__intro-copy">
            <p className="section-kicker"><Radio aria-hidden="true" size={15} /> Field notes</p>
            <h1 id="blog-title">Notes.</h1>
            <p>Notes on products, experiments, and the decisions behind them.</p>
          </div>
        </section>

        <section className="shell blog-archive__listing" aria-label="Published posts">
          {posts.length ? (
            <div className="post-grid">
              {posts.map((post) => {
                const cover = getPostCover(post);
                const tags = getPostTags(post);
                const publicationDate = post.publishedAt ?? post.createdAt;

                return (
                  <article key={post.id} className="post-card">
                    {cover?.url && (
                      <Link className="post-card__cover" href={`/blog/${post.slug}`} aria-label={`Read ${post.title}`}>
                        <Image src={cover.url} alt={cover.alt} fill sizes="(min-width: 1000px) 33vw, (min-width: 700px) 50vw, 100vw" />
                      </Link>
                    )}
                    <div className="post-card__copy">
                      <div className="post-card__meta">
                        <time dateTime={publicationDate}>{formatPublicationDate(publicationDate)}</time>
                        <span>{getReadingTime(post.content)}</span>
                      </div>
                      <h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2>
                      <p>{post.excerpt}</p>
                      {tags.length > 0 && (
                        <ul className="post-tag-list" aria-label={`${post.title} tags`}>
                          {tags.map((tag) => <li key={tag}>{tag}</li>)}
                        </ul>
                      )}
                      <Link className="blog-action" href={`/blog/${post.slug}`}>Read post <ArrowUpRight aria-hidden="true" size={17} /></Link>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="blog-empty">
              <Starfield className="blog-empty__starfield" starCount={52} />
              <div className="blog-empty__signal" aria-hidden="true"><span /><span /><span /></div>
              <div>
                <p className="section-kicker">Coming soon</p>
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
