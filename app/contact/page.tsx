import { ContactForm } from "@/components/contact/contact-form"
import { ContactInfo } from "@/components/contact/contact-info"
import { MapSection } from "@/components/contact/map-section"
import JsonLd from '@/components/JsonLd';
import { contactSchema, breadcrumbSchema } from '@/lib/schema';

export default function ContactPage() {
  const breadcrumbs = [
    { name: 'Home', item: 'https://vivigro.pk' },
    { name: 'Contact', item: 'https://vivigro.pk/contact' },
  ];

  return (
    <>
      <JsonLd data={contactSchema} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
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

        {/* Add LocalBusiness Schema Markup */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: 'Vivigro Pakistan',
          image: 'https://vivigro.pk/logofinalwebp.webp',
          '@id': 'https://vivigro.pk',
          url: 'https://vivigro.pk',
          telephone: '+92-300-8690858',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Sahiwal',
            addressLocality: 'Sahiwal',
            addressRegion: 'Punjab',
            postalCode: '57000',
            addressCountry: 'PK',
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 30.6700,
            longitude: 73.1067,
          },
          openingHoursSpecification: [{
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: [
              'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
            ],
            opens: '09:00',
            closes: '18:00',
          }],
          sameAs: [
            'https://www.facebook.com/vivigropk',
          ],
          description: 'Contact Vivigro Pakistan to buy premium fertilizers online. Serving farmers across Pakistan.'
        }) }} />
      </div>
    </>
  )
}
