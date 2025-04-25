"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { Category } from "@prisma/client";

export function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  const categories = [
    { value: "", label: "All Products" },
    { value: Category.TEXTILE, label: "Textile" },
    { value: Category.FERTILIZER, label: "Fertilizer" },
  ];

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    router.push(`/catalog?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Categories</h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.value}
            variant={currentCategory === category.value ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryChange(category.value)}
            className="flex-1 sm:flex-none"
          >
            {category.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
