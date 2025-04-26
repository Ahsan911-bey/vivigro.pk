"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { PartnerLogos } from "@/components/partner-logos";
import { HistorySnippet } from "@/components/history-snippet";
import { Card } from "@/components/ui/card";
import { Product } from "@prisma/client";

// Add formatPrice utility
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

interface HomeClientProps {
  fertilizers: (Product & { images: { url: string }[] })[];
  textiles: (Product & { images: { url: string }[] })[];
}

export default function HomeClient({ fertilizers, textiles }: HomeClientProps) {
  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Premium Solutions for
              <span className="text-emerald-600 block">
                Textile & Agriculture
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Vivigro provides high-quality textile and fertilizer products to
              businesses across Pakistan. With years of expertise and trusted
              partnerships, we deliver excellence in every product.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href="/catalog">Browse Catalog</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
            <Image
              src="/placeholder.svg?height=800&width=600"
              alt="Vivigro Products"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Partner Logos Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800 rounded-xl my-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Trusted by Industry Leaders
          </h2>
          <PartnerLogos />
        </div>
      </section>

      {/* Featured Fertilizers Section */}
      <section className="py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Fertilizers</h2>
          
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {fertilizers.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              {product.images[0] && (
                <div className="relative h-48">
                  <Image
                    src={product.images[0].url}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                  {product.description}
                </p>
                <div className="flex justify-between items-center">
                  {/* <span className="font-bold">{formatPrice(product.price)}</span> */}
                  <div className="flex justify-center w-4/5 mx-auto">
                    <Button asChild size="sm" className="w-full">
                      <Link href={`/catalog/${product.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <div className="flex justify-center">
        <Button asChild variant="outline" className="mt-10">
            <Link href="/catalog?category=FERTILIZER">Show All</Link>
          </Button>
        </div>
      
      </section>

      {/* Featured Textiles Section */}
      <section className="py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Textiles</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {textiles.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              {product.images[0] && (
                <div className="relative h-48">
                  <Image
                    src={product.images[0].url}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                  {product.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="font-bold">{formatPrice(product.price)}</span>
                  <Button asChild size="sm">
                    <Link href={`/catalog/${product.id}`}>View Details</Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <div className="flex justify-center">
          <Button asChild variant="outline" className="mt-10">
            <Link href="/catalog?category=TEXTILE">Show All</Link>
          </Button>
        </div>
      </section>

      {/* History Snippet */}
      <section className="py-16">
        <HistorySnippet />
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl my-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Elevate Your Business?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover our premium range of textile and fertilizer products
            designed to meet your specific needs.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button asChild size="lg">
              <Link href="/catalog?category=TEXTILE">Textile Products</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/catalog?category=FERTILIZER">
                Fertilizer Products
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
} 