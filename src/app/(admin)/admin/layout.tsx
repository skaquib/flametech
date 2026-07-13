"use client";

import React, { useState, useEffect } from "react";
import Link, { useLinkStatus } from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { LayoutDashboard, ShoppingBag, ClipboardList, Package, LogOut, Globe, ShieldAlert, Sun, Moon, TrendingUp, Sparkles, Menu, X, Loader2 } from "lucide-react";

// Lives inside the Link so useLinkStatus can report whether *this* link's
// navigation is still pending — greys it out and swaps in a spinner so a
// click feels immediate even while the next page is still rendering.
function SidebarLinkContent({ icon, name }: { icon: React.ReactNode; name: string }) {
  const { pending } = useLinkStatus();
  return (
    <div className={`flex items-center space-x-3 transition-opacity ${pending ? "opacity-40" : ""}`}>
      {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
      <span>{name}</span>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const initialTheme = root.classList.contains("dark") ? "dark" : "light";
    setTheme(initialTheme);
  }, []);

  // Auto-close the mobile sidebar overlay whenever the route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

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

  // Loading safety
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center text-slate-400">
        Authenticating session...
      </div>
    );
  }

  // Double check credentials (Middleware handles primary gating, this prevents screen flash)
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return (
      <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center space-y-4 p-4 text-center">
        <ShieldAlert className="w-12 h-12 text-brand-orange animate-bounce" />
        <h1 className="text-xl font-bold text-white">Access Denied</h1>
        <p className="text-slate-400 text-sm max-w-sm">
          You do not have administrative credentials to view this page. Redirecting to site...
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-brand-orange text-white text-xs font-bold rounded-lg"
        >
          Return Home
        </button>
      </div>
    );
  }

  const sidebarLinks = [
    { name: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: "Products Listing", href: "/admin/products", icon: <Package className="w-4 h-4" /> },
    { name: "Quote Requests", href: "/admin/quotes", icon: <ClipboardList className="w-4 h-4" /> },
    { name: "Direct Orders", href: "/admin/orders", icon: <ShoppingBag className="w-4 h-4" /> },
    { name: "Growth Analytics", href: "/admin/analytics", icon: <TrendingUp className="w-4 h-4" /> },
    { name: "Marketing", href: "/admin/marketing", icon: <Sparkles className="w-4 h-4" /> },
  ];

  return (
    <div className={`h-screen overflow-hidden bg-slate-50 dark:bg-brand-dark text-slate-900 dark:text-slate-100 flex text-left transition-colors duration-300`}>
      {/* Mobile backdrop — closes the sidebar on tap outside it */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`w-64 h-screen fixed lg:sticky top-0 left-0 z-50 bg-white dark:bg-[#0a1128] border-r border-slate-200 dark:border-brand-slate/40 flex flex-col justify-between shrink-0 overflow-y-auto transition-transform duration-300 ease-in-out lg:transition-colors lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 space-y-8">
          {/* Logo */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-brand-orange p-1.5 rounded-lg flex items-center justify-center text-white font-bold">
                FT
              </div>
              <div>
                <span className="font-extrabold text-sm tracking-wider text-slate-800 dark:text-white">
                  FLAME<span className="text-brand-orange">TECH</span>
                </span>
                <span className="block text-[8px] uppercase tracking-widest text-slate-500 font-bold leading-none">
                  Admin Panel
                </span>
              </div>
            </div>
            {/* Close button — mobile only */}
            <button
              onClick={() => setSidebarOpen(false)}
              type="button"
              className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Links list */}
          <nav className="space-y-1.5 flex flex-col">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/admin/dashboard" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2.5 rounded-md text-xs font-bold transition-all ${
                    isActive
                      ? "bg-brand-orange/15 text-brand-orange border-l-2 border-brand-orange"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 hover:dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800/20"
                  }`}
                >
                  <SidebarLinkContent icon={link.icon} name={link.name} />
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-800/60 space-y-2">
          <Link
            href="/"
            className="flex items-center space-x-3 px-3 py-2 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 hover:dark:text-white font-semibold"
          >
            <Globe className="w-4 h-4 text-brand-teal" />
            <span>Go to Public Site</span>
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center space-x-3 px-3 py-2 text-xs text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 font-semibold text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Main panel container */}
      <div className="flex-1 flex flex-col overflow-y-auto min-w-0">
        {/* Header toolbar */}
        <header className="h-16 border-b border-slate-200 dark:border-brand-slate/40 flex items-center justify-between px-4 sm:px-8 bg-white/70 dark:bg-[#0a1128]/35 backdrop-blur transition-colors duration-300">
          <div className="flex items-center gap-3 min-w-0">
            {/* Sidebar open button — mobile only */}
            <button
              onClick={() => setSidebarOpen(true)}
              type="button"
              className="lg:hidden p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
              aria-label="Open sidebar"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="text-slate-500 dark:text-slate-400 text-xs font-semibold truncate">
              Logged in: <span className="text-slate-900 dark:text-white font-bold">{session.user.name}</span> ({session.user.role})
            </div>
          </div>
          <div className="flex items-center space-x-4 shrink-0">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              type="button"
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Toggle theme mode"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-brand-orange" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>
            
            <span className="px-2 py-0.5 bg-brand-orange/10 border border-brand-orange/30 text-[9px] font-bold text-brand-orange uppercase rounded">
              Secure Session
            </span>
          </div>
        </header>

        {/* Dashboard Content area */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 bg-slate-50 dark:bg-brand-dark transition-colors duration-300 overflow-x-auto">{children}</main>
      </div>
    </div>
  );
}
