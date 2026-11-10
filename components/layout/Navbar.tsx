"use client";

import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import {
  Activity,
  Briefcase,
  ChevronDown,
  Code2,
  Compass,
  HeartPulse,
  Home,
  Images,
  Mail,
  Menu,
  PartyPopper,
  Sparkles,
  Trophy,
  User,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const CAMPUS_LIFE_LINKS = [
  { href: "/sports", label: "Sports", description: "Football, teamwork & competitions", icon: Trophy },
  { href: "/activities", label: "Activities", description: "School events, volunteering & trips", icon: Users },
  { href: "/parties", label: "Parties & Celebrations", description: "Birthdays, class parties & milestones", icon: PartyPopper },
  { href: "/healthy-life", label: "Healthy Life", description: "Well-being, habits & school wellness", icon: HeartPulse },
  { href: "/workshops", label: "Workshops & Training", description: "Tech training, soft skills & visits", icon: Briefcase },
  { href: "/memories", label: "Memory Gallery", description: "All photos, videos & categories", icon: Images },
];

const ALL_MOBILE_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/about", label: "About Me", icon: User },
  { href: "/journey", label: "My Journey", icon: Compass },
  { href: "/sports", label: "Sports", icon: Trophy },
  { href: "/activities", label: "Activities", icon: Activity },
  { href: "/parties", label: "Parties & Celebrations", icon: PartyPopper },
  { href: "/healthy-life", label: "Healthy Life", icon: HeartPulse },
  { href: "/workshops", label: "Workshops & Training", icon: Briefcase },
  { href: "/skills-projects", label: "IT Skills & Projects", icon: Code2 },
  { href: "/memories", label: "Photo & Memory Gallery", icon: Images },
  { href: "/contact", label: "Contact", icon: Mail },
];

export default function Navbar() {
  const pathname = usePathname();
  const [openMobilePath, setOpenMobilePath] = useState<string | null>(null);
  const [openCampusPath, setOpenCampusPath] = useState<string | null>(null);
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
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
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

  const isCampusActive = CAMPUS_LIFE_LINKS.some((item) => pathname === item.href);

  const primaryLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Me" },
    { href: "/journey", label: "My Journey" },
  ];

  const trailingLinks = [
    { href: "/skills-projects", label: "IT Skills & Projects" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <motion.div
        style={{ scaleX }}
        aria-hidden="true"
        className="h-[2px] w-full origin-left bg-gradient-to-r from-sky-400 via-violet-500 to-indigo-400"
      />

      <div className="mx-auto max-w-7xl px-3 pt-3 sm:px-6 lg:px-8">
        <nav
          aria-label="Primary Navigation"
          className={`flex items-center justify-between rounded-2xl border px-4 py-2.5 transition-all duration-300 sm:px-5 ${
            scrolled
              ? "border-white/15 bg-[#060919]/85 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl"
              : "border-white/[0.08] bg-[#060919]/55 backdrop-blur-md"
          }`}
        >
          {/* Brand */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 focus:outline-none"
          >
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-400/35 bg-gradient-to-br from-indigo-500/30 via-violet-500/25 to-sky-500/25 text-sky-300 shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-transform duration-300 group-hover:scale-105">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="leading-tight">
              <span className="block font-[family-name:var(--font-display)] text-sm font-bold tracking-wider text-white sm:text-base">
                MY PNC JOURNEY
              </span>
              <span className="hidden font-mono text-[10px] tracking-widest text-indigo-300/80 sm:block">
                2 YEARS • CAMBODIA
              </span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-1 lg:flex">
            {primaryLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative rounded-xl px-3.5 py-2 text-sm font-medium transition ${
                    active ? "text-white" : "text-slate-300 hover:text-white"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="navActivePill"
                      className="absolute inset-0 rounded-xl border border-indigo-400/35 bg-indigo-500/20"
                      transition={{ type: "spring", stiffness: 360, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}

            {/* Campus Life Dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                onClick={() =>
                  setOpenCampusPath((prev) => (prev === pathname ? null : pathname))
                }
                aria-expanded={campusOpen}
                className={`relative inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium transition ${
                  isCampusActive || campusOpen
                    ? "text-white"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {isCampusActive && (
                  <motion.span
                    layoutId="navActivePill"
                    className="absolute inset-0 rounded-xl border border-indigo-400/35 bg-indigo-500/20"
                    transition={{ type: "spring", stiffness: 360, damping: 30 }}
                  />
                )}
                <span className="relative z-10">Campus & Life</span>
                <ChevronDown
                  className={`relative z-10 h-3.5 w-3.5 transition-transform duration-200 ${
                    campusOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {campusOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.18 }}
                    className="glass-panel absolute left-1/2 top-full mt-3 w-[340px] -translate-x-1/2 rounded-2xl p-2"
                  >
                    {CAMPUS_LIFE_LINKS.map((item) => {
                      const Icon = item.icon;
                      const active = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setOpenCampusPath(null)}
                          className={`flex items-start gap-3 rounded-xl px-3.5 py-2.5 transition ${
                            active
                              ? "bg-indigo-500/20 text-white"
                              : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
                          }`}
                        >
                          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-sky-300">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold leading-snug">
                              {item.label}
                            </div>
                            <div className="text-xs text-slate-400">
                              {item.description}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {trailingLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative rounded-xl px-3.5 py-2 text-sm font-medium transition ${
                    active ? "text-white" : "text-slate-300 hover:text-white"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="navActivePill"
                      className="absolute inset-0 rounded-xl border border-indigo-400/35 bg-indigo-500/20"
                      transition={{ type: "spring", stiffness: 360, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() =>
              setOpenMobilePath((prev) => (prev === pathname ? null : pathname))
            }
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-slate-200 transition hover:border-indigo-400/40 hover:text-white lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22 }}
              className="glass-panel mt-2 max-h-[80vh] overflow-y-auto rounded-2xl p-3 lg:hidden"
            >
              <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                {ALL_MOBILE_LINKS.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpenMobilePath(null)}
                      className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition ${
                        active
                          ? "border border-indigo-400/35 bg-indigo-500/20 text-white"
                          : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
                      }`}
                    >
                      <Icon className="h-4 w-4 text-sky-300" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
