import Link from 'next/link'
import { getBlogPosts } from 'app/blog/utils'
import { BlogPosts } from 'app/components/posts'
import { siteConfig } from 'app/lib/content'

export const metadata = {
  title: 'Blog',
  description: siteConfig.blogDescription,
}

export default function Page() {
  let posts = getBlogPosts()

  return (
    <section className="max-w-2xl">
      <h1 className="font-semibold text-2xl mb-3 tracking-tighter">Blog</h1>
      <p className="theme-muted mb-8">
        This MDX blog is set up for SEO-focused articles, project breakdowns,
        and technical writing that supports organic search and backlinks.
      </p>
      {posts.length > 0 ? (
        <BlogPosts />
      ) : (
        <div className="theme-muted space-y-3">
          <p>No posts published yet.</p>
          <p>
            Drop a new <code>.mdx</code> file into{' '}
            <code>app/blog/posts</code> and it will appear here automatically.
          </p>
          <p>
            When the first post is ready, it will also be included in the RSS
            feed, sitemap, and dynamic post pages.
          </p>
          <Link
            className="theme-hover inline-block"
            href="/"
          >
            back home
          </Link>
        </div>
      )}
    </section>
  )
}
