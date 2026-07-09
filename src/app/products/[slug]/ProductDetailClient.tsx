"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { Flame, Settings, ShoppingCart, Check, FileText, Send, HelpCircle, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";

interface ProductSpec {
  label: string;
  value: string;
  unit?: string | null;
}

interface ProductImageItem {
  id: string;
  url: string;
  altText?: string | null;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  images?: ProductImageItem[];
  itemCode: string | null;
  type: "EQUIPMENT" | "PART" | "SERVICE";
  category: {
    name: string;
    slug: string;
  };
  description: string | null;
  price: number | null;
  stockQty: number | null;
  unit: string | null;
  taxRate: string | null;
  datasheetUrl?: string | null;
  specs: ProductSpec[];
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const isEquipment = product.type === "EQUIPMENT";
  const addItem = useCartStore((state) => state.addItem);

  const keySpec = product.specs && product.specs.length > 0 ? product.specs[0] : null;

  const faqList = isEquipment
    ? [
        `What is the estimated delivery time for the ${product.name}?`,
        keySpec
          ? `Can you confirm the ${keySpec.label.toLowerCase()} (${keySpec.value}${keySpec.unit ? ` ${keySpec.unit}` : ""}) is right for my application?`
          : "Can you share the CAD / dimensional drawing for this model?",
        "Do you provide commissioning and installation support at my location?",
        "What is the fuel consumption difference between gas and oil for this capacity?",
      ]
    : [
        `Is the ${product.name} fully compatible with standard Riello/Oxilon burners?`,
        "What is the warranty coverage period on this accessory?",
        "Do you offer commercial quantity discounts for bulk industrial buys?",
        "Can I pay via purchase order (PO) instead of online gateway?",
      ];

  const getWhatsAppLink = (faqQuestion: string) => {
    const phone = "919768417740";
    const text = `Hello FlameTech Engineering! I am inquiring about the product *${product.name}* (Code: *${product.itemCode || "N/A"}*). I would like to ask: ${faqQuestion}`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

  // Gallery: use real ProductImage records if present, else fall back to the single legacy image field
  const gallery: ProductImageItem[] =
    product.images && product.images.length > 0
      ? product.images
      : product.image
      ? [{ id: "primary", url: product.image, altText: product.name }]
      : [];
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const activeImage = gallery[activeImageIdx];

  // States
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Quote form state
  const [quoteForm, setQuoteForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    quantity: "1",
  });
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState(false);

  // Fire-and-forget view tracking — failures shouldn't affect the page
  useEffect(() => {
    fetch("/api/track/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.id }),
    }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  const handleQtyChange = (val: number) => {
    if (val < 1) return;
    setQuantity(val);
  };

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      itemCode: product.itemCode,
      price: product.price || 0,
      image: product.image ?? null,
      taxRate: product.taxRate,
    }, quantity);

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteLoading(true);
    setQuoteError(false);

