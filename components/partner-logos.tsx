"use client"

import { useEffect, useRef } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import Image from "next/image"

const partners = [
  { id: 1, name: "Old Plow", logo: "https://vivigro.com/wp-content/uploads/2023/08/old-plow-logo-1-1.png" },
  { id: 2, name: "Growers Supply", logo: "https://vivigro.com/wp-content/uploads/2023/08/groweres-supply-logo.png" },
  { id: 3, name: "Ropana", logo: "https://vivigro.com/wp-content/uploads/2023/08/ropana-logo.png" },
  { id: 4, name: "HC Water Tech", logo: "https://vivigro.com/wp-content/uploads/2023/08/hc-water-tech.png" },
  { id: 5, name: "ViviGro Springwater Plant", logo: "https://vivigro.com/wp-content/uploads/2023/08/VIVIGRO-LOGO.png" },
  { id: 6, name: "ViviGro Abbey Warehouse", logo: "https://vivigro.com/wp-content/uploads/2023/08/VIVIGRO-LOGO.png" },
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
          className="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow gap-3"
        >
          <Image
            src={partner.logo || "/placeholder.svg"}
            alt={partner.name}
            width={120}
            height={60}
            className="max-h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all"
          />
          <p className="text-sm font-medium text-center text-gray-700 dark:text-gray-300">{partner.name}</p>
        </motion.div>
      ))}
    </motion.div>
  )
}
