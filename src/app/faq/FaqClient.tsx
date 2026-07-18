"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HelpCircle, ChevronDown, MessageCircle } from "lucide-react";

interface Faq {
  question: string;
  answer: string;
}

export default function FaqClient({ faqs }: { faqs: Faq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="pt-24 min-h-screen bg-slate-50 dark:bg-brand-dark pb-20 text-left">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner */}
        <section className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-brand-orange/10 border border-brand-orange/30 rounded-full text-brand-orange text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Common Questions, Answered
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Quoting, ordering spare parts, AMC coverage, and repair support — the questions we hear most from plant managers and buyers.
          </p>
        </section>

        {/* Accordion */}
        <div className="space-y-3 mb-16">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="border border-slate-200 dark:border-brand-slate/40 rounded-xl bg-white dark:bg-[#0a1128]/20 overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between text-left px-5 py-4 gap-4"
                >
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <section className="text-center bg-white dark:bg-[#0a1128]/20 border border-slate-200 dark:border-brand-slate/40 rounded-2xl p-10 space-y-4">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Still have a question?</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
            Message us directly and we'll get back to you with a straight answer.
          </p>
          <a
            href="https://wa.me/919869588728?text=Hello%20FlameTech%20Engineering,%20I%20have%20a%20question."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-5 py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-lg text-xs uppercase tracking-wider transition-all shadow-md"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
          <div>
            <Link href="/contact" className="text-xs text-brand-orange hover:underline">
              or view all contact options
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
