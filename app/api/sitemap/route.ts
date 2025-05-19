import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  try {
    // Fetch all products from the database
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    // Base URLs for the sitemap
    const baseUrls = [
      { url: 'https://vivigro.pk/', priority: '1.0' },
      { url: 'https://vivigro.pk/catalog', priority: '0.9' },
      { url: 'https://vivigro.pk/about', priority: '0.8' },
      { url: 'https://vivigro.pk/contact', priority: '0.8' },
    ];

    // Generate XML content with proper formatting
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${baseUrls.map(({ url, priority }) => `
  <url>
    <loc>${url}</loc>
    <priority>${priority}</priority>
    <changefreq>daily</changefreq>
  </url>`).join('')}
  ${products.map(product => `
  <url>
    <loc>https://vivigro.pk/product/${product.id}</loc>
    <lastmod>${product.updatedAt.toISOString()}</lastmod>
    <priority>0.7</priority>
    <changefreq>weekly</changefreq>
  </url>`).join('')}
</urlset>`;

    // Return the XML with proper headers
    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { 
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      }
    });
  }
} 