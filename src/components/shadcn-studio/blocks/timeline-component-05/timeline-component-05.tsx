import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

export interface Release {
  version: string;
  date: string;
  content: ReactNode;
}

interface ChangelogContentProps {
  releases: Release[];
}

export default function ChangelogContent({ releases }: ChangelogContentProps) {
  return (
    <div className="competition-timeline" role="group" aria-label="Competition record timeline">
      <ol className="competition-timeline__list">
        {releases.map((release) => (
          <li key={release.version} className="competition-timeline__entry">
            <div className="competition-timeline__meta competition-timeline__meta--desktop">
              <Badge variant="outline" className="competition-timeline__year">{release.version}</Badge>
              <span className="competition-timeline__count">{release.date}</span>
            </div>
            <div className="competition-timeline__rail" aria-hidden="true">
              <span className="competition-timeline__node"><span /></span>
            </div>
            <div className="competition-timeline__content">
              <div className="competition-timeline__meta competition-timeline__meta--mobile">
                <Badge variant="outline" className="competition-timeline__year">{release.version}</Badge>
                <span className="competition-timeline__count">{release.date}</span>
              </div>
              {release.content}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
