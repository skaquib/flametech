"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { ShieldCheck, Calendar, Activity, CheckCircle, Flame, Sparkles, Send, Check } from "lucide-react";

export default function AmcPageClient({ amcProductId }: { amcProductId: string | null }) {
  const [burnerModel, setBurnerModel] = useState("ft-03");
  const [burnerQty, setBurnerQty] = useState(1);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [requestError, setRequestError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    company: "",
    city: "",
  });

  const addItem = useCartStore((state) => state.addItem);

  const burnerOptions = [
    { id: "ft-03", name: "FT-03 Burner Service Plan", pricePerVisit: 799 },
    { id: "ft-05", name: "FT-05 Burner Service Plan", pricePerVisit: 899 },
    { id: "ft-10", name: "FT-10 Burner Service Plan", pricePerVisit: 1199 },
    { id: "ft-15", name: "FT-15 Burner Service Plan", pricePerVisit: 1399 },
    { id: "ft-20", name: "FT-20 Burner Service Plan", pricePerVisit: 1799 },
    { id: "ft-25", name: "FT-25 Burner Service Plan", pricePerVisit: 2499 },
  ];

  const selectedOption = burnerOptions.find((b) => b.id === burnerModel) || burnerOptions[0];

  // Calculation parameters
  const visitsPerYear = 6; // every 2 months
  const pricePerBurnerAnnual = selectedOption.pricePerVisit * visitsPerYear;
  const subtotal = pricePerBurnerAnnual * burnerQty;
  const gstRate = 0.18; // 18% GST
  const gstAmount = subtotal * gstRate;
  const total = subtotal + gstAmount;

  const whatsappHref = (text: string) =>
    `https://wa.me/919768417740?text=${encodeURIComponent(text)}`;

  const handleAddToCart = () => {
    addItem({
      id: `amc-${selectedOption.id}`,
      name: `1-Yr AMC: ${selectedOption.name} (Qty: ${burnerQty})`,
      slug: "amc-service-contract",
      itemCode: `AMC-${selectedOption.id.toUpperCase()}`,
      price: pricePerBurnerAnnual * burnerQty,
      image: "/images/amc-service.jpg",
      taxRate: "18%",
    }, 1);

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setRequestError(false);

    try {
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: amcProductId,
          name: form.name,
          phone: form.phone,
          company: form.company,
          message: `AMC site audit request | Burner range: ${selectedOption.name} | Factory city: ${form.city}`,
        }),
      });

      if (response.ok) {
        setRequestSubmitted(true);
      } else {
        setRequestError(true);
      }
    } catch {
      setRequestError(true);
    } finally {
      setLoading(false);
    }
  };

  const amcDeliverables = [
    "Bi-Monthly Preventive Checkup (6 visits/year)",
    "Flue gas combustion analysis for fuel-ratio calibration",
    "Burner combustion head & diffuser plate de-sooting",
    "Spark electrode & photocell scanner alignment check",
    "Safety limit thermostats & gas pressure switches verification",
    "Priority breakdown response within 24 hours"
  ];

  return (
    <div className="pt-24 min-h-screen bg-slate-50 dark:bg-brand-dark pb-20 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-brand-orange/10 border border-brand-orange/30 rounded-full text-brand-orange text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Industrial Service SLAs</span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Annual Maintenance Contracts</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Protect your production line from combustion downtime. We provide complete maintenance, ratio tuning, and emission monitoring for industrial burners under a fixed annual structure.
          </p>
          <a
            href={whatsappHref("Hello FlameTech Engineering! I have a question about your AMC (Annual Maintenance Contract) program.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs tracking-wide transition-all shadow-md"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" /></svg>
            <span>Ask About AMC on WhatsApp</span>
          </a>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-8">

          {/* Left: Program benefits */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white dark:bg-[#0a1128]/40 border border-slate-200 dark:border-brand-slate/30 p-8 rounded-2xl space-y-6 shadow-sm">
              <h2 className="text-slate-900 dark:text-white text-xl font-bold border-b border-slate-200 dark:border-brand-slate/40 pb-3 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-brand-orange" />
                <span>AMC Plan Coverage Details</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Our bi-monthly service frequency guarantees that burners operate at peak stoichiometry, reducing carbon footprint, preventing soot accumulation, and mitigating high exhaust temperature wear.
              </p>

              <ul className="space-y-3.5">
                {amcDeliverables.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-3 text-sm text-slate-700 dark:text-slate-300">
                    <CheckCircle className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Standard Service Log info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-brand-navy border border-slate-200 dark:border-brand-slate/30 p-5 rounded-xl text-center space-y-2 shadow-sm">
                <Calendar className="w-6 h-6 text-brand-orange mx-auto" />
                <h4 className="text-slate-950 dark:text-white text-sm font-bold">6 Visits / Year</h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs">Preventive cleaning every 60 days</p>
              </div>
              <div className="bg-white dark:bg-brand-navy border border-slate-200 dark:border-brand-slate/30 p-5 rounded-xl text-center space-y-2 shadow-sm">
                <Activity className="w-6 h-6 text-brand-orange mx-auto" />
                <h4 className="text-slate-950 dark:text-white text-sm font-bold">Ratio Tuning</h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs">CO2 and O2 optimization</p>
              </div>
              <div className="bg-white dark:bg-brand-navy border border-slate-200 dark:border-brand-slate/30 p-5 rounded-xl text-center space-y-2 shadow-sm">
                <ShieldCheck className="w-6 h-6 text-brand-orange mx-auto" />
                <h4 className="text-slate-950 dark:text-white text-sm font-bold">24-Hr SLA</h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs">Breakdown callout responses</p>
              </div>
            </div>
          </div>

          {/* Right: Calculator & Enquiries */}
          <div className="lg:col-span-5 space-y-8">
            {/* Interactive Calculator */}
            <div className="bg-white dark:bg-[#0a1128]/70 border border-slate-200 dark:border-brand-slate/40 p-8 rounded-2xl space-y-6 shadow-md backdrop-blur-md">
              <h3 className="text-slate-950 dark:text-white font-bold text-lg border-b border-slate-200 dark:border-brand-slate/40 pb-3">
                AMC Pricing Calculator
              </h3>

              <div className="space-y-4">
                {/* Select burner */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Burner Range</label>
                  <select
                    value={burnerModel}
                    onChange={(e) => setBurnerModel(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#060b13] border border-slate-300 dark:border-slate-700 rounded-md py-2 px-3 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:border-brand-orange focus:bg-white"
                  >
                    {burnerOptions.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name} (₹{o.pricePerVisit}/visit)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Burner quantity */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Burners Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={burnerQty}
                    onChange={(e) => setBurnerQty(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-50 dark:bg-[#060b13] border border-slate-300 dark:border-slate-700 rounded-md py-2 px-3 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:border-brand-orange focus:bg-white"
                  />
                </div>

                {/* Calculation values */}
                <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-2.5 text-sm">
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Base visit rate (per burner)</span>
                    <span>₹{selectedOption.pricePerVisit}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Visits frequency (yearly)</span>
                    <span>6 visits</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400 font-medium">
                    <span>Annual Rate (per burner)</span>
                    <span>₹{pricePerBurnerAnnual.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Burners subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>GST (18%)</span>
                    <span>₹{gstAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-950 dark:text-white font-extrabold border-t border-slate-200 dark:border-slate-800 pt-3 text-base">
                    <span>Annual AMC Total</span>
                    <span className="text-brand-orange">₹{total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Purchase actions */}
                <div className="pt-4 space-y-3">
                  <button
                    onClick={handleAddToCart}
                    className={`w-full py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center space-x-2 shadow-lg ${
                      added
                        ? "bg-brand-teal text-white shadow-brand-teal/10"
                        : "bg-brand-orange hover:bg-brand-orange/95 text-white shadow-brand-orange/15"
                    }`}
                  >
                    {added ? <Check className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                    <span>{added ? "AMC Added to Cart!" : "Purchase AMC Contract Online"}</span>
                  </button>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 text-center">
                    Purchase activates immediate Priority Client SLA profile in our ticketing board.
                  </p>
                </div>
              </div>
            </div>

            {/* Quote consultation request form */}
            <div className="bg-white dark:bg-[#0a1128]/70 border border-slate-200 dark:border-brand-slate/40 p-8 rounded-2xl space-y-4 shadow-md backdrop-blur-md">
              <h3 className="text-slate-900 dark:text-white font-bold text-base border-b border-slate-200 dark:border-brand-slate/40 pb-2">
                Request Consultation Visit
              </h3>

              {requestSubmitted ? (
                <div className="text-center py-4 space-y-2">
                  <CheckCircle className="w-8 h-8 text-brand-teal mx-auto animate-bounce" />
                  <h4 className="text-slate-900 dark:text-white font-bold text-sm">Consultation Requested</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-xs">
                    Our team will contact you to schedule an initial inspection.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRequestSubmit} className="space-y-3.5 text-left">
                  {requestError && (
                    <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 rounded-lg p-3 text-xs text-red-700 dark:text-red-400 space-y-1.5">
                      <p className="font-bold">We couldn't save your request — please try again, or reach us directly:</p>
                      <a
                        href={whatsappHref(`Hello FlameTech Engineering! I would like to request an AMC consultation visit. Burner range: ${selectedOption.name}. My phone: ${form.phone || "N/A"}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block font-bold text-emerald-600 dark:text-emerald-400 underline"
                      >
                        Message us on WhatsApp instead →
                      </a>
                    </div>
                  )}
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Contact Person *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Anand Sharma"
                      className="w-full bg-slate-50 dark:bg-[#060b13] border border-slate-300 dark:border-slate-700 rounded-md py-1.5 px-3 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="e.g. +91 97684 17740"
                      className="w-full bg-slate-50 dark:bg-[#060b13] border border-slate-300 dark:border-slate-700 rounded-md py-1.5 px-3 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Company Name</label>
                      <input
                        type="text"
                        value={form.company}
                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                        placeholder="e.g. Sun Pharma"
                        className="w-full bg-slate-50 dark:bg-[#060b13] border border-slate-300 dark:border-slate-700 rounded-md py-1.5 px-3 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Factory City *</label>
                      <input
                        type="text"
                        required
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        placeholder="e.g. Vadodara"
                        className="w-full bg-slate-50 dark:bg-[#060b13] border border-slate-300 dark:border-slate-700 rounded-md py-1.5 px-3 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:bg-white"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 dark:bg-brand-slate dark:border-slate-700 dark:hover:bg-slate-800 dark:text-white font-bold rounded-lg text-xs transition-all flex items-center justify-center space-x-1.5"
                  >
                    <Send className="w-3.5 h-3.5 text-brand-orange" />
                    <span>{loading ? "Submitting Request..." : "Request Site Audit"}</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
