"use client"

import { useEffect, useRef } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import Image from "next/image"

const partners = [
  { id: 1, name: "Partner 1", logo: "/placeholder.svg?height=100&width=200" },
  { id: 2, name: "Partner 2", logo: "/placeholder.svg?height=100&width=200" },
  { id: 3, name: "Partner 3", logo: "/placeholder.svg?height=100&width=200" },
  { id: 4, name: "Partner 4", logo: "/placeholder.svg?height=100&width=200" },
  { id: 5, name: "Partner 5", logo: "/placeholder.svg?height=100&width=200" },
  { id: 6, name: "Partner 6", logo: "/placeholder.svg?height=100&width=200" },
]

export function PartnerLogos() {
  const controls = useAnimation()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={controls}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8"
    >
      {partners.map((partner) => (
        <motion.div
          key={partner.id}
          variants={itemVariants}
          className="flex items-center justify-center p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <Image
            src={partner.logo || "/placeholder.svg"}
            alt={partner.name}
            width={120}
            height={60}
            className="max-h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all"
          />
        </motion.div>
      ))}
    </motion.div>
  )
}
