import { capabilities, getProjectBySlug, projects, site } from "../content/portfolio";
import { CORE_SITE_PATHS, SITE_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl } from "./site";

const developerResources = [
  ["Laurent Maxhuni developer portal", "/developers", "Human-readable integration and discovery guide."],
  ["Laurent Maxhuni API reference", "/developers/api", "Read-only, versioned REST API documentation."],
  ["Versioned posts endpoint", "/api/v1/posts", "Canonical read-only JSON endpoint for published posts."],
  ["OpenAPI document", "/openapi.json", "Machine-readable OpenAPI 3.1 description with typed schemas and errors."],
  ["Authentication guide", "/developers/auth", "Public read access and admin authentication boundary."],
  ["MCP server guide", "/developers/mcp", "Connect with Streamable HTTP at /.well-known/mcp."],
  ["LLMs index", "/llms.txt", "Compact Markdown site index and agent usage guidance."],
  ["XML sitemap", "/sitemap.xml", "Indexable URLs, including published blog posts."],
] as const;

function projectLines() {
  return projects
    .map((project) => {
      const links = project.links.map((link) => `[${link.label}](${link.href})`).join(" · ");
      return `- **${project.title}** — ${project.summary} Tags: ${project.tags.join(", ")}. ${links}`;
    })
    .join("\n");
}

export const aboutCopy = [
  "Laurent Maxhuni is a developer and product builder based in Vushtrri, Kosovo. This portfolio documents the work he builds and studies: focused interfaces, AI-assisted tools, browser extensions, and experiments that turn technical ideas into something people can use. His work connects frontend development, backend thinking, product design, and the details needed to ship a product.",
  "The project index links to live products and public repositories so visitors can inspect the work instead of taking a claim at face value. Laurent also publishes notes on products, interfaces, experiments, and the decisions behind them. Mathematics and physics inform his approach, with an emphasis on clear reasoning, careful iteration, and useful outcomes.",
].join("\n\n");

export const contactCopy = [
  "For professional conversations, use Laurent Maxhuni's LinkedIn or GitHub profile. Both are linked below and on the homepage. Use LinkedIn for introductions, collaboration requests, and product conversations. Use GitHub for questions about a public repository, issue, implementation detail, or contribution. Include the project, problem, timing, and relevant link or repository so Laurent can give a useful reply.",
  "This site does not list a direct email address or telephone number. Laurent keeps public contact on the channels he actively maintains, which avoids stale addresses and automated spam. If a private channel makes sense after an initial conversation, you can arrange it through one of those verified profiles. Do not send credentials, payment information, or other sensitive material through public issue trackers or social-platform messages.",
].join("\n\n");

export const privacyCopy = [
  "You can read Laurent Maxhuni's portfolio without creating an account, submitting a contact form, or providing personal information. The public pages cover projects, writing, and developer resources. The site does not sell personal data or run a public newsletter. External destinations such as GitHub, LinkedIn, Vercel, Netlify, and project websites have their own privacy practices and terms.",
  "Hosting and delivery providers may process the technical information needed to deliver and protect a request, including an IP address, user-agent string, request time, and security or performance logs. Providers use those records to operate the service, diagnose failures, and prevent abuse. The private CMS is limited to authorized administrators. Visitors cannot create accounts or publish content through this site.",
  "For a question about this policy, use the verified LinkedIn or GitHub contact channels on the contact page. Do not send secrets or sensitive documents through public channels. This policy may change if the site adds a feature with different data practices. It currently describes the public portfolio and developer resources available at this domain.",
].join("\n\n");

export function homepageMarkdown() {
  return `# ${SITE_NAME}

> ${SITE_DESCRIPTION}

${site.role} based in ${site.location}. Laurent builds web products, AI tools, and browser extensions with clear frontend execution and practical product thinking.

## When to use this portfolio

Use this site to evaluate Laurent's public work, find a relevant project or repository, understand his technical range, or choose a public channel for a product or engineering conversation. Start with the project index, then follow its live-product and source links for primary evidence.

## Public projects

${projectLines()}

## Technical range

${capabilities.map((capability) => `- **${capability.label}:** ${capability.items.join(", ")}`).join("\n")}

## Developer resources

${developerResources.map(([name, path, description]) => `- [${name}](${absoluteUrl(path)}) — ${description}`).join("\n")}

## Contact

- [GitHub](${site.socials.find((social) => social.label === "GitHub")?.href})
- [LinkedIn](${site.socials.find((social) => social.label === "LinkedIn")?.href})
- [Contact guidance](${absoluteUrl("/contact")})
`;
}

export function developersMarkdown() {
  return `# ${SITE_NAME} Developer Resources

This is the developer portal for Laurent Maxhuni's public portfolio and blog. Use it to retrieve public portfolio content in a machine-readable form, discover published writing, or connect an agent to the site's read-only MCP tools.

## Available resources

${developerResources.map(([name, path, description]) => `- [${name}](${absoluteUrl(path)}) — ${description}`).join("\n")}

## Preferred agent workflow

1. Read [llms.txt](${absoluteUrl("/llms.txt")}) for the concise site map and use cases.
2. Request a public page with \`Accept: text/markdown\` when clean Markdown is more useful than HTML.
3. Use the MCP endpoint for project search and portfolio guidance when an MCP client is available.
4. Treat project links and GitHub repositories as the source of truth for a specific product's current behavior.
`;
}

