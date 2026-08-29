# Laurent Maxhuni Entity SEO Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the portfolio's server-rendered content, metadata, routes, and structured data consistently identify Laurent Maxhuni as a 15-year-old full-stack developer and AI builder from Vushtrri, Kosovo.

**Architecture:** Keep the existing Next.js 16 App Router and visual component tree. Centralize site/person facts and stable graph IDs in `src/lib/site.ts`, centralize JSON-LD builders in `src/lib/structured-data.ts`, and let reusable metadata derive every canonical/social URL from `SITE_URL`. Strengthen the existing homepage and project routes, turn `/about` into the profile/entity page, and keep client components limited to visual interaction.

**Tech Stack:** Next.js 16.2.6 App Router, React 19, TypeScript 5, Payload CMS, Metadata API, `next/og`, Node test runner, pnpm.

**Spec:** `docs/superpowers/specs/2026-08-29-entity-seo-design.md`

## Global Constraints

- Keep the dark/space aesthetic, black-hole hero, orbital visual language, project cards, technology visualization, spacing system, navigation concept, and overall section order.
- Use `NEXT_PUBLIC_SITE_URL` with the current production fallback `https://laurentmaxhuni.vercel.app` as the single canonical origin.
- Use one stable Person identifier at `${SITE_URL}/#person` across homepage, About, projects, and blog structured data.
- Keep age centralized as `15`; do not add or infer a `birthDate`.
- Use only the verified GitHub and LinkedIn URLs already present in the repository for `sameAs`.
- Do not add keyword-variant doorway pages, hidden keyword lists, fake media coverage, testimonials, rankings, or guessed profiles.
- Keep identity-critical facts and links in server-rendered HTML; animations must be enhancement-only.
- Do not claim lint, typecheck, tests, build, or route verification until the fresh command output confirms it.

---

### Task 1: Add failing entity and crawl-contract tests

