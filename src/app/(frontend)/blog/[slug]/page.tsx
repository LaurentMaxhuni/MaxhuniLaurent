import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock3 } from "lucide-react";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import JsonLd from "@/components/json-ld";
import Navbar from "@/components/navbar";
import SiteFooter from "@/components/site-footer";
import { formatPublicationDate, getMarkdownHeadings, getPostCover, getPostTags, getPublishedPost, getReadingTime, PublishedPostsUnavailableError } from "@/lib/blog";
import { createPublishedPostMetadata } from "@/lib/blog-presentation.mjs";
import { absoluteUrl, PERSON_ID, PORTFOLIO_ID, SITE_NAME, SITE_OG_IMAGE, SITE_URL, WEBSITE_ID } from "@/lib/site";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  let post;
  try {
    post = await getPublishedPost(slug);
  } catch (error) {
    if (!(error instanceof PublishedPostsUnavailableError)) throw error;
    return {
      metadataBase: new URL(SITE_URL),
      title: "Article temporarily unavailable",
      description: "Published articles are temporarily unavailable. Please retry in a moment.",
      robots: { index: false, follow: false },
    };
  }

  if (!post) return { metadataBase: new URL(SITE_URL), title: "Post not found", robots: { index: false, follow: false } };

  const details = createPublishedPostMetadata(post, {
    siteName: SITE_NAME,
    siteUrl: SITE_URL,
    defaultImage: SITE_OG_IMAGE,
  });

  return {
    metadataBase: new URL(SITE_URL),
    title: details.title,
    description: details.description,
    alternates: { canonical: details.canonicalUrl },
    authors: [{ name: details.authorName, url: details.authorUrl }],
    openGraph: {
      type: "article",
      siteName: SITE_NAME,
      url: details.canonicalUrl,
      title: details.title,
      description: details.description,
      publishedTime: details.publicationDate,
      modifiedTime: details.updatedDate,
      authors: [details.authorUrl],
      tags: details.tags,
      images: [{ url: details.imageUrl, alt: details.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: details.title,
      description: details.description,
      images: [details.imageUrl],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  let post;
  try {
    post = await getPublishedPost(slug);
  } catch (error) {
    if (!(error instanceof PublishedPostsUnavailableError)) throw error;
    return (
      <>
        <Navbar />
        <main className="blog-post">
          <article className="shell blog-post__article blog-unavailable" role="alert">
            <h1>The article is temporarily unavailable.</h1>
            <p>The published post could not be loaded. Please retry in a moment.</p>
            <Link className="blog-action" href={`/blog/${encodeURIComponent(slug)}`}>Try again <ArrowLeft aria-hidden="true" size={17} /></Link>
          </article>
        </main>
        <SiteFooter />
      </>
    );
  }
  if (!post) notFound();

  const cover = getPostCover(post);
  const tags = getPostTags(post);
  const publicationDate = post.publishedAt ?? post.createdAt;
  const headings = getMarkdownHeadings(post.content);
  const headingCursor = { value: 0 };
  const canonicalUrl = absoluteUrl(`/blog/${post.slug}`);
  const imageUrl = (cover?.url ?? SITE_OG_IMAGE).startsWith("http")
    ? cover?.url ?? SITE_OG_IMAGE
    : absoluteUrl(cover?.url ?? SITE_OG_IMAGE);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${canonicalUrl}#blogposting`,
        headline: post.title,
        description: post.excerpt,
        url: canonicalUrl,
        mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
        datePublished: publicationDate,
        dateModified: post.updatedAt,
        image: [imageUrl],
        author: {
          "@type": "Person",
          "@id": PERSON_ID,
          name: SITE_NAME,
          url: absoluteUrl("/about"),
        },
        publisher: { "@id": PORTFOLIO_ID },
        isPartOf: { "@id": WEBSITE_ID },
        inLanguage: "en",
        ...(tags.length > 0 ? { keywords: tags.join(", ") } : {}),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Blog", item: absoluteUrl("/blog") },
          { "@type": "ListItem", position: 3, name: post.title, item: canonicalUrl },
        ],
      },
    ],
  };

  return (
    <>
      <a className="skip-link" href="#post-content">Skip to article</a>
      <Navbar />
      <main className="blog-post">
        <article className="shell blog-post__article">
          <nav className="blog-breadcrumb" aria-label="Breadcrumb">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li aria-current="page">{post.title}</li>
            </ol>
          </nav>
          <Link className="blog-back" href="/blog"><ArrowLeft aria-hidden="true" size={17} /> Back to the archive</Link>
          <header className="blog-post__header">
            <div className="post-card__meta">
              <time dateTime={publicationDate}>{formatPublicationDate(publicationDate)}</time>
              <span><Clock3 aria-hidden="true" size={14} /> {getReadingTime(post.content)}</span>
            </div>
            <h1>{post.title}</h1>
            <p>{post.excerpt}</p>
            <p className="blog-post__byline">
              By <Link href="/about">Laurent Maxhuni</Link>
              {new Date(post.updatedAt).getTime() > new Date(publicationDate).getTime() + 86_400_000 && (
                <span> · Updated <time dateTime={post.updatedAt}>{formatPublicationDate(post.updatedAt)}</time></span>
              )}
            </p>
            {tags.length > 0 && (
              <ul className="post-tag-list" aria-label={`${post.title} tags`}>
                {tags.map((tag) => <li key={tag}>{tag}</li>)}
              </ul>
            )}
          </header>
          {cover?.url && (
            <figure className="blog-post__cover">
              <Image src={cover.url} alt={cover.alt ?? ""} fill priority sizes="(min-width: 1180px) 960px, calc(100vw - 40px)" />
            </figure>
          )}
          {headings.length > 3 && (
            <nav className="article-toc" aria-label="Table of contents">
              <h2>On this page</h2>
              <ol>
                {headings.map((heading) => (
                  <li key={heading.id} className={heading.depth === 3 ? "article-toc__subitem" : undefined}>
                    <a href={`#${heading.id}`}>{heading.title}</a>
                  </li>
                ))}
              </ol>
            </nav>
          )}
          <div id="post-content" className="markdown-body">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              skipHtml
              components={{
                h1: ({ children }) => <h2>{children}</h2>,
                h2: ({ children }) => {
                  const heading = headings[headingCursor.value++];
                  return <h2 id={heading?.id}>{children}</h2>;
                },
                h3: ({ children }) => {
                  const heading = headings[headingCursor.value++];
                  return <h3 id={heading?.id}>{children}</h3>;
                },
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </article>
      </main>
      <SiteFooter />
      <JsonLd data={jsonLd} />
    </>
  );
}
