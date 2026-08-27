"use client";

import { useMemo, type CSSProperties } from "react";

// A focused, self-contained GlobeStudy canvas. It keeps the public prop
// surface from MengTo's text-path study while isolating the interactive art in
// a sandboxed document so it cannot affect the portfolio's global styles.
const GLOBE_STUDY_SOURCE = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Text on a Path II — Globe</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  html, body { width: 100%; height: 100%; margin: 0; overflow: hidden; background: transparent; }
  body { font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
  canvas { display: block; width: 100%; height: 100%; cursor: crosshair; touch-action: none; }
</style>
</head>
<body>
<canvas aria-label="Interactive text globe"></canvas>
<script>
(() => {
  "use strict";
  const canvas = document.querySelector("canvas");
  const context = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const phrase = "everypointonthisballisapathbacktoanotherone";
  const nodes = [];
  const pins = [];
  let width = 0;
  let height = 0;
  let dpr = 1;
  let spin = 1.98;
  let velocity = 0.13;
  let tilt = -0.32;
  let tiltVelocity = 0;
  let zoom = 1;
  let targetZoom = 1;
  let drag = null;
  let pointer = null;
  let previous = performance.now();

  function inside(lon, lat, cx, cy, rx, ry) {
    const dx = (lon - cx) / rx;
    const dy = (lat - cy) / ry;
    return dx * dx + dy * dy < 1;
  }

  // Simplified continental silhouettes retain a legible Earth at any size.
  function isLand(lon, lat) {
    return (
      inside(lon, lat, -102, 42, 39, 43) ||
      inside(lon, lat, -64, -16, 23, 45) ||
      inside(lon, lat, 18, 12, 27, 47) ||
      inside(lon, lat, 76, 44, 70, 30) ||
      inside(lon, lat, 134, -25, 22, 17) ||
      inside(lon, lat, -12, 65, 14, 12)
    );
  }

  let letterIndex = 0;
  for (let lat = -84; lat <= 84; lat += 3.15) {
    const count = Math.max(1, Math.round(96 * Math.cos(lat * Math.PI / 180)));
    for (let index = 0; index < count; index += 1) {
      const lon = -180 + 360 * index / count;
      const land = isLand(lon, lat);
      nodes.push({
        lat: lat * Math.PI / 180,
        lon: lon * Math.PI / 180,
        land,
        letter: land && index % 2 === 0 ? phrase.charAt(letterIndex++ % phrase.length) : "",
      });
    }
  }

  function resize() {
    const bounds = canvas.getBoundingClientRect();
    width = Math.max(1, bounds.width);
    height = Math.max(1, bounds.height);
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function point(event) {
    const bounds = canvas.getBoundingClientRect();
    return { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
  }

  function draw(now) {
    const elapsed = Math.min(64, now - previous);
    previous = now;
    const size = Math.min(width, height);
    const radius = size * 0.42 * zoom;
    const centerX = width / 2;
    const centerY = height / 2;
    const cosineSpin = Math.cos(spin);
    const sineSpin = Math.sin(spin);
    const cosineTilt = Math.cos(tilt);
    const sineTilt = Math.sin(tilt);

    context.clearRect(0, 0, width, height);
    context.save();
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, Math.PI * 2);
    context.clip();

    if (!drag && !reduceMotion) {
      velocity += (0.12 - velocity) * Math.min(1, elapsed / 900);
      tiltVelocity *= Math.pow(0.9, elapsed / 16);
      tilt += tiltVelocity * elapsed / 1000;
      tilt += (-0.32 - tilt) * Math.min(1, elapsed / 4200);
      spin += velocity * elapsed / 1000;
    }
    zoom += (targetZoom - zoom) * Math.min(1, elapsed / 180);

    context.textAlign = "center";
    context.textBaseline = "middle";
    const fontSize = Math.max(5, size * 0.031 * Math.pow(zoom, 0.72));

    for (const node of nodes) {
      const latitudeCosine = Math.cos(node.lat);
      const x0 = latitudeCosine * Math.cos(node.lon);
      const y0 = Math.sin(node.lat);
      const z0 = latitudeCosine * Math.sin(node.lon);
      const x1 = x0 * cosineSpin - z0 * sineSpin;
      const z1 = x0 * sineSpin + z0 * cosineSpin;
      const y2 = y0 * cosineTilt - z1 * sineTilt;
      const z2 = y0 * sineTilt + z1 * cosineTilt;
      if (z2 <= 0.02) continue;

      const x = centerX + x1 * radius;
      const y = centerY - y2 * radius;
      const alpha = 0.1 + z2 * 0.78;
      if (!node.land) {
        context.fillStyle = "rgba(226,228,233," + (alpha * 0.42).toFixed(3) + ")";
        context.fillRect(x, y, Math.max(0.6, size * 0.0024), Math.max(0.6, size * 0.0024));
        continue;
      }

      if (!node.letter) {
        context.fillStyle = "rgba(226,228,233," + (alpha * 0.68).toFixed(3) + ")";
        context.fillRect(x, y, Math.max(0.8, size * 0.0038), Math.max(0.8, size * 0.0038));
        continue;
      }

      const tangentX = -Math.sin(node.lon) * cosineSpin - Math.cos(node.lon) * sineSpin;
      const tangentZ = -Math.sin(node.lon) * sineSpin + Math.cos(node.lon) * cosineSpin;
      context.save();
      context.translate(x, y);
      context.rotate(Math.atan2(tangentZ * sineTilt, tangentX));
      context.font = "700 " + (fontSize * (0.44 + z2 * 0.56)).toFixed(2) + "px Inter, -apple-system, sans-serif";
      context.fillStyle = "rgba(242,243,245," + alpha.toFixed(3) + ")";
      context.fillText(node.letter, 0, 0);
      context.restore();
    }

    context.restore();
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, Math.PI * 2);
    context.strokeStyle = "rgba(255,255,255,.18)";
    context.lineWidth = Math.max(0.75, size * 0.002);
    context.stroke();

    for (const pin of pins) {
      const age = (now - pin.time) / 1000;
      if (age > 4) continue;
      const opacity = Math.max(0, 1 - age / 4);
      context.beginPath();
      context.arc(pin.x, pin.y, size * 0.017, 0, Math.PI * 2);
      context.strokeStyle = "rgba(255,255,255," + (opacity * 0.7).toFixed(3) + ")";
      context.lineWidth = Math.max(0.75, size * 0.002);
      context.stroke();
    }

    requestAnimationFrame(draw);
  }

  canvas.addEventListener("pointerdown", (event) => {
    drag = point(event);
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener("pointermove", (event) => {
    pointer = point(event);
    if (!drag) return;
    const next = point(event);
    velocity = (next.x - drag.x) / Math.max(1, Math.min(width, height)) * 9;
    tiltVelocity = -(next.y - drag.y) / Math.max(1, Math.min(width, height)) * 6;
    tilt = Math.max(-1.15, Math.min(1.15, tilt + tiltVelocity * 0.016));
    drag = next;
  });
  canvas.addEventListener("pointerup", (event) => {
    const next = point(event);
    if (drag && Math.hypot(next.x - drag.x, next.y - drag.y) < 5) {
      pins.push({ x: next.x, y: next.y, time: performance.now() });
      if (pins.length > 5) pins.shift();
    }
    drag = null;
  });
  canvas.addEventListener("pointercancel", () => { drag = null; });
  canvas.addEventListener("wheel", (event) => {
    event.preventDefault();
    targetZoom = Math.max(0.85, Math.min(1.65, targetZoom * Math.exp(-event.deltaY * 0.0016)));
  }, { passive: false });

  new ResizeObserver(resize).observe(canvas);
  resize();
  requestAnimationFrame(draw);
})();
</script>
</body>
</html>`;

export type GlobeStudyProps = {
  mode?: "dark" | "light";
  scale?: number;
  opacity?: number;
  hue?: number;
  saturation?: number;
  brightness?: number;
  className?: string;
  style?: CSSProperties;
};

export const GLOBE_STUDY_DEFAULTS = {
  mode: "dark",
  scale: 1,
  opacity: 1,
  hue: 0,
  saturation: 1,
  brightness: 1,
} as const;

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function focusedDocument(mode: "dark" | "light") {
  const background = mode === "light" ? "#f3f5f8" : "transparent";
  const ink = mode === "light" ? "38,40,48" : "226,228,233";

  return GLOBE_STUDY_SOURCE
    .replace("background: transparent;", `background: ${background};`)
    .replaceAll("226,228,233", ink)
    .replaceAll("242,243,245", mode === "light" ? "23,25,34" : "242,243,245");
}

export default function GlobeStudy({
  mode = GLOBE_STUDY_DEFAULTS.mode,
  scale = GLOBE_STUDY_DEFAULTS.scale,
  opacity = GLOBE_STUDY_DEFAULTS.opacity,
  hue = GLOBE_STUDY_DEFAULTS.hue,
  saturation = GLOBE_STUDY_DEFAULTS.saturation,
  brightness = GLOBE_STUDY_DEFAULTS.brightness,
  className,
  style,
}: GlobeStudyProps) {
  const safeMode = mode === "light" ? "light" : "dark";
  const document = useMemo(() => focusedDocument(safeMode), [safeMode]);
  const boundedScale = clamp(scale, 0.65, 1.5);
  const boundedOpacity = clamp(opacity, 0.1, 1);
  const boundedHue = clamp(hue, -180, 180);
  const boundedSaturation = clamp(saturation, 0, 2);
  const boundedBrightness = clamp(brightness, 0.4, 1.8);
  const filter =
    boundedHue === 0 && boundedSaturation === 1 && boundedBrightness === 1
      ? undefined
      : `hue-rotate(${boundedHue}deg) saturate(${boundedSaturation}) brightness(${boundedBrightness})`;

  return (
    <div
      className={["text-path-study", `text-path-study--${safeMode}`, className].filter(Boolean).join(" ")}
      data-mode={safeMode}
      style={{ opacity: boundedOpacity, filter, width: "100%", height: "100%", ...style }}
    >
      <iframe
        className="text-path-study-frame"
        data-mode={safeMode}
        title="Globe interactive canvas study"
        sandbox="allow-scripts"
        srcDoc={document}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          display: "block",
          transform: boundedScale === 1 ? undefined : `scale(${boundedScale})`,
        }}
      />
    </div>
  );
}
