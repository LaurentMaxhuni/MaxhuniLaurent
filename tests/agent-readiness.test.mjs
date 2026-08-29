import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";

const port = 3417;
const baseUrl = `http://127.0.0.1:${port}`;
let expectedSiteUrl;
let escapedExpectedSiteUrl;
let server;

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function waitForServer() {
  const deadline = Date.now() + 45_000;
  let lastError;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(baseUrl, { redirect: "manual" });
      if (response.ok) return;
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error(`Next.js test server did not start: ${lastError?.message ?? "unknown error"}`);
}

async function request(pathname, options = {}) {
  return fetch(`${baseUrl}${pathname}`, { redirect: "manual", ...options });
}

before(async () => {
  server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--port", String(port)], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      NEXT_PUBLIC_SITE_URL: expectedSiteUrl,
      GOOGLE_SITE_VERIFICATION: "test-search-console-token",
    },
    stdio: "ignore",
  });
  await waitForServer();

  const homepage = await request("/", { headers: { Accept: "text/html" } });
  const homepageHtml = await homepage.text();
  const canonicalUrl = homepageHtml.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
  assert.ok(canonicalUrl, "homepage canonical URL");
  expectedSiteUrl = new URL(canonicalUrl).origin;
  escapedExpectedSiteUrl = escapeRegExp(expectedSiteUrl);
});

after(() => {
  server?.kill();
});

