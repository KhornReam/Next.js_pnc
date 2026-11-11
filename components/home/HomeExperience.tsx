"use client";

import LightboxModal from "@/components/gallery/LightboxModal";
import MemoryPhoto from "@/components/gallery/MemoryPhoto";
import TimelinePreview from "@/components/journey/TimelinePreview";
import {
  FadeInSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/MotionPrimitives";
import { MEMORY_ITEMS, SITE_CONFIG } from "@/data/journeyData";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Code2,
  Compass,
  HeartPulse,
  Images,
  MapPin,
  PartyPopper,
  Pause,
  Play,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";

const ThreeHeroScene = dynamic(
  () => import("@/components/three/ThreeHeroScene"),
  {
    ssr: false,
    loading: () => (
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_45%,rgba(99,102,241,0.2),transparent_58%)]" />
    ),
  }
);

const CHAPTER_CARDS = [
  {
    href: "/sports",
    title: "Sports",
    subtitle: "Football matches, competitions & team spirit",
    icon: Trophy,
    accent: "text-sky-300 border-sky-400/30 bg-sky-500/10",
  },
  {
    href: "/activities",
    title: "Activities",
    subtitle: "School events, volunteering & educational trips",
    icon: Users,
    accent: "text-indigo-300 border-indigo-400/30 bg-indigo-500/10",
  },
  {
    href: "/parties",
    title: "Parties & Celebrations",
    subtitle: "Birthdays, class parties & graduation nights",
    icon: PartyPopper,
    accent: "text-fuchsia-300 border-fuchsia-400/30 bg-fuchsia-500/10",
  },
  {
    href: "/healthy-life",
    title: "Healthy Life",
    subtitle: "Health awareness, well-being & balanced habits",
    icon: HeartPulse,
    accent: "text-emerald-300 border-emerald-400/30 bg-emerald-500/10",
  },
  {
    href: "/workshops",
    title: "Workshops & Training",
    subtitle: "Coding training, soft skills & company visits",
    icon: Briefcase,
    accent: "text-violet-300 border-violet-400/30 bg-violet-500/10",
  },
  {
    href: "/skills-projects",
    title: "IT Skills & Projects",
    subtitle: "Full-stack progress, languages & team software",
    icon: Code2,
    accent: "text-amber-300 border-amber-400/30 bg-amber-500/10",
  },
];

const HERO_CHAPTERS: {
  code: string;
  label: string;
  headline: string;
  detail: string;
  dotColor: string;
  borderActive: string;
  pillarLabel: string;
  pillarValue: string;
  pillarDetail: string;
}[] = [
  {
    code: "01",
    label: "Year 1 • Foundation",
    headline: "Programming fundamentals, English & PNC life skills",
    detail: "First steps into IT alongside ~25 classmates across Cambodia",
    dotColor: "#38BDF8",
    borderActive: "border-sky-400/45 shadow-[0_0_26px_rgba(56,189,248,0.2)]",
    pillarLabel: "Years of Growth",
    pillarValue: "02 Years",
    pillarDetail: "PNC IT • Gen 2026",
  },
  {
    code: "02",
    label: "Year 2 • Full-Stack",
    headline: "Full-stack web apps, teamwork, mentoring & company visits",
    detail: "Turning curiosity into production-minded engineering projects",
    dotColor: "#A855F7",
    borderActive:
      "border-violet-400/45 shadow-[0_0_26px_rgba(168,85,247,0.22)]",
    pillarLabel: "Origin & Focus",
    pillarValue: "Kampong Thom",
    pillarDetail: "Full-Stack Web Dev",
  },
  {
    code: "03",
    label: "2026+ • Destination",
    headline: "Growing into a dependable Software Engineer",
    detail: "Building clean software that uplifts teams & communities",
    dotColor: "#FBBF24",
    borderActive:
      "border-amber-400/45 shadow-[0_0_26px_rgba(251,191,36,0.2)]",
    pillarLabel: "Career Goal",
    pillarValue: "Software Engineer",
    pillarDetail: "Phnom Penh • 2026+",
  },
];

const HERO_CYCLE_MS = 4800;

