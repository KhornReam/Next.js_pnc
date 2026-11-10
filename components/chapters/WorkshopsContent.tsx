"use client";

import MemoryGallery from "@/components/gallery/MemoryGallery";
import { FadeInSection } from "@/components/ui/MotionPrimitives";
import PageHeader from "@/components/ui/PageHeader";
import StoryHighlightGrid from "@/components/ui/StoryHighlightGrid";
import { WORKSHOPS_CONTENT } from "@/data/journeyData";
import {
  ArrowRight,
  Briefcase,
  Building2,
  Code2,
  Mic2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function WorkshopsContent() {
  const icons = [
    <Code2 key="code" className="h-5 w-5" />,
    <Sparkles key="sparkles" className="h-5 w-5" />,
    <Briefcase key="briefcase" className="h-5 w-5" />,
    <Building2 key="building" className="h-5 w-5" />,
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Chapter 07 • Workshops & Training"
        title="Workshops, Leadership & Company Visits"
        description={WORKSHOPS_CONTENT.intro}
        icon={<Mic2 className="h-3.5 w-3.5 text-violet-300" />}
        accentGradient="from-violet-500/20 via-indigo-600/10 to-transparent"
      />

      <div className="mx-auto max-w-6xl space-y-14 px-4 py-14 sm:px-6 lg:px-8">
        <StoryHighlightGrid
          items={WORKSHOPS_CONTENT.highlights}
          accentColorClass="border-violet-400/25 bg-violet-500/10 text-violet-200"
          iconRenderer={(idx) => icons[idx % icons.length]}
        />

        <FadeInSection>
          <div className="glass-panel rounded-3xl p-6 sm:p-8">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-white">
              Bridging Classroom Learning With Real Engineering Teams
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
              Guest speakers, alumni sharing sessions, career preparation workshops, and company visits showed us how professional software teams communicate, solve problems, and grow. Every session built confidence for internships and life after graduation.
            </p>
          </div>
        </FadeInSection>

        <FadeInSection>
          <MemoryGallery
            title="Workshops, Training & Visits Gallery"
            subtitle="Moments from IT workshops, soft-skills training, guest talks, and company visits."
            categories={["workshops"]}
            showFilters={false}
          />
        </FadeInSection>

        <FadeInSection>
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8">
            <Link
              href="/healthy-life"
              className="text-sm font-medium text-slate-300 transition hover:text-white"
            >
              ← Previous: Healthy Life
            </Link>
            <Link
              href="/skills-projects"
              className="inline-flex items-center gap-2 rounded-xl border border-sky-400/35 bg-sky-500/15 px-5 py-2.5 text-sm font-semibold text-sky-100 transition hover:bg-sky-500/25"
            >
              <span>Next: IT Skills & Projects</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </FadeInSection>
      </div>
    </div>
  );
}