**Files:**
- Modify: `tests/agent-readiness.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: the existing production-server test harness, `request()`, `readFile()`, and `escapedExpectedSiteUrl`.
- Produces: executable assertions for shared Person IDs, About profile data, visible identity copy, complete social metadata, HTML-only sitemap membership, and the new `typecheck` script.

- [ ] **Step 1: Add the new assertions before changing production code**

Add a JSON-LD extraction helper after `escapeRegExp()`:

```js
function getJsonLdDocuments(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)]
    .map((match) => JSON.parse(match[1]));
}
```

Add this test after the existing homepage metadata test:

```js
test("homepage and About establish one visible Laurent Maxhuni entity", async () => {
  const [homeResponse, aboutResponse] = await Promise.all([
    request("/", { headers: { Accept: "text/html" } }),
    request("/about", { headers: { Accept: "text/html" } }),
  ]);
  const homeHtml = await homeResponse.text();
  const aboutHtml = await aboutResponse.text();
  const homeText = homeHtml.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "").replace(/<[^>]+>/g, " ");
  const aboutText = aboutHtml.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "").replace(/<[^>]+>/g, " ");

  assert.match(homeText, /Laurent Maxhuni/);
  assert.match(homeText, /15-year-old/);
  assert.match(homeText, /full-stack developer/i);
  assert.match(homeText, /AI builder/i);
  assert.match(homeText, /Vushtrri, Kosovo/);
  assert.match(aboutText, /Laurent Maxhuni/);
  assert.match(aboutText, /15-year-old/);
  assert.match(aboutText, /full-stack developer/i);
  assert.match(aboutText, /AI builder/i);
  assert.match(aboutText, /web applications/i);
  assert.match(aboutText, /developer tools/i);
  assert.match(aboutText, /open-source software/i);

  const homeGraph = getJsonLdDocuments(homeHtml)[0];
  const aboutGraph = getJsonLdDocuments(aboutHtml)[0];
  const homePerson = homeGraph["@graph"].find((node) => node["@type"] === "Person");
  const profile = aboutGraph["@graph"].find((node) => node["@type"] === "ProfilePage");
  const aboutPerson = aboutGraph["@graph"].find((node) => node["@type"] === "Person");

  assert.equal(homePerson["@id"], `${expectedSiteUrl}/#person`);
  assert.equal(profile.mainEntity["@id"], homePerson["@id"]);
  assert.equal(aboutPerson["@id"], homePerson["@id"]);
  assert.match(homePerson.description, /15-year-old/);
  assert.doesNotMatch(JSON.stringify(homeGraph), /birthDate/);
  assert.ok(homePerson.sameAs.includes("https://github.com/LaurentMaxhuni"));
  assert.ok(homePerson.sameAs.includes("https://www.linkedin.com/in/laurent-maxhuni-56a394304/"));
});
```

Extend the existing complete-social-metadata test with:

```js
assert.match(html, /property="og:site_name" content="Laurent Maxhuni"/);
```

Add this project graph test:

```js
test("project pages point to the shared Laurent Maxhuni creator entity", async () => {
  for (const path of ["/projects/promptify", "/projects/ideator-dev"]) {
    const html = await (await request(path, { headers: { Accept: "text/html" } })).text();
    const graph = getJsonLdDocuments(html)[0];
    assert.equal(graph.creator["@id"], `${expectedSiteUrl}/#person`, path);
    assert.equal(graph.mainEntityOfPage["@id"], `${expectedSiteUrl}${path}`, path);
    assert.match(html, /Built by Laurent Maxhuni/);
  }
});
```

Update the sitemap test to expect `/about`, keep project/blog URLs, and assert that `/llms.txt` and `/openapi.json` are absent from `<loc>` values because they are utility resources rather than HTML index pages.

Add a source-level preview/alternate contract assertion:

```js
test("preview and Markdown alternates use the production canonical origin", async () => {
  const proxy = await readFile(new URL("../src/proxy.ts", import.meta.url), "utf8");
  assert.match(proxy, /import \{ absoluteUrl, SITE_URL \} from "@\/lib\/site"/);
  assert.doesNotMatch(proxy, /request\.nextUrl\.origin/);
  assert.match(proxy, /X-Robots-Tag/);
});
```

Add the `typecheck` script alongside the existing scripts:

```json
"typecheck": "tsc --noEmit"
```

- [ ] **Step 2: Run the focused test and confirm the new behavior fails**

Run: `pnpm test:agent-readiness`

Expected: the production server may still fail to start until a usable production build exists; once the existing build/start issue is cleared, the new entity assertions must fail on the missing visible age/role copy, missing About JSON-LD, missing `og:site_name`, and project `creator` field. Do not change production code before recording this red state.

- [ ] **Step 3: Run the existing static checks after the test-only change**

Run: `pnpm lint`

Expected: PASS, or a test-file lint error that is fixed in the test file before implementation begins.

---

### Task 2: Centralize site identity and JSON-LD graph builders

**Files:**
- Modify: `src/lib/site.ts`
- Create: `src/lib/structured-data.ts`
- Create: `src/components/json-ld.tsx`
- Modify: `src/content/portfolio.ts`

**Interfaces:**
- Consumes: `NEXT_PUBLIC_SITE_URL`, current GitHub/LinkedIn URLs, current project records, and current capability records.
- Produces: `PERSON`, `PERSON_ID`, `SITE_ROOT_URL`, `WEBSITE_ID`, `PORTFOLIO_ID`, `SITE_TITLE`, `SITE_DESCRIPTION`, `homepageStructuredData()`, `profileStructuredData()`, `projectStructuredData()`, and `JsonLd`.

- [ ] **Step 1: Add the central facts and stable IDs**

Keep `getSiteUrl()` validation and add these exports after `SITE_URL`:

```ts
export const SITE_ROOT_URL = new URL("/", SITE_URL).toString();
export const SITE_NAME = "Laurent Maxhuni";
export const SITE_SAME_AS = [
  "https://github.com/LaurentMaxhuni",
  "https://www.linkedin.com/in/laurent-maxhuni-56a394304/",
] as const;
export const PERSON_ID = `${SITE_ROOT_URL}#person`;
export const WEBSITE_ID = `${SITE_ROOT_URL}#website`;
export const PORTFOLIO_ID = `${SITE_ROOT_URL}#portfolio`;
export const PERSON = {
  name: SITE_NAME,
  age: 15,
  jobTitle: "Full-Stack Developer",
  role: "15-year-old full-stack developer and AI builder",
  location: "Vushtrri, Kosovo",
  description: "Laurent Maxhuni is a 15-year-old full-stack developer and AI builder from Vushtrri, Kosovo. He builds web products, AI software, developer tools, browser extensions, and open-source software.",
  knowsAbout: [
    "Full-stack development",
    "Web development",
    "Artificial intelligence",
    "TypeScript",
    "JavaScript",
    "React",
    "Next.js",
    "Node.js",
    "Python",
    "PostgreSQL",
    "Developer tools",
    "Browser extensions",
    "Open-source software",
  ],
  sameAs: SITE_SAME_AS,
} as const;
export const SITE_TITLE = "Laurent Maxhuni — Full-Stack Developer & AI Builder";
export const SITE_DESCRIPTION = "Portfolio of Laurent Maxhuni, a 15-year-old full-stack developer and AI builder from Vushtrri, Kosovo, creating web products, developer tools, browser extensions, and AI software.";
```

Do not add `birthDate` or an `age` field to the Schema.org Person node; the age stays in `PERSON` for visible copy and description generation.

- [ ] **Step 2: Make the portfolio site object consume central identity data**

Change `src/content/portfolio.ts` to import `PERSON`, `SITE_NAME`, and `SITE_SAME_AS`, then define the existing `site` object from them:

```ts
export const site = {
  name: PERSON.name,
  role: PERSON.role,
  location: PERSON.location,
  contactEmail: null as string | null,
  socials: [
    { label: "GitHub", href: SITE_SAME_AS[0] },
    { label: "LinkedIn", href: SITE_SAME_AS[1] },
    { label: "Blog", href: "/blog" },
  ],
};
```

Keep the existing concrete project records and add a required `seoTitle` string to each project, using these values: `AI Prompt Browser Extension`, `AI Product Concept`, `AI Chat and Image Generation`, `Open-Source Agent Workflows`, `Open-Source OS Download Index`, `Launch-Campaign SaaS`, `Python Scanning Utility`, `Freelance Pricing Advisor`, `Private Browser Background Removal`, `AI Study Assistant`, and `Product Discovery Workbench`, in the existing project order.

- [ ] **Step 3: Add serializable structured-data builders**

Create `src/lib/structured-data.ts` with these shapes:

```ts
import { absoluteUrl, PERSON, PERSON_ID, PORTFOLIO_ID, SITE_DESCRIPTION, SITE_NAME, SITE_ROOT_URL, WEBSITE_ID } from "@/lib/site";
import type { Project } from "@/content/portfolio";

