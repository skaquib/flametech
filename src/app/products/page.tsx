import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Search, Flame, Settings, ShoppingCart, Info, Wrench, Shield } from "lucide-react";
import ProductListClient from "./ProductListClient";

// Force dynamic so connection errors don't crash static exports if DB isn't configured yet
export const dynamic = "force-dynamic";

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

// High fidelity fallback/mock data in case Postgres isn't running yet
const fallbackProducts = [
  {
    id: "ft-03",
    name: "FlameTech FT-03 Gas Burner",
    slug: "ft-03",
    itemCode: "FT-03-GB",
    type: "EQUIPMENT",
    category: { name: "Gas Burners", slug: "gas-burners" },
    shortDesc: "High efficiency B2B industrial gas burner for baking and light industry.",
    price: null,
    stockQty: 0,
    unit: "SET",
    taxRate: "18%",
    specs: [
      { label: "Thermal Power", value: "30 - 90 KW" },
      { label: "Gas Flow Rate", value: "3 - 9 m³/h" },
    ],
  },
  {
    id: "ft-05",
    name: "FlameTech FT-05 Gas Burner",
    slug: "ft-05",
    itemCode: "FT-05-GB",
    type: "EQUIPMENT",
    category: { name: "Gas Burners", slug: "gas-burners" },
    shortDesc: "Commercial B2B gas burner for large baking ovens and medium industrial dryers.",
    price: null,
    stockQty: 0,
    unit: "SET",
    taxRate: "18%",
    specs: [
      { label: "Thermal Power", value: "50 - 150 KW" },
      { label: "Gas Flow Rate", value: "5 - 15 m³/h" },
    ],
  },
  {
    id: "ft-10",
    name: "FlameTech FT-10 Gas Burner",
    slug: "ft-10",
    itemCode: "FT-10-GB",
    type: "EQUIPMENT",
    category: { name: "Gas Burners", slug: "gas-burners" },
    shortDesc: "Industrial heavy-duty gas burner for large dryers and steam boilers.",
    price: null,
    stockQty: 0,
    unit: "SET",
    taxRate: "18%",
    specs: [
      { label: "Thermal Power", value: "100 - 300 KW" },
      { label: "Gas Flow Rate", value: "10 - 30 m³/h" },
    ],
  },
  {
    id: "ft-15",
    name: "FlameTech FT-15 Gas Burner",
    slug: "ft-15",
    itemCode: "FT-15-GB",
    type: "EQUIPMENT",
    category: { name: "Gas Burners", slug: "gas-burners" },
    shortDesc: "High capacity gas burner for heavy industry, furnaces, and boilers.",
    price: null,
    stockQty: 0,
    unit: "SET",
    taxRate: "18%",
    specs: [
      { label: "Thermal Power", value: "150 - 450 KW" },
      { label: "Gas Flow Rate", value: "15 - 45 m³/h" },
    ],
  },
  {
    id: "semi-auto-panel",
    name: "Semi-Automatic Burner Control Panel",
    slug: "semi-auto-control-panel",
    itemCode: "FT-CP-SA",
    type: "EQUIPMENT",
    category: { name: "Control Panels", slug: "control-panels" },
    shortDesc: "Relay-based industrial burner controller.",
    price: null,
    stockQty: 0,
    unit: "SET",
    taxRate: "18%",
    specs: [
      { label: "Enclosure Type", value: "IP54 Mild Steel" },
      { label: "Control Voltage", value: "110V AC" },
    ],
  },
  {
    id: "gas-solenoid",
    name: "Gas Solenoid Valve 1/2\"",
    slug: "gas-solenoid-valve-1-2",
    itemCode: "FT-SP-SV12",
    type: "PART",
    category: { name: "Spare Parts & Accessories", slug: "spare-parts" },
    shortDesc: "Class A safety gas solenoid valve, 1/2-inch fitting, 230V.",
    price: 3499,
    stockQty: 45,
    unit: "PIECES",
    taxRate: "18%",
    specs: [
      { label: "Inlet Fitting", value: "1/2 inch BSP" },
      { label: "Operating Voltage", value: "230V AC" },
    ],
  },
  {
    id: "ignition-electrode",
    name: "Ignition Electrode Set",
    slug: "ignition-electrode-set",
    itemCode: "FT-SP-IE-SET",
    type: "PART",
    category: { name: "Spare Parts & Accessories", slug: "spare-parts" },
    shortDesc: "Dual electrode spark igniter kit with high-temp ceramic insulation.",
    price: 799,
    stockQty: 120,
    unit: "SET",
    taxRate: "18%",
    specs: [
      { label: "Max Temperature", value: "1300 °C" },
      { label: "Electrode Material", value: "Kanthal A-1" },
    ],
  },
  {
    id: "flame-sensor",
    name: "Flame Sensor Photoelectric Cell",
    slug: "flame-sensor-photocell",
    itemCode: "FT-SP-FC-FLAME",
    type: "PART",
    category: { name: "Spare Parts & Accessories", slug: "spare-parts" },
    shortDesc: "High sensitivity photoelectric photocell flame scanner.",
    price: 1899,
    stockQty: 60,
    unit: "PIECES",
    taxRate: "18%",
    specs: [
      { label: "Spectral Range", value: "190 - 270 nm" },
      { label: "Response Speed", value: "< 100 ms" },
    ],
  },
];

async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: true,
        specs: true,
      },
    });

    if (products.length === 0) return fallbackProducts;
    return products;
  } catch (error) {
    console.error("Database connection failed. Falling back to mock data.", error);
    return fallbackProducts;
  }
}

async function getCategories() {
  try {
    const categories = await prisma.category.findMany();
    if (categories.length === 0) {
      return [
        { name: "Gas Burners", slug: "gas-burners" },
        { name: "Control Panels", slug: "control-panels" },
        { name: "Spare Parts & Accessories", slug: "spare-parts" },
      ];
    }
    return categories;
  } catch (error) {
    return [
      { name: "Gas Burners", slug: "gas-burners" },
      { name: "Control Panels", slug: "control-panels" },
      { name: "Spare Parts & Accessories", slug: "spare-parts" },
    ];
  }
}

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
