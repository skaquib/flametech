"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { Truck, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function CheckoutPage() {
  const { items, getSubtotal, getTaxAmount, getTotal, clearCart } = useCartStore();

  const [form, setForm] = useState({
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    name: "",
    email: "",
    company: "",
    gstin: "",
  });

  const [loading, setLoading] = useState(false);
  const [submittedOrderNumber, setSubmittedOrderNumber] = useState<string | null>(null);

  const subtotal = getSubtotal();
  const tax = getTaxAmount();
  const total = getTotal();

  const buildWhatsAppMessage = (orderNumber: string) => {
    const itemLines = items
      .map((i) => `- ${i.name} (${i.itemCode || "N/A"}) x${i.quantity} — ₹${(i.price * i.quantity).toLocaleString()}`)
      .join("\n");

    return `Hello FlameTech Engineering! I've submitted an order and would like to confirm payment & delivery.

*Order Ref:* ${orderNumber}

*Items:*
${itemLines}

*Subtotal:* ₹${subtotal.toLocaleString()}
*GST (18%):* ₹${tax.toLocaleString()}
*Grand Total:* ₹${total.toLocaleString()}

*Deliver To:*
${form.name}${form.company ? ` (${form.company})` : ""}
${form.line1}${form.line2 ? `, ${form.line2}` : ""}
${form.city}, ${form.state} - ${form.pincode}
Phone: ${form.phone}
Email: ${form.email}${form.gstin ? `\nGSTIN: ${form.gstin}` : ""}

Please confirm availability and let me know how to complete payment.`;
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (items.length === 0) {
      alert("Your cart is empty");
      setLoading(false);
      return;
    }

    try {
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.id, quantity: i.quantity, price: i.price, taxRate: i.taxRate })),
          shippingAddress: {
            line1: form.line1,
            line2: form.line2,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
          },
          contactInfo: {
            name: form.name,
            email: form.email,
            phone: form.phone,
          },
          subtotal,
          taxAmount: tax,
          total,
        }),
      });

      if (!orderRes.ok) {
        throw new Error("Failed to create order on server");
      }

      const { orderNumber } = await orderRes.json();

      window.open(`https://wa.me/919869588728?text=${encodeURIComponent(buildWhatsAppMessage(orderNumber))}`, "_blank");
      clearCart();
      setSubmittedOrderNumber(orderNumber);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Something went wrong processing your order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-slate-50 dark:bg-brand-dark pb-20 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Title */}
        <div className="border-b border-slate-200 dark:border-brand-slate/40 pb-6 mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-3">
            <Truck className="w-8 h-8 text-brand-orange" />
            <span>Confirm Your Order</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">We'll connect with you on WhatsApp to confirm pricing, availability, and payment.</p>
        </div>

        {submittedOrderNumber ? (
          <div className="max-w-lg mx-auto bg-white dark:bg-[#0a1128]/70 border border-slate-200 dark:border-brand-slate/40 p-10 rounded-2xl text-center space-y-4 shadow-md">
            <div className="w-16 h-16 bg-brand-teal/10 border border-brand-teal/40 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-brand-teal animate-bounce" />
            </div>
            <h2 className="text-slate-900 dark:text-white font-extrabold text-xl">Order Details Sent!</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Your order <span className="font-bold text-slate-900 dark:text-white">{submittedOrderNumber}</span> has been recorded and your details opened in WhatsApp. No payment has been taken yet — our team will confirm availability and payment options with you directly.
            </p>
            <div className="pt-2">
              <Link
                href="/products"
                className="inline-block px-5 py-2.5 bg-brand-orange hover:bg-brand-orange/95 text-white font-bold rounded-lg text-xs transition-all"
              >
                Back to Catalog
              </Link>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-10 text-slate-500 dark:text-slate-400">
            No items to checkout. Return to <Link href="/products" className="text-brand-orange">Catalog</Link>
          </div>
        ) : (
          <form onSubmit={handleOrderSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Left: Input address details */}
            <div className="lg:col-span-8 bg-white dark:bg-[#0a1128]/50 border border-slate-200 dark:border-brand-slate/40 p-8 rounded-2xl space-y-6 shadow-sm">

              <div className="border-b border-slate-200 dark:border-brand-slate/30 pb-4">
                <h3 className="text-slate-900 dark:text-white font-bold text-lg">Shipping & Contact Details</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Please provide delivery address guidelines.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Contact name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Rakesh Shah"
                    className="w-full bg-slate-50 dark:bg-[#060b13] border border-slate-300 dark:border-slate-700 rounded-md py-2 px-3 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:border-brand-orange focus:bg-white"
                  />
                </div>
                {/* Contact phone */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 98695 88728"
                    className="w-full bg-slate-50 dark:bg-[#060b13] border border-slate-300 dark:border-slate-700 rounded-md py-2 px-3 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:border-brand-orange focus:bg-white"
                  />
                </div>
                {/* Contact email */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="purchase@reliance.com"
                    className="w-full bg-slate-50 dark:bg-[#060b13] border border-slate-300 dark:border-slate-700 rounded-md py-2 px-3 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:border-brand-orange focus:bg-white"
                  />
                </div>

                {/* Company Name & GSTIN */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Company Name (B2B Billing)</label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    placeholder="e.g. Reliance Industries"
                    className="w-full bg-slate-50 dark:bg-[#060b13] border border-slate-300 dark:border-slate-700 rounded-md py-2 px-3 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:border-brand-orange focus:bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">B2B GSTIN (Optional)</label>
                  <input
                    type="text"
                    value={form.gstin}
                    onChange={(e) => setForm({ ...form, gstin: e.target.value })}
                    placeholder="e.g. 24AAACF9988G1ZX"
                    className="w-full bg-slate-50 dark:bg-[#060b13] border border-slate-300 dark:border-slate-700 rounded-md py-2 px-3 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:border-brand-orange focus:bg-white"
                  />
                </div>

                {/* Line 1 */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Address Line 1 *</label>
                  <input
                    type="text"
                    required
                    value={form.line1}
                    onChange={(e) => setForm({ ...form, line1: e.target.value })}
                    placeholder="Plot No. 12, GIDC Industrial Estate Phase 2"
                    className="w-full bg-slate-50 dark:bg-[#060b13] border border-slate-300 dark:border-slate-700 rounded-md py-2 px-3 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:border-brand-orange focus:bg-white"
                  />
                </div>
                {/* Line 2 */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Address Line 2 (Optional)</label>
                  <input
                    type="text"
                    value={form.line2}
                    onChange={(e) => setForm({ ...form, line2: e.target.value })}
                    placeholder="Near State Bank of India, sector 26"
                    className="w-full bg-slate-50 dark:bg-[#060b13] border border-slate-300 dark:border-slate-700 rounded-md py-2 px-3 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:border-brand-orange focus:bg-white"
                  />
                </div>

                {/* City */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">City *</label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="Gandhinagar"
                    className="w-full bg-slate-50 dark:bg-[#060b13] border border-slate-300 dark:border-slate-700 rounded-md py-2 px-3 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:border-brand-orange focus:bg-white"
                  />
                </div>
                {/* State */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">State *</label>
                  <input
                    type="text"
                    required
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    placeholder="Gujarat"
                    className="w-full bg-slate-50 dark:bg-[#060b13] border border-slate-300 dark:border-slate-700 rounded-md py-2 px-3 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:border-brand-orange focus:bg-white"
                  />
                </div>
                {/* Pincode */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Postal Pincode *</label>
                  <input
                    type="text"
                    required
                    value={form.pincode}
                    onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                    placeholder="382026"
                    className="w-full bg-slate-50 dark:bg-[#060b13] border border-slate-300 dark:border-slate-700 rounded-md py-2 px-3 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:border-brand-orange focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Right: Order summary + WhatsApp handoff */}
            <div className="lg:col-span-4 space-y-6">

              <div className="bg-white dark:bg-[#0a1128]/70 border border-slate-200 dark:border-brand-slate/40 p-8 rounded-2xl space-y-6 shadow-md backdrop-blur-md">
                <h3 className="text-slate-900 dark:text-white font-bold text-base border-b border-slate-200 dark:border-brand-slate/40 pb-3">Order Total</h3>

                <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Parts Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (18%)</span>
                    <span>₹{tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Standard Shipping</span>
                    <span className="text-brand-teal font-bold">FREE</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-3 text-slate-950 dark:text-white font-black text-lg">
                    <span>Grand Total</span>
                    <span className="text-brand-orange">₹{total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-sm transition-all flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/15"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.863-9.864.001-2.63-1.019-5.101-2.875-6.958C16.604 1.926 14.129.905 11.5.905c-5.439 0-9.863 4.42-9.866 9.863-.002 1.93.501 3.81 1.458 5.484L2.08 21.8l5.567-1.458-.001-.001v.001zM17.828 14.7c-.312-.156-1.848-.912-2.128-1.013-.28-.102-.485-.153-.687.153-.202.304-.783.912-.96 1.114-.177.203-.354.228-.666.072-1.344-.672-2.203-1.172-3.08-2.697-.231-.4-.231-.77-.072-.929.143-.143.312-.365.468-.547.156-.183.208-.314.312-.523.104-.209.052-.392-.026-.547-.078-.156-.687-1.657-.942-2.269-.25-.599-.5-.517-.687-.527-.178-.009-.382-.01-.587-.01s-.538.076-.82.382c-.282.307-1.077 1.054-1.077 2.571s1.103 2.983 1.258 3.189c.155.206 2.17 3.313 5.258 4.646.734.317 1.308.507 1.753.649.738.234 1.41.201 1.941.122.593-.088 1.848-.756 2.108-1.488.26-.731.26-1.36.183-1.488-.077-.128-.282-.204-.594-.36z" />
                    </svg>
                    <span>{loading ? "Submitting..." : "Send Order via WhatsApp"}</span>
                  </button>
                </div>
              </div>

              {/* Safety notice */}
              <div className="bg-slate-100 dark:bg-brand-slate/20 border border-slate-200 dark:border-brand-slate/40 p-4 rounded-xl flex items-start space-x-2.5 text-xs text-slate-500 dark:text-slate-400 leading-normal">
                <ShieldCheck className="w-5 h-5 text-brand-teal shrink-0 mt-0.5" />
                <p>No payment is collected on this page. Your order and delivery details are sent to our team on WhatsApp, where we'll confirm pricing, availability, and payment together.</p>
              </div>

            </div>

          </form>
        )}
      </div>
    </div>
  );
}
