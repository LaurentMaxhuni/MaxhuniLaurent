import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Portfolio CMS",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
