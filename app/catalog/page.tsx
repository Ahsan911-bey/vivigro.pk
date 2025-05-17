import { Suspense } from "react";
import { ProductFilters } from "@/components/product/product-filters";
import { ProductSearch } from "@/components/product/product-search";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@/types/product";
import { getProducts } from "@/app/actions";
import { ProductCard } from "@/components/product/product-card";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string };
}) {
  const { category, search } = searchParams;
  const result = await getProducts();
  const products: Product[] = result.data?.sort((a, b) => {
    // Sort by creation date to match home page order
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  }) || [];

  // Optionally filter by search
  let filteredProducts = products;
  if (search) {
    const searchLower = search.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (product: Product) =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
    );
  }

  // Optionally filter by category
  const showFertilizer = !category || category === "FERTILIZER";
  const showTextile = !category || category === "TEXTILE";

  const fertilizerProducts = filteredProducts.filter(
    (product: Product) => product.category === "FERTILIZER"
  );
  const textileProducts = filteredProducts.filter(
    (product: Product) => product.category === "TEXTILE"
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Product Catalog</h1>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 shrink-0">
          <ProductFilters />
        </div>

        <div className="flex-1">
          <div className="mb-6">
            <ProductSearch />
          </div>

          <div className="space-y-12">
            {showFertilizer && (
              <div>
                {fertilizerProducts.length === 0 ? (
                  <div className="text-center text-gray-500 text-lg py-12">No fertilizer products found.</div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold mb-4 text-green-400">Fertilizers</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {fertilizerProducts.map((product: Product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
            {showTextile && (
              <div>
                {textileProducts.length === 0 ? (
                  <div className="text-center text-gray-500 text-lg py-12">No textile products found.</div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold mb-4 text-blue-300">Textile</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {textileProducts.map((product: Product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="border rounded-lg p-4">
          <Skeleton className="h-48 w-full mb-4" />
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-6 w-1/4 mt-4" />
        </div>
      ))}
    </div>
  );
}
