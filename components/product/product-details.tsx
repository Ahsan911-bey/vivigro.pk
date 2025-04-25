"use client";

import { useState } from "react";
import type { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { addToCart } from "@/app/actions";

export function ProductDetails({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = async () => {
    if (!session?.user?.id) {
      router.push("/auth/signin?callbackUrl=/catalog");
      return;
    }

    try {
      const result = await addToCart(session.user.id, product.id, quantity);

      if (result.error) {
        throw new Error(result.error);
      }

      toast({
        title: "Added to cart",
        description: `${quantity} ${quantity === 1 ? "unit" : "units"} of ${
          product.name
        } added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-sm text-gray-500 mt-1">
          Category: {product.category}
        </p>
      </div>

      <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>

      <div className="prose dark:prose-invert">
        <p>{product.description}</p>
      </div>

      <div className="pt-6 border-t">
        <div className="flex items-center mb-6">
          <span className="mr-4">Quantity:</span>
          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>

            <span className="w-12 text-center">{quantity}</span>

            <Button variant="ghost" size="icon" onClick={increaseQuantity}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <motion.div whileTap={{ scale: 0.95 }}>
          <Button onClick={handleAddToCart} className="w-full" size="lg">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Add to Cart
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
