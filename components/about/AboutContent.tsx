"use client";

import MemoryPhoto from "@/components/gallery/MemoryPhoto";
import {
  FacebookIcon,
  GitHubIcon,
  LinkedInIcon,
} from "@/components/ui/BrandIcons";
import {
  FadeInSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/MotionPrimitives";
import PageHeader from "@/components/ui/PageHeader";
import { ABOUT_DATA, CONTACT_DATA, SITE_CONFIG } from "@/data/journeyData";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  Calendar,
  CheckCircle2,
  Compass,
  Cpu,
  Globe2,
  GraduationCap,
  HeartHandshake,
  Laptop,
  Mail,
  MapPin,
  Rocket,
  Sparkles,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";

const VALUE_ITEMS = [
  {
    rimClass: "via-sky-400/50",
    labelClass: "text-sky-300",
    badgeClass: "border-sky-400/30 bg-sky-500/12 text-sky-300",
    icon: TrendingUp,
  },
  {
    rimClass: "via-indigo-400/50",
    labelClass: "text-indigo-300",
    badgeClass: "border-indigo-400/30 bg-indigo-500/12 text-indigo-300",
    icon: Users,
  },
  {
    rimClass: "via-violet-400/50",
    labelClass: "text-violet-300",
    badgeClass: "border-violet-400/30 bg-violet-500/12 text-violet-300",
    icon: HeartHandshake,
  },
  {
    rimClass: "via-amber-400/50",
    labelClass: "text-amber-300",
    badgeClass: "border-amber-400/30 bg-amber-500/12 text-amber-300",
    icon: Award,
  },
];

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

      <div className="mx-auto max-w-6xl space-y-14 px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        {/* PROFILE SIDEBAR & EDITORIAL BIO */}
        <FadeInSection>
          <div className="glass-panel relative overflow-hidden rounded-3xl p-5 sm:p-8 lg:p-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/40 to-transparent"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_60%_at_18%_15%,rgba(56,189,248,0.1),transparent_65%)]"
            />

            <div className="relative grid gap-8 lg:grid-cols-[0.82fr_1.38fr] lg:items-start lg:gap-10">
              {/* Left Studio Portrait Card & Quick Connect Plate */}
              <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#050817]/95 p-3 shadow-[0_22px_55px_rgba(2,6,23,0.82)] ring-1 ring-inset ring-white/[0.05]">
                <div className="overflow-hidden rounded-xl border border-white/10">
                  <MemoryPhoto
                    slotId="about-portrait"
                    src={ABOUT_DATA.portraitImage}
                    alt="Khorn Ream Portrait"
                    placeholderTitle="Khorn Ream"
                    aspect="square"
                    naturalAspect="square"
                    objectPosition="top"
                    priority
                  />
                </div>

                <div className="mt-3.5 px-1.5 pb-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-500/12 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-sky-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]" />
                      <span>{SITE_CONFIG.cohortLabel}</span>
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">
                      Age 20
                    </span>
                  </div>

                  <p className="mt-2.5 font-[family-name:var(--font-display)] text-lg font-bold text-white">
                    {SITE_CONFIG.studentName}
                  </p>
                  <p className="text-xs text-slate-400">
                    {SITE_CONFIG.mainInterest} • {SITE_CONFIG.careerGoal}
                  </p>

                  {/* Quick Verified Social Row */}
                  <div className="mt-3.5 flex items-center justify-between gap-2 border-t border-white/[0.08] pt-3">
                    <div className="flex items-center gap-1.5">
                      <a
                        href={CONTACT_DATA.github.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="GitHub profile"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/12 bg-white/[0.04] text-white transition hover:border-white/30 hover:bg-white/[0.1]"
                      >
                        <GitHubIcon className="h-3.5 w-3.5" />
                      </a>
                      <a
                        href={CONTACT_DATA.linkedin.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="LinkedIn profile"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#0A66C2]/35 bg-[#0A66C2]/15 transition hover:border-[#0A66C2]/70 hover:bg-[#0A66C2]/25"
                      >
                        <LinkedInIcon className="h-3.5 w-3.5" />
                      </a>
                      <a
                        href={
                          CONTACT_DATA.socials[0]?.url ||
                          "https://www.facebook.com/khorn.ream.9"
                        }
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Facebook profile"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#1877F2]/35 bg-[#1877F2]/15 transition hover:border-[#1877F2]/70 hover:bg-[#1877F2]/25"
                      >
                        <FacebookIcon className="h-3.5 w-3.5" />
                      </a>
                      <a
                        href={`mailto:${CONTACT_DATA.email}`}
                        aria-label="Send Email"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-sky-400/30 bg-sky-500/12 text-sky-300 transition hover:border-sky-400/60 hover:bg-sky-500/20"
                      >
                        <Mail className="h-3.5 w-3.5" />
                      </a>
                    </div>

                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-1 rounded-lg border border-white/12 bg-white/[0.04] px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-slate-200 transition hover:border-sky-400/45 hover:text-white"
                    >
                      <span>Contact</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right Editorial Bio Column */}
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 font-mono text-[11px] text-violet-200">
                    <MapPin className="h-3.5 w-3.5 text-violet-300" />
                    <span>Kampong Thom → Phnom Penh, Cambodia</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 font-mono text-[11px] text-indigo-200">
                    <GraduationCap className="h-3.5 w-3.5 text-indigo-300" />
                    <span>Passerelles Numériques Cambodia</span>
                  </span>
                </div>

                <div>
                  <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-[2rem]">
                    Hello, I’m{" "}
                    <span className="text-gradient-accent">
                      Khorn Ream (Ream)
                    </span>
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
                    {ABOUT_DATA.whoIAm}
                  </p>
                </div>

                {/* Crisp 2x2 Verified Facts Grid */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-3 rounded-xl border border-white/[0.09] bg-white/[0.025] px-4 py-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-sky-400/25 bg-sky-500/12 text-sky-300">
                      <Calendar className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <span className="block font-mono text-[10px] uppercase tracking-wider text-slate-400">
                        Date of Birth
                      </span>
                      <span className="block truncate text-xs font-semibold text-white sm:text-sm">
                        {SITE_CONFIG.dateOfBirth} • Age 20
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl border border-white/[0.09] bg-white/[0.025] px-4 py-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-400/25 bg-emerald-500/12 text-emerald-300">
                      <Globe2 className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <span className="block font-mono text-[10px] uppercase tracking-wider text-slate-400">
                        Nationality & Base
                      </span>
                      <span className="block truncate text-xs font-semibold text-white sm:text-sm">
                        {SITE_CONFIG.nationality} • {SITE_CONFIG.currentLocation}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl border border-white/[0.09] bg-white/[0.025] px-4 py-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-violet-400/25 bg-violet-500/12 text-violet-300">
                      <GraduationCap className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <span className="block font-mono text-[10px] uppercase tracking-wider text-slate-400">
                        Education Program
                      </span>
                      <span className="block truncate text-xs font-semibold text-white sm:text-sm">
                        {SITE_CONFIG.programFocus}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl border border-white/[0.09] bg-white/[0.025] px-4 py-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-amber-400/25 bg-amber-500/12 text-amber-300">
                      <Laptop className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <span className="block font-mono text-[10px] uppercase tracking-wider text-slate-400">
                        Main Focus
                      </span>
                      <span className="block truncate text-xs font-semibold text-white sm:text-sm">
                        {SITE_CONFIG.mainInterest}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Editorial Accent-Bordered Hometown Callout */}
                <div className="rounded-r-2xl border-l-2 border-sky-400/70 bg-gradient-to-r from-sky-500/[0.07] via-indigo-500/[0.04] to-transparent py-3.5 pl-4 pr-4 sm:pl-5">
                  <h3 className="font-[family-name:var(--font-display)] text-sm font-semibold text-sky-200 sm:text-base">
                    Background & Hometown — Kampong Thom Province
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-300">
                    {ABOUT_DATA.backgroundAndHometown}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </FadeInSection>

        {/* PERSONALITY, HOLISTIC PNC PILLARS & CORE VALUES */}
        <section className="space-y-6">
          <FadeInSection>
            <div className="glass-panel relative overflow-hidden rounded-3xl p-6 sm:p-8 lg:p-10">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_60%_at_85%_25%,rgba(139,92,246,0.1),transparent_70%)]"
              />

              <div className="relative grid gap-8 lg:grid-cols-[1.12fr_1fr] lg:items-center lg:gap-10">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/25 bg-indigo-500/10 px-3.5 py-1 font-mono text-xs text-indigo-200">
                    <Sparkles className="h-3.5 w-3.5 text-sky-300" />
                    <span>Personality & PNC Formation</span>
                  </div>
                  <h2 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    What Shapes My{" "}
                    <span className="text-gradient-accent">Growth at PNC</span>
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
                    {ABOUT_DATA.personalityAndInterests}
                  </p>

                  {/* Structured 2-column formation checklist */}
                  <div className="mt-5 grid gap-2 sm:grid-cols-2">
                    {ABOUT_DATA.holisticPillars.map((pillar) => (
                      <div
                        key={pillar}
                        className="flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 py-2 text-xs font-medium text-slate-200 transition hover:border-sky-400/35 hover:bg-white/[0.05]"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-sky-400" />
                        <span className="truncate">{pillar}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Curated Gallery Photo Frame */}
                <motion.div
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden rounded-2xl border border-white/15 bg-[#050817]/90 p-2.5 shadow-[0_22px_55px_rgba(2,6,23,0.8)] ring-1 ring-inset ring-white/[0.05]"
                >
                  <div className="overflow-hidden rounded-xl border border-white/10">
                    <MemoryPhoto
                      slotId="about-hometown-campus"
                      src={ABOUT_DATA.hometownImage}
                      alt="Khorn Ream Mountain Viewpoint Excursion"
                      placeholderTitle="Mountain Excursion Memory"
                      aspect="landscape"
                      naturalAspect="landscape"
                      objectPosition="top"
                    />
                  </div>
                  <div className="mt-2.5 flex items-center justify-between gap-2 px-1.5 pb-1">
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_#818cf8]" />
                      <span className="font-mono text-[10px] uppercase tracking-wider text-slate-300">
                        Scenic Overlook • Fresh Perspective
                      </span>
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-sky-200">
                      Year 2
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
          </FadeInSection>

          <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ABOUT_DATA.values.map((val, idx) => {
              const meta = VALUE_ITEMS[idx % VALUE_ITEMS.length];
              const Icon = meta.icon;
              return (
                <StaggerItem key={val.title}>
                  <div className="glass-panel glass-panel-hover group relative h-full overflow-hidden rounded-2xl p-5 sm:p-6">
                    <div
                      aria-hidden="true"
                      className={`pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent ${meta.rimClass} to-transparent`}
                    />
                    <div className="mb-4 flex items-center justify-between gap-2">
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-105 ${meta.badgeClass}`}
                      >
                        <Icon className="h-[18px] w-[18px]" />
                      </span>
                      <span
                        className={`font-mono text-[10px] uppercase tracking-widest ${meta.labelClass}`}
                      >
                        0{idx + 1} • Value
                      </span>
                    </div>
                    <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-white sm:text-xl">
                      {val.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">
                      {val.description}
                    </p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </section>

        {/* WHY IT, WHY PNC & CAREER AMBITION */}
        <StaggerContainer className="grid gap-5 lg:grid-cols-3">
          <StaggerItem>
            <article className="glass-panel glass-panel-hover relative flex h-full flex-col overflow-hidden rounded-3xl p-6 sm:p-7">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/50 to-transparent"
              />
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-sky-400/30 bg-sky-500/12 text-sky-300">
                  <Cpu className="h-5 w-5" />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-sky-300/80">
                  01 • Passion
                </span>
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
            <article className="glass-panel glass-panel-hover relative flex h-full flex-col overflow-hidden rounded-3xl p-6 sm:p-7">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent"
              />
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-400/30 bg-violet-500/12 text-violet-300">
                  <HeartHandshake className="h-5 w-5" />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-violet-300/80">
                  02 • Opportunity
                </span>
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
            <article className="glass-panel glass-panel-hover relative flex h-full flex-col overflow-hidden rounded-3xl p-6 sm:p-7">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"
              />
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-500/12 text-amber-300">
                  <Rocket className="h-5 w-5" />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-amber-300/80">
                  03 • Vision
                </span>
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

        {/* NEXT CHAPTER CTA */}
        <FadeInSection>
          <div className="glass-panel relative flex flex-col items-start justify-between gap-5 overflow-hidden rounded-3xl p-6 sm:flex-row sm:items-center sm:p-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent"
            />
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
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 text-sm font-semibold text-white transition active:scale-[0.98] hover:opacity-95"
              >
                <Compass className="h-4 w-4" />
                <span>Explore 3D Timeline</span>
              </Link>
              <Link
                href="/skills-projects"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-5 py-3 text-sm font-semibold text-white transition active:scale-[0.98] hover:border-sky-400/40"
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
