"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { DEFAULT_PRODUCT_IMAGE } from "@/lib/constants";
import { Search, ShoppingCart, Check, Info, SlidersHorizontal, ChevronDown } from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  itemCode: string | null;
  type: "EQUIPMENT" | "PART" | "SERVICE";
  category: {
    name: string;
    slug: string;
  };
  shortDesc: string | null;
  price: number | null;
  stockQty: number | null;
  unit: string | null;
  taxRate: string | null;
  specs: {
    label: string;
    value: string;
  }[];
}

interface Category {
  name: string;
  slug: string;
}

const PAGE_SIZE = 24;

export default function ProductListClient({
  products,
  categories,
  initialCategory = "all",
}: {
  products: Product[];
  categories: Category[];
  initialCategory?: string;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedType, setSelectedType] = useState("all"); // 'all' | 'EQUIPMENT' | 'PART'
  const [addedItemSlug, setAddedItemSlug] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);

  const activeFilterCount = (selectedType !== "all" ? 1 : 0) + (selectedCategory !== "all" ? 1 : 0) + (searchTerm ? 1 : 0);

  const addItem = useCartStore((state) => state.addItem);

  // Filter Logic
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.itemCode && p.itemCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.shortDesc && p.shortDesc.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === "all" || p.category.slug === selectedCategory;
    const matchesType = selectedType === "all" || p.type === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  });

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedProducts = filteredProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const goToPage = (p: number) => {
    setPage(p);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      itemCode: product.itemCode,
      price: product.price || 0,
      image: product.image ?? null,
      taxRate: product.taxRate,
    });

    setAddedItemSlug(product.slug);
    setTimeout(() => {
      setAddedItemSlug(null);
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar Controls */}
      <div className="lg:col-span-1 space-y-6">
        {/* Mobile filter toggle */}
        <button
          onClick={() => setFiltersOpen((v) => !v)}
          className="lg:hidden w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-brand-navy/70 border border-slate-200 dark:border-brand-slate/40 rounded-xl text-slate-900 dark:text-white font-bold text-sm shadow-sm"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-brand-orange" />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-brand-orange text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform ${filtersOpen ? "rotate-180" : ""}`} />
        </button>

        <div className={`${filtersOpen ? "block" : "hidden"} lg:block bg-white dark:bg-brand-navy/70 border border-slate-200 dark:border-brand-slate/40 p-6 rounded-xl space-y-6 text-left backdrop-blur-md shadow-sm`}>
          <h3 className="hidden lg:block text-slate-900 dark:text-white font-bold text-base border-b border-slate-200 dark:border-brand-slate/40 pb-3">Filters</h3>

          {/* Search Box */}
          <div className="space-y-2">
            <label className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Search Catalog</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Item name, code..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                className="w-full bg-slate-50 dark:bg-[#060b13] border border-slate-300 dark:border-slate-700 rounded-md py-2 px-3 pl-9 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:border-brand-orange focus:bg-white"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          {/* Type Filter */}
          <div className="space-y-2">
            <label className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Product Type</label>
            <div className="flex flex-col space-y-1.5">
              {[
                { label: "All Items", val: "all" },
                { label: "Industrial Equipment (Quote)", val: "EQUIPMENT" },
                { label: "Spare Parts (Buy Online)", val: "PART" },
              ].map((t) => (
                <button
                  key={t.val}
                  onClick={() => { setSelectedType(t.val); setPage(1); }}
                  className={`text-left px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                    selectedType === t.val
                      ? "bg-brand-orange/15 text-brand-orange border-l-2 border-brand-orange"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-brand-slate/10 hover:text-slate-950 dark:hover:text-white"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Categories Selector */}
          <div className="space-y-2">
            <label className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Categories</label>
            <div className="flex flex-col space-y-1.5">
              <button
                onClick={() => { setSelectedCategory("all"); setPage(1); }}
                className={`text-left px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                  selectedCategory === "all"
                    ? "bg-brand-orange/15 text-brand-orange border-l-2 border-brand-orange"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-brand-slate/10 hover:text-slate-950 dark:hover:text-white"
                }`}
              >
                All Categories
              </button>
              {categories.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => { setSelectedCategory(c.slug); setPage(1); }}
                  className={`text-left px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                    selectedCategory === c.slug
                      ? "bg-brand-orange/15 text-brand-orange border-l-2 border-brand-orange"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-brand-slate/10 hover:text-slate-950 dark:hover:text-white"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="lg:col-span-3">
        {filteredProducts.length === 0 ? (
          <div className="bg-slate-100/50 dark:bg-[#0a1128]/20 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center text-slate-500">
            <Info className="w-8 h-8 mx-auto mb-2 text-slate-400 dark:text-slate-600" />
            <p className="text-sm">No items found matching the current filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pagedProducts.map((p) => {
              const isEquipment = p.type === "EQUIPMENT";

              return (
                <Link
                  key={p.id}
                  href={`/products/${p.slug}`}
                  className="group bg-white dark:bg-[#0a1128]/40 border border-slate-200 dark:border-brand-slate/30 hover:border-slate-300 dark:hover:border-brand-slate rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full text-left relative"
                >
                   {/* Card Image */}
                  <div className="aspect-[4/3] bg-slate-100 dark:bg-brand-navy relative overflow-hidden flex items-center justify-center border-b border-slate-200 dark:border-brand-slate/30">
                    <div className="absolute top-2 left-2 z-10 bg-white/90 dark:bg-brand-dark/85 border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded text-[9px] uppercase tracking-wider text-slate-650 dark:text-slate-400 font-bold shadow-sm">
                      {p.category.name}
                    </div>
                    
                    <img
                      src={p.image || DEFAULT_PRODUCT_IMAGE}
                      alt={p.name}
                      onError={(e) => { e.currentTarget.src = DEFAULT_PRODUCT_IMAGE; }}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Badge flow type */}
                    <div className="absolute bottom-2 right-2 bg-slate-200 dark:bg-[#060b13] border border-slate-300 dark:border-slate-800 rounded px-2 py-0.5 text-[8px] font-bold text-slate-700 dark:text-slate-400">
                      {p.itemCode}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-brand-orange transition-colors truncate">
                        {p.name}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {p.shortDesc}
                      </p>

                      {/* Summary Specs */}
                      {p.specs && p.specs.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {p.specs.slice(0, 2).map((s, idx) => (
                            <span
                              key={idx}
                              className="text-[9px] font-medium bg-slate-100 dark:bg-brand-slate/40 border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300"
                            >
                              {s.label}: {s.value}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="border-t border-slate-200 dark:border-brand-slate/30 mt-5 pt-4 flex items-center justify-between">
                      {/* Price/Type label */}
                      <div>
                        {isEquipment ? (
                          <div>
                            <span className="block text-[8px] text-slate-500 uppercase tracking-widest font-extrabold leading-none">B2B Order</span>
                            <span className="text-xs font-bold text-brand-orange">Quote Request</span>
                          </div>
                        ) : (
                          <div>
                            <span className="block text-[8px] text-slate-500 uppercase tracking-widest font-extrabold leading-none">Price</span>
                            <span className="text-base font-extrabold text-slate-900 dark:text-white">₹{p.price?.toLocaleString()}</span>
                          </div>
                        )}
                      </div>

                      {/* Interactive Button */}
                      {isEquipment ? (
                        <span className="px-3.5 py-1.5 bg-brand-orange/10 hover:bg-brand-orange/20 border border-brand-orange/40 text-brand-orange text-xs font-bold rounded transition-all">
                          Request Details
                        </span>
                      ) : (
                        <button
                          onClick={(e) => handleAddToCart(p, e)}
                          className={`p-2 rounded-md transition-all ${
                            addedItemSlug === p.slug
                              ? "bg-brand-teal text-white"
                              : "bg-brand-orange hover:bg-brand-orange/95 text-white"
                          }`}
                        >
                          {addedItemSlug === p.slug ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <ShoppingCart className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {filteredProducts.length > PAGE_SIZE && (
          <div className="flex items-center justify-between mt-8 text-sm">
            <span className="text-slate-500 dark:text-slate-400 text-xs">
              Showing {(currentPage - 1) * PAGE_SIZE + 1}-{Math.min(currentPage * PAGE_SIZE, filteredProducts.length)} of {filteredProducts.length} items
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-md text-slate-600 dark:text-slate-300 text-xs font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:border-slate-400 dark:hover:border-slate-500 transition-colors"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .reduce<number[]>((acc, p) => {
                  if (acc.length > 0 && p - acc[acc.length - 1] > 1) acc.push(-1); // gap marker
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, idx) =>
                  p === -1 ? (
                    <span key={`gap-${idx}`} className="px-1 text-slate-400 text-xs">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => goToPage(p)}
                      className={`w-8 h-8 rounded-md text-xs font-bold transition-colors ${
                        p === currentPage
                          ? "bg-brand-orange text-white"
                          : "border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-500"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-md text-slate-600 dark:text-slate-300 text-xs font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:border-slate-400 dark:hover:border-slate-500 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
