import { getAllPublishedPosts, PublishedPostsUnavailableError } from "@/lib/blog";
import { projects } from "@/content/portfolio";
import { INDEXABLE_SITE_PATHS, SITE_URL, absoluteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function escapeXml(value: string) {
  return value.replace(/[<>&'\"]/g, (character) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    "\"": "&quot;",
  })[character]!);
}

function sitemapEntry(url: string, lastModified?: string | Date | null) {
  const safeLastModified = lastModified ? new Date(lastModified) : null;
  const lastmod = safeLastModified && !Number.isNaN(safeLastModified.valueOf())
    ? `<lastmod>${safeLastModified.toISOString()}</lastmod>`
    : "";
  return `<url><loc>${escapeXml(url)}</loc>${lastmod}</url>`;
}

function xmlResponse(body: string, status = 200, headers: HeadersInit = {}) {
  return new Response(body, {
    status,
    headers: {
      "Content-Type": status === 200 ? "application/xml; charset=utf-8" : "text/plain; charset=utf-8",
      "Cache-Control": status === 200 ? "public, max-age=0, s-maxage=300" : "no-store",
      ...headers,
    },
  });
}

export async function GET() {
  try {
    const posts = await getAllPublishedPosts();
    const staticUrls = INDEXABLE_SITE_PATHS.map((pathname) =>
      sitemapEntry(pathname === "/" ? SITE_URL : absoluteUrl(pathname)),
    );
    const projectUrls = projects.map((project) => sitemapEntry(absoluteUrl(`/projects/${project.id}`)));
    const postUrls = posts.map((post) =>
      sitemapEntry(absoluteUrl(`/blog/${post.slug}`), post.updatedAt),
    );

    return xmlResponse([
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...staticUrls,
      ...projectUrls,
      ...postUrls,
      "</urlset>",
    ].join(""));
  } catch (error) {
    if (!(error instanceof PublishedPostsUnavailableError)) {
      console.error("[sitemap] Sitemap generation failed.");
    }

    return xmlResponse("Sitemap temporarily unavailable. Please retry in 60 seconds.", 503, {
      "Retry-After": "60",
    });
  }
}
