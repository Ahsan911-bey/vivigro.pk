"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

const timelineEvents = [
  {
    year: "2005",
    title: "Company Founded",
    description: "Vivigro was established in Karachi as a small agricultural supplier.",
  },
  {
    year: "2008",
    title: "Expansion into Textiles",
    description: "Added textile products to our catalog, serving local manufacturers.",
  },
  {
    year: "2012",
    title: "Nationwide Distribution",
    description: "Expanded operations to serve businesses across Pakistan.",
  },
  {
    year: "2015",
    title: "International Partnerships",
    description: "Formed strategic partnerships with international suppliers.",
  },
  {
    year: "2018",
    title: "Product Innovation",
    description: "Launched our own line of eco-friendly fertilizers.",
  },
  {
    year: "2023",
    title: "Digital Transformation",
    description: "Launched our e-commerce platform to better serve our customers.",
  },
]

export function Timeline() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" })

  return (
    <section className="py-16" ref={ref}>
      <h2 className="text-3xl font-bold mb-12 text-center">Our Journey</h2>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-emerald-200 dark:bg-emerald-800" />

        <div className="space-y-12">
          {timelineEvents.map((event, index) => (
            <motion.div
              key={event.year}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
            >
              <div className={`w-1/2 ${index % 2 === 0 ? "pr-12 text-right" : "pl-12"}`}>
                <h3 className="text-xl font-bold text-emerald-600">{event.year}</h3>
                <h4 className="text-lg font-semibold mb-2">{event.title}</h4>
                <p className="text-gray-600 dark:text-gray-300">{event.description}</p>
              </div>

              <div className="z-10 flex items-center justify-center w-8 h-8 bg-emerald-600 rounded-full">
                <div className="w-3 h-3 bg-white rounded-full" />
              </div>

              <div className="w-1/2" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
