import type { CollectionConfig } from "payload";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isExistingAdmin(user: { collection?: string } | null | undefined) {
  return user?.collection === "admins";
}

export const Posts: CollectionConfig = {
  slug: "posts",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "_status", "publishedAt", "updatedAt"],
  },
  defaultSort: "-publishedAt",
  access: {
    read: ({ req }) => {
      if (isExistingAdmin(req.user)) return true;

      return {
        _status: {
          equals: "published",
        },
      };
    },
    create: ({ req }) => isExistingAdmin(req.user),
    update: ({ req }) => isExistingAdmin(req.user),
    delete: ({ req }) => isExistingAdmin(req.user),
  },
  hooks: {
    beforeChange: [({ data, originalDoc }) => {
      if (!data.slug && !originalDoc?.slug && data.title) {
        data.slug = slugify(data.title);
      }

      if (data._status === "published" && !originalDoc?.publishedAt && !data.publishedAt) {
        data.publishedAt = new Date().toISOString();
      }

      return data;
    }],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 800,
        showSaveDraftButton: true,
      },
    },
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: {
        position: "sidebar",
        description: "Leave blank to generate from the title. Custom slugs are kept as written.",
      },
    },
    {
      name: "excerpt",
      type: "textarea",
      required: true,
      admin: {
        rows: 4,
        description: "A concise archive summary displayed before readers open the post.",
      },
    },
    {
      name: "content",
      type: "textarea",
      required: true,
      admin: {
        rows: 24,
        description: "Write in Markdown. GitHub-flavored tables, task lists, and fenced code blocks are supported; HTML is not rendered publicly.",
      },
    },
    {
      name: "tags",
      type: "array",
      labels: {
        singular: "tag",
        plural: "tags",
      },
      fields: [
        {
          name: "tag",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "cover",
      type: "upload",
      relationTo: "media",
      admin: {
        position: "sidebar",
        description: "Optional archive and article cover image. Media alt text is required for accessibility.",
      },
    },
    {
      name: "publishedAt",
      type: "date",
      index: true,
      admin: {
        position: "sidebar",
        readOnly: true,
        date: {
          pickerAppearance: "dayAndTime",
        },
        description: "Set automatically when the post is first published.",
      },
    },
  ],
};
