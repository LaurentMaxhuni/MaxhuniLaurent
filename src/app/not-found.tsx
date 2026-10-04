import type { Metadata } from "next";

import FrontendNotFound from "./(frontend)/not-found";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Page not found",
  description: "The requested page is not part of my public portfolio.",
  robots: { index: false, follow: false },
};

export default FrontendNotFound;
