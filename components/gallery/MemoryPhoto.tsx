"use client";

import {
  getLocalPreview,
  PHOTO_PREVIEW_EVENT,
  removeLocalPreview,
  saveLocalPreview,
  type LocalMediaPreview,
} from "@/lib/localPhotoStore";
import { Camera, Film, RotateCcw, Upload } from "lucide-react";
import Image from "next/image";
import { type ChangeEvent, useEffect, useId, useState } from "react";

interface MemoryPhotoProps {
  slotId: string;
  src: string;
  alt: string;
  placeholderTitle?: string;
  aspect?: "landscape" | "portrait" | "square";
  naturalAspect?: "landscape" | "portrait" | "square";
  objectPosition?: "top" | "center" | "bottom";
  priority?: boolean;
  mediaType?: "image" | "video";
  videoSrc?: string;
  allowLocalPreview?: boolean;
  className?: string;
  imgClassName?: string;
}

export default function MemoryPhoto({
  slotId,
  src,
  alt,
  placeholderTitle,
  aspect = "landscape",
  naturalAspect,
  objectPosition = "top",
  priority = false,
  mediaType = "image",
  videoSrc,
  allowLocalPreview = true,
  className = "",
  imgClassName = "",
}: MemoryPhotoProps) {
  const inputId = useId();
  const [localPreview, setLocalPreview] = useState<LocalMediaPreview | null>(null);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const saved = await getLocalPreview(slotId);
      if (active) {
        setLocalPreview(saved);
      }
    };

    load();

    const handleUpdate = (e: Event) => {
      const custom = e as CustomEvent<{ slotId?: string }>;
      if (!custom.detail?.slotId || custom.detail.slotId === slotId) {
        load();
      }
    };

    window.addEventListener(PHOTO_PREVIEW_EVENT, handleUpdate);
    return () => {
      active = false;
      window.removeEventListener(PHOTO_PREVIEW_EVENT, handleUpdate);
    };
  }, [slotId]);

  const aspectClass =
    aspect === "portrait"
      ? "aspect-[3/4]"
      : aspect === "square"
      ? "aspect-square"
      : "aspect-[4/3]";

  const focalClass =
    objectPosition === "bottom"
      ? "object-bottom"
      : objectPosition === "center"
      ? "object-center"
      : "object-[50%_20%]";

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      await saveLocalPreview(slotId, file);
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleClearPreview = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await removeLocalPreview(slotId);
  };

  const isPreviewVideo =
    localPreview?.mimeType.startsWith("video/") ||
    (mediaType === "video" && Boolean(videoSrc) && !localPreview);

  const resolvedSrc = localPreview ? localPreview.dataUrl : videoSrc || src;
  const imgError = failedSrc === resolvedSrc;
  const showPlaceholder = !localPreview && (!src || imgError);
  const useAmbientMatte =
    !isPreviewVideo &&
    !localPreview &&
    aspect === "landscape" &&
    naturalAspect === "portrait";

  return (
    <div
      className={`relative overflow-hidden bg-[#060919] ring-1 ring-inset ring-white/10 ${aspectClass} ${className}`}
    >
      {!showPlaceholder ? (
        <>
          {isPreviewVideo ? (
            <video
              src={resolvedSrc}
              muted
              loop
              playsInline
              autoPlay
              className={`h-full w-full object-cover ${imgClassName}`}
            />
          ) : useAmbientMatte ? (
            <>
              <Image
                src={resolvedSrc}
                alt=""
                fill
                unoptimized
                aria-hidden="true"
                sizes="(max-width: 768px) 100vw, 50vw"
                className="scale-125 object-cover opacity-55 blur-2xl brightness-50 saturate-150"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_30%,rgba(4,7,20,0.65)_100%)]"
              />
              <Image
                src={resolvedSrc}
                alt={alt}
                fill
                priority={priority}
                unoptimized
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={() => setFailedSrc(resolvedSrc)}
                className={`object-contain p-1.5 drop-shadow-[0_14px_28px_rgba(0,0,0,0.75)] transition-transform duration-700 ease-out group-hover:scale-[1.03] ${imgClassName}`}
              />
            </>
          ) : (
            <Image
              src={resolvedSrc}
              alt={alt}
              fill
              priority={priority}
              unoptimized
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => setFailedSrc(resolvedSrc)}
              className={`object-cover ${focalClass} contrast-[1.02] saturate-[1.04] transition-transform duration-700 ease-out group-hover:scale-[1.04] ${imgClassName}`}
            />
          )}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#040714]/50 via-transparent to-[#040714]/20 transition-opacity duration-300 group-hover:opacity-75"
          />

          {localPreview && (
            <div className="absolute right-2.5 top-2.5 z-10 flex items-center gap-1.5">
              <span className="rounded-full border border-sky-400/35 bg-slate-950/75 px-2.5 py-1 font-mono text-[10px] text-sky-200 backdrop-blur-md">
                Local Preview
              </span>
              <button
                type="button"
                onClick={handleClearPreview}
                title="Reset preview"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-slate-950/80 text-slate-200 backdrop-blur-md transition hover:border-rose-400/50 hover:text-rose-200"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="cosmic-grid-bg relative flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#0b1230] via-[#060919] to-[#130d2e] p-6 text-center">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-3.5 h-3 w-3 border-l border-t border-white/20"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-3.5 top-3.5 h-3 w-3 border-r border-t border-white/20"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-3.5 left-3.5 h-3 w-3 border-b border-l border-white/20"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-3.5 right-3.5 h-3 w-3 border-b border-r border-white/20"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(99,102,241,0.22),transparent_65%)]"
          />

          <div className="relative z-10 flex flex-col items-center">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.05] text-sky-300 shadow-[0_8px_24px_rgba(0,0,0,0.45)] transition-transform duration-300 group-hover:scale-105 group-hover:border-sky-400/35">
              {mediaType === "video" ? (
                <Film className="h-5 w-5" />
              ) : (
                <Camera className="h-5 w-5" />
              )}
            </div>

            <p className="font-[family-name:var(--font-display)] text-sm font-semibold tracking-tight text-white">
              {placeholderTitle || alt}
            </p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-slate-400">
              Memory Photo Frame
            </p>

            {allowLocalPreview && (
              <div className="mt-3.5" onClick={(e) => e.stopPropagation()}>
                <label
                  htmlFor={inputId}
                  title={`Target path: public${src}`}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-[11px] font-medium text-slate-200 backdrop-blur-md transition hover:border-sky-400/50 hover:bg-sky-500/20 hover:text-white"
                >
                  <Upload className="h-3 w-3 text-sky-300" />
                  <span>{isUploading ? "Loading..." : "Add / Preview Photo"}</span>
                </label>
                <input
                  id={inputId}
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
