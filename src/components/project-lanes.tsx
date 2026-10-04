"use client";

import { useCallback, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { projects, type Project } from "@/content/portfolio";

function useMediaQuery(query: string, serverSnapshot: boolean) {
  const subscribe = useCallback((callback: () => void) => {
    const media = window.matchMedia(query);
    media.addEventListener("change", callback);
    return () => media.removeEventListener("change", callback);
  }, [query]);
  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  const getServerSnapshot = useCallback(() => serverSnapshot, [serverSnapshot]);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function ProjectMarqueeCard({ project, index, duplicate = false }: { project: Project; index: number; duplicate?: boolean }) {
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
        <span>{project.status}</span>
        <span>{String(index + 1).padStart(2, "0")}</span>
      </span>
      <span className="project-marquee__title">{project.title}</span>
      <span className="project-marquee__summary">{project.summary}</span>
      <span className="project-marquee__arrow" aria-hidden="true"><ArrowUpRight size={18} /></span>
    </Link>
  );
}

export default function ProjectLanes({ rows }: { rows: Project[][] }) {
  const touchDevice = useMediaQuery("(pointer: coarse)", true);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)", true);
  const paused = touchDevice || reducedMotion;

  return (
    <div className="project-lanes" data-paused={paused}>
      <div className="project-marquees" role="region" aria-label="Selected projects">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className={`project-marquee project-marquee--${rowIndex === 0 ? "forward" : "reverse"}`}>
            <div className="project-marquee__viewport" tabIndex={0} aria-label={`Project lane ${rowIndex + 1}`}>
              <div className="project-marquee__track">
              <div className="project-marquee__set">
                  {row.map((project) => (
                    <ProjectMarqueeCard
                      key={project.id}
                      project={project}
                      index={projects.findIndex(({ id }) => id === project.id)}
                    />
                  ))}
                </div>
                <div className="project-marquee__set" aria-hidden="true">
                  {row.map((project) => (
                    <ProjectMarqueeCard
                      key={`${project.id}-duplicate`}
                      project={project}
                      index={projects.findIndex(({ id }) => id === project.id)}
                      duplicate
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
