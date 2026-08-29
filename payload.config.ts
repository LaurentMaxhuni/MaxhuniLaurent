import path from "path";
import { fileURLToPath } from "url";

import { postgresAdapter } from "@payloadcms/db-postgres";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { buildConfig } from "payload";

import { Admins } from "./src/collections/Admins.ts";
import { Media } from "./src/collections/Media.ts";
import { Posts } from "./src/collections/Posts.ts";
import { SITE_URL } from "./src/lib/site.ts";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

function normalizedDatabaseURI(value: string | undefined) {
  if (!value) return "";

  try {
    const databaseURL = new URL(value);
    const sslMode = databaseURL.searchParams.get("sslmode");

    // pg currently treats these as verify-full. Keep that secure behavior
    // explicit before the driver changes its interpretation in a future major.
    if (sslMode === "prefer" || sslMode === "require" || sslMode === "verify-ca") {
      databaseURL.searchParams.set("sslmode", "verify-full");
    }

    return databaseURL.toString();
  } catch {
    return value;
  }
}

export default buildConfig({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname, "./src/app/(payload)/admin"),
    },
    user: Admins.slug,
  },
  collections: [Admins, Media, Posts],
  db: postgresAdapter({
    migrationDir: path.resolve(dirname, "./src/migrations"),
    pool: {
      connectionString: normalizedDatabaseURI(process.env.DATABASE_URI),
    },
    push: process.env.NODE_ENV !== "production",
  }),
  plugins: [
    vercelBlobStorage({
      collections: {
        media: true,
      },
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      token: process.env.BLOB_READ_WRITE_TOKEN ?? "",
    }),
  ],
  secret: process.env.PAYLOAD_SECRET ?? "",
  serverURL: SITE_URL,
});