    try {
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          name: quoteForm.name,
          email: quoteForm.email,
          phone: quoteForm.phone,
          company: quoteForm.company,
          message: `${quoteForm.message} | Requested Qty: ${quoteForm.quantity}`,
        }),
      });

      if (response.ok) {
        setQuoteSubmitted(true);
        // WhatsApp is a bonus notification channel, not the record of truth —
        // only opened once we know the lead is actually saved.
        const phone = "919768417740";
        const text = `Hello FlameTech Engineering! I would like to request a quote for *${product.name}* (Code: *${product.itemCode || "N/A"}*).

*My Details:*
- Name: ${quoteForm.name}
- Company: ${quoteForm.company || "N/A"}
- Phone: ${quoteForm.phone}
- Email: ${quoteForm.email || "N/A"}
- Requested Qty: ${quoteForm.quantity}

*Message / Requirements:*
${quoteForm.message || "N/A"}`;
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank");
      } else {
        setQuoteError(true);
      }
    } catch (err) {
      setQuoteError(true);
    } finally {
      setQuoteLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      {/* Left Column: Specs / Info */}
      <div className="lg:col-span-7 space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 bg-slate-100 dark:bg-brand-slate/40 border border-slate-200 dark:border-slate-800 rounded text-xs font-bold text-slate-700 dark:text-slate-300">
            {isEquipment ? <Flame className="w-3.5 h-3.5 text-brand-orange" /> : <Settings className="w-3.5 h-3.5 text-brand-teal" />}
            <span>{product.category.name}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">{product.name}</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Item Code: {product.itemCode}</p>
        </div>

        {/* Product Image Gallery */}
        <div className="space-y-3">
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-brand-navy border border-slate-200 dark:border-brand-slate/30 flex items-center justify-center group shadow-md">
            {activeImage ? (
              <img
                key={activeImage.id}
                src={activeImage.url}
                alt={activeImage.altText || product.name}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
              />
            ) : null}
            {/* Fallback Icon — shown directly when there's no image on file, or if the real image fails to load */}
            <div className={`absolute inset-0 items-center justify-center pointer-events-none ${activeImage ? "hidden" : "flex"}`}>
              {isEquipment ? (
                <Flame className="w-16 h-16 text-brand-orange/20" />
              ) : (
                <Settings className="w-16 h-16 text-brand-teal/20" />
              )}
            </div>

            {/* Prev/Next arrows — only when there's more than one photo */}
            {gallery.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveImageIdx((i) => (i - 1 + gallery.length) % gallery.length)}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveImageIdx((i) => (i + 1) % gallery.length)}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <span className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded">
                  {activeImageIdx + 1} / {gallery.length}
                </span>
              </>
            )}
          </div>

          {/* Thumbnail strip */}
          {gallery.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {gallery.map((img, idx) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setActiveImageIdx(idx)}
                  className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    idx === activeImageIdx
                      ? "border-brand-orange"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img.url} alt={img.altText || `${product.name} photo ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <div className="space-y-3 bg-white dark:bg-[#0a1128]/30 border border-slate-200 dark:border-slate-900 rounded-xl p-6 shadow-sm">
          <h3 className="text-slate-900 dark:text-white font-bold text-sm">Product Overview</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{product.description}</p>
        </div>

        {/* Specs Table */}
        <div className="space-y-4">
          <h3 className="text-slate-900 dark:text-white font-bold text-lg border-b border-slate-200 dark:border-brand-slate/40 pb-2">Technical Specifications</h3>
          {product.specs && product.specs.length > 0 ? (
            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-brand-slate/40">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-100 dark:bg-[#0a1128]/80 text-xs font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-brand-slate/40">
                  <tr>
                    <th className="px-6 py-3.5">Parameter</th>
                    <th className="px-6 py-3.5">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-brand-slate/20">
                  {product.specs.map((s, idx) => (
                    <tr key={idx} className="spec-row hover:bg-slate-100 dark:hover:bg-slate-900/10 transition-colors even:bg-slate-50/50 dark:even:bg-white/2">
                      <td className="px-6 py-3 font-semibold text-slate-600 dark:text-slate-400">{s.label}</td>
                      <td className="px-6 py-3 font-bold text-slate-800 dark:text-white">
                        {s.value} {s.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-slate-500 text-xs italic">No specific specifications recorded for this part.</p>
          )}
        </div>

        {/* Datasheet download (Equipment) */}
        {isEquipment && product.datasheetUrl && (
          <div className="pt-2">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert(`Downloading specifications sheet for ${product.name} (Simulated)`);
              }}
              className="inline-flex items-center space-x-2 px-5 py-3 bg-slate-200 hover:bg-slate-300 border border-slate-300 text-slate-800 dark:bg-brand-slate dark:border-slate-700 dark:text-white dark:hover:bg-brand-slate/80 text-xs font-bold rounded-lg transition-all shadow-sm"
            >
              <FileText className="w-4 h-4 text-brand-orange" />
              <span>Download Technical PDF Datasheet</span>
            </a>
          </div>
        )}
      </div>

      {/* Right Column: Interaction Card */}
      <div className="lg:col-span-5">
        {isEquipment ? (
          /* Equipment Quote Capture Form */
          <div className="bg-white dark:bg-[#0a1128]/70 border border-slate-200 dark:border-brand-slate/40 p-8 rounded-2xl space-y-6 shadow-md backdrop-blur-md">
            {quoteSubmitted ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 bg-brand-teal/10 border border-brand-teal/40 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-brand-teal animate-bounce" />
                </div>
                <h3 className="text-slate-900 dark:text-white font-extrabold text-xl">Quote Request Logged</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  Thank you! Our B2B sales engineers have received your inquiry. We will contact you at <span className="text-slate-900 dark:text-white font-bold">{quoteForm.phone}</span> within 24 hours.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setQuoteSubmitted(false)}
                    className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  >
                    Submit another request
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit} className="space-y-4 text-left">
                <div className="border-b border-slate-200 dark:border-brand-slate/40 pb-4">
                  <h2 className="text-slate-900 dark:text-white font-black text-xl">B2B Quote Request</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                    Fill in your project requirements for direct plant pricing.
                  </p>
                </div>

                {quoteError && (
                  <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 rounded-lg p-3 text-xs text-red-700 dark:text-red-400 space-y-1.5">
                    <p className="font-bold">We couldn't save your request — please try again, or reach us directly:</p>
                    <a
                      href={`https://wa.me/919768417740?text=${encodeURIComponent(`Hello FlameTech Engineering! I would like to request a quote for *${product.name}* (Code: *${product.itemCode || "N/A"}*). My phone: ${quoteForm.phone || "N/A"}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block font-bold text-emerald-600 dark:text-emerald-400 underline"
                    >
                      Message us on WhatsApp instead →
                    </a>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={quoteForm.name}
                      onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                      placeholder="e.g. Rakesh Patel"
                      className="w-full bg-slate-50 dark:bg-[#060b13] border border-slate-300 dark:border-slate-700 rounded-md py-2 px-3 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:border-brand-orange focus:bg-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={quoteForm.phone}
                      onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                      placeholder="e.g. +91 97684 17740"
                      className="w-full bg-slate-50 dark:bg-[#060b13] border border-slate-300 dark:border-slate-700 rounded-md py-2 px-3 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:border-brand-orange focus:bg-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Qty Required</label>
                    <input
                      type="number"
                      min="1"
                      value={quoteForm.quantity}
                      onChange={(e) => setQuoteForm({ ...quoteForm, quantity: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-[#060b13] border border-slate-300 dark:border-slate-700 rounded-md py-2 px-3 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:border-brand-orange focus:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-550 dark:text-slate-400 font-bold uppercase tracking-wider">Company Name</label>
                  <input
                    type="text"
                    value={quoteForm.company}
                    onChange={(e) => setQuoteForm({ ...quoteForm, company: e.target.value })}
                    placeholder="e.g. Reliance Industries"
                    className="w-full bg-slate-50 dark:bg-[#060b13] border border-slate-300 dark:border-slate-700 rounded-md py-2 px-3 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:border-brand-orange focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-550 dark:text-slate-400 font-bold uppercase tracking-wider">Email (Optional)</label>
                  <input
                    type="email"
                    value={quoteForm.email}
                    onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                    placeholder="e.g. name@company.com"
                    className="w-full bg-slate-50 dark:bg-[#060b13] border border-slate-300 dark:border-slate-700 rounded-md py-2 px-3 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:border-brand-orange focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-550 dark:text-slate-400 font-bold uppercase tracking-wider">Message / Custom specs</label>
                  <textarea
                    rows={4}
                    value={quoteForm.message}
                    onChange={(e) => setQuoteForm({ ...quoteForm, message: e.target.value })}
                    placeholder="Provide details about your oven/boiler, gas type, or application details..."
                    className="w-full bg-slate-50 dark:bg-[#060b13] border border-slate-300 dark:border-slate-700 rounded-md py-2 px-3 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:border-brand-orange resize-none focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={quoteLoading}
                  className="w-full py-3 bg-brand-orange hover:bg-brand-orange/95 text-white font-bold rounded-lg text-sm transition-all flex items-center justify-center space-x-2 shadow-md shadow-brand-orange/10"
                >
                  <Send className="w-4 h-4" />
                  <span>{quoteLoading ? "Logging Inquiries..." : "Request Direct Factory Quote"}</span>
                </button>
              </form>
            )}
          </div>
        ) : (
          /* Part Order Add to Cart Section */
          <div className="bg-white dark:bg-[#0a1128]/70 border border-slate-200 dark:border-brand-slate/40 p-8 rounded-2xl space-y-6 shadow-md backdrop-blur-md text-left">
            <div className="border-b border-slate-200 dark:border-brand-slate/40 pb-4">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-extrabold block mb-1">Standard Accessory Store</span>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white">₹{product.price?.toLocaleString()}</h2>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">GST @ {product.taxRate || "18%"} Included</span>
            </div>

            {/* Stock details */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400">Availability:</span>
                <span className="font-semibold text-brand-teal">
                  In Stock ({product.stockQty} {product.unit}s)
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400">Shipping:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">Dispatched in 24 Hours</span>
              </div>
            </div>

            {/* Quantity selector */}
            <div className="space-y-2">
              <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block">Select Quantity</label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleQtyChange(quantity - 1)}
                  className="w-10 h-10 border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-brand-dark rounded-md flex items-center justify-center font-bold text-slate-800 dark:text-white text-lg hover:border-slate-400 dark:hover:border-slate-500"
                >
                  -
                </button>
                <span className="w-12 text-center font-bold text-slate-900 dark:text-white text-base">{quantity}</span>
                <button
                  onClick={() => handleQtyChange(quantity + 1)}
                  className="w-10 h-10 border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-brand-dark rounded-md flex items-center justify-center font-bold text-slate-800 dark:text-white text-lg hover:border-slate-400 dark:hover:border-slate-500"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add button */}
            <div className="space-y-3 pt-4">
              <button
                onClick={handleAddToCart}
                className={`w-full py-3.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center space-x-2 shadow-lg ${
                  added
                    ? "bg-brand-teal text-white shadow-brand-teal/15"
                    : "bg-brand-orange hover:bg-brand-orange/95 text-white shadow-brand-orange/15"
                }`}
              >
                {added ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                <span>{added ? "Added to Cart!" : "Add Spare to Cart"}</span>
              </button>

              <Link
                href="/cart"
                className="block text-center w-full py-3.5 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-slate-500 transition-all"
              >
                View Shopping Cart
              </Link>
            </div>
          </div>
        )}

        {/* WhatsApp FAQ Assistance Box */}
        <div className="mt-6 border border-slate-200 dark:border-brand-slate/40 p-6 rounded-2xl space-y-4 backdrop-blur-md text-left dark:bg-[#0a1128]/70 bg-white/95 shadow-md">
          <h4 className="text-slate-800 dark:text-white font-bold text-sm flex items-center space-x-2">
            <span className="p-1.5 bg-emerald-500/10 rounded-md text-emerald-500 flex items-center justify-center">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.863-9.864.001-2.63-1.019-5.101-2.875-6.958C16.604 1.926 14.129.905 11.5.905c-5.439 0-9.863 4.42-9.866 9.863-.002 1.93.501 3.81 1.458 5.484L2.08 21.8l5.567-1.458-.001-.001v.001zM17.828 14.7c-.312-.156-1.848-.912-2.128-1.013-.28-.102-.485-.153-.687.153-.202.304-.783.912-.96 1.114-.177.203-.354.228-.666.072-1.344-.672-2.203-1.172-3.08-2.697-.231-.4-.231-.77-.072-.929.143-.143.312-.365.468-.547.156-.183.208-.314.312-.523.104-.209.052-.392-.026-.547-.078-.156-.687-1.657-.942-2.269-.25-.599-.5-.517-.687-.527-.178-.009-.382-.01-.587-.01s-.538.076-.82.382c-.282.307-1.077 1.054-1.077 2.571s1.103 2.983 1.258 3.189c.155.206 2.17 3.313 5.258 4.646.734.317 1.308.507 1.753.649.738.234 1.41.201 1.941.122.593-.088 1.848-.756 2.108-1.488.26-.731.26-1.36.183-1.488-.077-.128-.282-.204-.594-.36z" />
              </svg>
            </span>
            <span className="font-extrabold text-slate-800 dark:text-white">Contextual WhatsApp FAQ Desk</span>
          </h4>
          <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
            Select an auto-compiled FAQ query to instantly request answers from our technical sales specialists on WhatsApp:
          </p>
          
          <div className="flex flex-col space-y-1.5 pt-1">
            {faqList.map((faq, index) => (
              <a
                key={index}
                href={getWhatsAppLink(faq)}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/40 dark:hover:bg-slate-800/60 border border-slate-200 dark:border-slate-800/80 rounded-lg text-slate-700 dark:text-slate-300 font-semibold hover:text-brand-orange dark:hover:text-brand-orange text-xs flex items-between transition-all group"
              >
                <span>{faq}</span>
                <span className="text-[10px] text-emerald-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  Ask &rarr;
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
