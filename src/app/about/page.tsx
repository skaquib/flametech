import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About Us — Industrial Burner Manufacturer Since 2002",
  description: "FlameTech Engineering has manufactured industrial gas & oil burners and control panels from Mumbai since 2002 — ISO 9001:2008 and CE certified, exporting to 14+ countries, with a nationwide AMC service program.",
  keywords: [
    "FlameTech Engineering history",
    "ISO 9001 burner manufacturer",
    "CE certified industrial burner company India",
    "about FlameTech Engineering Mumbai",
  ],
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About FlameTech Engineering | Industrial Burner Manufacturer Since 2002",
    description: "ISO 9001:2008 and CE certified industrial gas & oil burner manufacturer based in Mumbai, exporting to 14+ countries.",
    url: "/about",
    type: "website",
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
