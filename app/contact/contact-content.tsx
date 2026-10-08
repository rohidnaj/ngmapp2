'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Phone, Mail, MapPin, Clock, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Reveal } from '@/components/site/reveal';
import { supabase } from '@/lib/supabase-client';

const contactInfo = [
  {
    icon: Phone,
    label: 'Phone',
    value: '778-233-1599',
    href: 'tel:7782331599',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'info@ngmlandscape.ca',
    href: 'mailto:info@ngmlandscape.ca',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Maple Ridge, BC',
  },
  {
    icon: Clock,
    label: 'Hours',
    value: 'Mon – Sat: 7:00 AM – 6:00 PM',
  },
];

const serviceOptions = [
  'Lawn mowing, weeding and edging',
  'Hedge and shrub trimming',
  'Planting flowers, trees and shrubs',
  'Garden bed mulching',
  'Fertilizer and weed control',
  'Spring cleanup',
  'Fall cleanup',
  'Garden design and consultation',
  'Power washing decks and patios',
  'Drip irrigation for gardens',
  'Other',
];

export function ContactContent() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [service, setService] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          address,
          property_type: 'Residential',
          services: service ? [service] : [],
          message,
          website, // honeypot
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setStatus('success');
      setName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setService('');
      setMessage('');
      setWebsite('');
    } catch (err) {
      console.error('Contact form submission error:', err);
      setStatus('error');
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[40vh] items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <Image
            src="https://images.pexels.com/photos/4869084/pexels-photo-4869084.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Residential landscape and garden care in Maple Ridge BC"
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
              Get in Touch
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base text-white/80 sm:text-lg text-balance">
              We&apos;d love to hear about your project. Reach out for a free
              estimate and consultation.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-background py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Info */}
            <Reveal>
              <span className="text-sm font-semibold uppercase tracking-widest text-forest">
                Contact Information
              </span>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl text-balance">
                Najm Garden & Maintenance Ltd.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Ready to transform your outdoor space? Call us directly or send a
                message and we&apos;ll get back to you within 24 hours.
              </p>

              <div className="mt-10 space-y-6">
                {contactInfo.map((info) => (
                  <div key={info.label} className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-forest/10 text-forest">
                      <info.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {info.label}
                      </p>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="text-base font-semibold text-foreground transition-colors hover:text-forest"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-base font-semibold text-foreground">
                          {info.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full bg-forest text-white hover:bg-forest-light"
                >
                  <a href="tel:7782331599">
                    <Phone className="mr-2 h-4 w-4" />
                    Call Now
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full border-forest/30 text-forest hover:bg-forest hover:text-white"
                >
                  <a href="/quote">Request Free Quote</a>
                </Button>
              </div>
            </Reveal>

            {/* Contact Form */}
            <Reveal delay={200}>
              {status === 'success' ? (
                <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-border bg-card p-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-forest/10">
                    <CheckCircle2 className="h-8 w-8 text-forest" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold">Message Sent!</h3>
                  <p className="mt-2 max-w-md text-sm text-muted-foreground">
                    Thank you for reaching out. We have saved your request and sent
                    a confirmation email. We will contact you within 24 hours.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-6 rounded-full"
                    onClick={() => setStatus('idle')}
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
                >
                  {status === 'error' && (
                    <div className="mb-6 flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                      <AlertCircle className="h-5 w-5 shrink-0" />
                      Something went wrong. Please call us at 778-233-1599.
                    </div>
                  )}

                  {/* Honeypot Spam Protection Field */}
                  <div className="hidden" aria-hidden="true">
                    <input
                      type="text"
                      name="website"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="c-name">
                        Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="c-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="c-email">
                        Email <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="c-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="you@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="c-phone">Phone</Label>
                      <Input
                        id="c-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(778) 233-1599"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="c-address">Address</Label>
                      <Input
                        id="c-address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Your property address"
                      />
                    </div>
                  </div>

                  <div className="mt-5 space-y-2">
                    <Label htmlFor="c-service">Service Needed</Label>
                    <select
                      id="c-service"
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">Select a service...</option>
                      {serviceOptions.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-5 space-y-2">
                    <Label htmlFor="c-message">Message</Label>
                    <Textarea
                      id="c-message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your project..."
                      rows={4}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={status === 'loading'}
                    className="mt-6 w-full rounded-full bg-forest text-white hover:bg-forest-light"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Request Free Quote'
                    )}
                  </Button>
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
