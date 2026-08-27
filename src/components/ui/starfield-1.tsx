"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

type Star = {
  alpha: number;
  drift: number;
  radius: number;
  x: number;
  y: number;
};

type StarfieldProps = {
  className?: string;
  starCount?: number;
};

function createStars(count: number): Star[] {
  let seed = 82439;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  return Array.from({ length: count }, () => ({
    alpha: 0.25 + random() * 0.75,
    drift: 0.05 + random() * 0.18,
    radius: 0.35 + random() * 1.1,
    x: random(),
    y: random(),
  }));
}

/**
 * A local, pointer-inert fallback compatible with the 21st Starfield public API.
 * The public registry requires a signed-in 21st account in this environment.
 */
export function Starfield({ className, starCount = 72 }: StarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const stars = createStars(starCount);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let pixelRatio = 1;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const render = (time = 0) => {
      context.clearRect(0, 0, width, height);

      for (const star of stars) {
        const y = (star.y * height + time * star.drift * 0.006) % height;
        const shimmer = 0.76 + Math.sin(time * 0.0012 + star.x * 30) * 0.24;
        context.beginPath();
        context.fillStyle = `rgba(231, 244, 255, ${star.alpha * shimmer})`;
        context.arc(star.x * width, y, star.radius, 0, Math.PI * 2);
        context.fill();
      }

      if (!reduceMotion) animationFrame = window.requestAnimationFrame(render);
    };

    resize();
    render();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      observer.disconnect();
    };
  }, [starCount]);

  return <canvas ref={canvasRef} className={cn("pointer-events-none absolute inset-0 h-full w-full", className)} aria-hidden="true" />;
}
