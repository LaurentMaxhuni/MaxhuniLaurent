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
      {posts.length > 0 ? (
        <BlogPosts />
      ) : (
        <div className="theme-muted space-y-3">
          <p>No posts published yet.</p>
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
