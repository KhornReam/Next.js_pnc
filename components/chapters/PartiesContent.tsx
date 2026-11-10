"use client";

import MemoryGallery from "@/components/gallery/MemoryGallery";
import { FadeInSection } from "@/components/ui/MotionPrimitives";
import PageHeader from "@/components/ui/PageHeader";
import StoryHighlightGrid from "@/components/ui/StoryHighlightGrid";
import { PARTIES_CONTENT } from "@/data/journeyData";
import { ArrowRight, Cake, GraduationCap, Laugh, PartyPopper } from "lucide-react";
import Link from "next/link";

export default function PartiesContent() {
  const icons = [
    <Cake key="cake" className="h-5 w-5" />,
    <PartyPopper key="party" className="h-5 w-5" />,
    <GraduationCap key="grad" className="h-5 w-5" />,
    <Laugh key="laugh" className="h-5 w-5" />,
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Chapter 05 • Parties & Celebrations"
        title="Birthdays, Celebrations & Unforgettable Laughs"
        description={PARTIES_CONTENT.intro}
        icon={<PartyPopper className="h-3.5 w-3.5 text-fuchsia-300" />}
        accentGradient="from-fuchsia-500/20 via-purple-600/10 to-transparent"
      />

      <div className="mx-auto max-w-6xl space-y-14 px-4 py-14 sm:px-6 lg:px-8">
        <StoryHighlightGrid
          items={PARTIES_CONTENT.highlights}
          accentColorClass="border-fuchsia-400/25 bg-fuchsia-500/10 text-fuchsia-200"
          iconRenderer={(idx) => icons[idx % icons.length]}
        />

        <FadeInSection>
          <MemoryGallery
            title="Parties & Celebration Memories"
            subtitle="Birthdays, class celebrations, graduation highlights, and joyful moments with classmates."
            categories={["parties", "special-events", "classmates"]}
            defaultLayout="masonry"
          />
        </FadeInSection>

        <FadeInSection>
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8">
            <Link
              href="/activities"
              className="text-sm font-medium text-slate-300 transition hover:text-white"
            >
              ← Previous: Activities
            </Link>
            <Link
              href="/healthy-life"
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/35 bg-emerald-500/15 px-5 py-2.5 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/25"
            >
              <span>Next: Healthy Life</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </FadeInSection>
      </div>
    </div>
  );
}
