"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Code2, Layers3, MessagesSquare, Orbit, Search, Sparkles } from "lucide-react";
import TiltedCard from "@/components/TiltedCard";
import Reveal from "@/components/reveal";
import { Link001 } from "@/components/ui/skiper-ui/skiper40";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { awards, capabilities, credibilityNotes, projects, site, type Project } from "@/content/portfolio";

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
            <span>selected signal</span>
            <span>{project.kind === "product" ? "live product" : "repository"}</span>
          </div>
        }
      />
    </div>
  );
}

export function ProjectsSection() {
  const featuredProjects = useMemo(() => projects.filter((project) => project.kind === "product"), []);
  const repositoryList = useMemo(() => projects.filter((project) => project.kind === "repository"), []);
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
            <p className="section-kicker"><Layers3 aria-hidden="true" size={16} /> Project orbit</p>
            <h2 id="projects-title">Every project, one launchpad.</h2>
          </div>
          <p>
            Featured builds up top, the full public archive below — searchable and one click from the source.
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
              <p className="section-kicker"><Code2 aria-hidden="true" size={16} /> Source archive</p>
              <h3>Every public repository, one grid.</h3>
            </div>
            <label className="repo-search">
              <Search aria-hidden="true" size={16} />
              <span className="visually-hidden">Search repositories</span>
              <input
                type="search"
                placeholder="Search repositories…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
          </div>
          <ul className="repo-grid">
            {visibleRepositories.map((repo) => (
              <li key={repo.id}>
                <a
                  className="repo-card"
                  href={repo.links[0]?.href ?? "#"}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${repo.title} on GitHub`}
                >
                  <span className="repo-card__index">{String(projects.indexOf(repo) + 1).padStart(2, "0")}</span>
                  <span className="repo-card__name">{repo.title}</span>
                  <ArrowUpRight className="repo-card__arrow" size={17} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
          {visibleRepositories.length === 0 && (
            <p className="repo-empty" role="status">No repositories match “{query.trim()}”.</p>
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
          <p className="section-kicker"><Orbit aria-hidden="true" size={16} /> Working range</p>
          <h2 id="practice-title">The stack is broad. The point of view stays precise.</h2>
        </Reveal>
        <div className="practice-grid">
          {capabilities.map((capability) => (
            <Reveal key={capability.label} className="capability-card">
              <p>{capability.label}</p>
              <ul>
                {capability.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </Reveal>
          ))}
        </div>
        <Reveal className="credibility-bubble">
          <div className="credibility-bubble__intro">
            <Sparkles aria-hidden="true" size={20} />
            <div>
              <p className="section-kicker">Signal strength</p>
              <h3>Proof, not posturing.</h3>
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
          <h2 id="about-title">A developer building the interesting version.</h2>
          <p>
            Laurent Maxhuni is a developer and product builder from Vushtrri, Kosovo. The work moves between sharp frontend execution, useful AI tooling, browser extensions, and deliberate experiments.
          </p>
          <a className="round-link round-link--light" href="#contact">Start a conversation <ArrowUpRight aria-hidden="true" size={17} /></a>
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
          <div className="contact-orbit__glow" aria-hidden="true" />
          <p className="section-kicker">Open channel</p>
          <h2 id="contact-title">Good work starts with a good signal.</h2>
          <p>Have a product, an idea, or a complicated interface worth making better?</p>
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
