import { access } from "node:fs/promises";
import { basename, resolve, sep } from "node:path";

import config from "../payload.config";
import { seedPosts } from "../src/content/posts";
import { importDraftPosts } from "../src/lib/post-import.mjs";
import { getPayload } from "payload";

async function main() {
  if (!process.env.DATABASE_URI?.trim()) {
    throw new Error("DATABASE_URI is required.");
  }

  const payload = await getPayload({ config });
  const publicRoot = resolve(process.cwd(), "public");

  try {
    const result = await importDraftPosts(seedPosts, {
      findExistingPost: async (slug) => {
        const found = await payload.find({
          collection: "posts",
          limit: 1,
          overrideAccess: true,
          where: { slug: { equals: slug } },
        });
        return found.docs[0] ?? null;
      },
      findOrUploadCover: async (cover) => {
        const assetUrl = typeof cover === "object" && cover ? cover.url : null;
        if (!assetUrl?.startsWith("/")) {
          throw new Error("Seed covers must be checked-in public assets.");
        }

        const relativePath = decodeURIComponent(assetUrl.slice(1));
        const filePath = resolve(publicRoot, relativePath);
        if (!filePath.startsWith(`${publicRoot}${sep}`)) {
          throw new Error("Seed cover path is outside the public asset directory.");
        }
        await access(filePath);

        const filename = basename(filePath);
        const existing = await payload.find({
          collection: "media",
          limit: 1,
          overrideAccess: true,
          where: { filename: { equals: filename } },
        });
        if (existing.docs[0]) return existing.docs[0].id;

        const media = await payload.create({
          collection: "media",
          data: { alt: typeof cover === "object" && cover ? cover.alt ?? "Editorial article cover" : "Editorial article cover" },
          filePath,
          overrideAccess: true,
        });
        return media.id;
      },
      createPost: (options) => payload.create({ collection: "posts", ...options }),
    });

    console.log(`Draft import complete. Imported ${result.imported.length}; skipped ${result.skipped.length}.`);
    for (const slug of result.imported) console.log(`Imported draft: ${slug}`);
    for (const slug of result.skipped) console.log(`Already present: ${slug}`);
  } finally {
    await payload.destroy();
  }
}

main().catch(() => {
  console.error("[import] Could not import seed drafts. Check the database and media storage configuration.");
  process.exitCode = 1;
});
