"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@prisma/client";
import { useCart } from "@/hooks/use-cart";

// Add formatPrice utility
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

interface ProductCardProps {
  product: Product & { images: { url: string }[] };
  showAddToCart?: boolean;
}

export function ProductCard({ product, showAddToCart = true }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <Card className="overflow-hidden">
      {product.images[0] && (
        <div className="relative h-48">
          <Image
            src={product.images[0].url}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-2">
          {product.description}
        </p>
        <div className="flex justify-between items-center">
          <span className="font-bold">{formatPrice(product.price)}</span>
          <div className="flex gap-2">
            <Button asChild size="sm">
              <Link href={`/catalog/${product.id}`}>View Details</Link>
            </Button>
            {showAddToCart && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => addItem(product.id)}
              >
                Add to Cart
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
} 