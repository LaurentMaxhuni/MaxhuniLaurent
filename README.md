# Laurent Maxhuni

Portfolio site and Payload-powered signal archive, built with Next.js, Payload CMS, Neon Postgres, and Vercel Blob.

## Local setup

Install dependencies with pnpm:

```bash
pnpm install
```

Create a `.env` file with the following values:

```bash
PAYLOAD_SECRET=replace-with-a-long-random-secret
DATABASE_URI=postgresql://USER:PASSWORD@YOUR-ENDPOINT-pooler.REGION.aws.neon.tech/neondb?sslmode=require
BLOB_READ_WRITE_TOKEN=vercel-blob-read-write-token
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
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

To verify the deployed domain with Google Search Console, add the token Google provides for the HTML meta-tag verification method as `GOOGLE_SITE_VERIFICATION` in the Vercel project environment variables, then redeploy. Use the token value only, not the full `<meta>` tag. The application emits the verification tag only when this variable is configured. After verification, submit `https://laurentmaxhuni.vercel.app/sitemap.xml` in Search Console.

The homepage uses Google Search's official Preferred Sources publisher button with no supplemental marketing copy or fallback control. The feature applies to the site's domain rather than an individual page.
