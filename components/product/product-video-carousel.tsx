"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProductVideo } from "@/types/product";

export default function ProductVideoCarousel({ videos }: { videos: ProductVideo[] }) {
  const [current, setCurrent] = useState(0);
  const goToNext = () => setCurrent((prev) => (prev + 1) % videos.length);
  const goToPrev = () => setCurrent((prev) => (prev - 1 + videos.length) % videos.length);
  const currentVideo = videos[current];
  const isFacebook = currentVideo.url.includes("facebook.com");
  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold mb-6">Product Video</h2>
      <div className="relative w-full flex justify-center items-center aspect-video rounded-lg overflow-hidden bg-black">
        {isFacebook ? (
          <iframe
            src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(currentVideo.url)}&show_text=false&width=400`}
            title="Facebook Product Video"
            width="400"
            height="700"
            style={{ border: "none", overflow: "hidden" }}
            scrolling="no"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <iframe
            src={currentVideo.url.replace("watch?v=", "embed/")}
            title="Product Video"
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
        {videos.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-950/80 hover:bg-white/90 dark:hover:bg-gray-950/90"
              onClick={goToPrev}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-950/80 hover:bg-white/90 dark:hover:bg-gray-950/90"
              onClick={goToNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {videos.map((_, idx) => (
                <button
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    idx === current ? "bg-emerald-600" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                  onClick={() => setCurrent(idx)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
} 