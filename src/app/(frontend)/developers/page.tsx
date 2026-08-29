import type { Metadata } from "next";
import Link from "next/link";

import StaticPage from "@/components/static-page";
import { developersMarkdown } from "@/lib/agent-content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Laurent Maxhuni Developer Resources",
  description: "Vercel-hosted developer portal for Laurent Maxhuni's public portfolio, API, Markdown representations, and MCP server.",
  pathname: "/developers",
});

export default function DevelopersPage() {
  return (
    <StaticPage
      eyebrow="Laurent Maxhuni Developer Resources"
      title="Laurent Maxhuni developer resources."
      lead="Find the API, Markdown routes, sitemap, and MCP server in one place."
      related={[
        { href: "/developers/api", label: "Portfolio API" },
        { href: "/developers/mcp", label: "MCP server" },
        { href: "/llms.txt", label: "llms.txt" },
      ]}
    >
      <p>{developersMarkdown().split("\n\n")[1]}</p>
      <p>This is a Vercel-hosted Next.js portfolio. These resources document Laurent Maxhuni&apos;s public portfolio; they are not documentation for Vercel&apos;s products or APIs.</p>
      <h2>Start here</h2>
      <ul>
        <li><a href="/llms.txt">llms.txt</a> provides the concise site index and agent usage guidance.</li>
        <li><a href="/openapi.json">openapi.json</a> describes the versioned read-only published-posts endpoint, typed errors, and rate-limit headers.</li>
        <li><Link href="/api/v1/posts"><code>/api/v1/posts</code></Link> is the canonical versioned JSON endpoint for published posts.</li>
        <li><Link href="/developers/api/versioning">API versioning and deprecation policy</Link> documents the stable version and RFC 9745/RFC 8594 retirement signals.</li>
        <li><Link href="/.well-known/mcp">/.well-known/mcp</Link> is the live Streamable HTTP MCP endpoint.</li>
        <li><a href="/sitemap.xml">sitemap.xml</a> lists indexable public URLs.</li>
      </ul>
      <h2>Content negotiation</h2>
      <p>Request any public HTML page with <code>Accept: text/markdown</code> to receive its Markdown representation. HTML remains the default for browsers, and unsupported representation requests receive a 406 response rather than silently falling back to an unrelated format.</p>
    </StaticPage>
  );
}
