# Laurent Maxhuni

Portfolio site and Payload-powered signal archive, built with Next.js, Payload CMS, Neon Postgres, and Vercel Blob.

## Local setup

Install dependencies with pnpm:

```bash
pnpm install
```

Copy `.env.example` to `.env`, then add the following secret values:

```bash
PAYLOAD_SECRET=replace-with-a-long-random-secret
DATABASE_URI=postgresql://USER:PASSWORD@YOUR-ENDPOINT-pooler.REGION.aws.neon.tech/neondb?sslmode=verify-full
BLOB_READ_WRITE_TOKEN=vercel-blob-read-write-token
GOOGLE_SITE_VERIFICATION=your-google-search-console-token
```

Use Neon’s pooled connection string for `DATABASE_URI` in production. Its host includes `-pooler`, which is required for serverless connections.

Run the development server:

```bash
pnpm dev
```

Payload’s development database push is enabled outside production. Use a disposable local database or Neon branch while iterating.

## Blog workflow

Posts live in Payload at `/admin`. Authors can save incomplete Markdown drafts, then publish them when ready. Only published posts are available at `/blog` and `/blog/[slug]`.

Markdown supports GitHub-flavored tables, task lists, and fenced code blocks. Raw HTML is intentionally not rendered. Optional cover images come from the `media` collection, where alt text is required.

## Database migrations

The committed Posts migration is in `src/migrations`. Before each production build/deployment, configure `DATABASE_URI` with the target Neon pooled connection string and run:

```bash
pnpm payload migrate:status
pnpm payload migrate
pnpm build
```

When the schema changes, generate and commit a new migration and the refreshed Payload types:

```bash
pnpm payload migrate:create descriptive-change --forceAcceptWarning
pnpm payload generate:types
```

## Google Search Console

To verify the deployed domain with Google Search Console, add the token Google provides for the HTML meta-tag verification method as `GOOGLE_SITE_VERIFICATION` in the Vercel project environment variables, then redeploy. Use the token value only, not the full `<meta>` tag. The application emits the verification tag only when this variable is configured. After verification, submit the `/sitemap.xml` URL for the configured `NEXT_PUBLIC_SITE_URL` value in Search Console.

The homepage uses Google Search's official Preferred Sources publisher button with no supplemental marketing copy or fallback control. The feature applies to the site's domain rather than an individual page.

## Canonical site URL and future domain migration

`NEXT_PUBLIC_SITE_URL` is the single canonical origin for metadata, structured data, sitemap entries, robots.txt, feeds, API documentation, and absolute internal URLs. The checked-in `.env.example` contains the current production value. `src/lib/site.ts` normalizes and validates it; update the environment variable and redeploy when the authoritative origin changes. Do not add domain literals to page content, metadata, structured data, or route handlers.

`/about` is the canonical profile page for Laurent Maxhuni. The portfolio uses one stable Person identifier, `${NEXT_PUBLIC_SITE_URL}/#person`, across the homepage, profile page, projects, and blog structured data. The identity graph describes Laurent as a 15-year-old full-stack developer and AI builder from Vushtrri, Kosovo; it intentionally does not publish a birth date.

Vercel preview deployments receive `X-Robots-Tag: noindex, nofollow, noarchive` and production remains canonical. Keep `NEXT_PUBLIC_SITE_URL` set to `https://laurentmaxhuni.vercel.app` until a custom domain is live.

Until a custom domain is connected and live, the Vercel production origin remains authoritative. A future migration should be handled in this order:

1. Update `NEXT_PUBLIC_SITE_URL` in the deployment environment.
2. Attach and verify the custom domain with the hosting provider.
3. Redeploy to regenerate canonical URLs, structured data, and the sitemap.
4. Update the relevant Search Console property and resubmit the sitemap.
5. Configure permanent redirects from the Vercel origin where supported and appropriate.
6. Update external profiles and directory listings to the new origin.

No custom-domain redirects are configured before that migration decision.

## Agent and developer resources

The developer portal is available at `/developers`. The canonical public posts endpoint is `GET /api/v1/posts`; `GET /api/posts` remains a compatibility alias. The API contract is published at `/openapi.json` with typed `application/problem+json` errors, `X-API-Version: 1` compatibility negotiation, IETF `RateLimit-Policy` and `RateLimit` fields, the widely supported `RateLimit-Limit`, `RateLimit-Remaining`, and `RateLimit-Reset` headers, and `Retry-After` on 429 responses. Lifecycle rules are at `/developers/api/versioning`.

The stateless Streamable HTTP MCP endpoint is `/.well-known/mcp`. It exposes `search_portfolio`, `get_site_guide`, and `list_published_posts` tools. `llms.txt` and `sitemap.xml` link the public developer resources for crawlers and agents.
