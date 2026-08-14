'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ServiceCardData {
  title: string;
  shortDescription?: string;
  description?: string;
  image: string;
  href: string;
  features?: string[];
}

export function ServiceCard({
  data,
  className,
}: {
  data: ServiceCardData;
  className?: string;
}) {
  return (
    <Link
      href={data.href}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1',
        className
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={data.image}
          alt={data.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-semibold tracking-tight">{data.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {data.shortDescription || data.description}
        </p>
        {data.features && (
          <ul className="mt-4 space-y-1.5">
            {data.features.slice(0, 4).map((f) => (
              <li
                key={f}
                className="flex items-center gap-2 text-xs text-muted-foreground"
              >
                <span className="h-1 w-1 rounded-full bg-forest" />
                {f}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex items-center gap-1 text-sm font-medium text-forest">
          Learn more
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
