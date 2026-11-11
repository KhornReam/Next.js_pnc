"use client";

import MobileAppNav from "@/components/layout/MobileAppNav";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import {
  Briefcase,
  ChevronDown,
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
import { useEffect, useRef, useState } from "react";

const CAMPUS_LIFE_LINKS = [
  {
    href: "/sports",
    label: "Sports",
    description: "Football, teamwork & competitions",
    icon: Trophy,
    badgeClass: "border-sky-400/30 bg-sky-500/15 text-sky-300",
  },
  {
    href: "/activities",
    label: "Activities",
    description: "School events, volunteering & trips",
    icon: Users,
    badgeClass: "border-indigo-400/30 bg-indigo-500/15 text-indigo-300",
  },
  {
    href: "/parties",
    label: "Parties & Celebrations",
    description: "Birthdays, class parties & milestones",
    icon: PartyPopper,
    badgeClass: "border-fuchsia-400/30 bg-fuchsia-500/15 text-fuchsia-300",
  },
  {
    href: "/healthy-life",
    label: "Healthy Life",
    description: "Well-being, habits & school wellness",
    icon: HeartPulse,
    badgeClass: "border-emerald-400/30 bg-emerald-500/15 text-emerald-300",
  },
  {
    href: "/workshops",
    label: "Workshops & Training",
    description: "Tech training, soft skills & visits",
    icon: Briefcase,
    badgeClass: "border-violet-400/30 bg-violet-500/15 text-violet-300",
  },
  {
    href: "/memories",
    label: "Memory Gallery",
    description: "All photos & curated categories",
    icon: Images,
    badgeClass: "border-amber-400/30 bg-amber-500/15 text-amber-300",
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [openMobilePath, setOpenMobilePath] = useState<string | null>(null);
  const [openCampusPath, setOpenCampusPath] = useState<string | null>(null);
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const mobileOpen = openMobilePath === pathname;
  const campusOpen = openCampusPath === pathname;

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 26,
    restDelta: 0.001,
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpenCampusPath(null);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenCampusPath(null);
        setOpenMobilePath(null);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const isCampusActive = CAMPUS_LIFE_LINKS.some(
    (item) => pathname === item.href && item.href !== "/memories"
  );
  const isGalleryActive = pathname === "/memories";

  const primaryLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/about", label: "About Me", icon: User },
    { href: "/journey", label: "My Journey", icon: Compass },
  ];

  const trailingLinks = [
    { href: "/skills-projects", label: "IT Skills & Projects", icon: Code2 },
    { href: "/contact", label: "Contact", icon: Mail },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-gradient-to-b from-[#030614] via-[#030614]/88 to-transparent pb-2">
      <motion.div
        style={{ scaleX }}
        aria-hidden="true"
        className="h-[2px] w-full origin-left bg-gradient-to-r from-sky-400 via-violet-500 to-indigo-400"
      />

      <div className="mx-auto max-w-7xl px-3 pt-2.5 sm:px-6 lg:px-8">
        <nav
          aria-label="Primary Navigation"
          className={`relative flex items-center justify-between gap-3 rounded-2xl border px-3.5 py-2 transition-all duration-300 sm:px-5 ${
            scrolled
              ? "border-white/15 bg-[#050817]/92 shadow-[0_14px_45px_rgba(0,0,0,0.75)] backdrop-blur-2xl"
              : "border-white/[0.1] bg-[#060919]/75 shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-xl"
          }`}
        >
          {/* Subtle top luminous rim highlight */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/45 to-transparent"
          />

          {/* Official PNC Brand Lockup integrated directly into navbar surface */}
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-2.5 rounded-xl px-1 py-1 transition duration-300 focus:outline-none sm:gap-3"
          >
            <Image
              src="/images/logo/logo.png"
              alt="Passerelles Numériques Cambodia Logo"
              width={172}
              height={73}
              priority
              unoptimized
              className="h-8 w-auto shrink-0 object-contain drop-shadow-[0_2px_10px_rgba(56,189,248,0.18)] transition-transform duration-300 group-hover:scale-[1.03] sm:h-9"
            />
            <span
              aria-hidden="true"
              className="hidden h-7 w-px bg-gradient-to-b from-transparent via-white/25 to-transparent sm:block"
            />
            <div className="leading-tight">
              <span className="block font-[family-name:var(--font-display)] text-xs font-bold tracking-wider text-white transition group-hover:text-sky-200 sm:text-sm">
                MY PNC JOURNEY
              </span>
              <span className="hidden font-mono text-[9px] tracking-[0.18em] text-indigo-300/85 sm:block">
                2 YEARS • CAMBODIA
              </span>
            </div>
          </Link>

          {/* Segmented Center Glass Pill Navigation */}
          <div
            onMouseLeave={() => setHoveredHref(null)}
            className="hidden items-center gap-0.5 rounded-xl border border-white/[0.08] bg-white/[0.025] p-1 lg:flex"
          >
            {primaryLinks.map((link) => {
              const active = pathname === link.href;
              const isHovered = hoveredHref === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onMouseEnter={() => setHoveredHref(link.href)}
                  className={`relative inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition xl:px-3 xl:text-sm ${
                    active ? "text-white" : "text-slate-300 hover:text-white"
                  }`}
                >
                  {isHovered && !active && (
                    <motion.span
                      layoutId="navHoverPill"
                      className="absolute inset-0 rounded-lg border border-white/10 bg-white/[0.06]"
                      transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 32,
                      }}
                    />
                  )}
                  {active && (
                    <motion.span
                      layoutId="navActivePill"
                      className="absolute inset-0 rounded-lg border border-indigo-400/40 bg-gradient-to-r from-indigo-500/25 via-violet-500/20 to-sky-500/20 shadow-[0_0_20px_rgba(99,102,241,0.22)]"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  <Icon
                    className={`relative z-10 hidden h-3.5 w-3.5 xl:inline-block ${
                      active ? "text-sky-300" : "text-slate-400"
                    }`}
                  />
                  <span className="relative z-10 whitespace-nowrap">
                    {link.label}
                  </span>
                  {active && (
                    <motion.span
                      layoutId="navActiveBar"
                      className="absolute inset-x-3 bottom-0.5 z-10 h-[2px] rounded-full bg-gradient-to-r from-sky-400 via-indigo-400 to-violet-400"
                    />
                  )}
                </Link>
              );
            })}

            {/* Interactive Campus & Life Mega Popover */}
            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                onMouseEnter={() => setHoveredHref("campus")}
                onClick={() =>
                  setOpenCampusPath((prev) =>
                    prev === pathname ? null : pathname
                  )
                }
                aria-expanded={campusOpen}
                className={`relative inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition xl:px-3 xl:text-sm ${
                  isCampusActive || campusOpen
                    ? "text-white"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {hoveredHref === "campus" && !isCampusActive && (
                  <motion.span
                    layoutId="navHoverPill"
                    className="absolute inset-0 rounded-lg border border-white/10 bg-white/[0.06]"
                    transition={{
                      type: "spring",
                      stiffness: 420,
                      damping: 32,
                    }}
                  />
                )}
                {isCampusActive && (
                  <motion.span
                    layoutId="navActivePill"
                    className="absolute inset-0 rounded-lg border border-indigo-400/40 bg-gradient-to-r from-indigo-500/25 via-violet-500/20 to-sky-500/20 shadow-[0_0_20px_rgba(99,102,241,0.22)]"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
                <Users
                  className={`relative z-10 hidden h-3.5 w-3.5 xl:inline-block ${
                    isCampusActive || campusOpen
                      ? "text-sky-300"
                      : "text-slate-400"
                  }`}
                />
                <span className="relative z-10 whitespace-nowrap">
                  Campus & Life
                </span>
                <ChevronDown
                  className={`relative z-10 h-3.5 w-3.5 transition-transform duration-200 ${
                    campusOpen ? "rotate-180 text-sky-300" : "text-slate-400"
                  }`}
                />
                {isCampusActive && (
                  <motion.span
                    layoutId="navActiveBar"
                    className="absolute inset-x-3 bottom-0.5 z-10 h-[2px] rounded-full bg-gradient-to-r from-sky-400 via-indigo-400 to-violet-400"
                  />
                )}
              </button>

              <AnimatePresence>
                {campusOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="glass-panel absolute left-1/2 top-full mt-3.5 w-[470px] -translate-x-1/2 rounded-2xl p-3"
                  >
                    <div className="mb-2 flex items-center justify-between border-b border-white/10 px-2 pb-2">
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-indigo-300">
                        Campus & Community Chapters
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">
                        PNC Generation 2026
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {CAMPUS_LIFE_LINKS.map((item) => {
                        const Icon = item.icon;
                        const active = pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpenCampusPath(null)}
                            className={`group flex items-start gap-2.5 rounded-xl border px-3 py-2.5 transition ${
                              active
                                ? "border-indigo-400/35 bg-indigo-500/20 text-white"
                                : "border-transparent text-slate-300 hover:border-white/10 hover:bg-white/[0.06] hover:text-white"
                            }`}
                          >
                            <div
                              className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-transform duration-200 group-hover:scale-105 ${item.badgeClass}`}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="truncate text-xs font-semibold leading-snug text-white">
                                {item.label}
                              </div>
                              <div className="mt-0.5 line-clamp-1 text-[11px] text-slate-400">
                                {item.description}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {trailingLinks.map((link) => {
              const active = pathname === link.href;
              const isHovered = hoveredHref === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onMouseEnter={() => setHoveredHref(link.href)}
                  className={`relative inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition xl:px-3 xl:text-sm ${
                    active ? "text-white" : "text-slate-300 hover:text-white"
                  }`}
                >
                  {isHovered && !active && (
                    <motion.span
                      layoutId="navHoverPill"
                      className="absolute inset-0 rounded-lg border border-white/10 bg-white/[0.06]"
                      transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 32,
                      }}
                    />
                  )}
                  {active && (
                    <motion.span
                      layoutId="navActivePill"
                      className="absolute inset-0 rounded-lg border border-indigo-400/40 bg-gradient-to-r from-indigo-500/25 via-violet-500/20 to-sky-500/20 shadow-[0_0_20px_rgba(99,102,241,0.22)]"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  <Icon
                    className={`relative z-10 hidden h-3.5 w-3.5 xl:inline-block ${
                      active ? "text-sky-300" : "text-slate-400"
                    }`}
                  />
                  <span className="relative z-10 whitespace-nowrap">
                    {link.label}
                  </span>
                  {active && (
                    <motion.span
                      layoutId="navActiveBar"
                      className="absolute inset-x-3 bottom-0.5 z-10 h-[2px] rounded-full bg-gradient-to-r from-sky-400 via-indigo-400 to-violet-400"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Quick Action: Memories Gallery Pill */}
          <div className="hidden shrink-0 items-center lg:flex">
            <Link
              href="/memories"
              className={`group inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition duration-300 ${
                isGalleryActive
                  ? "border-sky-400/50 bg-sky-500/20 text-white shadow-[0_0_22px_rgba(56,189,248,0.28)]"
                  : "border-indigo-400/30 bg-gradient-to-r from-indigo-500/20 via-violet-500/15 to-sky-500/20 text-sky-100 hover:border-sky-400/55 hover:shadow-[0_0_22px_rgba(56,189,248,0.25)]"
              }`}
            >
              <Images className="h-3.5 w-3.5 text-sky-300 transition-transform duration-200 group-hover:scale-110" />
              <span>Memories</span>
            </Link>
          </div>

          {/* Mobile Top App Controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/about"
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-white/12 bg-white/[0.04] px-2.5 text-xs font-medium text-slate-200 transition active:scale-95 hover:border-sky-400/40 hover:text-white"
            >
              <User className="h-3.5 w-3.5 text-sky-300" />
              <span className="hidden sm:inline">Ream</span>
            </Link>
            <button
              type="button"
              onClick={() =>
                setOpenMobilePath((prev) =>
                  prev === pathname ? null : pathname
                )
              }
              aria-label={
                mobileOpen ? "Close app chapters sheet" : "Open app chapters sheet"
              }
              aria-expanded={mobileOpen}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-indigo-400/30 bg-indigo-500/15 px-3 text-xs font-semibold text-white transition active:scale-95 hover:border-sky-400/50"
            >
              {mobileOpen ? (
                <X className="h-4 w-4 text-sky-300" />
              ) : (
                <Grid2x2 className="h-4 w-4 text-sky-300" />
              )}
              <span>Menu</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Native Mobile Bottom Dock + Slide-Up App Chapters Sheet */}
      <MobileAppNav
        sheetOpen={mobileOpen}
        onToggleSheet={() =>
          setOpenMobilePath((prev) => (prev === pathname ? null : pathname))
        }
        onCloseSheet={() => setOpenMobilePath(null)}
      />
    </header>
  );
}
