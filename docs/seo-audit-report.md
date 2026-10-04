# SEO Audit Report — 2026-08-29

## Problems discovered

- The homepage had a strong visual H1, but its adjacent copy did not name Laurent, state his age, or connect his developer identity to Vushtrri/Kosovo.
- Homepage and project metadata used generic positioning. Child routes could omit `og:site_name`, and several canonical/social values were relative in source metadata.
- `/about` was a useful but thin static page without a dedicated `ProfilePage`/`Person` graph or a compact profile summary.
- Project JSON-LD used an `author` reference rather than a shared `creator` relationship and did not expose a consistent `mainEntityOfPage`.
- The sitemap included `/llms.txt` and `/openapi.json` and supplied fixed timestamps that were not backed by source modification dates.
- Markdown alternates used the request origin, previews had no crawler-control header, and `/admin` was only partially covered by the robots rule.
- Reveal animation CSS hid text until hydration, and below-fold remote technology logos were not deferred. Google font fetching also made the production build network-dependent.

## Files changed

- Identity and structured data: `src/lib/site.ts`, `src/lib/structured-data.ts`, `src/components/json-ld.tsx`, `src/lib/seo.ts`, `src/content/portfolio.ts`.
- Visible profile and navigation: `src/components/hero-section.tsx`, `src/components/sections.tsx`, `src/app/(frontend)/about/page.tsx`, `src/app/(frontend)/page.tsx`, `src/components/agent-readable-summary.tsx`, `src/components/navbar.tsx`, `src/components/site-footer.tsx`, `src/lib/agent-content.ts`.
- Route metadata and crawl controls: `src/app/(frontend)/layout.tsx`, `src/app/(frontend)/projects/[slug]/page.tsx`, `src/app/(frontend)/blog/[slug]/page.tsx`, `src/app/(frontend)/sitemap.ts`, `src/app/robots.ts`, `src/proxy.ts`, Payload admin metadata layouts, `src/app/opengraph-image.tsx`, and `src/app/manifest.ts`.
- Performance and verification: `src/app/(frontend)/globals.css`, `src/components/reveal.tsx`, `src/components/orbiting-skills.tsx`, `tests/agent-readiness.test.mjs`, `package.json`, `.env.example`, `README.md`.

## Entity SEO improvements

- Centralized `PERSON`, age `15`, role, location, description, verified profiles, and stable IDs in `src/lib/site.ts`.
- The canonical Person ID is `${SITE_URL}/#person`; the same ID is referenced by the homepage, About page, projects, and blog posts.
- The homepage now states that Laurent Maxhuni is a 15-year-old full-stack developer and AI builder from Vushtrri, Kosovo, building web products, developer tools, browser extensions, and AI software.
- `/about` is now the canonical profile page with an at-a-glance summary, work description, selected project links, GitHub/LinkedIn links, and factual competition history.
- Project pages visibly say who built them and link back to About. Internal anchors now form a homepage → About → project graph with descriptive labels.
- The age is present in centralized visible copy and descriptions; no birth date was invented or added to JSON-LD.

## Technical SEO improvements

- `NEXT_PUBLIC_SITE_URL` remains the single configurable origin, with the production fallback `https://laurentmaxhuni.vercel.app`. Canonicals, sitemap locations, social URLs, and structured-data URLs derive from it.
- Reusable metadata now emits absolute canonical URLs, `og:url`, route-specific images, `og:site_name`, and Twitter card values.
- The sitemap contains the 10 indexable static HTML routes, 11 project pages, and real CMS post dates when posts exist. It excludes APIs, admin, `llms.txt`, `openapi.json`, and other utility resources.
- The root canonical and sitemap entry share the configured production origin; Next serializes the sitemap root as `https://laurentmaxhuni.vercel.app/` while the canonical tag serializes it as `https://laurentmaxhuni.vercel.app`, which is the same origin URL.
- `robots.txt` keeps public assets and project routes crawlable, disallows `/admin`, and points to the configured absolute sitemap.
- Preview deployments receive `X-Robots-Tag: noindex, nofollow, noarchive`; production-mode requests do not receive that header.
- Missing project and unknown routes return real 404 responses with noindex metadata. The Payload admin layout is also explicitly noindex.
- The existing `llms.txt` route remains factual and now uses the same identity/project data and internal project URLs.

## Structured data added

- Homepage graph: `Person`, `Organization`, and `WebSite`, with the Person connected through `about`, `creator`, `founder`, and publisher relationships.
- About graph: `ProfilePage` with `mainEntity` pointing to the shared Person node, plus the full Person node in the same graph.
- Project pages: `SoftwareApplication` for products or `SoftwareSourceCode` for repositories, with absolute canonical URLs, screenshots, optional GitHub `codeRepository`, and shared Person `creator`.
- Blog posts retain `BlogPosting` and `BreadcrumbList`, now using the shared Person, portfolio, and WebSite IDs.
- Actual production-style HTML was parsed with `JSON.parse`; no `birthDate` field or duplicate Laurent Person ID was found.

## Content changes

- Preserved the hero H1, orbital visual language, black-hole hero, project cards, and overall section order.
- Added concise entity copy beside the hero, strengthened the homepage About and technical-range sections, added an achievements heading, and made footer identity/location explicit.
- Added natural project SEO titles such as `Promptify — AI Prompt Browser Extension | Laurent Maxhuni` without creating keyword doorway pages.
- Kept project descriptions concrete and retained all existing public product and repository destinations.

## Performance changes

