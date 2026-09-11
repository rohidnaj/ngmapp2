'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
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
  'Outdoor Lighting',
  'Lawn Care',
  'Planting',
  'Cleanups',
  'Outdoor Improvements',
];

export function GalleryContent() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered =
    activeCategory === 'All'
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeCategory);

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <Image
            src="https://images.pexels.com/photos/8143671/pexels-photo-8143671.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Luxury landscaped garden"
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
              Our Gallery
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base text-white/80 sm:text-lg text-balance">
              A showcase of our landscaping projects and outdoor transformations
              across Maple Ridge and the Lower Mainland.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Masonry Gallery */}
      <section className="bg-muted/30 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-forest">
              Project Portfolio
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl text-balance">
              Browse our work
            </h2>
          </Reveal>

          {/* Category Filter */}
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'rounded-full border px-5 py-2 text-sm font-medium transition-all',
                  activeCategory === cat
                    ? 'border-forest bg-forest text-white'
                    : 'border-border text-muted-foreground hover:border-forest/40 hover:text-foreground'
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
            {filtered.map((img, i) => (
              <Reveal key={img.src} delay={i * 60}>
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
              Want results like these?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-white/80">
              Let&apos;s create something beautiful together. Request your free
              estimate today.
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
