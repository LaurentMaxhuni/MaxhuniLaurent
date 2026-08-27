import type { Metadata } from "next";

import StaticPage from "@/components/static-page";
import { privacyCopy } from "@/lib/agent-content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy",
  description: "Privacy practices for Laurent Maxhuni's public portfolio and developer resources.",
  pathname: "/privacy",
});

export default function PrivacyPage() {
  return (
    <StaticPage
      eyebrow="Privacy"
      title="A public portfolio that collects little data."
      lead="How this site handles the information needed to deliver its public pages."
      related={[
        { href: "/contact", label: "Contact guidance" },
        { href: "/developers", label: "Developer resources" },
      ]}
    >
      {privacyCopy.split("\n\n").map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
    </StaticPage>
  );
}
