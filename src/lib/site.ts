export const SITE_URL = "https://laurentmaxhuni.vercel.app";
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
  "/developers/auth",
  "/developers/mcp",
  "/llms.txt",
  "/openapi.json",
] as const;

export function absoluteUrl(pathname = "/") {
  return new URL(pathname, SITE_URL).toString();
}
