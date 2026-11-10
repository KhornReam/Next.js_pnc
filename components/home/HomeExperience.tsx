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
import { motion } from "framer-motion";
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
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";

const ThreeHeroScene = dynamic(() => import("@/components/three/ThreeHeroScene"), {
  ssr: false,
  loading: () => (
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(99,102,241,0.18),transparent_60%)]" />
  ),
});

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

const JOURNEY_PILLARS = [
  { label: "Years of Growth", value: "02 Years", detail: "Year 1 Foundation → Year 2 Engineering" },
  { label: "Cohort Community", value: "~25 Students", detail: "Diverse provinces across Cambodia" },
  { label: "Destination", value: "Software Engineer", detail: "Building impactful technology" },
];

export default function HomeExperience() {
  const featuredMemories = MEMORY_ITEMS.filter((item) => item.featured);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <div className="relative overflow-hidden">
      {/* SECTION 1: 3D ANIMATED HERO */}
      <section className="relative flex min-h-screen items-center pt-24 pb-16 sm:pt-28 sm:pb-24">
        <ThreeHeroScene />

        {/* Ambient radial accents */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 top-28 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-10 right-1/4 h-72 w-72 rounded-full bg-violet-600/15 blur-3xl"
        />

        <div className="pointer-events-none relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="pointer-events-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/15 px-4 py-1.5 backdrop-blur-md"
            >
              <Sparkles className="h-3.5 w-3.5 text-sky-300" />
              <span className="font-mono text-xs uppercase tracking-widest text-indigo-100">
                Passerelles Numériques Cambodia • Interactive Story
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="mt-6 font-[family-name:var(--font-display)] text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl"
            >
              <span className="text-gradient-hero">{SITE_CONFIG.heroTitle}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.16 }}
              className="mt-4 font-[family-name:var(--font-display)] text-xl font-medium text-sky-200 sm:text-2xl"
            >
              {SITE_CONFIG.heroSubtitle}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.24 }}
              className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg"
            >
              {SITE_CONFIG.heroIntro}
            </motion.p>

            {/* Primary CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.32 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <Link
                href="/journey"
                className="group inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_10px_35px_rgba(99,102,241,0.45)] transition hover:scale-[1.02] hover:shadow-[0_14px_45px_rgba(139,92,246,0.55)]"
              >
                <Compass className="h-4 w-4" />
                <span>Explore My Journey</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center gap-2.5 rounded-2xl border border-white/15 bg-white/[0.05] px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition hover:border-sky-400/50 hover:bg-white/[0.1]"
              >
                <BookOpen className="h-4 w-4 text-sky-300" />
                <span>Discover My Story</span>
              </Link>
            </motion.div>

            {/* Quick pillars */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 grid gap-3.5 sm:grid-cols-3"
            >
              {JOURNEY_PILLARS.map((pillar) => (
                <div
                  key={pillar.label}
                  className="glass-panel rounded-2xl px-4 py-3.5"
                >
                  <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
                    {pillar.label}
                  </p>
                  <p className="mt-1 font-[family-name:var(--font-display)] text-lg font-bold text-white">
                    {pillar.value}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-300">{pillar.detail}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Subtle interactive 3D hint on desktop */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-6 right-8 z-10 hidden items-center gap-2 rounded-full border border-white/10 bg-slate-950/60 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-widest text-slate-300 backdrop-blur-md lg:inline-flex"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]" />
          <span>Drag right 3D sculpture to rotate</span>
        </div>
      </section>

      {/* SECTION 2: STORY INTRODUCTION & CAMBODIA COHORT CONTEXT */}
      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <FadeInSection>
          <div className="glass-panel grid gap-8 overflow-hidden rounded-3xl p-6 sm:p-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/25 bg-sky-500/10 px-3 py-1 font-mono text-xs text-sky-200">
                <MapPin className="h-3.5 w-3.5" />
                <span>Provinces Across Cambodia → Phnom Penh</span>
              </div>
              <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-bold text-white sm:text-4xl">
                More Than Code: A Community of ~25 Dreamers
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">
                Every student at Passerelles Numériques Cambodia brings hopes from a different Cambodian province. Together, we arrived eager to learn technology — and along the way, we became teammates on the football pitch, study partners before exams, friends celebrating birthdays, and future software engineers ready to uplift our families and communities.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2.5 text-xs font-semibold text-white transition hover:border-violet-400/50 hover:bg-violet-500/15 sm:text-sm"
                >
                  <span>Read My Personal Story</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/skills-projects"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-transparent px-4 py-2.5 text-xs font-semibold text-sky-300 transition hover:border-sky-400/40 hover:bg-sky-500/10 sm:text-sm"
                >
                  <span>See IT Skills & Projects</span>
                </Link>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10">
              <MemoryPhoto
                slotId="home-cohort-spotlight"
                src="/images/classmates/cohort-group.jpg"
                alt="PNC Cohort Classmates Group Photo"
                placeholderTitle="PNC Cohort & Friends"
                aspect="landscape"
              />
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* SECTION 3: INTERACTIVE TIMELINE PREVIEW */}
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
                Click any card to open the fullscreen memory viewer — or replace the placeholder paths with your own photographs anytime.
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
              <article
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
              </article>
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
                    <p className="mt-1 text-sm text-slate-300">{card.subtitle}</p>
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
