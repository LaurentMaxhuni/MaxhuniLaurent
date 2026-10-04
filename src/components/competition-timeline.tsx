import ChangelogContent, { type Release } from "@/components/shadcn-studio/blocks/timeline-component-05/timeline-component-05";
import { Badge } from "@/components/ui/badge";

type CompetitionAward = {
  title: string;
  year: string;
  description?: string;
};

type CompetitionTimelineProps = {
  awards: CompetitionAward[];
};

export default function CompetitionTimeline({ awards }: CompetitionTimelineProps) {
  const years = [...new Set(awards.map((award) => award.year))].sort((a, b) => Number(b) - Number(a));
  const releases: Release[] = years.map((year) => {
    const results = awards.filter((award) => award.year === year);

    return {
      version: year,
      date: `${results.length} ${results.length === 1 ? "result" : "results"}`,
      content: (
        <ul className="competition-timeline__results">
          {results.map((award) => {
            const separator = award.title.indexOf(", ");
            const placement = separator > -1 ? award.title.slice(0, separator) : null;
            const competition = separator > -1 ? award.title.slice(separator + 2) : award.title;

            return (
              <li key={award.title} className="competition-timeline__result">
                {placement && <Badge variant="outline" className="competition-timeline__placement">{placement}</Badge>}
                <h3>{competition}</h3>
                {award.description && <p>{award.description}</p>}
              </li>
            );
          })}
        </ul>
      ),
    };
  });

  return <ChangelogContent releases={releases} />;
}
