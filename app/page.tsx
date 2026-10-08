import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  Eye,
  Sparkles,
  MapPin,
  Phone,
  Droplets,
  Calendar,
  CloudRain,
  Sun,
  Leaf,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/site/reveal';
import { ServiceCard } from '@/components/site/service-card';
import { services, galleryImages, serviceAreas, siteConfig } from '@/lib/site-data';

const whyChooseUs = [
  {
    icon: MapPin,
    title: 'Local Knowledge',
    description:
      'Based in Maple Ridge, we understand local soil and lawn conditions across the Lower Mainland and Fraser Valley.',
  },
  {
    icon: ShieldCheck,
    title: 'Dependable Scheduling',
    description:
      'We show up on schedule with professional equipment, keeping your property consistently neat, tidy, and well-maintained.',
  },
  {
    icon: Eye,
    title: 'Attention to Detail',
    description:
      'From clean lines along walkways to careful hedge shaping and thorough bed weeding, we treat your property with genuine care.',
  },
  {
    icon: Sparkles,
    title: 'Owner-Operated Care',
    description:
      'Founded and operated by Najmudin Najm, we take personal pride in every lawn cut, garden bed mulched, and project completed.',
  },
  {
    icon: Phone,
    title: 'Clear Communication',
    description:
      'Straightforward estimates, prompt replies, and clear expectations from your first call to the finished job.',
  },
  {
    icon: Droplets,
    title: 'Convenient Garden Watering',
    description:
      'We install straightforward drip irrigation systems that deliver water directly to your garden beds, shrubs, and trees.',
  },
];

