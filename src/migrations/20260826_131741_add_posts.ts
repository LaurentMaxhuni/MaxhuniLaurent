import { type MigrateDownArgs, type MigrateUpArgs, sql } from "@payloadcms/db-postgres";

/**
 * Adds the blog schema to the existing Payload database. The Admin, Media, and
 * Payload internals are already managed by the original push-based setup, so
 * this migration deliberately creates only Posts and its supporting tables.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
    CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');

    CREATE TABLE "posts_tags" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "tag" varchar
    );

    CREATE TABLE "posts" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar,
      "slug" varchar,
      "excerpt" varchar,
      "content" varchar,
      "cover_id" integer,
      "published_at" timestamp(3) with time zone,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "_status" "enum_posts_status" DEFAULT 'draft'
    );

    CREATE TABLE "_posts_v_version_tags" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "tag" varchar,
      "_uuid" varchar
    );

    CREATE TABLE "_posts_v" (
      "id" serial PRIMARY KEY NOT NULL,
      "parent_id" integer,
      "version_title" varchar,
      "version_slug" varchar,
      "version_excerpt" varchar,
      "version_content" varchar,
      "version_cover_id" integer,
      "version_published_at" timestamp(3) with time zone,
      "version_updated_at" timestamp(3) with time zone,
      "version_created_at" timestamp(3) with time zone,
      "version__status" "enum__posts_v_version_status" DEFAULT 'draft',
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "latest" boolean,
      "autosave" boolean
    );

    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "posts_id" integer;

    ALTER TABLE "posts_tags" ADD CONSTRAINT "posts_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "posts" ADD CONSTRAINT "posts_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "_posts_v_version_tags" ADD CONSTRAINT "_posts_v_version_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;

    CREATE INDEX "posts_tags_order_idx" ON "posts_tags" USING btree ("_order");
    CREATE INDEX "posts_tags_parent_id_idx" ON "posts_tags" USING btree ("_parent_id");
    CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
    CREATE INDEX "posts_cover_idx" ON "posts" USING btree ("cover_id");
    CREATE INDEX "posts_published_at_idx" ON "posts" USING btree ("published_at");
    CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
    CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
    CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
    CREATE INDEX "_posts_v_version_tags_order_idx" ON "_posts_v_version_tags" USING btree ("_order");
    CREATE INDEX "_posts_v_version_tags_parent_id_idx" ON "_posts_v_version_tags" USING btree ("_parent_id");
    CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
    CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
    CREATE INDEX "_posts_v_version_version_cover_idx" ON "_posts_v" USING btree ("version_cover_id");
    CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
    CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
    CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
    CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
    CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
    CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
    CREATE INDEX "_posts_v_autosave_idx" ON "_posts_v" USING btree ("autosave");
    CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_posts_fk";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "posts_id";
    DROP TABLE "posts_tags" CASCADE;
    DROP TABLE "_posts_v_version_tags" CASCADE;
    DROP TABLE "_posts_v" CASCADE;
    DROP TABLE "posts" CASCADE;
    DROP TYPE "public"."enum_posts_status";
    DROP TYPE "public"."enum__posts_v_version_status";
  `);
}
