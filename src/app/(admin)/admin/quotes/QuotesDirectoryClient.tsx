"use client";

import React, { useState } from "react";
import { ClipboardCheck, Circle, CheckCircle, HelpCircle, Phone, Mail, AlertTriangle } from "lucide-react";

interface Quote {
  id: string;
  name: string;
  company: string | null;
  phone: string;
  email: string | null;
  message: string | null;
  status: "NEW" | "CONTACTED" | "QUOTED" | "CONVERTED" | "CLOSED";
  createdAt: string;
  product: {
    name: string;
  };
}

export default function QuotesDirectoryClient({ quotes }: { quotes: Quote[] }) {
  const [list, setList] = useState<Quote[]>(quotes);
  const [selectedFilter, setSelectedFilter] = useState("all");

  const handleUpdateStatus = async (id: string, newStatus: Quote["status"]) => {
    // Optimistic UI update
    const updated = list.map((q) => (q.id === id ? { ...q, status: newStatus } : q));
    setList(updated);

    try {
      const res = await fetch(`/api/quotes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        console.warn("Server status update failed, keeping optimistic status");
      }
    } catch (err) {
      console.warn("API status patch error, keeping optimistic status");
    }
  };

  const filteredQuotes = list.filter((q) => {
    if (selectedFilter === "all") return true;
    return q.status === selectedFilter;
  });

  return (
    <div className="space-y-6">
      
      {/* Filtering tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: "All Enquiries", val: "all" },
          { label: "New Leads", val: "NEW" },
          { label: "Contacted", val: "CONTACTED" },
          { label: "Offer Quoted", val: "QUOTED" },
          { label: "Closed", val: "CLOSED" },
        ].map((tab) => (
          <button
            key={tab.val}
            onClick={() => setSelectedFilter(tab.val)}
            className={`px-3.5 py-1.5 border rounded text-[10px] font-bold uppercase transition-colors ${
              selectedFilter === tab.val
                ? "bg-brand-orange/15 border-brand-orange text-brand-orange"
                : "bg-brand-dark/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Leads Table */}
      {filteredQuotes.length === 0 ? (
        <div className="bg-[#0a1128]/20 border border-dashed border-slate-800 rounded-xl p-12 text-center text-slate-500">
          <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-slate-600" />
          <p className="text-sm">No quote requests found in this pipeline phase.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-brand-slate/40">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#0a1128]/80 text-[10px] font-bold text-slate-400 border-b border-brand-slate/40 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Client Contact</th>
                <th className="px-6 py-4">Requested Item</th>
                <th className="px-6 py-4">Client Details / Message</th>
                <th className="px-6 py-4">Status Pipe</th>
                <th className="px-6 py-4 text-right">Pipeline Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-slate/20">
              {filteredQuotes.map((q) => (
                <tr key={q.id} className="hover:bg-slate-900/10 transition-colors align-top">
                  
                  {/* Name/Company */}
                  <td className="px-6 py-4 space-y-1.5">
                    <div className="font-bold text-white text-sm">{q.name}</div>
                    <div className="text-brand-orange text-[10px] font-bold uppercase">{q.company || "Individual B2B"}</div>
                    <span className="text-[10px] text-slate-500 block">
                      Recieved: {new Date(q.createdAt).toLocaleDateString()}
                    </span>
                  </td>

                  {/* Product */}
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-200 text-xs block max-w-[200px] truncate">
                      {q.product?.name || "FlameTech Custom Gas Burner"}
                    </span>
                  </td>

                  {/* Contact channels & message */}
                  <td className="px-6 py-4 space-y-2 max-w-sm">
                    <div className="flex flex-col space-y-1 text-slate-400">
                      <div className="flex items-center space-x-1.5">
                        <Phone className="w-3 h-3 text-slate-500" />
                        <span>{q.phone}</span>
                      </div>
                      {q.email && (
                        <div className="flex items-center space-x-1.5">
                          <Mail className="w-3 h-3 text-slate-500" />
                          <span className="truncate">{q.email}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-slate-500 italic border-l border-brand-orange/40 pl-2 leading-relaxed">
                      "{q.message}"
                    </p>
                  </td>

                  {/* Pipeline Status Tag */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider ${
                      q.status === "NEW"
                        ? "bg-brand-orange/15 border-brand-orange/30 text-brand-orange"
                        : q.status === "CONTACTED"
                        ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                        : q.status === "QUOTED"
                        ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                        : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    }`}>
                      {q.status}
                    </span>
                  </td>

                  {/* Actions to transition status */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end items-center space-x-1">
                      <select
                        value={q.status}
                        onChange={(e) => handleUpdateStatus(q.id, e.target.value as any)}
                        className="bg-[#060b13] border border-slate-700 rounded text-[10px] py-1 px-2 text-slate-300 font-bold focus:outline-none"
                      >
                        <option value="NEW">Mark New</option>
                        <option value="CONTACTED">Mark Contacted</option>
                        <option value="QUOTED">Mark Quoted</option>
                        <option value="CLOSED">Mark Closed</option>
                      </select>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
