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
import { getCartItems, removeFromCart, updateCartItemQuantity } from "@/app/actions";
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
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { updateCartCount } = useCart();

  useEffect(() => {
    // Wait for session to be loaded
    if (status === "loading") {
      return;
    }

    // Only redirect if we're sure there's no session
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    async function loadCartItems() {
      if (!session?.user?.id) return;
      
      const result = await getCartItems(session.user.id);
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
  }, [session, status, router, toast]);

  const handleUpdateQuantity = async (id: string, quantity: number) => {
    try {
      const result = await updateCartItemQuantity(id, quantity);
      if (result.error) {
        throw new Error(result.error);
      }
      setItems(items.map((item) => (item.id === id ? { ...item, quantity } : item)));
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
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
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
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row items-center md:items-start bg-card border rounded-lg p-6 gap-6 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Image */}
                <div className="relative h-40 w-40 md:h-48 md:w-48 rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={item.product.images[0]?.url || "/placeholder.svg"}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 160px, 192px"
                    priority
                  />
                </div>

                {/* Details */}
                <div className="flex flex-col flex-1 items-center md:items-start">
                  <h4 className="font-semibold text-lg md:text-xl">{item.product.name}</h4>
                  <p className="text-primary font-medium text-lg mt-1">
                    PKR {item.product.price.toFixed(2)}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 mt-4">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 rounded-md"
                      onClick={() =>
                        handleUpdateQuantity(item.id, Math.max(1, item.quantity - 1))
                      }
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-lg font-medium w-8 text-center">{item.quantity}</span>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 rounded-md"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Item Total - Mobile */}
                  <div className="mt-4 md:hidden">
                    <p className="text-lg font-semibold">
                      Total: PKR {(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Right Section - Desktop */}
                <div className="hidden md:flex flex-col items-end gap-4">
                  <p className="text-xl font-semibold">
                    PKR {(item.product.price * item.quantity).toFixed(2)}
                  </p>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </Button>
                </div>

                {/* Remove Button - Mobile */}
                <div className="md:hidden w-full">
                  <Button
                    variant="destructive"
                    className="w-full mt-2 flex items-center justify-center gap-2"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div>
          <div className="border rounded-lg p-6 sticky top-20">
            <h3 className="text-xl font-bold mb-4">Order Summary</h3>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>PKR {getTotalPrice().toFixed(2)}</span>
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
                <span>PKR {getTotalPrice().toFixed(2)}</span>
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
