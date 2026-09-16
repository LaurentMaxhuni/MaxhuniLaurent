"use client";

import { useEffect, useRef } from "react";

type RevealProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

export default function Reveal({ children, className = "", ...props }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || typeof IntersectionObserver === "undefined") {
      return;
    }

    node.classList.add("reveal--pending");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.remove("reveal--pending");
          node.classList.add("reveal--ready");
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8%", threshold: 0.08 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div {...props} ref={ref} className={`reveal ${ready ? "reveal--ready" : ""} ${className}`}>
      {children}
    </div>
  );
}
