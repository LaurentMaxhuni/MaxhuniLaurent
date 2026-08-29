import type { Project } from "@/content/portfolio";
import {
  absoluteUrl,
  PERSON,
  PERSON_ID,
  PORTFOLIO_ID,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_ROOT_URL,
  WEBSITE_ID,
} from "@/lib/site";

const personNode = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: PERSON.name,
  url: SITE_ROOT_URL,
  description: PERSON.description,
  jobTitle: PERSON.jobTitle,
  homeLocation: {
    "@type": "Place",
    name: PERSON.location,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Vushtrri",
      addressCountry: "XK",
    },
  },
  knowsAbout: PERSON.knowsAbout,
  sameAs: PERSON.sameAs,
} as const;

export function homepageStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      personNode,
      {
        "@type": "Organization",
        "@id": PORTFOLIO_ID,
        name: `${SITE_NAME} Portfolio`,
        url: SITE_ROOT_URL,
        description: "The public developer portfolio and project archive for Laurent Maxhuni.",
        founder: { "@id": PERSON_ID },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Vushtrri",
          addressCountry: "XK",
        },
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name: SITE_NAME,
        url: SITE_ROOT_URL,
        description: SITE_DESCRIPTION,
        inLanguage: "en",
        about: { "@id": PERSON_ID },
        creator: { "@id": PERSON_ID },
        publisher: { "@id": PORTFOLIO_ID },
      },
    ],
  };
}

export function profileStructuredData() {
  const profileUrl = absoluteUrl("/about");

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${profileUrl}#profile`,
        url: profileUrl,
        name: "About Laurent Maxhuni — Full-Stack Developer from Kosovo",
        isPartOf: { "@id": WEBSITE_ID },
        mainEntity: { "@id": PERSON_ID },
      },
      personNode,
    ],
  };
}

const supportedProgrammingLanguages = new Set(["TypeScript", "JavaScript", "Python", "Rust"]);

export function projectStructuredData(project: Project, canonicalUrl: string) {
  const repositoryLink = project.links.find((link) => link.href.includes("github.com/"));
  const programmingLanguage = project.tags.filter((tag) => supportedProgrammingLanguages.has(tag));
  const screenshot = project.screenshots[0];

  return {
    "@context": "https://schema.org",
    "@type": project.kind === "product" ? "SoftwareApplication" : "SoftwareSourceCode",
    "@id": `${canonicalUrl}#project`,
    name: project.title,
    description: project.description,
    url: canonicalUrl,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    creator: { "@id": PERSON_ID },
    isPartOf: { "@id": WEBSITE_ID },
    ...(screenshot ? { image: absoluteUrl(screenshot.src) } : {}),
    ...(repositoryLink ? { codeRepository: repositoryLink.href } : {}),
    ...(programmingLanguage.length > 0 ? { programmingLanguage } : {}),
    ...(project.kind === "product"
      ? { applicationCategory: "WebApplication", operatingSystem: "Web Browser" }
      : {}),
  };
}
