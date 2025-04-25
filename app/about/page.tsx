import Image from "next/image"
import { Timeline } from "@/components/about/timeline"
import { Partners } from "@/components/about/partners"
import { MissionVision } from "@/components/about/mission-vision"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto mb-16">
        <h1 className="text-4xl font-bold mb-6 text-center">About Vivigro</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 text-center">
          Delivering premium textile and fertilizer products across Pakistan since 2005.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Founded in 2005, Vivigro began as a small supplier of agricultural products in Karachi. With a vision to
            provide high-quality products to Pakistani businesses, we quickly expanded our offerings to include textile
            solutions.
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Over the years, we've grown from a local supplier to a nationwide distributor, serving businesses of all
            sizes across Pakistan. Our commitment to quality, innovation, and customer satisfaction has been the
            cornerstone of our success.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Today, Vivigro is recognized as a leading provider of premium textile and fertilizer products, trusted by
            farmers, manufacturers, and businesses throughout the country.
          </p>
        </div>

        <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
          <Image src="/placeholder.svg?height=800&width=600" alt="Vivigro History" fill className="object-cover" />
        </div>
      </div>

      <Timeline />

      <MissionVision />

      <Partners />
    </div>
  )
}
