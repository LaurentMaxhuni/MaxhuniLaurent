import { capabilities, projects } from "@/content/portfolio";
import { developerResources } from "@/lib/agent-content";
import { PERSON } from "@/lib/site";

/**
 * A compact, semantic fallback for crawlers and people browsing with scripts
 * disabled. The normal visual homepage remains unchanged; this content is
 * only emitted inside <noscript> so the no-JavaScript representation has an
 * explicit heading hierarchy and named resource links.
 */
export default function AgentReadableSummary() {
  return (
    <noscript>
      <section className="agent-readable-summary" aria-labelledby="agent-readable-summary-title">
        <h2 id="agent-readable-summary-title">Laurent Maxhuni developer portfolio</h2>
        <p>
          {PERSON.description} This portfolio documents web applications, AI products, browser extensions, open-source repositories, and developer-tool experiments. Use the project pages and primary repository links to inspect the work, read the public signal archive, or choose a developer resource for an automated integration.
        </p>
        <h3>Public work</h3>
        <ul>
          {projects.map((project) => (
            <li key={project.id}>
              <a href={`/projects/${project.id}`}>{project.title}</a>: {project.summary}
            </li>
          ))}
        </ul>
        <h3>Technical range</h3>
        <ul>
          {capabilities.map((capability) => (
            <li key={capability.label}>
              <strong>{capability.label}:</strong> {capability.items.join(", ")}
            </li>
          ))}
        </ul>
        <h3>Developer resources</h3>
        <ul>
          {developerResources.map(([name, path, description]) => (
            <li key={path}>
              <a href={path}>{name}</a>: {description}
            </li>
          ))}
        </ul>
      </section>
    </noscript>
  );
}
