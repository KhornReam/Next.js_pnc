"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const ThreeGlobalBackdrop = dynamic(
  () => import("@/components/three/ThreeGlobalBackdrop"),
  { ssr: false },
);

export default function ThreeAmbientMount() {
  const pathname = usePathname();

  // Homepage ("/") runs ThreeHeroScene + ThreeHomeBackdrop; "/about" runs ThreeAboutBackdrop.
  // All remaining routes (/journey, /skills-projects, /sports, /activities, /parties, etc.)
  // share one persistent route-aware 3D WebGL backdrop cleanly without double-rendering.
  if (!pathname || pathname === "/" || pathname === "/about") {
    return null;
  }

  return <ThreeGlobalBackdrop routePath={pathname} />;
}
