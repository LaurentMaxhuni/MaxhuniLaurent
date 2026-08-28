import type { Metadata } from "next";

import StaticPage from "@/components/static-page";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Authentication guide",
  description: "Authentication boundary for the public portfolio API and private administration area.",
  pathname: "/developers/auth",
});

export default function AuthDeveloperPage() {
  return (
    <StaticPage
      eyebrow="Laurent Maxhuni Authentication Guide"
      title="Laurent Maxhuni public API access."
      lead="The site keeps public discovery separate from private publishing controls."
      related={[
        { href: "/developers/api", label: "Portfolio API" },
        { href: "/developers/mcp", label: "MCP server" },
      ]}
    >
      <p>Public portfolio pages, versioned published-post reads at <code>/api/v1/posts</code>, llms.txt, the XML sitemap, Markdown representations, and the MCP server are intentionally available without an API key, browser session, or OAuth flow. An agent can retrieve public material directly, then follow a project&apos;s primary repository or product URL when it needs current product-specific information.</p>
      <p>Publishing and administration are different. The Payload CMS administration area is reserved for authorized administrators, and its credentials must never be requested, inferred, or shared in an integration. This portfolio does not issue public API keys or support self-service account registration. A request that needs write access, unpublished content, or private project information must be handled through an explicit professional conversation instead.</p>
    </StaticPage>
  );
}