- Removed `next/font/google` build-time fetching and retained CSS display/sans font roles with local system fallbacks, making CI/local production builds independent of Google Fonts availability.
- Added lazy loading, async decoding, and low fetch priority to below-fold remote technology logos.
- Changed reveal behavior to progressive enhancement: server-rendered content is visible without JavaScript; hydrated users still receive intersection-based motion.
- Left the black-hole/WebGL and orbital visual experience intact; no third-party script or visual redesign was introduced.

## Remaining issues

- No verified birth date, profile image, or external media coverage was supplied in the repository, so none was added to the entity graph.
- Search Console, Google Rich Results Test, and external profile reconciliation still require the deployed production URL; no external actions were performed.
- The local Next.js build exits successfully but emits two non-fatal `metadataBase` warnings while Next uses its localhost fallback for special metadata/404 resolution. Canonical HTML routes themselves emit the configured absolute URLs; recheck this warning on Vercel.
- A production database/`PAYLOAD_SECRET` is required to exercise the CMS admin route locally. Public HTML, project, sitemap, API, and MCP checks pass without it.

## Search Console actions

After deployment, Laurent should:

1. Verify the `https://laurentmaxhuni.vercel.app` property.
2. Submit `https://laurentmaxhuni.vercel.app/sitemap.xml`.
3. Inspect the homepage, `/about`, `/projects/promptify`, `/projects/ideator-dev`, and other priority project pages.
4. Request indexing once for the updated homepage, About page, and priority projects.
5. Check the canonical selected by Google for those URLs.
6. Review indexing and excluded-page reports for preview/utility URLs.
7. Review structured-data and enhancement reports after Google recrawls the pages.
8. Monitor queries for `Laurent Maxhuni` and variants combining Laurent with developer, software, AI, Kosovo/Kosova, and Vushtrri.

## Future custom-domain work

When a custom domain is live:

1. Change the single `NEXT_PUBLIC_SITE_URL`/`SITE_URL` configuration value.
2. Configure and verify the domain in Vercel.
3. Redirect the old Vercel production URL to the new domain with permanent redirects.
4. Confirm canonical URLs and internal absolute links on the new domain.
5. Regenerate and submit the new sitemap.
6. Confirm Open Graph/Twitter URLs and image references.
7. Review the stable Person, Website, ProfilePage, and project IDs before changing URL-based IDs.
8. Update GitHub, LinkedIn, and other verified external profiles.
9. Add and verify the new Search Console property and submit its sitemap.
10. Monitor indexing, selected canonicals, impressions, and query migration from both properties.

## Re-check — 2026-09-25

The portfolio improvement plan was applied to the checkout. CMS publication state is now the only public blog source; checked-in articles can be imported idempotently as drafts, without using their source dates as approval. CMS failure paths are explicit, paginated article collection covers beyond Payload's first 100 records, and project sharing uses generated 1200×630 cards. Project browsing keeps the two moving lanes and persistent pause control; the extra static archive was removed after review. Project case studies and status labels remain. SEO metadata, About identity data, blog attribution, and the sitemap/Markdown/API outage paths were updated. The README includes the draft import workflow.

Verification completed:

- `pnpm typecheck`, `pnpm lint`, `pnpm build`, and `pnpm test:blog-publication` pass; the publication suite has 5 passing tests.
- `pnpm test:agent-readiness` passes all 23 checks, including published article metadata, server-rendered content without JavaScript, generated share-card dimensions, and unknown-project 404 behavior.
- Local browser layout was checked at 390, 768, and 1440 CSS pixels. The archive reflows to one, two, and three columns, respectively, with no horizontal page overflow. A stricter 320 CSS-pixel layout check also has no document overflow after containing the competition timeline reveal.
- Browser interaction checks covered both lane pause states, the mobile navigation, Escape to close, and Space-key activation with a visible focus outline. The homepage has only the moving project lanes.
- The browser rendered the hero WebGL canvas without a fallback state; source review confirms unsupported/build-failure fallback, off-screen render gating, and a lazy-loaded globe iframe.
- The no-database path was exercised by the readiness suite. Public API, sitemap, and Markdown routes return retryable 503 responses when the CMS is unavailable.
- The local `/blog` route returns HTTP 200 and renders its empty state because the configured CMS query found zero published posts. The checked-in seed articles were not published.
- Development startup prompted for a Payload schema push. The server was stopped without applying the prompt; the rebuilt production server serves the blog without that development prompt.

Remaining verification limits:

- The connected browser reported `prefers-reduced-motion: false`, and its controls do not expose media emulation. The reduced-motion implementation was reviewed in source (stationary scrollable lanes, duplicate cards removed, and reveal transitions disabled), but its rendered state was not live-emulated.
- The browser could not emulate a coarse pointer, so touch swipe behavior was checked in the CSS/source rather than with touch input. The previous report says Google font fetching was removed; the current frontend layout still imports `Bricolage_Grotesque` and `DM_Sans` from `next/font/google`, so that earlier claim does not describe this checkout.
- Browser zoom could not be set through the connected controls. Reflow was checked at 320 CSS pixels, but text scaling at an actual 200% browser zoom remains unverified.
- A performance score or lab timing baseline was not captured. WebGL context loss was not forced; its fallback path was reviewed in source only.
- The draft importer was tested against a fake Payload client, not a disposable CMS database, and it was not run against the configured CMS. Deployed routes and Search Console/Bing account data remain unverified; sitemap submission and post-release checks still require deployment and account access. No database schema changes or post publications were made.
- The successful build still emits two non-fatal `metadataBase` warnings during special metadata/404 generation and notes that the edge runtime disables static generation for the project share-image route.

## Update — 2026-10-04

The blog archive now uses the three existing checked-in articles when Payload has no published copy; a published Payload post with the same slug takes precedence. The project lanes no longer show manual pause or resume controls. Competition results remain grouped by year and the timeline ends at the final result.
