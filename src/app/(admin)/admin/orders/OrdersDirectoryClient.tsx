"use client";

import React, { useState } from "react";
import { ShoppingBag, CircleAlert, CircleCheck, Truck, ShieldCheck, AlertTriangle } from "lucide-react";

interface Order {
  id: string;
  orderNumber: string;
  total: number;
  status: "PENDING" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  createdAt: string;
  user: {
    name: string;
    company: string | null;
  };
}

export default function OrdersDirectoryClient({ orders }: { orders: Order[] }) {
  const [list, setList] = useState<Order[]>(orders);
  const [selectedFilter, setSelectedFilter] = useState("all");

  const handleUpdateStatus = async (id: string, newStatus: Order["status"]) => {
    // Optimistic UI update
    const updated = list.map((o) => (o.id === id ? { ...o, status: newStatus } : o));
    setList(updated);

    try {
      const res = await fetch(`/api/orders/${id}`, {
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

  const filteredOrders = list.filter((o) => {
    if (selectedFilter === "all") return true;
    return o.status === selectedFilter;
  });

  return (
    <div className="space-y-6">
      
      {/* Filtering tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: "All Orders", val: "all" },
          { label: "Pending", val: "PENDING" },
          { label: "Paid", val: "PAID" },
          { label: "Processing", val: "PROCESSING" },
          { label: "Shipped", val: "SHIPPED" },
          { label: "Delivered", val: "DELIVERED" },
        ].map((tab) => (
          <button
            key={tab.val}
            onClick={() => setSelectedFilter(tab.val)}
            className={`px-3.5 py-1.5 border rounded text-[10px] font-bold uppercase transition-colors ${
              selectedFilter === tab.val
                ? "bg-brand-orange/15 border-brand-orange text-brand-orange"
                : "bg-slate-100 dark:bg-brand-dark/40 border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white dark:bg-[#0a1128]/20 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl p-12 text-center text-slate-500">
          <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-slate-400 dark:text-slate-600" />
          <p className="text-sm">No e-commerce orders found with this status.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-brand-slate/40">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 dark:bg-[#0a1128]/80 text-[10px] font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-brand-slate/40 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Order Number / Date</th>
                <th className="px-6 py-4">B2B Customer</th>
                <th className="px-6 py-4">Order Total (INR)</th>
                <th className="px-6 py-4">Order Status</th>
                <th className="px-6 py-4 text-right">Logistics Transition</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-transparent divide-y divide-slate-200 dark:divide-brand-slate/20">
              {filteredOrders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/10 transition-colors align-middle">

                  {/* Order Number / Date */}
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 dark:text-white text-sm">{o.orderNumber}</div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Date: {new Date(o.createdAt).toLocaleDateString()}
                    </span>
                  </td>

                  {/* Customer details */}
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800 dark:text-slate-200">{o.user?.name || "B2B Guest Client"}</div>
                    {o.user?.company && (
                      <span className="text-[10px] text-slate-500 block font-semibold mt-0.5">
                        Company: {o.user.company}
                      </span>
                    )}
                  </td>

                  {/* Total price */}
                  <td className="px-6 py-4 font-extrabold text-slate-900 dark:text-white text-sm">
                    ₹{o.total.toLocaleString()}
                  </td>

                  {/* Status tag */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded text-[9px] font-bold border uppercase tracking-wider ${
                      o.status === "PAID"
                        ? "bg-brand-teal/15 border-brand-teal/30 text-brand-teal"
                        : o.status === "PENDING"
                        ? "bg-red-500/10 border-red-500/30 text-red-400"
                        : o.status === "PROCESSING"
                        ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                        : o.status === "SHIPPED"
                        ? "bg-purple-500/10 border-purple-500/30 text-purple-400"
                        : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    }`}>
                      {o.status}
                    </span>
                  </td>

                  {/* transition options */}
                  <td className="px-6 py-4 text-right">
                    <select
                      value={o.status}
                      onChange={(e) => handleUpdateStatus(o.id, e.target.value as any)}
                      className="bg-white dark:bg-[#060b13] border border-slate-300 dark:border-slate-700 rounded text-[10px] py-1 px-2 text-slate-700 dark:text-slate-300 font-bold focus:outline-none"
                    >
                      <option value="PENDING">Pending Verify</option>
                      <option value="PAID">Mark Paid</option>
                      <option value="PROCESSING">Mark Processing</option>
                      <option value="SHIPPED">Mark Shipped</option>
                      <option value="DELIVERED">Mark Delivered</option>
                      <option value="CANCELLED">Cancel Order</option>
                    </select>
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