const personNode = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: PERSON.name,
  url: SITE_ROOT_URL,
  description: PERSON.description,
  jobTitle: PERSON.jobTitle,
  homeLocation: {
    "@type": "Place",
    name: PERSON.location,
    address: { "@type": "PostalAddress", addressLocality: "Vushtrri", addressCountry: "XK" },
  },
  knowsAbout: PERSON.knowsAbout,
  sameAs: PERSON.sameAs,
} as const;

export function homepageStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      personNode,
      {
        "@type": "Organization",
        "@id": PORTFOLIO_ID,
        name: `${SITE_NAME} Portfolio`,
        url: SITE_ROOT_URL,
        description: "The public developer portfolio and project archive for Laurent Maxhuni.",
        founder: { "@id": PERSON_ID },
        address: { "@type": "PostalAddress", addressLocality: "Vushtrri", addressCountry: "XK" },
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name: SITE_NAME,
        url: SITE_ROOT_URL,
        description: SITE_DESCRIPTION,
        inLanguage: "en",
        about: { "@id": PERSON_ID },
        creator: { "@id": PERSON_ID },
        publisher: { "@id": PORTFOLIO_ID },
      },
    ],
  };
}
```

Add `profileStructuredData()` with a `ProfilePage` at `absoluteUrl("/about") + "#profile"`, `url: absoluteUrl("/about")`, `mainEntity: { "@id": PERSON_ID }`, `isPartOf: { "@id": WEBSITE_ID }`, and the full `personNode` in the same `@graph`.

Add `projectStructuredData(project, canonicalUrl)` returning `SoftwareApplication` for products and `SoftwareSourceCode` for repositories. It must always include `@id: canonicalUrl + "#project"`, `name`, `description`, `url`, `mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl }`, `creator: { "@id": PERSON_ID }`, `isPartOf: { "@id": WEBSITE_ID }`, an absolute project screenshot URL when available, and `codeRepository` only when a repository link exists. Include `programmingLanguage` only for language tags among TypeScript, JavaScript, Python, and Rust.

- [ ] **Step 4: Add a safe JSON-LD component**

Create `src/components/json-ld.tsx`:

```tsx
export default function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
```

- [ ] **Step 5: Run the typecheck for the central data layer**

Run: `pnpm typecheck`

Expected: the new constants and builders typecheck, with any `readonly`/union errors corrected without weakening the `Project` type.

---

### Task 3: Strengthen metadata, server-rendered identity copy, and About profile page

**Files:**
- Modify: `src/lib/seo.ts`
- Modify: `src/app/(frontend)/layout.tsx`
- Modify: `src/app/(frontend)/page.tsx`
- Modify: `src/components/hero-section.tsx`
- Modify: `src/components/sections.tsx`
- Modify: `src/app/(frontend)/about/page.tsx`
- Modify: `src/components/agent-readable-summary.tsx`
- Modify: `src/components/navbar.tsx`
- Modify: `src/components/site-footer.tsx`
- Modify: `src/lib/agent-content.ts`
- Modify: `src/app/(frontend)/globals.css`

**Interfaces:**
- Consumes: central identity constants/builders from Task 2 and existing project/award/social data.
- Produces: complete absolute metadata, visible homepage/profile facts, navigable About links, and the About `ProfilePage` graph.

- [ ] **Step 1: Make reusable page metadata complete and absolute**

Extend `PageMetadataOptions` with `image?: string` and `imageAlt?: string`. Build metadata from these values:

```ts
const pageTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
const canonicalUrl = absoluteUrl(pathname);
const imageUrl = absoluteUrl(image ?? SITE_OG_IMAGE);

