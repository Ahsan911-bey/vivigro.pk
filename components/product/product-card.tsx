"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { ShoppingCart } from "lucide-react";
import { useToast } from "../ui/use-toast";
import type { Product } from "@/types/product";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { addToCart } from "@/app/actions";
import { useCart } from "@/contexts/cart-context";

export function ProductCard({ product }: { product: Product }) {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const { updateCartCount } = useCart();

  const handleAddToCart = async () => {
    if (!session?.user?.id) {
      router.push("/auth/signin?callbackUrl=/catalog");
      return;
    }

    try {
      const result = await addToCart(session.user.id, product.id, 1);

      if (result.error) {
        throw new Error(result.error);
      }

      await updateCartCount();
      
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
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
    <div className="group relative bg-white dark:bg-gray-950 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <Link
        href={`/catalog/${product.id}`}
        className="block aspect-square relative"
      >
        <Image
          src={product.images[0]?.url || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover rounded-t-lg"
        />
      </Link>

      <div className="p-4">
        <Link href={`/catalog/${product.id}`} className="block">
          <h3 className="font-medium text-lg mb-2 group-hover:text-emerald-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4">
            {product.description}
          </p>
        </Link>

        <div className="flex items-center justify-between">
          {product.category !== "FERTILIZER" ? (
            <>
              <p className="font-medium text-lg">${product.price.toFixed(2)}</p>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleAddToCart}
                className="hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950"
              >
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
