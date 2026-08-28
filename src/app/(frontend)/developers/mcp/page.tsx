import type { Metadata } from "next";

import StaticPage from "@/components/static-page";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "MCP server",
  description: "Streamable HTTP MCP server for public Laurent Maxhuni portfolio search and guidance.",
  pathname: "/developers/mcp",
});

export default function McpDeveloperPage() {
  return (
    <StaticPage
      eyebrow="Laurent Maxhuni MCP Server"
      title="Laurent Maxhuni MCP tools for agents."
      lead="A public, stateless Streamable HTTP endpoint for project search and site discovery."
      related={[
        { href: "/llms.txt", label: "llms.txt" },
        { href: "/developers/api", label: "Portfolio API" },
      ]}
    >
      <p>Connect an MCP client to <code>https://laurentmaxhuni.vercel.app/.well-known/mcp</code> with the Streamable HTTP transport. The server speaks JSON-RPC 2.0 and supports MCP protocol version <code>2025-06-18</code>. It returns direct JSON responses, so it does not keep a server-sent-events stream open and correctly reports 405 for a GET request that asks to open one.</p>
      <h2>Available tools</h2>
      <ul>
        <li><code>search_portfolio</code> searches public project names, summaries, descriptions, and technology tags.</li>
        <li><code>get_site_guide</code> returns the public portfolio guide, resource links, and agent workflow.</li>
        <li><code>list_published_posts</code> exposes the versioned published-post API with typed pagination output.</li>
      </ul>
      <p>The server also exposes Markdown resources for the site guide and project index. It is read-only, does not require authentication, and does not expose private CMS data, credentials, or write operations.</p>
    </StaticPage>
  );
}
