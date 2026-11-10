import SkillsProjectsContent from "@/components/skills/SkillsProjectsContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IT Skills & Projects",
  description:
    "Programming languages, frontend and backend development, database knowledge, personal and team projects, and two-year development progress.",
};

export default function SkillsProjectsPage() {
  return <SkillsProjectsContent />;
}
