import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductDetails } from "@/components/product/product-details";
import { RelatedProducts } from "@/components/product/related-products";
import { getProductById, getProducts } from "@/app/actions";
import type { Product } from "@/types/product";
import ProductVideoCarousel from "@/components/product/product-video-carousel";
import { ProductReviews } from "@/components/product/product-details";

export default async function ProductPage({
  params,
}: {
  params: { productId: string };
}) {
  const result = await getProductById(params.productId);

  if (!result.data) {
    notFound();
  }

  const product = result.data;

  // Get related products (same category)
  const allProductsResult = await getProducts();
  const relatedProducts =
    allProductsResult.data
      ?.filter((p: Product) => p.category === product.category && p.id !== product.id)
      .slice(0, 4) || [];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <ProductGallery product={product} />
        <ProductDetails product={product} />
      </div>

      {product.videos && product.videos.length > 0 && (
        <ProductVideoCarousel videos={product.videos} />
      )}

      <ProductReviews product={product} />

      <RelatedProducts products={relatedProducts} />
    </div>
  );
}
