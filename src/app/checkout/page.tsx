"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { CreditCard, Truck, ShieldAlert, ArrowRight, ShieldCheck } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
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
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [useMockPayment, setUseMockPayment] = useState(true); // default to true for easy sandbox verification

  const subtotal = getSubtotal();
  const tax = getTaxAmount();
  const total = getTotal();

  // Dynamically load Razorpay SDK
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => console.error("Razorpay SDK failed to load");
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (items.length === 0) {
      alert("Your cart is empty");
      setLoading(false);
      return;
    }

    try {
      // Create order backend API
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

      const { orderId, orderNumber } = await orderRes.json();

      if (useMockPayment) {
        // Simulate immediate mock payment success
        setTimeout(() => {
          try {
            localStorage.setItem("flametech-last-order-items", JSON.stringify(items));
          } catch (e) {}
          clearCart();
          router.push(`/checkout/success?orderNumber=${orderNumber}&gstin=${form.gstin}&company=${form.company}&name=${form.name}&line1=${form.line1}&line2=${form.line2}&city=${form.city}&state=${form.state}&pincode=${form.pincode}`);
        }, 1500);
      } else {
        // Real Razorpay payment gateway flow
        const payRes = await fetch("/api/payments/razorpay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: total, orderId }),
        });

        if (!payRes.ok) {
          throw new Error("Razorpay order initiation failed");
        }

        const rzpOrder = await payRes.json();

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_mockkeyid123",
          amount: rzpOrder.amount,
          currency: "INR",
          name: "FlameTech Engineering",
          description: `Order ${orderNumber}`,
          order_id: rzpOrder.id,
          handler: async function (response: any) {
            // payment success handler
            const verificationRes = await fetch("/api/payments/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            });

            if (verificationRes.ok) {
              try {
                localStorage.setItem("flametech-last-order-items", JSON.stringify(items));
              } catch (e) {}
              clearCart();
              router.push(`/checkout/success?orderNumber=${orderNumber}&gstin=${form.gstin}&company=${form.company}&name=${form.name}&line1=${form.line1}&line2=${form.line2}&city=${form.city}&state=${form.state}&pincode=${form.pincode}`);
            } else {
              alert("Payment verification failed. Order marked as pending.");
              try {
                localStorage.setItem("flametech-last-order-items", JSON.stringify(items));
              } catch (e) {}
              clearCart();
              router.push(`/checkout/success?orderNumber=${orderNumber}&pending=true&gstin=${form.gstin}&company=${form.company}&name=${form.name}&line1=${form.line1}&line2=${form.line2}&city=${form.city}&state=${form.state}&pincode=${form.pincode}`);
            }
          },
          prefill: {
            name: form.name,
            email: form.email,
            contact: form.phone,
          },
          theme: {
            color: "#f26419",
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
        setLoading(false);
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Something went wrong processing your order.");
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
            <span>Secure Checkout</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Provide delivery credentials to execute order payments.</p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-10 text-slate-650 dark:text-slate-400">
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
                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <label className="text-[10px] text-slate-550 dark:text-slate-400 font-bold uppercase tracking-wider">Full Name *</label>
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
                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <label className="text-[10px] text-slate-550 dark:text-slate-400 font-bold uppercase tracking-wider">Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 97684 17740"
                    className="w-full bg-slate-50 dark:bg-[#060b13] border border-slate-300 dark:border-slate-700 rounded-md py-2 px-3 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:border-brand-orange focus:bg-white"
                  />
                </div>
                {/* Contact email */}
                <div className="space-y-1.5 col-span-2">
                  <label className="text-[10px] text-slate-550 dark:text-slate-400 font-bold uppercase tracking-wider">Email Address *</label>
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
                  <label className="text-[10px] text-slate-550 dark:text-slate-400 font-bold uppercase tracking-wider">Company Name (B2B Billing)</label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    placeholder="e.g. Reliance Industries"
                    className="w-full bg-slate-50 dark:bg-[#060b13] border border-slate-300 dark:border-slate-700 rounded-md py-2 px-3 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:border-brand-orange focus:bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-550 dark:text-slate-400 font-bold uppercase tracking-wider">B2B GSTIN (Optional)</label>
                  <input
                    type="text"
                    value={form.gstin}
                    onChange={(e) => setForm({ ...form, gstin: e.target.value })}
                    placeholder="e.g. 24AAACF9988G1ZX"
                    className="w-full bg-slate-50 dark:bg-[#060b13] border border-slate-300 dark:border-slate-700 rounded-md py-2 px-3 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:border-brand-orange focus:bg-white"
                  />
                </div>

                {/* Line 1 */}
                <div className="space-y-1.5 col-span-2">
                  <label className="text-[10px] text-slate-550 dark:text-slate-400 font-bold uppercase tracking-wider">Address Line 1 *</label>
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
                <div className="space-y-1.5 col-span-2">
                  <label className="text-[10px] text-slate-550 dark:text-slate-400 font-bold uppercase tracking-wider">Address Line 2 (Optional)</label>
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
                  <label className="text-[10px] text-slate-550 dark:text-slate-400 font-bold uppercase tracking-wider">City *</label>
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
                  <label className="text-[10px] text-slate-550 dark:text-slate-400 font-bold uppercase tracking-wider">State *</label>
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
                  <label className="text-[10px] text-slate-550 dark:text-slate-400 font-bold uppercase tracking-wider">Postal Pincode *</label>
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

            {/* Right: Payment selection summary */}
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

                {/* Sandbox Mock Options Toggle */}
                <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-3 text-left">
                  <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block">Developer Sandbox Payment</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="mock-payment"
                      checked={useMockPayment}
                      onChange={(e) => setUseMockPayment(e.target.checked)}
                      className="rounded border-slate-350 dark:border-slate-800 bg-slate-50 dark:bg-[#060b13] text-brand-orange focus:ring-brand-orange"
                    />
                    <label htmlFor="mock-payment" className="text-xs text-slate-700 dark:text-slate-300 font-semibold cursor-pointer">
                      Simulate payment success (Mock)
                    </label>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-brand-orange hover:bg-brand-orange/95 text-white font-bold rounded-lg text-sm transition-all flex items-center justify-center space-x-2 shadow-lg shadow-brand-orange/15"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>{loading ? "Ordering..." : "Pay & Complete B2B Order"}</span>
                  </button>
                </div>
              </div>

              {/* Safety notice */}
              <div className="bg-slate-100 dark:bg-brand-slate/20 border border-slate-200 dark:border-brand-slate/40 p-4 rounded-xl flex items-start space-x-2.5 text-xs text-slate-500 dark:text-slate-400 leading-normal">
                <ShieldCheck className="w-5 h-5 text-brand-teal shrink-0 mt-0.5" />
                <p>All online purchases are backed by the official FlameTech manufacturer product warranty guidelines. Recieve invoice on registered email.</p>
              </div>

            </div>

          </form>
        )}
      </div>
    </div>
  );
}
