import path from "path";
import { fileURLToPath } from "url";

import { postgresAdapter } from "@payloadcms/db-postgres";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { buildConfig } from "payload";

import { Admins } from "./src/collections/Admins.ts";
import { Media } from "./src/collections/Media.ts";
import { Posts } from "./src/collections/Posts.ts";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

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
      connectionString: process.env.DATABASE_URI ?? "",
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
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000",
});
