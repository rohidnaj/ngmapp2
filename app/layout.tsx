import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/site/navbar';
import { Footer } from '@/components/site/footer';
import { FloatingButtons } from '@/components/site/floating-buttons';
import { siteConfig } from '@/lib/site-data';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  metadataBase: new URL('https://ngmlandscape.ca'),
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1a5c38' },
    { media: '(prefers-color-scheme: dark)', color: '#0f3d24' },
  ],
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
  title: {
    default: 'Landscaping Maple Ridge BC | Najm Garden & Maintenance Ltd.',
    template: '%s | NGM Landscape — Maple Ridge BC',
  },
  description:
    'Professional landscaping, lawn care & garden maintenance in Maple Ridge & the Lower Mainland. Lawn mowing, hedge trimming, mulching & drip irrigation. Call 778-233-1599.',
  keywords: [
    'landscaping Maple Ridge BC',
    'lawn care Maple Ridge BC',
    'garden maintenance Maple Ridge',
    'landscaping Pitt Meadows',
    'landscaping Mission',
    'landscaping Langley',
    'landscaping Coquitlam',
    'landscaping Surrey',
    'landscaping Burnaby',
    'drip irrigation Maple Ridge',
    'hedge trimming Maple Ridge',
    'seasonal cleanup Lower Mainland',
    'Najm Garden & Maintenance Ltd',
    'NGM Landscape',
  ],
  openGraph: {
    title: 'Landscaping Maple Ridge BC | Najm Garden & Maintenance Ltd.',
    description:
      'Professional landscaping, lawn care & garden maintenance in Maple Ridge & the Lower Mainland. Reliable, owner-operated service. Call 778-233-1599.',
    type: 'website',
    locale: 'en_CA',
    url: 'https://ngmlandscape.ca',
    siteName: 'NGM Landscape',
    images: [
      {
        url: 'https://images.pexels.com/photos/8082322/pexels-photo-8082322.jpeg?auto=compress&cs=tinysrgb&w=1200',
        width: 1200,
        height: 630,
        alt: 'Professional landscaping and garden maintenance by NGM Landscape in Maple Ridge BC',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Landscaping Maple Ridge BC | Najm Garden & Maintenance Ltd.',
    description:
      'Professional lawn care, garden maintenance, planting, mulching, and drip irrigation serving Maple Ridge and the Lower Mainland.',
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
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'HomeAndConstructionBusiness',
        '@id': 'https://ngmlandscape.ca/#business',
        name: siteConfig.name,
        alternateName: siteConfig.shortName,
        legalName: siteConfig.name,
        founder: {
          '@type': 'Person',
          name: siteConfig.owner,
        },
        telephone: siteConfig.phone,
        email: siteConfig.email,
        url: 'https://ngmlandscape.ca',
        description:
          'Najm Garden & Maintenance Ltd. (NGM Landscape) provides professional lawn mowing, hedge trimming, planting, garden mulching, seasonal cleanups, and drip irrigation in Maple Ridge, BC and the surrounding Lower Mainland and Fraser Valley.',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Maple Ridge',
          addressRegion: 'BC',
          addressCountry: 'CA',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 49.2194,
          longitude: -122.5984,
        },
        areaServed: [
          { '@type': 'City', name: 'Maple Ridge' },
          { '@type': 'City', name: 'Pitt Meadows' },
          { '@type': 'City', name: 'Mission' },
          { '@type': 'City', name: 'Langley' },
          { '@type': 'City', name: 'Coquitlam' },
          { '@type': 'City', name: 'Port Coquitlam' },
          { '@type': 'City', name: 'Surrey' },
          { '@type': 'City', name: 'Burnaby' },
          { '@type': 'AdministrativeArea', name: 'Lower Mainland' },
          { '@type': 'AdministrativeArea', name: 'Fraser Valley' },
        ],
        openingHours: 'Mo-Sa 07:00-18:00',
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Landscaping & Garden Maintenance Services',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Lawn Mowing, Weeding and Edging',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Hedge and Shrub Trimming',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Planting Flowers, Trees and Shrubs',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Garden Bed Mulching',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Fertilizer and Weed Control',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Spring and Fall Cleanups',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Garden Design and Consultation',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Power Washing Decks and Patios',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Drip Irrigation Installation for Gardens',
                url: 'https://ngmlandscape.ca/services/drip-irrigation',
              },
            },
          ],
        },
      },
      {
        '@type': 'WebSite',
        '@id': 'https://ngmlandscape.ca/#website',
        url: 'https://ngmlandscape.ca',
        name: 'NGM Landscape — Najm Garden & Maintenance Ltd.',
        description:
          'Official website for Najm Garden & Maintenance Ltd., professional landscaping company in Maple Ridge, BC.',
        publisher: {
          '@id': 'https://ngmlandscape.ca/#business',
        },
      },
    ],
  };

  return (
    <html lang="en-CA" suppressHydrationWarning>
      <head>
        {/* DNS preconnect for Pexels image CDN */}
        <link rel="preconnect" href="https://images.pexels.com" />
        <link rel="dns-prefetch" href="https://images.pexels.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
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
