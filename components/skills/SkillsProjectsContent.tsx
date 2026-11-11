"use client";

import MemoryPhoto from "@/components/gallery/MemoryPhoto";
import { getTechVisualMeta, GitHubIcon } from "@/components/ui/BrandIcons";
import {
  FadeInSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/MotionPrimitives";
import PageHeader from "@/components/ui/PageHeader";
import {
  DEVELOPMENT_PROGRESS,
  PROJECT_SLOTS,
  SKILL_GROUPS,
} from "@/data/journeyData";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Code2,
  Database,
  ExternalLink,
  FolderGit2,
  Layers,
  Server,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SkillsProjectsContent() {
  const [activeGroup, setActiveGroup] = useState<string>("all");

  const visibleGroups =
    activeGroup === "all"
      ? SKILL_GROUPS
      : SKILL_GROUPS.filter((group) => group.id === activeGroup);

  const getGroupIcon = (id: string) => {
    if (id === "languages") return <Code2 className="h-5 w-5 text-sky-300" />;
    if (id === "frontend") return <Layers className="h-5 w-5 text-violet-300" />;
    if (id === "backend") return <Server className="h-5 w-5 text-indigo-300" />;
    return <Database className="h-5 w-5 text-emerald-300" />;
  };

  return (
    <div>
      <PageHeader
        eyebrow="Chapter 08 • IT Skills & Projects"
        title="Technical Growth, Stack & Projects"
        description="Tracking my evolution from writing foundational algorithms in Year 1 to crafting full-stack applications and interactive 3D web experiences in Year 2."
        icon={<Code2 className="h-3.5 w-3.5 text-sky-400" />}
        accentGradient="from-indigo-500/20 via-sky-500/15 to-transparent"
      />

      <div className="mx-auto max-w-6xl space-y-16 px-4 py-14 sm:px-6 lg:px-8">
        {/* DEVELOPMENT PROGRESS TIMELINE */}
        <section className="space-y-6">
          <FadeInSection>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-sky-300">
              <TrendingUp className="h-4 w-4" />
              <span>Two-Year Engineering Progression</span>
            </div>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold text-white sm:text-3xl">
              My Development Progress
            </h2>
          </FadeInSection>

          <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {DEVELOPMENT_PROGRESS.map((step) => (
              <StaggerItem key={step.phase}>
                <div className="glass-panel glass-panel-hover flex h-full flex-col justify-between rounded-2xl p-5">
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-indigo-300">
                      {step.phase}
                    </span>
                    <h3 className="mt-1.5 font-[family-name:var(--font-display)] text-lg font-bold text-white">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-300">
                      {step.summary}
                    </p>
                  </div>

                  <div className="mt-5">
                    <div className="mb-1.5 flex items-center justify-between font-mono text-[11px] text-slate-400">
                      <span>Milestone Growth</span>
                      <span className="text-sky-300">{step.progressPercent}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${step.progressPercent}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full rounded-full bg-gradient-to-r from-sky-400 via-indigo-400 to-violet-500"
                      />
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* FILTERABLE SKILLS STACK */}
        <section className="space-y-6">
          <FadeInSection>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-violet-300">
                  Technical Toolkit
                </span>
                <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold text-white sm:text-3xl">
                  Languages, Frontend, Backend & Databases
                </h2>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActiveGroup("all")}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                    activeGroup === "all"
                      ? "border border-indigo-400/40 bg-indigo-500/25 text-white"
                      : "border border-white/10 bg-white/[0.03] text-slate-300 hover:text-white"
                  }`}
                >
                  All Stack
                </button>
                {SKILL_GROUPS.map((group) => (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => setActiveGroup(group.id)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                      activeGroup === group.id
                        ? "border border-indigo-400/40 bg-indigo-500/25 text-white"
                        : "border border-white/10 bg-white/[0.03] text-slate-300 hover:text-white"
                    }`}
                  >
                    {group.title}
                  </button>
                ))}
              </div>
            </div>
          </FadeInSection>

          <div className="grid gap-5 md:grid-cols-2">
            {visibleGroups.map((group) => (
              <motion.article
                layout
                key={group.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="glass-panel rounded-3xl p-6"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]">
                    {getGroupIcon(group.id)}
                  </div>
                  <div>
                    <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-white">
                      {group.title}
                    </h3>
                    <p className="text-xs text-slate-400">{group.subtitle}</p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {group.items.map((skill) => {
                    const tech = getTechVisualMeta(skill.name, "md");
                    return (
                      <div
                        key={skill.name}
                        className="group relative flex items-center gap-3.5 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 transition duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.055]"
                      >
                        <span
                          aria-hidden="true"
                          className="absolute inset-y-3 left-0 w-[3px] rounded-r-full transition-all duration-300 group-hover:inset-y-2"
                          style={{
                            backgroundColor: tech.color,
                            boxShadow: `0 0 12px ${tech.glow}`,
                          }}
                        />

                        <div
                          className="flex h-11 w-12 shrink-0 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-105"
                          style={{
                            backgroundColor: tech.bg,
                            borderColor: tech.border,
                            boxShadow: `0 6px 20px ${tech.glow}`,
                          }}
                        >
                          {tech.icon}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-[family-name:var(--font-display)] text-sm font-semibold text-white">
                              {skill.name}
                            </span>
                            <span
                              className="shrink-0 rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-medium"
                              style={{
                                backgroundColor: tech.bg,
                                borderColor: tech.border,
                                color: tech.textColor,
                              }}
                            >
                              {skill.stage}
                            </span>
                          </div>
                          <p className="mt-1 text-xs leading-relaxed text-slate-300">
                            {skill.focus}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* PERSONAL & TEAM PROJECTS */}
        <section className="space-y-6">
          <FadeInSection>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-amber-300">
              <FolderGit2 className="h-4 w-4" />
              <span>Personal & Team Software Builds</span>
            </div>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold text-white sm:text-3xl">
              Featured Projects & Editable Project Slots
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Update project titles, real GitHub repositories, and upload project screenshots to{" "}
              <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs text-sky-300">
                public/images/projects/
              </code>{" "}
              inside <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs text-sky-300">data/journeyData.ts</code>.
            </p>
          </FadeInSection>

          <StaggerContainer className="grid gap-6 lg:grid-cols-3">
            {PROJECT_SLOTS.map((project) => (
              <StaggerItem key={project.id}>
                <article className="glass-panel glass-panel-hover flex h-full flex-col overflow-hidden rounded-3xl">
                  <div className="relative">
                    <MemoryPhoto
                      slotId={project.id}
                      src={project.imageSrc}
                      alt={project.title}
                      placeholderTitle={project.title}
                      aspect="landscape"
                      naturalAspect="landscape"
                      objectPosition="top"
                    />
                    <span className="pointer-events-none absolute left-3 top-3 rounded-full border border-white/15 bg-slate-950/75 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-sky-200 backdrop-blur-md">
                      {project.type}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-wider text-indigo-300">
                        {project.phase} • {project.role}
                      </p>
                      <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl font-bold text-white">
                        {project.title}
                      </h3>
                      <p className="mt-2.5 text-sm leading-relaxed text-slate-300">
                        {project.summary}
                      </p>

                      <ul className="mt-4 space-y-1.5 text-xs text-slate-300">
                        {project.highlights.map((h) => (
                          <li key={h} className="flex items-start gap-2">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6 space-y-4 border-t border-white/10 pt-4">
                      <div className="flex flex-wrap gap-2">
                        {project.techStack.map((tech) => {
                          const tagMeta = getTechVisualMeta(tech, "sm");
                          return (
                            <span
                              key={tech}
                              className="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono text-[11px] font-medium"
                              style={{
                                backgroundColor: tagMeta.bg,
                                borderColor: tagMeta.border,
                                color: tagMeta.textColor,
                              }}
                            >
                              {tagMeta.icon}
                              <span>{tech}</span>
                            </span>
                          );
                        })}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.05] px-3.5 py-2 text-xs font-medium text-white transition hover:border-indigo-400/50 hover:bg-indigo-500/20"
                          >
                            <GitHubIcon className="h-3.5 w-3.5" />
                            <span>GitHub</span>
                          </a>
                        )}
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-xl border border-sky-400/35 bg-sky-500/15 px-3.5 py-2 text-xs font-medium text-sky-200 transition hover:bg-sky-500/25"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            <span>Live Demo</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        <FadeInSection>
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8">
            <Link
              href="/workshops"
              className="text-sm font-medium text-slate-300 transition hover:text-white"
            >
              ← Previous: Workshops & Training
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-95"
            >
              <span>Let’s Connect</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </FadeInSection>
      </div>
    </div>
  );
}
