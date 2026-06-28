"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Send, CheckCircle2, Clock, Flame } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "Industrial Burner Enquiry",
    message: "",
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API query/contact post
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  const contactMethods = [
    {
      icon: <Phone className="w-5 h-5 text-brand-orange" />,
      title: "Direct Support Hotlines",
      details: "+91 97684 17740",
      desc: "Call for immediate spare sales support or breakdown SLA scheduling.",
    },
    {
      icon: <Mail className="w-5 h-5 text-brand-orange" />,
      title: "Sales & Billing Email",
      details: "billing@flametech.com",
      desc: "Send formal RFP specifications, quotation forms, or purchase orders (PO).",
    },
    {
      icon: <MapPin className="w-5 h-5 text-brand-orange" />,
      title: "Registered Mumbai Office",
      details: "Mahim, Mumbai",
      desc: "Shop No. 9, Ground Floor, Paradise Apts., 15 Wanja Wadi, Mahim (W), Mumbai - 400 016",
    },
  ];

  return (
    <div className="pt-24 min-h-screen bg-slate-50 dark:bg-brand-dark pb-20 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Section */}
        <section className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-brand-orange/10 border border-brand-orange/30 rounded-full text-brand-orange text-xs font-semibold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            <span>Response within 24 Hours</span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white sm:text-5xl">Connect With Our Technical Team</h1>
          <p className="text-slate-650 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Have questions about industrial gas burner specs, customized panel assemblies, or need to verify spare parts compatibility? Send a request to our engineering office.
          </p>
        </section>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-8 items-start">
          
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-6">
            {contactMethods.map((m, i) => (
              <div
                key={i}
                className="bg-white dark:bg-[#0a1128]/50 border border-slate-200 dark:border-brand-slate/30 p-6 rounded-xl flex items-start space-x-4 shadow-sm"
              >
                <div className="bg-brand-orange/10 p-3 rounded-lg shrink-0">
                  {m.icon}
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{m.title}</h4>
                  <span className="block text-brand-orange font-extrabold text-sm font-mono">{m.details}</span>
                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-normal">{m.desc}</p>
                </div>
              </div>
            ))}

            {/* Quick Hours Support Panel */}
            <div className="bg-brand-orange/5 border border-brand-orange/20 p-6 rounded-xl space-y-3">
              <h4 className="font-bold text-brand-orange text-sm flex items-center space-x-1.5">
                <Clock className="w-4 h-4" />
                <span>Operating Hours</span>
              </h4>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                Our manufacturing plant and technical help desks operate from <strong>9:00 AM to 6:00 PM (Monday - Saturday)</strong>. SLA AMC breakdown support is operational 24/7/365.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Enquiry Form */}
          <div className="lg:col-span-7 bg-white dark:bg-[#0a1128]/70 border border-slate-200 dark:border-brand-slate/40 p-8 rounded-2xl shadow-md backdrop-blur-md">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-brand-teal/10 border border-brand-teal/40 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-brand-teal animate-bounce" />
                </div>
                <h3 className="text-slate-900 dark:text-white font-extrabold text-xl">Message Transmitted</h3>
                <p className="text-slate-650 dark:text-slate-400 text-sm leading-relaxed max-w-md mx-auto">
                  Your industrial enquiry has been logged in our support tickets. A FlameTech engineering specialist will contact you on WhatsApp or call at <strong className="text-slate-900 dark:text-white">{form.phone}</strong>.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    Submit another query
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div className="border-b border-slate-200 dark:border-brand-slate/40 pb-4">
                  <h3 className="text-slate-900 dark:text-white font-extrabold text-lg">Send B2B Enquiry</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Please provide project details for our engineering designers.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5 col-span-2 sm:col-span-1">
                    <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Anand Kumar"
                      className="w-full bg-slate-50 dark:bg-[#060b13] border border-slate-300 dark:border-slate-700 rounded-md py-2 px-3 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-brand-orange focus:bg-white"
                    />
                  </div>
                  {/* Phone */}
                  <div className="space-y-1.5 col-span-2 sm:col-span-1">
                    <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="e.g. +91 97684 17740"
                      className="w-full bg-slate-50 dark:bg-[#060b13] border border-slate-300 dark:border-slate-700 rounded-md py-2 px-3 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-brand-orange focus:bg-white"
                    />
                  </div>
                  {/* Company */}
                  <div className="space-y-1.5 col-span-2 sm:col-span-1">
                    <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Company Name</label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      placeholder="e.g. Sun Pharma"
                      className="w-full bg-slate-50 dark:bg-[#060b13] border border-slate-300 dark:border-slate-700 rounded-md py-2 px-3 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-brand-orange focus:bg-white"
                    />
                  </div>
                  {/* Email */}
                  <div className="space-y-1.5 col-span-2 sm:col-span-1">
                    <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="e.g. support@company.com"
                      className="w-full bg-slate-50 dark:bg-[#060b13] border border-slate-300 dark:border-slate-700 rounded-md py-2 px-3 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-brand-orange focus:bg-white"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Enquiry Subject</label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#060b13] border border-slate-300 dark:border-slate-700 rounded-md py-2 px-3 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-brand-orange focus:bg-white"
                  >
                    <option value="Industrial Burner Enquiry">Industrial Burner Sales</option>
                    <option value="Control Panel Customization">Custom Control Panels</option>
                    <option value="Spare Parts Inquiry">Spare Parts & Accessories</option>
                    <option value="AMC Maintenance SLA Quote">AMC Maintenance Contracts</option>
                  </select>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Project / Technical Details *</label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Provide thermal output capacity requirements, oven/boiler specifications, gas type, or details about parts you need..."
                    className="w-full bg-slate-50 dark:bg-[#060b13] border border-slate-300 dark:border-slate-700 rounded-md py-2 px-3 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-brand-orange resize-none focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-brand-orange hover:bg-brand-orange/95 text-white font-bold rounded-lg text-sm transition-all flex items-center justify-center space-x-1.5 shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? "Transmitting Enquiry..." : "Submit B2B Enquiry Form"}</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
