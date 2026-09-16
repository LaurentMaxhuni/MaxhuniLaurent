import type { Metadata } from "next";
import React from "react";

import { handleServerFunctions, RootLayout } from "@payloadcms/next/layouts";
import config from "@payload-config";
import type { ServerFunctionClientArgs } from "payload";

import { SITE_URL } from "@/lib/site";

import { importMap } from "./admin/importMap";

import "@payloadcms/next/css";

const serverFunction = async (args: ServerFunctionClientArgs) => {
  "use server";

  return handleServerFunctions({ ...args, config, importMap });
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Portfolio CMS",
};

export default function PayloadLayout({ children }: { children: React.ReactNode }) {
  return RootLayout({ children, config, importMap, serverFunction });
}
