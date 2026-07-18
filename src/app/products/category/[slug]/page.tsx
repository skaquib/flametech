import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Search, Flame, Settings, ShoppingCart, Info, Wrench, Shield } from "lucide-react";
import ProductListClient from "../../ProductListClient";
import { getProducts, getCategories } from "@/lib/products-data";
import { SITE_URL } from "@/lib/constants";

export const revalidate = 120;

const CATEGORY_CONTENT: Record<string, { title: string; description: string; keywords: string[]; intro: string }> = {
  "gas-burners": {
    title: "Industrial Gas Burners — FT-03 to FT-25 Series",
    description: "Industrial gas burners for bakery ovens, dryers, and boilers — FT-03 to FT-25 series from FlameTech Engineering. Request a quote for pricing and installation.",
    keywords: ["industrial gas burner", "gas burner for bakery oven", "FT series gas burner", "industrial gas burner manufacturer India"],
    intro: "Our FT-series industrial gas burners cover a thermal power range from small bakery ovens to heavy-duty furnaces and boilers, built for continuous industrial duty across Indian manufacturing plants.",
  },
  "oil-burners": {
    title: "Industrial Oil Burners (LDO/HSD)",
    description: "Industrial light diesel oil (LDO) and heavy fuel burners from FlameTech Engineering, for steam boilers, stenter machines, and process heating. Request a quote.",
    keywords: ["industrial oil burner", "LDO burner India", "industrial oil burner manufacturer Mumbai", "diesel burner for boiler"],
    intro: "Industrial oil burners running on LDO, HSD, or light fuel oils, sized for steam boilers, textile stenter machines, and pharmaceutical process heating.",
  },
  "control-panels": {
    title: "Automatic Burner Control Panels",
    description: "Automatic and semi-automatic burner control panels from FlameTech Engineering — relay-based and PLC-based sequence controllers for gas and oil burners.",
    keywords: ["automatic burner control panel", "burner control panel manufacturer", "semi automatic control panel", "burner sequence controller"],
    intro: "Control panels for automatic burner ignition, flame supervision, and safety interlocks — from relay-based semi-automatic panels to fully automatic sequence controllers.",
  },
  "spare-parts": {
    title: "Burner Spare Parts Online — Valves, Electrodes, Sensors",
    description: "Buy industrial burner spare parts online: gas solenoid valves, ignition electrodes, flame sensors, and more — in stock, ready to ship across India.",
    keywords: ["buy burner spare parts online", "gas solenoid valve India", "ignition electrode set", "flame sensor photocell", "burner spare parts supplier Mumbai"],
    intro: "In-stock burner spare parts — solenoid valves, ignition electrodes, flame sensors, and control accessories — ready to ship pan-India, no minimum order.",
  },
};

interface PageParams {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(CATEGORY_CONTENT).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const content = CATEGORY_CONTENT[slug];
  if (!content) return { title: "Category Not Found" };

  return {
    title: content.title,
    description: content.description,
    keywords: content.keywords,
    alternates: { canonical: `/products/category/${slug}` },
    openGraph: {
      title: `${content.title} | FlameTech Engineering`,
      description: content.description,
      url: `/products/category/${slug}`,
      type: "website",
    },
  };
}

export default async function ProductCategoryPage({ params }: PageParams) {
  const { slug } = await params;
  const content = CATEGORY_CONTENT[slug];
  if (!content) notFound();

  const [allProducts, categories] = await Promise.all([getProducts(), getCategories()]);
  const categoryProducts = allProducts.filter((p: any) => p.category?.slug === slug);
  const categoryName = categories.find((c: any) => c.slug === slug)?.name || content.title;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Products", item: `${SITE_URL}/products` },
      { "@type": "ListItem", position: 3, name: categoryName, item: `${SITE_URL}/products/category/${slug}` },
    ],
  };

  return (
    <div className="pt-24 min-h-screen bg-slate-50 dark:bg-brand-dark pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner */}
        <div className="text-left space-y-3 mb-10 pb-8 border-b border-slate-200 dark:border-brand-slate/40">
          <div className="flex items-center space-x-2 text-brand-orange text-xs font-bold uppercase tracking-widest">
            <Settings className="w-4 h-4" />
            <span>{categoryName}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">{content.title}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-3xl">{content.intro}</p>
        </div>

        {/* Client-Side Filtering Grid, pre-scoped to this category */}
        <ProductListClient products={categoryProducts as any} categories={categories as any} initialCategory={slug} />
      </div>
    </div>
  );
}
