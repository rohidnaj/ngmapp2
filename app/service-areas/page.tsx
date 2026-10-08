import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin,
  ArrowRight,
  Droplets,
  Sun,
  CloudRain,
  Sprout,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/site/reveal';
import { serviceAreas, siteConfig } from '@/lib/site-data';

export const metadata: Metadata = {
  title: 'Service Areas | Landscaping Maple Ridge, Pitt Meadows, Langley, BC',
  description:
    'Najm Garden & Maintenance Ltd. serves Maple Ridge, Pitt Meadows, Mission, Langley, Coquitlam, Port Coquitlam, Surrey & Burnaby with reliable landscaping & lawn care.',
  alternates: {
    canonical: 'https://ngmlandscape.ca/service-areas',
  },
  openGraph: {
    title: 'Service Areas | NGM Landscape Maple Ridge & Lower Mainland BC',
    description:
      'Professional lawn care, garden maintenance, hedge trimming, mulching, and drip irrigation across Maple Ridge and nearby communities.',
    url: 'https://ngmlandscape.ca/service-areas',
    type: 'website',
  },
};

const seasonalGuides = [
  {
    title: 'Spring Cleanups (March – May)',
    icon: Sprout,
    description:
      'We clear windstorm debris, remove dead winter growth, edge walkway borders, and start regular lawn mowing. Applying fresh bark mulch in spring helps keep garden beds neat and deters weeds.',
  },
  {
    title: 'Summer Maintenance (June – August)',
    icon: Sun,
    description:
      'Regular mowing at proper heights keeps grass healthy during dry stretches. Drip irrigation keeps flower beds, shrubs, and hedges watered consistently without having to drag hoses around.',
  },
  {
    title: 'Fall Cleanups (September – November)',
    icon: CloudRain,
    description:
      'Wet fallen leaves can smother lawns and cause moss buildup. We clear leaves, cut back spent perennials, drain drip lines, and mulch beds before freezing weather arrives.',
  },
  {
    title: 'Winter Upkeep (December – February)',
    icon: Droplets,
    description:
      'Power washing keeps patios, walkways, and driveways clean and slip-free, while garden bed borders stay tidy until the spring growing season resumes.',
  },
];

export default function ServiceAreasPage() {
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
        name: 'Service Areas',
        item: 'https://ngmlandscape.ca/service-areas',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero */}
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <Image
            src="https://images.pexels.com/photos/31291000/pexels-photo-31291000.png?auto=compress&cs=tinysrgb&w=1920"
            alt="Residential property with well-kept garden and lawn"
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
              <MapPin className="h-3.5 w-3.5 text-green-400" />
              Maple Ridge &amp; Surrounding Communities
            </span>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl text-balance">
              Service Areas
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base text-white/90 sm:text-lg text-balance">
              Dependable, local landscaping and garden maintenance serving
              homeowners across Maple Ridge, Pitt Meadows, Mission, Langley,
              and nearby areas.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Communities We Serve */}
      <section className="bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-forest">
              Local Service
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl text-balance">
              Communities We Serve
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              We provide scheduled lawn mowing, garden bed care, hedge trimming,
              seasonal cleanups, and drip irrigation across these local areas.
            </p>
          </Reveal>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
            {serviceAreas.map((area, i) => (
              <Reveal key={area.name} delay={i * 60}>
                <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-forest/10 text-forest">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold">{area.name}</h3>
                      <p className="text-xs font-medium text-forest">{area.tagline}</p>
                    </div>
                  </div>

                  <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                    {area.description}
                  </p>

                  <div className="mt-6 border-t border-border pt-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                      Popular Services in {area.name}:
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-foreground/80">
                      {area.focus.map((f) => (
                        <li key={f} className="flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-forest shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Seasonal Care Guide */}
      <section className="bg-muted/30 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-forest">
              Seasonal Care
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl text-balance">
              Year-Round Property Maintenance
            </h2>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed">
              Every season brings different needs for your lawn, hedges, and flower beds. Here is how we help keep your property looking its best.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {seasonalGuides.map((guide, i) => (
              <Reveal key={guide.title} delay={i * 80}>
                <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-8 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest/10 text-forest">
                      <guide.icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold">{guide.title}</h3>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {guide.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-forest py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <Reveal>
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl text-balance">
              Looking for Dependable Landscaping in Your Area?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-white/90">
              Whether you need regular lawn mowing in Maple Ridge, a spring cleanup
              in Pitt Meadows, or hedge trimming in Langley, we are ready to help.
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
