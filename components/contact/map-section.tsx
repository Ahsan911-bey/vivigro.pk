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

      <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d54930.63183159201!2d73.07074056698703!3d30.629321506429612!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3922b769e20870a1%3A0x5a196c5a2ce20227!2sViviGro%20Sustainable%20Solutions%20(Pvt)%20Limited%20Pakistan!5e0!3m2!1sen!2s!4v1745697251359!5m2!1sen!2s"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </motion.section>
  )
}
