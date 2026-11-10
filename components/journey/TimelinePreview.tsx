"use client";

import { JOURNEY_STAGES } from "@/data/journeyData";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Compass, Layers, Rocket } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function TimelinePreview() {
  const [activeId, setActiveId] = useState<"year-1" | "year-2" | "my-future">("year-1");
  const activeStage =
    JOURNEY_STAGES.find((stage) => stage.id === activeId) ?? JOURNEY_STAGES[0];

  const getIcon = (id: string) => {
    if (id === "year-1") return <Compass className="h-4 w-4" />;
    if (id === "year-2") return <Layers className="h-4 w-4" />;
    return <Rocket className="h-4 w-4" />;
  };

  return (
    <div className="glass-panel relative overflow-hidden rounded-3xl p-6 sm:p-8 lg:p-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl"
      />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-sky-300">
            Interactive Timeline Preview
          </span>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold text-white sm:text-3xl">
            Three Chapters of Transformation
          </h2>
        </div>

        {/* Interactive Stage Switcher */}
        <div className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-slate-950/60 p-1.5">
          {JOURNEY_STAGES.map((stage) => {
            const isSelected = stage.id === activeId;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setActiveId(stage.id)}
                className={`relative inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition sm:text-sm ${
                  isSelected ? "text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                {isSelected && (
                  <motion.span
                    layoutId="homeTimelinePill"
                    className="absolute inset-0 rounded-xl border border-indigo-400/40 bg-gradient-to-r from-indigo-500/35 to-violet-500/35"
                    transition={{ type: "spring", stiffness: 360, damping: 28 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {getIcon(stage.id)}
                  <span>{stage.shortTitle}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Animated stage preview card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStage.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-8 grid gap-8 border-t border-white/10 pt-8 lg:grid-cols-[1.15fr_1fr]"
        >
          <div>
            <div className="flex items-center gap-3">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 font-mono text-sm font-bold text-white"
                style={{ backgroundColor: activeStage.glowColor }}
              >
                {activeStage.stepNumber}
              </span>
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-slate-400">
                  {activeStage.period}
                </p>
                <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-white sm:text-2xl">
                  {activeStage.title}
                </h3>
              </div>
            </div>

            <p className="mt-4 text-base font-medium text-sky-200">
              {activeStage.tagline}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
              {activeStage.summary}
            </p>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm italic leading-relaxed text-indigo-200">
                “{activeStage.reflection}”
              </p>
            </div>

            <div className="mt-6">
              <Link
                href={`/journey?stage=${activeStage.id}`}
                className="inline-flex items-center gap-2 rounded-xl border border-sky-400/35 bg-sky-500/15 px-5 py-2.5 text-sm font-semibold text-sky-200 transition hover:bg-sky-500/25 hover:text-white"
              >
                <span>Explore {activeStage.shortTitle} in 3D Timeline</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {activeStage.milestones.slice(0, 4).map((milestone) => (
              <div
                key={milestone.id}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 transition hover:border-indigo-400/30 hover:bg-white/[0.05]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      className="h-4 w-4 shrink-0"
                      style={{ color: activeStage.accentColor }}
                    />
                    <h4 className="font-[family-name:var(--font-display)] text-sm font-semibold text-white">
                      {milestone.title}
                    </h4>
                  </div>
                  <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-slate-300">
                    {milestone.tag}
                  </span>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                  {milestone.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
