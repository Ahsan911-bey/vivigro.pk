import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "./providers";
import { AuthProvider } from "@/components/auth-provider";
import { CartProvider } from "@/contexts/cart-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ViviGro Sustainable Solutions Pakistan",
  description: "ViviGro is a leader in soil health and restoration. We manufacture eco-friendly, biodegradable fertilizer blends made for reducing emissions.",
  metadataBase: new URL('https://vivigro.pk'),
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: "ViviGro Sustainable Solutions Pakistan",
    description: "ViviGro is a leader in soil health and restoration. We manufacture eco-friendly, biodegradable fertilizer blends made for reducing emissions.",
    url: "https://vivigro.pk/",
    siteName: "Vivigro Pakistan",
    locale: "en_PK",
    type: "website",
    images: [
      {
        url: "https://vivigro.pk/logofinalwebp.webp",
        width: 800,
        height: 600,
        alt: "ViviGro Sustainable Solutions Pakistan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ViviGro Sustainable Solutions Pakistan",
    description: "ViviGro is a leader in soil health and restoration. We manufacture eco-friendly, biodegradable fertilizer blends made for reducing emissions.",
    images: ["https://vivigro.pk/logofinalwebp.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Analytics GA4 */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-KS8QHHREVN"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-KS8QHHREVN');
          `,
        }} />
      </head>
      <body className={inter.className}>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              <CartProvider>
                <div className="flex min-h-screen flex-col">
                  <Header />
                  <main className="flex-1">{children}</main>
                  <Footer />
                  <Toaster />
                </div>
              </CartProvider>
            </AuthProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
