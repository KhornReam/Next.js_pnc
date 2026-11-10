"use client";

import MemoryGallery from "@/components/gallery/MemoryGallery";
import type { TimelineStageId } from "@/components/three/ThreeTimelineScene";
import { FadeInSection } from "@/components/ui/MotionPrimitives";
import PageHeader from "@/components/ui/PageHeader";
import { JOURNEY_STAGES } from "@/data/journeyData";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Compass,
  Eye,
  Layers,
  MousePointerClick,
  Rocket,
  Sparkles,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

const ThreeTimelineScene = dynamic(
  () => import("@/components/three/ThreeTimelineScene"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center font-mono text-xs text-indigo-300">
        Initializing 3D Constellation Timeline...
      </div>
    ),
  }
);

export default function JourneyExperience() {
  const searchParams = useSearchParams();
  const stageParam = searchParams.get("stage");
  const queryStage: TimelineStageId | null =
    stageParam === "year-1" ||
    stageParam === "year-2" ||
    stageParam === "my-future"
      ? stageParam
      : null;

  const [selectedStage, setSelectedStage] = useState<TimelineStageId | null>(null);
  const [overviewMode, setOverviewMode] = useState(false);

  const activeStage: TimelineStageId = selectedStage ?? queryStage ?? "year-1";
  const currentIndex = JOURNEY_STAGES.findIndex((s) => s.id === activeStage);
  const currentStage = JOURNEY_STAGES[currentIndex] ?? JOURNEY_STAGES[0];

  const handleSelectStage = (stageId: TimelineStageId) => {
    setSelectedStage(stageId);
    setOverviewMode(false);
  };

  const getIcon = (id: TimelineStageId) => {
    if (id === "year-1") return <Compass className="h-4 w-4" />;
    if (id === "year-2") return <Layers className="h-4 w-4" />;
    return <Rocket className="h-4 w-4" />;
  };

  return (
    <div>
      <PageHeader
        eyebrow="Chapter 02 • My Journey"
        title="The Interactive 3D Timeline"
        description="Navigate across two transformative years at PNC and into the future — interact with any 3D constellation node or toggle overview mode to inspect the entire trajectory."
        icon={<Compass className="h-3.5 w-3.5 text-sky-400" />}
        accentGradient="from-sky-500/20 via-indigo-500/15 to-transparent"
      />

      <div className="mx-auto max-w-7xl space-y-14 px-4 py-12 sm:px-6 lg:px-8">
        {/* INTERACTIVE 3D CONSTELLATION STAGE */}
        <FadeInSection>
          <div className="glass-panel relative overflow-hidden rounded-3xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-slate-950/40 px-5 py-3.5 sm:px-7">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <MousePointerClick className="h-4 w-4 text-sky-400" />
                <span>
                  Click any floating HUD tag or 3D sculpture to focus the camera
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setOverviewMode((prev) => !prev)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider transition ${
                    overviewMode
                      ? "border-sky-400/50 bg-sky-500/20 text-sky-100"
                      : "border-white/15 bg-white/[0.04] text-slate-300 hover:border-white/30 hover:text-white"
                  }`}
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>{overviewMode ? "Focused View" : "Overview All"}</span>
                </button>
              </div>
            </div>

            <div className="relative h-[340px] w-full bg-[radial-gradient(ellipse_at_50%_45%,rgba(79,70,229,0.22),rgba(4,7,20,0.98))] sm:h-[440px]">
              {/* Subtle top/bottom vignette */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-20 bg-gradient-to-t from-[#040714]/80 to-transparent"
              />

              <ThreeTimelineScene
                activeStage={activeStage}
                overviewMode={overviewMode}
                onSelectStage={handleSelectStage}
              />

              {/* Sleek bottom chapter stepper dock */}
              <div className="pointer-events-none absolute inset-x-4 bottom-4 z-20 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                {JOURNEY_STAGES.map((stage) => {
                  const selected = stage.id === activeStage && !overviewMode;
                  return (
                    <button
                      key={stage.id}
                      type="button"
                      onClick={() => handleSelectStage(stage.id)}
                      className={`pointer-events-auto inline-flex items-center gap-2.5 rounded-2xl border px-4 py-2 text-xs font-semibold backdrop-blur-xl transition sm:text-sm ${
                        selected
                          ? "border-white/35 bg-slate-900/90 text-white shadow-[0_0_28px_rgba(99,102,241,0.45)]"
                          : "border-white/10 bg-slate-950/75 text-slate-300 hover:border-white/25 hover:text-white"
                      }`}
                    >
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{
                          backgroundColor: stage.accentColor,
                          boxShadow: selected ? `0 0 10px ${stage.accentColor}` : "none",
                        }}
                      />
                      <span className="font-mono text-[11px] text-slate-400">
                        {stage.stepNumber}
                      </span>
                      <span>{stage.shortTitle}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </FadeInSection>

        {/* ACTIVE STAGE STORYTELLING & ANIMATED ROADMAP */}
        <section>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStage.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8"
            >
              {/* Stage Hero Summary Card */}
              <div className="glass-panel relative overflow-hidden rounded-3xl p-6 sm:p-10">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full blur-3xl"
                  style={{ backgroundColor: currentStage.glowColor }}
                />

                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="max-w-3xl">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-3.5 py-1 font-mono text-xs text-slate-200">
                      {getIcon(currentStage.id)}
                      <span>
                        STAGE {currentStage.stepNumber} • {currentStage.period}
                      </span>
                    </div>

                    <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-white sm:text-4xl">
                      {currentStage.title}
                    </h2>
                    <p className="mt-2 text-base font-medium text-sky-200 sm:text-lg">
                      {currentStage.tagline}
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">
                      {currentStage.summary}
                    </p>
                  </div>

                  <div className="glass-panel shrink-0 rounded-2xl p-5 lg:max-w-xs">
                    <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-indigo-300">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Personal Reflection</span>
                    </p>
                    <p className="mt-2.5 text-sm italic leading-relaxed text-slate-200">
                      “{currentStage.reflection}”
                    </p>
                  </div>
                </div>

                {/* Prev / Next stage switcher */}
                <div className="relative mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
                  <button
                    type="button"
                    disabled={currentIndex === 0}
                    onClick={() =>
                      handleSelectStage(JOURNEY_STAGES[currentIndex - 1].id)
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-slate-200 transition hover:border-white/25 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Previous Stage</span>
                  </button>

                  <span className="font-mono text-xs text-slate-400">
                    Chapter {currentIndex + 1} of {JOURNEY_STAGES.length}
                  </span>

                  <button
                    type="button"
                    disabled={currentIndex === JOURNEY_STAGES.length - 1}
                    onClick={() =>
                      handleSelectStage(JOURNEY_STAGES[currentIndex + 1].id)
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-slate-200 transition hover:border-white/25 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <span>Next Stage</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Animated Vertical Journey Road Milestones */}
              <div className="relative pl-6 sm:pl-10">
                <div
                  aria-hidden="true"
                  className="absolute bottom-2 left-2.5 top-2 w-0.5 rounded-full bg-gradient-to-b from-sky-400 via-violet-500 to-amber-400 sm:left-4"
                />

                <div className="space-y-5">
                  {currentStage.milestones.map((milestone, idx) => (
                    <motion.div
                      key={milestone.id}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.06 }}
                      className="relative"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute -left-[22px] top-6 flex h-4 w-4 items-center justify-center rounded-full border-2 border-slate-950 shadow-[0_0_16px_rgba(56,189,248,0.65)] sm:-left-[31px]"
                        style={{ backgroundColor: currentStage.accentColor }}
                      />

                      <article className="glass-panel glass-panel-hover rounded-2xl p-5 sm:p-6">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <CheckCircle2
                              className="h-4 w-4"
                              style={{ color: currentStage.accentColor }}
                            />
                            <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-white sm:text-xl">
                              {milestone.title}
                            </h3>
                          </div>
                          <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 font-mono text-[11px] text-indigo-200">
                            {milestone.tag}
                          </span>
                        </div>
                        <p className="mt-2.5 text-sm leading-relaxed text-slate-300">
                          {milestone.description}
                        </p>
                      </article>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </section>

        {/* ALL-IN-ONE YEAR 1 & YEAR 2 GALLERY */}
        <FadeInSection>
          <section className="border-t border-white/10 pt-12">
            <MemoryGallery
              title="Year 1 & Year 2 Photo Highlights"
              subtitle="Filter through my first-year, second-year, and classmate memories. Click any card to view details or preview your uploaded photos."
              categories={["first-year", "second-year", "classmates"]}
              defaultLayout="grid"
            />
          </section>
        </FadeInSection>

        {/* NEXT STEP LINKS */}
        <FadeInSection>
          <div className="glass-panel flex flex-col items-start justify-between gap-4 rounded-3xl p-6 sm:flex-row sm:items-center sm:p-8">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-white sm:text-2xl">
                Ready to See What We Built & Experienced?
              </h2>
              <p className="mt-1 text-sm text-slate-300">
                Explore my technical progress in IT Skills & Projects or discover life beyond classes.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/skills-projects"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-95"
              >
                <span>IT Skills & Projects</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/sports"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-5 py-2.5 text-sm font-semibold text-white transition hover:border-sky-400/40"
              >
                <span>Campus Sports & Life</span>
              </Link>
            </div>
          </div>
        </FadeInSection>
      </div>
    </div>
  );
}
