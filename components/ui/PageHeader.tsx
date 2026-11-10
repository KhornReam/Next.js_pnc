"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  accentGradient?: string;
  icon?: ReactNode;
  backHref?: string;
  backLabel?: string;
}

export default function PageHeader({
  eyebrow,
  title,
  description,
  accentGradient = "from-sky-400/20 via-violet-500/15 to-transparent",
  icon,
  backHref = "/",
  backLabel = "Back to Home",
}: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.07] pt-28 pb-16 sm:pt-36 sm:pb-20">
      {/* Subtle atmospheric glow */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 h-full bg-gradient-to-b ${accentGradient}`}
      />
      <div
        aria-hidden="true"
        className="cosmic-grid-bg pointer-events-none absolute inset-0 opacity-50"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-6 flex flex-wrap items-center justify-between gap-4"
        >
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-slate-300 transition hover:border-violet-400/40 hover:bg-white/[0.08] hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{backLabel}</span>
          </Link>

          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-400/25 bg-indigo-500/10 px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider text-indigo-200">
            {icon ?? <Sparkles className="h-3.5 w-3.5 text-sky-400" />}
            <span>{eyebrow}</span>
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
        >
          <span className="text-gradient-hero">{title}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.16 }}
          className="mt-5 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg"
        >
          {description}
        </motion.p>
      </div>
    </section>
  );
}
