import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Check, ArrowRight, Leaf, Droplets } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/site/reveal';
import { services, siteConfig } from '@/lib/site-data';

export const metadata: Metadata = {
  title: 'Landscaping & Garden Maintenance Services | Maple Ridge BC',
  description:
    'Core landscaping services in Maple Ridge & Lower Mainland: lawn mowing & edging, hedge trimming, planting, garden mulching, weed control, cleanups, drip irrigation & power washing.',
  alternates: {
    canonical: 'https://ngmlandscape.ca/services',
  },
  openGraph: {
    title: 'Landscaping & Garden Maintenance Services | NGM Landscape',
    description:
      'Professional lawn care, garden maintenance, planting, mulching, drip irrigation, and seasonal cleanups serving Maple Ridge and the Lower Mainland / Fraser Valley.',
    url: 'https://ngmlandscape.ca/services',
    type: 'website',
  },
};

export default function ServicesPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://ngmlandscape.ca',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Services',
        item: 'https://ngmlandscape.ca/services',
      },
    ],
  };

  const serviceListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: services.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        name: service.title,
        description: service.description,
        provider: {
          '@type': 'LocalBusiness',
          name: siteConfig.name,
          telephone: siteConfig.phone,
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Maple Ridge',
            addressRegion: 'BC',
            addressCountry: 'CA',
          },
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceListSchema) }}
      />

      {/* Hero */}
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <Image
            src="https://images.pexels.com/photos/8143684/pexels-photo-8143684.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Well-maintained residential garden bed and lawn in the Pacific Northwest"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-md">
              <Leaf className="h-3.5 w-3.5 text-green-400" />
              Core Landscaping &amp; Maintenance Services
            </span>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl text-balance">
              Landscaping Services in Maple Ridge &amp; Lower Mainland
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base text-white/90 sm:text-lg text-balance">
              Reliable, professional garden care, lawn maintenance, seasonal cleanups,
              and drip irrigation for homes and properties in Maple Ridge and surrounding areas.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Quick Navigation Jump Bar */}
      <section className="border-b border-border bg-muted/30 py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="font-semibold text-foreground">Jump to service:</span>
            {services.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="rounded-full border border-border bg-card px-3 py-1 font-medium text-muted-foreground transition-colors hover:border-forest hover:text-forest"
              >
                {s.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Services */}
      {services.map((service, idx) => (
        <section
          key={service.id}
          id={service.id}
          className={`scroll-mt-24 py-20 sm:py-28 ${
            idx % 2 === 0 ? 'bg-background' : 'bg-muted/30'
          }`}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div
              className={`grid gap-12 lg:grid-cols-2 lg:items-center ${
                idx % 2 === 1 ? 'lg:grid-flow-dense' : ''
              }`}
            >
              <Reveal className={idx % 2 === 1 ? 'lg:col-start-2' : ''}>
                <span className="text-sm font-semibold uppercase tracking-widest text-forest">
                  Service {String(idx + 1).padStart(2, '0')}
                </span>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl text-balance">
                  {service.title}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
                <ul className="mt-6 space-y-3">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-forest/10">
                        <Check className="h-3 w-3 text-forest" />
                      </div>
                      <span className="text-sm text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Button
                    asChild
                    className="rounded-full bg-forest text-white hover:bg-forest-light"
                  >
                    <Link href="/quote">
                      Request an Estimate
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>

                  {service.id === 'drip-irrigation' && (
                    <Button
                      asChild
                      variant="outline"
                      className="rounded-full border-forest/40 text-forest hover:bg-forest/10"
                    >
                      <Link href="/services/drip-irrigation">
                        <Droplets className="mr-2 h-4 w-4" />
                        Explore Drip Irrigation Details
                      </Link>
                    </Button>
                  )}
                </div>
              </Reveal>

              <Reveal
                delay={200}
                className={idx % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border shadow-lg">
                  <Image
                    src={service.image}
                    alt={`Illustration of ${service.title} by NGM Landscape`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute bottom-3 left-3 rounded-md bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                    Service Illustration
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="bg-forest py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <Reveal>
            <Leaf className="mx-auto h-10 w-10 text-white/60" />
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl text-balance">
              Need Reliable Landscaping in Maple Ridge or the Lower Mainland?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-white/90">
              Get in touch with Najmudin Najm and the NGM team for honest advice,
              thorough workmanship, and a clear estimate.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-white px-8 text-forest hover:bg-white/90 font-semibold"
              >
                <Link href="/quote">
                  Request an Estimate
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-white/30 bg-transparent px-8 text-white hover:bg-white/10"
              >
                <a href={`tel:${siteConfig.phone.replace(/[^0-9]/g, '')}`}>
                  Call {siteConfig.phone}
                </a>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
