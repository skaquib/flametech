import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { ClipboardList, ShoppingBag, ShieldAlert, BadgePlus, ExternalLink, ArrowUpRight, Eye } from "lucide-react";

export const dynamic = "force-dynamic";

async function getDashboardData() {
  try {
    const totalQuotes = await prisma.quoteRequest.count();
    const newLeadsCount = await prisma.quoteRequest.count({ where: { status: "NEW" } });
    const activeOrders = await prisma.order.count({
      where: { status: { notIn: ["DELIVERED", "CANCELLED"] } },
    });
    const paidOrders = await prisma.order.findMany({
      where: { status: "PAID" },
      select: { total: true },
    });
    const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);

    const lowStockCount = await prisma.product.count({
      where: {
        type: "PART",
        stockQty: { lte: 20 },
      },
    });

    const recentQuotes = await prisma.quoteRequest.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { product: true },
    });

    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: true },
    });

    const recentViews = await prisma.productView.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { product: true, user: true },
    });

    return {
      metrics: {
        totalQuotes,
        newLeadsCount,
        activeOrders,
        totalRevenue,
        lowStockCount,
      },
      recentQuotes,
      recentOrders,
      recentViews,
    };
  } catch (error) {
    console.error("Dashboard DB fetch error, falling back to mock metrics");
    return {
      metrics: {
        totalQuotes: 14,
        newLeadsCount: 4,
        activeOrders: 6,
        totalRevenue: 245000,
        lowStockCount: 3,
      },
      recentQuotes: [
        {
          id: "q1",
          name: "Rakesh Patel",
          company: "Reliance Petro",
          phone: "+91 9822334455",
          email: "rpatel@reliance.com",
          message: "Require 4 units of FT-15 for asphalt furnace retrofit.",
          status: "NEW",
          createdAt: new Date(),
          product: { name: "FlameTech FT-15 Gas Burner", slug: "ft-15" },
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
          product: { name: "Fully-Automatic PLC Control Panel", slug: "plc-control-panel" },
        },
      ],
      recentOrders: [
        {
          id: "o1",
          orderNumber: "FT-ORD-1002",
          total: 8598,
          status: "PAID",
          createdAt: new Date(),
          user: { name: "Reliance Industries" },
        },
        {
          id: "o2",
          orderNumber: "FT-ORD-1001",
          total: 3499,
          status: "PROCESSING",
          createdAt: new Date(Date.now() - 3600000 * 24),
          user: { name: "B2B Client Ltd" },
        },
      ],
      recentViews: [],
    };
  }
}

