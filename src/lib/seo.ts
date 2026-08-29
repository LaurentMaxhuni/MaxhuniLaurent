import type { Metadata } from "next";

import { absoluteUrl, SITE_NAME, SITE_OG_IMAGE, SITE_URL } from "@/lib/site";

type PageMetadataOptions = {
  title: string;
  description: string;
  pathname: string;
  openGraphType?: "article" | "website";
};

export function pageMetadata({
  title,
  description,
  pathname,
  openGraphType = "website",
}: PageMetadataOptions): Metadata {
  const pageTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: { absolute: pageTitle },
    description,
    alternates: { canonical: pathname },
    openGraph: {
      type: openGraphType,
      url: pathname,
      title: pageTitle,
      description,
      images: [{ url: absoluteUrl(SITE_OG_IMAGE), width: 1200, height: 630, alt: `${SITE_NAME} portfolio` }],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [absoluteUrl(SITE_OG_IMAGE)],
    },
  };
}
