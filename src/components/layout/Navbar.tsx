"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/store/cart";
import { ShoppingCart, User, Menu, X, Flame, ShieldAlert, FileText, Sun, Moon } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const cartItemsCount = useCartStore((state) => state.getTotalItems());
  const [cartCountMounted, setCartCountMounted] = useState(0);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const root = document.documentElement;
    const initialTheme = root.classList.contains("dark") ? "dark" : "light";
    setTheme(initialTheme);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.remove("dark");
      localStorage.setItem("flametech-theme", "light");
      setTheme("light");
    } else {
      root.classList.add("dark");
      localStorage.setItem("flametech-theme", "dark");
      setTheme("dark");
    }
  };

  // Avoid hydration mismatch for cart count
  useEffect(() => {
    setCartCountMounted(cartItemsCount);
  }, [cartItemsCount]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on path changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "AMC Service", href: "/services/amc" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 dark:bg-[#060b13]/95 backdrop-blur-md shadow-lg border-b border-slate-200 dark:border-brand-slate/40 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-brand-orange p-2 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105 shadow-md shadow-brand-orange/25">
              <Flame className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-wider text-slate-800 dark:text-white">
                FLAME<span className="text-brand-orange">TECH</span>
              </span>
              <span className="block text-[9px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold leading-none">
                Engineering
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-all duration-200 relative py-1 ${
                    isActive
                      ? "text-brand-orange font-semibold"
                      : "text-slate-600 dark:text-slate-300 hover:text-brand-orange dark:hover:text-white"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-orange rounded-full shadow-glow shadow-brand-orange/50"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action icons */}
          <div className="hidden md:flex items-center space-x-5">
            {/* Theme Switcher Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-brand-amber" /> : <Moon className="w-4 h-4 text-brand-orange" />}
            </button>

            {/* Admin access tag */}
            {session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN" ? (
              <Link
                href="/admin/dashboard"
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-brand-orange/10 border border-brand-orange/30 text-brand-orange text-xs font-semibold rounded-md hover:bg-brand-orange/20 transition-all shadow-sm"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Admin Dashboard</span>
              </Link>
            ) : null}

            {/* Shopping Cart */}
            <Link href="/cart" className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-brand-orange dark:hover:text-white transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {cartCountMounted > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-orange text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-brand-light dark:border-brand-dark animate-scale-in">
                  {cartCountMounted}
                </span>
              )}
            </Link>

            {/* User Account / Login */}
            {session ? (
              <div className="flex items-center space-x-3">
                <span className="text-slate-600 dark:text-slate-300 text-xs hidden lg:inline max-w-[120px] truncate">
                  {session.user.name}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-xs px-3 py-1.5 border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 rounded-md text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium transition-all"
                >
                  Log out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-300 hover:text-brand-orange dark:hover:text-white transition-colors py-1.5 px-3 rounded-md border border-slate-300 dark:border-brand-slate hover:bg-slate-100 dark:hover:bg-brand-slate/20 text-xs font-medium"
              >
                <User className="w-3.5 h-3.5" />
                <span>Customer Login</span>
              </Link>
            )}
          </div>

          {/* Mobile menu actions */}
          <div className="flex md:hidden items-center space-x-2">
            {/* Theme switcher for mobile */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-brand-amber" /> : <Moon className="w-4 h-4 text-brand-orange" />}
            </button>

            {/* Shopping Cart for mobile */}
            <Link href="/cart" className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-brand-orange dark:hover:text-white transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {cartCountMounted > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-brand-orange text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCountMounted}
                </span>
              )}
            </Link>

            {/* Hamburger menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-600 dark:text-slate-300 hover:text-brand-orange dark:hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-brand-navy border-b border-slate-200 dark:border-brand-slate/40 shadow-xl animate-fade-in-up">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`block px-3 py-2.5 rounded-md text-base font-semibold transition-colors ${
                    isActive
                      ? "bg-brand-orange/10 text-brand-orange"
                      : "text-slate-750 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-brand-slate/20 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN" ? (
              <Link
                href="/admin/dashboard"
                className="block px-3 py-2.5 rounded-md text-base font-semibold text-brand-orange bg-brand-orange/5 border-l-4 border-brand-orange"
              >
                Admin Dashboard
              </Link>
            ) : null}

            <div className="border-t border-slate-200 dark:border-slate-800 my-2 pt-2 px-3">
              {session ? (
                <div className="flex items-center justify-between">
                  <span className="text-slate-700 dark:text-slate-300 text-sm font-semibold truncate max-w-[200px]">
                    {session.user.name}
                  </span>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-xs px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-200 dark:border-red-900/30 rounded-md transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link
                    href="/login"
                    className="block text-center w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-brand-slate/20 text-sm font-semibold transition-all"
                  >
                    Customer Sign In
                  </Link>
                  <Link
                    href="/admin-login"
                    className="block text-center w-full px-4 py-2 bg-brand-orange/10 hover:bg-brand-orange/20 border border-brand-orange/30 rounded-md text-brand-orange text-sm font-bold transition-all"
                  >
                    Admin Portal
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
