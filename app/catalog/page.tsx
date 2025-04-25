import { Suspense } from "react";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductFilters } from "@/components/product/product-filters";
import { ProductSearch } from "@/components/product/product-search";
import { Skeleton } from "@/components/ui/skeleton";
import { Category } from "@prisma/client";

export default function CatalogPage({
  searchParams,
}: {
  searchParams: { category?: Category; search?: string };
}) {
  const { category, search } = searchParams;

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

          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductGrid category={category} search={search} />
          </Suspense>
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
