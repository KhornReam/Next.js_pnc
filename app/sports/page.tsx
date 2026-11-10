import SportsContent from "@/components/chapters/SportsContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sports",
  description:
    "Football matches, teamwork, sports competitions, and memorable moments with classmates at PNC.",
};

export default function SportsPage() {
  return <SportsContent />;
}
