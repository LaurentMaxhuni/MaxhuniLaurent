import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Code2, Layers3, MessagesSquare, Orbit } from "lucide-react";
import OrbitingSkills from "@/components/orbiting-skills";
import RepositoryArchive from "@/components/repository-archive";
import Reveal from "@/components/reveal";
import GlobeStudy from "@/components/ui/globe-study";
import { awards, credibilityNotes, projects, site, type Project } from "@/content/portfolio";

function ProjectMarqueeCard({ project, duplicate = false }: { project: Project; duplicate?: boolean }) {
  const asset = project.screenshots[0] ?? project.artwork;

  return (
    <Link
      className="project-marquee__card"
      href={`/projects/${project.id}`}
      tabIndex={duplicate ? -1 : undefined}
      aria-hidden={duplicate || undefined}
    >
      <span className="project-marquee__media">
        {asset ? <Image src={asset.src} alt={duplicate ? "" : asset.alt} fill sizes="(max-width: 699px) 78vw, 360px" /> : null}
        <span className="project-marquee__shade" aria-hidden="true" />
      </span>
      <span className="project-marquee__meta">
        <span>{project.kind === "product" ? "live build" : "repository"}</span>
        <span>{String(projects.indexOf(project) + 1).padStart(2, "0")}</span>
      </span>
      <span className="project-marquee__title">{project.title}</span>
      <span className="project-marquee__summary">{project.summary}</span>
      <span className="project-marquee__arrow" aria-hidden="true"><ArrowUpRight size={18} /></span>
    </Link>
  );
}

export function ProjectsSection() {
  const featuredProjects = projects.filter((project) => project.kind === "product" || project.id === "ideator-dev");
  const rotation = featuredProjects.length % projects.length;
  const mixedProjects = [...projects.slice(rotation), ...projects.slice(0, rotation)];
  const marqueeRows = [
    mixedProjects.filter((_, index) => index % 2 === 0),
    mixedProjects.filter((_, index) => index % 2 !== 0),
  ];
  const repositoryList = projects.filter((project) => project.kind === "repository" && project.id !== "ideator-dev");

  return (
    <section id="projects" className="projects-section section" aria-labelledby="projects-title">
      <div className="shell">
        <Reveal className="section-intro section-intro--split">
          <div>
            <p className="section-kicker"><Layers3 aria-hidden="true" size={16} /> Projects</p>
            <h2 id="projects-title">Work built around real problems.</h2>
          </div>
          <p>
            The full project line-up is mixed across two steady lanes. Pause a lane to choose a project, then use the archive to inspect the details.
          </p>
        </Reveal>

        <div className="project-marquees" role="region" aria-label="Selected projects">
          {marqueeRows.map((row, rowIndex) => (
            <Reveal key={rowIndex} className={`project-marquee project-marquee--${rowIndex === 0 ? "forward" : "reverse"}`}>
              <div className="project-marquee__viewport">
                <div className="project-marquee__track">
                  <div className="project-marquee__set">
                    {row.map((project) => <ProjectMarqueeCard key={project.id} project={project} />)}
                  </div>
                  <div className="project-marquee__set" aria-hidden="true">
                    {row.map((project) => <ProjectMarqueeCard key={`${project.id}-duplicate`} project={project} duplicate />)}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <RepositoryArchive repositories={repositoryList} />
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
          <p className="practice-section__intro-note">Explore the tools behind the interfaces, products, and AI systems I build.</p>
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
            <GlobeStudy opacity={0.78} brightness={1.04} />
          </div>
          <p className="section-kicker">Contact</p>
          <h2 id="contact-title">Let&apos;s talk about the work.</h2>
          <p>Working on a product, an idea, or an interface that needs attention?</p>
          <a className="blue-button blue-button--large" href={primaryHref} target={site.contactEmail ? undefined : "_blank"} rel={site.contactEmail ? undefined : "noreferrer"}>
            {primaryLabel} <ArrowUpRight aria-hidden="true" size={20} />
          </a>
          <div className="contact-links" aria-label="Secondary contact links">
            {github && <a href={github.href} target="_blank" rel="noreferrer" className="contact-links__link"><Code2 aria-hidden="true" size={17} /> GitHub</a>}
            {linkedin && <a href={linkedin.href} target="_blank" rel="noreferrer" className="contact-links__link"><MessagesSquare aria-hidden="true" size={17} /> LinkedIn</a>}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
