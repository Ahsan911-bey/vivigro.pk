"use client";

import Link from "next/link"
import { Facebook, Twitter, Mail, Phone, MapPin, MessageCircle } from "lucide-react"
import Image from "next/image"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"

export default function Footer() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              {mounted && (
                <Image
                  src={resolvedTheme === 'dark' 
                    ? "https://vivigro.com/wp-content/uploads/2021/01/ViviGro-Logo-white-01.png"
                    : "https://vivigro.pk/logofinalwebp.webp"
                  }
                  alt="Vivigro Logo"
                  height={72}
                  width={300}
                  style={{ height: 72, width: 'auto', objectFit: 'contain' }}
                  priority
                />
              )}
            </div>
           
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Premium textile and fertilizer products for businesses across Pakistan.
            </p>
            <div className="flex space-x-4">
              <Link href="https://facebook.com" className="text-gray-500 hover:text-emerald-600">
                <Facebook size={20} />
              </Link>
              <Link href="https://wa.me/923108690858" className="text-gray-500 hover:text-emerald-600">
                <MessageCircle size={20} />
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
            <div>
  <h3 className="text-lg font-bold mb-4 mt-4">Legal & Policies</h3>
  <ul className="space-y-2">
    <li>
      <Link href="/Return-etc" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600">Privacy Policy</Link>
    </li>
    <li>
      <Link href="/Return-etc" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600">Return & Refund Policy</Link>
    </li>
    <li>
      <Link href="/Return-etc" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600">Shipping Policy</Link>
    </li>
    <li>
      <Link href="/Return-etc" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600">Terms & Conditions</Link>
    </li>
  </ul>
</div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-emerald-600" />
                <span className="text-gray-600 dark:text-gray-300 text-sm">ViviGro Sustainable Solutions (Pvt)  Limited<br /> Warehouses 1 km off  Sahiwal Bypass <br />Pakpattan Road, Sahiwal</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-emerald-600" />
                <span className="text-gray-600 dark:text-gray-300">03108690858</span>
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
