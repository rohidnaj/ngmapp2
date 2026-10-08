'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { GalleryItem } from '@/lib/site-data';

export function GalleryCard({
  data,
  className,
}: {
  data: GalleryItem;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md',
        className
      )}
    >
      <div
        className={cn(
          'relative w-full',
          data.span ? 'aspect-[4/5] sm:aspect-[3/4]' : 'aspect-square'
        )}
      >
        <Image
          src={data.src}
          alt={data.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />
        
        <div className="absolute top-3 right-3">
          <span className="rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white/90 backdrop-blur-md border border-white/10">
            Service Illustration
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5">
          <span className="inline-block rounded-full bg-forest/90 px-3 py-1 text-xs font-semibold text-white shadow-sm">
            {data.serviceCategory}
          </span>
          <p className="mt-2 text-sm font-medium text-white line-clamp-2">
            {data.label}
          </p>
        </div>
      </div>
    </div>
  );
}
