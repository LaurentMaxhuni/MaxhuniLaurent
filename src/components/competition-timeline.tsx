"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

type CompetitionAward = {
  title: string;
  year: string;
};

type CompetitionTimelineProps = {
  awards: CompetitionAward[];
};

export default function CompetitionTimeline({ awards }: CompetitionTimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const entryRefs = useRef<Array<HTMLLIElement | null>>([]);
  const [progress, setProgress] = useState(0);
  const [enhanced, setEnhanced] = useState(false);
  const [visibleEntries, setVisibleEntries] = useState<Set<number>>(
    () => new Set(awards.map((_, index) => index)),
  );

  useEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline) return;

    let frame = 0;
    const updateProgress = () => {
      frame = 0;
      const bounds = timeline.getBoundingClientRect();
      const start = window.innerHeight * 0.78;
      const end = window.innerHeight * 0.28;
      const scrollDistance = Math.max(1, bounds.height + start - end);
      const nextProgress = (start - bounds.top) / scrollDistance;
      setProgress(Math.max(0, Math.min(1, nextProgress)));
    };
    const scheduleProgress = () => {
      if (!frame) frame = window.requestAnimationFrame(updateProgress);
    };

    setEnhanced(true);
    updateProgress();
    window.addEventListener("scroll", scheduleProgress, { passive: true });
    window.addEventListener("resize", scheduleProgress);

    if (typeof IntersectionObserver === "undefined") {
      return () => {
        window.removeEventListener("scroll", scheduleProgress);
        window.removeEventListener("resize", scheduleProgress);
        if (frame) window.cancelAnimationFrame(frame);
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        setVisibleEntries((current) => {
          const next = new Set(current);
          let changed = false;

          for (const entry of entries) {
            const index = Number((entry.target as HTMLElement).dataset.index);
            if (!Number.isInteger(index)) continue;

            if (entry.isIntersecting && !next.has(index)) {
              next.add(index);
              changed = true;
            } else if (!entry.isIntersecting && next.has(index)) {
              next.delete(index);
              changed = true;
            }
          }

          return changed ? next : current;
        });
      },
      { rootMargin: "-16% 0px -20%", threshold: 0.2 },
    );

    entryRefs.current.forEach((entry) => {
      if (entry) observer.observe(entry);
    });

    return () => {
      window.removeEventListener("scroll", scheduleProgress);
      window.removeEventListener("resize", scheduleProgress);
      observer.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [awards]);

  const activeIndex = awards.length
    ? Math.min(awards.length - 1, Math.floor(progress * awards.length))
    : -1;
  const timelineStyle = { "--timeline-progress": `${progress * 100}%` } as CSSProperties;

  return (
    <div
      ref={timelineRef}
      className={`competition-timeline ${enhanced ? "competition-timeline--enhanced" : ""}`}
      role="group"
      aria-label="Competition record timeline"
    >
      <div className="competition-timeline__canvas" style={timelineStyle}>
        <span className="competition-timeline__rail" aria-hidden="true" />
        <ol className="competition-timeline__list">
          {awards.map((award, index) => {
            const side = index % 2 === 0 ? "left" : "right";
            const isVisible = visibleEntries.has(index);
            const isActive = index <= activeIndex;

            return (
              <li
                key={`${award.year}-${award.title}`}
                ref={(entry) => {
                  entryRefs.current[index] = entry;
                }}
                className={`competition-timeline__entry competition-timeline__entry--${side} ${isVisible ? "is-visible" : ""} ${isActive ? "is-active" : ""}`}
                data-index={index}
              >
                <div className="competition-timeline__copy">
                  <div className="competition-timeline__meta">
                    <time dateTime={award.year} className="competition-timeline__year">{award.year}</time>
                    <span className="competition-timeline__index">{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <strong>{award.title}</strong>
                </div>
                <span className="competition-timeline__node" aria-hidden="true" />
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
