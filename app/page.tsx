import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Eye, Sparkles, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/site/reveal';
import { ServiceCard } from '@/components/site/service-card';
import { services, galleryImages, serviceAreas } from '@/lib/site-data';

const whyChooseUs = [
  {
    icon: ShieldCheck,
    title: 'Reliable Service',
    description:
      'We show up on time, every time. Consistent scheduling and dependable service you can count on.',
  },
  {
    icon: Eye,
    title: 'Attention To Detail',
    description:
      'Every blade of grass, every hedge, every flower bed — we treat your property with meticulous care.',
  },
  {
    icon: Sparkles,
    title: 'Professional Workmanship',
    description:
      'Professional tools, proven techniques, and a commitment to quality in every project we complete.',
  },
  {
    icon: MapPin,
    title: 'Local Service',
    description:
      'Based in Maple Ridge, we understand the local climate, soil, and plants that thrive in the Lower Mainland.',
  },
  {
    icon: Phone,
    title: 'Clear Communication',
    description:
      'We keep you informed every step of the way, from the first call to the final walkthrough.',
  },
  {
    icon: ShieldCheck,
    title: 'Complete Outdoor Maintenance',
    description:
      'From lawn care to garden design, we handle all your outdoor maintenance needs in one place.',
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.pexels.com/photos/8082322/pexels-photo-8082322.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Beautiful landscaped backyard in Maple Ridge BC"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 pt-20 text-center sm:px-6">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
              Serving Maple Ridge & the Lower Mainland
            </span>
          </div>
          <h1
            className="mt-6 text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl animate-fade-up"
            style={{ animationDelay: '100ms' }}
          >
            Beautiful Outdoor Spaces. Expertly Maintained.
          </h1>
          <p
            className="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-white/80 sm:text-lg md:text-xl animate-fade-up"
            style={{ animationDelay: '200ms' }}
          >
            Professional landscaping, lawn care, garden maintenance, and outdoor
            improvements throughout Maple Ridge and the Lower Mainland.
          </p>
          <div
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-up"
            style={{ animationDelay: '300ms' }}
          >
            <Button
              asChild
              size="lg"
              className="rounded-full bg-forest px-8 text-white hover:bg-forest-light"
            >
              <Link href="/quote">
                Get a Free Quote
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-white/30 bg-white/10 px-8 text-white backdrop-blur-md hover:bg-white/20"
            >
              <Link href="/services">Explore Our Services</Link>
            </Button>
          </div>
          <div
            className="mt-6 flex items-center justify-center gap-2 animate-fade-up"
            style={{ animationDelay: '400ms' }}
          >
            <a
              href="tel:7782331599"
              className="flex items-center gap-2 text-sm font-medium text-white/90 transition-colors hover:text-white"
            >
              <Phone className="h-4 w-4" />
              778-233-1599
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/40 p-1.5">
            <div className="h-2 w-1 rounded-full bg-white/60" />
          </div>
        </div>
      </section>

      {/* Why Najm */}
      <section className="bg-background py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-forest">
              Why Najm
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl text-balance">
              The Najm Garden difference
            </h2>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
              We take pride in delivering dependable, high-quality landscaping
              services across Maple Ridge and the Lower Mainland.
            </p>
          </Reveal>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyChooseUs.map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <div className="group flex h-full flex-col rounded-2xl border border-border bg-card p-8 shadow-sm transition-all duration-500 hover:shadow-lg hover:-translate-y-1">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest/10 text-forest transition-all duration-500 group-hover:bg-forest group-hover:text-white">
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

      {/* Services Preview */}
      <section className="bg-muted/30 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <span className="text-sm font-semibold uppercase tracking-widest text-forest">
                Our Services
              </span>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl text-balance">
                Everything your garden needs
              </h2>
            </div>
            <Button
              asChild
              variant="outline"
              className="rounded-full border-forest/30 text-forest hover:bg-forest hover:text-white"
            >
              <Link href="/services">
                View All Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </Reveal>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.slice(0, 8).map((service, i) => (
              <Reveal key={service.id} delay={i * 60}>
                <ServiceCard data={service} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Work */}
      <section className="bg-background py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-forest">
              Featured Work
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl text-balance">
              See the transformation
            </h2>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
              A selection of our landscaping and garden maintenance projects.
            </p>
          </Reveal>

          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {galleryImages.slice(0, 6).map((img, i) => (
              <Reveal key={img.src} delay={i * 60}>
                <div className="group relative overflow-hidden rounded-2xl border border-border shadow-sm">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    <div className="absolute bottom-0 left-0 p-5 translate-y-3 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                      <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                        {img.category}
                      </span>
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
                View Full Gallery
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>

      {/* Service Area */}
      <section className="bg-muted/30 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-forest">
              Service Area
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl text-balance">
              Serving Maple Ridge & surrounding communities
            </h2>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
              Based in Maple Ridge, BC, we proudly serve homeowners and properties
              throughout the Lower Mainland.
            </p>
          </Reveal>

          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {serviceAreas.map((area) => (
              <Reveal key={area.name}>
                <div className="flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium shadow-sm">
                  <MapPin className="h-4 w-4 text-forest" />
                  {area.name}
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
                View All Service Areas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-forest py-24 sm:py-32">
        <div className="absolute inset-0">
          <Image
            src="https://images.pexels.com/photos/8143671/pexels-photo-8143671.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Beautiful landscaped garden"
            fill
            loading="lazy"
            sizes="100vw"
            className="object-cover opacity-20"
          />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Reveal>
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl text-balance">
              Ready to improve your outdoor space?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-white/80 sm:text-lg">
              Request a free quote and let&apos;s discuss how we can bring your
              outdoor space to life.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-white px-8 text-forest hover:bg-white/90"
              >
                <Link href="/quote">
                  Request a Free Quote
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-white/30 bg-transparent px-8 text-white hover:bg-white/10"
              >
                <a href="tel:7782331599">Call 778-233-1599</a>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
