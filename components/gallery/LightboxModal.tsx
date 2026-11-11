"use client";

import type { MemoryItem } from "@/data/journeyData";
import {
  getLocalPreview,
  PHOTO_PREVIEW_EVENT,
  saveLocalPreview,
  type LocalMediaPreview,
} from "@/lib/localPhotoStore";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  Camera,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import { type ChangeEvent, useEffect, useId, useState } from "react";

interface LightboxModalProps {
  items: MemoryItem[];
  activeIndex: number | null;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

export default function LightboxModal({
  items,
  activeIndex,
  onClose,
  onNavigate,
}: LightboxModalProps) {
  const uploadInputId = useId();
  const item = activeIndex !== null ? items[activeIndex] ?? null : null;
  const [localPreview, setLocalPreview] = useState<LocalMediaPreview | null>(null);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!item) return;
    let active = true;

    const load = async () => {
      const saved = await getLocalPreview(item.id);
      if (active) setLocalPreview(saved);
    };

    load();

    const handleUpdate = () => load();
    window.addEventListener(PHOTO_PREVIEW_EVENT, handleUpdate);
    return () => {
      active = false;
      window.removeEventListener(PHOTO_PREVIEW_EVENT, handleUpdate);
    };
  }, [item]);

  useEffect(() => {
    if (activeIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        onNavigate((activeIndex + 1) % items.length);
      } else if (e.key === "ArrowLeft") {
        onNavigate((activeIndex - 1 + items.length) % items.length);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, items.length, onClose, onNavigate]);

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !item) return;
    await saveLocalPreview(item.id, file);
    e.target.value = "";
  };

  const resolvedSrc = localPreview
    ? localPreview.dataUrl
    : item?.videoSrc || item?.imageSrc || "";
  const imgError = failedSrc === resolvedSrc;
  const isVideo =
    localPreview?.mimeType.startsWith("video/") ||
    (item?.mediaType === "video" && Boolean(item?.videoSrc) && !localPreview);
  const isPlaceholder = !localPreview && (!item?.imageSrc || imgError);

  return (
    <AnimatePresence>
      {item && activeIndex !== null && (
        <motion.div
          key="lightbox-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={item.title}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-3 backdrop-blur-xl sm:p-6"
        >
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="glass-panel relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl lg:grid lg:grid-cols-[1.45fr_1fr]"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close photo viewer"
              className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-slate-950/80 text-slate-200 backdrop-blur-md transition hover:border-violet-400/50 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Media stage */}
            <div className="relative flex min-h-[260px] items-center justify-center overflow-hidden bg-[#030614] p-3 sm:min-h-[380px] sm:p-5 lg:min-h-[540px]">
              {!isPlaceholder ? (
                isVideo ? (
                  <video
                    src={resolvedSrc}
                    controls
                    autoPlay
                    className="relative z-10 max-h-[76vh] w-full rounded-xl object-contain shadow-[0_24px_60px_rgba(0,0,0,0.85)]"
                  />
                ) : (
                  <>
                    <Image
                      src={resolvedSrc}
                      alt=""
                      fill
                      unoptimized
                      aria-hidden="true"
                      sizes="60vw"
                      className="scale-125 object-cover opacity-30 blur-3xl brightness-50 saturate-150"
                    />
                    <Image
                      src={resolvedSrc}
                      alt={item.title}
                      width={1600}
                      height={1200}
                      unoptimized
                      onError={() => setFailedSrc(resolvedSrc)}
                      className="relative z-10 max-h-[78vh] w-auto max-w-full rounded-xl object-contain shadow-[0_24px_60px_rgba(0,0,0,0.85)] ring-1 ring-white/15"
                    />
                  </>
                )
              ) : (
                <div className="cosmic-grid-bg flex h-full w-full flex-col items-center justify-center p-8 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-400/30 bg-indigo-500/15 text-sky-300">
                    <Camera className="h-8 w-8" />
                  </div>
                  <p className="font-[family-name:var(--font-display)] text-xl font-semibold text-white">
                    {item.title}
                  </p>
                  <p className="mt-2 max-w-sm text-sm text-slate-300">
                    Upload your real photograph to{" "}
                    <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs text-sky-300">
                      public{item.imageSrc}
                    </code>{" "}
                    or preview a local photo right now:
                  </p>
                  <label
                    htmlFor={uploadInputId}
                    className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-full border border-sky-400/35 bg-sky-500/15 px-4 py-2 text-xs font-medium text-sky-200 transition hover:bg-sky-500/25"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>Preview Local Photo</span>
                  </label>
                  <input
                    id={uploadInputId}
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleUpload}
                    className="sr-only"
                  />
                </div>
              )}

              {items.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      onNavigate((activeIndex - 1 + items.length) % items.length)
                    }
                    aria-label="Previous memory"
                    className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-slate-950/75 text-white backdrop-blur-md transition hover:border-sky-400/50 hover:bg-slate-900"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate((activeIndex + 1) % items.length)}
                    aria-label="Next memory"
                    className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-slate-950/75 text-white backdrop-blur-md transition hover:border-sky-400/50 hover:bg-slate-900"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {/* Metadata sidebar */}
            <div className="flex flex-col justify-between overflow-y-auto border-t border-white/10 p-6 sm:p-8 lg:border-l lg:border-t-0">
              <div>
                <span className="inline-flex items-center rounded-full border border-violet-400/30 bg-violet-500/15 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-violet-200">
                  {item.categoryLabel}
                </span>

                <h2 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-bold text-white">
                  {item.title}
                </h2>

                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  {item.caption}
                </p>

                <div className="mt-6 space-y-2.5 border-t border-white/10 pt-5 text-xs text-slate-300">
                  <div className="flex items-center gap-2.5">
                    <Calendar className="h-4 w-4 text-sky-400" />
                    <span>{item.date}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <MapPin className="h-4 w-4 text-violet-400" />
                    <span>{item.location}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-slate-400">
                <span>
                  Memory {activeIndex + 1} of {items.length}
                </span>
                <span className="font-mono text-[11px]">ESC • ← • →</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
