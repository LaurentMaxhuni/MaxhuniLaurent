import Link from 'next/link'
import { siteConfig } from 'app/lib/content'
import { ThemeToggle } from './theme-toggle'

const navItems = [
  { href: '/', name: 'home' },
  { href: '/blog', name: 'blog' },
  { href: siteConfig.githubUrl, name: 'github', external: true },
]

export function Navbar() {
  return (
    <aside className="-ml-[8px] mb-16 tracking-tight">
      <div className="lg:sticky lg:top-20">
        <nav
          className="flex flex-row items-start relative px-0 pb-0 fade md:overflow-auto scroll-pr-6 md:relative"
          id="nav"
        >
          <div className="flex w-full flex-row items-center justify-between pr-2">
            <div className="flex flex-row space-x-0">
              {navItems.map((item) =>
                item.external ? (
                  <a
                    key={item.href}
                    href={item.href}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="theme-muted theme-hover flex align-middle relative py-1 px-2 m-1"
                  >
                    {item.name}
                  </a>
                ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="theme-muted theme-hover flex align-middle relative py-1 px-2 m-1"
                >
                  {item.name}
                </Link>
                )
              )}
            </div>
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </aside>
  )
}
