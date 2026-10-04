import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";

import JsonLd from "@/components/json-ld";
import Navbar from "@/components/navbar";
import SiteFooter from "@/components/site-footer";
import { Starfield } from "@/components/ui/starfield-1";
import { getProjectBySlug, projects } from "@/content/portfolio";
import { absoluteUrl, SITE_NAME, SITE_URL } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { projectStructuredData } from "@/lib/structured-data";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.id }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { metadataBase: new URL(SITE_URL), title: "Project not found", robots: { index: false, follow: false } };

  const pathname = `/projects/${project.id}`;
  const image = absoluteUrl(`/projects/${project.id}/share-image`);
  return pageMetadata({
    title: `${project.title} — ${project.seoTitle} | ${SITE_NAME}`,
    description: project.summary,
    pathname,
    image,
    imageAlt: `${project.title} — ${project.status}`,
  });
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const images = project.screenshots.length > 0 ? project.screenshots : project.artwork ? [project.artwork] : [];
  const canonicalUrl = absoluteUrl(`/projects/${project.id}`);
  const jsonLd = projectStructuredData(project, canonicalUrl);
  const relatedByTechnology = projects.filter(
    (candidate) => candidate.id !== project.id && candidate.tags.some((tag) => project.tags.includes(tag)),
  );
  const relatedProjects = [
    ...relatedByTechnology,
    ...projects.filter((candidate) => candidate.id !== project.id && !relatedByTechnology.includes(candidate)),
  ].slice(0, 3);

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
              <p className="project-case__status">{project.status}</p>
              <p className="project-case__lede">{project.summary}</p>
              <p className="project-case__creator">Built by Laurent Maxhuni, a full-stack developer and AI builder from Vushtrri, Kosovo. <Link href="/about">About Laurent Maxhuni</Link></p>
              <div className="project-case__actions">
                <a className="blue-button" href={project.links[0]?.href} target="_blank" rel="noreferrer">
                  {project.links[0]?.label ?? "Open project"} <ArrowUpRight aria-hidden="true" size={18} />
                </a>
                <Link className="project-case__back" href="/#projects"><ArrowLeft aria-hidden="true" size={17} /> Back to projects</Link>
              </div>
            </div>
            {images.length > 0 && (
              <div className="project-case__gallery" aria-label={`${project.title} screenshots`}>
                {images.map((image, index) => (
                  <figure key={image.src} className="project-case__visual">
                    <Image src={image.src} alt={image.alt} fill priority={index === 0} sizes="(min-width: 1000px) 46vw, calc(100vw - 40px)" />
                  </figure>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="shell project-case__brief" aria-label={`${project.title} project brief`}>
          <article className="mission-card mission-card--problem" aria-label="The problem">
            <h2>Problem</h2>
            <p>{project.problem}</p>
          </article>
          <article className="mission-card mission-card--approach" aria-label="My approach">
            <h2>Approach</h2>
            <p>{project.approach}</p>
          </article>
          <article className="mission-card mission-card--build" aria-label="What I built">
            <h2>Implementation</h2>
            <p>{project.caseStudy?.implementation ?? project.description}</p>
            <ul className="project-case__tags" aria-label={`${project.title} technologies`}>
              {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
            </ul>
          </article>
        </section>

        {project.caseStudy && (
          <section className="shell project-case__study" aria-labelledby="case-study-title">
            <div className="project-case__study-heading">
              <span className="eyebrow">Case study</span>
              <h2 id="case-study-title">Who it serves and how it works</h2>
            </div>
            <dl className="project-case__study-grid">
              <div>
                <dt>Intended user</dt>
                <dd>{project.caseStudy.intendedUser}</dd>
              </div>
              <div>
                <dt>Workflow</dt>
                <dd>{project.caseStudy.workflow}</dd>
              </div>
              <div>
                <dt>Limitations</dt>
                <dd>{project.caseStudy.limitations}</dd>
              </div>
              <div>
                <dt>Evidence</dt>
                <dd>{project.caseStudy.evidence}</dd>
              </div>
            </dl>
          </section>
        )}

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

        <section className="shell related-projects" aria-labelledby="related-projects-title">
          <div className="related-projects__heading">
            <span className="eyebrow">Keep exploring</span>
            <h2 id="related-projects-title">Related projects</h2>
          </div>
          <ul>
            {relatedProjects.map((candidate) => (
                <li key={candidate.id}>
                  <Link href={`/projects/${candidate.id}`}>
                    <span>{candidate.status}</span>
                    <strong>{candidate.title}</strong>
                    <span>{candidate.summary}</span>
                    <ArrowUpRight aria-hidden="true" size={17} />
                  </Link>
                </li>
              ))}
          </ul>
        </section>

      </main>
      <SiteFooter />
      <JsonLd data={jsonLd} />
    </>
  );
}