return {
  metadataBase: new URL(SITE_URL),
  title: { absolute: pageTitle },
  description,
  alternates: { canonical: canonicalUrl },
  authors: [{ name: SITE_NAME, url: SITE_ROOT_URL }],
  robots: { index: process.env.VERCEL_ENV !== "preview", follow: process.env.VERCEL_ENV !== "preview" },
  openGraph: {
    type: openGraphType,
    siteName: SITE_NAME,
    url: canonicalUrl,
    title: pageTitle,
    description,
    images: [{ url: imageUrl, width: 1200, height: 630, alt: imageAlt ?? `${SITE_NAME} portfolio` }],
  },
  twitter: { card: "summary_large_image", title: pageTitle, description, images: [imageUrl] },
};
```

- [ ] **Step 2: Update root metadata and homepage graph**

Use `SITE_TITLE`, `SITE_DESCRIPTION`, `SITE_ROOT_URL`, and `SITE_OG_IMAGE` in the frontend layout. Keep the existing Google Search Console environment path. In `page.tsx`, use the exact `SITE_TITLE`/description, `alternates: { canonical: SITE_ROOT_URL }`, absolute Open Graph URL/image, and render `<JsonLd data={homepageStructuredData()} />`.

Keep the Organization node from Task 2 named `Laurent Maxhuni Portfolio` so it is a publisher context rather than a duplicate Person identity.

- [ ] **Step 3: Put the entity relationship next to the preserved hero H1**

Keep `<h1>Ideas deserve their own orbit.</h1>` and replace its supporting paragraph with:

```tsx
<p>
  I&apos;m Laurent Maxhuni, a 15-year-old full-stack developer and AI builder from Vushtrri, Kosovo. I build web products, developer tools, browser extensions, and AI software.
