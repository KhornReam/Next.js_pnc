"use client";

import MemoryGallery from "@/components/gallery/MemoryGallery";
import { FadeInSection } from "@/components/ui/MotionPrimitives";
import PageHeader from "@/components/ui/PageHeader";
import StoryHighlightGrid from "@/components/ui/StoryHighlightGrid";
import { SPORTS_CONTENT } from "@/data/journeyData";
import { ArrowRight, Flame, Medal, Trophy, Users } from "lucide-react";
import Link from "next/link";

export default function SportsContent() {
  const icons = [
    <Trophy key="trophy" className="h-5 w-5" />,
    <Users key="users" className="h-5 w-5" />,
    <Medal key="medal" className="h-5 w-5" />,
    <Flame key="flame" className="h-5 w-5" />,
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Chapter 03 • Sports"
        title="Sports, Football & Team Spirit"
        description={SPORTS_CONTENT.intro}
        icon={<Trophy className="h-3.5 w-3.5 text-sky-400" />}
        accentGradient="from-sky-500/20 via-blue-600/10 to-transparent"
      />

      <div className="mx-auto max-w-6xl space-y-14 px-4 py-14 sm:px-6 lg:px-8">
        <StoryHighlightGrid
          items={SPORTS_CONTENT.highlights}
          accentColorClass="border-sky-400/25 bg-sky-500/10 text-sky-200"
          iconRenderer={(idx) => icons[idx % icons.length]}
        />

        <FadeInSection>
          <div className="glass-panel rounded-3xl p-6 sm:p-8">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-white">
              What Sports Taught Me Beyond the Pitch
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
              Playing football and competing alongside classmates taught me patience, encouragement when a teammate misses, clear communication under pressure, and staying disciplined — habits that directly make me a stronger software engineering teammate.
            </p>
          </div>
        </FadeInSection>

        <FadeInSection>
          <MemoryGallery
            title="Sports Memories Gallery"
            subtitle="Match days, competitions, and unforgettable afternoons with classmates."
            categories={["sports"]}
            showFilters={false}
          />
        </FadeInSection>

        <FadeInSection>
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8">
            <Link
              href="/journey"
              className="text-sm font-medium text-slate-300 transition hover:text-white"
            >
              ← Back to My Journey
            </Link>
            <Link
              href="/activities"
              className="inline-flex items-center gap-2 rounded-xl border border-indigo-400/35 bg-indigo-500/15 px-5 py-2.5 text-sm font-semibold text-indigo-100 transition hover:bg-indigo-500/25"
            >
              <span>Next: School Activities</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </FadeInSection>
      </div>
    </div>
  );
}
