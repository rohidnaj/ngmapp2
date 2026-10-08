import type { Metadata } from 'next';
import { GalleryContent } from './gallery-content';

export const metadata: Metadata = {
  title: 'Services Visual Gallery | Najm Garden & Maintenance Ltd.',
  description:
    'Visual guide illustrating our core landscape care, garden maintenance, planting, mulching, drip irrigation, and power washing services in Maple Ridge & the Lower Mainland.',
  alternates: {
    canonical: 'https://ngmlandscape.ca/gallery',
  },
  openGraph: {
    title: 'Services Visual Gallery | NGM Landscape Maple Ridge BC',
    description:
      'Explore visual examples of professional lawn care, garden maintenance, planting, and irrigation services in Maple Ridge and the Lower Mainland.',
    url: 'https://ngmlandscape.ca/gallery',
    type: 'website',
  },
};

export default function GalleryPage() {
  const gallerySchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Services Visual Gallery | NGM Landscape',
    url: 'https://ngmlandscape.ca/gallery',
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ngmlandscape.ca' },
        { '@type': 'ListItem', position: 2, name: 'Gallery', item: 'https://ngmlandscape.ca/gallery' },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gallerySchema) }}
      />
      <GalleryContent />
    </>
  );
}
