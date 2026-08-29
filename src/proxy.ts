import { NextRequest, NextResponse } from "next/server";

import { appendVaryAccept, preferredContentType } from "@/lib/accept";
import { absoluteUrl, SITE_URL } from "@/lib/site";

function appendMarkdownAlternate(headers: Headers, request: NextRequest) {
  const markdownPath = request.nextUrl.pathname === "/" ? "/index.md" : `${request.nextUrl.pathname}.md`;
  const alternate = `<${absoluteUrl(markdownPath)}>; rel="alternate"; type="text/markdown"`;
  const existing = headers.get("Link");
  headers.set("Link", existing ? `${existing}, ${alternate}` : alternate);
}

function appendDeploymentRobots(headers: Headers) {
  if (process.env.VERCEL_ENV === "preview" && SITE_URL) {
    headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }
}

function markdownRewrite(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = `/agent-markdown${pathname === "/" ? "/" : pathname}`;
  const rewritten = NextResponse.rewrite(url);
  appendVaryAccept(rewritten.headers);
  appendDeploymentRobots(rewritten.headers);
  return rewritten;
}

function isMachineReadablePath(pathname: string) {
  return pathname === "/llms.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt" ||
    pathname === "/openapi.json" ||
    pathname.startsWith("/.well-known/") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/agent-markdown/") ||
    pathname.includes(".");
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // A stable .md sibling makes the Markdown form discoverable even to clients
  // that cannot set Accept. The source route is still canonical.
  if (pathname.endsWith(".md")) {
    const sourcePath = pathname === "/index.md" ? "/" : pathname.slice(0, -3) || "/";
    return markdownRewrite(request, sourcePath);
  }

  if (isMachineReadablePath(pathname)) {
    const response = NextResponse.next();
    appendDeploymentRobots(response.headers);
    return response;
  }

  const selected = preferredContentType(request.headers.get("accept"));
  if (selected === "text/markdown") return markdownRewrite(request, pathname);

  if (selected === null) {
    const response = new NextResponse("Not Acceptable\n\nAvailable representations: text/html, text/markdown\n", {
      status: 406,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Vary": "Accept",
      },
    });
    appendDeploymentRobots(response.headers);
    return response;
  }

  const response = NextResponse.next();
  appendVaryAccept(response.headers);
  appendMarkdownAlternate(response.headers, request);
  appendDeploymentRobots(response.headers);
  return response;
}

export const config = {
  matcher: ["/((?!_next/|_vercel/).*)"],
};
