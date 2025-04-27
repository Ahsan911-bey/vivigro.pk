import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import ChatbotButton from "@/components/chatbot/chatbot-button";
import { Providers } from "./providers";
import { AuthProvider } from "@/components/auth-provider";
import { CartProvider } from "@/contexts/cart-context";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vivigro",
  description: "Vivigro - Your Growth Partner",
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
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              <CartProvider>
                <div className="flex min-h-screen flex-col">
                  <Header />
                  <main className="flex-1">{children}</main>
                  <Footer />
                  <ChatbotButton />
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
