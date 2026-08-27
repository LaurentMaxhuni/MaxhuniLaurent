import type { ReactNode } from "react";
import Link from "next/link";

import Navbar from "@/components/navbar";
import SiteFooter from "@/components/site-footer";

type StaticPageProps = {
  eyebrow: string;
  title: string;
  lead: string;
  children: ReactNode;
  related?: Array<{ href: string; label: string }>;
};

export default function StaticPage({ eyebrow, title, lead, children, related = [] }: StaticPageProps) {
  return (
    <>
      <Navbar />
      <main className="static-page">
        <article className="shell static-page__article">
          <header className="static-page__header">
            <p className="section-kicker">{eyebrow}</p>
            <h1>{title}</h1>
            <p>{lead}</p>
          </header>
          <div className="static-page__content">{children}</div>
          {related.length > 0 && (
            <nav className="static-page__related" aria-label="Related resources">
              {related.map((item) => (
                <Link key={item.href} className="round-link" href={item.href}>{item.label}</Link>
              ))}
            </nav>
          )}
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
