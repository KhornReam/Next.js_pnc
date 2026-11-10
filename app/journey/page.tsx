import JourneyExperience from "@/components/journey/JourneyExperience";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "My Journey",
  description:
    "Explore Year 1 – The Beginning, Year 2 – Growing and Developing, and My Future – Becoming a Software Engineer through an interactive 3D timeline.",
};

export default function JourneyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-sm font-mono text-indigo-300">
          Loading 3D Timeline...
        </div>
      }
    >
      <JourneyExperience />
    </Suspense>
  );
}
