"use client";

import MemoryGallery from "@/components/gallery/MemoryGallery";
import { FadeInSection } from "@/components/ui/MotionPrimitives";
import PageHeader from "@/components/ui/PageHeader";
import { FolderUp, Images } from "lucide-react";

export default function MemoriesArchiveContent() {
  return (
    <div>
      <PageHeader
        eyebrow="Photo & Video Archive"
        title="Memory Gallery"
        description="Explore all moments from Year 1, Year 2, Sports, Activities, Parties, Workshops, Classmates, and Special School Events."
        icon={<Images className="h-3.5 w-3.5 text-sky-400" />}
        accentGradient="from-violet-500/20 via-sky-500/10 to-transparent"
      />

      <div className="mx-auto max-w-7xl space-y-12 px-4 py-12 sm:px-6 lg:px-8">
        <FadeInSection>
          <div className="glass-panel flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-400/30 bg-sky-500/15 text-sky-300">
                <FolderUp className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-base font-semibold text-white">
                  Ready for Your Real Photographs & Videos
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-slate-300">
                  Place your image files in{" "}
                  <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-sky-300">
                    public/images/
                  </code>{" "}
                  matching the slot paths, or click <strong>Preview Photo</strong> on any placeholder card to preview files right in your browser.
                </p>
              </div>
            </div>
          </div>
        </FadeInSection>

        <MemoryGallery
          title="All PNC Chapters & Collections"
          subtitle="Filter by category, toggle between Grid and Masonry views, and open any moment in the fullscreen lightbox."
          defaultLayout="masonry"
        />
      </div>
    </div>
  );
}
