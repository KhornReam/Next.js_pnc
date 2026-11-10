import AboutContent from "@/components/about/AboutContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Me",
  description:
    "My background, hometown in Cambodia, personality, core values, why I chose IT, why I joined PNC, and my ambition to become a Software Engineer.",
};

export default function AboutPage() {
  return <AboutContent />;
}
