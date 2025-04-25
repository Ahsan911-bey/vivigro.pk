import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductDetails } from "@/components/product/product-details";
import { RelatedProducts } from "@/components/product/related-products";
import { getProductById, getProducts } from "@/app/actions";

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
      ?.filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4) || [];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <ProductGallery images={product.images} />
        <ProductDetails product={product} />
      </div>

      {product.videoUrl && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Product Video</h2>
          <div className="aspect-video rounded-lg overflow-hidden">
            <iframe
              src={product.videoUrl.replace("watch?v=", "embed/")}
              title="Product Video"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      <RelatedProducts products={relatedProducts} />
    </div>
  );
}
