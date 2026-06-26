"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Flame, ShieldCheck, Settings, Users, ArrowRight, Activity, Cpu, Wrench, Sparkles, AlertCircle, Compass } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Home() {
  const [selectedBurner, setSelectedBurner] = useState("ft-03");
  const [systemTime, setSystemTime] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const realBurnerRef = useRef<HTMLDivElement>(null);
  const ghostBurnerRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<SVGPathElement>(null);
  const line2Ref = useRef<SVGPathElement>(null);
  const line3Ref = useRef<SVGPathElement>(null);
  const spot1Ref = useRef<HTMLDivElement>(null);
  const spot2Ref = useRef<HTMLDivElement>(null);
  const spot3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Keep dynamic system clock ticking
    const timer = setInterval(() => {
      setSystemTime(new Date().toISOString().replace("T", " ").substring(0, 19));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Initialize GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    });

    // 3D rotation and scale dynamic shift
    tl.to(realBurnerRef.current, {
      rotateY: 45,
      rotateX: -12,
      scale: 1.1,
      x: 20,
      duration: 3,
    }, 0);

    // Cyan holographic scan diagnostics drift left
    tl.to(ghostBurnerRef.current, {
      x: -40,
      y: -15,
      rotateY: 15,
      scale: 1.05,
      duration: 3,
    }, 0);

    // Animate drawing lines
    tl.to(line1Ref.current, { strokeDashoffset: 0, duration: 1 }, 0.5);
    tl.to(line2Ref.current, { strokeDashoffset: 0, duration: 1 }, 1.2);
    tl.to(line3Ref.current, { strokeDashoffset: 0, duration: 1 }, 2);

    // Show hotspots points
    tl.to(spot1Ref.current, { opacity: 1, scale: 1.1, duration: 0.3 }, 0.8);
    tl.to(spot2Ref.current, { opacity: 1, scale: 1.1, duration: 0.3 }, 1.5);
    tl.to(spot3Ref.current, { opacity: 1, scale: 1.1, duration: 0.3 }, 2.3);

    // Scroll progress updates selector models
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        let modelId = "ft-03";
        if (p > 0.8) modelId = "ft-25";
        else if (p > 0.6) modelId = "ft-20";
        else if (p > 0.4) modelId = "ft-15";
        else if (p > 0.2) modelId = "ft-10";
        else if (p > 0.08) modelId = "ft-05";
        setSelectedBurner(modelId);
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const burnerModels = [
    {
      id: "ft-03",
      name: "FT-03",
      power: "30 - 90 KW",
      kcal: "25,000 - 77,000 Kcal/h",
      pressure: "20 - 50 mbar",
      motor: "90 W",
      flow: "3 - 9 m³/h",
      bestFor: "Commercial bakeries & small ovens",
    },
    {
      id: "ft-05",
      name: "FT-05",
      power: "50 - 150 KW",
      kcal: "43,000 - 129,000 Kcal/h",
      pressure: "20 - 50 mbar",
      motor: "150 W",
      flow: "5 - 15 m³/h",
      bestFor: "Powder coating & mid-size drying ovens",
    },
    {
      id: "ft-10",
      name: "FT-10",
      power: "100 - 300 KW",
      kcal: "86,000 - 258,000 Kcal/h",
      pressure: "25 - 60 mbar",
      motor: "250 W",
      flow: "10 - 30 m³/h",
      bestFor: "Large industrial steam boilers & heat rooms",
    },
    {
      id: "ft-15",
      name: "FT-15",
      power: "150 - 450 KW",
      kcal: "129,000 - 387,000 Kcal/h",
      pressure: "30 - 80 mbar",
      motor: "370 W",
      flow: "15 - 45 m³/h",
      bestFor: "Heavy machinery dryers & process kilns",
    },
    {
      id: "ft-20",
      name: "FT-20",
      power: "250 - 750 KW",
      kcal: "215,000 - 645,000 Kcal/h",
      pressure: "40 - 100 mbar",
      motor: "750 W",
      flow: "25 - 75 m³/h",
      bestFor: "Double stage metallurgy & utility burners",
    },
    {
      id: "ft-25",
      name: "FT-25",
      power: "400 - 1200 KW",
      kcal: "344,000 - 1,032,000 Kcal/h",
      pressure: "50 - 120 mbar",
      motor: "1500 W",
      flow: "40 - 120 m³/h",
      bestFor: "Steel plants & extreme thermal processes",
    },
  ];

  const selectedModel = burnerModels.find((m) => m.id === selectedBurner) || burnerModels[0];

  const coreBenefits = [
    {
      icon: <Activity className="w-6 h-6 text-brand-orange" />,
      title: "Optimized Fuel-to-Air Ratio",
      description: "Custom gas nozzle mixing design achieves complete combustion, lowering carbon soot and fuel consumption by up to 15%.",
    },
    {
      icon: <Cpu className="w-6 h-6 text-brand-orange" />,
      title: "Microprocessor-Safe Controls",
      description: "Our burner panels integrate self-checking flame supervision diagnostics, UV photocells, and emergency fuel cutoffs.",
    },
    {
      icon: <Wrench className="w-6 h-6 text-brand-orange" />,
      title: "470+ Standard Spares in Stock",
      description: "Ready-to-ship replacement valves, ignition electrodes, hoses, and controllers minimizing plant downtime.",
    },
  ];

  const industries = [
    {
      name: "Powder Coating",
      stat: "220+ Installs",
      desc: "Perfect temperature uniformity across oven volumes, ensuring high coating quality and quick cure cycles.",
      color: "from-orange-500/10 to-brand-orange/20 dark:from-orange-600/20 dark:to-brand-orange/40",
    },
    {
      name: "Commercial Bakeries",
      stat: "140+ Bakeries",
      desc: "Gentle indirect firing systems offering zero odor transfer and accurate heat profiling for high-output bread/biscuit tunnels.",
      color: "from-amber-500/10 to-brand-amber/20 dark:from-amber-600/20 dark:to-brand-amber/40",
    },
    {
      name: "Chemical & Boiler Firing",
      stat: "85+ Plants",
      desc: "Heavy-duty dual-fuel or high-pressure gas burners integrated with pressure-monitoring safeties for high-pressure boilers.",
      color: "from-blue-500/10 to-brand-teal/20 dark:from-blue-600/20 dark:to-brand-teal/40",
    },
  ];

  return (
    <div className="relative pt-20">
      {/* Interactive Blueprint Hero Track */}
      {/* Interactive Blueprint Hero Track */}
      <section 
        ref={containerRef} 
        className="relative w-full overflow-visible bg-slate-50 dark:bg-[#060b13] text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/5 select-none"
      >
        {/* Sticky Viewport */}
        <div className="relative lg:sticky lg:top-0 lg:h-screen h-auto w-full flex flex-col justify-between overflow-hidden engineering-grid pt-24 pb-8 z-20">
          {/* Cinematic backlighting glow */}
          <div className="absolute inset-0 cinematic-glow z-0 pointer-events-none"></div>

          {/* Blueprint Layout Grid Lines */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-slate-200 dark:bg-white/5 z-0"></div>
          <div className="absolute inset-x-0 bottom-0 h-[1px] bg-slate-200 dark:bg-white/5 z-0"></div>
          <div className="absolute inset-y-0 left-[20%] w-[1px] bg-slate-200 dark:bg-white/5 z-0 hidden lg:block"></div>
          <div className="absolute inset-y-0 right-[25%] w-[1px] bg-slate-200 dark:bg-white/5 z-0 hidden lg:block"></div>

          {/* Tech Stamps */}
          <div className="absolute top-24 left-6 text-[9px] font-mono tracking-widest text-slate-400 dark:text-slate-500 uppercase select-none z-10 hidden sm:block">
            [ FT_SYS_TRACKER: 0.1.0-REV4 ]
          </div>
          <div className="absolute top-24 right-6 text-[9px] font-mono tracking-widest text-slate-400 dark:text-slate-500 uppercase select-none z-10 hidden sm:block">
            [ SYS_TIME: {systemTime || "CONNECTING..."} ]
          </div>
          <div className="absolute bottom-6 left-6 text-[9px] font-mono tracking-widest text-slate-400 dark:text-slate-500 uppercase select-none z-10 hidden sm:block">
            [ GPS: 23°02'N // 72°35'E ]
          </div>
          <div className="absolute bottom-6 right-6 text-[9px] font-mono tracking-widest text-slate-400 dark:text-slate-500 uppercase select-none z-10 hidden sm:block">
            [ EST_SEEDS: NOMINAL ]
          </div>

          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center flex-1">
            {/* Left Column: Premium Technical Message */}
            <div className="lg:col-span-4 space-y-6 text-left relative z-10">
              <div className="inline-flex items-center space-x-2 text-[10px] tracking-[0.2em] uppercase font-bold text-brand-orange">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-ping"></span>
                <span>Diagnostics active</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.05] text-slate-900 dark:text-white uppercase font-sans">
                The Next <br />
                Generation of <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-orange-400 to-brand-amber">
                  Combustion.
                </span>
              </h1>
              <p className="text-slate-650 dark:text-slate-400 text-xs sm:text-sm max-w-sm leading-relaxed">
                Introducing the FT Series. Modular high-efficiency burners engineered for heavy-industry process kilns and steam boilers. Designed to achieve up to 15% fuel reduction.
              </p>
              
              <div className="flex flex-wrap gap-3 pt-2">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/products"
                    className="inline-block px-5 py-3 bg-brand-orange hover:bg-brand-orange/90 text-white font-bold rounded text-xs tracking-wider uppercase transition-all shadow-lg shadow-brand-orange/20"
                  >
                    B2B Catalog
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/services/amc"
                    className="inline-block px-5 py-3 bg-slate-200 dark:bg-slate-900 border border-slate-350 dark:border-slate-800 hover:bg-slate-300 dark:hover:bg-slate-800 text-slate-800 dark:text-white font-bold rounded text-xs tracking-wider uppercase transition-all"
                  >
                    SLA Service
                  </Link>
                </motion.div>
              </div>

              {/* High-Tech HUD Stats */}
              <div className="grid grid-cols-3 gap-4 border-t border-slate-200 dark:border-white/5 pt-6 mt-6 font-mono">
                <div>
                  <span className="block text-xl font-bold text-slate-900 dark:text-white">470+</span>
                  <span className="block text-[8px] text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-0.5">Spares In Stock</span>
                </div>
                <div>
                  <span className="block text-xl font-bold text-slate-900 dark:text-white">6</span>
                  <span className="block text-[8px] text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-0.5">Burner Ranges</span>
                </div>
                <div>
                  <span className="block text-xl font-bold text-slate-900 dark:text-white">14+</span>
                  <span className="block text-[8px] text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-0.5">Global Regions</span>
                </div>
              </div>
            </div>

            {/* Center Column: Interactive Disassembly & Hotspots */}
            <div className="lg:col-span-5 flex justify-center items-center relative py-12 lg:py-0">
              <div className="relative w-full h-[320px] flex items-center justify-center perspective-2000 preserve-3d">
                {/* Diagnostic cyan scanning ghost (slides left) */}
                <div 
                  ref={ghostBurnerRef}
                  className="absolute w-full h-auto flex items-center justify-center pointer-events-none opacity-0 select-none"
                  style={{ willChange: "transform" }}
                >
                  <img
                    src="/images/hero-burner.png"
                    alt="Diagnostics scan"
                    className="max-h-[280px] w-auto object-contain filter saturate-200 brightness-150 hue-rotate-180 invert opacity-60"
                  />
                </div>

                {/* Real physical product burner (rotates and slides right) */}
                <div 
                  ref={realBurnerRef}
                  className="absolute w-full h-auto flex items-center justify-center z-10"
                  style={{ willChange: "transform" }}
                >
                  <img
                    src="/images/hero-burner.png"
                    alt="FlameTech FT-25 High-Efficiency Burner"
                    className="max-h-[280px] w-auto object-contain filter drop-shadow-[0_25px_60px_rgba(242,100,25,0.15)]"
                  />
                </div>

                {/* Connecting lines overlay */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-20" viewBox="0 0 400 300">
                  <path
                    ref={line1Ref}
                    d="M 120,110 L 60,70"
                    fill="none"
                    stroke="#f26419"
                    strokeWidth="1.5"
                    strokeDasharray="200"
                    strokeDashoffset="200"
                    className="opacity-70"
                  />
                  <path
                    ref={line2Ref}
                    d="M 210,150 L 330,130"
                    fill="none"
                    stroke="#f26419"
                    strokeWidth="1.5"
                    strokeDasharray="200"
                    strokeDashoffset="200"
                    className="opacity-70"
                  />
                  <path
                    ref={line3Ref}
                    d="M 285,190 L 330,240"
                    fill="none"
                    stroke="#f26419"
                    strokeWidth="1.5"
                    strokeDasharray="200"
                    strokeDashoffset="200"
                    className="opacity-70"
                  />
                </svg>

                {/* Hotspot 1 point & card */}
                <div 
                  ref={spot1Ref}
                  className="absolute top-[35%] left-[28%] group cursor-pointer z-30 opacity-0 lg:scale-75"
                >
                  <span className="absolute inline-flex h-4 w-4 rounded-full bg-brand-orange/60 animate-ping"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-orange border border-white"></span>
                  <div className="absolute bottom-6 right-2 bg-white/95 dark:bg-slate-950/95 border border-slate-200 dark:border-white/10 text-left p-3 rounded-lg shadow-2xl backdrop-blur-md w-56 transition-all scale-95 group-hover:scale-100 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto">
                    <div className="text-[9px] font-bold text-brand-orange uppercase tracking-wider">Spark Electrode</div>
                    <div className="text-[11px] text-slate-650 dark:text-slate-300 font-medium mt-1 leading-snug">Glazed Alumina ceramic spark igniting fuel reliably at up to 1300°C.</div>
                  </div>
                </div>

                {/* Hotspot 2 point & card */}
                <div 
                  ref={spot2Ref}
                  className="absolute top-[48%] left-[50%] group cursor-pointer z-30 opacity-0 lg:scale-75"
                >
                  <span className="absolute inline-flex h-4 w-4 rounded-full bg-brand-orange/60 animate-ping" style={{ animationDelay: "0.3s" }}></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-orange border border-white"></span>
                  <div className="absolute top-6 left-2 bg-white/95 dark:bg-slate-950/95 border border-slate-200 dark:border-white/10 text-left p-3 rounded-lg shadow-2xl backdrop-blur-md w-56 transition-all scale-95 group-hover:scale-100 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto">
                    <div className="text-[9px] font-bold text-brand-orange uppercase tracking-wider">1400°C Combustion Head</div>
                    <div className="text-[11px] text-slate-650 dark:text-slate-300 font-medium mt-1 leading-snug">Custom gas/air mixing head creating homogeneous flame configurations.</div>
                  </div>
                </div>

                {/* Hotspot 3 point & card */}
                <div 
                  ref={spot3Ref}
                  className="absolute top-[60%] left-[69%] group cursor-pointer z-30 opacity-0 lg:scale-75"
                >
                  <span className="absolute inline-flex h-4 w-4 rounded-full bg-brand-orange/60 animate-ping" style={{ animationDelay: "0.6s" }}></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-orange border border-white"></span>
                  <div className="absolute top-6 left-2 bg-white/95 dark:bg-slate-950/95 border border-slate-200 dark:border-white/10 text-left p-3 rounded-lg shadow-2xl backdrop-blur-md w-56 transition-all scale-95 group-hover:scale-100 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto">
                    <div className="text-[9px] font-bold text-brand-orange uppercase tracking-wider">Solenoid Safety Block</div>
                    <div className="text-[11px] text-slate-655 dark:text-slate-300 font-medium mt-1 leading-snug">Class A safety valves with instantaneous emergency shutoff under 1s.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Diagnostic specs card (sticky-equivalent inside viewport) */}
            <div className="lg:col-span-3 relative z-10 w-full">
              <div className="glass-panel rounded-xl p-5 border border-slate-200 dark:border-white/5 bg-white/85 dark:bg-slate-900/85 backdrop-blur-lg shadow-2xl flex flex-col text-left">
                <span className="text-[9px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-1.5 block">Diagnostic Panel</span>
                <h3 className="text-slate-900 dark:text-white font-bold text-sm mb-4 flex items-center space-x-2">
                  <Settings className="w-4 h-4 text-brand-orange animate-spin" style={{ animationDuration: "15s" }} />
                  <span>Burner Comparison</span>
                </h3>

                {/* Model selector tabs */}
                <div className="grid grid-cols-3 gap-1 mb-5 bg-slate-100 dark:bg-black/40 p-1 rounded-lg relative">
                  {burnerModels.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedBurner(m.id)}
                      className={`relative py-1.5 px-1 text-[9px] font-extrabold rounded uppercase transition-colors duration-200 cursor-pointer z-10 ${
                        selectedBurner === m.id ? "text-slate-950 dark:text-white" : "text-slate-500 hover:text-slate-850 dark:hover:text-slate-350"
                      }`}
                    >
                      <span className="relative z-10">{m.name}</span>
                      {selectedBurner === m.id && (
                        <motion.div
                          layoutId="activeTabGlow"
                          className="absolute inset-0 bg-brand-orange/10 dark:bg-brand-orange/15 border border-brand-orange/30 dark:border-brand-orange/40 rounded z-0 pointer-events-none"
                          transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        />
                      )}
                    </button>
                  ))}
                </div>

                {/* Spec values with cross-fading */}
                <div className="space-y-3.5 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-white/5">
                    <span className="text-slate-500">Thermal Output</span>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={selectedModel.id + "-power"}
                        initial={{ opacity: 0, x: 5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -5 }}
                        transition={{ duration: 0.12 }}
                        className="font-mono font-semibold text-slate-800 dark:text-white"
                      >
                        {selectedModel.power}
                      </motion.span>
                    </AnimatePresence>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-white/5">
                    <span className="text-slate-500">Kcal Range</span>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={selectedModel.id + "-kcal"}
                        initial={{ opacity: 0, x: 5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -5 }}
                        transition={{ duration: 0.12 }}
                        className="font-mono font-semibold text-slate-800 dark:text-white"
                      >
                        {selectedModel.kcal}
                      </motion.span>
                    </AnimatePresence>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-white/5">
                    <span className="text-slate-500">Gas Pressure</span>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={selectedModel.id + "-pressure"}
                        initial={{ opacity: 0, x: 5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -5 }}
                        transition={{ duration: 0.12 }}
                        className="font-mono font-semibold text-slate-800 dark:text-white"
                      >
                        {selectedModel.pressure}
                      </motion.span>
                    </AnimatePresence>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-white/5">
                    <span className="text-slate-500">Gas Consumption</span>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={selectedModel.id + "-flow"}
                        initial={{ opacity: 0, x: 5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -5 }}
                        transition={{ duration: 0.12 }}
                        className="font-mono font-semibold text-slate-800 dark:text-white"
                      >
                        {selectedModel.flow}
                      </motion.span>
                    </AnimatePresence>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-white/5">
                    <span className="text-slate-500">Blower Motor</span>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={selectedModel.id + "-motor"}
                        initial={{ opacity: 0, x: 5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -5 }}
                        transition={{ duration: 0.12 }}
                        className="font-mono font-semibold text-slate-800 dark:text-white"
                      >
                        {selectedModel.motor}
                      </motion.span>
                    </AnimatePresence>
                  </div>

                  <div className="pt-2 text-[9px] text-slate-500 dark:text-slate-400 italic">
                    <span className="text-brand-orange font-bold font-mono">APP_SECTOR: </span>
                    {selectedModel.bestFor}
                  </div>
                </div>

                <div className="mt-5">
                  <Link
                    href={`/products/${selectedModel.id}`}
                    className="block text-center w-full py-2 bg-brand-orange/10 hover:bg-brand-orange/20 border border-brand-orange/30 text-brand-orange text-[9px] font-bold rounded tracking-wider uppercase transition-all"
                  >
                    View CAD Spec Sheet
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Benefits */}
      <section className="bg-white dark:bg-brand-dark py-24 border-y border-slate-200 dark:border-brand-slate/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-xs uppercase font-extrabold text-brand-orange tracking-widest">Why B2B Plants Choose Us</h2>
            <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">Advanced Thermal Efficiency & Control</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
              For over a decade, we have engineered combustion devices that minimize environmental emissions and lower production overhead.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreBenefits.map((benefit, i) => (
              <div
                key={i}
                className="bg-slate-50 dark:bg-[#0a1128]/50 border border-slate-200 dark:border-brand-slate/30 p-8 rounded-xl text-left space-y-4 transition-transform hover:-translate-y-1 shadow-sm"
              >
                <div className="bg-brand-orange/10 w-12 h-12 rounded-lg flex items-center justify-center mb-2">
                  {benefit.icon}
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">{benefit.title}</h4>
                <p className="text-slate-650 dark:text-slate-400 text-sm leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="bg-gradient-to-b from-slate-50 to-slate-100 dark:from-brand-navy dark:to-brand-dark py-24 relative overflow-hidden border-b border-slate-200 dark:border-transparent">
        {/* Glow */}
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-brand-orange/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
            <div className="text-left space-y-3">
              <h2 className="text-xs uppercase font-extrabold text-brand-orange tracking-widest">Application Sectors</h2>
              <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">Industries We Serve</h3>
            </div>
            <Link
              href="/products"
              className="text-brand-orange text-sm font-semibold hover:text-slate-950 dark:hover:text-white transition-colors flex items-center space-x-1 shrink-0"
            >
              <span>View industry solutions catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {industries.map((ind, i) => (
              <div
                key={i}
                className={`relative overflow-hidden rounded-xl border border-slate-200 dark:border-brand-slate/35 bg-gradient-to-br ${ind.color} p-8 text-left space-y-4`}
              >
                <div className="flex justify-between items-start">
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white">{ind.name}</h4>
                  <span className="bg-brand-orange/20 text-brand-orange text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded">
                    {ind.stat}
                  </span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{ind.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AMC / Maintenance Service Plan Callout */}
      <section className="bg-slate-100 dark:bg-brand-navy border-t border-slate-200 dark:border-brand-slate/40 py-20 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-brand-teal/10 border border-brand-teal/30 rounded-full text-brand-teal text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>24/7 Operations Safety</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            Combustion Maintenance & AMC Contracts
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base max-w-3xl mx-auto leading-relaxed">
            Industrial burner down-time is expensive. Our signature AMC package offers bi-monthly site inspections, full combustion analysis calibration, and emergency callouts.
          </p>
          <div className="bg-white/80 dark:bg-[#060b13]/60 max-w-lg mx-auto p-6 rounded-xl border border-slate-200 dark:border-brand-slate/40 shadow-inner shadow-sm">
            <span className="block text-slate-500 dark:text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Affordable B2B SLA Pricing</span>
            <span className="text-4xl font-black text-slate-900 dark:text-white">₹799<span className="text-lg font-medium text-slate-500 dark:text-slate-400">/visit</span></span>
            <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-1">Plus 18% GST. Billed annually at ₹4,794 + GST per burner.</span>
          </div>
          <div>
            <Link
              href="/services/amc"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-brand-orange hover:bg-brand-orange/95 text-white font-bold rounded-md text-sm shadow-md transition-all"
            >
              <span>Calculate AMC Quote</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
