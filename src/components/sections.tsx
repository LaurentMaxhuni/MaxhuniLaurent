"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Code2, Layers3, MessagesSquare, Orbit, Search } from "lucide-react";
import OrbitingSkills from "@/components/orbiting-skills";
import TiltedCard from "@/components/TiltedCard";
import Reveal from "@/components/reveal";
import { Link001 } from "@/components/ui/skiper-ui/skiper40";
import GlobeStudy from "@/components/ui/globe-study";
import { awards, credibilityNotes, projects, site, type Project } from "@/content/portfolio";

function ProjectPreview({ project }: { project: Project }) {
  const asset = project.screenshots[0] ?? project.artwork;

  if (!asset) return null;

  return (
    <div className="project-preview">
      <TiltedCard
        imageSrc={asset.src}
        altText={asset.alt}
        captionText="move your cursor"
        containerHeight="100%"
        imageHeight="100%"
        imageWidth="100%"
        scaleOnHover={1.025}
        rotateAmplitude={8}
        showMobileWarning={false}
        showTooltip={false}
        displayOverlayContent
        overlayContent={
          <div className="project-preview__overlay" aria-hidden="true">
            <span>selected work</span>
            <span>{project.kind === "product" ? "live product" : "repository"}</span>
          </div>
        }
      />
    </div>
  );
}

