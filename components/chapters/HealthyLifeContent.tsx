"use client";

import MemoryGallery from "@/components/gallery/MemoryGallery";
import { FadeInSection } from "@/components/ui/MotionPrimitives";
import PageHeader from "@/components/ui/PageHeader";
import StoryHighlightGrid from "@/components/ui/StoryHighlightGrid";
import { HEALTHY_LIFE_CONTENT } from "@/data/journeyData";
import { Activity, ArrowRight, HeartPulse, ShieldCheck, Sun } from "lucide-react";
import Link from "next/link";

export default function HealthyLifeContent() {
  const icons = [
    <ShieldCheck key="shield" className="h-5 w-5" />,
    <HeartPulse key="heart" className="h-5 w-5" />,
    <Sun key="sun" className="h-5 w-5" />,
    <Activity key="activity" className="h-5 w-5" />,
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Chapter 06 • Healthy Life"
        title="Health Awareness & Balanced Well-Being"
        description={HEALTHY_LIFE_CONTENT.intro}
        icon={<HeartPulse className="h-3.5 w-3.5 text-emerald-300" />}
        accentGradient="from-emerald-500/20 via-teal-600/10 to-transparent"
      />

      <div className="mx-auto max-w-6xl space-y-14 px-4 py-14 sm:px-6 lg:px-8">
        <StoryHighlightGrid
          items={HEALTHY_LIFE_CONTENT.highlights}
          accentColorClass="border-emerald-400/25 bg-emerald-500/10 text-emerald-200"
          iconRenderer={(idx) => icons[idx % icons.length]}
        />

        <FadeInSection>
          <div className="glass-panel rounded-3xl p-6 sm:p-8">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-white">
              Sustainable Habits for a Software Engineering Career
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
              Long coding sprints taught me that taking care of sleep, posture, nutrition, movement, and mental clarity is essential for long-term creativity and focus. PNC’s holistic health programs and wellness activities reminded us to look after ourselves and support our friends.
            </p>
          </div>
        </FadeInSection>

        <FadeInSection>
          <MemoryGallery
            title="Healthy Life & Wellness Gallery"
            subtitle="Wellness activities, outdoor routines, and healthy moments at PNC."
            categories={["healthy-life"]}
            showFilters={false}
          />
        </FadeInSection>

        <FadeInSection>
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8">
            <Link
              href="/parties"
              className="text-sm font-medium text-slate-300 transition hover:text-white"
            >
              ← Previous: Parties & Celebrations
            </Link>
            <Link
              href="/workshops"
              className="inline-flex items-center gap-2 rounded-xl border border-violet-400/35 bg-violet-500/15 px-5 py-2.5 text-sm font-semibold text-violet-100 transition hover:bg-violet-500/25"
            >
              <span>Next: Workshops & Training</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </FadeInSection>
      </div>
    </div>
  );
}
