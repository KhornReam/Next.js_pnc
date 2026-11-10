"use client";

import {
  FacebookIcon,
  GitHubIcon,
  LinkedInIcon,
  TelegramIcon,
} from "@/components/ui/BrandIcons";
import {
  FadeInSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/MotionPrimitives";
import PageHeader from "@/components/ui/PageHeader";
import { CONTACT_DATA, SITE_CONFIG } from "@/data/journeyData";
import {
  Check,
  Copy,
  ExternalLink,
  Mail,
  MessageSquare,
  Send,
  Share2,
} from "lucide-react";
import { type FormEvent, useState } from "react";

export default function ContactContent() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [messageText, setMessageText] = useState("");
  const [preparedNotice, setPreparedNotice] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_DATA.email);
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 2400);
    } catch {
      // Fallback ignored if clipboard blocked
    }
  };

  const handleComposeMailto = (e: FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      `Hello from ${senderName || "My PNC Journey Visitor"}`
    );
    const body = encodeURIComponent(
      `Name: ${senderName}\nEmail: ${senderEmail}\n\n${messageText}`
    );
    setPreparedNotice(true);
    window.location.href = `mailto:${CONTACT_DATA.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div>
      <PageHeader
        eyebrow="Chapter 09 • Contact"
        title="Connect With Me"
        description={CONTACT_DATA.subtext}
        icon={<Mail className="h-3.5 w-3.5 text-sky-400" />}
        accentGradient="from-sky-500/20 via-violet-500/15 to-transparent"
      />

      <div className="mx-auto max-w-6xl space-y-12 px-4 py-14 sm:px-6 lg:px-8">
        {/* Primary Contact Channels */}
        <StaggerContainer className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* GitHub */}
          <StaggerItem>
            <a
              href={CONTACT_DATA.github.url}
              target="_blank"
              rel="noreferrer"
              className="glass-panel glass-panel-hover group flex h-full flex-col justify-between rounded-2xl p-6"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/25 bg-white/[0.09] text-white shadow-[0_6px_18px_rgba(255,255,255,0.12)]">
                    <GitHubIcon className="h-6 w-6" />
                  </div>
                  <ExternalLink className="h-4 w-4 text-slate-400 transition group-hover:text-white" />
                </div>
                <h2 className="mt-4 font-[family-name:var(--font-display)] text-lg font-bold text-white">
                  GitHub
                </h2>
                <p className="mt-1 font-mono text-xs text-sky-300">
                  {CONTACT_DATA.github.handle}
                </p>
              </div>
              <p className="mt-4 text-xs text-slate-400">
                Code repositories & technical projects
              </p>
            </a>
          </StaggerItem>

          {/* LinkedIn */}
          <StaggerItem>
            <a
              href={CONTACT_DATA.linkedin.url}
              target="_blank"
              rel="noreferrer"
              className="glass-panel glass-panel-hover group flex h-full flex-col justify-between rounded-2xl p-6"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#0A66C2]/45 bg-[#0A66C2]/15 shadow-[0_6px_20px_rgba(10,102,194,0.28)]">
                    <LinkedInIcon className="h-6 w-6" />
                  </div>
                  <ExternalLink className="h-4 w-4 text-slate-400 transition group-hover:text-white" />
                </div>
                <h2 className="mt-4 font-[family-name:var(--font-display)] text-lg font-bold text-white">
                  LinkedIn
                </h2>
                <p className="mt-1 font-mono text-xs text-sky-300">
                  {CONTACT_DATA.linkedin.handle}
                </p>
              </div>
              <p className="mt-4 text-xs text-slate-400">
                Professional profile & Software Engineering path
              </p>
            </a>
          </StaggerItem>

          {/* Email */}
          <StaggerItem>
            <div className="glass-panel glass-panel-hover flex h-full flex-col justify-between rounded-2xl p-6">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-400/30 bg-violet-500/15 text-violet-300">
                    <Mail className="h-5 w-5" />
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.05] px-2.5 py-1 text-[11px] text-slate-200 transition hover:border-sky-400/50 hover:text-white"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <h2 className="mt-4 font-[family-name:var(--font-display)] text-lg font-bold text-white">
                  Email
                </h2>
                <p className="mt-1 break-all font-mono text-xs text-violet-200">
                  {CONTACT_DATA.email}
                </p>
              </div>
              <p className="mt-4 text-xs text-slate-400">
                Direct inquiries, internships & collaboration
              </p>
            </div>
          </StaggerItem>

          {/* Social Media */}
          <StaggerItem>
            <div className="glass-panel glass-panel-hover flex h-full flex-col justify-between rounded-2xl p-6">
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-400/30 bg-indigo-500/15 text-indigo-300">
                  <Share2 className="h-5 w-5" />
                </div>
                <h2 className="mt-4 font-[family-name:var(--font-display)] text-lg font-bold text-white">
                  Social Media
                </h2>
                <div className="mt-2.5 space-y-2">
                  {CONTACT_DATA.socials.map((social) => {
                    const isFacebook = social.name.toLowerCase().includes("facebook");
                    const isTelegram = social.name.toLowerCase().includes("telegram");
                    return (
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-slate-200 transition hover:border-sky-400/45 hover:bg-white/[0.06] hover:text-white"
                      >
                        <span className="inline-flex items-center gap-2 font-medium">
                          {isFacebook && <FacebookIcon className="h-4 w-4 shrink-0" />}
                          {isTelegram && <TelegramIcon className="h-4 w-4 shrink-0" />}
                          <span>{social.name}</span>
                        </span>
                        <span
                          className={`truncate font-mono text-[11px] ${
                            isFacebook
                              ? "text-[#60A5FA]"
                              : isTelegram
                                ? "text-[#38BDF8]"
                                : "text-sky-300"
                          }`}
                        >
                          {social.handle}
                        </span>
                      </a>
                    );
                  })}
                </div>
              </div>
              <p className="mt-4 text-xs text-slate-400">
                Community & friendly updates
              </p>
            </div>
          </StaggerItem>
        </StaggerContainer>

        {/* Pure Frontend Message Launcher + Closing Story Box */}
        <FadeInSection>
          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <form
              onSubmit={handleComposeMailto}
              className="glass-panel rounded-3xl p-6 sm:p-8"
            >
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-sky-300">
                <MessageSquare className="h-4 w-4" />
                <span>Quick Email Composer (Frontend Only)</span>
              </div>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold text-white">
                Send a Message via Your Email App
              </h2>
              <p className="mt-1.5 text-xs text-slate-400">
                No backend server required — clicking send opens your default email client pre-filled with your message.
              </p>

              <div className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="mb-1.5 block text-xs font-medium text-slate-300"
                    >
                      Your Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full rounded-xl border border-white/15 bg-slate-950/70 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="mb-1.5 block text-xs font-medium text-slate-300"
                    >
                      Your Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-white/15 bg-slate-950/70 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="mb-1.5 block text-xs font-medium text-slate-300"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    required
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Share a note, opportunity, or encouragement..."
                    className="w-full rounded-xl border border-white/15 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(99,102,241,0.35)] transition hover:opacity-95"
                  >
                    <Send className="h-4 w-4" />
                    <span>Open Email Client</span>
                  </button>

                  {preparedNotice && (
                    <span className="text-xs text-emerald-300">
                      Opening mail app — you can also copy my email above!
                    </span>
                  )}
                </div>
              </div>
            </form>

            <div className="glass-panel flex flex-col justify-between rounded-3xl p-6 sm:p-8">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-violet-300">
                  Thank You for Visiting
                </p>
                <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-bold text-white">
                  “{SITE_CONFIG.centralMessage}”
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-slate-300">
                  {SITE_CONFIG.closingNote}
                </p>
              </div>

              <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-xs leading-relaxed text-slate-300">
                <p className="font-semibold text-white">Customizable Profile Links</p>
                <p className="mt-1">
                  To update your real GitHub, LinkedIn, Email, and Social links, edit{" "}
                  <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-sky-300">
                    CONTACT_DATA
                  </code>{" "}
                  inside{" "}
                  <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-sky-300">
                    data/journeyData.ts
                  </code>
                  .
                </p>
              </div>
            </div>
          </div>
        </FadeInSection>
      </div>
    </div>
  );
}
