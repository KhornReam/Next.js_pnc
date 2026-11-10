import HealthyLifeContent from "@/components/chapters/HealthyLifeContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Healthy Life",
  description:
    "Health awareness, physical and mental well-being, healthy habits, and PNC student wellness support.",
};

export default function HealthyLifePage() {
  return <HealthyLifeContent />;
}
