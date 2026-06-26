"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { LayoutDashboard, ShoppingBag, ClipboardList, Package, LogOut, Globe, ShieldAlert } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

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
  ];

  return (
    <div className="min-h-screen bg-brand-dark flex text-left">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0a1128] border-r border-brand-slate/40 flex flex-col justify-between shrink-0">
        <div className="p-6 space-y-8">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-brand-orange p-1.5 rounded-lg flex items-center justify-center text-white font-bold">
              FT
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-wider text-white">
                FLAME<span className="text-brand-orange">TECH</span>
              </span>
              <span className="block text-[8px] uppercase tracking-widest text-slate-500 font-bold leading-none">
                Admin Panel
              </span>
            </div>
          </div>

          {/* Links list */}
          <nav className="space-y-1.5 flex flex-col">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/admin/dashboard" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-md text-xs font-bold transition-all ${
                    isActive
                      ? "bg-brand-orange/15 text-brand-orange border-l-2 border-brand-orange"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/20"
                  }`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-6 border-t border-slate-800/60 space-y-2">
          <Link
            href="/"
            className="flex items-center space-x-3 px-3 py-2 text-xs text-slate-400 hover:text-white font-semibold"
          >
            <Globe className="w-4 h-4 text-brand-teal" />
            <span>Go to Public Site</span>
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center space-x-3 px-3 py-2 text-xs text-red-400 hover:text-red-300 font-semibold text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Main panel container */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Header toolbar */}
        <header className="h-16 border-b border-brand-slate/40 flex items-center justify-between px-8 bg-[#0a1128]/35 backdrop-blur">
          <div className="text-slate-400 text-xs font-semibold">
            Logged in: <span className="text-white font-bold">{session.user.name}</span> ({session.user.role})
          </div>
          <div className="flex items-center space-x-3">
            <span className="px-2 py-0.5 bg-brand-orange/10 border border-brand-orange/30 text-[9px] font-bold text-brand-orange uppercase rounded">
              Secure Session
            </span>
          </div>
        </header>

        {/* Dashboard Content area */}
        <main className="p-8 flex-1 bg-brand-dark">{children}</main>
      </div>
    </div>
  );
}
