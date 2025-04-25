"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import type { ProductImage } from "@/types/product";

export function ProductGallery({ images }: { images: ProductImage[] }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const goToNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const goToPreviousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!images.length) {
    return (
      <div className="aspect-square w-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <div className="relative aspect-square w-full bg-gray-100 dark:bg-gray-800 rounded-lg">
      <Image
        src={images[currentImageIndex].url}
        alt={`Product image ${currentImageIndex + 1}`}
        fill
        className="object-cover rounded-lg"
      />

      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-950/80 hover:bg-white/90 dark:hover:bg-gray-950/90"
            onClick={goToPreviousImage}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-950/80 hover:bg-white/90 dark:hover:bg-gray-950/90"
            onClick={goToNextImage}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex
                    ? "bg-emerald-600"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
