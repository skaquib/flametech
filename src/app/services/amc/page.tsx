import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import AmcPageClient from "./AmcPageClient";

// Public marketing page — cache and revalidate every 5 minutes rather than
// hitting the DB on every visit for a value that barely ever changes.
export const revalidate = 300;

// Prisma doesn't go through `fetch`, so the `revalidate` export above alone does
// nothing for this query — unstable_cache is what actually caches it across requests.
const getAmcProductId = unstable_cache(
  async () => {
    try {
      const product = await prisma.product.findUnique({ where: { slug: "amc-service-contract", deletedAt: null } });
      return product?.id ?? null;
    } catch {
      return null;
    }
  },
  ["amc-product-id"],
  { revalidate: 300, tags: ["products"] }
);

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
  const amcProductId = await getAmcProductId();
  return <AmcPageClient amcProductId={amcProductId} />;
}
