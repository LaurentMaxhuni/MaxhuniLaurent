import { API_RATE_LIMIT, API_RATE_LIMIT_POLICY, API_RATE_WINDOW_SECONDS, API_VERSION, API_VERSIONING_PATH } from "@/lib/public-api";
import { absoluteUrl, SITE_NAME, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

const rateLimitHeaders = {
  "RateLimit-Limit": {
    description: "Maximum requests allowed in the current rate-limit window.",
    schema: { type: "integer", example: API_RATE_LIMIT },
  },
  "RateLimit-Remaining": {
    description: "Requests remaining in the current rate-limit window.",
    schema: { type: "integer", minimum: 0, example: API_RATE_LIMIT - 1 },
  },
  "RateLimit-Reset": {
    description: "Number of seconds until the current rate-limit window resets.",
    schema: { type: "integer", minimum: 0, example: API_RATE_WINDOW_SECONDS },
  },
  RateLimit: {
    description: "Combined IETF RateLimit policy and current quota state.",
    schema: { type: "string", example: `limit=${API_RATE_LIMIT}, remaining=${API_RATE_LIMIT - 1}, reset=${API_RATE_WINDOW_SECONDS}` },
  },
  "RateLimit-Policy": {
    description: "IETF quota policy expressed as a structured field: the default policy allows 60 requests in a 60-second window.",
    schema: { type: "string", example: API_RATE_LIMIT_POLICY },
  },
  "API-Version": {
    description: "The API version that produced this response.",
    schema: { type: "string", example: API_VERSION },
  },
  Link: {
    description: "Link to the API versioning and deprecation policy using the RFC 9745 deprecation relation.",
    schema: { type: "string", example: `<${absoluteUrl(API_VERSIONING_PATH)}>; rel=\"deprecation\"; type=\"text/html\"` },
  },
};

const deprecationHeaders = {
  Deprecation: {
    description: "RFC 9745 structured date indicating when this resource is or will be deprecated. Sent only when scheduled.",
    schema: { type: "string", pattern: "^@[0-9]+$", example: "@1798761600" },
  },
  Sunset: {
    description: "RFC 8594 HTTP-date indicating when this resource is expected to become unavailable. Sent only when scheduled.",
    schema: { type: "string", format: "http-date", example: "Sat, 31 Dec 2027 23:59:59 GMT" },
  },
};

const problemResponse = (description: string, includeRetryAfter = false) => ({
  description,
  content: {
    "application/problem+json": {
      schema: { $ref: "#/components/schemas/ProblemDetails" },
    },
  },
  headers: {
    ...rateLimitHeaders,
    ...deprecationHeaders,
    ...(includeRetryAfter
      ? {
          "Retry-After": {
            description: "Seconds to wait before retrying after a rate-limit response.",
            schema: { type: "integer", minimum: 1, example: API_RATE_WINDOW_SECONDS },
          },
        }
      : {}),
  },
});

const postsResponse = {
  description: "Published posts",
  content: {
    "application/json": {
      schema: { $ref: "#/components/schemas/PostsPage" },
    },
  },
  headers: { ...rateLimitHeaders, ...deprecationHeaders },
};

const versionParameter = {
  name: "X-API-Version",
  in: "header",
  required: false,
  description: `Optional compatibility header. It defaults to API version ${API_VERSION}; unsupported values return a typed 400 problem response. The canonical URL is versioned as /api/v${API_VERSION}/posts.`,
  schema: { type: "string", enum: [API_VERSION], default: API_VERSION },
};

const paginationParameters = [
  versionParameter,
  {
    name: "limit",
    in: "query",
    required: false,
    description: "Maximum number of posts to return.",
    schema: { type: "integer", minimum: 1, maximum: 100, default: 100 },
  },
  {
    name: "page",
    in: "query",
    required: false,
    description: "One-based page number.",
    schema: { type: "integer", minimum: 1, default: 1 },
  },
];

function listPostsOperation(operationId: string, summary: string, description: string) {
  return {
    get: {
      tags: ["Posts"],
      operationId,
      summary,
      description,
      security: [],
      parameters: paginationParameters,
      responses: {
        "200": postsResponse,
        "400": problemResponse("The request is invalid, including an unsupported API version."),
        "404": problemResponse("The requested public resource does not exist."),
        "429": problemResponse("The client exceeded the public API rate limit.", true),
        "500": problemResponse("The API or its content service could not complete the request."),
      },
    },
  };
}

export function GET() {
  const document = {
    openapi: "3.1.1",
    jsonSchemaDialect: "https://json-schema.org/draft/2020-12/schema",
    info: {
      title: `${SITE_NAME} Portfolio API`,
      version: `v${API_VERSION}.0.0`,
      description:
        `Read-only public API for published posts in Laurent Maxhuni's signal archive. The canonical endpoint is versioned at /api/v${API_VERSION}/posts. The unversioned /api/posts URL remains a compatibility alias. Responses use a typed RFC 9457-style application/problem+json error object with a machine-readable code and human-readable message. Rate limits are communicated with RateLimit-Policy, RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset, and RateLimit headers; 429 responses also include Retry-After. Future endpoint deprecations use the RFC 9745 Deprecation structured date and RFC 8594 Sunset HTTP-date, with a migration timeline published in the developer API guide.`,
      contact: {
        name: `${SITE_NAME} contact guidance`,
        url: absoluteUrl("/contact"),
      },
    },
    servers: [{ url: SITE_URL, description: "Production" }],
    tags: [
      {
        name: "Posts",
        description: "Published, read-only signal-archive posts.",
      },
    ],
    externalDocs: {
      description: "Human-readable API guide and compatibility policy",
      url: absoluteUrl("/developers/api"),
    },
    paths: {
      [`/api/v${API_VERSION}/posts`]: listPostsOperation(
        "listPublishedPosts",
        "List published signal-archive posts",
        "Returns published posts only. Drafts, writes, deletes, and administrative operations are not available through this public contract. Use the typed response schemas and rate-limit headers to integrate without scraping or guessing failure behavior.",
      ),
      "/api/posts": listPostsOperation(
        "listPublishedPostsCompatibilityAlias",
        "List published posts (compatibility alias)",
        `Compatibility alias for /api/v${API_VERSION}/posts. New integrations SHOULD use the versioned path. Future deprecations will be announced with the standard Deprecation and Sunset response headers and a documented timeline before removal.`,
      ),
    },
    components: {
      schemas: {
        Post: {
          type: "object",
          description: "A published signal-archive post.",
          required: ["id", "title", "slug", "excerpt", "content"],
          properties: {
            id: {
              oneOf: [{ type: "string" }, { type: "integer" }],
              description: "Payload document identifier.",
            },
            title: { type: "string" },
            slug: { type: "string" },
            excerpt: { type: "string" },
            content: { type: "string", description: "GitHub-flavored Markdown source." },
            publishedAt: { type: ["string", "null"], format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            tags: {
              type: "array",
              items: { type: "string" },
            },
          },
        },
        PostsPage: {
          type: "object",
          description: "A paginated collection of published posts.",
          required: ["docs", "totalDocs", "limit", "page", "totalPages"],
          properties: {
            docs: { type: "array", items: { $ref: "#/components/schemas/Post" } },
            totalDocs: { type: "integer", minimum: 0 },
            limit: { type: "integer", minimum: 1 },
            page: { type: "integer", minimum: 1 },
            totalPages: { type: "integer", minimum: 0 },
            hasNextPage: { type: "boolean" },
            hasPrevPage: { type: "boolean" },
            nextPage: { type: ["integer", "null"], minimum: 1 },
            prevPage: { type: ["integer", "null"], minimum: 1 },
          },
        },
        ProblemDetails: {
          type: "object",
          description: "Typed public API failure using the RFC 9457 problem-details shape plus a stable machine-readable code and message.",
          required: ["type", "title", "status", "code", "message", "detail", "instance"],
          properties: {
            type: { type: "string", format: "uri", description: "URI identifying the problem type." },
            title: { type: "string", description: "Short, human-readable problem summary." },
            status: { type: "integer", minimum: 400, maximum: 599 },
            code: { type: "string", description: "Stable machine-readable error code." },
            message: { type: "string", description: "Human-readable explanation suitable for an agent or developer." },
            detail: { type: "string", description: "RFC 9457-compatible detailed explanation." },
            instance: { type: "string", format: "uri-reference", description: "Request path that produced the problem." },
          },
        },
      },
    },
    "x-api-versioning": {
      strategy: "URL path with optional X-API-Version compatibility header",
      currentVersion: `v${API_VERSION}`,
      canonicalPath: `/api/v${API_VERSION}/posts`,
      compatibilityAlias: "/api/posts",
      deprecationPolicy: {
        policyUrl: absoluteUrl(API_VERSIONING_PATH),
        currentStatus: "No endpoint is currently scheduled for deprecation.",
        signals: ["Deprecation", "Sunset", "Link; rel=deprecation"],
        notice: "A scheduled endpoint will include Deprecation: @<unix-seconds> (RFC 9745), Sunset: <HTTP-date> (RFC 8594), and a Link header with rel=deprecation. The migration timeline is documented in the API versioning policy.",
      },
    },
  };

  return Response.json(document, {
    headers: {
      "Content-Type": "application/vnd.oai.openapi+json;version=3.1; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
