"use client";

import React, { useEffect, useState } from "react";
import { Circle } from "lucide-react";

interface Slide {
  src: string;
  alt: string;
}

const SLIDES: Slide[] = [
  { src: "/images/hero-burner.png", alt: "FlameTech FT-25 High-Efficiency Burner" },
  { src: "/images/Gemini_Generated_Image_m3fdh7m3fdh7m3fd.png", alt: "FlameTech dual-solenoid gas burner — studio product shot" },
  { src: "/images/Gemini_Generated_Image_r9kgvzr9kgvzr9kg.png", alt: "FlameTech FT.10 burner with sequence controller — studio product shot" },
  { src: "/images/Gemini_Generated_Image_98vlhh98vlhh98vl.png", alt: "FlameTech gas burner combustion head — studio product shot" },
  { src: "/images/Gemini_Generated_Image_ne1i47ne1i47ne1i.png", alt: "FlameTech Switch Board — studio product shot" },
];

const SLIDE_DURATION_MS = 3500;

export default function HeroMediaCarousel({ className = "" }: { className?: string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(timer);
  }, []);

  const active = SLIDES[index];

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-white/10 ${className}`}>
      <img
        key={active.src}
        src={active.src}
        alt={active.alt}
        className="w-full h-auto block"
      />

      {/* Slide indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
        {SLIDES.map((s, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Show slide ${i + 1}`}
            className="p-1"
          >
            <Circle
              className={`w-1.5 h-1.5 transition-all ${
                i === index ? "fill-brand-orange text-brand-orange scale-125" : "fill-white/60 text-white/60"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
