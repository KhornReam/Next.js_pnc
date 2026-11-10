import { SITE_CONFIG } from "@/data/journeyData";
import { Compass, Heart, Sparkles } from "lucide-react";
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
    <footer className="relative mt-24 border-t border-white/[0.08] bg-[#030510]/85">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/45 to-transparent"
      />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_0.9fr]">
          {/* Central Message */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/25 bg-indigo-500/10 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-indigo-200">
              <Sparkles className="h-3.5 w-3.5 text-sky-400" />
              <span>Passerelles Numériques Cambodia</span>
            </div>

            <h2 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-bold text-white">
              {SITE_CONFIG.brandTitle}
            </h2>
            <p className="mt-2 font-[family-name:var(--font-display)] text-sm font-medium text-gradient-accent">
              “{SITE_CONFIG.centralMessage}”
            </p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-400">
              {SITE_CONFIG.closingNote}
            </p>
          </div>

          {/* Story links */}
          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-slate-400">
              The Story
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {STORY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-300 transition hover:text-sky-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Campus links */}
          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-slate-400">
              Campus Life
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {CAMPUS_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-300 transition hover:text-violet-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Archive & Connect */}
          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-slate-400">
              Memories & Connect
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {ARCHIVE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-300 transition hover:text-sky-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              href="/journey"
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-medium text-slate-200 transition hover:border-indigo-400/40 hover:bg-indigo-500/15"
            >
              <Compass className="h-3.5 w-3.5 text-sky-400" />
              <span>Open 3D Timeline</span>
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/[0.07] pt-6 text-xs text-slate-500 sm:flex-row sm:items-center">
          <p>
            My PNC Journey • Two Years of Learning, Growing & Becoming a Software Engineer.
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
