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
  description: "Vivigro Pakistan - Buy premium fertilizers, Serving farmers across Pakistan.",
  openGraph: {
    title: "ViviGro Sustainable Solutions Pakistan",
    description: "Vivigro Pakistan - Buy premium fertilizers, Serving farmers across Pakistan.",
    url: "https://vivigro.pk/",
    siteName: "Vivigro Pakistan",
    locale: "en_PK",
    type: "website",
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
          {/* Favicon */}
        <link rel="icon" href="/favicon.png" type="image/png" sizes="64x64" />
      </head>
      <body className={inter.className}>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
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
