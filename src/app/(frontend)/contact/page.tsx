import type { Metadata } from "next";

import StaticPage from "@/components/static-page";
import { contactCopy } from "@/lib/agent-content";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/content/portfolio";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: "Verified public contact channels and guidance for reaching Laurent Maxhuni.",
  pathname: "/contact",
});

export default function ContactPage() {
  return (
    <StaticPage
      eyebrow="Contact Laurent Maxhuni"
      title="Start with a clear message."
      lead="Use the verified public channels below for professional conversations."
      related={[
        { href: "/about", label: "About Laurent" },
        { href: "/privacy", label: "Privacy" },
      ]}
    >
      {contactCopy.split("\n\n").map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      <h2>Verified public channels</h2>
      <ul>
        {site.socials.filter((social) => social.label !== "Blog").map((social) => (
          <li key={social.href}><a href={social.href} target="_blank" rel="noreferrer">{social.label}</a></li>
        ))}
      </ul>
    </StaticPage>
  );
}
