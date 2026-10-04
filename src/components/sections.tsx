import { ArrowUpRight, Code2, MessagesSquare, Orbit } from "lucide-react";
import CompetitionTimeline from "@/components/competition-timeline";
import OrbitingSkills from "@/components/orbiting-skills";
import ProjectLanes from "@/components/project-lanes";
import Reveal from "@/components/reveal";
import GlobeStudy from "@/components/ui/globe-study";
import { awards, credibilityNotes, projects, site } from "@/content/portfolio";

export function ProjectsSection() {
  const featuredProjects = projects.filter((project) => project.kind === "product" || project.id === "ideator-dev");
  const rotation = featuredProjects.length % projects.length;
  const mixedProjects = [...projects.slice(rotation), ...projects.slice(0, rotation)];
  const marqueeRows = [
    mixedProjects.filter((_, index) => index % 2 === 0),
    mixedProjects.filter((_, index) => index % 2 !== 0),
  ];
  return (
    <section id="projects" className="projects-section section" aria-labelledby="projects-title">
      <div className="shell">
        <Reveal className="section-intro section-intro--split">
          <div>
            <h2 id="projects-title">Work built around real problems.</h2>
          </div>
          <p>Browse the full line-up across two lanes.</p>
        </Reveal>

        <Reveal className="project-lanes-reveal">
          <ProjectLanes rows={marqueeRows} />
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
          <h2 id="practice-title">A broad stack with a consistent approach.</h2>
          <p className="practice-section__intro-note">I work with TypeScript, React, Next.js, Node.js, Python, PostgreSQL, and AI/LLM APIs to build useful interfaces, products, and developer tools.</p>
        </Reveal>
        <Reveal className="practice-orbit">
          <OrbitingSkills />
        </Reveal>
        <Reveal className="credibility-bubble">
          <div className="credibility-bubble__intro">
            <Orbit aria-hidden="true" size={20} />
            <div>
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
    <>
      <section id="about" className="about-section section" aria-labelledby="about-title">
        <div className="shell about-layout">
          <Reveal className="about-card">
            <h2 id="about-title">A developer who builds and publishes.</h2>
            <p>
              I&apos;m a developer and product builder from Vushtrri, Kosovo. I work across frontend development, AI tools, browser extensions, and experiments.
            </p>
            <a className="round-link round-link--light" href="#contact">Get in touch <ArrowUpRight aria-hidden="true" size={17} /></a>
          </Reveal>
        </div>
      </section>
      <section id="competition" className="competition-section section" aria-labelledby="competition-record-title">
        <div className="shell">
          <Reveal className="competition-record">
            <div className="competition-record__header">
              <h2 id="competition-record-title">Competition record</h2>
              <p className="competition-record__note">Results from physics and mathematics competitions.</p>
            </div>
            <CompetitionTimeline awards={awards} />
          </Reveal>
        </div>
      </section>
    </>
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
          <h2 id="contact-title">Let&apos;s talk about the work.</h2>
          <p>Share what you&apos;re building, what you want to achieve, and when you&apos;re hoping to make it happen.</p>
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