const seasonalTips = [
  {
    season: 'Spring',
    icon: CloudRain,
    focus: 'Yard cleanups, moss care & first lawn cuts',
    detail:
      'Spring cleanups clear winter storm debris, twigs, and leaves. Mowing starts up with crisp edging, and fresh mulch keeps flower beds looking fresh.',
  },
  {
    season: 'Summer',
    icon: Sun,
    focus: 'Regular lawn mowing & drip watering',
    detail:
      'During drier summer weeks, regular mowing at the right height protects grass health, while drip irrigation keeps garden beds and shrubs watered without dragging hoses.',
  },
  {
    season: 'Fall',
    icon: Calendar,
    focus: 'Leaf clearing, perennial cutbacks & winter prep',
    detail:
      'Fall cleanups remove heavy wet leaves from lawns and garden beds before winter rains set in, protecting grass and keeping your yard tidy.',
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.pexels.com/photos/8082322/pexels-photo-8082322.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Professional landscaping and lawn maintenance in Maple Ridge BC"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 pt-24 pb-16 text-center sm:px-6">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
              Serving Maple Ridge &amp; Surrounding Communities
            </span>
          </div>

          <h1
            className="mt-6 text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl animate-fade-up"
            style={{ animationDelay: '100ms' }}
          >
            Professional Landscaping &amp; Garden Care in Maple Ridge, BC
          </h1>

          <p
            className="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-white/90 sm:text-lg md:text-xl animate-fade-up"
            style={{ animationDelay: '200ms' }}
          >
            <strong>Najm Garden &amp; Maintenance Ltd.</strong> provides reliable
            lawn mowing, hedge trimming, garden mulching, seasonal cleanups, and
            garden drip irrigation for residential and commercial properties.
          </p>

          <div
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-up"
            style={{ animationDelay: '300ms' }}
          >
            <Button
              asChild
              size="lg"
              className="rounded-full bg-forest px-8 text-white hover:bg-forest-light font-semibold shadow-lg"
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
              <Link href="/services">View Our Services</Link>
            </Button>
          </div>

          <div
            className="mt-8 flex items-center justify-center gap-2 animate-fade-up"
            style={{ animationDelay: '400ms' }}
          >
            <a
              href={`tel:${siteConfig.phone.replace(/[^0-9]/g, '')}`}
              className="flex items-center gap-2 text-sm font-medium text-white/90 transition-colors hover:text-white"
            >
              <Phone className="h-4 w-4 text-green-400" />
              <span>Call direct: {siteConfig.phone}</span>
            </a>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-float">
          <div className="flex h-9 w-5 items-start justify-center rounded-full border-2 border-white/40 p-1">
            <div className="h-2 w-1 rounded-full bg-white/70" />
          </div>
        </div>
      </section>

      {/* Services Grid (9 Core Services) */}
      <section className="bg-muted/30 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <span className="text-sm font-semibold uppercase tracking-widest text-forest">
                Our Services
              </span>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl text-balance">
                Landscaping &amp; Yard Maintenance Services
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Reliable maintenance and garden improvements for homes and properties.
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="rounded-full border-forest/30 text-forest hover:bg-forest hover:text-white"
            >
              <Link href="/services">
                Explore All Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <Reveal key={service.id} delay={i * 50}>
                <ServiceCard data={service} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Spotlight: Drip Irrigation in Maple Ridge */}
      <section className="bg-background py-20 sm:py-28 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full bg-forest/10 px-3.5 py-1 text-xs font-semibold text-forest">
                <Droplets className="h-3.5 w-3.5" />
                Featured Service
              </div>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl text-balance">
                Drip Irrigation for Gardens &amp; Shrubs
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Keep your garden beds, hedges, and shrubs consistently watered
                without the hassle of moving sprinklers or dragging hoses. We install
                clean drip irrigation systems placed neatly under your mulch.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2.5 text-sm text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-forest shrink-0" />
                  <span>Direct watering for flower beds, shrubs, and hedges</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-forest shrink-0" />
                  <span>Automated timer for simple, hands-free garden care</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-forest shrink-0" />
                  <span>Saves time with no need to drag hoses across the yard</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-forest shrink-0" />
                  <span>Neatly hidden under garden mulch</span>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Button
                  asChild
                  className="rounded-full bg-forest text-white hover:bg-forest-light"
                >
                  <Link href="/services/drip-irrigation">
                    Learn About Drip Irrigation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-forest/30 text-forest hover:bg-forest/10"
                >
                  <Link href="/quote">Request an Estimate</Link>
                </Button>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border shadow-lg">
                <Image
                  src="/images/drip-irrigation.jpg"
                  alt="Drip irrigation line watering garden plants in Maple Ridge"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute bottom-3 left-3 rounded-md bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                  Service Illustration: Garden Drip Irrigation
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Why Choose NGM Landscape */}
      <section className="bg-muted/30 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-forest">
              Why Najm Garden &amp; Maintenance
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl text-balance">
              Dependable Service for Your Property
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Homeowners across Maple Ridge and nearby communities rely on NGM Landscape for consistent, high-standard maintenance.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyChooseUs.map((item, i) => (
              <Reveal key={item.title} delay={i * 60}>
                <div className="group flex h-full flex-col rounded-2xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:shadow-md">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest/10 text-forest transition-colors group-hover:bg-forest group-hover:text-white">
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

      {/* Seasonal Care Overview */}
      <section className="bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-forest">
              Seasonal Upkeep
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl text-balance">
              Keeping Your Yard Healthy Year-Round
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Practical seasonal maintenance to keep your lawn and garden beds in great shape.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {seasonalTips.map((tip, i) => (
              <Reveal key={tip.season} delay={i * 80}>
                <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest/10 text-forest">
                      <tip.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold">{tip.season}</h3>
                      <p className="text-[11px] font-medium text-forest">{tip.focus}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                    {tip.detail}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Services Visual Guide */}
      <section className="bg-muted/30 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-forest">
              Visual Guide
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl text-balance">
              Our Services in Pictures
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">
              Visual examples representing our core lawn care, garden maintenance,
              drip irrigation, and power washing services.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {galleryImages.slice(0, 6).map((img, i) => (
              <Reveal key={img.src} delay={i * 60}>
                <div className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute top-3 right-3">
                      <span className="rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-md border border-white/10">
                        Service Illustration
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <span className="rounded-full bg-forest/90 px-2.5 py-0.5 text-xs font-medium text-white">
                        {img.serviceCategory}
                      </span>
                      <p className="mt-1 text-sm font-semibold text-white">
                        {img.label}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-12 text-center">
            <Button
              asChild
              variant="outline"
              className="rounded-full border-forest/30 text-forest hover:bg-forest hover:text-white"
            >
              <Link href="/gallery">
                View Full Visual Gallery
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>

      {/* Service Areas Overview */}
      <section className="bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-forest">
              Service Areas
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl text-balance">
              Serving Maple Ridge &amp; Surrounding Communities
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Based in Maple Ridge, BC, Najm Garden &amp; Maintenance Ltd. provides
              lawn care, garden maintenance, and drip irrigation across local
              neighbourhoods.
            </p>
          </Reveal>

          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {serviceAreas.map((area) => (
              <Reveal key={area.name}>
                <div className="flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium shadow-sm hover:border-forest/40 transition-colors">
                  <MapPin className="h-4 w-4 text-forest" />
                  <span>{area.name}</span>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-12 text-center">
            <Button
              asChild
              variant="outline"
              className="rounded-full border-forest/30 text-forest hover:bg-forest hover:text-white"
            >
              <Link href="/service-areas">
                View Service Areas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-forest py-20 sm:py-28">
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Reveal>
            <Leaf className="mx-auto h-10 w-10 text-white/70" />
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl text-balance">
              Ready for a Well-Maintained Outdoor Space?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-white/90 sm:text-lg">
              Contact Najm Garden &amp; Maintenance Ltd. for a clear estimate on
              lawn care, hedge trimming, planting, or drip irrigation.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
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
