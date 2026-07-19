"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Flame, Settings, Edit3, Circle, CircleCheck, AlertTriangle, Trash2, RotateCcw, ChevronDown, ChevronUp, Loader2, FileSpreadsheet, X } from "lucide-react";
import { DEFAULT_PRODUCT_IMAGE } from "@/lib/constants";

interface Product {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  itemCode: string | null;
  type: "EQUIPMENT" | "PART" | "SERVICE";
  price: number | null;
  stockQty: number | null;
  unit: string | null;
  isActive: boolean;
}

interface TrashedProduct {
  id: string;
  name: string;
  itemCode: string | null;
  type: "EQUIPMENT" | "PART" | "SERVICE";
  deletedAt: string | Date;
}

const PAGE_SIZE = 25;
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

function daysRemaining(deletedAt: string | Date) {
  const msLeft = new Date(deletedAt).getTime() + SEVEN_DAYS_MS - Date.now();
  return Math.max(0, Math.ceil(msLeft / (24 * 60 * 60 * 1000)));
}

interface ImportResult {
  totalRows: number;
  created: number;
  updated: number;
  duplicates: number;
  skipped: number;
  failed: number;
  createdSample: string[];
  updatedSample: string[];
  duplicateSample: string[];
  skippedSample: string[];
  failedSample: string[];
}

interface ImportLogEntry {
  name: string;
  action: "created" | "updated" | "duplicate" | "skipped" | "failed";
  reason?: string;
}

const IMPORT_ACTION_BADGE: Record<ImportLogEntry["action"], string> = {
  created: "bg-emerald-950/10 text-emerald-500 border border-emerald-900/40",
  updated: "bg-brand-teal/10 text-brand-teal border border-brand-teal/40",
  duplicate: "bg-amber-950/10 text-amber-500 border border-amber-900/40",
  skipped: "bg-slate-100 dark:bg-slate-800/40 text-slate-500 border border-slate-300 dark:border-slate-700",
  failed: "bg-red-950/10 text-red-500 border border-red-900/40",
};

interface ImportProgress {
  current: number;
  total: number;
  log: ImportLogEntry[];
}

const BULK_DELETE_CONFIRM_THRESHOLD = 20;

