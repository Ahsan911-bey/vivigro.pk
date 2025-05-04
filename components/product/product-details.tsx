"use client";

import { useState } from "react";
import type { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { addToCart } from "@/app/actions";
import { MessageCircle } from "lucide-react";
import { useCart } from "@/contexts/cart-context";

export function ProductDetails({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { data: session } = useSession();
  const router = useRouter();
  const { updateCartCount } = useCart();

  const isFertilizer = product.category.toUpperCase() === "FERTILIZER";
  const isTextile = product.category.toUpperCase() === "TEXTILE";

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (quantity < product.quantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = async () => {
    if (!session?.user) {
      router.push("/login");
      return;
    }

    setIsLoading(true);
    try {
      const result = await addToCart(session.user.id, product.id, quantity);
      if (result.error) {
        throw new Error(result.error);
      }
      await updateCartCount();
      toast({
        title: "Added to cart",
        description: `${quantity} ${quantity === 1 ? "unit" : "units"} of ${product.name} added to your cart`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <div className="mt-2">
          <Badge>{product.category}</Badge>
        </div>
      </div>

      {/* Textile shows stock */}
      {isTextile && (
        <p className="text-md font-semibold text-green-600">
          Available Stock: {product.quantity}
        </p>
      )}

      {/* Fertilizer does NOT show price */}
      {!isFertilizer && (
        <p className="text-2xl font-bold">PKR {product.price.toFixed(2)}</p>
      )}

      <div className="prose dark:prose-invert">
        <p>{product.description}</p>
      </div>

      {/* Actions */}
      <div className="pt-6 border-t">
        {isFertilizer ? (
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              asChild
              className="w-full bg-green-600 hover:bg-green-700 text-white gap-2"
              size="lg"
            >
              <a
                href={`https://wa.me/923176174401?text=I'm%20interested%20in%20${encodeURIComponent(product.name)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M380.9 97.1C339 ... (shortened) ..." />
                </svg>
                <MessageCircle className="w-5 h-5" />
                Contact on WhatsApp
              </a>
            </Button>
          </motion.div>
        ) : (
          <>
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

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={increaseQuantity}
                  disabled={quantity >= product.quantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleAddToCart}
                disabled={isLoading || product.quantity === 0}
                className="w-full"
                size="lg"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {isLoading
                  ? "Adding..."
                  : product.quantity === 0
                  ? "Out of Stock"
                  : "Add to Cart"}
              </Button>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
