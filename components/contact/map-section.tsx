"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

export function MapSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" })

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-lg overflow-hidden shadow-sm"
    >
      <h2 className="text-2xl font-bold mb-6">Find Us</h2>

      <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Google Maps Embed Placeholder</p>
      </div>
    </motion.section>
  )
}
