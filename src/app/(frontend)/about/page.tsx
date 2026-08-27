import type { Metadata } from "next";

import StaticPage from "@/components/static-page";
import { aboutCopy } from "@/lib/agent-content";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description: "Background, working approach, and public project record for Laurent Maxhuni.",
  pathname: "/about",
});

export default function AboutPage() {
  return (
    <StaticPage
      eyebrow="About Laurent Maxhuni"
      title="A developer who builds and publishes."
      lead="The work, experiments, and notes behind the portfolio."
      related={[
        { href: "/", label: "Explore projects" },
        { href: "/contact", label: "Contact guidance" },
      ]}
    >
      {aboutCopy.split("\n\n").map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      <p>
        For a compact, machine-readable record of the same work, agents can request <code>{absoluteUrl("/")}</code> with an <code>Accept: text/markdown</code> header or read <a href="/llms.txt">llms.txt</a>.
      </p>
    </StaticPage>
  );
}
