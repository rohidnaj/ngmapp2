'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface GalleryImageData {
  src: string;
  alt: string;
  category: string;
  span?: boolean;
}

export function GalleryCard({
  data,
  className,
}: {
  data: GalleryImageData;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-border shadow-sm',
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
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
            {data.category}
          </span>
          <p className="mt-2 text-sm font-medium text-white">{data.alt}</p>
        </div>
      </div>
    </div>
  );
}
