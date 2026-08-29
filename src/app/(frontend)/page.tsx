import type { Metadata } from "next";
import Link from "next/link";

import HeroSection from "@/components/hero-section";
import GooglePreferredSource from "@/components/google-preferred-source";
import JsonLd from "@/components/json-ld";
import Navbar from "@/components/navbar";
import AgentReadableSummary from "@/components/agent-readable-summary";
import { AboutSection, ContactSection, PracticeSection, ProjectsSection } from "@/components/sections";
import { PERSON, SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL, absoluteUrl } from "@/lib/site";
import { homepageStructuredData } from "@/lib/structured-data";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { absolute: SITE_TITLE },
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [{ url: absoluteUrl("/opengraph-image"), width: 1200, height: 630, alt: SITE_TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [absoluteUrl("/opengraph-image")],
  },
};

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#projects">Skip to projects</a>
      <Navbar />
      <main>
        <HeroSection />
        <ProjectsSection />
        <PracticeSection />
        <AboutSection />
        <ContactSection />
        <GooglePreferredSource />
        <AgentReadableSummary />
      </main>
      <footer className="site-footer">
        <div className="shell">
          <nav aria-label="Footer navigation">
            <Link href="/about">About</Link> · <Link href="/contact">Contact</Link> · <Link href="/privacy">Privacy</Link> · <Link href="/developers">Developer resources</Link>
          </nav>
          <p>© 2026 {PERSON.name} · {PERSON.role} from {PERSON.location}</p>
        </div>
      </footer>
      <JsonLd data={homepageStructuredData()} />
    </>
  );
}
