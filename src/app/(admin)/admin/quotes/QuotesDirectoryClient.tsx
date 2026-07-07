"use client";

import React, { useState } from "react";
import { AlertTriangle, Phone, Mail, Search } from "lucide-react";

interface Quote {
  id: string;
  name: string;
  company: string | null;
  phone: string;
  email: string | null;
  message: string | null;
  status: "NEW" | "CONTACTED" | "QUOTED" | "CONVERTED" | "CLOSED";
  notes?: string | null;
  lastContactedAt?: string | null;
  createdAt: string;
  product: {
    name: string;
  };
}

const PAGE_SIZE = 15;

export default function QuotesDirectoryClient({ quotes }: { quotes: Quote[] }) {
  const [list, setList] = useState<Quote[]>(quotes);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [errorId, setErrorId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});

  const patchQuote = async (id: string, data: Record<string, unknown>, revert: () => void) => {
    try {
      const res = await fetch(`/api/quotes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        revert();
        setErrorId(id);
        setTimeout(() => setErrorId((cur) => (cur === id ? null : cur)), 4000);
      }
    } catch {
      revert();
      setErrorId(id);
      setTimeout(() => setErrorId((cur) => (cur === id ? null : cur)), 4000);
    }
  };

  const handleUpdateStatus = (id: string, newStatus: Quote["status"]) => {
    const prev = list;
    setList(list.map((q) => (q.id === id ? { ...q, status: newStatus } : q)));
    patchQuote(id, { status: newStatus }, () => setList(prev));
  };

  const handleMarkContacted = (id: string) => {
    const prev = list;
    const now = new Date().toISOString();
    setList(list.map((q) => (q.id === id ? { ...q, lastContactedAt: now } : q)));
    patchQuote(id, { lastContactedAt: now }, () => setList(prev));
  };

  const handleSaveNotes = (id: string) => {
    const notes = notesDraft[id] ?? "";
    const prev = list;
    setList(list.map((q) => (q.id === id ? { ...q, notes } : q)));
    patchQuote(id, { notes }, () => setList(prev));
  };

  const filteredQuotes = list.filter((q) => {
    if (selectedFilter !== "all" && q.status !== selectedFilter) return false;
    if (search.trim()) {
      const term = search.trim().toLowerCase();
      const haystack = `${q.name} ${q.company ?? ""} ${q.phone} ${q.product?.name ?? ""}`.toLowerCase();
      if (!haystack.includes(term)) return false;
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredQuotes.length / PAGE_SIZE));
  const pagedQuotes = filteredQuotes.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">

      {/* Filtering tabs */}
      <div className="flex flex-wrap items-center gap-2 justify-between">
        <div className="flex flex-wrap gap-2">
          {[
            { label: "All Enquiries", val: "all" },
            { label: "New Leads", val: "NEW" },
            { label: "Contacted", val: "CONTACTED" },
            { label: "Offer Quoted", val: "QUOTED" },
            { label: "Converted", val: "CONVERTED" },
            { label: "Closed", val: "CLOSED" },
          ].map((tab) => (
            <button
              key={tab.val}
              onClick={() => { setSelectedFilter(tab.val); setPage(1); }}
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

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search name, company, phone, product..."
            className="bg-[#060b13] border border-slate-700 rounded text-xs py-1.5 pl-8 pr-3 text-slate-300 focus:outline-none focus:border-brand-orange w-72"
          />
        </div>
      </div>

      {/* Leads Table */}
      {pagedQuotes.length === 0 ? (
        <div className="bg-[#0a1128]/20 border border-dashed border-slate-800 rounded-xl p-12 text-center text-slate-500">
          <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-slate-600" />
          <p className="text-sm">No quote requests found matching this filter/search.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-brand-slate/40">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#0a1128]/80 text-[10px] font-bold text-slate-400 border-b border-brand-slate/40 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Client Contact</th>
                <th className="px-6 py-4">Requested Item</th>
                <th className="px-6 py-4">Client Details / Message</th>
                <th className="px-6 py-4">Follow-up Notes</th>
                <th className="px-6 py-4">Status Pipe</th>
                <th className="px-6 py-4 text-right">Pipeline Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-slate/20">
              {pagedQuotes.map((q) => (
                <tr key={q.id} className="hover:bg-slate-900/10 transition-colors align-top">

                  {/* Name/Company */}
                  <td className="px-6 py-4 space-y-1.5">
                    <div className="font-bold text-white text-sm">{q.name}</div>
                    <div className="text-brand-orange text-[10px] font-bold uppercase">{q.company || "Individual B2B"}</div>
                    <span className="text-[10px] text-slate-500 block">
                      Received: {new Date(q.createdAt).toLocaleDateString()}
                    </span>
                    {q.lastContactedAt && (
                      <span className="text-[10px] text-emerald-500 block">
                        Last contacted: {new Date(q.lastContactedAt).toLocaleDateString()}
                      </span>
                    )}
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

                  {/* Follow-up notes */}
                  <td className="px-6 py-4 max-w-[220px]">
                    <textarea
                      rows={2}
                      value={notesDraft[q.id] ?? q.notes ?? ""}
                      onChange={(e) => setNotesDraft({ ...notesDraft, [q.id]: e.target.value })}
                      onBlur={() => handleSaveNotes(q.id)}
                      placeholder="Add a follow-up note..."
                      className="w-full bg-[#060b13] border border-slate-700 rounded text-[10px] py-1.5 px-2 text-slate-300 focus:outline-none focus:border-brand-orange resize-none"
                    />
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
                    {errorId === q.id && (
                      <span className="block text-[9px] text-red-400 font-bold mt-1">Update failed — reverted</span>
                    )}
                  </td>

                  {/* Actions to transition status */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex flex-col items-end gap-1.5">
                      <select
                        value={q.status}
                        onChange={(e) => handleUpdateStatus(q.id, e.target.value as any)}
                        className="bg-[#060b13] border border-slate-700 rounded text-[10px] py-1 px-2 text-slate-300 font-bold focus:outline-none"
                      >
                        <option value="NEW">Mark New</option>
                        <option value="CONTACTED">Mark Contacted</option>
                        <option value="QUOTED">Mark Quoted</option>
                        <option value="CONVERTED">Mark Converted</option>
                        <option value="CLOSED">Mark Closed</option>
                      </select>
                      <button
                        onClick={() => handleMarkContacted(q.id)}
                        className="text-[9px] font-bold text-emerald-500 hover:text-emerald-400 uppercase tracking-wide"
                      >
                        Log contact today
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {filteredQuotes.length > PAGE_SIZE && (
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>
            Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filteredQuotes.length)} of {filteredQuotes.length}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border border-slate-700 rounded disabled:opacity-30 hover:border-slate-500"
            >
              Prev
            </button>
            <span className="px-2 py-1">{page} / {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 border border-slate-700 rounded disabled:opacity-30 hover:border-slate-500"
            >
              Next
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
