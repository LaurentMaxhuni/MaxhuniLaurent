export type ProjectLink = {
  label: string;
  href: string;
};

export type ProjectScreenshot = {
  src: string;
  alt: string;
};

export type ProjectArtwork = {
  src: string;
  alt: string;
};

export type Project = {
  id: string;
  title: string;
  kind: "product" | "repository";
  summary: string;
  description: string;
  problem: string;
  approach: string;
  status: string;
  tags: string[];
  links: ProjectLink[];
  artwork?: ProjectArtwork;
  screenshots: ProjectScreenshot[];
};

// This is a static frontend source, not a CMS. Project details were read from
// LaurentMaxhuni's public GitHub profile and live product sites on August 23, 2026.
// Screenshots are real captures of each live product or repository page.
export const site = {
  name: "Laurent Maxhuni",
  role: "Developer and product builder",
  location: "Vushtrri, Kosovo",
  contactEmail: null as string | null,
  socials: [
    { label: "GitHub", href: "https://github.com/LaurentMaxhuni" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/laurent-maxhuni-56a394304/" },
    { label: "Blog", href: "/blog" },
  ],
};

export const projects: Project[] = [
  {
    id: "promptify",
    title: "Promptify",
    kind: "product",
    summary:
      "Chrome extension that improves prompts with one click in ChatGPT, Claude, Gemini, and Grok.",
    description:
      "A browser extension that improves prompts inside the AI chat you are using, with frameworks such as RACE, CREO, TAG, and CREATE.",
    problem:
      "Rough prompts often need structure, but opening another tool pulls you out of the conversation.",
    approach:
      "I built a Chrome extension that keeps prompt frameworks beside the active chat and turns rough requests into clearer instructions without a context switch.",
    status: "Live browser extension",
    tags: ["TypeScript", "Chrome Extensions", "AI tooling"],
    links: [
      { label: "Visit product", href: "https://promptifying.vercel.app" },
      { label: "View repository", href: "https://github.com/LaurentMaxhuni/promptify" },
    ],
    screenshots: [
      {
        src: "/images/projects/promptify-capture.png",
        alt: "Promptify homepage with the headline Transform rough prompts into crystal-clear instructions.",
      },
    ],
  },
  {
    id: "vuent-ai",
    title: "Vuent.ai",
    kind: "product",
    summary:
      "AI application concept with separate chat, code, and design modes.",
    description:
      "A product concept for chat, code, and design tasks in one focused interface.",
    problem:
      "Multi-purpose AI products can feel like a pile of modes with no clear path into the task at hand.",
    approach:
      "I gave chat, code, and design their own entry points so people can choose a mode without sorting through an undifferentiated menu.",
    status: "Product concept",
    tags: ["AI product UI", "frontend development"],
    links: [{ label: "Visit product", href: "https://vuentai.netlify.app" }],
    screenshots: [
      {
        src: "/images/projects/vuent-capture.png",
        alt: "Vuent.ai homepage with the headline Welcome to Vuent.ai over a blue and purple gradient.",
      },
    ],
  },
  {
    id: "free-ai",
    title: "free-ai",
    kind: "product",
    summary:
      "Free AI chat and image generation with multiple models, Flux image generation, and no credit card required.",
    description:
      "A web app for chatting with several AI models and generating images after signing in.",
    problem:
      "Trying more than one model or moving between chat and image generation usually means bouncing between separate services and pricing gates.",
    approach:
      "I put chat and Flux image generation in one app, with a straightforward path from sign-in to model selection and generation.",
    status: "Live web product",
    tags: ["TypeScript", "AI platform", "Vercel"],
    links: [
      { label: "Visit product", href: "https://free-ai-lm.vercel.app" },
      { label: "View repository", href: "https://github.com/LaurentMaxhuni/free-ai" },
    ],
    screenshots: [
      {
        src: "/images/projects/free-ai-capture.png",
        alt: "free.ai homepage with the headline Free AI Chat & Image Generation for Everyone.",
      },
    ],
  },
  {
    id: "agent-skills",
    title: "agent-skills",
    kind: "repository",
    summary:
      "Reusable agent workflows for frontend audits, accessibility passes, bug hunts, refactors, and more.",
    description:
      "Each skill defines a practical workflow, hard scope, verification gates, and an evidence-backed handoff format. Installable with the skills CLI.",
    problem:
      "Agent-assisted development becomes inconsistent when recurring work has no shared definition of done.",
    approach:
      "I collected focused, installable workflows that spell out scope, verification, and handoff expectations for common engineering tasks.",
    status: "Open-source repository",
    tags: ["AI agent skills", "developer tooling", "Markdown"],
    links: [{ label: "Open repository", href: "https://github.com/LaurentMaxhuni/agent-skills" }],
    screenshots: [
      {
        src: "/images/projects/agent-skills-capture.png",
        alt: "GitHub page for the agent-skills repository showing the skills index table.",
      },
    ],
  },
  {
    id: "allofos",
    title: "AllOfOS",
    kind: "repository",
    summary:
      "An index of official operating-system download links for Windows, Linux distributions, and specialized systems.",
    description:
      "Official vendor pages for install media and recovery, with notes for daily drivers, homelabs, and cybersecurity testing.",
    problem:
      "Finding a legitimate operating-system download can involve too much searching and too many unofficial mirrors.",
    approach:
      "I built a vendor-first index for official installation, recovery, and release resources, with the context needed to choose the right one.",
    status: "Open-source documentation",
    tags: ["Documentation", "open source"],
    links: [{ label: "Open repository", href: "https://github.com/LaurentMaxhuni/AllOfOS" }],
    screenshots: [
      {
        src: "/images/projects/allofos-capture.png",
        alt: "GitHub page for the AllOfOS repository with its operating-system download README.",
      },
    ],
  },
  {
    id: "easeyourstartup",
    title: "easeyourstartup",
    kind: "repository",
    summary:
      "Launch-campaign software for solo founders that scans a product site, builds an editable Brand DNA profile, and generates copy for each channel.",
    description:
      "It includes SSRF-aware site scanning, campaign briefs for X, LinkedIn, Product Hunt, Reddit, and email, visual templates, Stripe billing, and Neon Postgres persistence.",
    problem:
      "Founders often have to translate a product into launch material for several channels before they have a consistent message or campaign plan.",
    approach:
      "I designed a flow that scans a product site, builds an editable Brand DNA profile, and creates channel-specific launch material.",
    status: "SaaS repository",
    tags: ["TypeScript", "Next.js", "SaaS"],
    links: [{ label: "Open repository", href: "https://github.com/LaurentMaxhuni/easeyourstartup" }],
    screenshots: [
      {
        src: "/images/projects/easeyourstartup-capture.png",
        alt: "GitHub page for the easeyourstartup repository showing its TypeScript file structure.",
      },
    ],
  },
  {
    id: "fscan",
    title: "fscan",
    kind: "repository",
    summary:
      "A Python scanning utility under active development, with source and commit history on GitHub.",
    description:
      "An experimental tool in Laurent's public archive. Check the repository for its latest state.",
    problem:
      "Small scanning experiments need a compact, inspectable starting point instead of a hidden or overbuilt system.",
    approach:
      "I kept this as a narrow Python utility with the implementation and commit history visible for review as it develops.",
    status: "Experimental repository",
    tags: ["Python", "utilities"],
    links: [{ label: "Open repository", href: "https://github.com/LaurentMaxhuni/fscan" }],
    screenshots: [
      {
        src: "/images/projects/fscan-capture.png",
        alt: "GitHub page for the fscan repository.",
      },
    ],
  },
  {
    id: "parley",
    title: "parley",
    kind: "product",
    summary:
      "A pricing advisor for freelancers and small businesses that helps set rates and draft counteroffers when clients push back.",
    description:
      "Parley helps independents set rates before a project starts and respond to discount requests with a prepared counteroffer.",
    problem:
      "Independent workers can underprice their work when they are unsure what to charge or how to answer a discount request in the moment.",
    approach:
      "I made pricing a guided decision: set a defensible rate, then prepare a clear counteroffer before a negotiation turns reactive.",
    status: "Live web product",
    tags: ["TypeScript", "AI", "pricing tools"],
    links: [
      { label: "Visit product", href: "https://parley-pricing-copilot.vercel.app" },
      { label: "View repository", href: "https://github.com/LaurentMaxhuni/parley" },
    ],
    screenshots: [
      {
        src: "/images/projects/parley-capture.png",
        alt: "Parley homepage with the headline Know what to charge. Hold the line when they push back.",
      },
    ],
  },
  {
    id: "simplycutouts",
    title: "simplycutouts",
    kind: "product",
    summary:
      "Browser-based background removal that keeps images on your device.",
    description:
      "Your image stays on your device while the background removal runs in the browser.",
    problem:
      "Removing an image background often requires uploading a private asset to a remote service before seeing whether the result is usable.",
    approach:
      "I kept the image in the browser and focused the interface on one fast cutout task.",
    status: "Live web product",
    tags: ["TypeScript", "browser tech", "image processing"],
    links: [
      { label: "Visit product", href: "https://simplycutouts.vercel.app" },
      { label: "View repository", href: "https://github.com/LaurentMaxhuni/simplycutouts" },
    ],
    screenshots: [
      {
        src: "/images/projects/simplycutouts-capture.png",
        alt: "SimplyCutouts homepage with the headline Remove image backgrounds instantly and a drop-an-image panel.",
      },
    ],
  },
  {
    id: "scholaris",
    title: "scholaris",
    kind: "repository",
    summary:
      "A desktop study assistant that OCRs PDFs and generates AI summaries, answers, and quizzes with markdown and LaTeX previews.",
    description:
      "Built with tkinter and ttkbootstrap, with a dark multi-page GUI, PaddleOCR/RapidOCR text extraction, and Groq or OpenAI models.",
    problem:
      "Study material trapped in PDFs is slow to review when extracting, summarizing, and checking understanding each need a separate step.",
    approach:
      "I assembled a desktop study assistant that combines OCR, model-assisted summaries and questions, and readable Markdown or LaTeX previews.",
    status: "Open-source desktop app",
    tags: ["Python", "Tkinter", "OCR", "AI"],
    links: [{ label: "Open repository", href: "https://github.com/LaurentMaxhuni/scholaris" }],
    screenshots: [
      {
        src: "/images/projects/scholaris-capture.png",
        alt: "GitHub page for the scholaris repository showing its study-assistant README.",
      },
    ],
  },
  {
    id: "ideator-dev",
    title: "ideator.dev",
    kind: "product",
    summary:
      "A product-discovery workbench for turning a person, recurring tension, and sharp constraint into a testable direction.",
    description:
      "A live product-discovery tool that helps people shape an early idea before it turns into generic generated copy.",
    problem:
      "Early product ideas need room to develop before they are forced into a finished workflow.",
    approach:
      "I keep this TypeScript idea lab public and lightweight so its evolving structure and experiments remain easy to inspect.",
    status: "Live idea-discovery workbench",
    tags: ["TypeScript", "product discovery", "experiment"],
    links: [
      { label: "Visit product", href: "https://ideator-dev-lm.vercel.app" },
      { label: "View repository", href: "https://github.com/LaurentMaxhuni/ideator.dev" },
    ],
    screenshots: [
      {
        src: "/images/projects/ideator-capture.png",
        alt: "ideator.dev homepage showing an illustrated night sky and its idea-discovery workbench headline.",
      },
    ],
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.id === slug) ?? null;
}

export const capabilities = [
  {
    label: "Frontend",
    items: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS", "Vue", "Angular"],
  },
  {
    label: "Backend and data",
    items: ["Node.js", "Express.js", "MySQL", "Firebase", "Python"],
  },
  {
    label: "Shipping",
    items: ["Git", "GitHub", "VS Code", "Chrome extensions", "Vercel", "Netlify", "SEO-focused writing"],
  },
];

export const credibilityNotes = [
  "Built and shipped public AI tools and browser extensions.",
  "Maintains more than 25 public GitHub repositories across frontend, backend, and experimental work.",
  "Brings mathematics and physics practice to structured problem solving.",
  "Uses an MDX blog for case studies, technical notes, and SEO-focused writing.",
];

export const awards = [
  { title: "1st Place, National Physics Competition", year: "2026" },
  { title: "1st Place, Communal Physics Competition", year: "2026" },
  { title: "3rd Place, National Physics Competition", year: "2025" },
  { title: "1st Place, Communal Physics Competition", year: "2025" },
  { title: "1st Place, Communal Math Olympiad", year: "2023" },
];
