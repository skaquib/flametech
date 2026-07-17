import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Plus, Search, Flame, Settings, Edit3, ShieldAlert } from "lucide-react";
import ProductsDirectoryClient from "./ProductsDirectoryClient";

export const dynamic = "force-dynamic";

// Mock fallbacks in case database connection fails
const fallbackProducts = [
  {
    id: "ft-03",
    name: "FlameTech FT-03 Gas Burner",
    slug: "ft-03",
    itemCode: "FT-03-GB",
    type: "EQUIPMENT",
    price: null,
    stockQty: 0,
    unit: "SET",
    isActive: true,
  },
  {
    id: "ft-05",
    name: "FlameTech FT-05 Gas Burner",
    slug: "ft-05",
    itemCode: "FT-05-GB",
    type: "EQUIPMENT",
    price: null,
    stockQty: 0,
    unit: "SET",
    isActive: true,
  },
  {
    id: "gas-solenoid",
    name: "Gas Solenoid Valve 1/2\"",
    slug: "gas-solenoid-valve-1-2",
    itemCode: "FT-SP-SV12",
    type: "PART",
    price: 3499,
    stockQty: 45,
    unit: "PIECES",
    isActive: true,
  },
  {
    id: "ignition-electrode",
    name: "Ignition Electrode Set",
    slug: "ignition-electrode-set",
    itemCode: "FT-SP-IE-SET",
    type: "PART",
    price: 799,
    stockQty: 120,
    unit: "SET",
    isActive: false,
  },
];

async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
    });
    if (products.length === 0) return fallbackProducts;
    return products;
  } catch (error) {
    console.error("Products admin directory DB fetch error, falling back to mock data");
    return fallbackProducts;
  }
}

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

async function getTrashedProducts() {
  try {
    // Lazy purge: anything past the 7-day undo window is gone for good before we list the rest.
    const cutoff = new Date(Date.now() - SEVEN_DAYS_MS);
    await prisma.product.deleteMany({ where: { deletedAt: { lt: cutoff } } });

    return await prisma.product.findMany({
      where: { deletedAt: { not: null } },
      orderBy: { deletedAt: "desc" },
    });
  } catch (error) {
    console.error("Trashed products DB fetch error");
    return [];
  }
}

export default async function AdminProductsPage() {
  const [products, trashedProducts] = await Promise.all([getProducts(), getTrashedProducts()]);

  return (
    <div className="space-y-8 text-left">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Products Directory</h1>
          <p className="text-slate-500 text-xs mt-1">Manage burners catalog items, spares inventory details, and visibility status.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="px-4 py-2.5 bg-brand-orange hover:bg-brand-orange/95 text-white font-bold rounded-lg text-xs transition-all flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Product</span>
        </Link>
      </div>

      {/* Directory client wrapper */}
      <ProductsDirectoryClient products={products as any} trashedProducts={trashedProducts as any} />

    </div>
  );
}
