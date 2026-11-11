"use client";

import LightboxModal from "@/components/gallery/LightboxModal";
import MemoryPhoto from "@/components/gallery/MemoryPhoto";
import {
  CATEGORY_LABELS,
  type GalleryCategory,
  MEMORY_ITEMS,
  type MemoryItem,
} from "@/data/journeyData";
import { motion } from "framer-motion";
import { Calendar, Expand, LayoutGrid, MapPin, Rows3 } from "lucide-react";
import { useMemo, useState } from "react";

interface MemoryGalleryProps {
  title?: string;
  subtitle?: string;
  categories?: GalleryCategory[];
  showFilters?: boolean;
  defaultLayout?: "masonry" | "grid";
  items?: MemoryItem[];
}

export default function MemoryGallery({
  title = "Captured Moments & Memories",
  subtitle = "Hover to explore each memory, filter by chapter, or open any card in the fullscreen lightbox viewer.",
  categories,
  showFilters = true,
  defaultLayout = "grid",
  items,
}: MemoryGalleryProps) {
  const sourceItems = useMemo(() => {
    if (items) return items;
    if (!categories || categories.length === 0) return MEMORY_ITEMS;
    return MEMORY_ITEMS.filter((item) => categories.includes(item.category));
  }, [categories, items]);

  const availableTabs = useMemo(() => {
    const present = Array.from(new Set(sourceItems.map((i) => i.category)));
    return present;
  }, [sourceItems]);

  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory | "all">("all");
  const [layoutMode, setLayoutMode] = useState<"masonry" | "grid">(defaultLayout);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredItems = useMemo(() => {
    if (selectedCategory === "all") return sourceItems;
    return sourceItems.filter((item) => item.category === selectedCategory);
  }, [selectedCategory, sourceItems]);

  const isSingle = filteredItems.length === 1;
  const gridContainerClass =
    layoutMode === "masonry" && filteredItems.length >= 3
      ? "columns-1 gap-5 space-y-5 sm:columns-2 lg:columns-3"
      : filteredItems.length === 2
      ? "grid grid-cols-1 gap-6 sm:grid-cols-2"
      : "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-white sm:text-3xl">
            {title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">{subtitle}</p>
        </div>

        {filteredItems.length >= 2 && (
          <div className="inline-flex items-center self-start rounded-full border border-white/10 bg-white/[0.04] p-1">
            <button
              type="button"
              onClick={() => setLayoutMode("grid")}
              aria-label="Grid layout"
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                layoutMode === "grid"
                  ? "bg-indigo-500/30 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Grid</span>
            </button>
            <button
              type="button"
              onClick={() => setLayoutMode("masonry")}
              aria-label="Masonry layout"
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                layoutMode === "masonry"
                  ? "bg-indigo-500/30 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Rows3 className="h-3.5 w-3.5" />
              <span>Masonry</span>
            </button>
          </div>
        )}
      </div>

      {/* Category Filter Pills */}
      {showFilters && availableTabs.length > 1 && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`relative rounded-full px-4 py-2 text-xs font-medium transition ${
              selectedCategory === "all"
                ? "text-white"
                : "border border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/20 hover:text-white"
            }`}
          >
            {selectedCategory === "all" && (
              <motion.span
                layoutId="galleryFilterPill"
                className="absolute inset-0 rounded-full border border-indigo-400/40 bg-gradient-to-r from-indigo-500/35 to-violet-500/35"
                transition={{ type: "spring", stiffness: 360, damping: 28 }}
              />
            )}
            <span className="relative z-10">All ({sourceItems.length})</span>
          </button>

          {availableTabs.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`relative rounded-full px-4 py-2 text-xs font-medium transition ${
                  isActive
                    ? "text-white"
                    : "border border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/20 hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="galleryFilterPill"
                    className="absolute inset-0 rounded-full border border-indigo-400/40 bg-gradient-to-r from-indigo-500/35 to-violet-500/35"
                    transition={{ type: "spring", stiffness: 360, damping: 28 }}
                  />
                )}
                <span className="relative z-10">{CATEGORY_LABELS[cat]}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Single Item Editorial Spotlight */}
      {isSingle ? (
        <motion.article
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.45 }}
          onClick={() => setLightboxIndex(0)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setLightboxIndex(0);
            }
          }}
          className="glass-panel glass-panel-hover group grid cursor-pointer overflow-hidden rounded-3xl focus:outline-none focus:ring-2 focus:ring-sky-400/60 lg:grid-cols-[1.1fr_1fr]"
        >
          <div className="relative flex items-center justify-center bg-[#060919]/90 p-3 sm:p-4">
            <div className="w-full max-w-md overflow-hidden rounded-2xl">
              <MemoryPhoto
                slotId={filteredItems[0].id}
                src={filteredItems[0].imageSrc}
                videoSrc={filteredItems[0].videoSrc}
                mediaType={filteredItems[0].mediaType}
                alt={filteredItems[0].title}
                placeholderTitle={filteredItems[0].title}
                aspect={filteredItems[0].aspect}
                naturalAspect={filteredItems[0].aspect}
                objectPosition={filteredItems[0].objectPosition ?? "top"}
              />
            </div>
          </div>

          <div className="flex flex-col justify-between p-6 sm:p-8">
            <div>
              <span className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.05] px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-sky-200">
                {filteredItems[0].categoryLabel}
              </span>
              <h3 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-bold text-white transition group-hover:text-sky-200">
                {filteredItems[0].title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
                {filteredItems[0].caption}
              </p>
            </div>

            <div className="mt-8 space-y-4 border-t border-white/[0.08] pt-5">
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-sky-400" />
                  <span>{filteredItems[0].date}</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-violet-400" />
                  <span>{filteredItems[0].location}</span>
                </span>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/35 bg-sky-500/15 px-4 py-1.5 text-xs font-medium text-sky-200 transition group-hover:bg-sky-500/25">
                <Expand className="h-3.5 w-3.5" />
                <span>View Fullscreen Memory</span>
              </span>
            </div>
          </div>
        </motion.article>
      ) : (
        /* Multi-Item Gallery Grid / Masonry */
        <div className={gridContainerClass}>
          {filteredItems.map((item, idx) => (
            <motion.article
              key={item.id}
              layout
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.45, delay: Math.min(idx * 0.04, 0.28) }}
              onClick={() => setLightboxIndex(idx)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setLightboxIndex(idx);
                }
              }}
              className={`glass-panel glass-panel-hover group cursor-pointer overflow-hidden rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-400/60 ${
                layoutMode === "masonry" && filteredItems.length >= 3
                  ? "break-inside-avoid"
                  : "flex flex-col"
              }`}
            >
              <div className="relative">
                <MemoryPhoto
                  slotId={item.id}
                  src={item.imageSrc}
                  videoSrc={item.videoSrc}
                  mediaType={item.mediaType}
                  alt={item.title}
                  placeholderTitle={item.title}
                  aspect={layoutMode === "masonry" ? item.aspect : "landscape"}
                  naturalAspect={item.aspect}
                  objectPosition={item.objectPosition ?? "top"}
                />

                <div className="pointer-events-none absolute left-3 top-3 z-10 flex items-center gap-2">
                  <span className="rounded-full border border-white/15 bg-slate-950/75 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-slate-200 backdrop-blur-md">
                    {item.categoryLabel}
                  </span>
                </div>

                <div className="pointer-events-none absolute bottom-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-slate-950/75 text-white opacity-0 backdrop-blur-md transition duration-300 group-hover:opacity-100">
                  <Expand className="h-3.5 w-3.5" />
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-white transition group-hover:text-sky-200">
                    {item.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-300">
                    {item.caption}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-white/[0.08] pt-3 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-sky-400" />
                    <span>{item.date}</span>
                  </span>
                  <span className="truncate pl-3 text-[11px] text-slate-400">
                    {item.location}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}

      {/* Lightbox Viewer */}
      <LightboxModal
        items={filteredItems}
        activeIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(nextIdx) => setLightboxIndex(nextIdx)}
      />
    </div>
  );
}
