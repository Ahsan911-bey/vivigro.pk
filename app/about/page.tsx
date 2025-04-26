import Image from "next/image"
import { MissionVision } from "@/components/about/mission-vision"
import { TrustedPartners } from "@/components/trusted-partners"
import { Journey } from "@/components/about/journey"

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
          ViviGro Sustainable Solutions Ltd., based in Saskatoon, Saskatchewan, Canada, is a leader in soil
          health and restoration, specializing in eco-friendly, biodegradable fertilizer blends. The company
          focuses on sustainable and regenerative farming practices, offering customized solutions to
          improve soil fertility, reduce reliance on synthetic inputs, and enhance crop yields.
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
          ViviGro serves a diverse range of agricultural clients, from large-scale farmers growing cereals, oilseeds, and
          legumes to smaller markets like vegetable farms, greenhouses, and hobby farms. Their products, which include granular,
           liquid, and organic-approved fertilizers, are 100% filler-free, customizable,and designed to minimize environmental impact 
           while promoting biodiversity and food quality.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
          Founded by Yasir Syed, ViviGro has grown to serve over 750,000 acres of farmland with a
          commitment to environmental stewardship and innovative soil health solutions.          </p>
        </div>

        <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
          <Image src="https://vivigro.com/wp-content/uploads/2023/09/IMG_0149-scaled.jpg" alt="Vivigro History" fill className="object-cover" />
        </div>
      </div>

      <Journey />

      <MissionVision />

      <TrustedPartners />
    </div>
  )
}