</p>
```

Do not add a hidden heading or keyword block.

- [ ] **Step 4: Strengthen homepage section semantics and internal links**

In the About card, use visible prose equivalent to:

```tsx
<p>
  Laurent Maxhuni is a 15-year-old full-stack developer and AI builder from Vushtrri, Kosovo. His work spans web applications, AI products, developer tools, browser extensions, and open-source software.
</p>
<Link className="round-link round-link--light" href="/about">About Laurent Maxhuni <ArrowUpRight aria-hidden="true" size={17} /></Link>
```

Add a visible technology sentence in the Technical range intro naming the supported stack already represented by the repository: TypeScript, JavaScript, Python, React, Next.js, Node.js, PostgreSQL, and AI/LLM tooling. Give the achievement card an H3 such as `Competition record` and keep the existing factual award list.

Keep Projects, Technical range, About, achievements, and Contact as semantic H2/H3 sections. Add an internal `/about` link to the homepage footer if it is not already present.

- [ ] **Step 5: Make navigation point to the profile route off the homepage**

Keep hash navigation on `/`, but resolve About to `/about` on other routes and Contact to `/contact` on other routes. Projects and Practice continue to target their homepage anchors. Preserve the current mobile menu and Escape behavior.

- [ ] **Step 6: Replace the About page with a useful profile page**

Set metadata to:

```ts
title: "About Laurent Maxhuni — Full-Stack Developer from Kosovo"
description: "Learn about Laurent Maxhuni, a 15-year-old full-stack developer and AI builder from Vushtrri, Kosovo, and explore his public software projects."
pathname: "/about"
```

Render the existing `StaticPage` shell with a visible profile snapshot and substantive content. The profile snapshot must contain:

```tsx
<section className="profile-summary" aria-labelledby="profile-summary-title">
  <p className="section-kicker">Profile</p>
  <h2 id="profile-summary-title">Laurent Maxhuni</h2>
  <dl>
    <div><dt>Focus</dt><dd>15-year-old full-stack developer and AI builder</dd></div>
    <div><dt>Based in</dt><dd>Vushtrri, Kosovo</dd></div>
  </dl>
