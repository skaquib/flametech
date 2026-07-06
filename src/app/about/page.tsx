"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Flame, Settings, ShieldCheck, Award, ArrowRight, CheckCircle2 } from "lucide-react";

export default function AboutPage() {
  const companyMilestones = [
    { year: "2002", title: "Operations Commenced", desc: "FlameTech started operations as a specialized industrial burner service and installation provider in Mumbai." },
    { year: "2009", title: "Quality Certification", desc: "Achieved ISO 9001:2008 certification, formalizing quality control across manufacturing." },
    { year: "2011", title: "Corporate Registration", desc: "Formally registered in Mumbai as a licensed manufacturing entity for all kinds of industrial burners and hotel kitchen equipment." },
    { year: "2014", title: "Proprietary Line Launch", desc: "Launched proprietary B2B burner designs (FT-03 to FT-25 series) and set up local spare parts distribution networks." },
    { year: "2016", title: "CE Certification & Spares Expansion", desc: "Achieved CE certification for export-readiness and grew in-house spares stock to support faster service turnaround." },
    { year: "2019", title: "Globally Exported", desc: "Began exporting burners and components internationally, reaching customers across 14+ countries." },
    { year: "2021", title: "Expanded & Fuel-Efficient Burner", desc: "Expanded operations and introduced a more gas-efficient burner design to reduce customer fuel consumption." },
    { year: "2023", title: "AMC Program Scaled Nationwide", desc: "Rolled out the Annual Maintenance Contract program at scale, extending bi-monthly inspection and emergency service coverage across India." },
    { year: "2025", title: "New Tech in Burners", desc: "Introduced new burner technology upgrades, continuing to improve efficiency and reliability." },
  ];

  const values = [
    {
      icon: <Settings className="w-6 h-6 text-brand-orange" />,
      title: "Stoichiometric Precision",
      desc: "We design burner nozzle geometries to create optimal fuel-air mixing ratios, ensuring complete combustion and up to 15% fuel efficiency savings.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-brand-orange" />,
      title: "Safety Absolute",
      desc: "Every control panel is engineered with self-checking supervision, UV photocell flame sensors, and rapid fuel cutoff solenoids.",
    },
    {
      icon: <Award className="w-6 h-6 text-brand-orange" />,
      title: "B2B SLA Reliability",
      desc: "Our customized AMC maintenance programs guarantee priority 24/7 technical breakdown visits to keep plant operations nominal.",
    },
  ];

  return (
    <div className="pt-24 min-h-screen bg-slate-50 dark:bg-brand-dark pb-20 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Section */}
        <section className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-brand-orange/10 border border-brand-orange/30 rounded-full text-brand-orange text-xs font-semibold uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5" />
            <span>Since 2002</span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white sm:text-5xl">Engineering Next-Gen Thermal Systems</h1>
          <p className="text-slate-650 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            FlameTech Engineering manufactures high-efficiency industrial burners, customized automation control panels, hotel kitchen equipment, and premium spare parts for metallurgy, ceramics, baking, and chemical processing kilns.
          </p>
        </section>

        {/* Content Section: Mission & Image stamp */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Our Quest for Thermal Efficiency</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Since 2002, we have partnered with industrial manufacturing plants, process designers, and utility managers across India to minimize combustion emissions and fuel consumption costs.
            </p>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              By combining high-temp Kanthal electrodes, Class A solenoid valves, and micro-controlled safeties, we provide heating systems that stand up to the most demanding thermal processes up to 1400°C.
            </p>
            
            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center space-x-2 px-5 py-3 bg-brand-orange hover:bg-brand-orange/95 text-white font-bold rounded-lg text-xs tracking-wider uppercase transition-all shadow-md"
              >
                <span>Explore Burner Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 bg-white dark:bg-[#0a1128]/40 border border-slate-200 dark:border-brand-slate/30 p-8 rounded-2xl relative shadow-md">
            <div className="absolute top-4 right-4 bg-brand-orange text-white text-[9px] uppercase font-bold tracking-widest px-3 py-1 rounded shadow-sm">
               मुंबई, महाराष्ट्र
            </div>
            
            <div className="space-y-6">
              <h3 className="text-slate-900 dark:text-white font-bold text-lg flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                <CheckCircle2 className="w-5 h-5 text-brand-teal" />
                <span>Production Capability</span>
              </h3>
              
              <ul className="space-y-3.5 text-xs text-slate-700 dark:text-slate-350">
                <li className="flex items-start space-x-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-orange shrink-0 mt-1.5"></span>
                  <span><strong>Mumbai Plant:</strong> Core combustion simulation, sheet bending, control box wiring, and full nozzle calibration tracks.</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-orange shrink-0 mt-1.5"></span>
                  <span><strong>Quality Testing:</strong> 100% of safety solenoid valves and photoelectric flame scanners are simulated under continuous load cycles before packing.</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-orange shrink-0 mt-1.5"></span>
                  <span><strong>SLA Networks:</strong> Mobile engineering teams with complete calibration analyzer kits stationed for rapid maintenance visits.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Core Metrics */}
        <section className="mb-24 py-12 px-6 bg-slate-100 dark:bg-[#0a1128]/40 border border-slate-200 dark:border-brand-slate/20 rounded-2xl">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <h2 className="text-xs uppercase font-extrabold text-brand-orange tracking-widest">Track Record</h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">FlameTech by the Numbers</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Serving manufacturing plants, mills, commercial bakeries, and hotel kitchens all over India.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <span className="block text-3xl sm:text-4xl font-black text-brand-orange font-mono">2,500+</span>
              <span className="block text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wider">Running Burners (Mumbai)</span>
            </div>
            <div className="space-y-1">
              <span className="block text-3xl sm:text-4xl font-black text-brand-orange font-mono">5,000+</span>
              <span className="block text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wider">Powder Coating Ovens</span>
            </div>
            <div className="space-y-1">
              <span className="block text-3xl sm:text-4xl font-black text-brand-orange font-mono">4,000+</span>
              <span className="block text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wider">Bakery Installations</span>
            </div>
            <div className="space-y-1">
              <span className="block text-3xl sm:text-4xl font-black text-brand-orange font-mono">1,000+</span>
              <span className="block text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wider">Hotel Kitchens Served</span>
            </div>
            <div className="space-y-1">
              <span className="block text-3xl sm:text-4xl font-black text-brand-orange font-mono">300+</span>
              <span className="block text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wider">Furnaces (Melting & Crematory)</span>
            </div>
            <div className="space-y-1">
              <span className="block text-3xl sm:text-4xl font-black text-brand-orange font-mono">200+</span>
              <span className="block text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wider">Steam Boilers</span>
            </div>
            <div className="space-y-1">
              <span className="block text-3xl sm:text-4xl font-black text-brand-orange font-mono">200+</span>
              <span className="block text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wider">Textile & Laundry Mills</span>
            </div>
            <div className="space-y-1">
              <span className="block text-3xl sm:text-4xl font-black text-brand-orange font-mono">100</span>
              <span className="block text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wider">Dal Mill Installations</span>
            </div>
          </div>
        </section>

        {/* Values section */}
        <section className="mb-24 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs uppercase font-extrabold text-brand-orange tracking-widest">Our Directives</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">Engineering Quality Philosophy</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <div
                key={i}
                className="bg-white dark:bg-[#0a1128]/50 border border-slate-200 dark:border-brand-slate/30 p-8 rounded-xl text-left space-y-4 hover:-translate-y-1 transition-transform shadow-sm"
              >
                <div className="bg-brand-orange/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  {v.icon}
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">{v.title}</h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Milestones timeline */}
        <section className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs uppercase font-extrabold text-brand-orange tracking-widest">Milestones</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">Our Journey</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {companyMilestones.map((m, i) => (
              <div
                key={i}
                className="bg-white dark:bg-[#0a1128]/30 border border-slate-200 dark:border-slate-800 p-6 rounded-xl relative shadow-sm"
              >
                <span className="text-2xl font-black text-brand-orange block mb-2">{m.year}</span>
                <h4 className="text-sm font-bold text-slate-950 dark:text-white">{m.title}</h4>
                <p className="text-slate-550 dark:text-slate-400 text-[11px] mt-1 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
