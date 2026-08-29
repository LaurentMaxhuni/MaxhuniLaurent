import type { Metadata } from "next";
import Link from "next/link";

import StaticPage from "@/components/static-page";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Laurent Maxhuni Portfolio API",
  description: "Read-only API reference for published Laurent Maxhuni blog posts.",
  pathname: "/developers/api",
});

export default function ApiDeveloperPage() {
  return (
    <StaticPage
      eyebrow="Laurent Maxhuni Portfolio API"
      title="Laurent Maxhuni Portfolio API."
      lead="A versioned, read-only API for the public blog."
      related={[
        { href: "/openapi.json", label: "OpenAPI 3.1 document" },
        { href: "/developers/auth", label: "Authentication guide" },
        { href: "/developers/api/versioning", label: "Versioning policy" },
      ]}
    >
      <p>The public API, backed by Payload CMS, exposes published blog posts as JSON. Its access policy filters out drafts, so readers receive only content released on the portfolio. Use it when you need post titles, excerpts, Markdown content, tags, publication dates, and pagination metadata without scraping the site.</p>
      <h2>Endpoint</h2>
      <p><code>GET /api/v1/posts</code> lists published posts. It accepts typed <code>limit</code> (1–100) and <code>page</code> (one-based) query parameters for pagination. The unversioned <code>/api/posts</code> path remains a compatibility alias for existing clients. Write, delete, and administrative operations are outside this public contract and require the private CMS administration area.</p>
      <h2 id="errors">Errors, versioning, and rate limits</h2>
      <p>Send <code>X-API-Version: 1</code> when a client wants to state its contract explicitly; responses include <code>API-Version: 1</code>. All documented failures use <code>application/problem+json</code> with RFC 9457 fields plus a stable machine-readable <code>code</code> and human-readable <code>message</code>. Every response includes <code>RateLimit-Policy</code>, <code>RateLimit-Limit</code>, <code>RateLimit-Remaining</code>, <code>RateLimit-Reset</code>, and <code>RateLimit</code>. A <code>429</code> response includes <code>Retry-After</code>. The current quota is 60 requests per client per 60-second window.</p>
      <h2 id="versioning">Versioning and deprecation policy</h2>
      <p><code>/api/v1/posts</code> is the stable, canonical URL-versioned contract. The unversioned <code>/api/posts</code> URL is a compatibility alias for existing clients; new integrations should use v1. If a resource is scheduled for retirement, responses will include RFC 9745 <code>Deprecation: @&lt;unix-seconds&gt;</code>, RFC 8594 <code>Sunset: &lt;HTTP-date&gt;</code>, and a <code>Link</code> header with <code>rel=&quot;deprecation&quot;</code>. The <Link href="/developers/api/versioning">versioning policy page</Link> publishes the replacement, migration timeline, and retirement dates before removal. No endpoint is currently scheduled for deprecation.</p>
      <p>Use <a href="/openapi.json">the OpenAPI 3.1 document</a> for the machine-readable schema. Use <Link href="/blog">the blog</Link> for human-oriented reading, or request the archive with <code>Accept: text/markdown</code> for Markdown.</p>
    </StaticPage>
  );
}
