"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Check, Target, Eye } from "lucide-react"

export function MissionVision() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" })

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800 rounded-xl my-16" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-sm"
          >
            <div className="flex items-center mb-6">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mr-4">
                <Target className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold">Our Mission</h3>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
              To provide high-qualityfertilizer products that help  farmers across Pakistan
              achieve sustainable growth and success.
            </p>

            <ul className="space-y-3">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-emerald-600 mr-2 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">Deliver premium products at competitive prices</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-emerald-600 mr-2 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">
                  Support sustainable farming 
                </span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-emerald-600 mr-2 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">
                  Build long-term relationships with our customers
                </span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-sm"
          >
            <div className="flex items-center mb-6">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mr-4">
                <Eye className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold">Our Vision</h3>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
              To be the leading provider of Fertilizers in Pakistan, recognized for our quality,
              innovation, and commitment to customer success.
            </p>

            <ul className="space-y-3">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-emerald-600 mr-2 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">
                  Expand our product range to meet evolving market needs
                </span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-emerald-600 mr-2 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">
                  Innovate and adopt new technologies to improve our products 
                </span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
