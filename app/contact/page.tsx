import { ContactForm } from "@/components/contact/contact-form"
import { ContactInfo } from "@/components/contact/contact-info"
import { MapSection } from "@/components/contact/map-section"

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto mb-16">
        <h1 className="text-4xl font-bold mb-6 text-center">Contact Us</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 text-center">
          Have questions or need assistance? We're here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <ContactInfo />
        <ContactForm />
      </div>

      <MapSection />
    </div>
  )
}
