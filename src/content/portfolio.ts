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
      "Chrome extension that upgrades prompts with one click across ChatGPT, Claude, Gemini, and Grok.",
    description:
      "A browser extension for improving prompts without interrupting the work already happening in an AI chat, with frameworks like RACE, CREO, TAG, and CREATE.",
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
      "AI application concept with multiple chatbot modes, including AI Code and AI Designer, presented as a polished product experience.",
    description:
      "A product concept exploring a set of AI modes, including chat, code, and design, through a focused application interface.",
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
      "Free AI chat and image generation platform with multiple models, Flux image generation, and no credit card required.",
    description:
      "A web platform for chatting with several AI models and generating images, built around free access with login.",
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
      "A focused collection of reusable agent skills for software quality — frontend audits, accessibility passes, bug hunts, refactors, and more.",
    description:
      "Each skill defines a practical workflow, hard scope, verification gates, and an evidence-backed handoff format. Installable with the skills CLI.",
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
      "A curated hub of official operating-system download links — Windows, Linux distros, and specialized systems — for faster downloading and no digging around.",
    description:
      "Organized around official vendor pages for install media, recovery paths, and practical notes for daily drivers, homelabs, and cybersecurity testing.",
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
      "A revenue-first launch campaign SaaS for solo founders — scans a product site, builds an editable Brand DNA profile, and generates channel-native launch copy.",
    description:
      "Includes SSRF-aware site scanning, campaign briefs for X, LinkedIn, Product Hunt, Reddit, and email, visual templates, Stripe billing, and Neon Postgres persistence.",
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
      "A Python scanning utility in active development — explore the source and commit history on GitHub.",
    description:
      "One of the experimental tools in Laurent's public archive. Check the repository for the latest state of the work.",
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
      "A pricing advisor for freelancers and small businesses — know what to charge and draft counter-offers when clients push back.",
    description:
      "Parley helps with the two ways independents lose money: under-pricing up front, and folding the moment a client asks for a discount.",
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
      "Local-first image background removal that runs entirely in the browser — clean cutouts without uploading anything.",
    description:
      "A privacy-first editing tool: your image stays on your device while the heavy lifting happens client-side.",
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
    kind: "repository",
    summary:
      "A TypeScript idea-lab project in active development — explore the source on GitHub.",
    description:
      "One of the experiments in Laurent's public archive. Check the repository for the latest state of the work.",
    tags: ["TypeScript", "experiment"],
    links: [{ label: "Open repository", href: "https://github.com/LaurentMaxhuni/ideator.dev" }],
    screenshots: [
      {
        src: "/images/projects/ideator-capture.png",
        alt: "GitHub page for the ideator.dev repository.",
      },
    ],
  },
];

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
  "Built and shipped public AI and browser-extension projects with a strong product focus.",
  "Maintains a growing public GitHub profile with more than 25 repositories across frontend, backend, and experimental work.",
  "Combines software building with strong mathematics and physics discipline, which shows up in structured problem solving.",
  "Launching an MDX blog to publish case studies, technical notes, and SEO-driven content.",
];

export const awards = [
  { title: "1st Place, National Physics Competition", year: "2026" },
  { title: "1st Place, Communal Physics Competition", year: "2026" },
  { title: "3rd Place, National Physics Competition", year: "2025" },
  { title: "1st Place, Communal Physics Competition", year: "2025" },
  { title: "1st Place, Communal Math Olympiad", year: "2023" },
];