</section>
```

Use `aboutCopy` for two concise paragraphs stating web applications, AI products, developer tools, browser extensions, open-source software, experimental projects, and student-developer context. Add H2 sections for `Selected projects`, `Profiles and public work`, and `Competition record`; link at least Promptify, free.ai, ideator.dev, agent-skills, GitHub, and LinkedIn with descriptive anchors. Render `<JsonLd data={profileStructuredData()} />`.

- [ ] **Step 7: Keep the no-JavaScript representation useful without making it primary**

Update `agent-readable-summary.tsx`, `homepageMarkdown()`, and `aboutMarkdown()` to consume `PERSON.description`, include the same age/role/location relationship, and link each project to its internal project page as well as its public external destination. The normal visible homepage remains the source of the identity facts.

- [ ] **Step 8: Make reveal animation enhancement-only**

Change `Reveal` so its default server-rendered class is visible. After mount, add a `reveal--pending` class while waiting for IntersectionObserver, then `reveal--ready` when observed. Change CSS from hidden-by-default to:

```css
.reveal { opacity: 1; transform: none; }
.reveal--pending { opacity: 0; transform: translateY(18px); }
.reveal--ready { opacity: 1; transform: none; }
```

This leaves all critical copy readable if JavaScript never executes while preserving animated reveals for hydrated users.

- [ ] **Step 9: Verify the homepage/About contract**

Run: `pnpm typecheck`

Expected: PASS. Once a production build is available, run: `pnpm test:agent-readiness`

Expected: homepage/About entity assertions pass, including raw server HTML and shared profile ID.

---

### Task 4: Upgrade project and blog metadata/graphs without changing layouts

**Files:**
- Modify: `src/app/(frontend)/projects/[slug]/page.tsx`
- Modify: `src/app/(frontend)/blog/[slug]/page.tsx`
- Modify: `src/lib/structured-data.ts`
- Modify: `src/app/(frontend)/globals.css`

**Interfaces:**
- Consumes: `Project.seoTitle`, central metadata/graph constants, project screenshots/links, and existing Payload post data.
- Produces: route-specific titles/images, visible creator relationships, and consistent blog author/publisher IDs.

- [ ] **Step 1: Use the shared metadata helper for project pages**

For a project, derive `pathname`, `image`, and `imageAlt`, then return `pageMetadata({ title: project.seoTitle, description: project.summary, pathname, image, imageAlt })`. The rendered title should be e.g. `Promptify — AI Prompt Browser Extension | Laurent Maxhuni`.

- [ ] **Step 2: Render the shared project graph and creator relationship**

Replace the inline project graph with `<JsonLd data={projectStructuredData(project, canonicalUrl)} />`. In the hero, add visible copy immediately below the lede:

```tsx
<p className="project-case__creator">
  Built by <Link href="/about">Laurent Maxhuni</Link>, a full-stack developer and AI builder from Vushtrri, Kosovo.
</p>
```

Change the technology card label to `Technologies and focus` while keeping the existing tags. Keep the existing problem, approach, build, links, and previous/next project sections.

- [ ] **Step 3: Normalize blog social metadata and graph identifiers**

Keep the existing article metadata behavior and `alternates: { canonical: pathname }` contract, but add `siteName: SITE_NAME`, use absolute `og:url`, absolute image URLs, and the shared `PERSON_ID`, `PORTFOLIO_ID`, and `WEBSITE_ID` in BlogPosting author/publisher/isPartOf. Keep `BlogPosting` and `BreadcrumbList`, and preserve the H1-to-H2 Markdown rendering.

- [ ] **Step 4: Style only the new creator/profile content**

Add small CSS rules for `.profile-summary`, its `dl/dt/dd`, and `.project-case__creator` using existing borders, muted colors, spacing, and font variables. Do not alter hero dimensions, card composition, orbital animation, or project grid behavior.

- [ ] **Step 5: Verify route metadata and graphs**

Run: `pnpm typecheck`

Expected: PASS. Run: `pnpm test:agent-readiness`

Expected: project creator assertions, unique titles, route-specific OG images, and blog graph assertions pass.

---

### Task 5: Repair crawl controls, sitemap scope, preview handling, and discovery files

**Files:**
- Modify: `src/app/(frontend)/sitemap.ts`
- Modify: `src/app/robots.ts`
- Modify: `src/proxy.ts`
- Modify: `src/app/(payload)/layout.tsx`
- Modify: `src/app/opengraph-image.tsx`
- Modify: `src/app/manifest.ts`
- Modify: `.env.example`
- Modify: `README.md`

**Interfaces:**
- Consumes: `SITE_URL`, `SITE_ROOT_URL`, explicit indexable paths, project records, published post dates, and Vercel environment variables.
- Produces: production-only canonical alternates, preview noindex headers, truthful sitemap membership, explicit admin noindex, and updated brand/discovery copy.

- [ ] **Step 1: Split sitemap paths from machine-readable resources**

Add `INDEXABLE_SITE_PATHS` to `src/lib/site.ts` containing only `/`, `/about`, `/contact`, `/privacy`, `/blog`, `/developers`, `/developers/api`, `/developers/api/versioning`, `/developers/auth`, and `/developers/mcp`. Use it in `sitemap.ts`, then append project pages and published blog posts. Remove fixed `lastModified` timestamps for static/project pages because no source modification dates exist; retain `new Date(post.updatedAt)` for real CMS posts. Keep `llms.txt`, `openapi.json`, APIs, admin, and sitemap itself out of `<loc>` entries.

- [ ] **Step 2: Tighten robots and admin metadata**

Change `robots.ts` to disallow `/admin` (the prefix covers `/admin` and `/admin/`) while keeping `allow: "/"` and `sitemap: absoluteUrl("/sitemap.xml")`. Add `robots: { index: false, follow: false }` to the Payload layout metadata. Do not disallow CSS, JavaScript, images, public projects, or public agent APIs.

- [ ] **Step 3: Make proxy alternates canonical and previews non-indexable**

Import `absoluteUrl` and `SITE_URL` in `src/proxy.ts`. Build Markdown alternate links with `absoluteUrl(markdownPath)`, never `request.nextUrl.origin`. Add:

```ts
function applyCrawlerHeaders(response: NextResponse) {
  if (process.env.VERCEL_ENV === "preview") {
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }
  return response;
}
```

Wrap every proxy response path, including machine-readable paths and 406 responses, with `applyCrawlerHeaders`. Keep `SITE_URL` referenced in the implementation so production canonical behavior is explicit, and leave production deployments crawlable.

- [ ] **Step 4: Update OG image and manifest copy**

Keep the existing `1200x630` dark generated image and change its role line to `FULL-STACK DEVELOPER & AI BUILDER`, its subtitle to `Web products, AI software, developer tools, and browser extensions.`, and `alt` to `Laurent Maxhuni — Full-Stack Developer & AI Builder`. Keep the current host label derived from `SITE_URL`. Preserve the manifest name for compatibility, but update its description from the generic portfolio wording to `Portfolio of Laurent Maxhuni, a 15-year-old full-stack developer and AI builder from Vushtrri, Kosovo.`.

- [ ] **Step 5: Document the central configuration and migration path**

Update `.env.example` comments and README text to state that `NEXT_PUBLIC_SITE_URL` is the only canonical origin, the current value is `https://laurentmaxhuni.vercel.app`, and a future domain migration changes that one value before redirects, external profile updates, and Search Console resubmission. Document that `/about` is the canonical profile page and list the stable Person ID without adding a birth date.

