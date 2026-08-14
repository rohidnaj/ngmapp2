'use client';

import { Star, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TestimonialData {
  name: string;
  location: string;
  rating: number;
  text: string;
  service: string;
}

export function TestimonialCard({
  data,
  className,
}: {
  data: TestimonialData;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                'h-4 w-4',
                i < data.rating
                  ? 'fill-olive text-olive'
                  : 'fill-muted text-muted'
              )}
            />
          ))}
        </div>
        <Quote className="h-6 w-6 text-olive/30" />
      </div>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground/80">
        &ldquo;{data.text}&rdquo;
      </p>
      <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-forest text-sm font-semibold text-white">
          {data.name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-semibold">{data.name}</p>
          <p className="text-xs text-muted-foreground">
            {data.location} · {data.service}
          </p>
        </div>
      </div>
    </div>
  );
}
