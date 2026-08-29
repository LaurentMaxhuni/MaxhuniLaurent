const DEFAULT_SITE_URL = "https://laurentmaxhuni.vercel.app";

function getSiteUrl() {
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_SITE_URL;
  const siteUrl = new URL(configuredSiteUrl);

  if (siteUrl.protocol !== "http:" && siteUrl.protocol !== "https:") {
    throw new Error("NEXT_PUBLIC_SITE_URL must use http or https.");
  }

  if (siteUrl.pathname !== "/" || siteUrl.search || siteUrl.hash) {
    throw new Error("NEXT_PUBLIC_SITE_URL must be an origin without a path, query, or hash.");
  }

  return siteUrl.origin;
}

// This is the single canonical origin used by metadata, structured data,
// feeds, sitemaps, robots.txt, API documentation, and absolute links.
export const SITE_URL = getSiteUrl();
export const SITE_NAME = "Laurent Maxhuni";
export const SITE_DESCRIPTION =
  "Portfolio, public project index, and developer resources for Laurent Maxhuni.";
export const SITE_OG_IMAGE = "/opengraph-image";
export const SITE_SAME_AS = [
  "https://github.com/LaurentMaxhuni",
  "https://www.linkedin.com/in/laurent-maxhuni-56a394304/",
] as const;
export const GOOGLE_PREFERRED_SOURCE_URL =
  `https://www.google.com/preferences/source?q=${encodeURIComponent(SITE_URL)}`;

export const CORE_SITE_PATHS = [
  "/",
  "/about",
  "/contact",
  "/privacy",
  "/blog",
  "/developers",
  "/developers/api",
  "/developers/api/versioning",
  "/developers/auth",
  "/developers/mcp",
  "/llms.txt",
  "/openapi.json",
] as const;

export function absoluteUrl(pathname = "/") {
  return new URL(pathname, SITE_URL).toString();
}
