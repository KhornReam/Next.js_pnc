"use client";

import MemoryPhoto from "@/components/gallery/MemoryPhoto";
import {
  FadeInSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/MotionPrimitives";
import PageHeader from "@/components/ui/PageHeader";
import { ABOUT_DATA, SITE_CONFIG } from "@/data/journeyData";
import {
  ArrowRight,
  Compass,
  Cpu,
  GraduationCap,
  HeartHandshake,
  MapPin,
  Rocket,
  Sparkles,
  User,
} from "lucide-react";
import Link from "next/link";

export default function AboutContent() {
  return (
    <div>
      <PageHeader
        eyebrow="Chapter 01 • About Me"
        title="Who I Am & Where It All Started"
        description={ABOUT_DATA.introHeadline}
        icon={<User className="h-3.5 w-3.5 text-sky-400" />}
        accentGradient="from-indigo-500/20 via-sky-500/10 to-transparent"
      />

      <div className="mx-auto max-w-6xl space-y-14 px-4 py-14 sm:px-6 lg:px-8">
        {/* Profile Overview & Portrait */}
        <FadeInSection>
          <div className="glass-panel grid gap-8 rounded-3xl p-6 sm:p-10 lg:grid-cols-[0.95fr_1.35fr] lg:items-center">
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <MemoryPhoto
                slotId="about-portrait"
                src={ABOUT_DATA.portraitImage}
                alt="Student Portrait"
                placeholderTitle="Your Portrait Photo"
                aspect="portrait"
              />
            </div>

            <div className="space-y-6">
              <div className="flex flex-wrap gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 font-mono text-xs text-sky-200">
                  <User className="h-3.5 w-3.5" />
                  <span>{SITE_CONFIG.studentName}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 font-mono text-xs text-violet-200">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{SITE_CONFIG.hometown}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 font-mono text-xs text-indigo-200">
                  <GraduationCap className="h-3.5 w-3.5" />
                  <span>{SITE_CONFIG.cohortLabel}</span>
                </span>
              </div>

              <div>
                <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-white sm:text-3xl">
                  Hello, I’m a PNC IT Student & Aspiring Software Engineer
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
                  {ABOUT_DATA.whoIAm}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <h3 className="font-[family-name:var(--font-display)] text-base font-semibold text-sky-200">
                  Background & Hometown in Cambodia
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  {ABOUT_DATA.backgroundAndHometown}
                </p>
              </div>
            </div>
          </div>
        </FadeInSection>

        {/* Personality, Interests & Core Values */}
        <section className="space-y-6">
          <FadeInSection>
            <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
              <div className="glass-panel rounded-3xl p-6 sm:p-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/25 bg-indigo-500/10 px-3 py-1 font-mono text-xs text-indigo-200">
                  <Sparkles className="h-3.5 w-3.5 text-sky-300" />
                  <span>Personality & Interests</span>
                </div>
                <h2 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-bold text-white">
                  What Drives Me Every Day
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
                  {ABOUT_DATA.personalityAndInterests}
                </p>
              </div>

              <div className="overflow-hidden rounded-3xl border border-white/10">
                <MemoryPhoto
                  slotId="about-hometown-campus"
                  src={ABOUT_DATA.hometownImage}
                  alt="Hometown and Campus Memories"
                  placeholderTitle="Hometown / Campus Memory"
                  aspect="landscape"
                />
              </div>
            </div>
          </FadeInSection>

          <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ABOUT_DATA.values.map((val) => (
              <StaggerItem key={val.title}>
                <div className="glass-panel glass-panel-hover h-full rounded-2xl p-5">
                  <p className="font-mono text-xs uppercase tracking-widest text-sky-300">
                    Core Value
                  </p>
                  <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl font-bold text-white">
                    {val.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">
                    {val.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* Why IT, Why PNC & Career Ambition */}
        <StaggerContainer className="grid gap-5 lg:grid-cols-3">
          <StaggerItem>
            <article className="glass-panel glass-panel-hover flex h-full flex-col rounded-3xl p-6 sm:p-7">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-sky-400/30 bg-sky-500/10 text-sky-300">
                <Cpu className="h-5 w-5" />
              </div>
              <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-white">
                Why I Chose IT
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                {ABOUT_DATA.whyIT}
              </p>
            </article>
          </StaggerItem>

          <StaggerItem>
            <article className="glass-panel glass-panel-hover flex h-full flex-col rounded-3xl p-6 sm:p-7">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-violet-400/30 bg-violet-500/10 text-violet-300">
                <HeartHandshake className="h-5 w-5" />
              </div>
              <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-white">
                Why I Joined PNC
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                {ABOUT_DATA.whyPNC}
              </p>
            </article>
          </StaggerItem>

          <StaggerItem>
            <article className="glass-panel glass-panel-hover flex h-full flex-col rounded-3xl p-6 sm:p-7">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-500/10 text-amber-300">
                <Rocket className="h-5 w-5" />
              </div>
              <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-white">
                My Career Ambition
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                {ABOUT_DATA.careerAmbition}
              </p>
            </article>
          </StaggerItem>
        </StaggerContainer>

        {/* Next Chapter CTA */}
        <FadeInSection>
          <div className="glass-panel flex flex-col items-start justify-between gap-5 rounded-3xl p-6 sm:flex-row sm:items-center sm:p-8">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-indigo-300">
                Continue Exploring
              </p>
              <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl font-bold text-white">
                Walk Through My Two-Year Timeline
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/journey"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95"
              >
                <Compass className="h-4 w-4" />
                <span>Explore 3D Timeline</span>
              </Link>
              <Link
                href="/skills-projects"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-5 py-3 text-sm font-semibold text-white transition hover:border-sky-400/40"
              >
                <span>View Skills & Projects</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </FadeInSection>
      </div>
    </div>
  );
}
