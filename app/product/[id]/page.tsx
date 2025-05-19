import JsonLd from '@/components/JsonLd';
import { productSchema, breadcrumbSchema } from '@/lib/schema';
import { prisma } from '@/lib/prisma';

async function getProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: true,
      reviews: true,
    },
  });
  return product;
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  if (!product) {
    return <div>Product not found</div>;
  }

  const breadcrumbs = [
    { name: 'Home', item: 'https://vivigro.pk' },
    { name: 'Catalog', item: 'https://vivigro.pk/catalog' },
    { name: product.name, item: `https://vivigro.pk/product/${product.id}` },
  ];

  return (
    <>
      <JsonLd data={productSchema(product)} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      {/* Rest of your product page content */}
    </>
  );
} 