import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import AmcPageClient from "./AmcPageClient";

// Public marketing page — cache and revalidate every 5 minutes rather than
// hitting the DB on every visit for a value that barely ever changes.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Annual Maintenance Contract (AMC) for Industrial Burners",
  description: "FlameTech Engineering's AMC program covers bi-monthly inspection and emergency breakdown service for industrial gas & oil burners, starting at ₹799 + GST per visit. Pan-India coverage with rapid-response SLA.",
  keywords: [
    "burner AMC service India",
    "industrial burner maintenance contract",
    "gas burner annual maintenance",
    "burner breakdown service Mumbai",
    "boiler burner AMC plan",
  ],
  alternates: { canonical: "/services/amc" },
  openGraph: {
    title: "Industrial Burner AMC Service | FlameTech Engineering",
    description: "Annual Maintenance Contracts for industrial gas & oil burners — bi-monthly inspections, emergency SLA response, starting at ₹799 + GST/visit.",
    url: "/services/amc",
    type: "website",
  },
};

export default async function AmcPage() {
  let amcProductId: string | null = null;
  try {
    const product = await prisma.product.findUnique({ where: { slug: "amc-service-contract" } });
    amcProductId = product?.id ?? null;
  } catch {
    amcProductId = null;
  }

  return <AmcPageClient amcProductId={amcProductId} />;
}