- [ ] **Step 6: Verify crawl controls**

Run: `pnpm typecheck`

Expected: PASS. Run: `pnpm test:agent-readiness`

Expected: sitemap URLs are all HTML canonical pages/projects/posts, none are `/llms.txt` or `/openapi.json`, robots points to the configured sitemap, admin has noindex, and the source-level preview/alternate test passes.

---

### Task 6: Reduce client/image/font performance risks without redesigning the site

**Files:**
- Modify: `src/app/(frontend)/layout.tsx`
- Modify: `src/app/(frontend)/globals.css`
- Modify: `src/components/orbiting-skills.tsx`
- Modify: `src/components/reveal.tsx`

**Interfaces:**
- Consumes: existing visual components and CSS variables.
- Produces: a build-stable font strategy, lazy below-fold skill logos, and enhancement-only reveal behavior.

- [ ] **Step 1: Replace the network-dependent Google font build fetch**

Remove `next/font/google` imports and font initialization from the frontend layout. Define stable CSS variables in `globals.css`:

```css
:root {
  --font-display: "Bricolage Grotesque", "Arial Narrow", "Segoe UI", Arial, sans-serif;
  --font-sans: "DM Sans", "Segoe UI", Arial, sans-serif;
}
```

Keep the existing `font-family: var(--font-sans)` body rule and all display-font selectors. This preserves the intended display/sans roles and makes local/CI production builds independent of Google Fonts network access. Do not add or infer a font asset.

- [ ] **Step 2: Defer below-fold remote skill logos**

Keep the existing visual logo URLs and `<img src={skill.logo}>` structure, but add `loading="lazy"`, `decoding="async"`, and `fetchPriority="low"`. Keep the empty alt and parent `aria-label`, since the logos are decorative while the text label supplies the accessible technology name.

