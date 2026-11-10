import PartiesContent from "@/components/chapters/PartiesContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Parties & Celebrations",
  description:
    "Birthday surprises, class parties, graduation celebrations, and funny unforgettable moments at PNC.",
};

export default function PartiesPage() {
  return <PartiesContent />;
}