export default function HomeExperience() {
  const featuredMemories = MEMORY_ITEMS.filter((item) => item.featured).slice(
    0,
    6
  );
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [heroChapter, setHeroChapter] = useState<0 | 1 | 2>(0);
  const [heroAutoPlay, setHeroAutoPlay] = useState(true);
  const [heroHoverPaused, setHeroHoverPaused] = useState(false);

  const isAutomationRunning = heroAutoPlay && !heroHoverPaused;
  const activeHeroMeta = HERO_CHAPTERS[heroChapter];

  useEffect(() => {
    if (!isAutomationRunning) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      setHeroChapter((prev) => ((prev + 1) % 3) as 0 | 1 | 2);
    }, HERO_CYCLE_MS);

    return () => window.clearInterval(timer);
  }, [isAutomationRunning]);

  return (
    <div className="relative overflow-hidden">
      {/* SECTION 1: 3D ANIMATED & AUTOMATED HERO */}
      <section className="relative flex min-h-screen items-center pt-24 pb-16 sm:pt-28 sm:pb-20">
        <ThreeHeroScene activeChapter={heroChapter} />

        {/* Subtle readability scrim balancing the left story zone with the 3D scene */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(3,6,20,0.48)_0%,rgba(3,6,20,0.22)_55%,rgba(3,6,20,0.68)_100%)] lg:bg-[radial-gradient(circle_at_24%_48%,rgba(3,6,20,0.62)_0%,rgba(3,6,20,0.24)_46%,transparent_72%)]"
        />

        <div className="pointer-events-none relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-[1.06fr_0.94fr]">
            {/* LEFT COLUMN: Clean Non-Overlapping Editorial Story */}
            <div className="pointer-events-auto lg:max-w-[590px]">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="inline-flex items-center gap-2.5 rounded-full border border-indigo-400/30 bg-indigo-500/15 px-4 py-1.5 backdrop-blur-md"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-300" />
                </span>
                <Sparkles className="h-3.5 w-3.5 text-sky-300" />
                <span className="font-mono text-[11px] uppercase tracking-widest text-indigo-100 sm:text-xs">
                  Passerelles Numériques Cambodia • Interactive Story
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.08 }}
                className="mt-5 font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-[3.5rem] xl:text-[4.15rem]"
              >
                <span className="text-gradient-hero">{SITE_CONFIG.heroTitle}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.16 }}
                className="mt-3.5 font-[family-name:var(--font-display)] text-lg font-medium leading-snug text-sky-200 sm:text-2xl lg:text-[1.35rem] xl:text-2xl"
              >
                {SITE_CONFIG.heroSubtitle}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.24 }}
                className="mt-4 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base"
              >
                {SITE_CONFIG.heroIntro}
              </motion.p>

              {/* Primary CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.32 }}
                className="mt-7 grid grid-cols-1 gap-3 sm:flex sm:flex-wrap sm:items-center sm:gap-4"
              >
                <Link
                  href="/journey"
                  className="group relative inline-flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_10px_35px_rgba(99,102,241,0.45)] transition duration-300 active:scale-[0.98] hover:-translate-y-0.5 hover:shadow-[0_14px_45px_rgba(139,92,246,0.58)] sm:w-auto"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                  />
                  <Compass className="relative h-4 w-4" />
                  <span className="relative">Explore My Journey</span>
                  <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/about"
                  className="inline-flex w-full items-center justify-center gap-2.5 rounded-2xl border border-white/15 bg-white/[0.06] px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition duration-300 active:scale-[0.98] hover:-translate-y-0.5 hover:border-sky-400/50 hover:bg-white/[0.11] sm:w-auto"
                >
                  <BookOpen className="h-4 w-4 text-sky-300" />
                  <span>Discover My Story</span>
                </Link>
              </motion.div>

              {/* Synchronized Interactive Hero Pillars */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                onMouseEnter={() => setHeroHoverPaused(true)}
                onMouseLeave={() => setHeroHoverPaused(false)}
                className="mt-9 grid gap-3 sm:grid-cols-3"
              >
                {HERO_CHAPTERS.map((pillar, idx) => {
                  const isActive = heroChapter === idx;
                  const chapterIdx = idx as 0 | 1 | 2;
                  return (
                    <button
                      key={pillar.code}
                      type="button"
                      onClick={() => setHeroChapter(chapterIdx)}
                      className={`glass-panel group relative h-full overflow-hidden rounded-2xl px-3.5 py-3.5 text-left transition duration-300 hover:-translate-y-0.5 xl:px-4 ${
                        isActive
                          ? `${pillar.borderActive} bg-slate-900/75`
                          : "border-white/10 opacity-85 hover:border-white/25 hover:opacity-100"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
                          {pillar.pillarLabel}
                        </p>
                        <span
                          className={`h-1.5 w-1.5 shrink-0 rounded-full transition-transform duration-300 ${
                            isActive ? "scale-125" : "opacity-50"
                          }`}
                          style={{
                            backgroundColor: pillar.dotColor,
                            boxShadow: isActive
                              ? `0 0 10px ${pillar.dotColor}`
                              : "none",
                          }}
                        />
                      </div>
                      <p className="mt-1 whitespace-nowrap font-[family-name:var(--font-display)] text-[15px] font-bold tracking-tight text-white xl:text-base">
                        {pillar.pillarValue}
                      </p>
                      <p className="mt-0.5 truncate text-[11px] leading-snug text-slate-300">
                        {pillar.pillarDetail}
                      </p>

                      {isActive && (
                        <motion.span
                          layoutId="heroPillarActiveLine"
                          className="absolute inset-x-0 bottom-0 h-0.5"
                          style={{ backgroundColor: pillar.dotColor }}
                          transition={{
                            type: "spring",
                            stiffness: 340,
                            damping: 30,
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </motion.div>
            </div>

            {/* RIGHT COLUMN: Dedicated 3D Sculpture Space + Compact Stage HUD */}
            <div className="pointer-events-none flex flex-col justify-end lg:min-h-[500px]">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                onMouseEnter={() => setHeroHoverPaused(true)}
                onMouseLeave={() => setHeroHoverPaused(false)}
                className="pointer-events-auto relative mt-2 w-full overflow-hidden rounded-2xl border border-white/12 bg-slate-950/75 p-4 backdrop-blur-xl shadow-[0_18px_45px_rgba(2,6,23,0.7)] lg:ml-auto lg:mt-auto lg:max-w-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full transition-colors duration-300"
                      style={{
                        backgroundColor: activeHeroMeta.dotColor,
                        boxShadow: `0 0 10px ${activeHeroMeta.dotColor}`,
                      }}
                    />
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-300">
                      {activeHeroMeta.code} • {activeHeroMeta.label}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setHeroAutoPlay((prev) => !prev)}
                    aria-label={
                      heroAutoPlay
                        ? "Pause automated 3D story cycle"
                        : "Play automated 3D story cycle"
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/12 bg-white/[0.05] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-slate-200 transition hover:border-sky-400/45 hover:text-white"
                  >
                    {heroAutoPlay ? (
                      <>
                        <Pause className="h-3 w-3 text-sky-300" />
                        <span>Auto</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-3 w-3 text-sky-300" />
                        <span>Paused</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-2.5 min-h-[42px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeHeroMeta.code}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.28 }}
                    >
                      <p className="text-xs font-semibold text-white sm:text-[13px]">
                        {activeHeroMeta.headline}
                      </p>
                      <p className="mt-0.5 text-[11px] text-slate-400">
                        {activeHeroMeta.detail}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    {HERO_CHAPTERS.map((chap, idx) => {
                      const active = heroChapter === idx;
                      return (
                        <button
                          key={chap.code}
                          type="button"
                          onClick={() => setHeroChapter(idx as 0 | 1 | 2)}
                          aria-label={`Select ${chap.label}`}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            active
                              ? "w-6 bg-sky-400"
                              : "w-2 bg-white/20 hover:bg-white/40"
                          }`}
                        />
                      );
                    })}
                  </div>
                  <span className="hidden font-mono text-[10px] uppercase tracking-wider text-slate-400 sm:inline">
                    Drag 3D core to orbit
                  </span>
                </div>

                {/* Animated Cycle Progress Line */}
                <div className="mt-3 h-[2px] w-full overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    key={`hero-bar-${heroChapter}-${isAutomationRunning}`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isAutomationRunning ? 1 : 0 }}
                    transition={{
                      duration: isAutomationRunning ? HERO_CYCLE_MS / 1000 : 0.2,
                      ease: "linear",
                    }}
                    className="h-full origin-left rounded-full"
                    style={{ backgroundColor: activeHeroMeta.dotColor }}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: STORY INTRODUCTION & CAMBODIA COHORT CONTEXT */}
      <section className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <FadeInSection>
          <div className="glass-panel relative overflow-hidden rounded-3xl p-6 sm:p-10 lg:p-12">
            {/* Subtle top highlight & internal atmospheric wash */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/40 to-transparent"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_60%_at_85%_20%,rgba(56,189,248,0.11),transparent_70%)]"
            />

            <div className="relative grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-12">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/25 bg-sky-500/10 px-3.5 py-1.5 font-mono text-[11px] text-sky-200 sm:text-xs">
                  <MapPin className="h-3.5 w-3.5 text-sky-300" />
                  <span>Kampong Thom & Provinces Across Cambodia → Phnom Penh</span>
                </div>

                <h2 className="mt-5 font-[family-name:var(--font-display)] text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
                  More Than Code:{" "}
                  <span className="text-gradient-accent">
                    A Community of ~25 Dreamers
                  </span>
                </h2>

                <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">
                  Every student at Passerelles Numériques Cambodia brings hopes from a different Cambodian province. Together, we arrived eager to learn technology — and along the way, we became teammates on the football pitch, study partners before exams, friends celebrating birthdays, and future software engineers ready to uplift our families and communities.
                </p>

                {/* Structured mini context highlights */}
                <div className="mt-6 grid grid-cols-3 gap-2.5 sm:gap-3">
                  <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-sky-300">
                      Cohort
                    </p>
                    <p className="mt-0.5 text-xs font-semibold text-white sm:text-sm">
                      Gen 2026
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-indigo-300">
                      Community
                    </p>
                    <p className="mt-0.5 text-xs font-semibold text-white sm:text-sm">
                      All Provinces
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-violet-300">
                      Focus
                    </p>
                    <p className="mt-0.5 text-xs font-semibold text-white sm:text-sm">
                      Full-Stack IT
                    </p>
                  </div>
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    href="/about"
                    className="group inline-flex items-center gap-2 rounded-xl border border-indigo-400/40 bg-indigo-500/20 px-5 py-2.5 text-xs font-semibold text-white shadow-[0_8px_24px_rgba(99,102,241,0.2)] transition active:scale-[0.98] hover:border-indigo-400/65 hover:bg-indigo-500/30 sm:text-sm"
                  >
                    <span>Read My Personal Story</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/skills-projects"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/[0.04] px-5 py-2.5 text-xs font-semibold text-sky-300 transition active:scale-[0.98] hover:border-sky-400/45 hover:bg-sky-500/12 hover:text-white sm:text-sm"
                  >
                    <span>See IT Skills & Projects</span>
                  </Link>
                </div>
              </div>

              {/* Curated Gallery Spotlight Frame */}
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden rounded-2xl border border-white/15 bg-[#050817]/90 p-2 shadow-[0_22px_55px_rgba(2,6,23,0.8)] ring-1 ring-inset ring-white/[0.05]"
              >
                <div className="overflow-hidden rounded-xl">
                  <MemoryPhoto
                    slotId="home-cohort-spotlight"
                    src="/images/activities/2.png"
                    alt="PNC Cohort Standing Together With Cambodian Flag"
                    placeholderTitle="PNC Cohort & Friends"
                    aspect="landscape"
                    naturalAspect="landscape"
                    objectPosition="top"
                    priority
                  />
                </div>
                <div className="mt-2 flex items-center justify-between gap-2 px-2 py-1.5">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]" />
                    <span className="font-mono text-[10px] uppercase tracking-wider text-slate-300 sm:text-[11px]">
                      PNC Cambodia • Phnom Penh Campus
                    </span>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-indigo-200">
                    Unity
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* SECTION 3: AUTOMATED INTERACTIVE TIMELINE PREVIEW */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <FadeInSection>
          <TimelinePreview />
        </FadeInSection>
      </section>

      {/* SECTION 4: SELECTED MEMORIES & ACHIEVEMENTS */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <FadeInSection>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-violet-300">
                Curated Highlights
              </span>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold text-white sm:text-4xl">
                Selected Memories & Milestones
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-300">
                Click any card to open the fullscreen photo viewer and relive memorable moments across my two years at PNC.
              </p>
            </div>
            <Link
              href="/memories"
              className="inline-flex items-center gap-2 self-start rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold text-white transition hover:border-indigo-400/50 hover:bg-indigo-500/20"
            >
              <Images className="h-4 w-4 text-sky-300" />
              <span>Open Full Gallery</span>
            </Link>
          </div>
        </FadeInSection>

        <StaggerContainer className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredMemories.map((memory, idx) => (
            <StaggerItem key={memory.id}>
              <motion.article
                whileHover={{ y: -4 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => setLightboxIndex(idx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setLightboxIndex(idx);
                  }
                }}
                className="glass-panel glass-panel-hover group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-400/60"
              >
                <div className="relative">
                  <MemoryPhoto
                    slotId={memory.id}
                    src={memory.imageSrc}
                    alt={memory.title}
                    placeholderTitle={memory.title}
                    aspect="landscape"
                    naturalAspect={memory.aspect}
                    objectPosition={memory.objectPosition ?? "top"}
                  />
                  <span className="pointer-events-none absolute left-3 top-3 rounded-full border border-white/15 bg-slate-950/75 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-slate-200 backdrop-blur-md">
                    {memory.categoryLabel}
                  </span>
                </div>

                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-white transition group-hover:text-sky-200">
                      {memory.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-300">
                      {memory.caption}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-white/[0.08] pt-3 font-mono text-[11px] text-slate-400">
                    <span>{memory.date}</span>
                    <span>{memory.location}</span>
                  </div>
                </div>
              </motion.article>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <LightboxModal
          items={featuredMemories}
          activeIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={(idx) => setLightboxIndex(idx)}
        />
      </section>

      {/* SECTION 5: EXPLORE EVERY CHAPTER OF CAMPUS LIFE */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <FadeInSection>
          <div className="text-center">
            <span className="font-mono text-xs uppercase tracking-widest text-sky-300">
              Life Beyond the Classroom
            </span>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold text-white sm:text-4xl">
              Explore Every Chapter
            </h2>
          </div>
        </FadeInSection>

        <StaggerContainer className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CHAPTER_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <StaggerItem key={card.href}>
                <Link
                  href={card.href}
                  className="glass-panel glass-panel-hover group flex h-full items-start gap-4 rounded-2xl p-5"
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${card.accent} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-white">
                        {card.title}
                      </h3>
                      <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-white" />
                    </div>
                    <p className="mt-1 text-sm text-slate-300">
                      {card.subtitle}
                    </p>
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </section>

      {/* SECTION 6: CENTRAL MESSAGE SPOTLIGHT */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <FadeInSection>
          <div className="glass-panel relative overflow-hidden rounded-3xl px-6 py-12 text-center sm:px-12 sm:py-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.22),transparent_65%)]"
            />
            <p className="relative font-mono text-xs uppercase tracking-[0.22em] text-sky-300">
              Central Message
            </p>
            <blockquote className="relative mt-4 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-white sm:text-4xl">
              <span className="text-gradient-hero">
                “{SITE_CONFIG.centralMessage}”
              </span>
            </blockquote>
            <p className="relative mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
              {SITE_CONFIG.closingNote}
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/journey"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-100"
              >
                <span>Start the 3D Timeline</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-5 py-3 text-sm font-semibold text-white transition hover:border-violet-400/50 hover:bg-violet-500/15"
              >
                <span>Connect With Me</span>
              </Link>
            </div>
          </div>
        </FadeInSection>
      </section>
    </div>
  );
}
