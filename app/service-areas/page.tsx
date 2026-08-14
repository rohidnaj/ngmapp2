import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/site/reveal';
import { serviceAreas } from '@/lib/site-data';

export const metadata: Metadata = {
  title: 'Service Areas | Landscaping Maple Ridge, Pitt Meadows, Surrey, BC',
  description:
    'Professional landscaping services helping homeowners and businesses maintain beautiful outdoor spaces. Serving Maple Ridge, Pitt Meadows, Surrey, Coquitlam, Burnaby, Vancouver, and the Lower Mainland BC.',
};

export default function ServiceAreasPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <Image
            src="https://images.pexels.com/photos/31291000/pexels-photo-31291000.png?auto=compress&cs=tinysrgb&w=1920"
            alt="Beautiful outdoor patio with garden"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <Reveal>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl text-balance">
              Service Areas
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base text-white/80 sm:text-lg text-balance">
              Proudly serving Maple Ridge and communities across the Lower Mainland
              with professional landscaping services.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Areas */}
      <section className="bg-background py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-forest">
              Where We Work
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl text-balance">
              Communities we serve
            </h2>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
              Professional landscaping services helping homeowners and businesses
              maintain beautiful outdoor spaces across the Lower Mainland.
            </p>
          </Reveal>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {serviceAreas.map((area, i) => (
              <Reveal key={area.name} delay={i * 80}>
                <div className="group flex h-full flex-col rounded-2xl border border-border bg-card p-8 shadow-sm transition-all duration-500 hover:shadow-lg hover:-translate-y-1">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest/10 text-forest transition-all duration-500 group-hover:bg-forest group-hover:text-white">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold">{area.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {area.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="bg-muted/30 py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl text-balance">
              Landscaping Maple Ridge BC & the Lower Mainland
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Najm Garden & Maintenance Ltd. provides professional landscaping
                services helping homeowners and businesses maintain beautiful
                outdoor spaces. Based in Maple Ridge, we serve clients throughout
                the Lower Mainland, including Pitt Meadows, Surrey, Coquitlam,
                Burnaby, and Vancouver.
              </p>
              <p>
                Whether you need regular garden maintenance in Maple Ridge, lawn
                care in Pitt Meadows, landscape design in Surrey, or seasonal
                cleanup in Coquitlam, our team delivers reliable, high-quality
                service tailored to the unique needs of your property and the
                local climate.
              </p>
              <p>
                We understand the specific growing conditions of the Lower Mainland
                — from soil types to rainfall patterns — and select plants and
                maintenance strategies that thrive in this environment. Our local
                expertise means your garden stays healthy and beautiful
                year-round.
              </p>
              <p>
                Contact us today to schedule a free consultation and discover why
                homeowners and businesses across the Lower Mainland trust Najm
                Garden & Maintenance Ltd. with their outdoor spaces.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-forest py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <Reveal>
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl text-balance">
              In your area? Let&apos;s talk.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-white/80">
              If you&apos;re in the Lower Mainland, we&apos;d love to help with your
              next landscaping project.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-8 rounded-full bg-white px-8 text-forest hover:bg-white/90"
            >
              <Link href="/quote">
                Get Free Estimate
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
