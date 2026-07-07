import prisma from "@/lib/prisma";
import AmcPageClient from "./AmcPageClient";

export const dynamic = "force-dynamic";

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
