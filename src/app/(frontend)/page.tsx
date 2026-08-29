import type { Metadata } from "next";
import Link from "next/link";

import HeroSection from "@/components/hero-section";
import GooglePreferredSource from "@/components/google-preferred-source";
import Navbar from "@/components/navbar";
import AgentReadableSummary from "@/components/agent-readable-summary";
import { AboutSection, ContactSection, PracticeSection, ProjectsSection } from "@/components/sections";
import { absoluteUrl, SITE_DESCRIPTION, SITE_NAME, SITE_SAME_AS, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Laurent Maxhuni | Developer and product builder",
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title: "Laurent Maxhuni | Developer and product builder",
    description: SITE_DESCRIPTION,
    images: [{ url: absoluteUrl("/opengraph-image"), width: 1200, height: 630, alt: "Laurent Maxhuni developer and product builder" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Laurent Maxhuni | Developer and product builder",
    description: SITE_DESCRIPTION,
    images: [absoluteUrl("/opengraph-image")],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${absoluteUrl("/")}#person`,
      name: SITE_NAME,
      url: absoluteUrl("/"),
      description: "Developer and product builder working across frontend development, AI tools, and browser extensions.",
      jobTitle: "Developer and product builder",
      homeLocation: { "@type": "Place", name: "Vushtrri, Kosovo" },
      sameAs: SITE_SAME_AS,
    },
    {
      "@type": "Organization",
      "@id": `${absoluteUrl("/")}#organization`,
      name: SITE_NAME,
      url: absoluteUrl("/"),
      description: "The public professional portfolio and developer resources for Laurent Maxhuni.",
      founder: { "@id": `${absoluteUrl("/")}#person` },
      address: { "@type": "PostalAddress", addressLocality: "Vushtrri", addressCountry: "XK" },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "professional inquiries",
        url: absoluteUrl("/contact"),
        availableLanguage: "en",
      },
      sameAs: SITE_SAME_AS,
    },
    {
      "@type": "WebSite",
      "@id": `${absoluteUrl("/")}#website`,
      name: SITE_NAME,
      url: absoluteUrl("/"),
      description: SITE_DESCRIPTION,
      inLanguage: "en",
      publisher: { "@id": `${absoluteUrl("/")}#organization` },
    },
  ],
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
          <p>© 2026 Laurent Maxhuni</p>
        </div>
      </footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
