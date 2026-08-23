"use client";

import dynamic from "next/dynamic";
import { ArrowDown, ArrowUpRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { site } from "@/content/portfolio";

const PlanetScene = dynamic(() => import("@/components/PlanetScene"), {
  ssr: false,
  loading: () => <div className="hero-planet__fallback" aria-hidden="true" />,
});

export default function HeroSection() {
  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <div className="hero__flare hero__flare--one" aria-hidden="true" />
      <div className="hero__flare hero__flare--two" aria-hidden="true" />
      <div className="shell hero__layout">
        <div className="hero__copy">
          <p className="hero__eyebrow"><Sparkles aria-hidden="true" size={16} /> {site.role}</p>
          <h1 id="hero-title">Built with a little gravity.</h1>
          <p>
            Laurent makes lively web products, AI tools, and browser extensions that feel intentional from first click to final detail.
          </p>
          <div className="hero__actions">
            <a className="blue-button" href="#projects">
              Explore projects <ArrowDown aria-hidden="true" size={18} />
            </a>
            <a className="hero__link" href="#contact">
              Make contact <ArrowUpRight aria-hidden="true" size={17} />
            </a>
          </div>
        </div>

        <div className="hero-orbit" aria-label="Interactive three-dimensional planet illustration">
          <motion.div
            className="orbit-chip orbit-chip--top"
            animate={{ y: [0, -14, 0], rotate: [-4, 4, -4] }}
            transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <span>01</span> ship
          </motion.div>
          <motion.div
            className="orbit-chip orbit-chip--side"
            animate={{ y: [0, 18, 0], rotate: [6, -3, 6] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.35 }}
          >
            <span>02</span> iterate
          </motion.div>
          <motion.div
            className="orbit-sphere orbit-sphere--large"
            animate={{ y: [0, -22, 0], x: [0, 9, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="orbit-sphere orbit-sphere--small"
            animate={{ y: [0, 16, 0], x: [0, -10, 0] }}
            transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          />
          <div className="hero-planet">
            <PlanetScene />
            <div className="hero-planet__label">
              <span>Based in</span>
              <strong>{site.location}</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
