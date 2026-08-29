import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Radar } from "lucide-react";
import { notFound } from "next/navigation";

import JsonLd from "@/components/json-ld";
import Navbar from "@/components/navbar";
import SiteFooter from "@/components/site-footer";
import { Starfield } from "@/components/ui/starfield-1";
import { getProjectBySlug, projects } from "@/content/portfolio";
import { absoluteUrl, SITE_NAME, SITE_OG_IMAGE } from "@/lib/site";
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
  if (!project) return { title: "Project not found", robots: { index: false, follow: false } };

  const pathname = `/projects/${project.id}`;
  const image = project.screenshots[0]?.src ?? project.artwork?.src ?? SITE_OG_IMAGE;
  return pageMetadata({
    title: `${project.title} — ${project.seoTitle} | ${SITE_NAME}`,
    description: project.summary,
    pathname,
    image,
    imageAlt: project.screenshots[0]?.alt ?? project.artwork?.alt ?? `${project.title} project`,
  });
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const currentIndex = projects.findIndex((entry) => entry.id === project.id);
  const previous = projects[(currentIndex - 1 + projects.length) % projects.length];
  const next = projects[(currentIndex + 1) % projects.length];
  const image = project.screenshots[0] ?? project.artwork;
  const canonicalUrl = absoluteUrl(`/projects/${project.id}`);
  const jsonLd = projectStructuredData(project, canonicalUrl);

  return (
    <>
      <a className="skip-link" href="#project-brief">Skip to project brief</a>
      <Navbar />
      <main className="project-case" id="project-brief">
        <section className="project-case__hero" aria-labelledby="project-title">
          <Starfield className="project-case__starfield" starCount={154} />
          <div className="project-case__halo project-case__halo--one" aria-hidden="true" />
          <div className="project-case__halo project-case__halo--two" aria-hidden="true" />
          <div className="shell project-case__hero-grid">
            <div>
              <nav className="project-case__breadcrumb" aria-label="Breadcrumb">
                <ol>
                  <li><Link href="/">Home</Link></li>
                  <li><Link href="/#projects">Projects</Link></li>
                  <li aria-current="page">{project.title}</li>
                </ol>
              </nav>
              <p className="section-kicker"><Radar aria-hidden="true" size={15} /> {project.status}</p>
              <h1 id="project-title">{project.title}</h1>
              <p className="project-case__lede">{project.summary}</p>
              <p className="project-case__creator">Built by Laurent Maxhuni, a full-stack developer and AI builder from Vushtrri, Kosovo. <Link href="/about">About Laurent Maxhuni</Link></p>
              <div className="project-case__actions">
                <a className="blue-button" href={project.links[0]?.href} target="_blank" rel="noreferrer">
                  {project.links[0]?.label ?? "Open project"} <ArrowUpRight aria-hidden="true" size={18} />
                </a>
                <Link className="project-case__back" href="/#projects"><ArrowLeft aria-hidden="true" size={17} /> Back to projects</Link>
              </div>
            </div>
            {image && (
              <figure className="project-case__visual">
                <span className="project-case__orbit project-case__orbit--outer" aria-hidden="true" />
                <span className="project-case__orbit project-case__orbit--inner" aria-hidden="true" />
                <Image src={image.src} alt={image.alt} fill priority sizes="(min-width: 1000px) 46vw, calc(100vw - 40px)" />
              </figure>
            )}
          </div>
        </section>

        <section className="shell project-case__brief" aria-label={`${project.title} project brief`}>
          <article className="mission-card mission-card--problem">
            <p><span>01</span> The problem</p>
            <h2>What this project is designed to make easier.</h2>
            <p>{project.problem}</p>
          </article>
          <article className="mission-card mission-card--approach">
            <p><span>02</span> My approach</p>
            <h2>A deliberate route, not a feature dump.</h2>
            <p>{project.approach}</p>
          </article>
          <article className="mission-card mission-card--build">
            <p><span>03</span> What I built: technologies and focus</p>
            <h2>The tools and details behind it.</h2>
            <p>{project.description}</p>
            <ul className="project-case__tags" aria-label={`${project.title} technologies`}>
              {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
            </ul>
          </article>
        </section>

        <section className="shell project-case__links" aria-labelledby="project-links-title">
          <div>
            <p className="section-kicker">Project links</p>
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

        <nav className="shell project-case__pager" aria-label="More projects">
          <Link href={`/projects/${previous.id}`}><ArrowLeft aria-hidden="true" size={18} /><span>Previous project<strong>{previous.title}</strong></span></Link>
          <Link href={`/projects/${next.id}`}><span>Next project<strong>{next.title}</strong></span><ArrowRight aria-hidden="true" size={18} /></Link>
        </nav>
      </main>
      <SiteFooter />
      <JsonLd data={jsonLd} />
    </>
  );
}
