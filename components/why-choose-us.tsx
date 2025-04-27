"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Shield, Leaf, Award, Users } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Premium Quality",
    description: "Our products meet the highest industry standards and quality certifications."
  },
  {
    icon: Leaf,
    title: "Eco-Friendly",
    description: "Committed to sustainable practices and environmentally conscious solutions."
  },
  {
    icon: Award,
    title: "Industry Experience",
    description: "Over 15 years of expertise in fertilizers and agricultural solutions."
  },
  {
    icon: Users,
    title: "Customer Support",
    description: "Dedicated team providing expert guidance and responsive support."
  }
];

export function WhyChooseUs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-16 bg-gradient-to-b from-black/5 to-transparent dark:from-white/5">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose Vivigro?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We deliver excellence through quality products, sustainable practices, and unmatched customer service.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-4">
                  <feature.icon className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 