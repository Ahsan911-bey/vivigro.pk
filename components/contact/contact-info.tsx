"use client"

import { motion } from "framer-motion"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export function ContactInfo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm"
    >
      <h2 className="text-2xl font-bold mb-6">Contact Information</h2>

      <div className="space-y-6">
        <div className="flex items-start">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mr-4">
            <MapPin className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-medium mb-1">Address</h3>
            <p className="text-gray-600 dark:text-gray-300">
            ViviGro Sustainable Solutions (Pvt)  Limited  Warehouses 1 km off  Sahiwal Bypass, Pakpattan Road, Sahiwal
              <br />
              Pakistan
              
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mr-4">
            <Phone className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-medium mb-1">Phone</h3>
            <p className="text-gray-600 dark:text-gray-300">
            03108690858
            </p>
            <p className="text-gray-600 dark:text-gray-300">
            03008690858
            </p>
            <p className="text-gray-600 dark:text-gray-300">
            03017553366
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mr-4">
            <Mail className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-medium mb-1">Email</h3>
            <p className="text-gray-600 dark:text-gray-300">
              info@vivigro.pk
              <br />
              support@vivigro.pk
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mr-4">
            <Clock className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-medium mb-1">Business Hours</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Monday - Saturday: 9:00 AM - 6:00 PM
              <br />
              Sunday: Closed
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
