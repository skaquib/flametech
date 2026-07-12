import React from "react";
import prisma from "@/lib/prisma";
import MarketingClient from "./MarketingClient";
import { getLeadsWithFollowUpStatus } from "@/lib/leads";

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
  const [products, leads] = await Promise.all([getProducts(), getLeadsWithFollowUpStatus()]);
  const dueCount = leads.filter((l) => l.dueForFollowUp).length;

  return (
    <div className="space-y-8 text-left">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Marketing & Follow-Up Assistant</h1>
          <p className="text-slate-500 text-xs mt-1">Chat with the AI to draft WhatsApp/ad/social copy, or ask which real leads are overdue for a follow-up — review before sending.</p>
        </div>
        {dueCount > 0 && (
          <span className="px-3 py-1.5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-400 text-xs font-bold rounded-full">
            {dueCount} lead{dueCount === 1 ? "" : "s"} due for follow-up
          </span>
        )}
      </div>

      <MarketingClient products={products as any} />
    </div>
  );
}
