"use client";

import {
  FacebookIcon,
  GitHubIcon,
  LinkedInIcon,
} from "@/components/ui/BrandIcons";
import { CONTACT_DATA, SITE_CONFIG } from "@/data/journeyData";
import { AnimatePresence, motion } from "framer-motion";
import {
  Briefcase,
  ChevronRight,
  Code2,
  Compass,
  Grid2x2,
  HeartPulse,
  Home,
  Images,
  Mail,
  PartyPopper,
  Trophy,
  User,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MobileAppNavProps {
  sheetOpen: boolean;
  onToggleSheet: () => void;
  onCloseSheet: () => void;
}

const BOTTOM_TABS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/journey", label: "Journey", icon: Compass },
  { href: "/memories", label: "Gallery", icon: Images },
  { href: "/skills-projects", label: "Skills", icon: Code2 },
] as const;

const CAMPUS_APP_TILES = [
  {
    href: "/sports",
    label: "Sports",
    icon: Trophy,
    tileClass: "border-sky-400/35 bg-sky-500/15 text-sky-300",
  },
  {
    href: "/activities",
    label: "Activities",
    icon: Users,
    tileClass: "border-indigo-400/35 bg-indigo-500/15 text-indigo-300",
  },
  {
    href: "/parties",
    label: "Parties",
    icon: PartyPopper,
    tileClass: "border-fuchsia-400/35 bg-fuchsia-500/15 text-fuchsia-300",
  },
  {
    href: "/healthy-life",
    label: "Healthy",
    icon: HeartPulse,
    tileClass: "border-emerald-400/35 bg-emerald-500/15 text-emerald-300",
  },
  {
    href: "/workshops",
    label: "Workshops",
    icon: Briefcase,
    tileClass: "border-violet-400/35 bg-violet-500/15 text-violet-300",
  },
  {
    href: "/memories",
    label: "Photos",
    icon: Images,
    tileClass: "border-amber-400/35 bg-amber-500/15 text-amber-300",
  },
];

const CORE_SHEET_LINKS = [
  { href: "/about", label: "About Me", icon: User },
  { href: "/journey", label: "3D Timeline", icon: Compass },
  { href: "/skills-projects", label: "IT Projects", icon: Code2 },
  { href: "/contact", label: "Contact Me", icon: Mail },
];

