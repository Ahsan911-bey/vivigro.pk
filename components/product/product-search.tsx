"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "../ui/input";
import { useCallback, useTransition } from "react";
import { Search } from "lucide-react";

export function ProductSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleSearch = useCallback(
    (term: string) => {
      const params = new URLSearchParams(searchParams);
      if (term) {
        params.set("search", term);
      } else {
        params.delete("search");
      }

      startTransition(() => {
        router.push(`/catalog?${params.toString()}`);
      });
    },
    [router, searchParams]
  );

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
      <Input
        type="search"
        placeholder="Search products..."
        className="pl-9"
        defaultValue={searchParams.get("search") ?? ""}
        onChange={(e) => handleSearch(e.target.value)}
      />
      {isPending && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
        </div>
      )}
    </div>
  );
}
