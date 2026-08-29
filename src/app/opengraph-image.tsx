import { ImageResponse } from "next/og";

import { SITE_URL } from "@/lib/site";

export const alt = "Laurent Maxhuni — developer and product builder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const siteHost = new URL(SITE_URL).host;

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "74px",
          color: "#f5f9fc",
          background:
            "radial-gradient(circle at 85% 20%, rgba(106, 190, 238, 0.35), transparent 23%), radial-gradient(circle at 15% 85%, rgba(46, 106, 163, 0.28), transparent 28%), #080c11",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "18px", color: "#bcd9ea", fontSize: 28, letterSpacing: 4 }}>
          <span style={{ display: "flex", width: 58, height: 58, alignItems: "center", justifyContent: "center", borderRadius: 29, background: "#183044", color: "#e6f6ff", fontSize: 20, fontWeight: 700 }}>LM</span>
          DEVELOPER AND PRODUCT BUILDER
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 960 }}>
          <span style={{ fontSize: 92, lineHeight: 0.92, fontWeight: 700, letterSpacing: -5 }}>Laurent Maxhuni</span>
          <span style={{ marginTop: 28, color: "#b9c9d5", fontSize: 34, lineHeight: 1.35 }}>Web products, AI tools, browser extensions, and the work behind them.</span>
        </div>
        <div style={{ display: "flex", color: "#9fcbe4", fontSize: 25 }}>{siteHost}</div>
      </div>
    ),
    size,
  );
}
