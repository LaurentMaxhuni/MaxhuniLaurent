import { getPublishedPost, getPublishedPosts, getPostTags } from "@/lib/blog";
import { markdownForPath, notFoundMarkdown } from "@/lib/agent-content";
import { appendVaryAccept } from "@/lib/accept";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type MarkdownRouteProps = {
  params: Promise<{ slug?: string[] }>;
};

function markdownResponse(body: string, status = 200) {
  const headers = new Headers({
    "Content-Type": "text/markdown; charset=utf-8",
    "Cache-Control": "public, s-maxage=60, stale-while-revalidate=86400",
  });
  appendVaryAccept(headers);
  return new Response(body, { status, headers });
}

async function blogIndexMarkdown() {
  const { docs: posts } = await getPublishedPosts();
  const rows = posts.length
    ? posts.map((post) => `- [${post.title}](${absoluteUrl(`/blog/${post.slug}`)}) — ${post.excerpt}`).join("\n")
    : "No published transmissions are currently available.";

  return `# Laurent Maxhuni Signal Archive\n\nNotes on products, interfaces, experiments, and the work behind them.\n\n## Published transmissions\n\n${rows}\n`;
}

async function blogPostMarkdown(slug: string) {
  const post = await getPublishedPost(slug);
  if (!post) return null;

  const tags = getPostTags(post);
  const publicationDate = post.publishedAt ?? post.createdAt;
  return `# ${post.title}\n\n> ${post.excerpt}\n\nPublished: ${publicationDate}\n${tags.length ? `Tags: ${tags.join(", ")}\n` : ""}\n${post.content}\n`;
}

export async function GET(_request: Request, { params }: MarkdownRouteProps) {
  const { slug = [] } = await params;
  const pathname = `/${slug.join("/")}`.replace(/\/$/, "") || "/";

  if (pathname === "/blog") {
    try {
      return markdownResponse(await blogIndexMarkdown());
    } catch {
      return markdownResponse(notFoundMarkdown(pathname), 404);
    }
  }

  if (slug[0] === "blog" && slug.length === 2) {
    try {
      const body = await blogPostMarkdown(slug[1]);
      return markdownResponse(body ?? notFoundMarkdown(pathname), body ? 200 : 404);
    } catch {
      return markdownResponse(notFoundMarkdown(pathname), 404);
    }
  }

  const body = markdownForPath(pathname);
  return markdownResponse(body ?? notFoundMarkdown(pathname), body ? 200 : 404);
}
