import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { Flame, Settings, ArrowLeft, ShieldAlert, FileText, CheckCircle2 } from "lucide-react";
import ProductDetailClient from "./ProductDetailClient";

// Revalidate every 2 minutes instead of rendering fresh on every visit — same
// catalog data doesn't need a DB round-trip for every single product-page view.
export const revalidate = 120;

// High fidelity fallback/mock products matching seed data
const fallbackProducts = [
  {
    id: "ft-03",
    name: "FlameTech FT-03 Gas Burner",
    slug: "ft-03",
    itemCode: "FT-03-GB",
    type: "EQUIPMENT",
    category: { name: "Gas Burners", slug: "gas-burners" },
    shortDesc: "High efficiency B2B industrial gas burner for baking and light industry.",
    description: "The FlameTech FT-03 is engineered for maximum fuel savings and thermal efficiency in small-scale bakeries and powder coating ovens. Featuring automatic ignition and a highly stable gas mixing nozzle.",
    price: null,
    stockQty: 0,
    unit: "SET",
    taxRate: "18%",
    datasheetUrl: "/datasheets/ft-03-spec.pdf",
    specs: [
      { label: "Thermal Power (KW)", value: "30 - 90", unit: "KW" },
      { label: "Thermal Power (Kcal/h)", value: "25,000 - 77,000", unit: "Kcal/h" },
      { label: "Gas Flow Rate", value: "3 - 9", unit: "m³/h" },
      { label: "Gas Pressure Range", value: "20 - 50", unit: "mbar" },
      { label: "Motor Power (W)", value: "90", unit: "W" },
      { label: "Power Supply", value: "230V / 1Ph / 50Hz", unit: null },
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
    description: "The FT-05 burner provides reliable temperature control and homogeneous flame distribution. Ideal for industrial baking, boiler retrofitting, and metal pre-treatment plants.",
    price: null,
    stockQty: 0,
    unit: "SET",
    taxRate: "18%",
    datasheetUrl: "/datasheets/ft-05-spec.pdf",
    specs: [
      { label: "Thermal Power (KW)", value: "50 - 150", unit: "KW" },
      { label: "Thermal Power (Kcal/h)", value: "43,000 - 129,000", unit: "Kcal/h" },
      { label: "Gas Flow Rate", value: "5 - 15", unit: "m³/h" },
      { label: "Gas Pressure Range", value: "20 - 50", unit: "mbar" },
      { label: "Motor Power (W)", value: "150", unit: "W" },
      { label: "Power Supply", value: "230V / 1Ph / 50Hz", unit: null },
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
    description: "Designed for high-demand industrial process heat, the FT-10 features a modular design with custom flame configurations. Perfect for asphalt mixing plants, large boiler units, and chemical process heating.",
    price: null,
    stockQty: 0,
    unit: "SET",
    taxRate: "18%",
    datasheetUrl: "/datasheets/ft-10-spec.pdf",
    specs: [
      { label: "Thermal Power (KW)", value: "100 - 300", unit: "KW" },
      { label: "Thermal Power (Kcal/h)", value: "86,000 - 258,000", unit: "Kcal/h" },
      { label: "Gas Flow Rate", value: "10 - 30", unit: "m³/h" },
      { label: "Gas Pressure Range", value: "25 - 60", unit: "mbar" },
      { label: "Motor Power (W)", value: "250", unit: "W" },
      { label: "Power Supply", value: "230V / 1Ph / 50Hz", unit: null },
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
    description: "The FT-15 model is tailored for severe environments where raw power and precise control are critical. Excellent efficiency with modern air-gas ratio controls.",
    price: null,
    stockQty: 0,
    unit: "SET",
    taxRate: "18%",
    datasheetUrl: "/datasheets/ft-15-spec.pdf",
    specs: [
      { label: "Thermal Power (KW)", value: "150 - 450", unit: "KW" },
      { label: "Thermal Power (Kcal/h)", value: "129,000 - 387,000", unit: "Kcal/h" },
      { label: "Gas Flow Rate", value: "15 - 45", unit: "m³/h" },
      { label: "Gas Pressure Range", value: "30 - 80", unit: "mbar" },
      { label: "Motor Power (W)", value: "370", unit: "W" },
      { label: "Power Supply", value: "230V / 1Ph / 50Hz", unit: null },
    ],
  },
  {
    id: "ft-20",
    name: "FlameTech FT-20 Gas Burner",
    slug: "ft-20",
    itemCode: "FT-20-GB",
    type: "EQUIPMENT",
    category: { name: "Gas Burners", slug: "gas-burners" },
    shortDesc: "Extreme duty double stage industrial gas burner.",
    description: "FlameTech's FT-20 double-stage gas burner is built for metallurgical processing, rotary kilns, and large utility boilers, minimizing thermal shock via smooth high/low flame transitions.",
    price: null,
    stockQty: 0,
    unit: "SET",
    taxRate: "18%",
    datasheetUrl: "/datasheets/ft-20-spec.pdf",
    specs: [
      { label: "Thermal Power (KW)", value: "250 - 750", unit: "KW" },
      { label: "Thermal Power (Kcal/h)", value: "215,000 - 645,000", unit: "Kcal/h" },
      { label: "Gas Flow Rate", value: "25 - 75", unit: "m³/h" },
      { label: "Gas Pressure Range", value: "40 - 100", unit: "mbar" },
      { label: "Motor Power (W)", value: "750", unit: "W" },
      { label: "Power Supply", value: "415V / 3Ph / 50Hz", unit: null },
    ],
  },
  {
    id: "ft-25",
    name: "FlameTech FT-25 Gas Burner",
    slug: "ft-25",
    itemCode: "FT-25-GB",
    type: "EQUIPMENT",
    category: { name: "Gas Burners", slug: "gas-burners" },
    shortDesc: "Super capacity industrial process burner for steel plants and utility power.",
    description: "Our flagship FT-25 industrial burner represents the peak of gas-firing technology. Delivers extreme heat output while complying with strict NOx emissions criteria.",
    price: null,
    stockQty: 0,
    unit: "SET",
    taxRate: "18%",
    datasheetUrl: "/datasheets/ft-25-spec.pdf",
    specs: [
      { label: "Thermal Power (KW)", value: "400 - 1200", unit: "KW" },
      { label: "Thermal Power (Kcal/h)", value: "344,000 - 1,032,000", unit: "Kcal/h" },
      { label: "Gas Flow Rate", value: "40 - 120", unit: "m³/h" },
      { label: "Gas Pressure Range", value: "50 - 120", unit: "mbar" },
      { label: "Motor Power (W)", value: "1500", unit: "W" },
      { label: "Power Supply", value: "415V / 3Ph / 50Hz", unit: null },
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
    description: "Features push-button ignition controls, flame failure alarms, fuel cut-off interlocks, and digital temperature indicators. Fully pre-wired and tested.",
    price: null,
    stockQty: 0,
    unit: "SET",
    taxRate: "18%",
    specs: [
      { label: "Enclosure Type", value: "IP54 Mild Steel", unit: null },
      { label: "Control Voltage", value: "110V AC", unit: null },
      { label: "Indicators", value: "Power, Ignition, Flame On, Alarm", unit: null },
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
    description: "Direct-acting safety shutoff solenoid valve. Built from premium die-cast brass. Quick opening and quick closing (< 1s) to guarantee instantaneous fuel shutoff.",
    price: 3499,
    stockQty: 45,
    unit: "PIECES",
    taxRate: "18%",
    specs: [
      { label: "Inlet Fitting", value: "1/2 inch BSP", unit: null },
      { label: "Operating Voltage", value: "230V AC / 50Hz", unit: null },
      { label: "Maximum Pressure", value: "200 mbar", unit: null },
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
    description: "Replacement dual electrode spark set suitable for FT-03 and FT-05 burners. Glazed alumina ceramic sheath handles heat up to 1300°C.",
    price: 799,
    stockQty: 120,
    unit: "SET",
    taxRate: "18%",
    specs: [
      { label: "Max Temperature", value: "1300 °C", unit: null },
      { label: "Electrode Material", value: "Kanthal A-1", unit: null },
      { label: "Insulator Length", value: "85 mm", unit: null },
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
    description: "Standard UV/visible light photocell sensor for automatic burner flame supervision. Includes mounting bracket and 1.5-meter heat-shielded cable.",
    price: 1899,
    stockQty: 60,
    unit: "PIECES",
    taxRate: "18%",
    specs: [
      { label: "Spectral Range", value: "190 - 270 nm (UV)", unit: null },
      { label: "Response Speed", value: "< 100 ms", unit: null },
      { label: "Cable Rating", value: "180°C Silicone Shielded", unit: null },
    ],
  },
];

async function getProductBySlug(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        specs: true,
        images: { orderBy: { position: "asc" } },
      },
    });
    if (!product) {
      return fallbackProducts.find((p) => p.slug === slug) || null;
    }
    return product;
  } catch (error) {
    console.error("Database connection failed. Loading fallback product.", error);
    return fallbackProducts.find((p) => p.slug === slug) || null;
  }
}

interface PageParams {
  params: Promise<{ slug: string }>;
}

const SITE_URL = "https://flametechengineering.com";

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  const title = `${product.name}${product.itemCode ? ` (${product.itemCode})` : ""}`;
  const description =
    (product as any).shortDesc ||
    product.description ||
    `Buy ${product.name} from FlameTech Engineering — B2B industrial burner and spare parts manufacturer.`;

  return {
    title,
    description,
    keywords: [
      product.name,
      product.itemCode || undefined,
      product.category?.name,
      "buy industrial burner online",
      "FlameTech Engineering spare parts",
    ].filter(Boolean) as string[],
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title,
      description,
      url: `/products/${product.slug}`,
      type: "website",
      images: (product as any).image ? [`${SITE_URL}${(product as any).image}`] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: PageParams) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.itemCode || undefined,
    description: product.description || (product as any).shortDesc || product.name,
    category: product.category?.name,
    brand: { "@type": "Brand", name: "FlameTech Engineering" },
    image: (product as any).image ? `${SITE_URL}${(product as any).image}` : undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.price ?? undefined,
      availability:
        product.stockQty && product.stockQty > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/PreOrder",
      url: `${SITE_URL}/products/${product.slug}`,
    },
  };

  return (
    <div className="pt-24 min-h-screen bg-slate-50 dark:bg-brand-dark pb-20 text-left">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <div className="mb-8">
          <Link
            href="/products"
            className="inline-flex items-center space-x-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Catalog</span>
          </Link>
        </div>

        {/* Client-Side Detail Handler */}
        <ProductDetailClient product={product as any} />
      </div>
    </div>
  );
}
