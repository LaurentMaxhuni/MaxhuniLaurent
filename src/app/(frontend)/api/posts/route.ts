import { handlePostsGet } from "@/lib/public-api";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const GET = handlePostsGet;
