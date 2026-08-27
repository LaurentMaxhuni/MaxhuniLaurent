import { projects } from "../content/portfolio";
import { homepageMarkdown } from "./agent-content";
import { SITE_NAME, SITE_URL } from "./site";

export const MCP_PROTOCOL_VERSION = "2025-06-18";

type JsonRpcId = string | number | null;

type JsonRpcRequest = {
  jsonrpc?: unknown;
  id?: unknown;
  method?: unknown;
  params?: unknown;
};

type JsonRpcResponse = {
  jsonrpc: "2.0";
  id: JsonRpcId;
  result?: Record<string, unknown>;
  error?: { code: number; message: string; data?: unknown };
};

const tools = [
  {
    name: "search_portfolio",
    title: "Search Laurent Maxhuni's public portfolio",
    description: "Search public project names, summaries, descriptions, and technology tags.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      required: ["query"],
      properties: {
        query: {
          type: "string",
          minLength: 1,
          description: "Keywords such as AI, TypeScript, Chrome extension, or product name.",
        },
      },
    },
  },
  {
    name: "get_site_guide",
    title: "Get portfolio agent guidance",
    description: "Return a concise guide to the portfolio, its developer resources, and when to use them.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {},
    },
  },
] as const;

const resources = [
  {
    uri: "portfolio://site-guide",
    name: "Laurent Maxhuni portfolio guide",
    description: "Public portfolio guidance and developer-resource links in Markdown.",
    mimeType: "text/markdown",
  },
  {
    uri: "portfolio://projects",
    name: "Laurent Maxhuni public projects",
    description: "Public project index in Markdown.",
    mimeType: "text/markdown",
  },
] as const;

function validId(value: unknown): value is JsonRpcId {
  return value === null || typeof value === "string" || typeof value === "number";
}

function response(id: JsonRpcId, result: Record<string, unknown>): JsonRpcResponse {
  return { jsonrpc: "2.0", id, result };
}

function error(id: JsonRpcId, code: number, message: string, data?: unknown): JsonRpcResponse {
  return { jsonrpc: "2.0", id, error: { code, message, ...(data === undefined ? {} : { data }) } };
}

function projectMarkdown() {
  return [
    `# ${SITE_NAME} public projects`,
    "",
    ...projects.map((project) => {
      const links = project.links.map((link) => `[${link.label}](${link.href})`).join(" · ");
      return `- **${project.title}** — ${project.summary} Tags: ${project.tags.join(", ")}. ${links}`;
    }),
    "",
  ].join("\n");
}

function searchProjects(query: string) {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  return projects.filter((project) => {
    const haystack = [project.title, project.summary, project.description, ...project.tags].join(" ").toLocaleLowerCase();
    return haystack.includes(normalizedQuery);
  });
}

function toolResult(text: string, structuredContent: Record<string, unknown>) {
  return {
    content: [{ type: "text", text }],
    structuredContent,
  };
}

function getStringParameter(params: unknown, key: string) {
  if (!params || typeof params !== "object") return null;
  const value = (params as Record<string, unknown>)[key];
  return typeof value === "string" ? value : null;
}

/** Returns undefined for accepted JSON-RPC notifications, which map to HTTP 202. */
export function handleMcpMessage(message: unknown): JsonRpcResponse | undefined {
  if (!message || typeof message !== "object" || Array.isArray(message)) {
    return error(null, -32600, "Invalid Request");
  }

  const request = message as JsonRpcRequest;
  if (request.jsonrpc !== "2.0" || typeof request.method !== "string") {
    return error(validId(request.id) ? request.id : null, -32600, "Invalid Request");
  }

  const isNotification = request.id === undefined;
  if (!isNotification && !validId(request.id)) {
    return error(null, -32600, "Invalid Request");
  }

  const id: JsonRpcId = isNotification ? null : request.id as JsonRpcId;

  if (request.method === "notifications/initialized" || request.method === "notifications/cancelled") {
    return undefined;
  }

  if (isNotification) return undefined;

  switch (request.method) {
    case "initialize": {
      const requestedVersion = getStringParameter(request.params, "protocolVersion");
      if (requestedVersion && requestedVersion !== MCP_PROTOCOL_VERSION) {
        return error(id, -32602, "Unsupported protocol version", { supported: MCP_PROTOCOL_VERSION });
      }

      return response(id, {
        protocolVersion: MCP_PROTOCOL_VERSION,
        capabilities: {
          tools: { listChanged: false },
          resources: { subscribe: false, listChanged: false },
        },
        serverInfo: {
          name: "laurent-maxhuni-portfolio",
          title: `${SITE_NAME} Portfolio MCP Server`,
          version: "1.0.0",
          websiteUrl: SITE_URL,
        },
        instructions:
          "Use search_portfolio to find relevant public work and get_site_guide for Markdown, API, and contact resources. Public data only; no account, credentials, or write operations are available.",
      });
    }
    case "ping":
      return response(id, {});
    case "tools/list":
      return response(id, { tools });
    case "resources/list":
      return response(id, { resources });
    case "resources/read": {
      const uri = getStringParameter(request.params, "uri");
      if (uri === "portfolio://site-guide") {
        return response(id, {
          contents: [{ uri, mimeType: "text/markdown", text: homepageMarkdown() }],
        });
      }
      if (uri === "portfolio://projects") {
        return response(id, {
          contents: [{ uri, mimeType: "text/markdown", text: projectMarkdown() }],
        });
      }
      return error(id, -32602, "Unknown resource", { uri });
    }
    case "tools/call": {
      const name = getStringParameter(request.params, "name");
      const argumentsValue = request.params && typeof request.params === "object"
        ? (request.params as Record<string, unknown>).arguments
        : undefined;

      if (name === "get_site_guide") {
        return response(id, toolResult(homepageMarkdown(), { siteUrl: SITE_URL, format: "text/markdown" }));
      }

      if (name === "search_portfolio") {
        const query = getStringParameter(argumentsValue, "query");
        if (!query?.trim()) return error(id, -32602, "search_portfolio requires a non-empty query");

        const matches = searchProjects(query).map((project) => ({
          id: project.id,
          title: project.title,
          kind: project.kind,
          summary: project.summary,
          description: project.description,
          tags: project.tags,
          links: project.links,
        }));
        const text = matches.length
          ? matches.map((project) => `- **${project.title}** — ${project.summary}`).join("\n")
          : `No public projects matched “${query.trim()}”. Try a product name, technology, or broader term.`;

        return response(id, toolResult(text, { query: query.trim(), matches }));
      }

      return error(id, -32602, "Unknown tool", { name });
    }
    default:
      return error(id, -32601, "Method not found");
  }
}
