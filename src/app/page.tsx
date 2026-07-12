import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "Industrial Gas & Oil Burner Manufacturer in Mumbai, India",
  description: "FlameTech Engineering manufactures high-efficiency industrial gas burners, oil burners, and automatic control panels (FT-03 to FT-25 series) for bakeries, powder coating, boilers, and process heating plants. 470+ spare parts in stock with pan-India AMC service.",
  keywords: [
    "industrial gas burner manufacturer India",
    "industrial oil burner Mumbai",
    "burner spare parts supplier",
    "automatic burner control panel manufacturer",
    "gas burner for bakery oven",
    "powder coating oven burner",
    "industrial boiler burner India",
    "FT series gas burner",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "FlameTech Engineering | Industrial Burners & Spares Manufacturer",
    description: "High-efficiency industrial gas & oil burners, automatic control panels, spare parts, and AMC service — trusted across Indian manufacturing plants.",
    url: "/",
    type: "website",
  },
};

export default function Page() {
  return <HomeClient />;
}
