import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";

import Navbar from "@/components/navbar";
import SiteFooter from "@/components/site-footer";
import { Starfield } from "@/components/ui/starfield-1";
import { getProjectBySlug, projects } from "@/content/portfolio";
import { absoluteUrl, SITE_NAME, SITE_OG_IMAGE, SITE_URL } from "@/lib/site";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.id }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project not found", robots: { index: false, follow: false } };

  const pathname = `/projects/${project.id}`;
  const image = project.screenshots[0]?.src ?? project.artwork?.src ?? SITE_OG_IMAGE;
  const title = `${project.title} project`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description: project.summary,
    alternates: { canonical: pathname },
    openGraph: {
      type: "website",
      url: pathname,
      title: `${title} | ${SITE_NAME}`,
      description: project.summary,
      images: [{ url: image, alt: project.screenshots[0]?.alt ?? project.artwork?.alt ?? `${project.title} project` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description: project.summary,
      images: [image],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const image = project.screenshots[0] ?? project.artwork;
  const canonicalUrl = absoluteUrl(`/projects/${project.id}`);
  const schemaType = project.kind === "product" ? "SoftwareApplication" : "SoftwareSourceCode";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": schemaType,
    "@id": `${canonicalUrl}#project`,
    name: project.title,
    description: project.summary,
    url: canonicalUrl,
    image: image ? [new URL(image.src, SITE_URL).toString()] : undefined,
    author: { "@id": `${absoluteUrl("/")}#person` },
    keywords: project.tags.join(", "),
    ...(project.kind === "product" ? { applicationCategory: "WebApplication", operatingSystem: "Web Browser" } : { codeRepository: project.links.find((link) => link.label.includes("repository"))?.href }),
  };

  return (
    <>
      <a className="skip-link" href="#project-brief">Skip to project brief</a>
      <Navbar />
      <main className="project-case" id="project-brief">
        <section className="project-case__hero" aria-labelledby="project-title">
          <Starfield className="project-case__starfield" starCount={154} />
          <div className="shell project-case__hero-grid">
            <div>
              <nav className="project-case__breadcrumb" aria-label="Breadcrumb">
                <ol>
                  <li><Link href="/">Home</Link></li>
                  <li><Link href="/#projects">Projects</Link></li>
                  <li aria-current="page">{project.title}</li>
                </ol>
              </nav>
              <h1 id="project-title">{project.title}</h1>
              <p className="project-case__lede">{project.summary}</p>
              <div className="project-case__actions">
                <a className="blue-button" href={project.links[0]?.href} target="_blank" rel="noreferrer">
                  {project.links[0]?.label ?? "Open project"} <ArrowUpRight aria-hidden="true" size={18} />
                </a>
                <Link className="project-case__back" href="/#projects"><ArrowLeft aria-hidden="true" size={17} /> Back to projects</Link>
              </div>
            </div>
            {image && (
              <figure className="project-case__visual">
                <Image src={image.src} alt={image.alt} fill priority sizes="(min-width: 1000px) 46vw, calc(100vw - 40px)" />
              </figure>
            )}
          </div>
        </section>

        <section className="shell project-case__brief" aria-label={`${project.title} project brief`}>
          <article className="mission-card mission-card--problem" aria-label="The problem">
            <h2>What this project is designed to make easier.</h2>
            <p>{project.problem}</p>
          </article>
          <article className="mission-card mission-card--approach" aria-label="My approach">
            <h2>A deliberate route, not a feature dump.</h2>
            <p>{project.approach}</p>
          </article>
          <article className="mission-card mission-card--build" aria-label="What I built">
            <h2>The tools and details behind it.</h2>
            <p>{project.description}</p>
            <ul className="project-case__tags" aria-label={`${project.title} technologies`}>
              {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
            </ul>
          </article>
        </section>

        <section className="shell project-case__links" aria-labelledby="project-links-title">
          <div>
            <h2 id="project-links-title">See the live project and source.</h2>
          </div>
          <div className="project-case__external-links">
            {project.links.map((link) => (
              <a key={link.href} className="round-link" href={link.href} target="_blank" rel="noreferrer">
                {link.label} <ArrowUpRight aria-hidden="true" size={17} />
              </a>
            ))}
          </div>
        </section>

      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
