"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Flame, ShieldAlert, KeyRound, Mail, ArrowRight } from "lucide-react";

function CustomerLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(searchParams.get("error") ? "Invalid credentials" : null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: form.email,
        password: form.password,
        isAdminLogin: "false",
      });

      if (result?.error) {
        setError("Invalid email address or password combination.");
        setLoading(false);
      } else {
        router.push("/");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#0a1128]/50 border border-slate-200 dark:border-brand-slate/40 p-8 rounded-2xl w-full max-w-md space-y-6 backdrop-blur-md relative shadow-2xl">
      {/* Header */}
      <div className="text-center space-y-2">
        <Link href="/" className="inline-flex items-center space-x-2 justify-center">
          <div className="bg-brand-orange p-1.5 rounded-lg flex items-center justify-center">
            <Flame className="w-5 h-5 text-white animate-pulse" />
          </div>
          <span className="font-extrabold text-slate-900 dark:text-white text-base">FLAMETECH</span>
        </Link>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">Customer Account Sign In</h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs">Access order history, AMC contracts, and fast spare checkout.</p>
      </div>

      {/* Error alert */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-xs flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <div className="space-y-1.5">
          <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Email Address</label>
          <div className="relative">
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="customer@gmail.com"
              className="w-full bg-slate-50 dark:bg-[#060b13] border border-slate-300 dark:border-slate-700 rounded-md py-2 px-3 pl-9 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-brand-orange focus:bg-white"
            />
            <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Password</label>
          <div className="relative">
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              className="w-full bg-slate-50 dark:bg-[#060b13] border border-slate-300 dark:border-slate-700 rounded-md py-2 px-3 pl-9 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-brand-orange focus:bg-white"
            />
            <KeyRound className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-brand-orange hover:bg-brand-orange/95 text-white font-bold rounded-lg text-xs transition-all flex items-center justify-center space-x-1 shadow-md shadow-brand-orange/15"
        >
          <span>{loading ? "Signing In..." : "Sign In to Account"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Guidelines */}
      <div className="text-[10px] text-slate-500 dark:text-slate-400 text-center leading-normal border-t border-slate-200 dark:border-slate-800/60 pt-4 space-y-2">
        <div>
          Demo Accounts: <span className="text-slate-900 dark:text-white font-bold">customer@gmail.com</span> / Password: <span className="text-slate-905 dark:text-white font-bold">Customer123!</span>
        </div>
        <div>
          Are you an administrator?{" "}
          <Link href="/admin-login" className="text-brand-orange hover:underline font-semibold">
            Admin Portal
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-brand-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-brand-orange/10 rounded-full blur-[80px] pointer-events-none"></div>
      
      <Suspense fallback={<div className="text-slate-600 dark:text-slate-400 text-sm">Loading login portal...</div>}>
        <CustomerLoginForm />
      </Suspense>
    </div>
  );
}
