"use client";

import MemoryGallery from "@/components/gallery/MemoryGallery";
import { FadeInSection } from "@/components/ui/MotionPrimitives";
import PageHeader from "@/components/ui/PageHeader";
import StoryHighlightGrid from "@/components/ui/StoryHighlightGrid";
import { ACTIVITIES_CONTENT } from "@/data/journeyData";
import { ArrowRight, CalendarHeart, Compass, HandHeart, Users } from "lucide-react";
import Link from "next/link";

export default function ActivitiesContent() {
  const icons = [
    <CalendarHeart key="cal" className="h-5 w-5" />,
    <HandHeart key="hand" className="h-5 w-5" />,
    <Compass key="compass" className="h-5 w-5" />,
    <Users key="users" className="h-5 w-5" />,
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Chapter 04 • Activities"
        title="School Events, Volunteering & Trips"
        description={ACTIVITIES_CONTENT.intro}
        icon={<Users className="h-3.5 w-3.5 text-indigo-300" />}
        accentGradient="from-indigo-500/20 via-violet-500/10 to-transparent"
      />

      <div className="mx-auto max-w-6xl space-y-14 px-4 py-14 sm:px-6 lg:px-8">
        <StoryHighlightGrid
          items={ACTIVITIES_CONTENT.highlights}
          accentColorClass="border-indigo-400/25 bg-indigo-500/10 text-indigo-200"
          iconRenderer={(idx) => icons[idx % icons.length]}
        />

        <FadeInSection>
          <MemoryGallery
            title="Activities & Special Events Gallery"
            subtitle="Moments from school programs, volunteering, educational trips, and team activities."
            categories={["activities", "special-events"]}
            defaultLayout="masonry"
          />
        </FadeInSection>

        <FadeInSection>
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8">
            <Link
              href="/sports"
              className="text-sm font-medium text-slate-300 transition hover:text-white"
            >
              ← Previous: Sports
            </Link>
            <Link
              href="/parties"
              className="inline-flex items-center gap-2 rounded-xl border border-fuchsia-400/35 bg-fuchsia-500/15 px-5 py-2.5 text-sm font-semibold text-fuchsia-100 transition hover:bg-fuchsia-500/25"
            >
              <span>Next: Parties & Celebrations</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </FadeInSection>
      </div>
    </div>
  );
}
