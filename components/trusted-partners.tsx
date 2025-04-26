"use client"

import { PartnerLogos } from "@/components/partner-logos"

export function TrustedPartners() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800 rounded-xl my-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          Trusted by Industry Leaders
        </h2>
        <PartnerLogos />
      </div>
    </section>
  )
} 