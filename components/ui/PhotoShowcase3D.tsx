"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { Box } from "lucide-react";
import { type PointerEvent, type ReactNode, useEffect, useRef } from "react";

interface PhotoShowcase3DProps {
  media: ReactNode;
  footer: ReactNode;
  badgeLabel?: string;
  accent?: "sky" | "indigo";
  className?: string;
  paddingClassName?: string;
}

const ACCENT_STYLES = {
  sky: {
    rimTop: "via-sky-400/75",
    rimBottom: "via-indigo-400/50",
    glowBg:
      "bg-[radial-gradient(ellipse_at_50%_50%,rgba(56,189,248,0.28),rgba(99,102,241,0.16)_52%,transparent_76%)]",
    cornerColor: "border-sky-300/70",
    badgeBorder: "border-sky-400/35 bg-slate-950/75 text-sky-200",
    badgeDot: "bg-sky-400 shadow-[0_0_8px_#38bdf8]",
    glareAccent: "rgba(56, 189, 248, 0.14)",
    hoverBorder: "hover:border-sky-400/40",
  },
  indigo: {
    rimTop: "via-violet-400/75",
    rimBottom: "via-sky-400/50",
    glowBg:
      "bg-[radial-gradient(ellipse_at_50%_50%,rgba(139,92,246,0.28),rgba(56,189,248,0.15)_52%,transparent_76%)]",
    cornerColor: "border-indigo-300/70",
    badgeBorder: "border-indigo-400/35 bg-slate-950/75 text-indigo-200",
    badgeDot: "bg-indigo-400 shadow-[0_0_8px_#818cf8]",
    glareAccent: "rgba(139, 92, 246, 0.14)",
    hoverBorder: "hover:border-indigo-400/40",
  },
} as const;

