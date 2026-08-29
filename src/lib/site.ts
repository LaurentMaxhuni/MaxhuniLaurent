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
export const SITE_ROOT_URL = new URL("/", SITE_URL).toString();
export const SITE_NAME = "Laurent Maxhuni";
export const SITE_SAME_AS = [
  "https://github.com/LaurentMaxhuni",
  "https://www.linkedin.com/in/laurent-maxhuni-56a394304/",
] as const;
export const PERSON_ID = `${SITE_ROOT_URL}#person`;
export const WEBSITE_ID = `${SITE_ROOT_URL}#website`;
export const PORTFOLIO_ID = `${SITE_ROOT_URL}#portfolio`;
const PERSON_AGE = 15;
const PERSON_BASE_ROLE = "full-stack developer and AI builder";
const PERSON_LOCATION = "Vushtrri, Kosovo";
const PERSON_WORK = "web products, AI software, developer tools, browser extensions, and open-source software";
export const PERSON = {
  name: SITE_NAME,
  age: PERSON_AGE,
  jobTitle: "Full-Stack Developer",
  role: `${PERSON_AGE}-year-old ${PERSON_BASE_ROLE}`,
  location: PERSON_LOCATION,
  work: PERSON_WORK,
  description: `${SITE_NAME} is a ${PERSON_AGE}-year-old ${PERSON_BASE_ROLE} from ${PERSON_LOCATION}. He builds ${PERSON_WORK}.`,
  knowsAbout: [
    "Full-stack development",
    "Web development",
    "Artificial intelligence",
    "TypeScript",
    "JavaScript",
    "React",
    "Next.js",
    "Node.js",
    "Python",
    "PostgreSQL",
    "Developer tools",
    "Browser extensions",
    "Open-source software",
  ],
  sameAs: SITE_SAME_AS,
} as const;
export const SITE_TITLE = "Laurent Maxhuni — Full-Stack Developer & AI Builder";
export const SITE_DESCRIPTION =
  `Portfolio of ${PERSON.name}, a ${PERSON.role} from ${PERSON.location}, creating ${PERSON.work}.`;
export const SITE_OG_IMAGE = "/opengraph-image";
export const GOOGLE_PREFERRED_SOURCE_URL =
  `https://www.google.com/preferences/source?q=${encodeURIComponent(SITE_URL)}`;

export const INDEXABLE_SITE_PATHS = [
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
] as const;

export function absoluteUrl(pathname = "/") {
  return new URL(pathname, SITE_URL).toString();
}
