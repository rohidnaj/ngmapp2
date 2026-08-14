'use client';

import { useEffect, useState } from 'react';
import { Phone, MessageCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FloatingButtons() {
  const [show, setShow] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={cn(
        'fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 transition-all duration-500',
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-8 opacity-0'
      )}
    >
      {expanded && (
        <div className="flex flex-col gap-2">
          <a
            href="https://wa.me/17782331599"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-full bg-[#25D366] px-5 py-3 text-sm font-medium text-white shadow-lg transition-all hover:scale-105 animate-slide-in-right"
          >
            <MessageCircle className="h-5 w-5" />
            WhatsApp
          </a>
          <a
            href="tel:7782331599"
            className="flex items-center gap-3 rounded-full bg-forest px-5 py-3 text-sm font-medium text-white shadow-lg transition-all hover:scale-105 animate-slide-in-right"
          >
            <Phone className="h-5 w-5" />
            Call Now
          </a>
        </div>
      )}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-forest text-white shadow-xl transition-all hover:scale-110 hover:bg-forest-light"
        aria-label="Contact options"
      >
        {expanded ? <X className="h-6 w-6" /> : <Phone className="h-6 w-6" />}
      </button>
    </div>
  );
}