export default async function AdminDashboardPage() {
  const { metrics, recentQuotes, recentOrders, recentViews } = await getDashboardData();

  return (
    <div className="space-y-8 text-left">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-slate-500 text-xs mt-1">Real-time status of quote requests, inventory stock alerts, and parts ordering.</p>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* New / Unactioned Leads */}
        <div className="bg-white dark:bg-[#0a1128]/60 border border-brand-orange/40 p-6 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="block text-slate-500 text-[10px] uppercase font-bold tracking-wider">Needs Follow-up</span>
            <span className="block text-2xl font-black text-brand-orange">{metrics.newLeadsCount}</span>
            <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-semibold">New, Unactioned Leads</span>
          </div>
          <div className="bg-brand-orange/10 p-3 rounded-lg text-brand-orange">
            <BadgePlus className="w-6 h-6" />
          </div>
        </div>

        {/* Total Quotes */}
        <div className="bg-white dark:bg-[#0a1128]/60 border border-slate-200 dark:border-brand-slate/40 p-6 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="block text-slate-500 text-[10px] uppercase font-bold tracking-wider">Leads Pipeline</span>
            <span className="block text-2xl font-black text-slate-900 dark:text-white">{metrics.totalQuotes}</span>
            <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-semibold">Quote Requests</span>
          </div>
          <div className="bg-brand-orange/10 p-3 rounded-lg text-brand-orange">
            <ClipboardList className="w-6 h-6" />
          </div>
        </div>

        {/* Active Orders */}
        <div className="bg-white dark:bg-[#0a1128]/60 border border-slate-200 dark:border-brand-slate/40 p-6 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="block text-slate-500 text-[10px] uppercase font-bold tracking-wider">Production Line</span>
            <span className="block text-2xl font-black text-slate-900 dark:text-white">{metrics.activeOrders}</span>
            <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-semibold">Active Orders</span>
          </div>
          <div className="bg-brand-orange/10 p-3 rounded-lg text-brand-orange">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Total Sales Revenue */}
        <div className="bg-white dark:bg-[#0a1128]/60 border border-slate-200 dark:border-brand-slate/40 p-6 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="block text-slate-500 text-[10px] uppercase font-bold tracking-wider">E-commerce Sales</span>
            <span className="block text-2xl font-black text-slate-900 dark:text-white">₹{metrics.totalRevenue.toLocaleString()}</span>
            <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-semibold">Online Earnings</span>
          </div>
          <div className="bg-brand-orange/10 p-3 rounded-lg text-brand-orange">
            <span className="text-lg font-black">₹</span>
          </div>
        </div>

        {/* Low Stock count */}
        <div className="bg-white dark:bg-[#0a1128]/60 border border-slate-200 dark:border-brand-slate/40 p-6 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="block text-slate-500 text-[10px] uppercase font-bold tracking-wider">Inventory Alerts</span>
            <span className="block text-2xl font-black text-red-500">{metrics.lowStockCount}</span>
            <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-semibold">Low Spares Items</span>
          </div>
          <div className="bg-red-500/10 p-3 rounded-lg text-red-500">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Lists Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Recently Viewed Products */}
        <div className="bg-white dark:bg-[#0a1128]/40 border border-slate-200 dark:border-brand-slate/30 rounded-xl p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-brand-slate/20 pb-3">
            <h3 className="text-slate-900 dark:text-white font-bold text-sm flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-brand-orange" />
              Recently Viewed Products
            </h3>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-brand-slate/10 space-y-3">
            {recentViews.length === 0 ? (
              <p className="text-slate-500 text-xs italic pt-2">No product views recorded yet.</p>
            ) : (
              recentViews.map((v: any) => (
                <div key={v.id} className="pt-3 flex justify-between items-start text-xs">
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900 dark:text-white">{v.product?.name || "Unknown product"}</div>
                    <div className="text-slate-500 dark:text-slate-400 font-semibold">
                      {v.user?.name || v.user?.email || "Anonymous visitor"}
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 whitespace-nowrap">
                    {new Date(v.createdAt).toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Quotes List */}
        <div className="bg-white dark:bg-[#0a1128]/40 border border-slate-200 dark:border-brand-slate/30 rounded-xl p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-brand-slate/20 pb-3">
            <h3 className="text-slate-900 dark:text-white font-bold text-sm">Recent Quote Requests</h3>
            <Link
              href="/admin/quotes"
              className="text-brand-orange text-xs font-bold hover:text-slate-900 dark:hover:text-white transition-colors flex items-center space-x-1"
            >
              <span>View all</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-brand-slate/10 space-y-3">
            {recentQuotes.map((q: any) => (
              <div key={q.id} className="pt-3 flex justify-between items-start text-xs">
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white">
                    {q.name} <span className="text-slate-500 font-normal">from</span> {q.company}
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 font-semibold">
                    Product: {q.product.name}
                  </div>
                  <p className="text-slate-500 line-clamp-1 italic">{q.message}</p>
                </div>
                <div className="text-right space-y-1.5">
                  <span className="px-2 py-0.5 bg-brand-orange/15 border border-brand-orange/30 text-brand-orange rounded font-bold text-[8px] uppercase tracking-wider block">
                    {q.status}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {new Date(q.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders List */}
        <div className="bg-white dark:bg-[#0a1128]/40 border border-slate-200 dark:border-brand-slate/30 rounded-xl p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-brand-slate/20 pb-3">
            <h3 className="text-slate-900 dark:text-white font-bold text-sm">Recent Direct Orders</h3>
            <Link
              href="/admin/orders"
              className="text-brand-orange text-xs font-bold hover:text-slate-900 dark:hover:text-white transition-colors flex items-center space-x-1"
            >
              <span>View all</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-brand-slate/10 space-y-3">
            {recentOrders.map((o: any) => (
              <div key={o.id} className="pt-3 flex justify-between items-center text-xs">
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white">{o.orderNumber}</div>
                  <div className="text-slate-500 dark:text-slate-400 font-semibold">
                    Client: {o.user?.name || "B2B Guest"}
                  </div>
                </div>
                <div className="text-right space-y-1.5">
                  <span className="block text-slate-200 font-bold">
                    ₹{o.total.toLocaleString()}
                  </span>
                  <span className="px-2 py-0.5 bg-brand-teal/15 border border-brand-teal/30 text-brand-teal rounded font-bold text-[8px] uppercase tracking-wider">
                    {o.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
