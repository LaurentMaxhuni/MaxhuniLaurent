export const siteConfig = {
  name: 'Laurent Maxhuni',
  title: 'Full-stack web developer building AI tools and modern web products.',
  description:
    'I build clean interfaces, full-stack products, and practical AI-powered tools from Vushtrri, Kosovo.',
  location: 'Vushtrri, Kosovo',
  siteUrl: 'https://laurentmaxhuni.netlify.app',
  githubUrl: 'https://github.com/LaurentMaxhuni',
  linkedinUrl: 'https://www.linkedin.com/in/laurent-maxhuni-56a394304/',
  portfolioUrl: 'https://laurentmaxhuni.netlify.app',
  blogDescription:
    'MDX posts on web development, AI tooling, project breakdowns, SEO-friendly case studies, and backlink-driven writing.',
}

export const about = [
  "I'm a high school student and aspiring full-stack developer focused on building visually appealing, user-friendly websites and practical AI products.",
  'My work spans frontend interfaces, backend APIs, Chrome extensions, and portfolio experiences that turn ideas into real products people can use.',
  'Outside of coding, I spend time on mathematics, physics, and learning new technologies that sharpen how I solve technical problems.',
]

export const featuredProjects = [
  {
    name: 'Promptify',
    description:
      'Chrome extension that enhances prompts in one click across ChatGPT, Claude, Gemini, and Grok.',
    stack: 'TypeScript, Chrome Extensions, AI tooling',
    links: [
      { label: 'live', href: 'https://promptifying.vercel.app' },
      { label: 'repo', href: 'https://github.com/LaurentMaxhuni/promptify' },
    ],
  },
  {
    name: 'SaveIt',
    description:
      'Lightweight extension for downloading direct files from a URL with a custom filename and no unnecessary friction.',
    stack: 'HTML, JavaScript, Chrome Extensions',
    links: [{ label: 'repo', href: 'https://github.com/LaurentMaxhuni/SaveIt' }],
  },
  {
    name: 'LM Academy',
    description:
      'Bootcamp project split into frontend and backend apps, showing product UI work and API development in the same system.',
    stack: 'Vue, Blade, Full-stack app architecture',
    links: [
      {
        label: 'frontend',
        href: 'https://github.com/LaurentMaxhuni/lm-academy-frontend',
      },
      {
        label: 'backend',
        href: 'https://github.com/LaurentMaxhuni/lm-academy-backend',
      },
    ],
  },
  {
    name: 'Kosova Website',
    description:
      'Albanian-language website made for a school fair, combining local storytelling with a polished presentation.',
    stack: 'Frontend web development',
    links: [
      {
        label: 'repo',
        href: 'https://github.com/LaurentMaxhuni/kosova-website',
      },
    ],
  },
  {
    name: 'Error Explainer',
    description:
      'Simple learning tool that helps developers understand HTML, CSS, and JavaScript errors with AI-assisted explanations.',
    stack: 'JavaScript, educational tooling',
    links: [
      {
        label: 'repo',
        href: 'https://github.com/LaurentMaxhuni/error-explainer',
      },
    ],
  },
]

export const skillGroups = [
  {
    title: 'Frontend',
    items: [
      'HTML',
      'CSS',
      'JavaScript',
      'TypeScript',
      'React',
      'Next.js',
      'Tailwind CSS',
      'Vue',
      'Angular',
    ],
  },
  {
    title: 'Backend & data',
    items: ['Node.js', 'Express.js', 'MySQL', 'Firebase', 'Python'],
  },
  {
    title: 'Workflow',
    items: [
      'Git',
      'GitHub',
      'VS Code',
      'Chrome extensions',
      'Vercel',
      'Netlify',
      'SEO-focused writing',
    ],
  },
]

export const achievements = [
  'Built and shipped public AI and browser-extension projects with a strong product focus.',
  'Maintains a growing public GitHub profile with more than 25 repositories across frontend, backend, and experimental work.',
  'Combines software building with strong mathematics and physics discipline, which shows up in structured problem solving.',
  'Launching an MDX blog to publish case studies, technical notes, and SEO-driven content around projects and web development.',
]

export const certificates = [
  '1st Place, National Physics Competition (2026)',
  '1st Place, Communal Physics Competition (2026)',
  '3rd Place, National Physics Competition (2025)',
  '1st Place, Communal Physics Competition (2025)',
  '1st Place, Communal Math Olympiad (2023)',
]

export const contactLinks = [
  { label: 'github', href: siteConfig.githubUrl },
  { label: 'linkedin', href: siteConfig.linkedinUrl },
  { label: 'current portfolio', href: siteConfig.portfolioUrl },
]
