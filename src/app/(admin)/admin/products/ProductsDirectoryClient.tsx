"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Flame, Settings, Edit3, Circle, CircleCheck, AlertTriangle } from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  itemCode: string | null;
  type: "EQUIPMENT" | "PART" | "SERVICE";
  price: number | null;
  stockQty: number | null;
  unit: string | null;
  isActive: boolean;
}

export default function ProductsDirectoryClient({ products }: { products: Product[] }) {
  const [list, setList] = useState<Product[]>(products);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    // Optimistic UI update
    const updatedList = list.map((p) => (p.id === id ? { ...p, isActive: !currentStatus } : p));
    setList(updatedList);

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (!res.ok) {
        console.warn("DB toggle failed, keeping optimistic status");
      }
    } catch (err) {
      console.warn("API toggle error, keeping optimistic status");
    }
  };

  const filteredList = list.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.itemCode && p.itemCode.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedType === "all" || p.type === selectedType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      
      {/* Filtering Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div className="relative max-w-sm flex-1">
          <input
            type="text"
            placeholder="Search products, item codes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0a1128]/60 border border-slate-700 rounded-md py-2 px-3 pl-9 text-slate-200 text-xs focus:outline-none focus:border-brand-orange"
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
              onClick={() => setSelectedType(t.val)}
              className={`px-3 py-1.5 border rounded text-[10px] font-bold uppercase transition-colors ${
                selectedType === t.val
                  ? "bg-brand-orange/15 border-brand-orange text-brand-orange"
                  : "bg-brand-dark/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      {filteredList.length === 0 ? (
        <div className="bg-[#0a1128]/20 border border-dashed border-slate-800 rounded-xl p-12 text-center text-slate-500">
          <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-slate-600" />
          <p className="text-sm">No items found matching the current filters.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-brand-slate/40">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#0a1128]/80 text-[10px] font-bold text-slate-400 border-b border-brand-slate/40 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Item Name / Code</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">B2B Base Price</th>
                <th className="px-6 py-4">Stock Qty</th>
                <th className="px-6 py-4">Visibility Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-slate/20">
              {filteredList.map((p) => {
                const isEquipment = p.type === "EQUIPMENT";

                return (
                  <tr key={p.id} className="hover:bg-slate-900/10 transition-colors">
                    
                    {/* Name/Code */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-white text-sm">{p.name}</div>
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
                    <td className="px-6 py-4 font-bold text-slate-300">
                      {isEquipment ? "Quote Flow Only" : `₹${p.price?.toLocaleString()}`}
                    </td>

                    {/* Stock */}
                    <td className="px-6 py-4 text-slate-300 font-semibold">
                      {isEquipment ? "N/A" : `${p.stockQty} ${p.unit || "PCS"}`}
                    </td>

                    {/* Visibility status toggle */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActive(p.id, p.isActive)}
                        className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold border transition-colors ${
                          p.isActive
                            ? "bg-emerald-950/20 border-emerald-900/60 text-emerald-400 hover:bg-emerald-950/40"
                            : "bg-red-950/20 border-red-900/60 text-red-400 hover:bg-red-950/40"
                        }`}
                      >
                        {p.isActive ? <CircleCheck className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                        <span>{p.isActive ? "ACTIVE" : "INACTIVE"}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`/products/${p.slug}`}
                          target="_blank"
                          className="p-2 bg-brand-slate border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white rounded-md"
                          title="View on site"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                        <Link
                          href={`/admin/products/${p.id}`}
                          className="p-2 bg-brand-slate border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white rounded-md"
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

    </div>
  );
}
