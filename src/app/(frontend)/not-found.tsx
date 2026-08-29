import type { Metadata } from "next";
import Link from "next/link";

import Navbar from "@/components/navbar";
import SiteFooter from "@/components/site-footer";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Page not found",
  description: "The requested page is not part of Laurent Maxhuni's public portfolio.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="not-found-page">
        <section className="shell not-found-page__card" aria-labelledby="not-found-title">
          <p className="section-kicker">404</p>
          <h1 id="not-found-title">This page does not exist.</h1>
          <p>
            The page you requested is not part of Laurent Maxhuni&apos;s public portfolio. Start from the project index, blog, or developer resources and follow a published link.
          </p>
          <div className="not-found-page__links">
            <Link className="blue-button" href="/">Portfolio home</Link>
            <Link className="round-link" href="/developers">Developer resources</Link>
            <a className="round-link" href="/llms.txt">LLMs index</a>
            <a className="round-link" href="/sitemap.xml">XML sitemap</a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
