import { useEffect, useRef } from "react";
import { usePointer } from "../hooks/usePointer";

type Point = {
  x: number;
  y: number;
  z: number;
  size: number;
  kind: "core" | "star" | "ring";
};

function makePoints() {
  const points: Point[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  const count = 1600;

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const radius = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    points.push({
      x: Math.cos(theta) * radius,
      y,
      z: Math.sin(theta) * radius,
      size: i % 17 === 0 ? 2.4 : i % 7 === 0 ? 1.55 : 1,
      kind: i % 17 === 0 ? "star" : "core",
    });
  }

  for (const lat of [-0.62, -0.18, 0.28, 0.68]) {
    const ringRadius = Math.sqrt(Math.max(0, 1 - lat * lat));
    for (let i = 0; i < 96; i++) {
      const theta = (i / 96) * Math.PI * 2;
      points.push({
        x: Math.cos(theta) * ringRadius,
        y: lat,
        z: Math.sin(theta) * ringRadius,
        size: 1.7,
        kind: "ring",
      });
    }
  }

  return points;
}

export function ParticleSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { pointer, target } = usePointer();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const points = makePoints();
    let auto = 0.4;
    let width = 0;
    let height = 0;
    let frame = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === width && rect.height === height) return;
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const paint = () => {
      resize();
      ctx.clearRect(0, 0, width, height);

      const p = pointer.current;
      p.tx = target.x;
      p.ty = target.y;
      p.x += (p.tx - p.x) * 0.12;
      p.y += (p.ty - p.y) * 0.12;

      const rotY = auto + p.x * 1.35;
      const rotX = p.y * 0.95;
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const cx = width * 0.5 + p.x * width * 0.045;
      const cy = height * 0.5 + p.y * height * 0.04;
      const scale = Math.min(width, height) * 0.42;

      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, scale * 1.4);
      glow.addColorStop(0, "rgba(203, 255, 252, 0.16)");
      glow.addColorStop(0.45, "rgba(0, 130, 124, 0.1)");
      glow.addColorStop(1, "rgba(1, 38, 36, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = "lighter";

      for (const point of points) {
        let y = point.y * cosX - point.z * sinX;
        let z = point.y * sinX + point.z * cosX;
        const x = point.x * cosY - z * sinY;
        z = point.x * sinY + z * cosY;

        const depth = (z + 1) / 2;
        const px = cx + x * scale;
        const py = cy + y * scale;
        const dx = px - (cx + p.x * scale * 0.55);
        const dy = py - (cy + p.y * scale * 0.55);
        const towardCursor = Math.max(0, 1 - Math.hypot(dx, dy) / (scale * 0.9));

        ctx.globalAlpha = 0.08 + depth * 0.55 + towardCursor * 0.4;
        ctx.fillStyle =
          towardCursor > 0.55
            ? "#fde9ff"
            : point.kind === "ring"
              ? "#cbfffc"
              : depth > 0.6
                ? "#edfffe"
                : "#00827c";
        ctx.beginPath();
        ctx.arc(
          px,
          py,
          (0.35 + depth * 1.35) * point.size + towardCursor * 1.1,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    const tick = () => {
      paint();
      if (!reduce) auto += 0.0022;
      frame = requestAnimationFrame(tick);
    };

    tick();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [pointer, target]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
