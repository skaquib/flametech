import React from "react";
import prisma from "@/lib/prisma";
import AnalyticsClient from "./AnalyticsClient";

export const dynamic = "force-dynamic";

async function getAnalytics() {
  try {
    const [totalQuotes, convertedQuotes, totalViews, quotesWithProduct] = await Promise.all([
      prisma.quoteRequest.count(),
      prisma.quoteRequest.count({ where: { status: "CONVERTED" } }),
      prisma.productView.count(),
      prisma.quoteRequest.findMany({
        select: {
          productId: true,
          product: {
            select: {
              name: true,
              industries: { select: { name: true } },
            },
          },
        },
      }),
    ]);

    // Top products by quote request count
    const productCounts = new Map<string, { name: string; count: number }>();
    // Top industries by quote request count (via product's linked industries)
    const industryCounts = new Map<string, number>();

    for (const q of quotesWithProduct) {
      if (q.product) {
        const entry = productCounts.get(q.productId) || { name: q.product.name, count: 0 };
        entry.count += 1;
        productCounts.set(q.productId, entry);

        for (const ind of q.product.industries) {
          industryCounts.set(ind.name, (industryCounts.get(ind.name) || 0) + 1);
        }
      }
    }

    const topProducts = Array.from(productCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const topIndustries = Array.from(industryCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const conversionRate = totalQuotes > 0 ? (convertedQuotes / totalQuotes) * 100 : 0;
    const viewToLeadRatio = totalQuotes > 0 ? totalViews / totalQuotes : 0;

    return {
      topProducts,
      topIndustries,
      conversionRate,
      totalQuotes,
      convertedQuotes,
      totalViews,
      viewToLeadRatio,
    };
  } catch (error) {
    console.error("Analytics fetch error:", error);
    return {
      topProducts: [],
      topIndustries: [],
      conversionRate: 0,
      totalQuotes: 0,
      convertedQuotes: 0,
      totalViews: 0,
      viewToLeadRatio: 0,
    };
  }
}

export default async function AdminAnalyticsPage() {
  const data = await getAnalytics();

  return (
    <div className="space-y-8 text-left">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Growth Analytics</h1>
        <p className="text-slate-500 text-xs mt-1">Where interest is coming from, and how well it's converting — based on your real quote requests and product views.</p>
      </div>

      <AnalyticsClient data={data} />
    </div>
  );
}
