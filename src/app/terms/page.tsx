"use client";

import React from "react";
import Link from "next/link";
import { Scale, Clock, ArrowLeft, Mail, FileText } from "lucide-react";

export default function TermsPage() {
  const lastUpdated = "July 12, 2026";

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
            <Scale className="w-3.5 h-3.5" />
            <span>Legal Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">Terms of Service</h1>
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>Last Updated: {lastUpdated}</span>
          </div>
        </div>

        {/* Terms Content */}
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-sm text-slate-600 dark:text-slate-455 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Acceptance of Terms</h2>
            <p>
              These Terms of Service ("Terms") govern your access to and use of the FlameTech Engineering website, B2B procurement catalog, and Annual Maintenance Contract (AMC) services (collectively, the "Services"). By browsing our catalog, submitting a Request for Quote (RFQ), placing an order, or registering an account, you agree to be bound by these Terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. About FlameTech Engineering</h2>
            <p>
              FlameTech Engineering is a manufacturer of industrial gas and oil burners, automatic control panels, and burner spare parts, headquartered at Shop No. 9, Ground Floor, Paradise Apts., 15 Wanja Wadi, Mahim (W), Mumbai - 400 016, India. We primarily serve business-to-business (B2B) customers across manufacturing, food processing, chemical, pharmaceutical, and industrial sectors.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Products, Pricing & Orders</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Product specifications, availability, and pricing displayed on the catalog are indicative and subject to change without prior notice.</li>
              <li>Custom-engineered burners and control panels sized for specific installations are quoted separately via RFQ and confirmed only upon a formal order or purchase order (PO) acceptance.</li>
              <li>All prices are exclusive of applicable GST unless stated otherwise, which will be added at checkout or invoicing.</li>
              <li>We reserve the right to refuse or cancel any order due to stock unavailability, pricing errors, or suspected fraudulent activity, with a full refund issued for any amount already collected.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. Payments</h2>
            <p>
              Online payments are processed securely through Razorpay; we do not store your card or banking credentials on our servers. B2B customers may alternatively pay via approved purchase orders, subject to credit terms agreed in writing.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">5. Shipping & Delivery</h2>
            <p>
              Delivery timelines communicated at checkout or in a quotation are estimates and may vary based on manufacturing lead time, courier/freight availability, or destination. Title and risk of loss for equipment and spare parts pass to the buyer upon dispatch from our facility, unless otherwise agreed in writing.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">6. Warranty & Returns</h2>
            <p>
              Burners, control panels, and spare parts carry the manufacturer warranty period stated on the corresponding datasheet or invoice, covering manufacturing defects under normal operating conditions. The warranty does not cover damage from incorrect installation, unauthorized modification, incompatible fuel/voltage supply, or normal wear parts (e.g., ignition electrodes, nozzles, gaskets). Return or replacement requests must be raised within 7 days of delivery for shipping-damaged goods, accompanied by photographic evidence.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">7. Annual Maintenance Contracts (AMC)</h2>
            <p>
              AMC plans include scheduled bi-monthly inspection visits and emergency breakdown service response, as described on our Services page, subject to the visit frequency and coverage scope selected at enrollment. Parts replaced during a service visit are billed separately unless explicitly covered under the selected plan.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">8. Intellectual Property</h2>
            <p>
              All burner designs, control panel schematics, product imagery, trademarks, and website content are the property of FlameTech Engineering and may not be reproduced, distributed, or used commercially without prior written consent.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">9. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, FlameTech Engineering's liability for any claim arising from the sale or servicing of products shall not exceed the amount paid for the specific product or service in question. We are not liable for indirect, incidental, or consequential losses, including production downtime, arising from equipment failure outside the scope of an active warranty or AMC agreement.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">10. Governing Law & Jurisdiction</h2>
            <p>
              These Terms are governed by the laws of India. Any disputes arising out of or relating to these Terms or our Services shall be subject to the exclusive jurisdiction of the courts of Mumbai, Maharashtra.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">11. Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time to reflect changes in our products, services, or legal requirements. Continued use of the Services after an update constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">12. Contact Information</h2>
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