export function apiMarkdown() {
  return `# ${SITE_NAME} Portfolio API

The public read API is provided by Payload CMS. It exposes published blog posts as JSON. No API key is required for public reads. The API is intended for retrieval and integration, not for writing, authentication, or administration.

## Endpoint

- \`GET ${absoluteUrl("/api/v1/posts")}\` — list published posts. The collection's public access policy excludes drafts. Use the typed \`limit\` (1–100) and \`page\` query parameters for pagination.

The unversioned \`/api/posts\` URL remains a compatibility alias, but new integrations should use \`/api/v1/posts\`. Clients may send \`X-API-Version: 1\`; responses identify the selected version with \`API-Version: 1\`.

## Errors and rate limits

All documented 4xx and 5xx responses use \`application/problem+json\` with \`type\`, \`title\`, \`status\`, stable machine-readable \`code\`, and human-readable \`message\` and \`detail\` fields. A client can branch on \`code\` without parsing prose. Every API response includes \`RateLimit-Limit\`, \`RateLimit-Remaining\`, \`RateLimit-Reset\`, and the combined IETF \`RateLimit\` header. A \`429\` response also includes \`Retry-After\`.

The current policy allows 60 requests per client per 60-second window. Future endpoint deprecations will send \`Deprecation: true\` and a \`Sunset\` HTTP-date, with the migration timeline published here before removal.

For the formal request and response description, use [openapi.json](${absoluteUrl("/openapi.json")}). Use [the blog](${absoluteUrl("/blog")}) or its Markdown representation for presentation-focused reading.
`;
}

export function authMarkdown() {
  return `# ${SITE_NAME} Authentication Guide

Public portfolio pages, the public posts read endpoint, llms.txt, the XML sitemap, and the MCP server do not require authentication. Administrative functions are intentionally separated behind the private Payload CMS area at \`${absoluteUrl("/admin")}\`. Agents and integrations must not attempt to create, modify, or delete portfolio content through public endpoints.

If a workflow needs access beyond the published public resources, begin through the verified contact channels rather than requesting or guessing credentials. This site does not offer self-service API keys, OAuth client registration, or a public account system.
`;
}

export function mcpMarkdown() {
  return `# ${SITE_NAME} MCP Server

Connect an MCP client to \`${absoluteUrl("/.well-known/mcp")}\` using the Streamable HTTP transport and protocol version \`2025-06-18\`. The server is public and stateless; it does not require OAuth or an MCP session ID.

## Tools

- \`search_portfolio\` — search public project names, summaries, descriptions, and tags.
- \`get_site_guide\` — retrieve agent-specific guidance and developer-resource links.
- \`list_published_posts\` — retrieve published signal-archive posts with typed pagination metadata.

## Resources

- \`portfolio://site-guide\` — public portfolio guide in Markdown.
- \`portfolio://projects\` — the project index in Markdown.

Send JSON-RPC 2.0 requests with \`Content-Type: application/json\` and an \`Accept\` header that includes both \`application/json\` and \`text/event-stream\`. The endpoint returns individual JSON responses for supported requests and returns \`405\` for GET because it does not open a server-sent-events stream.
`;
}

export function aboutMarkdown() {
  return `# About ${SITE_NAME}\n\n${aboutCopy}\n`;
}

export function contactMarkdown() {
  return `# Contact ${SITE_NAME}\n\n${contactCopy}\n\n- [GitHub](${site.socials.find((social) => social.label === "GitHub")?.href})\n- [LinkedIn](${site.socials.find((social) => social.label === "LinkedIn")?.href})\n`;
}

export function privacyMarkdown() {
  return `# Privacy — ${SITE_NAME}\n\n${privacyCopy}\n`;
}

export function notFoundMarkdown(pathname: string) {
  return `# Page not found\n\n\`${pathname}\` is not a published page on ${SITE_NAME}'s site.\n\n## Where to look next\n\n- [Portfolio home](${SITE_URL})\n- [Developer resources](${absoluteUrl("/developers")})\n- [LLMs index](${absoluteUrl("/llms.txt")})\n- [XML sitemap](${absoluteUrl("/sitemap.xml")})\n`;
}

export function projectMarkdown(slug: string) {
  const project = getProjectBySlug(slug);
  if (!project) return null;

  return `# ${project.title}

> ${project.summary}

Status: ${project.status}

## The problem

${project.problem}

## My approach

${project.approach}

## Build

${project.description}

Tags: ${project.tags.join(", ")}

## Links

${project.links.map((link) => `- [${link.label}](${link.href})`).join("\n")}
`;
}

export function markdownForPath(pathname: string) {
  switch (pathname) {
    case "/":
      return homepageMarkdown();
    case "/about":
      return aboutMarkdown();
    case "/contact":
      return contactMarkdown();
    case "/privacy":
      return privacyMarkdown();
    case "/developers":
      return developersMarkdown();
    case "/developers/api":
      return apiMarkdown();
    case "/developers/auth":
      return authMarkdown();
    case "/developers/mcp":
      return mcpMarkdown();
    default:
      if (pathname.startsWith("/projects/")) return projectMarkdown(pathname.slice("/projects/".length));
      return null;
  }
}

export { CORE_SITE_PATHS, developerResources };
