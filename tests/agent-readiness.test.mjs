import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";

const port = 3417;
const baseUrl = `http://127.0.0.1:${port}`;
let server;

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
      NEXT_PUBLIC_SERVER_URL: baseUrl,
      GOOGLE_SITE_VERIFICATION: "test-search-console-token",
    },
    stdio: "ignore",
  });
  await waitForServer();
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
});

test("agent discovery files and developer resources are public and well formed", async () => {
  const llms = await request("/llms.txt");
  assert.equal(llms.status, 200);
  assert.match(llms.headers.get("content-type") ?? "", /^text\/plain/);
  assert.match(await llms.text(), /## When to use this portfolio/);

  const sitemap = await request("/sitemap.xml");
  assert.equal(sitemap.status, 200);
  assert.match(sitemap.headers.get("content-type") ?? "", /application\/xml|text\/xml/);
  const sitemapBody = await sitemap.text();
  assert.match(sitemapBody, /https:\/\/laurentmaxhuni\.vercel\.app\/developers/);
  assert.match(sitemapBody, /https:\/\/laurentmaxhuni\.vercel\.app\/projects\/promptify/);

  const robots = await request("/robots.txt");
  assert.equal(robots.status, 200);
  assert.match(robots.headers.get("content-type") ?? "", /^text\/plain/);
  assert.match(await robots.text(), /Sitemap: https:\/\/laurentmaxhuni\.vercel\.app\/sitemap\.xml/);

  const openapi = await request("/openapi.json");
  assert.equal(openapi.status, 200);
  assert.match(openapi.headers.get("content-type") ?? "", /application\/vnd\.oai\.openapi\+json/);
  const document = await openapi.json();
  assert.equal(document.openapi, "3.1.1");
  assert.ok(document.paths["/api/posts"]);

  for (const path of ["/developers", "/developers/api", "/developers/auth", "/developers/mcp"]) {
    const response = await request(path);
    assert.equal(response.status, 200, path);
  }
});

test("homepage exposes canonical, Open Graph, and JSON-LD identity data", async () => {
  const response = await request("/", { headers: { Accept: "text/html" } });
  const html = await response.text();
  assert.match(html, /rel="canonical" href="https:\/\/laurentmaxhuni\.vercel\.app/);
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
  assert.match(sections, /<GlobeStudy opacity=\{0\.48\} brightness=\{0\.9\}/);
  assert.match(sections, /project\.kind === "product" \|\| project\.id === "ideator-dev"/);
  assert.match(sections, /project\.kind === "repository" && project\.id !== "ideator-dev"/);
  assert.doesNotMatch(sections, /Sparkles|contact-orbit__glow/);
  assert.match(styles, /\.hero__black-hole/);
  assert.match(styles, /\.contact-orbit__globe/);
  assert.doesNotMatch(styles, /contact-orbit__glow/);
});

test("homepage polish keeps the hero restrained, project previews single-framed, and skill labels separated", async () => {
  const [home, skills, styles] = await Promise.all([
    readFile(new URL("../src/app/(frontend)/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../src/components/orbiting-skills.tsx", import.meta.url), "utf8"),
    readFile(new URL("../src/app/(frontend)/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(styles, /\.hero--black-hole h1 \{[^}]*font-size: clamp\(3\.7rem, 8\.6vw, 8rem\)/);
  assert.doesNotMatch(styles, /\.project-preview::before/);
  assert.match(styles, /\.project-preview img \{ border: 0; box-shadow: none; \}/);
  assert.match(skills, /outerOrbit \? "min\(32vw, 275px\)" : "min\(27vw, 190px\)"/);
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
    "/", "/about", "/contact", "/privacy", "/blog", "/developers", "/developers/api", "/developers/auth", "/developers/mcp",
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
  assert.equal(manifest.icons[0].src, "/favicon.ico");
});

test("Search Console verification has a documented build-time configuration path", async () => {
  const [layout, envExample] = await Promise.all([
    readFile(new URL("../src/app/(frontend)/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../.env.example", import.meta.url), "utf8"),
  ]);
  assert.match(layout, /process\.env\.GOOGLE_SITE_VERIFICATION/);
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
  const initialized = await initialize.json();
  assert.equal(initialized.result.serverInfo.name, "laurent-maxhuni-portfolio");

  const tools = await request("/.well-known/mcp", {
    method: "POST",
    headers: { ...requestHeaders, "MCP-Protocol-Version": "2025-06-18" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 2, method: "tools/list", params: {} }),
  });
  assert.equal(tools.status, 200);
  assert.deepEqual((await tools.json()).result.tools.map((tool) => tool.name), ["search_portfolio", "get_site_guide"]);

  const get = await request("/.well-known/mcp", { headers: { Accept: "text/event-stream" } });
  assert.equal(get.status, 405);
  assert.equal(get.headers.get("allow"), "POST");

  const invalidOrigin = await request("/.well-known/mcp", {
    method: "POST",
    headers: { ...requestHeaders, Origin: "https://untrusted.example" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 3, method: "ping" }),
  });
  assert.equal(invalidOrigin.status, 403);
});
