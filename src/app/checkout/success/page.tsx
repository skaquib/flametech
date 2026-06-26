"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ArrowRight, Printer, ShoppingBag, FileText, Landmark } from "lucide-react";

interface LastCartItem {
  id: string;
  name: string;
  slug: string;
  itemCode: string | null;
  price: number;
  quantity: number;
  taxRate: string | null;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber") || "FT-ORD-1002";
  const isPending = searchParams.get("pending") === "true";

  // Buyer Params
  const buyerName = searchParams.get("name") || "B2B Representative";
  const buyerCompany = searchParams.get("company") || "";
  const buyerGstin = searchParams.get("gstin") || "";
  const addressLine1 = searchParams.get("line1") || "Corporate Office";
  const addressLine2 = searchParams.get("line2") || "";
  const city = searchParams.get("city") || "Ahmedabad";
  const state = searchParams.get("state") || "Gujarat";
  const pincode = searchParams.get("pincode") || "380001";

  const [items, setItems] = useState<LastCartItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("flametech-last-order-items");
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const getHSN = (slug: string) => {
    if (slug.includes("valve")) return "84818030";
    if (slug.includes("electrode")) return "85118000";
    if (slug.includes("photocell") || slug.includes("sensor")) return "90275000";
    if (slug.includes("control-box") || slug.includes("panel")) return "85371090";
    if (slug.includes("hose") || slug.includes("pipe")) return "40092100";
    if (slug.includes("amc")) return "998719";
    return "84162000"; // standard burner HSN
  };

  // Calculations
  const invoiceRows = items.map((item) => {
    // Extract base price prior to 18% GST (as prices in checkout are GST-included)
    const baseUnitPrice = Math.round(item.price / 1.18);
    const taxableSubtotal = baseUnitPrice * item.quantity;
    const cgst = Math.round(taxableSubtotal * 0.09);
    const sgst = Math.round(taxableSubtotal * 0.09);
    const total = taxableSubtotal + cgst + sgst;

    return {
      ...item,
      hsn: getHSN(item.slug),
      baseUnitPrice,
      taxableSubtotal,
      cgst,
      sgst,
      total,
    };
  });

  const totalTaxable = invoiceRows.reduce((sum, row) => sum + row.taxableSubtotal, 0);
  const totalCgst = invoiceRows.reduce((sum, row) => sum + row.cgst, 0);
  const totalSgst = invoiceRows.reduce((sum, row) => sum + row.sgst, 0);
  const grandTotal = totalTaxable + totalCgst + totalSgst;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-left pb-16 print:p-0 print:my-0">
      
      {/* Visual Header Success Status (hidden on print) */}
      <div className="bg-white dark:bg-[#0a1128]/50 border border-slate-200 dark:border-brand-slate/40 p-8 rounded-2xl text-center backdrop-blur-md space-y-4 print:hidden shadow-md">
        <div className="w-14 h-14 bg-brand-teal/10 border border-brand-teal/30 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8 text-brand-teal animate-bounce" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Order Successfully Placed!</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs">
            {isPending
              ? "Payment is currently awaiting gateway clearance. Verification typically takes up to 5 minutes."
              : "Razorpay transaction completed. A legal tax invoice has been generated for your record."}
          </p>
        </div>
        
        <div className="pt-2 flex justify-center space-x-3 text-xs">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-brand-orange hover:bg-brand-orange/90 text-white font-bold rounded-lg flex items-center space-x-1.5 transition-all shadow-md shadow-brand-orange/10"
          >
            <Printer className="w-4 h-4" />
            <span>Print Tax Invoice</span>
          </button>
          <Link
            href="/products"
            className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-all"
          >
            Back to Catalog
          </Link>
        </div>
      </div>

      {/* Tax Invoice Section */}
      <div className="bg-white text-slate-900 p-8 rounded-2xl border border-slate-200 shadow-xl space-y-6 print:border-none print:shadow-none print:p-0 print:text-black">
        
