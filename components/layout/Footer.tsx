import {
  FacebookIcon,
  GitHubIcon,
  LinkedInIcon,
} from "@/components/ui/BrandIcons";
import { CONTACT_DATA, SITE_CONFIG } from "@/data/journeyData";
import { ChevronRight, Compass, Heart, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const STORY_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Me" },
  { href: "/journey", label: "My Journey" },
  { href: "/skills-projects", label: "IT Skills & Projects" },
];

const CAMPUS_LINKS = [
  { href: "/sports", label: "Sports" },
  { href: "/activities", label: "Activities" },
  { href: "/parties", label: "Parties & Celebrations" },
  { href: "/healthy-life", label: "Healthy Life" },
  { href: "/workshops", label: "Workshops & Training" },
];

const ARCHIVE_LINKS = [
  { href: "/memories", label: "Photo & Memory Gallery" },
  { href: "/contact", label: "Contact & Socials" },
];

export default function Footer() {
  return (
    <footer className="relative z-10 mt-16 border-t border-white/[0.08] bg-[#030510]/88 backdrop-blur-xl sm:mt-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent"
      />

      <div className="mx-auto max-w-7xl px-4 pt-12 pb-28 sm:px-6 sm:pt-14 lg:px-8 lg:py-16">
        <div className="grid gap-5 lg:grid-cols-[1.65fr_0.85fr_0.95fr_1fr] lg:gap-10 xl:gap-12">
          {/* Official Logo & Brand Lockup */}
          <div className="space-y-5 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 sm:p-5 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0">
            <Link
              href="/"
              className="group inline-flex w-full flex-wrap items-center justify-center gap-3.5 rounded-2xl border border-white/12 bg-[#070b1c]/95 px-3.5 py-3 shadow-[0_10px_32px_rgba(0,0,0,0.45)] ring-1 ring-inset ring-white/5 transition hover:border-sky-400/35 sm:w-auto sm:flex-nowrap sm:justify-start xl:gap-4 xl:px-4"
            >
              <Image
                src="/images/logo/logo.png"
                alt="Passerelles Numériques Cambodia Logo"
                width={172}
                height={73}
                unoptimized
                className="h-11 w-auto shrink-0 object-contain transition-transform duration-300 group-hover:scale-[1.03] sm:h-12 xl:h-14"
              />

              <span
                aria-hidden="true"
                className="hidden h-9 w-px shrink-0 bg-gradient-to-b from-transparent via-white/20 to-transparent sm:block xl:h-10"
              />

              <div className="min-w-0 text-center leading-tight sm:text-left">
                <span className="block whitespace-nowrap font-[family-name:var(--font-display)] text-sm font-bold tracking-wider text-white xl:text-base">
                  {SITE_CONFIG.brandTitle}
                </span>
                <span className="mt-1 block whitespace-nowrap font-mono text-[10px] tracking-[0.2em] text-indigo-300/85">
                  2 YEARS • CAMBODIA
                </span>
              </div>
            </Link>

            <div className="space-y-2 pt-0.5 text-center sm:text-left">
              <p className="font-[family-name:var(--font-display)] text-sm font-medium text-gradient-accent">
                “{SITE_CONFIG.centralMessage}”
              </p>
              <p className="mx-auto max-w-md text-xs leading-relaxed text-slate-400 sm:mx-0 sm:text-sm">
                {SITE_CONFIG.closingNote}
              </p>
            </div>

            {/* Compact Verified Social Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1 sm:justify-start">
              <a
                href={CONTACT_DATA.github.url}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub profile"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/12 bg-white/[0.04] text-white transition active:scale-95 hover:border-white/30 hover:bg-white/[0.1]"
              >
                <GitHubIcon className="h-4 w-4" />
              </a>
              <a
                href={CONTACT_DATA.linkedin.url}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn profile"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#0A66C2]/35 bg-[#0A66C2]/15 transition active:scale-95 hover:border-[#0A66C2]/65 hover:bg-[#0A66C2]/25"
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
                aria-label="Facebook profile"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#1877F2]/35 bg-[#1877F2]/15 transition active:scale-95 hover:border-[#1877F2]/65 hover:bg-[#1877F2]/25"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
              <a
                href={`mailto:${CONTACT_DATA.email}`}
                aria-label="Email Khorn Ream"
                className="inline-flex h-9 items-center gap-2 rounded-xl border border-white/12 bg-white/[0.04] px-3 text-xs text-slate-300 transition active:scale-95 hover:border-sky-400/40 hover:text-white"
              >
                <Mail className="h-3.5 w-3.5 text-sky-400" />
                <span className="font-mono text-[11px]">
                  {CONTACT_DATA.email}
                </span>
              </a>
            </div>
          </div>

          {/* Story links: Mobile App 2-col tile grid / Desktop list */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:pt-1">
            <h3 className="font-mono text-[11px] uppercase tracking-widest text-slate-400 lg:text-xs">
              The Story
            </h3>
            <ul className="mt-3 grid grid-cols-2 gap-2 text-xs sm:text-sm lg:mt-4 lg:block lg:space-y-2.5">
              {STORY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center justify-between gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 font-medium text-slate-200 transition active:scale-[0.98] hover:border-sky-400/35 hover:text-sky-300 lg:inline-flex lg:border-0 lg:bg-transparent lg:p-0 lg:font-normal lg:text-slate-300"
                  >
                    <span className="truncate">{link.label}</span>
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-500 lg:hidden" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Campus links: Mobile wrapped app pills / Desktop list */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:pt-1">
            <h3 className="font-mono text-[11px] uppercase tracking-widest text-slate-400 lg:text-xs">
              Campus Life
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2 text-xs sm:text-sm lg:mt-4 lg:block lg:space-y-2.5">
              {CAMPUS_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 font-medium text-slate-200 transition active:scale-[0.98] hover:border-violet-400/35 hover:text-violet-300 lg:border-0 lg:bg-transparent lg:p-0 lg:font-normal lg:text-slate-300"
                  >
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Archive & Connect */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:pt-1">
            <h3 className="font-mono text-[11px] uppercase tracking-widest text-slate-400 lg:text-xs">
              Memories & Connect
            </h3>
            <ul className="mt-3 grid grid-cols-1 gap-2 text-xs sm:grid-cols-2 sm:text-sm lg:mt-4 lg:block lg:space-y-2.5">
              {ARCHIVE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center justify-between gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 font-medium text-slate-200 transition active:scale-[0.98] hover:border-sky-400/35 hover:text-sky-300 lg:inline-flex lg:border-0 lg:bg-transparent lg:p-0 lg:font-normal lg:text-slate-300"
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-500 lg:hidden" />
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              href="/journey"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-400/30 bg-gradient-to-r from-indigo-500/20 via-violet-500/15 to-sky-500/20 px-4 py-2.5 text-xs font-semibold text-white transition active:scale-[0.98] hover:border-indigo-400/55 hover:bg-indigo-500/25 lg:mt-6 lg:w-auto lg:justify-start lg:border-white/12 lg:bg-white/[0.04] lg:bg-none lg:font-medium lg:text-slate-200"
            >
              <Compass className="h-3.5 w-3.5 text-sky-400" />
              <span>Open 3D Timeline</span>
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/[0.08] pt-6 text-center text-xs text-slate-500 sm:mt-12 sm:flex-row sm:items-center sm:text-left">
          <p>
            © 2026 {SITE_CONFIG.studentName} ({SITE_CONFIG.cohortLabel}) •
            Kampong Thom to Software Engineer.
          </p>
          <p className="inline-flex items-center gap-1.5 text-slate-400">
            <span>Crafted with</span>
            <Heart className="h-3.5 w-3.5 text-rose-400" />
            <span>for the PNC Community in Cambodia</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
