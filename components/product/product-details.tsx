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
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge>{product.category}</Badge>
          {/* {product.type && <Badge variant="secondary">{product.type}</Badge>}
          {product.packagingType && <Badge variant="secondary">{product.packagingType}</Badge>} */}
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

        {/* <p className="text-2xl font-bold">PKR {product.price.toFixed(2)}</p> */}
     

      {/* {product.sizeOptions && product.sizeOptions.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold">Available Sizes:</h3>
          <div className="flex flex-wrap gap-2">
            {product.sizeOptions.map((size, index) => (
              <Badge key={index} variant="outline">{size}</Badge>
            ))}
          </div>
        </div>
      )} */}

      <div className="prose dark:prose-invert">
        <p>{product.description}</p>
      </div>

{/* Product Attributes Section */}
<div className="py-6 border-t space-y-3">
  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Product Details</h3>
  <ul className="list-disc list-inside space-y-2 pl-5 text-gray-800 dark:text-gray-300">
    {product.sizeOptions?.length > 0 && (
      <li className="flex items-start gap-2">
        <span className="font-semibold">Sizes:</span>
        <span className="flex-1">{product.sizeOptions.join(", ")}</span>
      </li>
    )}
    {product.packagingType && (
      <li className="flex items-start gap-2">
        <span className="font-semibold">Packaging:</span>
        <span className="flex-1">{product.packagingType}</span>
      </li>
    )}
    {product.type && (
      <li className="flex items-start gap-2">
        <span className="font-semibold">Type:</span>
        <span className="flex-1">{product.type}</span>
      </li>
    )}
  </ul>
</div>



     

      {/* Customer Reviews Section - improved UI and after videos */}
      {product.reviews && product.reviews.length > 0 && (
        <div className="space-y-6">
          {/* <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span>Customer Reviews</span>
            <span className="text-base font-normal text-gray-400">({product.reviews.length})</span>
          </h3> */}
          <div className="space-y-6">
            {/* {product.reviews.map((review, idx) => (
              <div key={review.id} className="bg-white dark:bg-gray-900 rounded-xl shadow p-5 flex flex-col gap-2 border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-700 dark:text-emerald-200 font-bold text-lg">
                    {review.reviewerName?.[0]?.toUpperCase() || "?"}
                  </div>
                  <span className="font-semibold text-lg">{review.reviewerName}</span>
                  <div className="flex items-center ml-auto">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-xl ${i < review.starRating ? "text-yellow-400" : "text-gray-300"}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-base text-gray-700 dark:text-gray-300 italic">"{review.reviewText}"</p>
                {idx < product.reviews.length - 1 && <div className="border-t border-gray-200 dark:border-gray-800 mt-4" />}
              </div>
            ))} */}
          </div>
        </div>
      )}

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
             href={`https://wa.me/923108690858?text=${encodeURIComponent(
               `Hi, I saw your product "${product.name}" on your website and I am interested in it. Could you please provide me with more details?`
             )}`}
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
            {/* <div className="flex items-center mb-6">
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
            </div> */}

            {/* <motion.div whileTap={{ scale: 0.95 }}>
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
            </motion.div> */}
            {/* Contact on WhatsApp Button */ }
            <motion.div whileTap={{ scale: 0.95 }}>
                <Button
                  asChild
                  className="w-full bg-green-600 hover:bg-green-700 text-white gap-2"
                  size="lg"
                >
                  <a
                    href={`https://wa.me/923108690858?text=${encodeURIComponent(
                      `Hi, I saw your product "${product.name}" on your website and I am interested in it. Could you please provide me with more details?`
                    )}`}
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
          </>
        )}
      </div>
    </div>
  );
}

export function ProductReviews({ product }: { product: Product }) {
  if (!product.reviews || product.reviews.length === 0) return null;
  return (
    <div className="space-y-6 pt-8 mb-12">
      <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <span>Customer Reviews</span>
        <span className="text-base font-normal text-gray-400">({product.reviews.length})</span>
      </h3>
      <div className="space-y-6">
        {product.reviews.map((review, idx) => (
          <div key={review.id} className="bg-white dark:bg-gray-900 rounded-xl shadow p-5 flex flex-col gap-2 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-700 dark:text-emerald-200 font-bold text-lg">
                {review.reviewerName?.[0]?.toUpperCase() || "?"}
              </div>
              <span className="font-semibold text-lg">{review.reviewerName}</span>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-xl ${i < review.starRating ? "text-yellow-400" : "text-gray-300"}`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <p className="text-base text-gray-700 dark:text-gray-300 italic">"{review.reviewText}"</p>
            {idx < product.reviews.length - 1 && <div className="border-t border-gray-200 dark:border-gray-800 mt-4" />}
          </div>
        ))}
      </div>
    </div>
  );
}
