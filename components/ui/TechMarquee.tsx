"use client";

import { getTechVisualMeta } from "@/components/ui/BrandIcons";
import { ALL_LEARNED_TECH, type LearnedTechBadge } from "@/data/journeyData";
import { ArrowRight, Code2, Pause, Play } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const BASE_SPEED_PX_PER_SEC = 56;

function TechChip({ item }: { item: LearnedTechBadge }) {
  const tech = getTechVisualMeta(item.name, "pill");

  return (
    <li className="shrink-0">
      <div className="group/chip relative flex items-center gap-2.5 overflow-hidden rounded-xl border border-white/[0.085] bg-[#080e24]/95 px-3.5 py-2.5 shadow-[0_6px_20px_rgba(2,5,18,0.48),inset_0_1px_0_rgba(255,255,255,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-[#0d1636]">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-3.5 bottom-0 h-[1.5px] rounded-full opacity-60 transition-opacity duration-300 group-hover/chip:opacity-100"
          style={{
            background: `linear-gradient(90deg, transparent, ${tech.color}, transparent)`,
          }}
        />

        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-transform duration-300 group-hover/chip:scale-105"
          style={{
            backgroundColor: tech.bg,
            borderColor: tech.border,
            boxShadow: `0 0 14px -2px ${tech.glow}`,
          }}
        >
          {tech.icon}
        </span>

        <div className="flex flex-col pr-1 leading-none">
          <span className="whitespace-nowrap font-[family-name:var(--font-display)] text-[13px] font-semibold tracking-tight text-slate-100 transition-colors group-hover/chip:text-white">
            {item.name}
          </span>
          <span
            className="mt-1 whitespace-nowrap font-mono text-[9.5px] font-medium uppercase tracking-[0.14em]"
            style={{ color: tech.textColor }}
          >
            {item.role}
          </span>
        </div>
      </div>
    </li>
  );
}

export default function TechMarquee() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const primaryListRef = useRef<HTMLUListElement>(null);

  const [autoPlay, setAutoPlay] = useState(true);
  const autoPlayRef = useRef(true);
  const hoveredRef = useRef(false);
  const inViewRef = useRef(true);

  useEffect(() => {
    autoPlayRef.current = autoPlay;
  }, [autoPlay]);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const primaryList = primaryListRef.current;
    if (!section || !track || !primaryList) return;

    let loopWidth = primaryList.getBoundingClientRect().width;
    let offset = 0;
    let currentVelocity = BASE_SPEED_PX_PER_SEC;
    let lastTime = performance.now();
    let frameId = 0;

    const measure = () => {
      const measured = primaryList.getBoundingClientRect().width;
      if (measured > 0) {
        loopWidth = measured;
        if (offset <= -loopWidth) {
          offset = offset % loopWidth;
        }
      }
    };

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(primaryList);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
      },
      { rootMargin: "220px" },
    );
    intersectionObserver.observe(section);

    const tick = (now: number) => {
      const dt = Math.min(0.05, Math.max(0, (now - lastTime) / 1000));
      lastTime = now;

      const shouldMove =
        inViewRef.current && autoPlayRef.current && !hoveredRef.current;
      const targetVelocity = shouldMove ? BASE_SPEED_PX_PER_SEC : 0;

      // Smooth cinematic acceleration/deceleration rather than an abrupt halt
      currentVelocity += (targetVelocity - currentVelocity) * Math.min(1, dt * 8);

      if (loopWidth > 0 && Math.abs(currentVelocity) > 0.05) {
        offset -= currentVelocity * dt;
        if (offset <= -loopWidth) {
          offset = offset % loopWidth;
        }
        track.style.transform = `translate3d(${offset}px, 0, 0)`;
      }

      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="IT Languages and Technologies Learned at PNC"
      className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#060a1b]/82 px-3.5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_14px_38px_rgba(2,5,18,0.45)] sm:px-5 sm:py-5"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/35 to-transparent"
      />

      <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2.5 px-1">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg border border-sky-400/25 bg-sky-500/12">
            <Code2 className="h-3.5 w-3.5 text-sky-300" />
          </span>
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-200">
            IT Languages &amp; Tech Stack Learned at PNC
          </span>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 font-mono text-[10px] text-slate-400">
            {ALL_LEARNED_TECH.length} Technologies
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setAutoPlay((prev) => !prev)}
            aria-pressed={autoPlay}
            aria-label={
              autoPlay
                ? "Pause IT tech stack marquee"
                : "Play IT tech stack marquee"
            }
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/12 bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-slate-200 transition hover:border-sky-400/45 hover:text-white"
          >
            {autoPlay ? (
              <>
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                <Pause className="h-3 w-3 text-sky-300" />
                <span>Auto</span>
              </>
            ) : (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                <Play className="h-3 w-3 text-sky-300" />
                <span>Paused</span>
              </>
            )}
          </button>

          <Link
            href="/skills-projects"
            className="group inline-flex items-center gap-1.5 font-mono text-[11px] font-medium text-sky-300 transition hover:text-sky-200"
          >
            <span>Explore Full Stack &amp; Projects</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      {/* Single continuous right-to-left horizontal stream */}
      <div
        onMouseEnter={() => {
          hoveredRef.current = true;
        }}
        onMouseLeave={() => {
          hoveredRef.current = false;
        }}
        className="w-full overflow-hidden py-0.5"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, #000000 5%, #000000 95%, transparent 100%)",
          maskImage:
            "linear-gradient(to right, transparent 0%, #000000 5%, #000000 95%, transparent 100%)",
        }}
      >
        <div
          ref={trackRef}
          className="flex w-max flex-nowrap items-center"
          style={{
            display: "flex",
            width: "max-content",
            flexWrap: "nowrap",
            willChange: "transform",
          }}
        >
          <ul
            ref={primaryListRef}
            className="flex shrink-0 flex-nowrap items-center gap-3 pr-3"
            style={{ display: "flex", flexWrap: "nowrap", flexShrink: 0 }}
          >
            {ALL_LEARNED_TECH.map((item) => (
              <TechChip key={`tech-${item.name}`} item={item} />
            ))}
          </ul>

          {/* Seamless off-screen wrap tail (> 3600px past primary start so no duplicates ever appear together) */}
          <ul
            aria-hidden="true"
            className="flex shrink-0 flex-nowrap items-center gap-3 pr-3"
            style={{ display: "flex", flexWrap: "nowrap", flexShrink: 0 }}
          >
            {ALL_LEARNED_TECH.map((item) => (
              <TechChip key={`wrap-${item.name}`} item={item} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
