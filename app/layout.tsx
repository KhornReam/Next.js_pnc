import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "My PNC Journey | Two Years of Learning, Growing & Becoming a Software Engineer",
    template: "%s | My PNC Journey",
  },
  description:
    "An interactive 3D digital storytelling experience documenting my two-year IT education, friendships, campus life, and personal growth at Passerelles Numériques Cambodia (PNC).",
  keywords: [
    "My PNC Journey",
    "Passerelles Numériques Cambodia",
    "PNC",
    "Software Engineer",
    "IT Student Cambodia",
    "Interactive 3D Portfolio",
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
        className="min-h-screen antialiased selection:bg-violet-500/35 selection:text-white"
      >
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
