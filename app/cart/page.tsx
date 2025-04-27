"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import {
  getCartItems,
  removeFromCart,
  updateCartItemQuantity,
} from "@/app/actions";
import { useCart } from "@/contexts/cart-context";

type CartItem = {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    images: { url: string }[];
  };
};

export default function CartPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { updateCartCount } = useCart();

  useEffect(() => {
    if (!session?.user?.id) {
      router.push("/auth/signin?callbackUrl=/cart");
      return;
    }

    async function loadCartItems() {
      const result = await getCartItems(session?.user?.id || "");
      if (result.error) {
        toast({
          title: "Error",
          description: "Failed to load cart items",
          variant: "destructive",
        });
        return;
      }
      setItems(result.data || []);
      setIsLoading(false);
    }

    loadCartItems();
  }, [session, router, toast]);

  const handleUpdateQuantity = async (id: string, quantity: number) => {
    try {
      const result = await updateCartItemQuantity(id, quantity);
      if (result.error) {
        throw new Error(result.error);
      }
      setItems(
        items.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
      await updateCartCount();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      });
    }
  };

  const handleRemoveItem = async (id: string) => {
    try {
      const result = await removeFromCart(id);
      if (result.error) {
        throw new Error(result.error);
      }
      setItems(items.filter((item) => item.id !== id));
      await updateCartCount();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      });
    }
  };

  const getTotalPrice = () => {
    return items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Loading cart...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto mb-6 text-gray-300" />
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Looks like you haven't added any products to your cart yet.
        </p>
        <Button asChild size="lg">
          <Link href="/catalog">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 border-b">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-6">
                  <h3 className="font-medium">Product</h3>
                </div>
                <div className="col-span-2 text-center">
                  <h3 className="font-medium">Price</h3>
                </div>
                <div className="col-span-2 text-center">
                  <h3 className="font-medium">Quantity</h3>
                </div>
                <div className="col-span-2 text-right">
                  <h3 className="font-medium">Total</h3>
                </div>
              </div>
            </div>

            <div className="divide-y">
              {items.map((item) => (
                <div key={item.id} className="p-4">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-6">
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 rounded overflow-hidden flex-shrink-0">
                          <Image
                            src={
                              item.product.images[0]?.url || "/placeholder.svg"
                            }
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium">{item.product.name}</h4>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-2 text-center">
                      <p>${item.product.price.toFixed(2)}</p>
                    </div>

                    <div className="col-span-2">
                      <div className="flex items-center justify-center border rounded-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleUpdateQuantity(
                              item.id,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>

                        <span className="w-8 text-center">{item.quantity}</span>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="col-span-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <p className="font-medium">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="border rounded-lg p-6 sticky top-20">
            <h3 className="text-xl font-bold mb-4">Order Summary</h3>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>

            <motion.div whileTap={{ scale: 0.95 }}>
              <Button asChild className="w-full" size="lg">
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
            </motion.div>

            <div className="mt-4">
              <Button asChild variant="outline" className="w-full">
                <Link href="/catalog">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