test("homepage negotiates Markdown, advertises Vary: Accept, and rejects unsupported media", async () => {
  const markdown = await request("/", { headers: { Accept: "text/markdown, text/html;q=0.5" } });
  assert.equal(markdown.status, 200);
  assert.match(markdown.headers.get("content-type") ?? "", /^text\/markdown; charset=utf-8$/);
  assert.match(markdown.headers.get("vary") ?? "", /(^|,)\s*accept\s*(,|$)/i);
  assert.match(await markdown.text(), /## When to use this portfolio/);

  const markdownRejected = await request("/", { headers: { Accept: "text/markdown;q=0, */*;q=1" } });
  assert.equal(markdownRejected.status, 200);
  assert.match(markdownRejected.headers.get("content-type") ?? "", /^text\/html/);

  const html = await request("/", { headers: { Accept: "text/html" } });
  assert.equal(html.status, 200);
  assert.match(html.headers.get("content-type") ?? "", /^text\/html/);

  const unsupported = await request("/", { headers: { Accept: "application/pdf" } });
  assert.equal(unsupported.status, 406);
  assert.match(unsupported.headers.get("vary") ?? "", /accept/i);
});

test("Markdown alternates and 404 responses give agents a recovery path", async () => {
  const alternate = await request("/about.md", { headers: { Accept: "text/html" } });
  assert.equal(alternate.status, 200);
  assert.match(alternate.headers.get("content-type") ?? "", /^text\/markdown/);
  assert.match(await alternate.text(), /# About Laurent Maxhuni/);

  const html404 = await request("/this-route-does-not-exist", { headers: { Accept: "text/html" } });
  assert.equal(html404.status, 404);
  const html404Body = await html404.text();
  assert.match(html404Body, /This page does not exist/);
  assert.match(html404Body, /name="robots" content="noindex, nofollow"/);

  const markdown404 = await request("/this-route-does-not-exist", { headers: { Accept: "text/markdown" } });
  assert.equal(markdown404.status, 404);
  assert.match(markdown404.headers.get("content-type") ?? "", /^text\/markdown/);
  assert.match(await markdown404.text(), /## Where to look next/);

  const versioningMarkdown = await request("/developers/api/versioning.md", { headers: { Accept: "text/html" } });
  assert.equal(versioningMarkdown.status, 200);
  assert.match(versioningMarkdown.headers.get("content-type") ?? "", /^text\/markdown/);
  assert.match(await versioningMarkdown.text(), /# Laurent Maxhuni API Versioning and Deprecation Policy/);
});

test("agent discovery files and developer resources are public and well formed", async () => {
  const llms = await request("/llms.txt");
  assert.equal(llms.status, 200);
  assert.match(llms.headers.get("content-type") ?? "", /^text\/plain/);
  const llmsBody = await llms.text();
  assert.match(llmsBody, /# Laurent Maxhuni/);
  assert.match(llmsBody, /\/developers/);
  assert.match(llmsBody, /\/api\/v1\/posts/);
  assert.match(llmsBody, /\/openapi\.json/);
  assert.match(llmsBody, /\/developers\/api\/versioning/);
  assert.match(llmsBody, /Laurent Maxhuni OpenAPI document/);
  assert.match(llmsBody, /Laurent Maxhuni MCP handshake endpoint/);
  assert.match(llmsBody, /\.well-known\/mcp/);

  const sitemap = await request("/sitemap.xml");
  assert.equal(sitemap.status, 200);
  assert.match(sitemap.headers.get("content-type") ?? "", /application\/xml|text\/xml/);
  const sitemapBody = await sitemap.text();
  assert.match(sitemapBody, new RegExp(`${escapedExpectedSiteUrl}/developers`));
  assert.match(sitemapBody, new RegExp(`${escapedExpectedSiteUrl}/projects/promptify`));
  assert.match(sitemapBody, new RegExp(`${escapedExpectedSiteUrl}/llms\\.txt`));
  assert.match(sitemapBody, new RegExp(`${escapedExpectedSiteUrl}/openapi\\.json`));

  const sitemapUrls = [...sitemapBody.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
  for (const pathname of sitemapUrls) {
    const response = await request(pathname);
    assert.equal(response.status, 200, `sitemap URL ${pathname}`);
  }

  const robots = await request("/robots.txt");
  assert.equal(robots.status, 200);
  assert.match(robots.headers.get("content-type") ?? "", /^text\/plain/);
  const robotsBody = await robots.text();
  assert.match(robotsBody, new RegExp(`Sitemap: ${escapedExpectedSiteUrl}/sitemap\\.xml`));
  assert.doesNotMatch(robotsBody, /Disallow: \/api\//);

  const openapi = await request("/openapi.json");
  assert.equal(openapi.status, 200);
  assert.match(openapi.headers.get("content-type") ?? "", /application\/vnd\.oai\.openapi\+json/);
  const document = await openapi.json();
  assert.equal(document.openapi, "3.1.1");
  assert.ok(document.paths["/api/v1/posts"]);
  assert.ok(document.paths["/api/posts"]);
  assert.ok(document.components.schemas.ProblemDetails);
  assert.ok(document.components.schemas.PostsPage);
  assert.equal(document.paths["/api/v1/posts"].get.operationId, "listPublishedPosts");
  assert.equal(document.paths["/api/v1/posts"].get.responses["200"].content["application/json"].schema.$ref, "#/components/schemas/PostsPage");
  for (const status of ["400", "404", "429", "500"]) {
    assert.equal(document.paths["/api/v1/posts"].get.responses[status].content["application/problem+json"].schema.$ref, "#/components/schemas/ProblemDetails");
  }
  assert.equal(document.paths["/api/v1/posts"].get.responses["429"].headers["Retry-After"].schema.type, "integer");
  assert.ok(document.paths["/api/v1/posts"].get.responses["200"].headers["RateLimit-Policy"]);
  assert.ok(document.paths["/api/v1/posts"].get.responses["200"].headers.Deprecation);
  assert.ok(document.paths["/api/v1/posts"].get.responses["200"].headers.Sunset);
  assert.match(JSON.stringify(document), /Deprecation|Sunset/);
  assert.equal(document["x-api-versioning"].canonicalPath, "/api/v1/posts");
  assert.equal(document["x-api-versioning"].deprecationPolicy.policyUrl, `${expectedSiteUrl}/developers/api/versioning`);

  for (const path of ["/developers", "/developers/api", "/developers/api/versioning", "/developers/auth", "/developers/mcp"]) {
    const response = await request(path);
    assert.equal(response.status, 200, path);
  }
});

test("public Markdown alternates cover the homepage and developer resources", async () => {
  const paths = [
    "/index.md",
    "/about.md",
    "/contact.md",
    "/privacy.md",
    "/blog.md",
    "/developers.md",
    "/developers/api.md",
    "/developers/api/versioning.md",
    "/developers/auth.md",
    "/developers/mcp.md",
    "/projects/promptify.md",
  ];

  for (const pathname of paths) {
    const response = await request(pathname, { headers: { Accept: "text/html" } });
    assert.equal(response.status, 200, pathname);
    assert.match(response.headers.get("content-type") ?? "", /^text\/markdown/, pathname);
    assert.match(await response.text(), /^# /, pathname);
  }
});

test("homepage has meaningful server-rendered content without JavaScript", async () => {
  const [response, sections] = await Promise.all([
    request("/", { headers: { Accept: "text/html" } }),
    readFile(new URL("../src/components/sections.tsx", import.meta.url), "utf8"),
  ]);
  const html = await response.text();
  const contentOnly = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const headings = [...html.matchAll(/<h([1-6])\b[^>]*>/gi)].map((match) => Number(match[1]));

  assert.equal(response.status, 200);
  assert.match(html, /<h1[^>]*>Ideas deserve their own orbit\.<\/h1>/);
  assert.match(html, /Laurent Maxhuni developer portfolio/);
  assert.match(html, /href="\/developers\/api\/versioning"/);
  assert.ok(contentOnly.length >= 500, `homepage text was only ${contentOnly.length} characters`);
  assert.ok(headings.includes(1));
  assert.ok(headings.filter((level) => level === 2).length >= 3);
  assert.doesNotMatch(sections, /^\s*["']use client["']/);
});

test("versioned posts API returns typed errors and rate-limit metadata", async () => {
  const headers = { Accept: "application/json", "X-API-Version": "1" };
  const response = await request("/api/v1/posts", { headers });
  assert.ok([200, 500].includes(response.status));
  assert.equal(response.headers.get("api-version"), "1");
  assert.match(response.headers.get("ratelimit-limit") ?? "", /^60$/);
  assert.match(response.headers.get("ratelimit-remaining") ?? "", /^\d+$/);
  assert.match(response.headers.get("ratelimit-reset") ?? "", /^\d+$/);
  assert.match(response.headers.get("ratelimit") ?? "", /limit=60/);
  assert.equal(response.headers.get("ratelimit-policy"), '"default";q=60;w=60');
  assert.match(response.headers.get("link") ?? "", /rel="deprecation"/);

  if (response.status === 200) {
    const body = await response.json();
    assert.ok(Array.isArray(body.docs));
    assert.equal(typeof body.totalDocs, "number");
  } else {
    assert.match(response.headers.get("content-type") ?? "", /^application\/problem\+json/);
  }

  const unsupportedVersion = await request("/api/v1/posts", {
    headers: { Accept: "application/json", "X-API-Version": "2" },
  });
  assert.equal(unsupportedVersion.status, 400);
  assert.match(unsupportedVersion.headers.get("content-type") ?? "", /^application\/problem\+json/);
  const problem = await unsupportedVersion.json();
  assert.equal(problem.status, 400);
  assert.equal(problem.code, "unsupported_api_version");
  assert.equal(typeof problem.message, "string");

  const compatibility = await request("/api/posts", { headers: { Accept: "application/json" } });
  assert.ok([200, 500].includes(compatibility.status));
  assert.equal(compatibility.headers.get("api-version"), "1");
});

test("API rate limiting returns Retry-After when the quota is exceeded", async () => {
  const rateLimitHeaders = {
    Accept: "application/json",
    "X-API-Version": "2",
    "X-Forwarded-For": "203.0.113.17",
  };
  for (let index = 0; index < 60; index += 1) {
    const response = await request(`/api/v1/posts?limit=1&probe=${index}`, { headers: rateLimitHeaders });
    assert.equal(response.status, 400, `unexpected response at request ${index + 1}: ${response.status}`);
  }

  const limited = await request("/api/v1/posts?limit=1&probe=limited", { headers: rateLimitHeaders });
  assert.equal(limited.status, 429);
  assert.match(limited.headers.get("content-type") ?? "", /^application\/problem\+json/);
  assert.equal(limited.headers.get("ratelimit-remaining"), "0");
  assert.equal(limited.headers.get("ratelimit-policy"), '"default";q=60;w=60');
  assert.match(limited.headers.get("link") ?? "", /rel="deprecation"/);
  assert.match(limited.headers.get("retry-after") ?? "", /^\d+$/);
  const problem = await limited.json();
  assert.equal(problem.code, "rate_limit_exceeded");
});

test("homepage exposes canonical, Open Graph, and JSON-LD identity data", async () => {
  const response = await request("/", { headers: { Accept: "text/html" } });
  const html = await response.text();
  assert.match(html, new RegExp(`rel="canonical" href="${escapedExpectedSiteUrl}`));
  assert.match(html, /property="og:type" content="website"/);
  assert.match(html, /property="og:image"/);
  assert.match(html, /name="twitter:card" content="summary_large_image"/);
  assert.match(html, /rel="manifest" href="\/manifest\.webmanifest"/);
  assert.match(html, /https:\/\/news\.google\.com\/swg\/js\/v1\/publisher\.js/);
  assert.match(html, /google-add-preferred-source-btn=""/);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /"@type":"Person"/);
  assert.match(html, /"@type":"Organization"/);
  assert.match(html, /"@type":"WebSite"/);
  assert.match(html, /"@type":"PostalAddress"/);
  assert.match(html, new RegExp(`"@id":"${escapedExpectedSiteUrl}/#person"`));
  assert.match(html, new RegExp(`"@id":"${escapedExpectedSiteUrl}/#website"`));
});

test("homepage uses the black-hole hero, places the globe in contact CTA, promotes ideator.dev, and contains no sparkle treatment", async () => {
  const [hero, sections, styles] = await Promise.all([
    readFile(new URL("../src/components/hero-section.tsx", import.meta.url), "utf8"),
    readFile(new URL("../src/components/sections.tsx", import.meta.url), "utf8"),
    readFile(new URL("../src/app/(frontend)/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(hero, /@\/components\/blackhole-hero-section/);
  assert.match(hero, /glow=\{0\}/);
  assert.doesNotMatch(hero, /GlobeStudy|PlanetScene|Sparkles|hero__flare|@\/components\/black-hole-hero/);
  assert.match(sections, /@\/components\/ui\/globe-study/);
  assert.match(sections, /contact-orbit__globe/);
  assert.match(sections, /<GlobeStudy opacity=\{0\.78\} brightness=\{1\.04\}/);
  assert.match(sections, /project\.kind === "product" \|\| project\.id === "ideator-dev"/);
  assert.match(sections, /project\.kind === "repository" && project\.id !== "ideator-dev"/);
  assert.doesNotMatch(sections, /Sparkles|contact-orbit__glow/);
  assert.match(styles, /\.hero__black-hole/);
  assert.match(styles, /\.contact-orbit__globe/);
  assert.doesNotMatch(styles, /contact-orbit__glow/);
});

test("homepage polish keeps the hero restrained, project previews single-framed, and skill labels separated", async () => {
  const [home, skills, styles, orbitStyles] = await Promise.all([
    readFile(new URL("../src/app/(frontend)/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../src/components/orbiting-skills.tsx", import.meta.url), "utf8"),
    readFile(new URL("../src/app/(frontend)/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../src/components/shadcn-space/orbiting-circles/orbiting-circles-02.css", import.meta.url), "utf8"),
  ]);

  assert.match(styles, /\.hero--black-hole h1 \{[^}]*font-size: clamp\(3\.5rem, 8\.2vw, 7\.6rem\)/);
  assert.doesNotMatch(styles, /\.project-preview::before/);
  assert.match(styles, /\.project-preview img \{ border: 0; box-shadow: none; \}/);
  assert.match(skills, /OrbitingCircles02/);
  assert.match(skills, /https:\/\/svgl\.app\/library\/python\.svg/);
  assert.match(skills, /src=\{skill\.logo\}/);
  assert.match(orbitStyles, /@keyframes orbit-cw/);
  assert.match(orbitStyles, /@keyframes orbit-ccw/);
  assert.doesNotMatch(styles, /--orbit: 35%/);
  assert.doesNotMatch(home, /Built with/);
});

test("Google's official preferred-source button has a button-only layout wrapper", async () => {
  const [component, styles] = await Promise.all([
    readFile(new URL("../src/components/google-preferred-source.tsx", import.meta.url), "utf8"),
    readFile(new URL("../src/app/(frontend)/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(component, /google-preferred-source__button/);
  assert.match(component, /google-add-preferred-source-btn=""/);
  assert.match(component, /data-theme="light"/);
  assert.match(styles, /\.google-preferred-source__button/);
  assert.match(styles, /background: transparent;/);
});

test("ideator.dev points to its live workbench and uses its live-site capture", async () => {
  const portfolio = await readFile(new URL("../src/content/portfolio.ts", import.meta.url), "utf8");

  assert.match(portfolio, /id: "ideator-dev"[\s\S]*?kind: "product"/);
  assert.match(portfolio, /https:\/\/ideator-dev-lm\.vercel\.app/);
  assert.match(portfolio, /src: "\/images\/projects\/ideator-capture\.png"/);
  assert.match(portfolio, /ideator\.dev homepage showing an illustrated night sky/);
});

test("important public pages have one canonical URL and complete social metadata", async () => {
  const paths = [
    "/", "/about", "/contact", "/privacy", "/blog", "/developers", "/developers/api", "/developers/api/versioning", "/developers/auth", "/developers/mcp",
    "/projects/promptify", "/projects/ideator-dev",
  ];
  const titles = new Set();

  for (const path of paths) {
    const response = await request(path, { headers: { Accept: "text/html" } });
    assert.equal(response.status, 200, path);
    const html = await response.text();
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1];

    assert.ok(title, `${path} title`);
    assert.ok(!titles.has(title), `${path} has a unique title`);
    titles.add(title);
    if (path.startsWith("/developers")) assert.match(title, /Laurent Maxhuni/);
    assert.equal((html.match(/rel="canonical"/g) ?? []).length, 1, `${path} canonical count`);
    assert.match(html, /property="og:title"/);
    assert.match(html, /property="og:description"/);
    assert.match(html, /property="og:image"/);
    assert.match(html, /name="twitter:card" content="summary_large_image"/);
    assert.doesNotMatch(html, /name="robots" content="noindex/);
  }
});

test("project brief pages explain the problem, approach, and build", async () => {
  for (const path of ["/projects/promptify", "/projects/ideator-dev"]) {
    const response = await request(path, { headers: { Accept: "text/html" } });
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.match(html, /The problem/);
    assert.match(html, /My approach/);
    assert.match(html, /What I built/);
    assert.match(html, /"@type":"(SoftwareApplication|SoftwareSourceCode)"/);
  }
});

test("web manifest is valid and declares the existing favicon", async () => {
  const response = await request("/manifest.webmanifest");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /application\/manifest\+json/);
  const manifest = await response.json();
  assert.equal(manifest.name, "Laurent Maxhuni | Developer and product builder");
  assert.equal(manifest.start_url, "/");
  assert.equal(manifest.icons[0].src, "/icon.png");
  const icon = await request("/icon.png");
  assert.equal(icon.status, 200);
  assert.match(icon.headers.get("content-type") ?? "", /^image\/png/);

  const openGraphImage = await request("/opengraph-image");
  assert.equal(openGraphImage.status, 200);
  assert.match(openGraphImage.headers.get("content-type") ?? "", /^image\/png/);

  const googleVerification = await request("/google333cd27a0755db9d.html");
  assert.equal(googleVerification.status, 200);
  assert.match(await googleVerification.text(), /google-site-verification: google333cd27a0755db9d\.html/);
});

test("Search Console verification has a documented build-time configuration path", async () => {
  const [layout, envExample, siteConfig, payloadConfig] = await Promise.all([
    readFile(new URL("../src/app/(frontend)/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../.env.example", import.meta.url), "utf8"),
    readFile(new URL("../src/lib/site.ts", import.meta.url), "utf8"),
    readFile(new URL("../payload.config.ts", import.meta.url), "utf8"),
  ]);
  assert.match(layout, /process\.env\.GOOGLE_SITE_VERIFICATION/);
  const configuredSiteUrl = envExample.match(/^NEXT_PUBLIC_SITE_URL=(.+)$/m)?.[1];
  assert.ok(configuredSiteUrl, "canonical site URL in .env.example");
  assert.equal(new URL(configuredSiteUrl).origin, configuredSiteUrl);
  assert.match(siteConfig, new RegExp(escapeRegExp(configuredSiteUrl)));
  assert.doesNotMatch(envExample, /NEXT_PUBLIC_SERVER_URL/);
  assert.match(siteConfig, /process\.env\.NEXT_PUBLIC_SITE_URL/);
  assert.match(payloadConfig, /serverURL: SITE_URL/);
  assert.match(envExample, /^GOOGLE_SITE_VERIFICATION=your-google-search-console-token$/m);
});

test("blog posts retain article metadata, structured data, and an H1-to-H2 content hierarchy", async () => {
  const template = await readFile(new URL("../src/app/(frontend)/blog/[slug]/page.tsx", import.meta.url), "utf8");
  assert.match(template, /alternates: \{ canonical: pathname \}/);
  assert.match(template, /type: "article"/);
  assert.match(template, /"@type": "BlogPosting"/);
  assert.match(template, /"@type": "BreadcrumbList"/);
  assert.match(template, /components=\{\{ h1: \(\{ children \}\) => <h2>/);
});

test("trust pages contain substantive public content", async () => {
  for (const path of ["/about", "/contact", "/privacy"]) {
    const response = await request(path);
    assert.equal(response.status, 200, path);
    assert.ok((await response.text()).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").length >= 500, path);
  }
});

test("MCP endpoint completes initialization, discovery, tools, and compliant GET handling", async () => {
  const requestHeaders = {
    Accept: "application/json, text/event-stream",
    "Content-Type": "application/json",
  };
  const initialize = await request("/.well-known/mcp", {
    method: "POST",
    headers: requestHeaders,
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "agent-readiness-test", version: "1.0.0" } },
    }),
  });
  assert.equal(initialize.status, 200);
  assert.match(initialize.headers.get("content-type") ?? "", /^application\/json/);
  assert.equal(initialize.headers.get("mcp-protocol-version"), "2025-06-18");
  assert.match(initialize.headers.get("link") ?? "", /\/developers\/mcp/);
  assert.match(initialize.headers.get("vary") ?? "", /mcp-protocol-version/i);
  const initialized = await initialize.json();
  assert.equal(initialized.result.serverInfo.name, "laurent-maxhuni-portfolio");

  const tools = await request("/.well-known/mcp", {
    method: "POST",
    headers: { ...requestHeaders, "MCP-Protocol-Version": "2025-06-18" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 2, method: "tools/list", params: {} }),
  });
  assert.equal(tools.status, 200);
  const listedTools = (await tools.json()).result.tools;
  assert.deepEqual(listedTools.map((tool) => tool.name), ["search_portfolio", "get_site_guide", "list_published_posts"]);
  const postsTool = listedTools.find((tool) => tool.name === "list_published_posts");
  assert.equal(postsTool.inputSchema.properties.limit.type, "integer");
  assert.equal(postsTool.outputSchema.properties.totalPages.type, "integer");

  const postsCall = await request("/.well-known/mcp", {
    method: "POST",
    headers: { ...requestHeaders, "MCP-Protocol-Version": "2025-06-18" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 4,
      method: "tools/call",
      params: { name: "list_published_posts", arguments: { limit: 1, page: 1 } },
    }),
  });
  assert.equal(postsCall.status, 200);
  const postsCallBody = await postsCall.json();
  assert.equal(postsCallBody.jsonrpc, "2.0");
  if (postsCallBody.result) {
    assert.equal(typeof postsCallBody.result.structuredContent.totalDocs, "number");
    assert.equal(typeof postsCallBody.result.structuredContent.totalPages, "number");
  } else {
    assert.equal(postsCallBody.error.code, -32603);
  }

  const get = await request("/.well-known/mcp", { headers: { Accept: "text/event-stream" } });
  assert.equal(get.status, 405);
  assert.equal(get.headers.get("allow"), "POST");

  const options = await request("/.well-known/mcp", { method: "OPTIONS" });
  assert.equal(options.status, 204);
  assert.match(options.headers.get("allow") ?? "", /POST/);
  assert.match(options.headers.get("accept-post") ?? "", /application\/json/);

  const invalidOrigin = await request("/.well-known/mcp", {
    method: "POST",
    headers: { ...requestHeaders, Origin: "https://untrusted.example" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 3, method: "ping" }),
  });
  assert.equal(invalidOrigin.status, 403);
});
