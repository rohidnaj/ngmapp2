'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/site/reveal';
import { GalleryCard } from '@/components/site/gallery-card';
import { galleryImages } from '@/lib/site-data';
import { cn } from '@/lib/utils';

const categories = [
  'All',
  'Garden Design',
  'Drip Irrigation',
  'Power Washing',
  'Lawn Care',
  'Planting',
  'Hedge Trimming',
  'Mulching',
  'Seasonal Cleanups',
  'Fertilizing',
];

export function GalleryContent() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered =
    activeCategory === 'All'
      ? galleryImages
      : galleryImages.filter((img) => img.serviceCategory === activeCategory);

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[48vh] items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <Image
            src="https://images.pexels.com/photos/8143671/pexels-photo-8143671.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Neat and healthy garden bed landscape"
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
              Visual Service Guide
            </span>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl text-balance">
              Services Visual Gallery
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base text-white/90 sm:text-lg text-balance">
              Explore visual illustrations of our core landscaping, lawn care,
              planting, mulching, drip irrigation, and surface washing services.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Honesty & Transparency Notice */}
      <section className="border-b border-border bg-muted/40 py-6">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3 rounded-xl border border-forest/20 bg-forest/5 p-4 text-sm text-foreground/80">
            <Info className="h-5 w-5 text-forest shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">
                Service Illustrations &amp; Real Project Documentation
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                The photographs displayed in this section serve as visual examples
                demonstrating the types of landscape maintenance and garden care
                we deliver. We believe in complete transparency and do not present
                stock photography as completed client case studies. Verified before-and-after
                photos of local Maple Ridge and Lower Mainland jobs will be added
                as seasonal projects are completed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'rounded-full border px-4 py-2 text-xs sm:text-sm font-medium transition-all',
                  activeCategory === cat
                    ? 'border-forest bg-forest text-white shadow-sm'
                    : 'border-border text-muted-foreground hover:border-forest/40 hover:text-foreground'
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
            {filtered.map((img, i) => (
              <Reveal key={img.src} delay={i * 50}>
                <GalleryCard data={img} />
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
              Ready to Discuss Your Property?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-white/90">
              Let&apos;s talk about your yard maintenance, planting, or irrigation
              needs. Request an estimate today.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-8 rounded-full bg-white px-8 text-forest hover:bg-white/90 font-semibold"
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
