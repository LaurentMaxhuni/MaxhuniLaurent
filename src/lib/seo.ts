import type { Metadata } from "next";

import { absoluteUrl, SITE_NAME, SITE_OG_IMAGE, SITE_URL } from "@/lib/site";

type PageMetadataOptions = {
  title: string;
  description: string;
  pathname: string;
  openGraphType?: "article" | "website";
  image?: string;
  imageAlt?: string;
};

export function pageMetadata({
  title,
  description,
  pathname,
  openGraphType = "website",
  image = SITE_OG_IMAGE,
  imageAlt = `${SITE_NAME} portfolio`,
}: PageMetadataOptions): Metadata {
  const pageTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const canonicalUrl = absoluteUrl(pathname);
  const imageUrl = image.startsWith("http") ? image : absoluteUrl(image);

  return {
    metadataBase: new URL(SITE_URL),
    title: { absolute: pageTitle },
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: openGraphType,
      siteName: SITE_NAME,
      url: canonicalUrl,
      title: pageTitle,
      description,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [imageUrl],
    },
  };
}
