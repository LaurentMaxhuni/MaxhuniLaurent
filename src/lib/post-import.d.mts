import type { Post } from "../../payload-types";

export function importDraftPosts(
  posts: Post[],
  dependencies: {
    findExistingPost: (slug: string) => Promise<unknown | null>;
    findOrUploadCover: (cover: NonNullable<Post["cover"]>) => Promise<string | number>;
    createPost: (options: {
      data: Record<string, unknown>;
      draft: true;
      overrideAccess: true;
    }) => Promise<{ slug: string }>;
  },
): Promise<{ imported: string[]; skipped: string[] }>;