export default function MobileAppNav({
  sheetOpen,
  onToggleSheet,
  onCloseSheet,
}: MobileAppNavProps) {
  const pathname = usePathname();
  const isTabRoute = BOTTOM_TABS.some((t) => t.href === pathname);
  const isMoreActive = sheetOpen || !isTabRoute;

  return (
    <>
      {/* NATIVE MOBILE APP BOTTOM SHEET DRAWER */}
      <AnimatePresence>
        {sheetOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Scrim Backdrop */}
            <motion.button
              type="button"
              aria-label="Close mobile menu overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onCloseSheet}
              className="absolute inset-0 bg-[#02040d]/75 backdrop-blur-sm"
            />

            {/* Slide-up Frosted App Sheet */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Mobile Navigation Chapters"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 330, damping: 32 }}
              className="absolute inset-x-0 bottom-0 max-h-[84vh] overflow-y-auto rounded-t-[28px] border-t border-white/15 bg-[#070b1e]/96 px-4 pt-3 pb-7 shadow-[0_-22px_60px_rgba(0,0,0,0.85)] backdrop-blur-2xl"
            >
              {/* Drag Notch */}
              <div className="mx-auto mb-3.5 h-1 w-12 rounded-full bg-white/25" />

              {/* Sheet Profile & PNC Header */}
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="rounded-xl border border-white/10 bg-[#050816] px-2 py-1 shrink-0">
                    <Image
                      src="/images/logo/logo.png"
                      alt="PNC Logo"
                      width={172}
                      height={73}
                      unoptimized
                      className="h-7 w-auto object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-[family-name:var(--font-display)] text-sm font-bold text-white">
                      {SITE_CONFIG.studentName}
                    </p>
                    <p className="truncate font-mono text-[10px] tracking-wider text-sky-300">
                      {SITE_CONFIG.cohortLabel} • Cambodia
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onCloseSheet}
                  aria-label="Close navigation sheet"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/12 bg-white/[0.05] text-slate-300 transition active:scale-95 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Campus Life App Tiles (3x2 Icon Grid) */}
              <div className="mt-4">
                <p className="mb-2.5 px-1 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400">
                  Campus & Community Apps
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {CAMPUS_APP_TILES.map((tile) => {
                    const Icon = tile.icon;
                    const active = pathname === tile.href;
                    return (
                      <Link
                        key={tile.href}
                        href={tile.href}
                        onClick={onCloseSheet}
                        className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-3 text-center transition active:scale-95 ${
                          active
                            ? "border-sky-400/50 bg-sky-500/15 text-white shadow-[0_0_20px_rgba(56,189,248,0.2)]"
                            : "border-white/[0.08] bg-white/[0.03] text-slate-200 hover:border-white/20"
                        }`}
                      >
                        <span
                          className={`flex h-10 w-10 items-center justify-center rounded-xl border ${tile.tileClass}`}
                        >
                          <Icon className="h-[18px] w-[18px]" />
                        </span>
                        <span className="text-[11px] font-semibold">
                          {tile.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Core Story & Profile Links */}
              <div className="mt-4">
                <p className="mb-2.5 px-1 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400">
                  Story & Engineering
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {CORE_SHEET_LINKS.map((item) => {
                    const Icon = item.icon;
                    const active = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onCloseSheet}
                        className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-xs font-semibold transition active:scale-95 ${
                          active
                            ? "border-indigo-400/45 bg-indigo-500/20 text-white"
                            : "border-white/[0.08] bg-white/[0.03] text-slate-200"
                        }`}
                      >
                        <span className="flex items-center gap-2 truncate">
                          <Icon className="h-3.5 w-3.5 shrink-0 text-sky-300" />
                          <span className="truncate">{item.label}</span>
                        </span>
                        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Quick Social & Contact Strip */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-3.5">
                <div className="flex items-center gap-2">
                  <a
                    href={CONTACT_DATA.github.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="GitHub"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/12 bg-white/[0.04] text-white active:scale-95"
                  >
                    <GitHubIcon className="h-4 w-4" />
                  </a>
                  <a
                    href={CONTACT_DATA.linkedin.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#0A66C2]/35 bg-[#0A66C2]/15 active:scale-95"
                  >
                    <LinkedInIcon className="h-4 w-4" />
                  </a>
                  <a
                    href={
                      CONTACT_DATA.socials[0]?.url ||
                      "https://www.facebook.com/khorn.ream.9"
                    }
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Facebook"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#1877F2]/35 bg-[#1877F2]/15 active:scale-95"
                  >
                    <FacebookIcon className="h-4 w-4" />
                  </a>
                </div>

                <a
                  href={`mailto:${CONTACT_DATA.email}`}
                  className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-sky-400/30 bg-sky-500/15 px-3 font-mono text-[11px] font-medium text-sky-200 active:scale-95"
                >
                  <Mail className="h-3.5 w-3.5 text-sky-300" />
                  <span>Email Me</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FLOATING NATIVE MOBILE BOTTOM TAB DOCK */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="fixed inset-x-3 bottom-3 z-40 lg:hidden"
      >
        <div className="mx-auto grid max-w-md grid-cols-5 items-center gap-1 rounded-[24px] border border-white/15 bg-[#060a1c]/90 p-1.5 shadow-[0_14px_42px_rgba(0,0,0,0.82)] ring-1 ring-inset ring-white/[0.08] backdrop-blur-2xl">
          {BOTTOM_TABS.map((tab) => {
            const Icon = tab.icon;
            const active = pathname === tab.href && !sheetOpen;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                onClick={onCloseSheet}
                className={`relative flex flex-col items-center justify-center gap-1 rounded-2xl py-2 transition active:scale-95 ${
                  active ? "text-white" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="mobileBottomTabPill"
                    className="absolute inset-0 rounded-2xl border border-indigo-400/40 bg-gradient-to-b from-indigo-500/30 to-sky-500/20 shadow-[0_0_20px_rgba(56,189,248,0.2)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon
                  className={`relative z-10 h-[18px] w-[18px] ${
                    active ? "text-sky-300" : ""
                  }`}
                />
                <span className="relative z-10 text-[10px] font-semibold tracking-tight">
                  {tab.label}
                </span>
              </Link>
            );
          })}

          {/* 5th Tab: More / Chapters App Sheet */}
          <button
            type="button"
            onClick={onToggleSheet}
            aria-expanded={sheetOpen}
            className={`relative flex flex-col items-center justify-center gap-1 rounded-2xl py-2 transition active:scale-95 ${
              isMoreActive
                ? "text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {isMoreActive && (
              <motion.span
                layoutId="mobileBottomTabPill"
                className="absolute inset-0 rounded-2xl border border-indigo-400/40 bg-gradient-to-b from-indigo-500/30 to-sky-500/20 shadow-[0_0_20px_rgba(56,189,248,0.2)]"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <Grid2x2
              className={`relative z-10 h-[18px] w-[18px] ${
                isMoreActive ? "text-sky-300" : ""
              }`}
            />
            <span className="relative z-10 text-[10px] font-semibold tracking-tight">
              Chapters
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}
