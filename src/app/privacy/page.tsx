"use client";

import React from "react";
import Link from "next/link";
import { Shield, Clock, ArrowLeft, Mail, FileText } from "lucide-react";

export default function PrivacyPage() {
  const lastUpdated = "June 28, 2026";

  return (
    <div className="pt-28 min-h-screen bg-slate-50 dark:bg-brand-dark pb-20 text-left">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation back link */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-xs font-bold text-brand-orange hover:text-slate-900 dark:hover:text-white transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="border-b border-slate-200 dark:border-brand-slate/40 pb-8 mb-8 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-brand-orange/10 border border-brand-orange/30 rounded-full text-brand-orange text-xs font-semibold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" />
            <span>Compliance Directive</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">Privacy Policy</h1>
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>Last Updated: {lastUpdated}</span>
          </div>
        </div>

        {/* Policy Content */}
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-sm text-slate-600 dark:text-slate-455 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Introduction</h2>
            <p>
              FlameTech Engineering ("we," "our," or "us") is committed to protecting the privacy and security of your corporate and personal data. This Privacy Policy details how we collect, process, disclose, and safeguard data when you visit our website, use our B2B procurement catalog, or submit Request for Quote (RFQ) enquiries.
            </p>
            <p>
              Our office is located at **Shop No. 9, Ground Floor, Paradise Apts., 15 Wanja Wadi, Mahim (W), Mumbai - 400 016, India**. We act as the data controller for the processing operations described herein.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Data We Collect</h2>
            <p>We only collect information necessary to fulfill B2B transactions, service agreements, and technical engineering quotes:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Contact Information:</strong> Full name, corporate email address, mobile number, and company name.</li>
              <li><strong>Project Specifications:</strong> Technical heat load requirements, burner model inquiries, installation constraints, and gas/oil fuel types submitted via forms.</li>
              <li><strong>Transaction Records:</strong> Billing and shipping addresses, GSTIN numbers, and order history for spare parts. (Note: Payment details are securely processed via Razorpay and never stored on our servers).</li>
              <li><strong>Technical Metadata:</strong> IP address, browser type, and interaction metrics logged during your sessions.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. How We Use Your Data</h2>
            <p>We process your data strictly to execute contracts and fulfill our legitimate business interests:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Processing online purchases of spare parts and arranging logistics/shipping.</li>
              <li>Compiling engineering quotations and matching burner sizing for custom industrial projects.</li>
              <li>Managing and dispatching mobile service technicians under Annual Maintenance Contracts (AMC).</li>
              <li>Complying with statutory tax, legal, and billing regulations.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. Data Storage & Security</h2>
            <p>
              Your data is stored securely on servers located in secure database clusters. We utilize industry-standard Transport Layer Security (TLS) encryption to safeguard data during transit. Access to custom burner specifications and client order history is strictly restricted to authorized FlameTech engineering and billing personnel.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">5. Your Legal Rights</h2>
            <p>Under applicable data protection laws, you retain complete rights regarding your data:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Access & Portability:</strong> You may request a record of the personal information we store about your organization.</li>
              <li><strong>Correction & Erasure:</strong> You can request immediate correction of inaccurate technical or billing records, or absolute deletion of your user account.</li>
              <li><strong>Consent Withdrawal:</strong> You may opt-out of marketing communications at any time.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">6. Contact Information</h2>
            <div className="bg-white dark:bg-[#0a1128]/55 border border-slate-200 dark:border-brand-slate/30 p-5 rounded-xl space-y-3 shadow-sm">
              <p className="font-semibold text-slate-900 dark:text-white flex items-center space-x-1.5">
                <FileText className="w-4 h-4 text-brand-orange" />
                <span>FlameTech Legal Office</span>
              </p>
              <p className="text-xs">
                Shop No. 9, Ground Floor, Paradise Apts., 15 Wanja Wadi, Mahim (W), Mumbai - 400 016, India
              </p>
              <p className="text-xs flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-brand-orange" />
                <a href="mailto:info@flametechengineering.com" className="hover:text-brand-orange transition-colors">info@flametechengineering.com</a>
              </p>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}
