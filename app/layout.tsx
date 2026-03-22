import './global.css'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Navbar } from './components/nav'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Footer from './components/footer'
import { baseUrl } from './sitemap'
import { siteConfig } from './lib/content'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: `${siteConfig.title} ${siteConfig.blogDescription}`,
  openGraph: {
    title: siteConfig.name,
    description: `${siteConfig.title} ${siteConfig.blogDescription}`,
    url: baseUrl,
    siteName: siteConfig.name,
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const cx = (...classes) => classes.filter(Boolean).join(' ')
const themeScript = `
  (() => {
    try {
      const storageKey = 'theme-preference';
      const storedTheme = window.localStorage.getItem(storageKey);
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      const theme = storedTheme === 'light' || storedTheme === 'dark'
        ? storedTheme
        : systemTheme;

      document.documentElement.classList.toggle('dark', theme === 'dark');
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
    } catch (error) {}
  })();
`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cx(GeistSans.variable, GeistMono.variable)}
    >
      <body className="antialiased max-w-4xl mx-4 mt-8 lg:mx-auto">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <main className="flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-3 lg:px-4">
          <Navbar />
          {children}
          <Footer />
          <Analytics />
          <SpeedInsights />
        </main>
      </body>
    </html>
  )
}
