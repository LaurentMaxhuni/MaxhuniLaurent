import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock3 } from "lucide-react";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import Navbar from "@/components/navbar";
import SiteFooter from "@/components/site-footer";
import { formatPublicationDate, getPostCover, getPostTags, getPublishedPost, getReadingTime } from "@/lib/blog";
import { absoluteUrl, SITE_NAME, SITE_OG_IMAGE, SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);

  if (!post) return { title: "Post not found", robots: { index: false, follow: false } };

  const cover = getPostCover(post);
  const image = cover?.url ?? SITE_OG_IMAGE;
  const pathname = `/blog/${post.slug}`;
  const title = `${post.title} | Notes`;

  return {
    title,
    description: post.excerpt,
    alternates: { canonical: pathname },
    authors: [{ name: SITE_NAME, url: absoluteUrl("/") }],
    openGraph: {
      type: "article",
      url: pathname,
      title: `${title} | ${SITE_NAME}`,
      description: post.excerpt,
      publishedTime: post.publishedAt ?? post.createdAt,
      modifiedTime: post.updatedAt,
      authors: [SITE_NAME],
      tags: getPostTags(post),
      images: [{ url: image, alt: cover?.alt ?? `${post.title} article cover` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description: post.excerpt,
      images: [image],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) notFound();

  const cover = getPostCover(post);
  const tags = getPostTags(post);
  const publicationDate = post.publishedAt ?? post.createdAt;
  const canonicalUrl = absoluteUrl(`/blog/${post.slug}`);
  const imageUrl = new URL(cover?.url ?? SITE_OG_IMAGE, SITE_URL).toString();
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
        author: { "@id": `${absoluteUrl("/")}#person` },
        publisher: { "@id": `${absoluteUrl("/")}#organization` },
        isPartOf: { "@id": `${absoluteUrl("/")}#website` },
        inLanguage: "en",
        ...(tags.length > 0 ? { keywords: tags.join(", ") } : {}),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Notes", item: absoluteUrl("/blog") },
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
              <li><Link href="/blog">Notes</Link></li>
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
            {tags.length > 0 && (
              <ul className="post-tag-list" aria-label={`${post.title} tags`}>
                {tags.map((tag) => <li key={tag}>{tag}</li>)}
              </ul>
            )}
          </header>
          {cover?.url && (
            <figure className="blog-post__cover">
              <Image src={cover.url} alt={cover.alt} fill priority sizes="(min-width: 1180px) 960px, calc(100vw - 40px)" />
            </figure>
          )}
          <div id="post-content" className="markdown-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml components={{ h1: ({ children }) => <h2>{children}</h2> }}>{post.content}</ReactMarkdown>
          </div>
        </article>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
