import type { Metadata } from "next";
import Link from "next/link";

import StaticPage from "@/components/static-page";
import { versioningMarkdown } from "@/lib/agent-content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Laurent Maxhuni API Versioning and Deprecation Policy",
  description: "URL versioning, compatibility aliases, and RFC 9745 and RFC 8594 deprecation signals for the Laurent Maxhuni Portfolio API.",
  pathname: "/developers/api/versioning",
});

export default function ApiVersioningPage() {
  return (
    <StaticPage
      eyebrow="Laurent Maxhuni API Versioning"
      title="Laurent Maxhuni API versioning and deprecation policy."
      lead="Stable URLs and explicit lifecycle signals for agents and integrations."
      related={[
        { href: "/developers/api", label: "Portfolio API" },
        { href: "/openapi.json", label: "OpenAPI 3.1 document" },
      ]}
    >
      <p>{versioningMarkdown().split("\n\n")[1]}</p>
      <h2>Current version</h2>
      <ul>
        <li><strong>v1:</strong> <Link href="/api/v1/posts"><code>/api/v1/posts</code></Link> is the canonical read-only endpoint for published posts.</li>
        <li><strong>Compatibility alias:</strong> <Link href="/api/posts"><code>/api/posts</code></Link> currently serves the same v1 contract; new integrations should use the versioned path.</li>
      </ul>
      <h2>Deprecation signals</h2>
      <p>When an endpoint is scheduled for retirement, responses will include <code>Deprecation: @&lt;unix-seconds&gt;</code> using the RFC 9745 structured date value, <code>Sunset: &lt;HTTP-date&gt;</code> using the RFC 8594 HTTP-date, and a <code>Link</code> header with <code>rel=&quot;deprecation&quot;</code> pointing to this policy and migration instructions.</p>
      <p>The endpoint remains operational during the published migration window. The replacement URL, deprecation date, sunset date, and response-shape changes will be documented here before removal. No endpoint is currently scheduled for deprecation.</p>
    </StaticPage>
  );
}
