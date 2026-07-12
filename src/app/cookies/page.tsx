"use client";

import React from "react";
import Link from "next/link";
import { Info, Clock, ArrowLeft, Mail, FileText } from "lucide-react";

export default function CookiesPage() {
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
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-brand-teal/10 border border-brand-teal/30 rounded-full text-brand-teal text-xs font-semibold uppercase tracking-wider">
            <Info className="w-3.5 h-3.5" />
            <span>Usage Disclosure</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">Cookies Policy</h1>
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>Last Updated: {lastUpdated}</span>
          </div>
        </div>

        {/* Policy Content */}
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-sm text-slate-600 dark:text-slate-455 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. What are Cookies?</h2>
            <p>
              Cookies are small text files stored on your computer or mobile device when you browse websites. They are widely used to make websites work efficiently, remember your preferences, and provide analytical data to website owners.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. How We Use Cookies</h2>
            <p>We use cookies to enhance your navigation experience and support core B2B ordering and authentication workflows:</p>
            
            <div className="space-y-4 pt-2">
              <div className="p-4 bg-white dark:bg-[#0a1128]/45 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1 shadow-sm">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs">A. Strictly Necessary Cookies</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Essential for core operations, such as keeping track of spare parts added to your shopping cart or maintaining active sessions during NextAuth administrator/client logins. The website cannot function correctly without them.
                </p>
              </div>

              <div className="p-4 bg-white dark:bg-[#0a1128]/45 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1 shadow-sm">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs">B. Preference & Functionality Cookies</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Allow us to remember choices you make, such as your preferred color mode theme (light/dark state) or selected model filters in the product catalog.
                </p>
              </div>

              <div className="p-4 bg-white dark:bg-[#0a1128]/45 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1 shadow-sm">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs">C. Performance & Analytics Cookies</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Track anonymous traffic metrics to help us optimize page layout load times, improve search algorithms, and identify broken navigation links.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Third-Party Cookies</h2>
            <p>
              In some instances, external partners set cookies to execute specialized services. For example, our payment checkout workflow embeds Razorpay scripts, which drop essential security and fraud-prevention cookies to validate transaction security.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. Managing Your Cookie Preferences</h2>
            <p>
              Most web browsers allow you to control, disable, or delete cookies via their settings pane. Please note that disabling strictly necessary cookies will prevent you from completing checkouts or logging into client areas.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">5. Contact Information</h2>
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
