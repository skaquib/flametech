import type { MetadataRoute } from "next";
import prisma from "@/lib/prisma";
import { SITE_URL } from "@/lib/constants";

const fallbackSlugs = [
  "ft-03",
  "ft-05",
  "ft-10",
  "ft-15",
  "ft-20",
  "ft-25",
  "semi-auto-control-panel",
  "gas-solenoid-valve-1-2",
  "ignition-electrode-set",
  "flame-sensor-photocell",
];

async function getProductSlugs(): Promise<string[]> {
  try {
    const products = await prisma.product.findMany({ where: { isActive: true, deletedAt: null }, select: { slug: true } });
    if (products.length > 0) {
      return products.map((p) => p.slug);
    }
    return fallbackSlugs;
  } catch {
    return fallbackSlugs;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getProductSlugs();

  const categorySlugs = ["gas-burners", "oil-burners", "control-panels", "spare-parts"];

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/products`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/services/amc`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/faq`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/cookies`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categorySlugs.map((slug) => ({
    url: `${SITE_URL}/products/category/${slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${SITE_URL}/products/${slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