export default function PhotoShowcase3D({
  media,
  footer,
  badgeLabel = "3D Depth View",
  accent = "sky",
  className = "",
  paddingClassName = "p-3",
}: PhotoShowcase3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);

  // Raw normalized pointer coordinates in [-0.5, 0.5]
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Spring-damped coordinates for realistic physical inertia
  const springConfig = { stiffness: 210, damping: 22, mass: 0.65 };
  const smoothX = useSpring(rawX, springConfig);
  const smoothY = useSpring(rawY, springConfig);

  // 3D pitch & yaw rotation
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-11, 11]);
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [10, -10]);

  // Subtle counter-parallax shift for inner photo window depth
  const imgX = useTransform(smoothX, [-0.5, 0.5], [7, -7]);
  const imgY = useTransform(smoothY, [-0.5, 0.5], [7, -7]);

  // Opposite-direction deep ambient 3D shadow offset
  const shadowX = useTransform(smoothX, [-0.5, 0.5], [18, -18]);
  const shadowY = useTransform(smoothY, [-0.5, 0.5], [18, -18]);

  // Real-time studio specular glare coordinates (%)
  const glareX = useTransform(smoothX, [-0.5, 0.5], [14, 86]);
  const glareY = useTransform(smoothY, [-0.5, 0.5], [14, 86]);

  const palette = ACCENT_STYLES[accent];

  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.24) 0%, ${palette.glareAccent} 34%, transparent 66%)`;
  const rimSweepBackground = useMotionTemplate`linear-gradient(125deg, transparent 22%, rgba(255,255,255,0.16) ${glareX}%, transparent 78%)`;

  // Subtle autonomous 3D breathing float when not actively hovered
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let frameId = 0;
    const start = performance.now();
    const phaseOffset = accent === "sky" ? 0.4 : 2.2;

    const tick = () => {
      if (!isHoveredRef.current) {
        const t = (performance.now() - start) * 0.001 + phaseOffset;
        rawX.set(Math.sin(t * 0.72) * 0.14);
        rawY.set(Math.cos(t * 0.56) * 0.11);
      }
      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [accent, rawX, rawY]);

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    isHoveredRef.current = true;
    rawX.set(Math.max(-0.5, Math.min(0.5, nx)));
    rawY.set(Math.max(-0.5, Math.min(0.5, ny)));
  };

  const handlePointerLeave = () => {
    isHoveredRef.current = false;
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <div
      className={`group/card3d relative ${className}`}
      style={{ perspective: "1100px" }}
    >
      <motion.div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className={`relative rounded-2xl border border-white/15 bg-gradient-to-br from-[#0b1330]/95 via-[#05091b]/98 to-[#030510] ${paddingClassName} shadow-[0_28px_70px_rgba(2,6,23,0.88)] ring-1 ring-inset ring-white/[0.07] transition-colors duration-300 ${palette.hoverBorder}`}
      >
        {/* LAYER 0: Deep Floating Volumetric Shadow & Studio Glow Behind Chassis */}
        <motion.div
          aria-hidden="true"
          style={{
            x: shadowX,
            y: shadowY,
            transform: "translateZ(-28px) scale(0.95)",
          }}
          className={`pointer-events-none absolute -inset-2 -z-10 rounded-3xl blur-2xl opacity-75 transition-opacity duration-300 group-hover/card3d:opacity-100 ${palette.glowBg}`}
        />

        {/* Machined Specular Edge Rim Lines (Top & Bottom Bevels) */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent ${palette.rimTop} to-transparent`}
        />
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-10 bottom-0 h-px bg-gradient-to-r from-transparent ${palette.rimBottom} to-transparent`}
        />

        {/* Iridescent Bevel Glass Sweep */}
        <motion.div
          aria-hidden="true"
          style={{ background: rimSweepBackground }}
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-50 transition-opacity duration-300 group-hover/card3d:opacity-90"
        />

        {/* LAYER 2: Elevated 3D Optical Photo Plate */}
        <div
          style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }}
          className="relative overflow-hidden rounded-xl border border-white/15 bg-slate-950 shadow-[0_14px_34px_rgba(2,6,23,0.72)]"
        >
          {/* Inner Parallax Photo Window */}
          <motion.div
            style={{ x: imgX, y: imgY, scale: 1.045 }}
            className="relative will-change-transform"
          >
            {media}
          </motion.div>

          {/* LAYER 3: Real-Time Anti-Reflective Studio Specular Glare */}
          <motion.div
            aria-hidden="true"
            style={{ background: glareBackground }}
            className="pointer-events-none absolute inset-0 mix-blend-screen opacity-75 transition-opacity duration-300 group-hover/card3d:opacity-100"
          />

          {/* Precision Corner Optical Framing Reticles */}
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 rounded-tl-md border-l-2 border-t-2 ${palette.cornerColor} opacity-70`}
          />
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute right-2.5 top-2.5 h-3.5 w-3.5 rounded-tr-md border-r-2 border-t-2 ${palette.cornerColor} opacity-70`}
          />
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute bottom-2.5 left-2.5 h-3.5 w-3.5 rounded-bl-md border-b-2 border-l-2 ${palette.cornerColor} opacity-70`}
          />
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute bottom-2.5 right-2.5 h-3.5 w-3.5 rounded-br-md border-b-2 border-r-2 ${palette.cornerColor} opacity-70`}
          />
        </div>

        {/* LAYER 4: Floating Holographic 3D Depth Pill Hovering Above Frame */}
        <div
          style={{ transform: "translateZ(42px)" }}
          className="pointer-events-none absolute right-5 top-5 z-20"
        >
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] backdrop-blur-md shadow-[0_8px_20px_rgba(2,6,23,0.65)] ${palette.badgeBorder}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${palette.badgeDot}`} />
            <Box className="h-2.5 w-2.5 opacity-85" />
            <span>{badgeLabel}</span>
          </span>
        </div>

        {/* LAYER 3B: Elevated 3D Identity / Caption Plate */}
        <div
          style={{ transform: "translateZ(26px)" }}
          className="relative z-10"
        >
          {footer}
        </div>
      </motion.div>
    </div>
  );
}
