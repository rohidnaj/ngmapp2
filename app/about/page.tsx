import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Target, Heart, Award, Leaf, ArrowRight, Eye, MapPin, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/site/reveal';
import { siteConfig } from '@/lib/site-data';

export const metadata: Metadata = {
  title: 'About Us | Najm Garden & Maintenance Ltd. Maple Ridge BC',
  description:
    'Learn about Najm Garden & Maintenance Ltd. (NGM Landscape), a locally owned landscaping and garden maintenance company in Maple Ridge, BC founded by Najmudin Najm.',
  alternates: {
    canonical: 'https://ngmlandscape.ca/about',
  },
  openGraph: {
    title: 'About Najm Garden & Maintenance Ltd. | Maple Ridge BC',
    description:
      'Locally owned and operated by Najmudin Najm, providing professional lawn care, garden maintenance, and drip irrigation across Maple Ridge and the Lower Mainland.',
    url: 'https://ngmlandscape.ca/about',
    type: 'website',
  },
};

const values = [
  {
    icon: Award,
    title: 'Quality Workmanship',
    description:
      'We take genuine pride in our work. Every property — whether routine lawn care or detailed garden maintenance — receives meticulous attention.',
  },
  {
    icon: Eye,
    title: 'Attention to Detail',
    description:
      'From clean, crisp walkway edging to thoughtful plant spacing and thorough cleanup, the details define a well-kept outdoor space.',
  },
  {
    icon: Heart,
    title: 'Respect for Your Property',
    description:
      'We treat your home and garden with care, ensuring gates are closed, walkways are blown clean, and green waste is handled responsibly.',
  },
  {
    icon: Target,
    title: 'Reliable Communication',
    description:
      'We provide straightforward scheduling and honest communication from your initial estimate through project completion.',
  },
];

export default function AboutPage() {
  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Najm Garden & Maintenance Ltd.',
    url: 'https://ngmlandscape.ca/about',
    description:
      'Najm Garden & Maintenance Ltd. is a local landscaping and garden maintenance company based in Maple Ridge, British Columbia, owned and operated by Najmudin Najm.',
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ngmlandscape.ca' },
        { '@type': 'ListItem', position: 2, name: 'About', item: 'https://ngmlandscape.ca/about' },
      ],
    },
    mainEntity: {
      '@type': 'LocalBusiness',
      name: siteConfig.name,
      alternateName: siteConfig.shortName,
      founder: {
        '@type': 'Person',
        name: siteConfig.owner,
      },
      telephone: siteConfig.phone,
      email: siteConfig.email,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />

      {/* Hero */}
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <Image
            src="https://images.pexels.com/photos/37989319/pexels-photo-37989319.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Well-tended residential garden and lawn landscape"
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
              Local · Independent · Dedicated
            </span>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl text-balance">
              About Najm Garden &amp; Maintenance Ltd.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base text-white/90 sm:text-lg text-balance">
              Professional, honest landscaping and garden maintenance serving
              homeowners and properties across Maple Ridge and the Lower Mainland.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Company Story */}
      <section className="bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <span className="text-sm font-semibold uppercase tracking-widest text-forest">
                Our Story
              </span>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl text-balance">
                A Local Landscaping Service You Can Rely On
              </h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
                <p>
                  <strong>Najm Garden &amp; Maintenance Ltd.</strong> (NGM Landscape)
                  is an independent landscaping and property maintenance company
                  based in Maple Ridge, British Columbia. We serve residential and
                  commercial properties throughout Maple Ridge, Pitt Meadows,
                  Mission, Langley, Coquitlam, Port Coquitlam, Surrey, and Burnaby.
                </p>
                <p>
                  Founded and operated by <strong>Najmudin Najm</strong>, our company
                  was created to offer dependable, high-standard outdoor maintenance
                  without unnecessary complications. We understand that keeping up
                  with lawn mowing, hedge trimming, garden weeding, and seasonal
                  cleanups takes considerable time and physical effort.
                </p>
                <p>
                  We bring practical experience caring for local properties — from
                  thorough spring cleanups and moss management to regular lawn care,
                  hedge trimming, garden mulching, and drip irrigation.
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <div className="flex items-center gap-2 text-sm text-foreground font-medium">
                  <CheckCircle2 className="h-4 w-4 text-forest" />
                  <span>Owner-operated quality oversight</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground font-medium">
                  <CheckCircle2 className="h-4 w-4 text-forest" />
                  <span>Licensed BC registered business</span>
                </div>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border shadow-lg">
                <Image
                  src="https://images.pexels.com/photos/8583822/pexels-photo-8583822.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Harmonious residential outdoor garden space"
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-muted/30 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-forest">
              What We Stand For
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl text-balance">
              Our Core Service Principles
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Every job we take on is guided by straightforward principles of
              craftsmanship, honesty, and care.
            </p>
          </Reveal>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, i) => (
              <Reveal key={value.title} delay={i * 80}>
                <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-8 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest/10 text-forest">
                    <value.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold">{value.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Owner Profile */}
      <section className="bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-forest">
              Leadership
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl text-balance">
              Meet The Owner
            </h2>
          </Reveal>

          <div className="mt-12 flex justify-center">
            <Reveal>
              <div className="flex max-w-2xl flex-col items-center rounded-3xl border border-border bg-card p-8 shadow-sm text-center sm:p-12">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-forest text-white shadow-md">
                  <Leaf className="h-10 w-10" />
                </div>
                <h3 className="mt-6 text-2xl font-semibold">{siteConfig.owner}</h3>
                <p className="text-sm font-semibold text-forest">Owner &amp; Operator</p>
                <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 text-forest" />
                  <span>Maple Ridge, British Columbia</span>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                  As the owner of Najm Garden &amp; Maintenance Ltd., Najmudin
                  leads each project with hands-on dedication. When you hire NGM
                  Landscape, you are working directly with a local professional
                  who takes personal accountability for the health, appearance,
                  and cleanliness of your property.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal className="mt-12 text-center">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-forest px-8 text-white hover:bg-forest-light"
            >
              <Link href="/quote">
                Request an Estimate
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
