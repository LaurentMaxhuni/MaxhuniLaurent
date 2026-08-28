"use client";

import type { CSSProperties } from "react";
import GlobeStudy from "@/components/ui/globe-study";
import OrbitingCircles02, { type OrbitingCircles02Ring } from "@/components/shadcn-space/orbiting-circles/orbiting-circles-02";

type Skill = {
  label: string;
  logo: string;
  color: string;
};

const skills: Skill[] = [
  { label: "TypeScript", logo: "https://svgl.app/library/typescript.svg", color: "#3178c6" },
  { label: "JavaScript", logo: "https://svgl.app/library/javascript.svg", color: "#f7df1e" },
  { label: "Python", logo: "https://svgl.app/library/python.svg", color: "#3776ab" },
  { label: "Rust", logo: "https://cdn.simpleicons.org/rust/ffffff", color: "#f4f0e9" },
  { label: "React", logo: "https://svgl.app/library/react_light.svg", color: "#61dafb" },
  { label: "Next.js", logo: "https://cdn.simpleicons.org/nextdotjs/ffffff", color: "#f4f0e9" },
  { label: "Node.js", logo: "https://svgl.app/library/nodejs.svg", color: "#83cd29" },
  { label: "NestJS", logo: "https://svgl.app/library/nestjs.svg", color: "#e0234e" },
  { label: "PostgreSQL", logo: "https://svgl.app/library/postgresql.svg", color: "#699eca" },
  { label: "Prisma", logo: "https://cdn.simpleicons.org/prisma/ffffff", color: "#5a67d8" },
  { label: "REST APIs", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/openapi/openapi-original.svg", color: "#6ba539" },
  { label: "Docker", logo: "https://svgl.app/library/docker.svg", color: "#2496ed" },
  { label: "Git", logo: "https://svgl.app/library/git.svg", color: "#f05032" },
  { label: "Vercel", logo: "https://cdn.simpleicons.org/vercel/ffffff", color: "#f4f0e9" },
  { label: "LLM Engineering", logo: "https://svgl.app/library/hugging_face.svg", color: "#ffd21e" },
  { label: "Local LLM Deployment", logo: "https://cdn.simpleicons.org/ollama/ffffff", color: "#f5f5f5" },
];

type LogoStyle = CSSProperties & { "--brand-color": string };

function SkillMark({ skill }: { skill: Skill }) {
  const style: LogoStyle = { "--brand-color": skill.color };

  return (
    <span
      className="orbiting-skills__mark"
      style={style}
      role="img"
      aria-label={skill.label}
      title={skill.label}
      data-skill={skill.label}
      tabIndex={0}
    >
      {/* These are the real brand SVG assets, not recolored icon glyphs. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={skill.logo}
        alt=""
        aria-hidden="true"
        width="32"
        height="32"
        draggable="false"
        style={skill.label === "Rust" ? { filter: "grayscale(1) brightness(0) invert(1)" } : undefined}
      />
      <span className="orbiting-skills__label">{skill.label}</span>
    </span>
  );
}

function ringChildren(from: number, to: number) {
  return skills.slice(from, to).map((skill) => <SkillMark key={skill.label} skill={skill} />);
}

export default function OrbitingSkills() {
  const rings: OrbitingCircles02Ring[] = [
    { radius: "clamp(140px, 17vw, 245px)", duration: 34, children: ringChildren(0, 6) },
    { radius: "clamp(190px, 22.9vw, 330px)", duration: 42, reverse: true, children: ringChildren(6, 10) },
    { radius: "clamp(240px, 28.8vw, 415px)", duration: 50, children: ringChildren(10, 16) },
  ];

  return (
    <OrbitingCircles02
      className="orbiting-skills"
      aria-label="Technical range shown as orbiting skills"
      center={<GlobeStudy opacity={0.82} brightness={1.06} />}
      rings={rings}
    />
  );
}
