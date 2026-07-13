"use client";

import React, { useEffect, useRef, useState } from "react";
import { Circle, ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  src: string;
  alt: string;
}

const SLIDES: Slide[] = [
  { src: "/images/hero-burner.png", alt: "FlameTech FT-25 High-Efficiency Burner" },
  { src: "/images/Gemini_Generated_Image_m3fdh7m3fdh7m3fd.png", alt: "FlameTech dual-solenoid gas burner — studio product shot" },
  { src: "/images/Gemini_Generated_Image_r9kgvzr9kgvzr9kg.png", alt: "FlameTech FT.10 burner with sequence controller — studio product shot" },
  { src: "/images/Gemini_Generated_Image_98vlhh98vlhh98vl.png", alt: "FlameTech gas burner combustion head — studio product shot" },
  { src: "/images/Gemini_Generated_Image_ne1i47ne1i47ne1i.png", alt: "FlameTech control switch board — studio product shot" },
];

const SLIDE_DURATION_MS = 4000;

export default function HeroMediaCarousel({ className = "" }: { className?: string }) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, SLIDE_DURATION_MS);
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const goTo = (i: number) => {
    setIndex((i + SLIDES.length) % SLIDES.length);
    startTimer(); // restart the auto-advance clock so a manual action doesn't get cut short
  };

  return (
    <div className={`relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-white/10 bg-slate-950 ${className}`}>
      {SLIDES.map((s, i) => (
        <img
          key={s.src}
          src={s.src}
          alt={s.alt}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Prev / Next arrows */}
      <button
        onClick={() => goTo(index - 1)}
        aria-label="Previous slide"
        className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={() => goTo(index + 1)}
        aria-label="Next slide"
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
        {SLIDES.map((s, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
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
