import { absoluteUrl, SITE_NAME, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const document = {
    openapi: "3.1.1",
    info: {
      title: `${SITE_NAME} Portfolio API`,
      version: "1.0.0",
      description:
        "Read-only public API for published posts in Laurent Maxhuni's signal archive. Drafts and administrative operations are not available through this public contract.",
      contact: {
        name: `${SITE_NAME} contact guidance`,
        url: absoluteUrl("/contact"),
      },
    },
    servers: [{ url: SITE_URL, description: "Production" }],
    paths: {
      "/api/posts": {
        get: {
          operationId: "listPublishedPosts",
          summary: "List published signal-archive posts",
          description:
            "Returns the Payload CMS collection response. Public access is constrained by the server to posts whose status is published.",
          responses: {
            "200": {
              description: "Published posts",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["docs", "totalDocs", "limit", "page", "totalPages"],
                    properties: {
                      docs: {
                        type: "array",
                        items: {
                          type: "object",
                          required: ["id", "title", "slug", "excerpt", "content"],
                          properties: {
                            id: { type: "string" },
                            title: { type: "string" },
                            slug: { type: "string" },
                            excerpt: { type: "string" },
                            content: { type: "string", description: "GitHub-flavored Markdown source." },
                            publishedAt: { type: "string", format: "date-time" },
                          },
                        },
                      },
                      totalDocs: { type: "integer" },
                      limit: { type: "integer" },
                      page: { type: "integer" },
                      totalPages: { type: "integer" },
                    },
                  },
                },
              },
            },
          },
        },
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
