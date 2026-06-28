"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Plus, Trash2, Loader2 } from "lucide-react";

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Core fields
  const [form, setForm] = useState({
    name: "",
    slug: "",
    itemCode: "",
    type: "EQUIPMENT", // 'EQUIPMENT' | 'PART' | 'SERVICE'
    categoryId: "gas-burners",
    shortDesc: "",
    description: "",
    price: "",
    hsn: "84162000",
    taxRate: "18%",
    stockQty: "0",
    unit: "SET",
    image: "",
  });

  // Dynamic specs fields
  const [specs, setSpecs] = useState<{ label: string; value: string }[]>([]);

  // Fetch product on mount
  useEffect(() => {
    async function loadProduct() {
      try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) throw new Error("Failed to load product");
        const data = await response.json();

        setForm({
          name: data.name || "",
          slug: data.slug || "",
          itemCode: data.itemCode || "",
          type: data.type || "EQUIPMENT",
          categoryId: data.category?.slug || "gas-burners",
          shortDesc: data.shortDesc || "",
          description: data.description || "",
          price: data.price !== null && data.price !== undefined ? String(data.price) : "",
          hsn: data.hsn || "84162000",
          taxRate: data.taxRate || "18%",
          stockQty: data.stockQty !== null && data.stockQty !== undefined ? String(data.stockQty) : "0",
          unit: data.unit || "SET",
          image: data.image || "",
        });

        if (data.specs && Array.isArray(data.specs)) {
          setSpecs(data.specs.map((s: any) => ({ label: s.label, value: s.value })));
        }
      } catch (err) {
        alert("Error loading product. Redirecting...");
        router.push("/admin/products");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id, router]);

  const handleAddSpecRow = () => {
    setSpecs([...specs, { label: "", value: "" }]);
  };

  const handleRemoveSpecRow = (idx: number) => {
    setSpecs(specs.filter((_, i) => i !== idx));
  };

  const handleSpecChange = (idx: number, field: "label" | "value", val: string) => {
    setSpecs(
      specs.map((s, i) => (i === idx ? { ...s, [field]: val } : s))
    );
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: form.type === "EQUIPMENT" ? null : parseInt(form.price) || 0,
          stockQty: parseInt(form.stockQty) || 0,
          specs,
        }),
      });

      if (response.ok) {
        alert("Product updated successfully in database!");
        router.push("/admin/products");
      } else {
        const err = await response.json();
        alert(`Error updating product: ${err.error || "Unknown error"}`);
      }
    } catch (err) {
      alert("Network connection error.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async () => {
    const confirm = window.confirm("Are you sure you want to permanently delete this product from the database?");
    if (!confirm) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Product deleted successfully!");
        router.push("/admin/products");
      } else {
        const err = await response.json();
        alert(`Error deleting product: ${err.error || "Unknown error"}`);
      }
    } catch (err) {
      alert("Network connection error.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-8 h-8 text-brand-orange animate-spin" />
        <p className="text-slate-400 text-xs">Loading database records...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left max-w-4xl">
      {/* Title / Back */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Link
            href="/admin/products"
            className="inline-flex items-center space-x-1 text-slate-400 hover:text-white transition-colors text-xs font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Products Directory</span>
          </Link>
          <h1 className="text-2xl font-black text-white">Edit Product: {form.name}</h1>
          <p className="text-slate-500 text-xs font-mono">ID: {id}</p>
        </div>

        <button
          type="button"
          disabled={deleting}
          onClick={handleDeleteProduct}
          className="px-4 py-2.5 bg-red-950/20 hover:bg-red-950/40 border border-red-900/40 text-red-400 text-xs font-bold uppercase rounded-lg flex items-center space-x-1.5 self-start sm:self-center transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>{deleting ? "Deleting..." : "Delete Product"}</span>
        </button>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-6">
        
        {/* Core details block */}
        <div className="bg-[#0a1128]/50 border border-brand-slate/40 p-6 rounded-xl space-y-4">
          <h3 className="text-white font-bold text-sm border-b border-brand-slate/30 pb-2">Core Product Details</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-2">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Product Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-") })}
                placeholder="e.g. FlameTech FT-30 Gas Burner"
                className="w-full bg-[#060b13] border border-slate-700 rounded-md py-2 px-3 text-slate-200 text-sm focus:outline-none focus:border-brand-orange"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Product Slug *</label>
              <input
                type="text"
                required
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full bg-[#060b13] border border-slate-700 rounded-md py-2 px-3 text-slate-200 text-sm focus:outline-none focus:border-brand-orange"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Item Code (Sku)</label>
              <input
                type="text"
                value={form.itemCode}
                onChange={(e) => setForm({ ...form, itemCode: e.target.value })}
                placeholder="e.g. FT-30-GB"
                className="w-full bg-[#060b13] border border-slate-700 rounded-md py-2 px-3 text-slate-200 text-sm focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Category</label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="w-full bg-[#060b13] border border-slate-700 rounded-md py-2 px-3 text-slate-200 text-sm focus:outline-none"
              >
                <option value="gas-burners">Gas Burners</option>
                <option value="oil-burners">Oil Burners</option>
                <option value="control-panels">Control Panels</option>
                <option value="spare-parts">Spare Parts & Accessories</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Product Flow Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full bg-[#060b13] border border-slate-700 rounded-md py-2 px-3 text-slate-200 text-sm focus:outline-none"
              >
                <option value="EQUIPMENT">EQUIPMENT (B2B Lead/Quote Flow)</option>
                <option value="PART">PART (E-commerce Buy-Now Flow)</option>
                <option value="SERVICE">SERVICE (AMC / Maintenance Contract)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pricing & inventory */}
        {form.type !== "EQUIPMENT" && (
          <div className="bg-[#0a1128]/50 border border-brand-slate/40 p-6 rounded-xl space-y-4">
            <h3 className="text-white font-bold text-sm border-b border-brand-slate/30 pb-2">Pricing & Inventory</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Base Price (INR) *</label>
                <input
                  type="number"
                  required
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="e.g. 3499"
                  className="w-full bg-[#060b13] border border-slate-700 rounded-md py-2 px-3 text-slate-200 text-sm focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Stock Qty *</label>
                <input
                  type="number"
                  required
                  value={form.stockQty}
                  onChange={(e) => setForm({ ...form, stockQty: e.target.value })}
                  placeholder="e.g. 50"
                  className="w-full bg-[#060b13] border border-slate-700 rounded-md py-2 px-3 text-slate-200 text-sm focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Sales Unit</label>
                <input
                  type="text"
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  placeholder="PIECES, SET"
                  className="w-full bg-[#060b13] border border-slate-700 rounded-md py-2 px-3 text-slate-200 text-sm focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Product Image Showcase & Upload */}
        <div className="bg-white dark:bg-[#0a1128]/50 border border-slate-200 dark:border-brand-slate/40 p-6 rounded-xl space-y-4">
          <h3 className="text-slate-900 dark:text-white font-bold text-sm border-b border-slate-200 dark:border-brand-slate/30 pb-2">Product Image</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Image Preview Container */}
            <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-slate-100 dark:bg-brand-navy border border-slate-200 dark:border-brand-slate/30 flex items-center justify-center">
              {form.image ? (
                <img
                  src={form.image}
                  alt="Product preview"
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                <span className="text-xs text-slate-400 italic">No image uploaded</span>
              )}
            </div>

            {/* URL/Upload input fields */}
            <div className="col-span-2 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Image Path / URL</label>
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="e.g., /images/ft-05.jpg"
                  className="w-full bg-slate-50 dark:bg-[#060b13] border border-slate-300 dark:border-slate-700 rounded-md py-2 px-3 text-slate-800 dark:text-slate-200 text-sm focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Upload New Image File</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setForm({ ...form, image: reader.result as string });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full text-xs text-slate-600 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-brand-orange/15 file:text-brand-orange hover:file:bg-brand-orange/20 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Short & Long descriptions */}
        <div className="bg-[#0a1128]/50 border border-brand-slate/40 p-6 rounded-xl space-y-4">
          <h3 className="text-white font-bold text-sm border-b border-brand-slate/30 pb-2">Catalog Explanatory Text</h3>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Short Tagline Description</label>
              <input
                type="text"
                value={form.shortDesc}
                onChange={(e) => setForm({ ...form, shortDesc: e.target.value })}
                placeholder="High output double stage utility burner..."
                className="w-full bg-[#060b13] border border-slate-700 rounded-md py-2 px-3 text-slate-200 text-sm focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Long Description</label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Details on combustion parameters, materials, valves, safety checks..."
                className="w-full bg-[#060b13] border border-slate-700 rounded-md py-2 px-3 text-slate-200 text-sm focus:outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Dynamic specification rows */}
        <div className="bg-[#0a1128]/50 border border-brand-slate/40 p-6 rounded-xl space-y-4">
          <div className="flex justify-between items-center border-b border-brand-slate/30 pb-2">
            <h3 className="text-white font-bold text-sm">Technical Specifications Table Rows</h3>
            <button
              type="button"
              onClick={handleAddSpecRow}
              className="px-2.5 py-1 bg-brand-teal/10 hover:bg-brand-teal/20 border border-brand-teal/30 text-brand-teal text-[10px] font-bold uppercase rounded flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Spec Row</span>
            </button>
          </div>

          <div className="space-y-3">
            {specs.map((s, idx) => (
              <div key={idx} className="flex items-center space-x-3">
                <input
                  type="text"
                  required
                  placeholder="Parameter Label (e.g. Thermal Power)"
                  value={s.label}
                  onChange={(e) => handleSpecChange(idx, "label", e.target.value)}
                  className="flex-1 bg-[#060b13] border border-slate-700 rounded-md py-2 px-3 text-slate-200 text-xs focus:outline-none focus:border-brand-orange"
                />
                <input
                  type="text"
                  required
                  placeholder="Value (e.g. 50 - 150 KW)"
                  value={s.value}
                  onChange={(e) => handleSpecChange(idx, "value", e.target.value)}
                  className="flex-1 bg-[#060b13] border border-slate-700 rounded-md py-2 px-3 text-slate-200 text-xs focus:outline-none focus:border-brand-orange"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSpecRow(idx)}
                  className="p-2 bg-red-950/20 text-red-500 rounded border border-red-900/20 hover:bg-red-950/50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Form CTA */}
        <div className="pt-2 flex justify-end space-x-3">
          <Link
            href="/admin/products"
            className="px-5 py-3 border border-slate-700 rounded-lg text-slate-300 font-bold text-xs hover:bg-slate-800/10 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-brand-orange hover:bg-brand-orange/95 text-white font-bold rounded-lg text-xs transition-all flex items-center space-x-2 shadow-md shadow-brand-orange/15"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Changes..." : "Save Product Details"}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
