"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, Mail, Phone, MapPin, ExternalLink } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <footer className="bg-slate-100 dark:bg-brand-navy border-t border-slate-200 dark:border-brand-slate/40 text-slate-600 dark:text-slate-400 mt-auto pt-16 pb-28 sm:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            
            {/* Brand Col */}
            <div className="space-y-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="bg-brand-orange p-2 rounded-lg flex items-center justify-center">
                  <Flame className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-lg font-bold tracking-wider text-slate-900 dark:text-white">
                    FLAME<span className="text-brand-orange">TECH</span>
                  </span>
                  <span className="block text-[8px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold leading-none">
                    Engineering
                  </span>
                </div>
              </Link>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed pt-2">
                Industrial gas & oil burner manufacturers and service providers. Standard-setting B2B combustion systems, custom controllers, and 24/7 technical AMC support.
              </p>
              <div className="flex space-x-3 pt-2">
                <span className="px-2 py-1 bg-slate-200 dark:bg-brand-slate/30 border border-slate-300 dark:border-brand-slate/50 text-[10px] uppercase font-bold text-slate-700 dark:text-slate-300 rounded tracking-wider">
                  ISO 9001:2008
                </span>
                <span className="px-2 py-1 bg-slate-200 dark:bg-brand-slate/30 border border-slate-300 dark:border-brand-slate/50 text-[10px] uppercase font-bold text-slate-700 dark:text-slate-300 rounded tracking-wider">
                  CE Certified
                </span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-slate-900 dark:text-white text-sm font-semibold uppercase tracking-wider mb-6">
                Combustion Solutions
              </h3>
              <ul className="space-y-3.5 text-sm">
                <li>
                  <Link href="/products/category/gas-burners" className="hover:text-brand-orange dark:hover:text-white transition-colors">
                    Gas Burners (FT-03 to FT-25)
                  </Link>
                </li>
                <li>
                  <Link href="/products/category/oil-burners" className="hover:text-brand-orange dark:hover:text-white transition-colors">
                    Oil Burners
                  </Link>
                </li>
                <li>
                  <Link href="/products/category/control-panels" className="hover:text-brand-orange dark:hover:text-white transition-colors">
                    Automatic Control Panels
                  </Link>
                </li>
                <li>
                  <Link href="/products/category/spare-parts" className="hover:text-brand-orange dark:hover:text-white transition-colors">
                    Burner Spare Parts & Accessories
                  </Link>
                </li>
              </ul>
            </div>

            {/* Service Links */}
            <div>
              <h3 className="text-slate-900 dark:text-white text-sm font-semibold uppercase tracking-wider mb-6">
                Services & Agreements
              </h3>
              <ul className="space-y-3.5 text-sm">
                <li>
                  <Link href="/services/amc" className="hover:text-brand-orange dark:hover:text-white transition-colors">
                    Annual Maintenance Contracts (AMC)
                  </Link>
                </li>
                <li>
                  <Link href="/services/amc" className="hover:text-brand-orange dark:hover:text-white transition-colors text-xs text-brand-orange font-medium flex items-center space-x-1">
                    <span>₹799 + GST / Visit AMC Program</span>
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-brand-orange dark:hover:text-white transition-colors">
                    Request Combustion Analysis
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-brand-orange dark:hover:text-white transition-colors">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link href="/admin-login" className="text-xs text-slate-500 hover:text-brand-orange dark:hover:text-slate-300 transition-colors flex items-center space-x-1">
                    <span>Admin Panel Login</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Col */}
            <div className="space-y-4">
              <h3 className="text-slate-900 dark:text-white text-sm font-semibold uppercase tracking-wider mb-2">
                Corporate Office
              </h3>
              <ul className="space-y-3.5 text-sm">
                <li className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                  <span className="leading-relaxed text-slate-700 dark:text-slate-300 text-xs">
                    Shop No. 9, Ground Floor, Paradise Apts., 15 Wanja Wadi, Mahim (W), Mumbai - 400 016
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-brand-orange shrink-0" />
                  <a href="tel:+919869588728" className="hover:text-brand-orange dark:hover:text-white transition-colors text-slate-700 dark:text-slate-300">
                    +91 98695 88728
                  </a>
                </li>
                <li className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-brand-orange shrink-0" />
                  <a href="mailto:info@flametechengineering.com" className="hover:text-brand-orange dark:hover:text-white transition-colors text-slate-700 dark:text-slate-300">
                    info@flametechengineering.com
                  </a>
                </li>
              </ul>
              <div className="pt-2">
                <a
                  href="https://wa.me/919869588728?text=Hello%20FlameTech%20Engineering,%20I%20would%20like%20to%20inquire%20about%20your%20burners."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-700 text-white rounded-md text-xs font-semibold hover:bg-emerald-600 transition-all shadow-sm"
                >
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-brand-slate/40 mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
            <p>© {currentYear} FlameTech Engineering. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <Link href="/privacy" className="hover:text-slate-700 dark:hover:text-slate-300">Privacy Policy</Link>
              <Link href="/cookies" className="hover:text-slate-700 dark:hover:text-slate-300">Cookies Policy</Link>
              <Link href="/terms" className="hover:text-slate-700 dark:hover:text-slate-300">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Widget */}
      <a
        href="https://wa.me/919869588728?text=Hello%20FlameTech%20Engineering,%20I%20have%20an%20inquiry."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-4 sm:bottom-8 sm:right-8 z-50 flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 active:scale-95 transition-all text-white p-3 sm:p-3.5 rounded-full shadow-2xl group cursor-pointer"
        title="Chat with our Engineers on WhatsApp"
      >
        <svg
          className="w-6 h-6 sm:w-7 sm:h-7 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" />
        </svg>
        
        {/* Tooltip */}
        <span className="absolute right-16 scale-0 group-hover:scale-100 transition-all duration-200 bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-md whitespace-nowrap shadow-xl border border-slate-700 pointer-events-none">
          Talk to our Engineers
        </span>
        
        {/* Green pulse ring */}
        <span className="absolute inset-0 rounded-full bg-emerald-600 opacity-75 animate-ping -z-10 group-hover:opacity-40"></span>
      </a>
    </>
  );
}
