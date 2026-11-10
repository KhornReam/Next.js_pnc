import WorkshopsContent from "@/components/chapters/WorkshopsContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workshops & Training",
  description:
    "IT workshops, programming training, soft skills, leadership, career preparation, company visits, and guest speaker sessions.",
};

export default function WorkshopsPage() {
  return <WorkshopsContent />;
}
