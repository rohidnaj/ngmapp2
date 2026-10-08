import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  Droplets,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Calendar,
  Sparkles,
  MapPin,
  Leaf,
  Layers,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/site/reveal';
import { siteConfig } from '@/lib/site-data';

export const metadata: Metadata = {
  title: 'Drip Irrigation Installation Maple Ridge BC | Garden Drip Systems',
  description:
    'Professional drip irrigation installation in Maple Ridge and surrounding areas. Easy, direct watering for flower beds, shrubs, and garden trees. Request an estimate.',
  alternates: {
    canonical: 'https://ngmlandscape.ca/services/drip-irrigation',
  },
  openGraph: {
    title: 'Drip Irrigation Installation in Maple Ridge, BC | NGM Landscape',
    description:
      'Convenient drip irrigation installation for flower beds, shrubs, hedges, and trees in Maple Ridge and the Lower Mainland.',
    url: 'https://ngmlandscape.ca/services/drip-irrigation',
    type: 'website',
    images: [
      {
        url: '/images/drip-irrigation.jpg',
        width: 1200,
        height: 630,
        alt: 'Garden drip irrigation system installation in Maple Ridge BC',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Drip Irrigation Installation Maple Ridge BC | NGM Landscape',
    description:
      'Straightforward garden drip irrigation systems for homeowners in Maple Ridge and surrounding areas.',
    images: ['/images/drip-irrigation.jpg'],
  },
};

const applications = [
  {
    title: 'Flower & Perennial Beds',
    description:
      'Gently delivers water right to the soil around your flowers, keeping the beds healthy without spraying water over walkways.',
    icon: Leaf,
  },
  {
    title: 'Shrub & Hedge Rows',
    description:
      'Drip tubing runs along cedar hedges and garden shrubs to provide deep, even watering directly where roots absorb it.',
    icon: Layers,
  },
  {
    title: 'Garden Trees & Saplings',
    description:
      'Targeted emitters give young and established trees the slow, steady soaking they need to thrive during dry weather.',
    icon: Sparkles,
  },
  {
    title: 'Vegetable & Raised Garden Beds',
    description:
      'Consistent, hands-off watering for raised beds and home gardens, keeping plants hydrated on a regular schedule.',
    icon: Droplets,
  },
];

const installationSteps = [
  {
    step: '01',
    title: 'Garden Walkthrough',
    description:
      'We visit your property to look at your garden beds, plant layout, and outdoor water source.',
  },
  {
    step: '02',
    title: 'Layout & Tubing',
    description:
      'We plan the line layout and route durable tubing through your beds, neatly positioned under your mulch.',
  },
  {
    step: '03',
    title: 'Emitter Placement',
    description:
      'Emitters are placed near the roots of your plants and shrubs so water goes straight to the soil.',
  },
  {
    step: '04',
    title: 'Timer Setup & Testing',
    description:
      'We connect a simple timer, test the full system for proper flow, and make sure everything is working cleanly.',
  },
];

const faqs = [
  {
    q: 'Can drip irrigation be added to an existing garden bed?',
    a: 'Yes. We can install drip lines into mature, established garden beds with minimal disturbance to your plants, placing the tubing neatly under a layer of mulch so it stays out of sight.',
  },
  {
    q: 'How does the system turn on and off?',
    a: 'We connect the system to an easy-to-use digital or battery-powered timer at your outdoor faucet. Once scheduled, your garden waters automatically without you needing to turn it on manually.',
  },
  {
    q: 'What seasonal maintenance does drip irrigation need?',
    a: 'In the spring, we turn the system back on, check the lines, and adjust your watering timer. In late fall before freezing temperatures arrive, the system is simply shut off and drained for the winter.',
  },
  {
    q: 'What areas do you serve for drip irrigation?',
    a: 'We install garden drip irrigation for homeowners in Maple Ridge, Pitt Meadows, Mission, Langley, Coquitlam, Port Coquitlam, Surrey, and Burnaby.',
  },
];

export default function DripIrrigationPage() {
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Drip Irrigation Installation',
    name: 'Drip Irrigation Installation in Maple Ridge, BC',
    provider: {
      '@type': 'LocalBusiness',
      name: siteConfig.name,
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
    areaServed: [
      'Maple Ridge',
      'Pitt Meadows',
      'Mission',
      'Langley',
      'Coquitlam',
      'Port Coquitlam',
      'Surrey',
      'Burnaby',
    ],
    description:
      'Professional garden drip irrigation installation and maintenance in Maple Ridge, BC and surrounding areas. Direct watering for flower beds, shrubs, hedges, and trees.',
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden pt-24 pb-16">
        <div className="absolute inset-0">
          <Image
            src="/images/drip-irrigation.jpg"
            alt="Drip irrigation line watering garden plants in Maple Ridge BC"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-md">
              <Droplets className="h-3.5 w-3.5 text-blue-300" />
              <span>Garden Drip Irrigation · Maple Ridge &amp; Surrounding Areas</span>
            </div>
            <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
              Drip Irrigation Installation in Maple Ridge, BC
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-white/90 sm:text-lg">
              Keep your flower beds, hedges, shrubs, and garden trees consistently
              watered without the hassle of dragging hoses. Practical, low-maintenance
              drip systems installed for your property.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
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
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-white/30 bg-white/10 px-8 text-white backdrop-blur-md hover:bg-white/20"
              >
                <a href={`tel:${siteConfig.phone.replace(/[^0-9]/g, '')}`}>
                  Call {siteConfig.phone}
                </a>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="border-b border-border bg-muted/20 py-3 text-xs text-muted-foreground"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-forest transition-colors">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/services" className="hover:text-forest transition-colors">
                Services
              </Link>
            </li>
            <li>/</li>
            <li className="font-medium text-foreground">
              Drip Irrigation Maple Ridge
            </li>
          </ol>
        </div>
      </nav>

      {/* What is Drip Irrigation */}
      <section className="bg-background py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <span className="text-sm font-semibold uppercase tracking-widest text-forest">
                Simple Garden Watering
              </span>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl text-balance">
                What Is Drip Irrigation?
              </h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
                <p>
                  <strong>Drip irrigation</strong> is a straightforward watering
                  system that delivers water directly to the soil at the base of
                  your plants.
                </p>
                <p>
                  Instead of spraying water across the yard with a traditional
                  sprinkler, thin flexible tubing runs through your garden beds
                  with small emitters placed near each plant. Water drips slowly
                  into the soil right at the root zone where plants can use it.
                </p>
                <p>
                  Because the tubing is hidden beneath your garden mulch, the
                  system stays out of sight while keeping your garden beds watered
                  on a consistent schedule.
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <div className="flex items-center gap-2 text-sm text-foreground font-medium">
                  <CheckCircle2 className="h-4 w-4 text-forest" />
                  <span>Waters directly at the soil</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground font-medium">
                  <CheckCircle2 className="h-4 w-4 text-forest" />
                  <span>Hidden under fresh mulch</span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border shadow-lg">
                <Image
                  src="/images/drip-irrigation-2.jpg"
                  alt="Drip irrigation line watering garden soil"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute bottom-3 left-3 rounded-md bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                  Service Illustration: Drip Line in Garden Bed
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Where We Install It */}
      <section className="bg-muted/30 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-forest">
              Applications
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl text-balance">
              Where We Install Drip Irrigation
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              We install drip lines for key garden areas across your property.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {applications.map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest/10 text-forest">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why Homeowners Choose Drip Irrigation */}
      <section className="bg-background py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-forest">
              Homeowner Benefits
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl text-balance">
              Why Choose Drip Irrigation for Your Yard?
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Reveal delay={0}>
              <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-sm">
                <Clock className="h-6 w-6 text-forest" />
                <h3 className="mt-4 font-semibold text-foreground">Saves You Time</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  No more spending your evenings moving sprinklers or dragging hoses around your beds.
                </p>
              </div>
            </Reveal>

            <Reveal delay={60}>
              <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-sm">
                <Droplets className="h-6 w-6 text-forest" />
                <h3 className="mt-4 font-semibold text-foreground">Targeted Watering</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Water goes directly to your plants rather than spraying sidewalks, fences, or patios.
                </p>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-sm">
                <Leaf className="h-6 w-6 text-forest" />
                <h3 className="mt-4 font-semibold text-foreground">Healthier Growth</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Consistent moisture at the roots helps shrubs, flowers, and trees stay healthy through dry summer spells.
                </p>
              </div>
            </Reveal>

            <Reveal delay={180}>
              <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-sm">
                <CheckCircle2 className="h-6 w-6 text-forest" />
                <h3 className="mt-4 font-semibold text-foreground">Clean Appearance</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Lines are buried neatly beneath mulch, keeping your landscape looking tidy and uncluttered.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Installation Process */}
      <section className="bg-muted/30 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-forest">
              How It Works
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl text-balance">
              Basic Installation Process
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              We handle the entire setup from start to finish.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {installationSteps.map((step) => (
              <Reveal key={step.step}>
                <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest/10 font-bold text-forest text-base">
                    {step.step}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Seasonal Maintenance */}
      <section className="bg-background py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-forest">
              Simple Upkeep
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl text-balance">
              Basic Seasonal Maintenance
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Drip irrigation is simple to maintain with two straightforward seasonal steps:
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <Reveal>
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest/10 text-forest">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">Spring Startup</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  In spring, we turn the water supply back on, inspect the lines to make sure everything is flowing freely, and set your watering timer for the season.
                </p>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest/10 text-forest">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">Fall Winterization</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Before winter freezes arrive, we shut off the water connection and drain the lines so cold weather cannot freeze or damage the tubing.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Common Questions */}
      <section className="bg-muted/30 py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-forest">
              Questions
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl text-balance">
              Common Questions About Drip Irrigation
            </h2>
          </Reveal>

          <div className="mt-12 space-y-4">
            {faqs.map((faq, i) => (
              <Reveal key={faq.q} delay={i * 50}>
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <h3 className="text-base font-semibold text-foreground flex items-start gap-2.5">
                    <HelpCircle className="h-5 w-5 text-forest shrink-0 mt-0.5" />
                    <span>{faq.q}</span>
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground pl-7">
                    {faq.a}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Service Area */}
      <section className="bg-background py-16 text-center">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="inline-flex items-center gap-2 text-forest text-sm font-medium">
              <MapPin className="h-4 w-4" />
              <span>Service Area</span>
            </div>
            <h3 className="mt-2 text-2xl font-semibold">
              Serving Maple Ridge, Pitt Meadows, Langley, Mission &amp; Nearby Areas
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              We provide estimates and installation across Maple Ridge, Pitt
              Meadows, Mission, Langley, Coquitlam, Port Coquitlam, Surrey, and Burnaby.
            </p>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-forest py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <Reveal>
            <Droplets className="mx-auto h-10 w-10 text-white/70" />
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl text-balance">
              Request an Estimate for Drip Irrigation
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-white/90">
              Tell us about your garden beds or shrub areas and we&apos;ll provide
              a clear estimate for drip irrigation installation.
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
