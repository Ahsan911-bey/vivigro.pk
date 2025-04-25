"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"

const partners = [
  { id: 1, name: "Partner 1", logo: "/placeholder.svg?height=100&width=200" },
  { id: 2, name: "Partner 2", logo: "/placeholder.svg?height=100&width=200" },
  { id: 3, name: "Partner 3", logo: "/placeholder.svg?height=100&width=200" },
  { id: 4, name: "Partner 4", logo: "/placeholder.svg?height=100&width=200" },
  { id: 5, name: "Partner 5", logo: "/placeholder.svg?height=100&width=200" },
  { id: 6, name: "Partner 6", logo: "/placeholder.svg?height=100&width=200" },
  { id: 7, name: "Partner 7", logo: "/placeholder.svg?height=100&width=200" },
  { id: 8, name: "Partner 8", logo: "/placeholder.svg?height=100&width=200" },
]

export function Partners() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" })

  return (
    <section className="py-16" ref={ref}>
      <h2 className="text-3xl font-bold mb-12 text-center">Our Partners</h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-8"
      >
        {partners.map((partner, index) => (
          <motion.div
            key={partner.id}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <Image
              src={partner.logo || "/placeholder.svg"}
              alt={partner.name}
              width={150}
              height={75}
              className="max-h-16 w-auto object-contain grayscale hover:grayscale-0 transition-all"
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
