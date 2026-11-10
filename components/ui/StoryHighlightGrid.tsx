"use client";

import { StaggerContainer, StaggerItem } from "@/components/ui/MotionPrimitives";
import type { ReactNode } from "react";

export interface StoryHighlightCardItem {
  title: string;
  description: string;
  badge: string;
}

interface StoryHighlightGridProps {
  items: StoryHighlightCardItem[];
  accentColorClass?: string;
  iconRenderer?: (index: number) => ReactNode;
}

export default function StoryHighlightGrid({
  items,
  accentColorClass = "border-indigo-400/25 bg-indigo-500/10 text-indigo-200",
  iconRenderer,
}: StoryHighlightGridProps) {
  return (
    <StaggerContainer className="grid gap-5 sm:grid-cols-2">
      {items.map((item, idx) => (
        <StaggerItem key={item.title}>
          <article className="glass-panel glass-panel-hover group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl p-6 sm:p-7">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-indigo-500/10 blur-2xl transition-opacity duration-300 group-hover:bg-violet-500/20"
            />
            <div>
              <div className="mb-4 flex items-center justify-between gap-3">
                <span
                  className={`inline-flex items-center rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-wider ${accentColorClass}`}
                >
                  {item.badge}
                </span>
                {iconRenderer && (
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-sky-300 transition-transform duration-300 group-hover:scale-110">
                    {iconRenderer(idx)}
                  </div>
                )}
              </div>
              <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-white">
                {item.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-slate-300">
                {item.description}
              </p>
            </div>
          </article>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
