"use client";

import { create } from "zustand";
import { toast } from "sonner";

interface CartStore {
  items: {
    productId: string;
    quantity: number;
  }[];
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

export const useCart = create<CartStore>((set) => ({
  items: [],
  addItem: (productId: string) => {
    set((state) => {
      const existingItem = state.items.find((item) => item.productId === productId);
      
      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }

      return {
        items: [...state.items, { productId, quantity: 1 }],
      };
    });

    toast.success("Added to cart successfully", {
      duration: 3000,
    });
  },
  removeItem: (productId: string) => {
    set((state) => ({
      items: state.items.filter((item) => item.productId !== productId),
    }));
  },
  clearCart: () => {
    set({ items: [] });
  },
})); 