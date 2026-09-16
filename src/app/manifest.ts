import type { MetadataRoute } from "next";

import { PERSON, SITE_NAME } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} | Developer and product builder`,
    short_name: SITE_NAME,
    description: PERSON.description,
    start_url: "/",
    display: "standalone",
    background_color: "#07090c",
    theme_color: "#07090c",
    icons: [{ src: "/icon.png", sizes: "500x500", type: "image/png" }],
  };
}
