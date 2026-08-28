"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Code2, Search } from "lucide-react";

import { projects, type Project } from "@/content/portfolio";

type RepositoryArchiveProps = {
  repositories: Project[];
};

export default function RepositoryArchive({ repositories }: RepositoryArchiveProps) {
  const [query, setQuery] = useState("");
  const visibleRepositories = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return repositories;
    return repositories.filter((repo) => repo.title.toLowerCase().includes(normalized));
  }, [query, repositories]);

  return (
    <section className="repo-archive" aria-labelledby="repository-archive-title">
      <div className="repo-archive__head">
        <div>
          <p className="section-kicker"><Code2 aria-hidden="true" size={16} /> Public repositories</p>
          <h3 id="repository-archive-title">Repositories with the context to inspect them.</h3>
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
    </section>
  );
}
