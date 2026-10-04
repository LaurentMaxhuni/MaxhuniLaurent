import { ImageResponse } from "next/og";
import { getProjectBySlug } from "@/content/portfolio";
import { SITE_URL } from "@/lib/site";

export const runtime = "edge";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return new Response("Project not found", { status: 404 });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "58px 68px",
          color: "#f5f3ef",
          background: "radial-gradient(ellipse at 78% 18%, #252525 0, #101010 34%, #050505 72%)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, color: "#bdb8b0", fontSize: 22, letterSpacing: 2 }}>
          <span style={{ width: 10, height: 10, borderRadius: 10, background: "#d7d1c8" }} />
          LAURENT MAXHUNI · PROJECTS
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 1000 }}>
          <div style={{ color: "#aaa49d", fontSize: 24, letterSpacing: 1 }}>{project.status.toUpperCase()}</div>
          <div style={{ marginTop: 20, fontSize: 84, lineHeight: 0.98, fontWeight: 700, letterSpacing: -5 }}>{project.title}</div>
          <div style={{ marginTop: 24, maxWidth: 850, color: "#c8c3bc", fontSize: 27, lineHeight: 1.35 }}>{project.summary}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #3b3b3b", paddingTop: 20, color: "#aaa49d", fontSize: 20 }}>
          <span>Ideas deserve their own orbit.</span>
          <span>{new URL(SITE_URL).host}</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
