import ActivitiesContent from "@/components/chapters/ActivitiesContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Activities",
  description:
    "School events, community volunteering, educational trips, and team activities during my two years at PNC.",
};

export default function ActivitiesPage() {
  return <ActivitiesContent />;
}
