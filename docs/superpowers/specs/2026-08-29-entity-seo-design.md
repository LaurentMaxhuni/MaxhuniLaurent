# Laurent Maxhuni Entity SEO Pass Design

**Date:** 2026-08-29

**Goal:** Consolidate the portfolio's visible content, metadata, routes, and structured data around one authoritative entity: Laurent Maxhuni, a 15-year-old full-stack developer and AI builder from Vushtrri, Kosovo.

## Scope

This pass improves the existing Next.js App Router portfolio without changing its dark/space visual identity, black-hole hero, orbital technology visualization, project cards, navigation concept, or overall section order. It covers the public homepage, `/about`, project pages, blog metadata, public discovery files, preview deployment handling, and verification tooling.

The existing 11 project records are substantive enough to keep their dedicated `/projects/[slug]` pages. No keyword-targeted doorway pages or invented project, birth-date, award, or media claims will be added.

## Entity model

`src/lib/site.ts` will be the single source for the canonical origin and the stable identity facts used throughout the application:

- `SITE_URL`: `NEXT_PUBLIC_SITE_URL` with the current production fallback `https://laurentmaxhuni.vercel.app`.
- `PERSON_ID`: one stable identifier at `${SITE_URL}/#person`.
- `PERSON`: Laurent Maxhuni's name, age `15`, job title, full-stack/AI role, Vushtrri/Kosovo location, concise biography, supported technologies, and verified public profile URLs.
- `SITE_TITLE` and `SITE_DESCRIPTION`: human-readable homepage positioning based on the same facts.
- `SITE_ROOT_URL`, `WEBSITE_ID`, and `PORTFOLIO_ID`: derived absolute identifiers for the site graph.

No `birthDate` property will be emitted. The age is a centralized biography fact so updating it later changes the intended content and structured-data surfaces together.

The only `sameAs` values will be the verified GitHub and LinkedIn URLs already present in the repository. No guessed social accounts or media URLs will be added. External coverage, if later supplied, will be represented as `subjectOf`, not `sameAs`.

## Content architecture

The homepage keeps `Ideas deserve their own orbit.` as its sole H1. Its adjacent visible supporting paragraph will identify Laurent by name, age, role, location, and work types in natural prose. The existing Projects, Technical range, About, achievements, and Contact sections remain in the same order and use H2/H3 semantics.

The homepage About card will state the same identity relationship and link to `/about` with descriptive anchor text. The technology section will retain its orbiting visual and add a concise visible technology sentence so important technology signals do not require hover, scrolling, or hydration.

`/about` will become the canonical profile page. It will retain the existing `StaticPage` shell, add a compact visible profile snapshot, state the biography in useful prose, link to major project pages, list the verified profiles, and identify the genuine competition record without exaggeration. Its page title will be `About Laurent Maxhuni — Full-Stack Developer from Kosovo` and its content will naturally include web applications, AI products, developer tools, browser extensions, open-source software, and experimental projects.

Project pages will retain their existing brief layout and add a visible `Built by Laurent Maxhuni` relationship, descriptive project SEO titles, clearer technology/build details where the current records support them, and links back to `/about` and related projects through existing navigation.

## Metadata and structured data

`src/lib/seo.ts` will generate unique absolute canonical URLs and complete social metadata for reusable static metadata. Every important HTML route will emit:

- a unique title and description;
- a self-referencing canonical derived from `SITE_URL`;
- `og:title`, `og:description`, `og:url`, `og:type`, `og:image`, and `og:site_name`;
- `twitter:card`, `twitter:title`, `twitter:description`, and `twitter:image` without an invented handle.

`src/lib/structured-data.ts` will centralize serializable Schema.org graph fragments. The homepage will emit one graph containing the shared `Person`, a clearly named `Laurent Maxhuni Portfolio` publisher organization, and `WebSite`. The organization is a site-publisher context, not a second person entity, and points to the Person as its founder. `/about` will emit `ProfilePage` with `mainEntity` referencing the same `PERSON_ID`, plus the full Person node so the profile page is self-describing. Project pages will emit `SoftwareApplication` for product records or `SoftwareSourceCode` for repository records, with `creator` referencing `PERSON_ID`, the canonical page as `mainEntityOfPage`, the relevant image, and only properties supported by each project record. Blog posts will reuse the same Person, portfolio, and Website identifiers.

## Routes and crawl controls

The public static routes, substantive project pages, and available published blog posts remain crawlable. Missing project/blog records continue to call `notFound()` and return a real 404 with `noindex, nofollow` metadata. The Payload admin layout receives explicit noindex metadata, while `robots.txt` disallows the `/admin` path prefix without blocking public assets, projects, or APIs used by agents.

The sitemap will be generated from an explicit HTML index path list containing `/`, `/about`, `/contact`, `/privacy`, `/blog`, the human-readable `/developers` pages, every substantive project page, and available published blog posts. It will exclude API endpoints, `/llms.txt`, `/openapi.json`, admin routes, preview routes, and other non-page utility routes. It will use real post modification timestamps. Every emitted URL must be an absolute `SITE_URL` URL and resolve successfully.

`src/proxy.ts` will use `SITE_URL` for Markdown alternate links rather than the request origin, preventing preview hosts from being advertised as alternate canonical content. Preview deployments will receive `X-Robots-Tag: noindex, nofollow` through the proxy when `VERCEL_ENV=preview`; production remains crawlable and keeps the configured production canonical.

## Performance, accessibility, and rendering

The core identity copy, headings, project names, links, and profile facts will remain in server-rendered HTML. Client components continue to provide visual interaction only. Remote skill-logo images below the fold will be lazy and asynchronous, and reduced-motion behavior already present in the visual components will be preserved. The external Google font build dependency will be removed or replaced with a build-stable local/system strategy that keeps the same display/sans family roles and avoids a network fetch during production builds.

Existing local project screenshots remain `next/image` assets with intrinsic/fill dimensions and descriptive alt text. Decorative canvases retain empty/hidden accessibility treatment. Any new profile snapshot uses semantic headings, a definition list or equivalent labeled facts, keyboard-visible links, and no hidden SEO-only text.

The generated OG image will preserve the existing dark branded treatment while changing the role line to `FULL-STACK DEVELOPER & AI BUILDER` and keeping `Laurent Maxhuni` prominent.

## Verification contract

The implementation will add or update focused tests for:

1. centralized identity facts and stable IDs;
2. homepage and About raw HTML identity content;
3. consistent Person references across homepage, About, projects, and blog templates;
4. complete unique metadata and absolute URLs;
5. project schema creator links and supported project types;
6. robots, sitemap, preview headers, 404 status/noindex, and manifest behavior.

Verification will run against a production build and local server, not only source text. It will extract JSON-LD, parse it as JSON, check IDs and URL origins, request every sitemap URL, inspect raw HTML before hydration, verify missing-route status codes, and run lint, typecheck, tests, and the production build.

## Non-goals

- No custom-domain redirects before a custom domain exists.
- No fake birth date, testimonials, media coverage, rankings, or social accounts.
- No keyword-variant landing pages.
- No removal of the black-hole hero, orbital visual language, project visualization, or intentional typography hierarchy.
- No attempt to perform Search Console actions from the repository.
