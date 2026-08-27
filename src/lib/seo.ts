import type { Metadata } from "next";

import { SITE_NAME, SITE_OG_IMAGE } from "@/lib/site";

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
  const socialTitle = `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    alternates: { canonical: pathname },
    openGraph: {
      type: openGraphType,
      url: pathname,
      title: socialTitle,
      description,
      images: [{ url: SITE_OG_IMAGE, width: 1200, height: 630, alt: `${SITE_NAME} portfolio` }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [SITE_OG_IMAGE],
    },
  };
}