export function ProjectsSection() {
  const featuredProjects = useMemo(
    () => projects.filter((project) => project.kind === "product" || project.id === "ideator-dev"),
    [],
  );
  const repositoryList = useMemo(
    () => projects.filter((project) => project.kind === "repository" && project.id !== "ideator-dev"),
    [],
  );
  const [query, setQuery] = useState("");

  const visibleRepositories = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return repositoryList;
    return repositoryList.filter((repo) => repo.title.toLowerCase().includes(normalized));
  }, [query, repositoryList]);

  return (
    <section id="projects" className="projects-section section" aria-labelledby="projects-title">
      <div className="shell">
        <Reveal className="section-intro section-intro--split">
          <div>
            <p className="section-kicker"><Layers3 aria-hidden="true" size={16} /> Projects</p>
            <h2 id="projects-title">Work built around real problems.</h2>
          </div>
          <p>
            Featured work first, then the full public archive. Every project links to its source or live product.
          </p>
        </Reveal>

        <div className="featured-grid">

          {featuredProjects.map((project) => (
            <Reveal key={project.id}>
              <article className="featured-card" aria-labelledby={`project-${project.id}`}>
                <ProjectPreview project={project} />
                <div className="featured-card__copy">
                  <p className="featured-card__meta">
                    <span>{project.kind === "product" ? "featured build" : "source archive"}</span>
                    <span>
                      {String(projects.indexOf(project) + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                    </span>
                  </p>
                  <h3 id={`project-${project.id}`}>{project.title}</h3>
                  <p className="featured-card__summary">{project.summary}</p>
                  <ul className="tag-list" aria-label={`${project.title} technologies`}>
                    {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
                  </ul>
                  <div className="featured-card__links">
                    <Link className="round-link" href={`/projects/${project.id}`}>
                      About project <ArrowUpRight aria-hidden="true" size={17} />
                    </Link>
                    {project.links.map((link) => (
                      <a key={link.href} className="round-link" href={link.href} target="_blank" rel="noreferrer">
                        {link.label} <ArrowUpRight aria-hidden="true" size={17} />
                      </a>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="repo-archive">
          <div className="repo-archive__head">
            <div>
              <p className="section-kicker"><Code2 aria-hidden="true" size={16} /> Public repositories</p>
              <h3>Repositories with the context to inspect them.</h3>
            </div>
            <label className="repo-search">
              <Search aria-hidden="true" size={16} />
              <span className="visually-hidden">Search repositories</span>
              <input
                type="search"
                placeholder="Search repositories..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
          </div>
          <ul className="repo-grid">
            {visibleRepositories.map((repo) => (
              <li key={repo.id}>
                <Link
                  className="repo-card"
                  href={`/projects/${repo.id}`}
                  aria-label={`Open ${repo.title} project brief`}
                >
                  <span className="repo-card__index">{String(projects.indexOf(repo) + 1).padStart(2, "0")}</span>
                  <span className="repo-card__name">{repo.title}</span>
                  <ArrowUpRight className="repo-card__arrow" size={17} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
          {visibleRepositories.length === 0 && (
            <p className="repo-empty" role="status">No repositories match &ldquo;{query.trim()}&rdquo;.</p>
          )}
        </Reveal>
      </div>
    </section>
  );
}

export function PracticeSection() {
  return (
    <section id="practice" className="practice-section section" aria-labelledby="practice-title">
      <div className="shell">
        <Reveal className="section-intro">
          <p className="section-kicker"><Orbit aria-hidden="true" size={16} /> Technical range</p>
          <h2 id="practice-title">A broad stack with a consistent approach.</h2>
        </Reveal>
        <Reveal className="practice-orbit">
          <OrbitingSkills />
        </Reveal>
        <Reveal className="credibility-bubble">
          <div className="credibility-bubble__intro">
            <Orbit aria-hidden="true" size={20} />
            <div>
              <p className="section-kicker">Track record</p>
              <h3>Work, not claims.</h3>
            </div>
          </div>
          <ul className="credibility-list">
            {credibilityNotes.map((note) => <li key={note}>{note}</li>)}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

export function AboutSection() {
  return (
    <section id="about" className="about-section section" aria-labelledby="about-title">
      <div className="shell about-layout">
        <Reveal className="about-card">
          <p className="section-kicker">About Laurent</p>
          <h2 id="about-title">A developer who builds and publishes.</h2>
          <p>
            Laurent Maxhuni is a developer and product builder from Vushtrri, Kosovo. His work spans frontend development, AI tools, browser extensions, and experiments.
          </p>
          <a className="round-link round-link--light" href="#contact">Get in touch <ArrowUpRight aria-hidden="true" size={17} /></a>
        </Reveal>
        <Reveal className="awards-card">
          <p className="section-kicker">Competition record</p>
          <ul>
            {awards.map((award) => (
              <li key={`${award.year}-${award.title}`}>
                <span>{award.year}</span>
                <strong>{award.title}</strong>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

export function ContactSection() {
  const github = site.socials.find((social) => social.label === "GitHub");
  const linkedin = site.socials.find((social) => social.label === "LinkedIn");
  const primaryHref = site.contactEmail ? `mailto:${site.contactEmail}` : linkedin?.href ?? github?.href ?? "#top";
  const primaryLabel = site.contactEmail ? "Start a project" : "Connect on LinkedIn";

  return (
    <section id="contact" className="contact-section section" aria-labelledby="contact-title">
      <div className="shell">
        <Reveal className="contact-orbit">
          <div className="contact-orbit__globe" aria-hidden="true">
            <GlobeStudy opacity={0.48} brightness={0.9} />
          </div>
          <p className="section-kicker">Contact</p>
          <h2 id="contact-title">Let&apos;s talk about the work.</h2>
          <p>Working on a product, an idea, or an interface that needs attention?</p>
          <a className="blue-button blue-button--large" href={primaryHref} target={site.contactEmail ? undefined : "_blank"} rel={site.contactEmail ? undefined : "noreferrer"}>
            {primaryLabel} <ArrowUpRight aria-hidden="true" size={20} />
          </a>
          <div className="contact-links" aria-label="Secondary contact links">
            {github && <Link001 href={github.href} className="contact-links__link"><Code2 aria-hidden="true" size={17} /> GitHub</Link001>}
            {linkedin && <Link001 href={linkedin.href} className="contact-links__link"><MessagesSquare aria-hidden="true" size={17} /> LinkedIn</Link001>}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
