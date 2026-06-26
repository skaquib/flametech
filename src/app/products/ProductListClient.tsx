"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { Search, Flame, Settings, ShoppingCart, Check, Info } from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
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

export default function ProductListClient({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all"); // 'all' | 'EQUIPMENT' | 'PART'
  const [addedItemSlug, setAddedItemSlug] = useState<string | null>(null);

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

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      itemCode: product.itemCode,
      price: product.price || 0,
      image: `/images/${product.slug}.jpg`,
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
        <div className="bg-white dark:bg-brand-navy/70 border border-slate-200 dark:border-brand-slate/40 p-6 rounded-xl space-y-6 text-left backdrop-blur-md shadow-sm">
          <h3 className="text-slate-900 dark:text-white font-bold text-base border-b border-slate-200 dark:border-brand-slate/40 pb-3">Filters</h3>
          
          {/* Search Box */}
          <div className="space-y-2">
            <label className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Search Catalog</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Item name, code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-55 dark:bg-[#060b13] border border-slate-300 dark:border-slate-700 rounded-md py-2 px-3 pl-9 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:border-brand-orange focus:bg-white"
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
                  onClick={() => setSelectedType(t.val)}
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
                onClick={() => setSelectedCategory("all")}
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
                  onClick={() => setSelectedCategory(c.slug)}
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
            {filteredProducts.map((p) => {
              const isEquipment = p.type === "EQUIPMENT";

              return (
                <Link
                  key={p.id}
                  href={`/products/${p.slug}`}
                  className="group bg-white dark:bg-[#0a1128]/40 border border-slate-200 dark:border-brand-slate/30 hover:border-slate-350 dark:hover:border-brand-slate rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full text-left relative"
                >
                  {/* Card Image fallback design */}
                  <div className="aspect-[4/3] bg-slate-100 dark:bg-brand-navy relative overflow-hidden flex items-center justify-center border-b border-slate-200 dark:border-brand-slate/30">
                    <div className="absolute top-2 left-2 z-10 bg-white/90 dark:bg-brand-dark/85 border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded text-[9px] uppercase tracking-wider text-slate-600 dark:text-slate-400 font-bold shadow-sm">
                      {p.category.name}
                    </div>
                    {isEquipment ? (
                      <Flame className="w-10 h-10 text-brand-orange/20 group-hover:scale-110 transition-transform group-hover:text-brand-orange/30 duration-300" />
                    ) : (
                      <Settings className="w-10 h-10 text-brand-teal/20 group-hover:rotate-45 transition-transform duration-300" />
                    )}
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
      </div>
    </div>
  );
}
