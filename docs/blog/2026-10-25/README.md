# October 25, 2026 publication batch

Three documentation-based developer articles covering Codex CLI 0.164.0, Claude Haiku 5.5, and Next.js 16.4. Markdown editorial sources live in this directory; the equivalent runtime content is in `src/content/october-posts.ts`, included by the existing built-in article list. Keep both forms in sync when editing. Existing Payload articles still override checked-in articles with the same slug.

The covers in `public/images/blog` are original 1200 by 630 PNG editorial illustrations made with Pillow and the local Arial font installation. They use no third-party image assets.

Primary source pages were retrieved and verified on October 25, 2026. All seven unique outbound source URLs returned HTTP 200. Claims about releases and prices are attributed; proposed tests and hypothetical examples are distinguished from measured results.

Validation completed before publication:

- Production build, TypeScript check, changed-file lint, and all five blog-publication tests passed.
- Independent editorial review scored the articles 91, 92, and 93 out of 100, respectively, with zero P0 issues. The installed review gate verified the reviewer scorecards and their nonces.
- Native Playwright checks of the actual production build passed at 375, 768, and 1280 pixels: no page overflow, loaded cover images, one matching H1, canonical metadata, and BlogPosting structured data. Archive, API, sitemap, and contextual internal links passed.
- Standalone review proofs include HTML, PDF, screenshots, and cover images; their dark-mode and page-error checks passed. These are stored outside the repository in the chat's visualization workspace.
- The broader existing agent-readiness suite passed 19 of 23 checks. Its four failures concern unchanged sitemap developer-page expectations, homepage content, homepage styles, and developer-page robots metadata. These were not modified in this publication batch. Page speed was not measured.