        {/* Invoice Header block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-slate-200 pb-6">
          <div className="space-y-1">
            <span className="bg-slate-100 text-slate-800 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-slate-300">
              Original Tax Invoice
            </span>
            <h2 className="text-2xl font-black tracking-tight text-slate-950">FLAMETECH ENGINEERING</h2>
            <span className="block text-[9px] uppercase tracking-widest text-slate-500 font-bold leading-none">
              Combustion Systems & Solutions
            </span>
          </div>

          <div className="text-left sm:text-right space-y-1 text-xs">
            <div><span className="font-bold text-slate-500">Invoice No:</span> <span className="font-extrabold text-slate-900">{orderNumber.replace("ORD", "INV")}</span></div>
            <div><span className="font-bold text-slate-500">Order Ref:</span> {orderNumber}</div>
            <div><span className="font-bold text-slate-500">Date:</span> {new Date().toLocaleDateString()}</div>
            <div><span className="font-bold text-slate-500">GSTIN:</span> <span className="font-black text-brand-orange">24AAACF9988G1ZX</span></div>
          </div>
        </div>

        {/* Legal addresses block */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs border-b border-slate-200 pb-6">
          {/* Seller */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-slate-950 uppercase border-b border-slate-100 pb-1 flex items-center space-x-1.5">
              <Landmark className="w-3.5 h-3.5 text-brand-orange" />
              <span>Details of Supplier (Seller)</span>
            </h4>
            <div className="leading-relaxed text-slate-600">
              <strong className="text-slate-800">FlameTech Engineering Office</strong><br />
              Plot No. 47, G.I.D.C Industrial Area,<br />
              Sector 26, Gandhinagar, Gujarat - 382026<br />
              State Code: 24 (Gujarat)<br />
              Contact: +91 97684 17740 | billing@flametech.com
            </div>
          </div>

          {/* Buyer */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-slate-950 uppercase border-b border-slate-100 pb-1 flex items-center space-x-1.5">
              <Landmark className="w-3.5 h-3.5 text-brand-teal" />
              <span>Details of Recipient (Buyer)</span>
            </h4>
            <div className="leading-relaxed text-slate-600">
              <strong className="text-slate-800">{buyerCompany || buyerName}</strong><br />
              {buyerCompany && <span className="block text-[11px] text-slate-500 font-semibold">Attn: {buyerName}</span>}
              {addressLine1}, {addressLine2 ? `${addressLine2}, ` : ""}<br />
              {city}, {state} - {pincode}<br />
              State Code: {state.toLowerCase().includes("gujarat") ? "24 (Local)" : "Inter-State"}<br />
              GSTIN: <span className="font-bold text-slate-800">{buyerGstin || "N/A (Consumer Retail)"}</span>
            </div>
          </div>
        </div>

        {/* Invoice lines table */}
        <div className="overflow-hidden border border-slate-200 rounded-lg">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[9px]">
              <tr>
                <th className="px-4 py-3">Line Description</th>
                <th className="px-4 py-3 text-center">HSN</th>
                <th className="px-4 py-3 text-center">Qty</th>
                <th className="px-4 py-3 text-right">Base rate</th>
                <th className="px-4 py-3 text-right">Taxable Sub</th>
                <th className="px-4 py-3 text-right">CGST (9%)</th>
                <th className="px-4 py-3 text-right">SGST (9%)</th>
                <th className="px-4 py-3 text-right">Total Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {invoiceRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    <div>{row.name}</div>
                    {row.itemCode && <span className="text-[9px] text-slate-400 block mt-0.5">SKU: {row.itemCode}</span>}
                  </td>
                  <td className="px-4 py-3 text-center font-medium">{row.hsn}</td>
                  <td className="px-4 py-3 text-center font-bold text-slate-800">{row.quantity}</td>
                  <td className="px-4 py-3 text-right">₹{row.baseUnitPrice.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-medium">₹{row.taxableSubtotal.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">₹{row.cgst.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">₹{row.sgst.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-bold text-slate-900">₹{row.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals split */}
        <div className="flex justify-end pt-2">
          <div className="w-80 space-y-2.5 text-xs text-slate-600 text-left">
            <div className="flex justify-between border-b border-slate-100 pb-1.5">
              <span className="font-medium">Total Taxable Value</span>
              <span className="font-bold text-slate-900">₹{totalTaxable.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Total CGST (9%)</span>
              <span className="font-medium text-slate-800">₹{totalCgst.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span>Total SGST (9%)</span>
              <span className="font-medium text-slate-800">₹{totalSgst.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-base font-black text-slate-950 pt-2 border-t border-slate-200">
              <span>Grand Invoice Total</span>
              <span className="text-brand-orange">₹{grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Signatures & Disclaimers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-[10px] text-slate-500 pt-8 border-t border-slate-200 leading-normal">
          <div className="space-y-1.5 text-left">
            <strong className="text-slate-700 block uppercase tracking-wide">Declaration & Terms:</strong>
            <p>
              1. Goods once sold will not be taken back or exchanged.<br />
              2. Disputes, if any, shall be subject to Gandhinagar jurisdiction.<br />
              3. We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.
            </p>
          </div>
          <div className="text-left sm:text-right flex flex-col justify-end items-start sm:items-end space-y-6 pt-4 sm:pt-0">
            <div className="text-slate-600">
              For <strong className="text-slate-800">FlameTech Engineering</strong>
            </div>
            <div className="h-10 border-b border-slate-300 w-44"></div>
            <div className="text-[9px] uppercase font-bold text-slate-400">Authorized Signatory</div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="pt-32 min-h-screen bg-slate-50 dark:bg-brand-dark pb-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="text-center text-slate-600 dark:text-slate-400 text-sm">Loading invoice parameters...</div>}>
          <SuccessContent />
        </Suspense>
      </div>
    </div>
  );
}
