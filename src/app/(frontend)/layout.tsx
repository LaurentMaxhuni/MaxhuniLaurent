import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import { absoluteUrl, SITE_DESCRIPTION, SITE_NAME, SITE_OG_IMAGE, SITE_URL } from "@/lib/site";
import "./globals.css";

const googleSiteVerification =
  process.env.GOOGLE_SITE_VERIFICATION ?? "fguq4YwUJzXnH0iyxRkBaNqnfz2hDFbX4E64PWg9KRc";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: "Laurent Maxhuni | Developer and product builder",
    template: "%s | Laurent Maxhuni",
  },
  description: SITE_DESCRIPTION,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: { google: googleSiteVerification },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: "Laurent Maxhuni | Developer and product builder",
    description: SITE_DESCRIPTION,
    url: "/",
    images: [{ url: absoluteUrl(SITE_OG_IMAGE), width: 1200, height: 630, alt: "Laurent Maxhuni developer and product builder" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Laurent Maxhuni | Developer and product builder",
    description: SITE_DESCRIPTION,
    images: [absoluteUrl(SITE_OG_IMAGE)],
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#07090c",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