- [ ] **Step 3: Verify performance-sensitive source behavior**

Run: `pnpm lint`

Expected: PASS with no new image or React warnings. Confirm the homepage server HTML still contains identity copy and project links before any visual client component executes.

---

### Task 7: Full production verification and audit handoff

**Files:**
- Modify: `tests/agent-readiness.test.mjs` only if an assertion reflects an implementation defect rather than changing the requirement.
- Create: `docs/seo-audit-report.md`

**Interfaces:**
- Consumes: all completed route, metadata, graph, crawl, and performance changes.
- Produces: fresh verification evidence and the concise audit report requested by the user.

- [ ] **Step 1: Run all static checks**

Run each command separately:

```text
pnpm lint
pnpm typecheck
pnpm test:agent-readiness
pnpm build
```

Expected: every command exits 0. If the test server needs a production build, run `pnpm build` before the test and rerun the test; if a command fails, diagnose and fix the implementation, then rerun the full command.

- [ ] **Step 2: Start the production server and inspect raw responses**

Run: `pnpm start --hostname 127.0.0.1 --port 3417`

Request `/`, `/about`, `/projects/promptify`, `/projects/ideator-dev`, `/blog`, `/developers`, `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest`, `/llms.txt`, `/openapi.json`, `/projects/not-found`, and `/this-route-does-not-exist` with command-line HTTP requests. Record status, content type, canonical, title, description, OG fields, JSON-LD count, and raw text facts before hydration.

- [ ] **Step 3: Parse and validate JSON-LD from actual HTML**

For homepage, About, project, and blog responses, extract every `application/ld+json` block and parse it with `JSON.parse`. Confirm:

- every site URL starts with the configured `SITE_URL` except verified external `sameAs`/project links;
- homepage Person ID, About `ProfilePage.mainEntity`, project `creator`, and blog author all equal `${SITE_URL}/#person`;
- About includes `ProfilePage` and a resolvable Person node;
- project types are only `SoftwareApplication` or `SoftwareSourceCode`;
- no JSON-LD contains `birthDate` or an unsupported invented claim;
- each project schema has an absolute canonical page and creator relationship.

- [ ] **Step 4: Verify sitemap and route statuses**

Parse `<loc>` values from `/sitemap.xml`, request every path, and require status 200. Require that no sitemap URL is an API, admin, `/llms.txt`, or `/openapi.json` path. Require missing project and unknown routes to return 404 with `noindex, nofollow` metadata.

- [ ] **Step 5: Render the preview crawler-control check**

Start the same production server with `VERCEL_ENV=preview` and request `/`. Require `X-Robots-Tag: noindex, nofollow, noarchive`; start it with `VERCEL_ENV=production` and require that header is absent while the canonical remains the configured production URL.

- [ ] **Step 6: Write the audit report**

Create `docs/seo-audit-report.md` with these exact sections and evidence-backed statements:

```md
# SEO Audit Report — 2026-08-29

## Problems discovered
## Files changed
## Entity SEO improvements
## Technical SEO improvements
## Structured data added
## Content changes
## Performance changes
## Remaining issues
## Search Console actions
## Future custom-domain work
```

Include the pre-change findings, changed files, verified route/build results, remaining lack of supplied external media/profile coverage, the manual Search Console checklist (verify property, submit sitemap, inspect `/`, `/about`, and priority projects, request indexing for those updated URLs, check selected canonicals/indexing/structured-data reports, monitor Laurent Maxhuni and Kosovo/developer queries), and the ten-step future-domain migration sequence from the user request. Do not claim Search Console actions were performed.

- [ ] **Step 7: Re-read the plan and verify completion claims**

Run: `git diff --check`, `git status --short`, `pnpm lint`, `pnpm typecheck`, `pnpm test:agent-readiness`, and `pnpm build` after all edits. Read the complete output and report only the statuses those commands prove.
