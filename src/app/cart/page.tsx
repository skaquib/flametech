"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { Trash2, ShoppingBag, ArrowRight, Settings, FileText } from "lucide-react";

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    getSubtotal,
    getTaxAmount,
    getTotal,
    getTotalItems,
  } = useCartStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="pt-32 min-h-screen bg-slate-50 dark:bg-brand-dark flex items-center justify-center">
        <p className="text-slate-600 dark:text-slate-400 text-sm">Loading your cart...</p>
      </div>
    );
  }

  const subtotal = getSubtotal();
  const tax = getTaxAmount();
  const grandTotal = getTotal();
  const totalItems = getTotalItems();

  return (
    <div className="pt-24 min-h-screen bg-slate-50 dark:bg-brand-dark pb-20 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="border-b border-slate-200 dark:border-brand-slate/40 pb-6 mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-3">
            <ShoppingBag className="w-8 h-8 text-brand-orange" />
            <span>Shopping Cart</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Review standard items and services prior to checkout.</p>
        </div>

        {items.length === 0 ? (
          <div className="bg-slate-100/50 dark:bg-[#0a1128]/20 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-16 text-center space-y-5">
            <ShoppingBag className="w-12 h-12 mx-auto text-slate-400 dark:text-slate-700 animate-bounce" />
            <h2 className="text-slate-900 dark:text-white text-lg font-bold">Your cart is empty</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
              You haven't added any spare parts, accessories, or AMC plans to your cart yet. Check our catalog to order spares online.
            </p>
            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-brand-orange hover:bg-brand-orange/95 text-white font-bold rounded-lg text-sm transition-all"
              >
                <span>Browse Products</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider pb-2 border-b border-slate-200 dark:border-slate-800">
                <span>Ordered Item</span>
                <div className="flex space-x-24 pr-4">
                  <span>Quantity</span>
                  <span>Total Price</span>
                </div>
              </div>

              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-[#0a1128]/40 border border-slate-200 dark:border-brand-slate/30 p-5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-300 dark:hover:border-brand-slate/60 transition-colors shadow-sm"
                >
                  {/* Left: Info */}
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-brand-navy rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0">
                      {item.slug === "amc-service-contract" ? (
                        <FileText className="w-6 h-6 text-brand-orange" />
                      ) : (
                        <Settings className="w-6 h-6 text-brand-teal" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-white text-sm leading-tight hover:text-brand-orange transition-colors">
                        <Link href={`/products/${item.slug}`}>{item.name}</Link>
                      </h3>
                      {item.itemCode && (
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold block mt-0.5">
                          Code: {item.itemCode}
                        </span>
                      )}
                      <span className="text-xs text-brand-orange font-medium mt-1 block sm:hidden">
                        ₹{item.price.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Right: Controls & prices */}
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-12 border-t sm:border-t-0 border-slate-200 dark:border-slate-800 pt-3 sm:pt-0">
                    {/* Qty controller */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-brand-dark rounded flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-slate-800 dark:text-white text-xs font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-brand-dark rounded flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm"
                      >
                        +
                      </button>
                    </div>

                    {/* Total Price and Delete */}
                    <div className="flex items-center space-x-6 text-right">
                      <div>
                        <span className="text-sm font-bold text-slate-900 dark:text-white block">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                          ₹{item.price.toLocaleString()} each
                        </span>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 bg-red-950/10 dark:bg-red-950/20 text-red-500 rounded border border-red-200 dark:border-red-900/25 hover:bg-red-950/50 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear button */}
              <div className="pt-2 flex justify-start">
                <button
                  onClick={clearCart}
                  className="text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 px-3 py-1.5 rounded transition-all"
                >
                  Clear Shopping Basket
                </button>
              </div>
            </div>

            {/* Summary Box */}
            <div className="lg:col-span-4">
              <div className="bg-white dark:bg-[#0a1128]/70 border border-slate-200 dark:border-brand-slate/40 p-8 rounded-2xl space-y-6 shadow-md backdrop-blur-md">
                <h3 className="text-slate-900 dark:text-white font-bold text-base border-b border-slate-200 dark:border-brand-slate/40 pb-3">
                  Summary
                </h3>

                <div className="space-y-3.5 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Items Count</span>
                    <span className="text-slate-900 dark:text-white font-bold">{totalItems}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-slate-900 dark:text-white font-bold">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (18% GST estimate)</span>
                    <span className="text-slate-900 dark:text-white font-bold">₹{tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery fee</span>
                    <span className="text-brand-teal font-bold">FREE Shipping</span>
                  </div>
                  <div className="flex justify-between text-slate-950 dark:text-white font-extrabold border-t border-slate-200 dark:border-slate-800 pt-4 text-base">
                    <span>Total Amount</span>
                    <span className="text-brand-orange">₹{grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-4">
                  <Link
                    href="/checkout"
                    className="w-full py-3.5 bg-brand-orange hover:bg-brand-orange/95 text-white font-bold rounded-lg text-sm transition-all flex items-center justify-center space-x-2 shadow-lg shadow-brand-orange/15"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
