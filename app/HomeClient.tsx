"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { HistorySnippet } from "@/components/history-snippet";
import { Card } from "@/components/ui/card";
import { Product } from "@prisma/client";
import { TrustedPartners } from "@/components/trusted-partners";
import { WhyChooseUs } from "@/components/why-choose-us";

// Add formatPrice utility
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

interface HomeClientProps {
  fertilizers: (Product & { images: { url: string }[] })[];
  textiles: (Product & { images: { url: string }[] })[];
}

export default function HomeClient({ fertilizers, textiles }: HomeClientProps) {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[90vh] w-full flex items-center justify-center">
        {/* Background Image */}
        <Image
          src="https://vivigropk.vercel.app/cover.jpg"
          alt="Vivigro Fertilizers"
          fill
          className="object-cover"
          priority
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Text Content */}
        <div className="relative z-10 text-center text-white px-4 sm:px-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Nourish Your Crops,
            <span className="block text-emerald-400">Grow Your Future</span>
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Vivigro delivers premium fertilizers that enrich your soil and empower your harvests across Pakistan.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="relative overflow-hidden rounded-xl bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold tracking-wide shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <Link href="/catalog" className="relative z-10">
                Browse Catalog
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              className="relative overflow-hidden rounded-xl border-2 border-neutral-300 dark:border-white/70 bg-white/80 dark:bg-white/10 text-neutral-800 dark:text-white backdrop-blur-md hover:bg-white hover:dark:bg-white/20 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <Link href="/contact" className="relative z-10 font-semibold">
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* Rest of the content with container */}
      <div className="container mx-auto px-4">
        {/* Partner Logos Section */}
        <TrustedPartners />

        {/* Featured Fertilizers Section */}
        <section className="py-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Fertilizers</h2>
            
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {fertilizers.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                {product.images[0] && (
                  <div className="relative h-80 w-full bg-white">
                    <Image
                      src={product.images[0].url}
                      alt={product.name}
                      fill
                      className="object-contain"
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
    </div>
  );
} 