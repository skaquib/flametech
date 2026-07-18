import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Search, Flame, Settings, ShoppingCart, Info, Wrench, Shield } from "lucide-react";
import ProductListClient from "./ProductListClient";
import { getProducts, getCategories } from "@/lib/products-data";

// Revalidate every 2 minutes: serves cached HTML instantly to visitors instead of
// hitting the DB on every request, while still keeping the catalog reasonably fresh.
export const revalidate = 120;

export const metadata: Metadata = {
  title: "Industrial Burner Catalog — Gas & Oil Burners, Control Panels, Spares",
  description: "Browse FlameTech Engineering's full B2B catalog: FT-03 to FT-25 gas burners, oil burners, automatic control panels, and spare parts (solenoid valves, ignition electrodes, flame sensors). In-stock, ready to ship across India.",
  keywords: [
    "industrial gas burner catalog",
    "buy burner spare parts online",
    "gas solenoid valve India",
    "ignition electrode set",
    "flame sensor photocell",
    "burner control panel price",
  ],
  alternates: { canonical: "/products" },
  openGraph: {
    title: "Industrial Burner Catalog | FlameTech Engineering",
    description: "FT-03 to FT-25 gas burners, oil burners, control panels, and spare parts — B2B pricing and instant quotes.",
    url: "/products",
    type: "website",
  },
};

export default async function ProductsPage() {
  const products = await getProducts();
  const categories = await getCategories();

  return (
    <div className="pt-24 min-h-screen bg-slate-50 dark:bg-brand-dark pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner */}
        <div className="text-left space-y-3 mb-10 pb-8 border-b border-slate-200 dark:border-brand-slate/40">
          <div className="flex items-center space-x-2 text-brand-orange text-xs font-bold uppercase tracking-widest">
            <Settings className="w-4 h-4" />
            <span>Industrial Spares & Equipment</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">FlameTech Catalog</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-3xl">
            Browse our line-up of industrial gas burners, control boxes, valves, and electrodes. Equipments are quote-only; spares can be purchased online.
          </p>
        </div>

        {/* Client-Side Filtering Grid */}
        <ProductListClient products={products as any} categories={categories as any} />
      </div>
    </div>
  );
}
