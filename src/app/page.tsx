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
  const [isMounted, setIsMounted] = useState(false);

  // 360 Explorer state
  const [explorerTab, setExplorerTab] = useState("ft-3");
  const [rotationDegrees, setRotationDegrees] = useState(0);

  const explorerProducts = [
    {
      id: "ft-3",
      name: "FT-3 Gas Burner",
      image: "/images/ft-03.jpg",
      badge: "COMPACT",
      output: "35,000 Kcal/hr",
      usage: "Commercial bakeries, institutional kitchen ovens, small textile drying ovens, and light industrial dryers.",
      usedBy: "Hotels, bakery chains, small engineering workshops, textile SMEs. Ideal for shops needing 24/7 reliable compact heat.",
      industries: ["Bakery", "Hospitality", "Textile"],
      specifications: [
        { label: "Thermal Output", value: "35,000 Kcal/hr" },
        { label: "Fuel", value: "LPG / PNG / Natural Gas" },
        { label: "Gas Pressure", value: "20–50 mbar" },
        { label: "Motor Power", value: "90 W" },
        { label: "Power Supply", value: "230V / 1Ph / 50Hz" },
      ],
      hotspots: [
        { min: 0, max: 119, label: "Auto Spark Ignition", desc: "Glazed ceramic spark electrode ignites fuel reliably. No pilot light needed — instant on-demand combustion." },
        { min: 120, max: 240, label: "Gas Mixing Nozzle", desc: "Precisely engineered air-gas mixing head ensures clean combustion and minimal carbon soot output." },
        { min: 241, max: 360, label: "Photocell Flame Guard", desc: "UV photocell continuously scans for active flame. Lockout in < 3 seconds if flame is lost." }
      ]
    },
    {
      id: "ft-5",
      name: "FT-5 Gas Burner",
      image: "/images/ft-05.jpg",
      badge: "POPULAR",
      output: "90,000 Kcal/hr",
      usage: "Medium powder-coating ovens, industrial pre-treatment tunnels, paint-drying booths, mid-size bakery tunnel ovens, hot water boilers.",
      usedBy: "Powder coating SMEs, auto-parts manufacturers, paint shop operators, pharma packaging plants.",
      industries: ["Powder Coating", "Automotive", "Pharma"],
      specifications: [
        { label: "Thermal Output", value: "90,000 Kcal/hr" },
        { label: "Fuel", value: "LPG / Natural Gas / PNG" },
        { label: "Gas Pressure", value: "20–50 mbar" },
        { label: "Motor Power", value: "135 W" },
        { label: "Blast Tube", value: "6 inch SS" },
      ],
      hotspots: [
        { min: 0, max: 119, label: "Ceramic Ignition Electrode", desc: "Kanthal alloy tip survives repeated thermal cycling up to 1300°C. Easy field replacement." },
        { min: 120, max: 240, label: "Sealed Combustion Head", desc: "Anti-flame rollback system with positive sealing. Approved for outdoor-rated and weatherproof enclosures." },
        { min: 241, max: 360, label: "Sequence Controller", desc: "Automatic startup sequence manages pre-purge, ignition, and valve open timing with safety lockout on failure." }
      ]
    },
    {
      id: "ft-10",
      name: "FT-10 Gas Burner",
      image: "/images/ft-10.jpg",
      badge: "INDUSTRIAL",
      output: "110,000 Kcal/hr",
      usage: "Large industrial tunnel ovens, autoclave sterilizers, steam generation boilers, large industrial dryers, process heating chambers.",
      usedBy: "Chemical plants, pharmaceutical manufacturers, large bakeries, metal pre-treatment units, steam boiler operators.",
      industries: ["Chemical", "Pharma", "Metal"],
      specifications: [
        { label: "Thermal Output", value: "110,000 Kcal/hr (128 KW)" },
        { label: "Fuel", value: "LPG / Natural Gas / CNG" },
        { label: "Gas Pressure", value: "25–60 mbar" },
        { label: "Motor Power", value: "200 W" },
        { label: "Blast Tube", value: "12 inch SS" },
      ],
      hotspots: [
        { min: 0, max: 119, label: "Air Pressure Switch", desc: "Prevents unsafe ignition if blower airflow is insufficient. Mandatory safety interlock for boiler applications." },
        { min: 120, max: 240, label: "Combustion Chamber Insert", desc: "Cast-iron body withstands harsh environments. Rated for 24/7 continuous operation without downtime." },
        { min: 241, max: 360, label: "Solenoid Safety Block", desc: "Class A gas solenoid valve cuts fuel in < 1 second on power loss or flame failure detection." }
      ]
    },
    {
      id: "ft-15",
      name: "FT-15 Two-Stage Burner",
      image: "/images/ft-15.jpg",
      badge: "HIGH-TEMP",
      output: "150,000 Kcal/hr",
      usage: "Ceramic kilns, glass annealing ovens, forging furnaces, heat-treatment chambers, asphalt mixing plants, galvanizing baths.",
      usedBy: "Ceramics factories, glass manufacturers, metal heat-treaters, asphalt plant operators, galvanizing plant engineers.",
      industries: ["Ceramics", "Glass", "Metal"],
      specifications: [
        { label: "Thermal Output", value: "150,000 Kcal/hr" },
        { label: "Max Furnace Temp", value: "1,500 °C" },
        { label: "Control Type", value: "Two Stage (Hi/Low Fire)" },
        { label: "Motor Power", value: "200 W" },
        { label: "Blast Tube", value: "Refractory Grade, 14 inch" },
      ],
      hotspots: [
        { min: 0, max: 119, label: "Two-Stage Firing Control", desc: "High/low fire switching reduces thermal shock in delicate processes like ceramics and glass annealing." },
        { min: 120, max: 240, label: "Refractory Blast Tube", desc: "High-temperature rated blast tube with ceramic lining handles continuous 1500°C kiln environments." },
        { min: 241, max: 360, label: "Siemens LME Sequence", desc: "Siemens LME22 automatic control unit manages startup sequence, safety checks, and two-stage valve timing." }
      ]
    },
    {
      id: "ftd-10",
      name: "FTD-10 Oil Burner",
      image: "/images/ftd-10.jpg",
      badge: "DIESEL/OIL",
      output: "100,000 Kcal/hr",
      usage: "Heavy-duty industrial boilers, large textile stenter machines, pharmaceutical WFI distillation units, industrial laundries.",
      usedBy: "Textile mills, pharma water plants, industrial laundries, large capacity boiler operators, steel plant auxiliary systems.",
      industries: ["Textile", "Pharma", "Boiler"],
      specifications: [
        { label: "Thermal Output", value: "100,000 Kcal/hr (116 KW)" },
        { label: "Fuel", value: "HSD / LDO / Diesel" },
        { label: "Oil Pressure", value: "10 – 20 bar" },
        { label: "Motor Power", value: "200 W (IP54)" },
        { label: "Nozzle Type", value: "Dual Atomizing" },
      ],
      hotspots: [
        { min: 0, max: 119, label: "Suntec Oil Pump", desc: "High-pressure Suntec pump atomizes diesel at 10-20 bar. Self-priming design removes air locks on startup." },
        { min: 120, max: 240, label: "Dual Atomizing Nozzle", desc: "Dual-orifice nozzle creates ultra-fine fuel mist for complete combustion, reducing smoke and soot." },
        { min: 241, max: 360, label: "IP54 Motor", desc: "Weatherproof IP54 motor enclosure enables outdoor or rooftop boiler room installation without shelter." }
      ]
    },
    {
      id: "control-panel",
      name: "Burner Control Panel",
      image: "/images/oven-control-panel.jpg",
      badge: "AUTOMATION",
      output: "Full Auto",
      usage: "Automated burner control, flame failure safety monitoring, temperature profiling, conveyor speed control for industrial ovens.",
      usedBy: "Powder coating operators, pharma clean-room oven managers, food processing plants, industrial bakeries needing precise temperature control.",
      industries: ["Powder Coating", "Pharma", "Food"],
      specifications: [
        { label: "Temperature Control", value: "PID Digital (±1°C)" },
        { label: "Control Voltage", value: "230V / 415V AC" },
        { label: "Enclosure", value: "IP54 Powder-Coated" },
        { label: "Thermocouple Input", value: "K-Type / J-Type" },
        { label: "Motors Supported", value: "1 or 2 Motors" },
      ],
      hotspots: [
        { min: 0, max: 119, label: "PID Temperature Controller", desc: "Digital PID controller maintains oven temperature within ±1°C. Auto-tune function speeds up commissioning." },
        { min: 120, max: 240, label: "Relay Safety Circuit", desc: "Failsafe relay disconnects gas solenoid power if photocell detects flame failure. Prevents unsafe restarts." },
        { min: 241, max: 360, label: "Motor Overload Protection", desc: "Individual thermal overload relays per motor prevent burnout. Trip indication and manual reset on panel front." }
      ]
    },
  ];

  const activeExplorer = explorerProducts.find((p) => p.id === explorerTab) || explorerProducts[0];
  const activeHotspot = activeExplorer.hotspots.find(
    (h) => rotationDegrees >= h.min && rotationDegrees <= h.max
  ) || activeExplorer.hotspots[0];

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
    setIsMounted(true);
    // Set initial time immediately on mount
    setSystemTime(new Date().toISOString().replace("T", " ").substring(0, 19));
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

    // Scale and horizontal drift dynamic shift
    tl.to(realBurnerRef.current, {
      scale: 1.12,
      x: 25,
      duration: 3,
    }, 0);

    // Cyan holographic scan diagnostics drift left flatly and fade in
    tl.to(ghostBurnerRef.current, {
      x: -35,
      y: -10,
      scale: 1.08,
      opacity: 0.6,
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
      iconName: "activity" as const,
      title: "Optimized Fuel-to-Air Ratio",
      description: "Custom gas nozzle mixing design achieves complete combustion, lowering carbon soot and fuel consumption by up to 15%.",
    },
    {
      iconName: "cpu" as const,
      title: "Microprocessor-Safe Controls",
      description: "Our burner panels integrate self-checking flame supervision diagnostics, UV photocells, and emergency fuel cutoffs.",
    },
    {
      iconName: "wrench" as const,
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
        className="relative w-full overflow-visible bg-slate-50 dark:bg-[#060b13] text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/5 select-none lg:h-[180vh] h-auto"
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
          <div
            suppressHydrationWarning
            className="absolute top-24 right-6 text-[9px] font-mono tracking-widest text-slate-400 dark:text-slate-500 uppercase select-none z-10 hidden sm:block"
          >
            {isMounted ? `[ SYS_TIME: ${systemTime} ]` : "[ SYS_TIME: -- ]"}
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
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm max-w-sm leading-relaxed">
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
                    className="inline-block px-5 py-3 bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:bg-slate-300 dark:hover:bg-slate-800 text-slate-800 dark:text-white font-bold rounded text-xs tracking-wider uppercase transition-all"
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
              <div className="relative w-full h-[320px] flex items-center justify-center">
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
                    <div className="text-[11px] text-slate-500 dark:text-slate-300 font-medium mt-1 leading-snug">Glazed Alumina ceramic spark igniting fuel reliably at up to 1300°C.</div>
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
                    <div className="text-[11px] text-slate-500 dark:text-slate-300 font-medium mt-1 leading-snug">Custom gas/air mixing head creating homogeneous flame configurations.</div>
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
                    <div className="text-[11px] text-slate-500 dark:text-slate-300 font-medium mt-1 leading-snug">Class A safety valves with instantaneous emergency shutoff under 1s.</div>
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
                        selectedBurner === m.id ? "text-slate-950 dark:text-white" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
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

      {/* 360° Interactive Product Explorer */}
      <section className="bg-slate-100 dark:bg-brand-navy/35 py-24 border-b border-slate-200 dark:border-brand-slate/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-xs uppercase font-extrabold text-brand-orange tracking-widest">Interactive Inspection</h2>
            <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">360° Product &amp; Applications Explorer</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
              Select any burner or panel below. Rotate the slider to inspect key components — see exactly where each product is used, who deploys it, and what specifications make it the industrial standard.
            </p>
          </div>

          {/* Product selector tabs — horizontal scrollable on mobile */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-10 justify-start lg:justify-center scrollbar-hide">
            {explorerProducts.map((p) => (
              <button
                key={p.id}
                onClick={() => { setExplorerTab(p.id); setRotationDegrees(0); }}
                className={`shrink-0 flex flex-col items-center gap-1 px-4 py-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  explorerTab === p.id
                    ? "bg-brand-orange text-white border-brand-orange shadow-md shadow-brand-orange/20"
                    : "bg-white dark:bg-slate-900/60 border-slate-200 dark:border-brand-slate/30 text-slate-700 dark:text-slate-300 hover:border-brand-orange/40"
                }`}
              >
                <span className={`text-[9px] font-extrabold tracking-wider px-1.5 py-0.5 rounded ${
                  explorerTab === p.id ? "bg-white/20" : "bg-brand-orange/10 text-brand-orange"
                }`}>{p.badge}</span>
                <span>{p.name}</span>
                <span className={`text-[9px] font-mono ${
                  explorerTab === p.id ? "text-white/70" : "text-slate-400"
                }`}>{p.output}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Technical Specifications */}
            <div className="lg:col-span-3 space-y-4 text-left">
              <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-brand-slate/30 p-5 rounded-xl space-y-3 shadow-sm">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 mb-1">
                  <Settings className="w-4 h-4 text-brand-orange" />
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">Technical Specs</h4>
                </div>
                <div className="space-y-2 text-xs">
                  {activeExplorer.specifications.map((s, idx) => (
                    <div key={idx} className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/40 last:border-0">
                      <span className="text-slate-500 font-medium">{s.label}</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-white text-right ml-2">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Industries */}
              <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-brand-slate/30 p-5 rounded-xl shadow-sm">
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">Industries</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeExplorer.industries.map((ind) => (
                    <span key={ind} className="bg-brand-orange/10 text-brand-orange text-[9px] font-bold px-2 py-1 rounded uppercase tracking-wide">{ind}</span>
                  ))}
                </div>
              </div>

              {/* Where used */}
              <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-brand-slate/30 p-5 rounded-xl shadow-sm">
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Where It Is Used</span>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">{activeExplorer.usage}</p>
              </div>
            </div>

            {/* Center: 360 Rotation Simulation View */}
            <div className="lg:col-span-6 flex flex-col justify-center items-center bg-white dark:bg-[#060b13]/55 border border-slate-200 dark:border-brand-slate/35 p-8 rounded-2xl shadow-lg relative min-h-[440px]">
              
              {/* HUD Details */}
              <div className="absolute top-4 left-4 font-mono text-[9px] text-slate-400 dark:text-slate-500 space-y-0.5 select-none text-left">
                <div>[ SCAN_SECTOR: ACTIVE ]</div>
                <div>[ Y_ANGLE: {rotationDegrees}° ]</div>
                <div>[ MODEL: {activeExplorer.badge} ]</div>
              </div>
              <div className="absolute top-4 right-4 font-mono text-[9px] text-slate-400 dark:text-slate-500 select-none text-right">
                <div>[ OUTPUT: {activeExplorer.output} ]</div>
              </div>

              {/* Product Image - rotatable */}
              <div className="relative w-full h-[260px] flex items-center justify-center overflow-visible select-none mt-4">
                <div
                  className="w-full h-full flex items-center justify-center transition-transform duration-100 ease-out"
                  style={{ transform: `perspective(1000px) rotateY(${rotationDegrees * 0.3}deg)` }}
                >
                  <img
                    src={activeExplorer.image}
                    alt={activeExplorer.name}
                    onError={(e) => { e.currentTarget.src = "/images/hero-burner.png"; }}
                    className="max-h-[240px] w-auto object-contain filter drop-shadow-[0_20px_50px_rgba(242,100,25,0.18)] transition-all duration-300"
                  />
                </div>
                {/* Hotspot glow ring */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-48 h-48 rounded-full border border-brand-orange/10 animate-pulse" style={{ animationDuration: "3s" }} />
                </div>
              </div>

              {/* Angle Slider controller */}
              <div className="w-full space-y-2 mt-6">
                <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <span>Drag to Inspect</span>
                  <span className="text-brand-orange font-mono font-bold">{rotationDegrees}° View</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={rotationDegrees}
                  onChange={(e) => setRotationDegrees(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-orange"
                />
                <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                  <span>0° Front</span>
                  <span>90° Side</span>
                  <span>180° Rear</span>
                  <span>270° Side</span>
                  <span>360° Front</span>
                </div>
              </div>

              {/* Active hotspot description bar */}
              <div className="w-full mt-5 p-4 bg-brand-orange/5 border border-brand-orange/20 rounded-xl">
                <span className="text-[9px] font-bold text-brand-orange uppercase tracking-wider block mb-1">
                  [SCAN] {activeHotspot.label}
                </span>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">{activeHotspot.desc}</p>
              </div>
            </div>

            {/* Right: Who uses it & CTA */}
            <div className="lg:col-span-3 space-y-4 text-left">
              <div className="bg-brand-orange text-white p-5 rounded-xl space-y-2 shadow-lg">
                <span className="text-[9px] font-bold uppercase tracking-wider opacity-80 block">Featured Product</span>
                <h4 className="font-black text-lg">{activeExplorer.name}</h4>
                <div className="text-white/80 text-xs">Output: <span className="font-bold font-mono text-white">{activeExplorer.output}</span></div>
                <Link
                  href="/products"
                  className="block text-center w-full py-2 bg-white text-brand-orange font-bold rounded text-xs tracking-wider uppercase mt-3 hover:bg-orange-50 transition-all"
                >
                  View Full Specs →
                </Link>
                <Link
                  href="/contact"
                  className="block text-center w-full py-2 bg-white/20 hover:bg-white/30 text-white font-bold rounded text-xs tracking-wider uppercase transition-all border border-white/30"
                >
                  Request Quote
                </Link>
              </div>

              <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-brand-slate/30 p-5 rounded-xl shadow-sm">
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Who Deploys It</span>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">{activeExplorer.usedBy}</p>
              </div>

              {/* Component Hotspot indicators */}
              <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-brand-slate/30 p-5 rounded-xl shadow-sm space-y-2">
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Component Zones</span>
                {activeExplorer.hotspots.map((h, idx) => (
                  <button
                    key={idx}
                    onClick={() => setRotationDegrees(h.min + 10)}
                    className={`w-full text-left p-2 rounded-lg text-xs transition-all cursor-pointer ${
                      activeHotspot.label === h.label
                        ? "bg-brand-orange/10 border border-brand-orange/30 text-brand-orange"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-400 border border-transparent"
                    }`}
                  >
                    <span className="font-bold block">{h.label}</span>
                    <span className="text-[9px] opacity-70">{h.min}° – {h.max}° view range</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ================================================================ */}
      {/* FEATURED PRODUCTS — 6 product showcase with full detail */}
      {/* ================================================================ */}
      <section className="bg-white dark:bg-brand-dark py-24 border-b border-slate-200 dark:border-brand-slate/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-xs uppercase font-extrabold text-brand-orange tracking-widest">Our Product Line</h2>
            <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">Featured Industrial Products</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
              From compact bakery burners to 450,000 Kcal/hr industrial furnace systems — every product is designed in-house, assembled with CE-grade components, and backed by our 24-hour service SLA.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[
              {
                slug: "ft-5-gas-burner",
                name: "FT-5 Gas Burner",
                badge: "BESTSELLER",
                badgeColor: "bg-brand-orange",
                image: "/images/ft-05.jpg",
                output: "90,000 Kcal/hr",
                category: "Gas Burner",
                price: "₹32,000",
                priceNote: "+ 18% GST",
                desc: "Fully automatic single-stage gas burner for powder coating ovens, industrial pre-treatment tunnels, and bakery operations. Includes auto sequence controller, UV photocell flame guard, and stainless blast tube.",
                tags: ["LPG", "PNG", "Natural Gas"],
                specs: [
                  { label: "Output", value: "90,000 Kcal/hr" },
                  { label: "Motor", value: "135 W" },
                  { label: "Blast Tube", value: "6 inch SS" },
                ],
                usedIn: ["Powder Coating Ovens", "Bakery Tunnels", "Pre-Treatment Lines"],
              },
              {
                slug: "ft-10-gas-burner",
                name: "FT-10 Gas Burner",
                badge: "INDUSTRIAL",
                badgeColor: "bg-slate-700",
                image: "/images/ft-10.jpg",
                output: "110,000 Kcal/hr",
                category: "Gas Burner",
                price: "₹35,000",
                priceNote: "+ 18% GST",
                desc: "Heavy-duty industrial gas burner rated for continuous 24/7 operation. Ideal for large autoclave sterilizers, steam boilers, industrial drying chambers, and chemical process heating units.",
                tags: ["CNG", "LPG", "Natural Gas"],
                specs: [
                  { label: "Output", value: "110,000 Kcal/hr" },
                  { label: "Motor", value: "200 W" },
                  { label: "Blast Tube", value: "12 inch SS" },
                ],
                usedIn: ["Steam Boilers", "Autoclave Systems", "Process Heating"],
              },
              {
                slug: "ft-15-two-stage-gas-burner",
                name: "FT-15 Two-Stage Burner",
                badge: "HIGH-TEMP",
                badgeColor: "bg-red-600",
                image: "/images/ft-15.jpg",
                output: "150,000 Kcal/hr",
                category: "Gas Burner",
                price: "₹45,000",
                priceNote: "+ 18% GST",
                desc: "Two-stage high-temperature gas burner for ceramic kilns, glass annealing ovens, and metal heat-treatment furnaces. Siemens LME sequence controller, refractory blast tube, and high/low fire modulation.",
                tags: ["1500°C Rated", "Two-Stage", "Siemens"],
                specs: [
                  { label: "Max Temp", value: "1,500 °C" },
                  { label: "Motor", value: "200 W" },
                  { label: "Control", value: "Hi/Lo Fire" },
                ],
                usedIn: ["Ceramic Kilns", "Glass Annealing", "Forging Furnaces"],
              },
              {
                slug: "ft-25-gas-burner",
                name: "FT-25 Industrial Burner",
                badge: "FLAGSHIP",
                badgeColor: "bg-purple-700",
                image: "/images/ft-25.jpg",
                output: "450,000 Kcal/hr",
                category: "Gas Burner",
                price: "Quote Only",
                priceNote: "B2B enquiry",
                desc: "FlameTech's most powerful gas burner. 1HP motor, 6-inch SS blast tube, Siemens LME73 controller, and air damper servo motor. CE-compliant low-NOx design for rotary kilns, asphalt drums, and large boilers.",
                tags: ["1HP Motor", "Siemens", "Low-NOx"],
                specs: [
                  { label: "Output", value: "450,000 Kcal/hr" },
                  { label: "Motor", value: "1 HP" },
                  { label: "Controller", value: "Siemens LME73" },
                ],
                usedIn: ["Rotary Kilns", "Asphalt Plants", "Utility Boilers"],
              },
              {
                slug: "ftd-10-oil-burner",
                name: "FTD-10 Diesel Oil Burner",
                badge: "OIL/DIESEL",
                badgeColor: "bg-amber-600",
                image: "/images/ftd-10.jpg",
                output: "100,000 Kcal/hr",
                category: "Oil Burner",
                price: "₹56,000",
                priceNote: "+ 18% GST",
                desc: "Heavy-duty diesel oil burner with dual atomizing nozzle, Suntec high-pressure pump, and IP54 weatherproof motor. Suitable for textile stenter machines, pharma WFI units, and industrial laundry boilers.",
                tags: ["HSD", "LDO", "IP54 Motor"],
                specs: [
                  { label: "Output", value: "100,000 Kcal/hr" },
                  { label: "Oil Pressure", value: "10–20 bar" },
                  { label: "Nozzle", value: "Dual Atomizing" },
                ],
                usedIn: ["Textile Stenters", "Pharma Boilers", "Industrial Laundry"],
              },
              {
                slug: "oven-control-panel",
                name: "Oven Control Panel",
                badge: "AUTOMATION",
                badgeColor: "bg-teal-600",
                image: "/images/oven-control-panel.jpg",
                output: "Full Auto",
                category: "Control Panel",
                price: "₹10,000",
                priceNote: "+ 18% GST",
                desc: "Complete oven control panel with PID temperature controller (±1°C accuracy), K/J thermocouple input, burner relay control, conveyor speed control, and motor overload protection. Factory tested and pre-wired.",
                tags: ["PID Control", "IP54", "K-Type"],
                specs: [
                  { label: "Accuracy", value: "±1°C" },
                  { label: "Temp Range", value: "0–1200°C" },
                  { label: "Enclosure", value: "IP54" },
                ],
                usedIn: ["Powder Coating Ovens", "Food Processing", "Pharma Clean Rooms"],
              },
            ].map((product) => (
              <div
                key={product.slug}
                className="group flex flex-col bg-slate-50 dark:bg-[#0a1128]/50 border border-slate-200 dark:border-brand-slate/30 rounded-2xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 shadow-sm"
              >
                {/* Image */}
                <div className="relative overflow-hidden h-52 bg-white dark:bg-[#060b13]/40 flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    onError={(e) => { e.currentTarget.src = "/images/hero-burner.png"; }}
                    className="h-44 w-auto object-contain group-hover:scale-105 transition-transform duration-500 filter drop-shadow-md"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`${product.badgeColor} text-white text-[9px] font-extrabold tracking-wider px-2.5 py-1 rounded uppercase`}>
                      {product.badge}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 text-[10px] font-bold text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded">
                    {product.category}
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-6 space-y-4">
                  <div>
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="text-slate-900 dark:text-white font-bold text-base">{product.name}</h4>
                    </div>
                    <div className="text-brand-orange font-mono text-xs font-bold">{product.output}</div>
                  </div>

                  <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">{product.desc}</p>

                  {/* Mini specs */}
                  <div className="bg-white dark:bg-slate-900/40 rounded-lg p-3 space-y-1">
                    {product.specs.map((s, si) => (
                      <div key={si} className="flex justify-between text-xs">
                        <span className="text-slate-500">{s.label}</span>
                        <span className="font-bold font-mono text-slate-800 dark:text-white">{s.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Used in tags */}
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider block mb-1.5">Used In:</span>
                    <div className="flex flex-wrap gap-1">
                      {product.usedIn.map((u) => (
                        <span key={u} className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[9px] font-bold px-2 py-0.5 rounded">{u}</span>
                      ))}
                    </div>
                  </div>

                  {/* Fuel tags */}
                  <div className="flex flex-wrap gap-1">
                    {product.tags.map((tag) => (
                      <span key={tag} className="border border-brand-orange/30 text-brand-orange text-[9px] font-bold px-2 py-0.5 rounded">{tag}</span>
                    ))}
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 mt-auto">
                    <div>
                      <div className="text-slate-900 dark:text-white font-black text-base">{product.price}</div>
                      <div className="text-slate-400 text-[9px]">{product.priceNote}</div>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/products/${product.slug}`}
                        className="px-3 py-2 bg-brand-orange/10 hover:bg-brand-orange/20 border border-brand-orange/30 text-brand-orange text-[10px] font-bold rounded uppercase tracking-wide transition-all"
                      >
                        Details
                      </Link>
                      <Link
                        href="/contact"
                        className="px-3 py-2 bg-brand-orange hover:bg-brand-orange/90 text-white text-[10px] font-bold rounded uppercase tracking-wide transition-all"
                      >
                        Quote
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View all CTA */}
          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-brand-orange hover:bg-brand-orange/90 text-white font-bold rounded-lg text-sm shadow-lg shadow-brand-orange/20 transition-all hover:scale-105"
            >
              <Flame className="w-4 h-4" />
              <span>View Full Product Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-slate-400 dark:text-slate-500 text-xs mt-3">35+ products across 5 categories · Spare parts · Services · AMC Contracts</p>
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
                  {benefit.iconName === "activity" && <Activity className="w-6 h-6 text-brand-orange" />}
                  {benefit.iconName === "cpu" && <Cpu className="w-6 h-6 text-brand-orange" />}
                  {benefit.iconName === "wrench" && <Wrench className="w-6 h-6 text-brand-orange" />}
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">{benefit.title}</h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{benefit.description}</p>
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
