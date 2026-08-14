import type { Metadata } from 'next';
import { GalleryContent } from './gallery-content';

export const metadata: Metadata = {
  title: 'Gallery | Najm Garden & Maintenance Ltd. Project Portfolio',
  description:
    'Explore our portfolio of landscaping projects in Maple Ridge and the Lower Mainland. Before and after transformations, garden design, lawn care, planting, and outdoor improvements.',
};

export default function GalleryPage() {
  return <GalleryContent />;
}
