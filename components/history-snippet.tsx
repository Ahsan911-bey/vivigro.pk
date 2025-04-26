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
        <h2 className="text-3xl font-bold mb-6">About Us</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
        ViviGro Sustainable Solutions Ltd., based in Saskatoon, Saskatchewan, Canada, is a
        leader in soil health and restoration, specializing in eco-friendly, biodegradable fertilizer blends.
        </p>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
        The company focuses on sustainable and regenerative farming practices, offering customized
        solutions to improve soil fertility, reduce reliance on synthetic inputs, and enhance crop yields.
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
        <Image src="https://vivigro.com/wp-content/uploads/2023/09/IMG_0149-scaled.jpg" alt="Vivigro History" fill className="object-cover" />
      </motion.div>
    </div>
  )
}
