"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Flame, ShieldAlert, KeyRound, Mail, User, Phone, Building2, ArrowRight } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          company: form.company,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not create your account.");
        setLoading(false);
        return;
      }

      // Auto sign-in after successful registration
      const result = await signIn("credentials", {
        redirect: false,
        email: form.email,
        password: form.password,
        isAdminLogin: "false",
      });

      if (result?.error) {
        // Account was created but auto-login failed — send them to sign in manually
        router.push("/login");
      } else {
        router.push("/");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-brand-dark flex items-center justify-center p-4 relative overflow-hidden py-24">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-brand-orange/10 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="bg-white dark:bg-[#0a1128]/50 border border-slate-200 dark:border-brand-slate/40 p-8 rounded-2xl w-full max-w-md space-y-6 backdrop-blur-md relative shadow-2xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center space-x-2 justify-center">
            <div className="bg-brand-orange p-1.5 rounded-lg flex items-center justify-center">
              <Flame className="w-5 h-5 text-white animate-pulse" />
            </div>
            <span className="font-extrabold text-slate-900 dark:text-white text-base">FLAMETECH</span>
          </Link>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">Create Your Customer Account</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs">Track orders, manage AMC contracts, and check out faster.</p>
        </div>

        {/* Error alert */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-xs flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Full Name *</label>
            <div className="relative">
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Rakesh Patel"
                className="w-full bg-slate-50 dark:bg-[#060b13] border border-slate-300 dark:border-slate-700 rounded-md py-2 px-3 pl-9 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-brand-orange focus:bg-white"
              />
              <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Email Address *</label>
            <div className="relative">
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@company.com"
                className="w-full bg-slate-50 dark:bg-[#060b13] border border-slate-300 dark:border-slate-700 rounded-md py-2 px-3 pl-9 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-brand-orange focus:bg-white"
              />
              <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Phone *</label>
            <div className="relative">
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 97684 17740"
                className="w-full bg-slate-50 dark:bg-[#060b13] border border-slate-300 dark:border-slate-700 rounded-md py-2 px-3 pl-9 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-brand-orange focus:bg-white"
              />
              <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Company (Optional)</label>
            <div className="relative">
              <input
                type="text"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="e.g. Reliance Industries"
                className="w-full bg-slate-50 dark:bg-[#060b13] border border-slate-300 dark:border-slate-700 rounded-md py-2 px-3 pl-9 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-brand-orange focus:bg-white"
              />
              <Building2 className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Password *</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  minLength={8}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 dark:bg-[#060b13] border border-slate-300 dark:border-slate-700 rounded-md py-2 px-3 pl-9 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-brand-orange focus:bg-white"
                />
                <KeyRound className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Confirm *</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  minLength={8}
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 dark:bg-[#060b13] border border-slate-300 dark:border-slate-700 rounded-md py-2 px-3 pl-9 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-brand-orange focus:bg-white"
                />
                <KeyRound className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-orange hover:bg-brand-orange/95 text-white font-bold rounded-lg text-xs transition-all flex items-center justify-center space-x-1 shadow-md shadow-brand-orange/15"
          >
            <span>{loading ? "Creating Account..." : "Create Account"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Footer link */}
        <div className="text-[10px] text-slate-500 dark:text-slate-400 text-center leading-normal border-t border-slate-200 dark:border-slate-800/60 pt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-brand-orange hover:underline font-semibold">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
