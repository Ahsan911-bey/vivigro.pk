"use client";

import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"
import Image from "next/image"
import { useTheme } from "next-themes"

export default function Footer() {
  const { theme } = useTheme();

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <Image
                src={theme === 'dark' 
                  ? "https://vivigro.com/wp-content/uploads/2021/01/ViviGro-Logo-white-01.png"
                  : "https://vivigropk.vercel.app/vivigrologo2.jpg"
                }
                alt="Vivigro Logo"
                height={72}
                width={300}
                style={{ height: 72, width: 'auto', objectFit: 'contain' }}
                priority
              />
            </div>
           
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Premium textile and fertilizer products for businesses across Pakistan.
            </p>
            <div className="flex space-x-4">
              <Link href="https://facebook.com" className="text-gray-500 hover:text-emerald-600">
                <Facebook size={20} />
              </Link>
              <Link href="https://instagram.com" className="text-gray-500 hover:text-emerald-600">
                <Instagram size={20} />
              </Link>
              <Link href="https://twitter.com" className="text-gray-500 hover:text-emerald-600">
                <Twitter size={20} />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600">
                  Catalog
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Products</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/catalog?category=Textile"
                  className="text-gray-600 dark:text-gray-300 hover:text-emerald-600"
                >
                  Textile Products
                </Link>
              </li>
              <li>
                <Link
                  href="/catalog?category=Fertilizer"
                  className="text-gray-600 dark:text-gray-300 hover:text-emerald-600"
                >
                  Fertilizer Products
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-emerald-600" />
                <span className="text-gray-600 dark:text-gray-300">Vivigro, Pakistan</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-emerald-600" />
                <span className="text-gray-600 dark:text-gray-300">+92 123 456 7890</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-emerald-600" />
                <span className="text-gray-600 dark:text-gray-300">info@vivigro.pk</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-6 text-center text-gray-600 dark:text-gray-300">
          <p>&copy; {new Date().getFullYear()} Vivigro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
