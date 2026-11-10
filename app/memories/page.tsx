import MemoriesArchiveContent from "@/components/chapters/MemoriesArchiveContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Memory Gallery",
  description:
    "Photo and memory gallery covering Year 1, Year 2, Sports, Activities, Parties, Workshops, Classmates, and Special School Events at PNC.",
};

export default function MemoriesPage() {
  return <MemoriesArchiveContent />;
}
