import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  slug: string;
  itemCode: string | null;
  price: number; // in INR
  image: string | null;
  quantity: number;
  taxRate: string | null; // e.g. "18%"
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getTaxAmount: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item, qty = 1) => {
        const items = get().items;
        const existing = items.find((i) => i.id === item.id);
        if (existing) {
          set({
            items: items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + qty } : i
            ),
          });
        } else {
          set({ items: [...items, { ...item, quantity: qty }] });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getTaxAmount: () => {
        // Calculate tax based on product tax rate (default to 18% if not specified)
        return get().items.reduce((totalTax, item) => {
          const ratePercent = item.taxRate ? parseFloat(item.taxRate.replace(/[^\d.]/g, "")) : 18;
          const itemTotal = item.price * item.quantity;
          const tax = itemTotal * (ratePercent / 100);
          return totalTax + tax;
        }, 0);
      },

      getTotal: () => {
        return get().getSubtotal() + get().getTaxAmount();
      },
    }),
    {
      name: "flametech-cart-storage",
    }
  )
);
