"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "./product-card";
import type { Product } from "@/types/product";
import { getProducts } from "@/app/actions";
import { Category } from "@prisma/client";

export function ProductGrid({
  category,
  search,
}: {
  category?: Category;
  search?: string;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const result = await getProducts();

        if (result.error || !result.data) {
          throw new Error(result.error || "Failed to fetch products");
        }

        let filteredProducts = result.data;

        // Apply category filter
        if (category) {
          filteredProducts = filteredProducts.filter(
            (product) => product.category === category
          );
        }

        // Apply search filter
        if (search) {
          const searchLower = search.toLowerCase();
          filteredProducts = filteredProducts.filter(
            (product) =>
              product.name.toLowerCase().includes(searchLower) ||
              product.description.toLowerCase().includes(searchLower)
          );
        }

        setProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, search]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">No products found</h3>
        <p className="text-gray-500">
          Try adjusting your filters or search terms
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