export default function ProductsDirectoryClient({ products, trashedProducts = [] }: { products: Product[]; trashedProducts?: TrashedProduct[] }) {
  const router = useRouter();
  const [list, setList] = useState<Product[]>(products);
  const [trashList, setTrashList] = useState<TrashedProduct[]>(trashedProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [page, setPage] = useState(1);
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const [showTrash, setShowTrash] = useState(false);
  const [selectedTrashIds, setSelectedTrashIds] = useState<Set<string>>(new Set());
  const [restoring, setRestoring] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importProgress, setImportProgress] = useState<ImportProgress | null>(null);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmDeleteText, setConfirmDeleteText] = useState("");

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    if (togglingIds.has(id)) return; // already in flight — ignore extra clicks
    setTogglingIds((prev) => new Set(prev).add(id));

    // Optimistic UI update
    const prev = list;
    const updatedList = list.map((p) => (p.id === id ? { ...p, isActive: !currentStatus } : p));
    setList(updatedList);

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (!res.ok) {
        setList(prev);
      }
    } catch (err) {
      setList(prev);
    } finally {
      setTogglingIds((cur) => {
        const next = new Set(cur);
        next.delete(id);
        return next;
      });
    }
  };

  const filteredList = list.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.itemCode && p.itemCode.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = selectedType === "all" || p.type === selectedType;

    return matchesSearch && matchesType;
  });

  const totalPages = Math.max(1, Math.ceil(filteredList.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedList = filteredList.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const allFilteredSelected = filteredList.length > 0 && filteredList.every((p) => selectedIds.has(p.id));

  const toggleSelectAll = () => {
    setSelectedIds((prev) => {
      if (allFilteredSelected) return new Set();
      const next = new Set(prev);
      filteredList.forEach((p) => next.add(p.id));
      return next;
    });
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const requestBulkDelete = () => {
    if (selectedIds.size === 0 || bulkDeleting) return;
    if (selectedIds.size > BULK_DELETE_CONFIRM_THRESHOLD) {
      setConfirmDeleteText("");
      setConfirmDeleteOpen(true);
      return;
    }
    const confirmed = window.confirm(
      `Delete ${selectedIds.size} selected product${selectedIds.size > 1 ? "s" : ""}? They'll move to Recently Deleted and can be restored within 7 days.`
    );
    if (confirmed) performBulkDelete();
  };

  const performBulkDelete = async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0 || bulkDeleting) return;

    setConfirmDeleteOpen(false);
    setBulkDeleting(true);
    try {
      const res = await fetch("/api/products/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });

      if (res.ok) {
        const deletedNow = new Date().toISOString();
        const movedItems = list.filter((p) => selectedIds.has(p.id));
        setList((cur) => cur.filter((p) => !selectedIds.has(p.id)));
        setTrashList((cur) => [
          ...movedItems.map((p) => ({ id: p.id, name: p.name, itemCode: p.itemCode, type: p.type, deletedAt: deletedNow })),
          ...cur,
        ]);
        setSelectedIds(new Set());
      } else {
        alert("Could not delete the selected products. Please try again.");
      }
    } catch {
      alert("Network connection error.");
    } finally {
      setBulkDeleting(false);
    }
  };

  const allTrashSelected = trashList.length > 0 && trashList.every((p) => selectedTrashIds.has(p.id));

  const toggleSelectAllTrash = () => {
    setSelectedTrashIds((prev) => {
      if (allTrashSelected) return new Set();
      const next = new Set(prev);
      trashList.forEach((p) => next.add(p.id));
      return next;
    });
  };

  const toggleSelectOneTrash = (id: string) => {
    setSelectedTrashIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleRestore = async (ids: string[]) => {
    if (ids.length === 0 || restoring) return;
    setRestoring(true);
    try {
      const res = await fetch("/api/products/trash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });

      if (res.ok) {
        const restoredSet = new Set(ids);
        setTrashList((cur) => cur.filter((p) => !restoredSet.has(p.id)));
        setSelectedTrashIds((cur) => {
          const next = new Set(cur);
          ids.forEach((id) => next.delete(id));
          return next;
        });
        // Full product record isn't available client-side after restore, so
        // refresh the page data to bring it back into the active directory list.
        router.refresh();
      } else {
        alert("Could not restore the selected products. Please try again.");
      }
    } catch {
      alert("Network connection error.");
    } finally {
      setRestoring(false);
    }
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file next time
    if (!file || importing) return;

    setImporting(true);
    setImportError(null);
    setImportResult(null);
    setImportProgress({ current: 0, total: 0, log: [] });

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/products/import-excel", {
        method: "POST",
        body: formData,
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        setImportError(data.error || "Could not import this file.");
        setImportProgress(null);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // last (possibly partial) line stays buffered until it's complete

        for (const line of lines) {
          if (!line.trim()) continue;
          const msg = JSON.parse(line);

          if (msg.type === "start") {
            setImportProgress({ current: 0, total: msg.total, log: [] });
          } else if (msg.type === "row") {
            setImportProgress((prev) => ({
              current: msg.index,
              total: msg.total,
              log: [{ name: msg.name, action: msg.action, reason: msg.reason }, ...(prev?.log ?? [])].slice(0, 200),
            }));
          } else if (msg.type === "done") {
            const { type, ...result } = msg;
            setImportResult(result);
            setImportProgress(null);
            router.refresh();
          } else if (msg.type === "error") {
            setImportError(msg.error);
            setImportProgress(null);
          }
        }
      }
    } catch {
      setImportError("Network connection error.");
      setImportProgress(null);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* Recently Deleted panel */}
      <div className="rounded-xl border border-slate-200 dark:border-brand-slate/40 bg-white dark:bg-[#0a1128]/20 overflow-hidden">
        <button
          onClick={() => setShowTrash((v) => !v)}
          className="w-full flex items-center justify-between px-5 py-3 text-xs font-bold text-slate-600 dark:text-slate-300"
        >
          <span className="flex items-center space-x-2">
            <Trash2 className="w-3.5 h-3.5" />
            <span>Recently Deleted ({trashList.length})</span>
          </span>
          {showTrash ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showTrash && (
          <div className="border-t border-slate-200 dark:border-brand-slate/40 px-5 py-4">
            {trashList.length === 0 ? (
              <p className="text-xs text-slate-500 py-2">Nothing in the trash right now.</p>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                    <input type="checkbox" checked={allTrashSelected} onChange={toggleSelectAllTrash} className="w-3.5 h-3.5 accent-brand-orange" />
                    <span>Select All</span>
                  </label>
                  {selectedTrashIds.size > 0 && (
                    <button
                      onClick={() => handleRestore(Array.from(selectedTrashIds))}
                      disabled={restoring}
                      className="flex items-center space-x-1.5 px-3 py-1.5 bg-brand-teal/15 border border-brand-teal/40 text-brand-teal rounded-md text-[10px] font-bold disabled:opacity-50"
                    >
                      {restoring ? <Loader2 className="w-3 h-3 animate-spin" /> : <RotateCcw className="w-3 h-3" />}
                      <span>Restore Selected ({selectedTrashIds.size})</span>
                    </button>
                  )}
                </div>
                <ul className="divide-y divide-slate-200 dark:divide-brand-slate/20">
                  {trashList.map((p) => {
                    const remaining = daysRemaining(p.deletedAt);
                    return (
                      <li key={p.id} className="flex items-center justify-between py-2.5">
                        <label className="flex items-center space-x-3 flex-1 min-w-0">
                          <input
                            type="checkbox"
                            checked={selectedTrashIds.has(p.id)}
                            onChange={() => toggleSelectOneTrash(p.id)}
                            className="w-3.5 h-3.5 accent-brand-orange shrink-0"
                          />
                          <span className="min-w-0">
                            <span className="block font-bold text-slate-800 dark:text-slate-200 text-xs truncate">{p.name}</span>
                            <span className="block text-[10px] text-slate-500 mt-0.5">
                              {p.itemCode || "N/A"} · {remaining > 0 ? `${remaining} day${remaining === 1 ? "" : "s"} left to restore` : "purging soon"}
                            </span>
                          </span>
                        </label>
                        <button
                          onClick={() => handleRestore([p.id])}
                          disabled={restoring}
                          className="ml-3 shrink-0 flex items-center space-x-1.5 px-2.5 py-1.5 bg-slate-100 dark:bg-brand-slate border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-md text-[10px] font-bold disabled:opacity-50"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Restore</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Excel import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xls,.xlsx"
        onChange={handleFileSelected}
        className="hidden"
      />
      <div className="flex items-center justify-between">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={importing}
          className="flex items-center space-x-2 px-4 py-2.5 bg-brand-teal/10 hover:bg-brand-teal/20 border border-brand-teal/40 text-brand-teal font-bold rounded-lg text-xs transition-all disabled:opacity-50"
        >
          {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
          <span>{importing ? "Importing..." : "Upload Excel (Vyapar export)"}</span>
        </button>
      </div>

      {/* Live import progress modal — shows while the stream is still running */}
      {importProgress && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-lg max-h-[80vh] flex flex-col bg-white dark:bg-[#0a1128] border border-slate-200 dark:border-brand-slate/40 rounded-xl shadow-2xl">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-brand-slate/40 space-y-2">
              <h3 className="text-sm font-black text-slate-900 dark:text-white">Importing products...</h3>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-brand-orange h-2 rounded-full transition-all duration-200"
                  style={{ width: importProgress.total > 0 ? `${(importProgress.current / importProgress.total) * 100}%` : "0%" }}
                />
              </div>
              <p className="text-[10px] text-slate-500 font-mono">
                {importProgress.current} / {importProgress.total || "?"} rows processed
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-1.5">
              {importProgress.log.length === 0 && (
                <p className="text-xs text-slate-400 italic">Reading file...</p>
              )}
              {importProgress.log.map((entry, i) => (
                <div key={i} className="flex items-center justify-between gap-2 text-xs">
                  <span className="text-slate-700 dark:text-slate-300 truncate" title={entry.reason}>{entry.name}</span>
                  <span
                    className={`shrink-0 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${IMPORT_ACTION_BADGE[entry.action]}`}
                    title={entry.reason}
                  >
                    {entry.action}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Import result / error modal */}
      {(importResult || importError) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={() => { setImportResult(null); setImportError(null); }}>
          <div
            className="w-full max-w-lg max-h-[80vh] overflow-y-auto bg-white dark:bg-[#0a1128] border border-slate-200 dark:border-brand-slate/40 rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-brand-slate/40">
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                {importError ? "Import Failed" : "Import Complete"}
              </h3>
              <button onClick={() => { setImportResult(null); setImportError(null); }} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {importError && (
                <p className="text-xs text-red-400">{importError}</p>
              )}

              {importResult && (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="p-3 bg-emerald-950/10 border border-emerald-900/40 rounded-lg">
                      <p className="text-xl font-black text-emerald-400">{importResult.created}</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">Added</p>
                    </div>
                    <div className="p-3 bg-brand-teal/10 border border-brand-teal/40 rounded-lg">
                      <p className="text-xl font-black text-brand-teal">{importResult.updated}</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">Updated</p>
                    </div>
                    <div className="p-3 bg-amber-950/10 border border-amber-900/40 rounded-lg">
                      <p className="text-xl font-black text-amber-500">{importResult.duplicates}</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">Duplicates</p>
                    </div>
                    <div className="p-3 bg-slate-100 dark:bg-slate-800/40 border border-slate-300 dark:border-slate-700 rounded-lg">
                      <p className="text-xl font-black text-slate-500">{importResult.skipped}</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">Skipped</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500">{importResult.totalRows} rows read from the file.</p>

                  {importResult.failed > 0 && (
                    <div className="p-3 bg-red-950/10 border border-red-900/40 rounded-lg space-y-1">
                      <p className="text-xs font-bold text-red-500">{importResult.failed} row{importResult.failed === 1 ? "" : "s"} failed with an error — these were NOT imported</p>
                      <ul className="space-y-0.5 text-[11px] text-red-400/90 max-h-32 overflow-y-auto">
                        {importResult.failedSample.map((n, i) => <li key={i}>· {n}</li>)}
                        {importResult.failed > importResult.failedSample.length && <li>… and {importResult.failed - importResult.failedSample.length} more</li>}
                      </ul>
                    </div>
                  )}

                  {importResult.createdSample.length > 0 && (
                    <details className="text-xs" open>
                      <summary className="font-bold text-emerald-400 cursor-pointer">Added ({importResult.created})</summary>
                      <ul className="mt-1.5 space-y-0.5 text-slate-600 dark:text-slate-400 max-h-32 overflow-y-auto">
                        {importResult.createdSample.map((n, i) => <li key={i}>· {n}</li>)}
                        {importResult.created > importResult.createdSample.length && <li>… and {importResult.created - importResult.createdSample.length} more</li>}
                      </ul>
                    </details>
                  )}

                  {importResult.updatedSample.length > 0 && (
                    <details className="text-xs">
                      <summary className="font-bold text-brand-teal cursor-pointer">Updated ({importResult.updated})</summary>
                      <ul className="mt-1.5 space-y-0.5 text-slate-600 dark:text-slate-400 max-h-32 overflow-y-auto">
                        {importResult.updatedSample.map((n, i) => <li key={i}>· {n}</li>)}
                        {importResult.updated > importResult.updatedSample.length && <li>… and {importResult.updated - importResult.updatedSample.length} more</li>}
                      </ul>
                    </details>
                  )}

                  {importResult.duplicateSample.length > 0 && (
                    <details className="text-xs">
                      <summary className="font-bold text-amber-500 cursor-pointer">Duplicates ({importResult.duplicates})</summary>
                      <ul className="mt-1.5 space-y-0.5 text-slate-600 dark:text-slate-400 max-h-32 overflow-y-auto">
                        {importResult.duplicateSample.map((n, i) => <li key={i}>· {n}</li>)}
                        {importResult.duplicates > importResult.duplicateSample.length && <li>… and {importResult.duplicates - importResult.duplicateSample.length} more</li>}
                      </ul>
                    </details>
                  )}

                  {importResult.skippedSample.length > 0 && (
                    <details className="text-xs">
                      <summary className="font-bold text-slate-500 cursor-pointer">Skipped ({importResult.skipped})</summary>
                      <ul className="mt-1.5 space-y-0.5 text-slate-600 dark:text-slate-400 max-h-32 overflow-y-auto">
                        {importResult.skippedSample.map((n, i) => <li key={i}>· {n}</li>)}
                        {importResult.skipped > importResult.skippedSample.length && <li>… and {importResult.skipped - importResult.skippedSample.length} more</li>}
                      </ul>
                    </details>
                  )}
                </>
              )}

              <button
                onClick={() => { setImportResult(null); setImportError(null); }}
                className="w-full py-2.5 bg-slate-100 dark:bg-brand-slate hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-lg text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Large bulk-delete safeguard modal */}
      {confirmDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={() => setConfirmDeleteOpen(false)}>
          <div
            className="w-full max-w-md bg-white dark:bg-[#0a1128] border border-red-900/60 rounded-xl shadow-2xl p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center space-x-2 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-sm font-black">Delete {selectedIds.size} products?</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              That's a large batch — possibly your whole catalog. They'll move to Recently Deleted and can be restored within 7 days, but to avoid an accidental select-all wipe, type <span className="font-bold text-slate-800 dark:text-white">{selectedIds.size}</span> below to confirm.
            </p>
            <input
              type="text"
              inputMode="numeric"
              value={confirmDeleteText}
              onChange={(e) => setConfirmDeleteText(e.target.value)}
              placeholder={`Type ${selectedIds.size} to confirm`}
              autoFocus
              className="w-full bg-white dark:bg-[#0a1128]/60 border border-slate-300 dark:border-slate-700 rounded-md py-2 px-3 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:border-red-500"
            />
            <div className="flex space-x-2">
              <button
                onClick={() => setConfirmDeleteOpen(false)}
                className="flex-1 py-2.5 bg-slate-100 dark:bg-brand-slate hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-lg text-xs"
              >
                Cancel
              </button>
              <button
                onClick={performBulkDelete}
                disabled={confirmDeleteText.trim() !== String(selectedIds.size)}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:cursor-not-allowed text-white font-bold rounded-lg text-xs"
              >
                Delete {selectedIds.size} Products
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filtering Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div className="relative max-w-sm flex-1">
          <input
            type="text"
            placeholder="Search products, item codes..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            className="w-full bg-white dark:bg-[#0a1128]/60 border border-slate-300 dark:border-slate-700 rounded-md py-2 px-3 pl-9 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-brand-orange"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
        </div>

        <div className="flex space-x-2">
          {[
            { label: "All Types", val: "all" },
            { label: "Equipment", val: "EQUIPMENT" },
            { label: "Spares", val: "PART" },
            { label: "Services", val: "SERVICE" },
          ].map((t) => (
            <button
              key={t.val}
              onClick={() => { setSelectedType(t.val); setPage(1); }}
              className={`px-3 py-1.5 border rounded text-[10px] font-bold uppercase transition-colors ${
                selectedType === t.val
                  ? "bg-brand-orange/15 border-brand-orange text-brand-orange"
                  : "bg-slate-100 dark:bg-brand-dark/40 border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Result count */}
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
        {filteredList.length > PAGE_SIZE
          ? `Showing ${(currentPage - 1) * PAGE_SIZE + 1}-${Math.min(currentPage * PAGE_SIZE, filteredList.length)} of ${filteredList.length} products`
          : `Showing ${filteredList.length} product${filteredList.length === 1 ? "" : "s"}`}
        {filteredList.length !== list.length ? ` (filtered from ${list.length} total)` : ""}
      </p>

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between px-4 py-2.5 bg-brand-orange/10 border border-brand-orange/30 rounded-lg">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{selectedIds.size} selected</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSelectedIds(new Set())}
              className="px-3 py-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
            >
              Clear
            </button>
            <button
              onClick={requestBulkDelete}
              disabled={bulkDeleting}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-red-950/20 border border-red-900/60 text-red-400 hover:bg-red-950/40 rounded-md text-[10px] font-bold disabled:opacity-50"
            >
              {bulkDeleting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
              <span>Delete Selected</span>
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      {filteredList.length === 0 ? (
        <div className="bg-white dark:bg-[#0a1128]/20 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl p-12 text-center text-slate-500">
          <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-slate-400 dark:text-slate-600" />
          <p className="text-sm">No items found matching the current filters.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-brand-slate/40">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 dark:bg-[#0a1128]/80 text-[10px] font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-brand-slate/40 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-4 w-10">
                  <input type="checkbox" checked={allFilteredSelected} onChange={toggleSelectAll} className="w-3.5 h-3.5 accent-brand-orange" />
                </th>
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Item Name / Code</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">B2B Base Price</th>
                <th className="px-6 py-4">Stock Qty</th>
                <th className="px-6 py-4">Visibility Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-transparent divide-y divide-slate-200 dark:divide-brand-slate/20">
              {pagedList.map((p) => {
                const isEquipment = p.type === "EQUIPMENT";

                return (
                  <tr key={p.id} className={`hover:bg-slate-50 dark:hover:bg-slate-900/10 transition-colors ${selectedIds.has(p.id) ? "bg-brand-orange/5" : ""}`}>

                    {/* Row select checkbox */}
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(p.id)}
                        onChange={() => toggleSelectOne(p.id)}
                        className="w-3.5 h-3.5 accent-brand-orange"
                      />
                    </td>

                    {/* Thumbnail */}
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 rounded-md bg-slate-100 dark:bg-brand-slate/30 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                        <img
                          src={p.image || DEFAULT_PRODUCT_IMAGE}
                          alt={p.name}
                          onError={(e) => { e.currentTarget.src = DEFAULT_PRODUCT_IMAGE; }}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>

                    {/* Name/Code */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-white text-sm">{p.name}</div>
                      <div className="text-[10px] text-slate-500 font-semibold mt-0.5">
                        Code: {p.itemCode || "N/A"}
                      </div>
                    </td>

                    {/* Type */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[9px] font-bold border ${
                        isEquipment
                          ? "bg-brand-orange/10 border-brand-orange/30 text-brand-orange"
                          : p.type === "PART"
                          ? "bg-brand-teal/10 border-brand-teal/30 text-brand-teal"
                          : "bg-purple-500/10 border-purple-500/30 text-purple-400"
                      }`}>
                        {isEquipment ? <Flame className="w-2.5 h-2.5" /> : <Settings className="w-2.5 h-2.5" />}
                        <span>{p.type}</span>
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">
                      {isEquipment ? "Quote Flow Only" : `₹${p.price?.toLocaleString()}`}
                    </td>

                    {/* Stock */}
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-semibold">
                      {isEquipment ? "N/A" : `${p.stockQty} ${p.unit || "PCS"}`}
                    </td>

                    {/* Visibility status toggle */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActive(p.id, p.isActive)}
                        disabled={togglingIds.has(p.id)}
                        className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold border transition-colors disabled:opacity-50 disabled:cursor-wait ${
                          p.isActive
                            ? "bg-emerald-950/20 border-emerald-900/60 text-emerald-400 hover:bg-emerald-950/40"
                            : "bg-red-950/20 border-red-900/60 text-red-400 hover:bg-red-950/40"
                        }`}
                      >
                        {togglingIds.has(p.id) ? (
                          <Circle className="w-3.5 h-3.5 animate-spin" />
                        ) : p.isActive ? (
                          <CircleCheck className="w-3.5 h-3.5" />
                        ) : (
                          <Circle className="w-3.5 h-3.5" />
                        )}
                        <span>{togglingIds.has(p.id) ? "Saving..." : p.isActive ? "ACTIVE" : "INACTIVE"}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`/products/${p.slug}`}
                          target="_blank"
                          className="p-2 bg-slate-100 dark:bg-brand-slate border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-md"
                          title="View on site"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                        <Link
                          href={`/admin/products/${p.id}`}
                          className="p-2 bg-slate-100 dark:bg-brand-slate border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-md"
                          title="Edit details"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {filteredList.length > PAGE_SIZE && (
        <div className="flex items-center justify-end text-xs text-slate-600 dark:text-slate-400">
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-slate-300 dark:border-slate-700 rounded disabled:opacity-30 hover:border-slate-400 dark:hover:border-slate-500"
            >
              Prev
            </button>
            <span className="px-2 py-1">{currentPage} / {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-slate-300 dark:border-slate-700 rounded disabled:opacity-30 hover:border-slate-400 dark:hover:border-slate-500"
            >
              Next
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
