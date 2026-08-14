import type { Metadata } from 'next';
import { ContactContent } from './contact-content';

export const metadata: Metadata = {
  title: 'Contact | Najm Garden & Maintenance Ltd. Maple Ridge BC',
  description:
    'Contact Najm Garden & Maintenance Ltd. for professional landscaping services in Maple Ridge and the Lower Mainland. Call 778-233-1599 or request a free quote online.',
};

export default function ContactPage() {
  return <ContactContent />;
}
