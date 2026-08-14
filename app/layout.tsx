import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/site/navbar';
import { Footer } from '@/components/site/footer';
import { FloatingButtons } from '@/components/site/floating-buttons';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  metadataBase: new URL('https://ngmlandscape.ca'),
  title: {
    default: 'Najm Garden & Maintenance Ltd. | Landscaping Maple Ridge BC',
    template: '%s | Najm Garden & Maintenance Ltd.',
  },
  description:
    'Professional landscaping, garden maintenance, and outdoor improvements in Maple Ridge and surrounding areas. Lawn care, landscape design, seasonal cleanup, and more.',
  keywords: [
    'landscaping Maple Ridge BC',
    'garden maintenance Maple Ridge',
    'lawn care Maple Ridge',
    'landscape design BC',
    'Najm Garden & Maintenance Ltd',
    'landscaping Lower Mainland',
    'lawn maintenance Pitt Meadows',
    'garden cleanup Surrey',
  ],
  openGraph: {
    title: 'Najm Garden & Maintenance Ltd. | Landscaping Maple Ridge BC',
    description:
      'Professional landscaping, garden maintenance, and outdoor improvements in Maple Ridge and surrounding areas.',
    type: 'website',
    locale: 'en_CA',
    images: [
      {
        url: 'https://images.pexels.com/photos/8082322/pexels-photo-8082322.jpeg?auto=compress&cs=tinysrgb&w=1200',
        width: 1200,
        height: 630,
        alt: 'Beautiful landscaped property by Najm Garden & Maintenance Ltd.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Najm Garden & Maintenance Ltd. | Landscaping Maple Ridge BC',
    description:
      'Professional landscaping, garden maintenance, and outdoor improvements in Maple Ridge and surrounding areas.',
    images: [
      'https://images.pexels.com/photos/8082322/pexels-photo-8082322.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://ngmlandscape.ca',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: 'Najm Garden & Maintenance Ltd.',
              image:
                'https://images.pexels.com/photos/8082322/pexels-photo-8082322.jpeg?auto=compress&cs=tinysrgb&w=1200',
              telephone: '778-233-1599',
              email: 'info@ngmlandscape.ca',
              url: 'https://ngmlandscape.ca',
              priceRange: '$$',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Maple Ridge',
                addressRegion: 'BC',
                addressCountry: 'CA',
              },
              areaServed: [
                'Maple Ridge',
                'Pitt Meadows',
                'Surrey',
                'Coquitlam',
                'Burnaby',
                'Vancouver',
                'Lower Mainland BC',
              ],
              openingHours: 'Mo-Sa 07:00-18:00',
              sameAs: [],
            }),
          }}
        />
      </head>
      <body className={inter.variable}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <FloatingButtons />
        </ThemeProvider>
      </body>
    </html>
  );
}
