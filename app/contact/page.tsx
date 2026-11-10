import ContactContent from "@/components/contact/ContactContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Connect via GitHub, LinkedIn, Email, and Social Media — My PNC Journey.",
};

export default function ContactPage() {
  return <ContactContent />;
}
