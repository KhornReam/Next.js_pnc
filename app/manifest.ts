import type { MetadataRoute } from "next";


export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Khorn Ream — My PNC Journey",
    short_name: "PNC Journey",
    description: "An interactive story of learning, memories, and growth at PNC.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#030614",
    theme_color: "#030614",
    icons: [
      { src: "/pwa-icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any maskable" },
      { src: "/images/logo/logo.png", sizes: "any", type: "image/png", purpose: "any" },
    ],
  };
}
