import AmbientBackdrop from "@/components/layout/AmbientBackdrop";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#030614",
};

export const metadata: Metadata = {
  title: {
    default: "Khorn Ream — My PNC Journey | Two Years of Learning & Software Engineering",
    template: "%s | Khorn Ream — My PNC Journey",
  },
  description:
    "An interactive 3D digital storytelling experience by Khorn Ream (Ream) from Kampong Thom Province, documenting two years of IT education, Full-Stack Web Development, and growth in Generation 2026 at Passerelles Numériques Cambodia (PNC).",
  keywords: [
    "Khorn Ream",
    "My PNC Journey",
    "Passerelles Numériques Cambodia",
    "PNC Generation 2026",
    "Full-Stack Web Development",
    "Software Engineer Cambodia",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="dark"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body
        suppressHydrationWarning
        className="relative min-h-screen antialiased selection:bg-violet-500/35 selection:text-white"
      >
        <AmbientBackdrop />
        <Navbar />
        <main className="relative z-10 min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
