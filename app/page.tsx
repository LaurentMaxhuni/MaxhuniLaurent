import Link from 'next/link'
import { homeContent } from 'app/home-content'
import {
  achievements,
  certificates,
  contactLinks,
  siteConfig,
  skillGroups,
} from 'app/lib/content'

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-3 w-3"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.85227 0.454545H11.8438V9.46023H10.2955L10.3097 3.09659L2.07102 11.3494Z"
        fill="currentColor"
      />
    </svg>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="mb-16 max-w-2xl">
      <h2 className="mb-4 text-base font-semibold tracking-tighter">{title}</h2>
      {children}
    </section>
  )
}

function InlineLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <a
      className="theme-muted theme-hover inline-flex items-center gap-2 underline underline-offset-4"
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      {children}
      <ArrowIcon />
    </a>
  )
}

export default function Page() {
  return (
    <section className="pt-2">
      <div className="mb-20 max-w-3xl">
        <p className="theme-subtle mb-4 text-sm">{siteConfig.name}</p>
        <h1 className="title max-w-[12ch] text-4xl font-semibold tracking-tighter sm:text-5xl">
          {homeContent.heroTitle}
        </h1>
        <p className="theme-muted mt-6 max-w-[60ch] text-lg leading-8">
          {siteConfig.description}
        </p>
        <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3">
          <InlineLink href={siteConfig.githubUrl}>GitHub</InlineLink>
          <InlineLink href={siteConfig.linkedinUrl}>LinkedIn</InlineLink>
          <Link
            href="/blog"
            className="theme-muted theme-hover inline-flex items-center gap-2 underline underline-offset-4"
          >
            Blog
            <ArrowIcon />
          </Link>
        </div>
      </div>

      <Section title="About">
        <div className="space-y-4">
          {homeContent.about.map((paragraph) => (
            <p key={paragraph} className="theme-muted leading-7">
              {paragraph}
            </p>
          ))}
        </div>
      </Section>

      <Section title="Projects">
        <div className="space-y-10">
          {homeContent.featuredProjects.map((project) => (
            <div
              key={project.name}
              className="border-b pb-8 last:border-b-0 last:pb-0 theme-border"
            >
              <h3 className="text-2xl font-semibold tracking-tighter">
                {project.name}
              </h3>
              <p className="theme-muted mt-3 leading-7">{project.description}</p>
              <p className="theme-subtle mt-3 text-sm">{project.stack}</p>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3">
                {project.links.map((link) => (
                  <InlineLink key={`${project.name}-${link.label}`} href={link.href}>
                    {link.label}
                  </InlineLink>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Skills">
        <div className="space-y-5">
          {skillGroups.map((group) => (
            <div key={group.title}>
              <h3 className="mb-1 font-medium">{group.title}</h3>
              <p className="theme-muted leading-7">{group.items.join(', ')}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Achievements">
        <ul className="theme-muted space-y-3">
          {achievements.map((achievement) => (
            <li key={achievement}>{achievement}</li>
          ))}
        </ul>
      </Section>

      <Section title="Certificates">
        <ul className="theme-muted space-y-3">
          {certificates.map((certificate) => (
            <li key={certificate}>{certificate}</li>
          ))}
        </ul>
      </Section>

      <Section title="Contact">
        <p className="theme-muted mb-5 leading-7">
          I&apos;m interested in AI tools, modern product interfaces, and clean
          websites.
        </p>
        <div className="flex flex-wrap gap-x-5 gap-y-3">
          {contactLinks.map((link) => (
            <InlineLink key={link.label} href={link.href}>
              {link.label}
            </InlineLink>
          ))}
        </div>
      </Section>
    </section>
  )
}
