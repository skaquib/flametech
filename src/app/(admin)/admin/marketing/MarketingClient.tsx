"use client";

import React, { useState } from "react";
import { Sparkles, Copy, Check, AlertTriangle } from "lucide-react";

interface Product {
  id: string;
  name: string;
  shortDesc: string | null;
  price: number | null;
}

const CONTENT_TYPES = [
  { value: "whatsapp", label: "WhatsApp Broadcast" },
  { value: "ad", label: "Ad Headline + Copy" },
  { value: "social", label: "Social Caption (LinkedIn)" },
  { value: "description", label: "Product Description" },
];

export default function MarketingClient({ products }: { products: Product[] }) {
  const [selectedProductId, setSelectedProductId] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [contentType, setContentType] = useState("whatsapp");
  const [extraInstructions, setExtraInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    const productName = selectedProduct?.name || customTopic;
    if (!productName) {
      setError("Pick a product or type a topic first.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/marketing/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName,
          productDetails: selectedProduct?.shortDesc || undefined,
          contentType,
          extraInstructions: extraInstructions || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not generate copy.");
      } else {
        setResult(data.text);
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left: Form */}
      <div className="bg-white dark:bg-[#0a1128]/50 border border-slate-200 dark:border-brand-slate/40 p-6 rounded-xl space-y-4">
        <div className="space-y-1.5">
          <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Product (optional)</label>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="w-full bg-white dark:bg-[#060b13] border border-slate-300 dark:border-slate-700 rounded-md py-2 px-3 text-slate-800 dark:text-slate-200 text-sm focus:outline-none"
          >
            <option value="">— Select a catalog product —</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
            Or type a custom topic {selectedProductId && "(overridden by product above)"}
          </label>
          <input
            type="text"
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            disabled={!!selectedProductId}
            placeholder="e.g. Monsoon AMC discount offer"
            className="w-full bg-white dark:bg-[#060b13] border border-slate-300 dark:border-slate-700 rounded-md py-2 px-3 text-slate-800 dark:text-slate-200 text-sm focus:outline-none disabled:opacity-50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Content Type</label>
          <div className="flex flex-wrap gap-2">
            {CONTENT_TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => setContentType(t.value)}
                className={`px-3 py-1.5 border rounded text-[10px] font-bold uppercase transition-colors ${
                  contentType === t.value
                    ? "bg-brand-orange/15 border-brand-orange text-brand-orange"
                    : "bg-slate-100 dark:bg-brand-dark/40 border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Extra instructions (optional)</label>
          <textarea
            rows={3}
            value={extraInstructions}
            onChange={(e) => setExtraInstructions(e.target.value)}
            placeholder="e.g. mention 10% off this month, tone: urgent"
            className="w-full bg-white dark:bg-[#060b13] border border-slate-300 dark:border-slate-700 rounded-md py-2 px-3 text-slate-800 dark:text-slate-200 text-sm focus:outline-none resize-none"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-3 bg-brand-orange hover:bg-brand-orange/95 text-white font-bold rounded-lg text-sm transition-all flex items-center justify-center space-x-2 shadow-md shadow-brand-orange/10 disabled:opacity-60"
        >
          <Sparkles className="w-4 h-4" />
          <span>{loading ? "Generating..." : "Generate Copy"}</span>
        </button>
      </div>

      {/* Right: Result */}
      <div className="bg-white dark:bg-[#0a1128]/50 border border-slate-200 dark:border-brand-slate/40 p-6 rounded-xl space-y-4">
        <h3 className="text-slate-900 dark:text-white font-bold text-sm border-b border-slate-200 dark:border-brand-slate/30 pb-2">Generated Copy</h3>

        {error && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 rounded-lg p-3 text-xs text-red-700 dark:text-red-400 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {!error && !result && !loading && (
          <p className="text-slate-500 text-xs italic">Fill in the form and click Generate — this drafts copy for you to review, not send automatically.</p>
        )}

        {loading && <p className="text-slate-500 text-xs italic">Thinking...</p>}

        {result && (
          <div className="space-y-3">
            <div className="bg-slate-50 dark:bg-[#060b13] border border-slate-200 dark:border-slate-800 rounded-lg p-4 text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
              {result}
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-md text-xs font-bold text-slate-600 dark:text-slate-300 hover:border-slate-400"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied!" : "Copy to clipboard"}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
