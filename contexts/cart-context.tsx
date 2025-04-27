"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getCartItems } from "@/app/actions";

type CartContextType = {
  cartCount: number;
  updateCartCount: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartCount, setCartCount] = useState(0);
  const { data: session } = useSession();

  const updateCartCount = async () => {
    if (session?.user?.id) {
      const result = await getCartItems(session.user.id);
      if (result.data) {
        const count = result.data.reduce(
          (total, item) => total + item.quantity,
          0
        );
        setCartCount(count);
      }
    } else {
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateCartCount();
  }, [session]);

  return (
    <CartContext.Provider value={{ cartCount, updateCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
} 