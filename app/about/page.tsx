import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Target, Heart, Award, Leaf, ArrowRight, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/site/reveal';

export const metadata: Metadata = {
  title: 'About Us | Najm Garden & Maintenance Ltd.',
  description:
    'Najm Garden & Maintenance Ltd. is a local landscaping company in Maple Ridge, BC owned by Najmudin Najm, dedicated to creating beautiful, healthy, and well-maintained outdoor spaces.',
};

const values = [
  {
    icon: Award,
    title: 'Quality Workmanship',
    description:
      'We take pride in our work. Every project — large or small — receives the same attention to quality and finish.',
  },
  {
    icon: Eye,
    title: 'Attention to Detail',
    description:
      'From precise edging to careful plant selection, the details are what make an outdoor space truly stand out.',
  },
  {
    icon: Heart,
    title: 'Respect for Your Property',
    description:
      'We treat your home and garden with care, leaving your property clean and tidy after every visit.',
  },
  {
    icon: Target,
    title: 'Reliable Communication',
    description:
      'We keep you informed from the first call to the final walkthrough. No surprises, no missed appointments.',
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <Image
            src="https://images.pexels.com/photos/37989319/pexels-photo-37989319.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Beautiful garden with modern house in Maple Ridge BC"
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
              About Najm Garden & Maintenance Ltd.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base text-white/80 sm:text-lg text-balance">
              A local landscaping and garden maintenance company serving Maple
              Ridge and surrounding Lower Mainland communities.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Company Story */}
      <section className="bg-background py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <span className="text-sm font-semibold uppercase tracking-widest text-forest">
                Our Story
              </span>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl text-balance">
                A local company you can rely on
              </h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
                <p>
                  Najm Garden & Maintenance Ltd. is a local landscaping and
                  garden maintenance company based in Maple Ridge, British
                  Columbia. We provide reliable landscaping solutions for
                  residential and commercial properties throughout Maple Ridge
                  and surrounding Lower Mainland communities.
                </p>
                <p>
                  Owned and operated by Najmudin Najm, the company is built on a
                  commitment to quality workmanship, attention to detail, and
                  genuine care for every property we maintain. We believe that a
                  well-maintained outdoor space doesn&apos;t just look good — it
                  enhances your enjoyment of your home and the value of your
                  property.
                </p>
                <p>
                  Whether you need regular lawn maintenance, seasonal cleanup,
                  garden design, or a complete outdoor improvement project, our
                  team brings the same level of dedication and professionalism
                  to every job.
                </p>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg">
                <Image
                  src="https://images.pexels.com/photos/8583822/pexels-photo-8583822.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Landscaped property by Najm Garden & Maintenance Ltd."
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
      <section className="bg-muted/30 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-forest">
              What We Stand For
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl text-balance">
              Our values
            </h2>
          </Reveal>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, i) => (
              <Reveal key={value.title} delay={i * 80}>
                <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-8 shadow-sm">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-forest/10 text-forest">
                    <value.icon className="h-7 w-7" />
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

      {/* Owner */}
      <section className="bg-background py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-forest">
              Meet The Owner
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl text-balance">
              Najmudin Najm
            </h2>
          </Reveal>

          <div className="mt-16 flex justify-center">
            <Reveal>
              <div className="flex max-w-2xl flex-col items-center rounded-3xl border border-border bg-card p-10 shadow-sm text-center sm:p-12">
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-forest text-white">
                  <Leaf className="h-12 w-12" />
                </div>
                <h3 className="mt-6 text-2xl font-semibold">Najmudin Najm</h3>
                <p className="text-sm font-medium text-forest">Founder & Owner</p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  As the owner of Najm Garden & Maintenance Ltd., Najmudin brings
                  a hands-on approach to every project. His commitment to quality
                  workmanship, reliable communication, and respect for
                  customers&apos; properties is at the heart of everything the
                  company does. When you work with us, you&apos;re working
                  directly with a local business owner who cares about the
                  results.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal className="mt-16 text-center">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-forest text-white hover:bg-forest-light"
            >
              <Link href="/quote">
                Get a Free Quote
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
