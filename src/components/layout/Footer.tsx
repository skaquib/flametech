import React from "react";
import Link from "next/link";
import { Flame, Mail, Phone, MapPin, ExternalLink } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-100 dark:bg-brand-navy border-t border-slate-200 dark:border-brand-slate/40 text-slate-600 dark:text-slate-400 mt-auto pt-16 pb-8">
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
                ISO 9001:2015
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
                <Link href="/products?category=gas-burners" className="hover:text-brand-orange dark:hover:text-white transition-colors">
                  Gas Burners (FT-03 to FT-25)
                </Link>
              </li>
              <li>
                <Link href="/products?category=oil-burners" className="hover:text-brand-orange dark:hover:text-white transition-colors">
                  Oil Burners
                </Link>
              </li>
              <li>
                <Link href="/products?category=control-panels" className="hover:text-brand-orange dark:hover:text-white transition-colors">
                  Automatic Control Panels
                </Link>
              </li>
              <li>
                <Link href="/products?category=spare-parts" className="hover:text-brand-orange dark:hover:text-white transition-colors">
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
                <span className="leading-relaxed text-slate-700 dark:text-slate-300">
                  Plot No. 47, FlameTech Engineering, G.I.D.C Industrial Area, Sector 26, Gandhinagar, Gujarat - 382026
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-brand-orange shrink-0" />
                <a href="tel:+919768417740" className="hover:text-brand-orange dark:hover:text-white transition-colors text-slate-700 dark:text-slate-300">
                  +91 97684 17740
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-brand-orange shrink-0" />
                <a href="mailto:info@flametech.com" className="hover:text-brand-orange dark:hover:text-white transition-colors text-slate-700 dark:text-slate-300">
                  info@flametech.com
                </a>
              </li>
            </ul>
            <div className="pt-2">
              <a
                href="https://wa.me/919768417740?text=Hello%20FlameTech%20Engineering,%20I%20would%20like%20to%20inquire%20about%20your%20burners."
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
            <Link href="/terms" className="hover:text-slate-700 dark:hover:text-slate-300">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
