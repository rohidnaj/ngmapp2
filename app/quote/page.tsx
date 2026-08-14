import type { Metadata } from 'next';
import Image from 'next/image';
import { QuoteForm } from '@/components/site/quote-form';
import { Reveal } from '@/components/site/reveal';
import { Phone, Camera, Upload } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Request a Quote | Najm Garden & Maintenance Ltd.',
  description:
    'Request a free landscaping estimate from Najm Garden & Maintenance Ltd. Tell us about your property and the services you need. Serving Maple Ridge and the Lower Mainland BC.',
};

export default function QuotePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[40vh] items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <Image
            src="https://images.pexels.com/photos/8134748/pexels-photo-8134748.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Contemporary house with landscaped garden"
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
              Request a Free Estimate
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base text-white/80 sm:text-lg text-balance">
              Tell us about your project and we&apos;ll provide a free, no-obligation
              quote within 24 hours.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Form Section */}
      <section className="bg-background py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-5">
            {/* Sidebar */}
            <div className="lg:col-span-2">
              <Reveal>
                <span className="text-sm font-semibold uppercase tracking-widest text-forest">
                  How It Works
                </span>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl text-balance">
                  Simple steps to a beautiful outdoor space
                </h2>
                <div className="mt-8 space-y-6">
                  {[
                    {
                      step: '01',
                      title: 'Submit Your Request',
                      description:
                        'Fill out the form with your details and the services you need.',
                    },
                    {
                      step: '02',
                      title: 'We Review & Contact You',
                      description:
                        'Our team reviews your request and reaches out within 24 hours to discuss your project.',
                    },
                    {
                      step: '03',
                      title: 'Free On-Site Estimate',
                      description:
                        'We visit your property, assess the work, and provide a detailed, no-obligation quote.',
                    },
                    {
                      step: '04',
                      title: 'We Get to Work',
                      description:
                        'Once approved, we schedule and complete your project to the highest standard.',
                    },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-4">
                      <span className="text-2xl font-bold text-forest/30">
                        {item.step}
                      </span>
                      <div>
                        <h3 className="text-base font-semibold">{item.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 rounded-2xl border border-border bg-muted/30 p-6">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-forest" />
                    <span className="text-sm font-medium">
                      Prefer to call? We&apos;re here to help.
                    </span>
                  </div>
                  <a
                    href="tel:7782331599"
                    className="mt-3 block text-xl font-bold text-forest"
                  >
                    778-233-1599
                  </a>
                </div>

                <div className="mt-6 rounded-2xl border border-dashed border-border p-6 text-center">
                  <Camera className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-3 text-sm font-medium">
                    Have photos of your space?
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    You can share photos with us during your consultation, or
                    mention them in your message below.
                  </p>
                </div>
              </Reveal>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <Reveal delay={200}>
                <QuoteForm />
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
