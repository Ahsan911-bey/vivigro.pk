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
  title: "Vivigro Pakistan | Buy Fertilizer Online | Premium Fertilizers for Farmers",
  description: "Vivigro Pakistan - Buy premium fertilizers online. Serving farmers across Pakistan with VIVI MAX AMMONIUM SULPHATE, VIVI PREMIUM IRON-EDHHA 6%, and more. Your trusted source for crop nutrition.",
  openGraph: {
    title: "Vivigro Pakistan | Buy Fertilizer Online",
    description: "Vivigro Pakistan - Buy premium fertilizers online. Serving farmers across Pakistan with VIVI MAX AMMONIUM SULPHATE, VIVI PREMIUM IRON-EDHHA 6%, and more.",
    url: "https://vivigro.pk/",
    siteName: "Vivigro Pakistan",
    locale: "en_PK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vivigro Pakistan | Buy Fertilizer Online",
    description: "Vivigro Pakistan - Buy premium fertilizers online. Serving farmers across Pakistan with VIVI MAX AMMONIUM SULPHATE, VIVI PREMIUM IRON-EDHHA 6%, and more.",
    site: "@vivigropk",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
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
