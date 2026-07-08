import React from "react";
import prisma from "@/lib/prisma";
import { ClipboardList, Filter, ShieldAlert } from "lucide-react";
import QuotesDirectoryClient from "./QuotesDirectoryClient";

export const dynamic = "force-dynamic";

// Mock Fallbacks in case database connection fails
const fallbackQuotes = [
  {
    id: "q1",
    name: "Rakesh Patel",
    company: "Reliance Petro",
    phone: "+91 9822334455",
    email: "rpatel@reliance.com",
    message: "Require 4 units of FT-15 for asphalt furnace retrofit.",
    status: "NEW",
    createdAt: new Date(),
    product: { name: "FlameTech FT-15 Gas Burner" },
  },
  {
    id: "q2",
    name: "Ankit Shah",
    company: "Gujarat Gas Grid",
    phone: "+91 9900887766",
    email: "ashah@ggg.com",
    message: "Requesting prices for 2 PLC panels.",
    status: "CONTACTED",
    createdAt: new Date(Date.now() - 3600000 * 4),
    product: { name: "Fully-Automatic PLC Control Panel" },
  },
  {
    id: "q3",
    name: "Vikas Dubey",
    company: "Standard Bakery Ltd",
    phone: "+91 9776655443",
    email: "vdubey@std-bakery.in",
    message: "Need quote for FT-03 burner for indirect bread oven.",
    status: "QUOTED",
    createdAt: new Date(Date.now() - 3600000 * 72),
    product: { name: "FlameTech FT-03 Gas Burner" },
  },
];

async function getQuotes() {
  try {
    const quotes = await prisma.quoteRequest.findMany({
      orderBy: { createdAt: "desc" },
      include: { product: true },
    });
    if (quotes.length === 0) return fallbackQuotes;
    return quotes;
  } catch (error) {
    console.error("Quotes admin database fetch error, falling back to mock data");
    return fallbackQuotes;
  }
}

export default async function AdminQuotesPage() {
  const quotes = await getQuotes();

  return (
    <div className="space-y-8 text-left">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">B2B Quote Requests</h1>
        <p className="text-slate-500 text-xs mt-1">Track and manage customer leads through the sales pipeline (New → Contacted → Quoted → Converted).</p>
      </div>

      {/* Client-Side interactive table */}
      <QuotesDirectoryClient quotes={quotes as any} />

    </div>
  );
}
