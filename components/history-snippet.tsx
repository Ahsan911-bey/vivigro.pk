"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import { Button } from "./ui/button"
import Link from "next/link"

export function HistorySnippet() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" })

  return (
    <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h2 className="text-3xl font-bold mb-6">Our Journey</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Founded in 2005, Vivigro has grown from a small local supplier to one of Pakistan's leading providers of
          textile and agricultural solutions.
        </p>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          With a commitment to quality and innovation, we've built strong relationships with farmers, manufacturers, and
          businesses across the country, helping them achieve sustainable growth and success.
        </p>
        <Button asChild variant="outline">
          <Link href="/about">Learn More About Us</Link>
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
        className="relative h-[400px] rounded-lg overflow-hidden shadow-xl"
      >
        <Image src="/placeholder.svg?height=800&width=600" alt="Vivigro History" fill className="object-cover" />
      </motion.div>
    </div>
  )
}
