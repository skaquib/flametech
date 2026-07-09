import React from "react";
import prisma from "@/lib/prisma";
import MarketingClient from "./MarketingClient";

export const dynamic = "force-dynamic";

async function getProducts() {
  try {
    return await prisma.product.findMany({
      where: { isActive: true },
      select: { id: true, name: true, shortDesc: true, price: true },
      orderBy: { name: "asc" },
    });
  } catch {
    return [];
  }
}

export default async function AdminMarketingPage() {
  const products = await getProducts();

  return (
    <div className="space-y-8 text-left">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Marketing Copy Generator</h1>
        <p className="text-slate-500 text-xs mt-1">AI-drafted WhatsApp broadcasts, ad copy, social captions, and product descriptions — review before sending.</p>
      </div>

      <MarketingClient products={products as any} />
    </div>
  );
}
