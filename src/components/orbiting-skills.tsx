"use client";

import type { CSSProperties } from "react";

const skills = [
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "PostgreSQL",
  "AI tooling",
  "Browser APIs",
  "Product UI",
  "Vercel",
  "Motion",
  "GitHub",
];

type OrbitalStyle = CSSProperties & {
  "--angle": string;
  "--delay": string;
  "--orbit": string;
};

export default function OrbitingSkills() {
  return (
    <div className="orbiting-skills" aria-label="Technical range shown as orbiting skills">
      <div className="orbiting-skills__core">
        <span>01</span>
        <strong>Build<br />systems</strong>
      </div>
      <ul>
        {skills.map((skill, index) => {
          const outerOrbit = index % 2 === 0;
          const style: OrbitalStyle = {
            "--angle": `${(index * 360) / skills.length}deg`,
            "--delay": `${index * -0.45}s`,
            "--orbit": outerOrbit ? "min(32vw, 275px)" : "min(27vw, 190px)",
          };

          return <li key={skill} className="orbiting-skills__satellite" style={style}>{skill}</li>;
        })}
      </ul>
    </div>
  );
}
