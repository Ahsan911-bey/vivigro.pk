import { Product, ProductImage, Review } from '@prisma/client';

type ProductWithRelations = Product & {
  images?: ProductImage[];
  reviews?: Review[];
};

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Vivigro',
  url: 'https://vivigro.pk',
  logo: 'https://vivigro.pk/logofinalwebp.webp',
  sameAs: [
    'https://web.facebook.com/p/ViviGro-Sustainable-Solutions-Pvt-Limited-Pakistan-100067398016650/?_rdc=1&_rdr#'
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+92-310-690858',
    contactType: 'customer service',
    email: 'contact@vivigro.pk',
    areaServed: 'PK'
  }
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Vivigro',
  url: 'https://vivigro.pk',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://vivigro.pk/search?q={search_term_string}',
    'query-input': 'required name=search_term_string'
  }
};

export const breadcrumbSchema = (items: { name: string; item: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.item
  }))
});

export const productSchema = (product: ProductWithRelations) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  description: product.description,
  sku: product.id,
  image: product.images?.[0]?.url,
  offers: {
    '@type': 'Offer',
    price: product.price,
    priceCurrency: 'PKR',
    availability: product.quantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    url: `https://vivigro.pk/product/${product.id}`
  },
  brand: {
    '@type': 'Brand',
    name: 'Vivigro'
  },
  category: product.category,
  aggregateRating: product.reviews && product.reviews.length > 0 ? {
    '@type': 'AggregateRating',
    ratingValue: product.reviews.reduce((acc: number, review: Review) => acc + review.starRating, 0) / product.reviews.length,
    reviewCount: product.reviews.length
  } : undefined
});

export const catalogSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Vivigro Product Catalog',
  description: 'Browse our collection of organic fertilizers and sustainable textiles',
  url: 'https://vivigro.pk/catalog'
};

export const aboutSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About Vivigro',
  description: 'Learn about Vivigro\'s mission to provide sustainable and organic products',
  url: 'https://vivigro.pk/about'
};

export const contactSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact Vivigro',
  description: 'Get in touch with Vivigro for any inquiries or support',
  url: 'https://vivigro.pk/contact'
};

export const faqSchema = (faqs: { question: string; answer: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer
    }
  }))
}); 