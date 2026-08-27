import type { Metadata } from "next";
import Link from "next/link";

import StaticPage from "@/components/static-page";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Portfolio API",
  description: "Read-only API reference for published Laurent Maxhuni blog posts.",
  pathname: "/developers/api",
});

export default function ApiDeveloperPage() {
  return (
    <StaticPage
      eyebrow="Laurent Maxhuni Portfolio API"
      title="Published writing in structured data."
      lead="A read-only API for the public blog."
      related={[
        { href: "/openapi.json", label: "OpenAPI 3.1 document" },
        { href: "/developers/auth", label: "Authentication guide" },
      ]}
    >
      <p>The public API, backed by Payload CMS, exposes published blog posts as JSON. Its access policy filters out drafts, so readers receive only content released on the portfolio. Use it when you need post titles, excerpts, Markdown content, tags, publication dates, and pagination metadata without scraping the site.</p>
      <h2>Endpoint</h2>
      <p><code>GET /api/posts</code> lists published posts. It accepts the normal Payload CMS collection query parameters for safe read filtering and pagination. Write, delete, and administrative operations are outside this public contract and require the private CMS administration area.</p>
      <p>Use <a href="/openapi.json">the OpenAPI 3.1 document</a> for the machine-readable schema. Use <Link href="/blog">the blog</Link> for human-oriented reading, or request the archive with <code>Accept: text/markdown</code> for Markdown.</p>
    </StaticPage>
  );
}
