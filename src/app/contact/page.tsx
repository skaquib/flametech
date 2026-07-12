import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Us — Request a Burner Quote or Service Call",
  description: "Contact FlameTech Engineering for industrial gas & oil burner quotes, spare parts orders, or AMC service scheduling. Call +91 98695 88728, WhatsApp us, or email info@flametechengineering.com. Mumbai-based, pan-India service.",
  keywords: [
    "contact FlameTech Engineering",
    "industrial burner supplier contact Mumbai",
    "B2B burner quote request",
    "burner breakdown service contact",
  ],
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact FlameTech Engineering | Burner Quotes & Service",
    description: "Reach our industrial burner sales and technical support team by phone, WhatsApp, or email.",
    url: "/contact",
    type: "website",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
