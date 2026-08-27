import { MCP_PROTOCOL_VERSION, handleMcpMessage } from "@/lib/mcp";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function transportHeaders() {
  return {
    "MCP-Protocol-Version": MCP_PROTOCOL_VERSION,
    "Cache-Control": "no-store",
    "Vary": "Accept, Origin",
  };
}

function acceptsJsonAndEvents(header: string | null) {
  if (!header) return false;
  const values = header.toLowerCase();
  return (values.includes("application/json") || values.includes("*/*")) &&
    (values.includes("text/event-stream") || values.includes("*/*"));
}

function hasAllowedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}

function methodNotAllowed() {
  return new Response("Method Not Allowed", {
    status: 405,
    headers: { ...transportHeaders(), Allow: "POST" },
  });
}

export async function POST(request: Request) {
  if (!hasAllowedOrigin(request)) {
    return new Response("Forbidden origin", { status: 403, headers: transportHeaders() });
  }

  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) {
    return new Response("Unsupported Media Type", { status: 415, headers: transportHeaders() });
  }

  if (!acceptsJsonAndEvents(request.headers.get("accept"))) {
    return new Response("Not Acceptable", { status: 406, headers: transportHeaders() });
  }

  const protocolVersion = request.headers.get("mcp-protocol-version");
  if (protocolVersion && protocolVersion !== MCP_PROTOCOL_VERSION) {
    return new Response("Unsupported MCP protocol version", { status: 400, headers: transportHeaders() });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } },
      { status: 400, headers: transportHeaders() },
    );
  }

  const response = handleMcpMessage(body);
  if (!response) return new Response(null, { status: 202, headers: transportHeaders() });

  return Response.json(response, {
    headers: {
      ...transportHeaders(),
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

export function GET(request: Request) {
  if (!hasAllowedOrigin(request)) {
    return new Response("Forbidden origin", { status: 403, headers: transportHeaders() });
  }

  // This stateless server returns JSON directly and intentionally does not
  // keep an SSE stream open. Streamable HTTP permits a 405 in this case.
  return methodNotAllowed();
}

export function DELETE() {
  return methodNotAllowed();
}
