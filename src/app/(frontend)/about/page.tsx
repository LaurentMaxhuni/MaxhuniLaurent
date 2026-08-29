import type { Metadata } from "next";
import Link from "next/link";

import JsonLd from "@/components/json-ld";
import StaticPage from "@/components/static-page";
import { awards, getProjectBySlug } from "@/content/portfolio";
import { aboutCopy } from "@/lib/agent-content";
import { pageMetadata } from "@/lib/seo";
import { PERSON, absoluteUrl } from "@/lib/site";
import { profileStructuredData } from "@/lib/structured-data";

export const metadata: Metadata = pageMetadata({
  title: "About Laurent Maxhuni — Developer from Kosovo",
  description:
    `Learn about ${PERSON.name}, a ${PERSON.role} from ${PERSON.location}, and explore his public software work.`,
  pathname: "/about",
});

const selectedProjects = ["promptify", "free-ai", "ideator-dev", "agent-skills"]
  .map((slug) => getProjectBySlug(slug))
  .filter((project) => project !== null);

export default function AboutPage() {
  return (
    <>
      <StaticPage
        eyebrow={`About ${PERSON.name}`}
        title="A developer who builds and publishes."
        lead={PERSON.description}
        related={[
          { href: "/", label: "Explore Laurent's projects" },
          { href: "/contact", label: "Contact guidance" },
        ]}
      >
        <section className="profile-summary" aria-labelledby="profile-summary-title">
          <h2 id="profile-summary-title">Laurent Maxhuni at a glance.</h2>
          <dl>
            <div>
              <dt>Name</dt>
              <dd>{PERSON.name}</dd>
            </div>
            <div>
              <dt>Role</dt>
              <dd>{PERSON.role}</dd>
            </div>
            <div>
              <dt>Age</dt>
              <dd>{PERSON.age} years old</dd>
            </div>
            <div>
              <dt>Based in</dt>
              <dd>{PERSON.location}</dd>
            </div>
          </dl>
        </section>

        <section aria-labelledby="about-work-title">
          <h2 id="about-work-title">Building across the stack.</h2>
          {aboutCopy.split("\n\n").map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </section>

        <section aria-labelledby="selected-projects-title">
          <h2 id="selected-projects-title">Selected projects.</h2>
          <p>These public builds show the range behind Laurent&apos;s work, from AI products and browser extensions to open-source developer tools.</p>
          <ul className="profile-projects">
            {selectedProjects.map((project) => (
              <li key={project.id}>
                <Link href={`/projects/${project.id}`}>View {project.title}</Link>
                <span>{project.summary}</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="profiles-title">
          <h2 id="profiles-title">Profiles and public work.</h2>
          <p>Laurent publishes source code and professional updates under the same public name.</p>
          <ul className="profile-links">
            <li><a href={PERSON.sameAs[0]} target="_blank" rel="noreferrer">Laurent Maxhuni on GitHub</a></li>
            <li><a href={PERSON.sameAs[1]} target="_blank" rel="noreferrer">Laurent Maxhuni on LinkedIn</a></li>
          </ul>
        </section>

        <section aria-labelledby="competition-title">
          <h2 id="competition-title">Competition record.</h2>
          <p>Physics and mathematics competitions have strengthened the structured reasoning Laurent brings to software work.</p>
          <ul className="profile-awards">
            {awards.map((award) => (
              <li key={`${award.year}-${award.title}`}>
                <span>{award.year}</span>
                <strong>{award.title}</strong>
              </li>
            ))}
          </ul>
        </section>

        <p>
          For a compact, machine-readable record of the same work, agents can request <code>{absoluteUrl("/")}</code> with an <code>Accept: text/markdown</code> header or read <a href="/llms.txt">llms.txt</a>.
        </p>
      </StaticPage>
      <JsonLd data={profileStructuredData()} />
    </>
  );
}
