import type { Metadata } from "next";

import config from "@payload-config";
import { NotFoundPage, generatePageMetadata } from "@payloadcms/next/views";
import { importMap } from "../importMap";
import { SITE_URL } from "@/lib/site";

type Args = {
  params: Promise<{
    segments: string[];
  }>;
  searchParams: Promise<{
    [key: string]: string | string[];
  }>;
};

export async function generateMetadata({ params, searchParams }: Args): Promise<Metadata> {
  return {
    ...(await generatePageMetadata({ config, params, searchParams })),
    metadataBase: new URL(SITE_URL),
    robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  };
}

const NotFound = ({ params, searchParams }: Args) =>
  NotFoundPage({ config, params, searchParams, importMap });

export default NotFound;
