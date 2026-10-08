import type { Metadata } from 'next';
import { ContactContent } from './contact-content';
import { siteConfig } from '@/lib/site-data';

export const metadata: Metadata = {
  title: 'Contact Us | Najm Garden & Maintenance Ltd. Maple Ridge BC',
  description:
    'Contact Najm Garden & Maintenance Ltd. for reliable landscaping, lawn care, and drip irrigation in Maple Ridge and the Lower Mainland. Call 778-233-1599.',
  alternates: {
    canonical: 'https://ngmlandscape.ca/contact',
  },
  openGraph: {
    title: 'Contact Najm Garden & Maintenance Ltd. | Maple Ridge BC',
    description:
      'Get in touch for lawn care, garden maintenance, planting, mulching, and drip irrigation in Maple Ridge & the Lower Mainland. Call 778-233-1599.',
    url: 'https://ngmlandscape.ca/contact',
    type: 'website',
  },
};

export default function ContactPage() {
  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Najm Garden & Maintenance Ltd.',
    url: 'https://ngmlandscape.ca/contact',
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ngmlandscape.ca' },
        { '@type': 'ListItem', position: 2, name: 'Contact', item: 'https://ngmlandscape.ca/contact' },
      ],
    },
    mainEntity: {
      '@type': 'LocalBusiness',
      name: siteConfig.name,
      alternateName: siteConfig.shortName,
      telephone: siteConfig.phone,
      email: siteConfig.email,
      url: 'https://ngmlandscape.ca',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Maple Ridge',
        addressRegion: 'BC',
        addressCountry: 'CA',
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <ContactContent />
    </>
  );
}
