"use client";

import React, { useState } from "react";
import { TrendingUp, ClipboardCheck, Eye, Percent } from "lucide-react";

interface BarDatum {
  name: string;
  count: number;
}

interface AnalyticsData {
  topProducts: BarDatum[];
  topIndustries: BarDatum[];
  conversionRate: number;
  totalQuotes: number;
  convertedQuotes: number;
  totalViews: number;
  viewToLeadRatio: number;
}

function BarChart({ data, colorClass }: { data: BarDatum[]; colorClass: string }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const max = Math.max(...data.map((d) => d.count), 1);

  if (data.length === 0) {
    return <p className="text-slate-500 text-xs italic py-6 text-center">No data yet.</p>;
  }

  return (
    <div className="space-y-3">
      {data.map((d, idx) => (
        <div key={d.name} className="space-y-1 relative">
          <div className="flex justify-between text-xs">
            <span className="text-slate-700 dark:text-slate-300 font-semibold truncate max-w-[70%]">{d.name}</span>
          </div>
          <div
            className="relative h-[10px] bg-slate-100 dark:bg-slate-800/60 rounded-full"
            onMouseEnter={() => setHoverIdx(idx)}
            onMouseLeave={() => setHoverIdx(null)}
          >
            <div
              className={`absolute left-0 top-0 h-full rounded-full ${colorClass} transition-all`}
              style={{ width: `${Math.max((d.count / max) * 100, 4)}%` }}
            />
            {hoverIdx === idx && (
              <div className="absolute -top-8 left-0 bg-slate-900 dark:bg-black text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap z-10">
                {d.name}: {d.count} {d.count === 1 ? "inquiry" : "inquiries"}
              </div>
            )}
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{d.count}</span>
        </div>
      ))}
    </div>
  );
}

function StatTile({ icon, label, value, sublabel }: { icon: React.ReactNode; label: string; value: string; sublabel?: string }) {
  return (
    <div className="bg-white dark:bg-[#0a1128]/60 border border-slate-200 dark:border-brand-slate/40 p-6 rounded-xl flex items-center justify-between">
      <div className="space-y-1">
        <span className="block text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold tracking-wider">{label}</span>
        <span className="block text-2xl font-black text-slate-900 dark:text-white">{value}</span>
        {sublabel && <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-semibold">{sublabel}</span>}
      </div>
      <div className="bg-brand-orange/10 p-3 rounded-lg text-brand-orange">{icon}</div>
    </div>
  );
}

export default function AnalyticsClient({ data }: { data: AnalyticsData }) {
  return (
    <div className="space-y-8">
      {/* Stat tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatTile
          icon={<Percent className="w-6 h-6" />}
          label="Conversion Rate"
          value={`${data.conversionRate.toFixed(1)}%`}
          sublabel={`${data.convertedQuotes} of ${data.totalQuotes} leads converted`}
        />
        <StatTile
          icon={<ClipboardCheck className="w-6 h-6" />}
          label="Total Leads"
          value={data.totalQuotes.toLocaleString()}
          sublabel="All-time quote requests"
        />
        <StatTile
          icon={<Eye className="w-6 h-6" />}
          label="Product Views"
          value={data.totalViews.toLocaleString()}
          sublabel="All-time product page views"
        />
        <StatTile
          icon={<TrendingUp className="w-6 h-6" />}
          label="View-to-Lead Ratio"
          value={data.viewToLeadRatio > 0 ? `${data.viewToLeadRatio.toFixed(1)} : 1` : "—"}
          sublabel="Views per quote request"
        />
      </div>

      {/* Bar charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-[#0a1128]/50 border border-slate-200 dark:border-brand-slate/40 p-6 rounded-xl">
          <h3 className="text-slate-900 dark:text-white font-bold text-sm border-b border-slate-200 dark:border-brand-slate/30 pb-3 mb-4">
            Top Products by Inquiries
          </h3>
          <BarChart data={data.topProducts} colorClass="bg-brand-orange dark:bg-[#e05a15]" />
        </div>

        <div className="bg-white dark:bg-[#0a1128]/50 border border-slate-200 dark:border-brand-slate/40 p-6 rounded-xl">
          <h3 className="text-slate-900 dark:text-white font-bold text-sm border-b border-slate-200 dark:border-brand-slate/30 pb-3 mb-4">
            Top Industries by Inquiries
          </h3>
          <BarChart data={data.topIndustries} colorClass="bg-brand-teal" />
        </div>
      </div>
    </div>
  );
}
