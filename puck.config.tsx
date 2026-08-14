import type { Config } from "@puckeditor/core";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Eye, Sparkles, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/site/service-card";
import { services, galleryImages, serviceAreas } from "@/lib/site-data";

const whyChooseUsDefault = [
  {
    icon: ShieldCheck,
    title: "Reliable Service",
    description:
      "We show up on time, every time. Consistent scheduling and dependable service you can count on.",
  },
  {
    icon: Eye,
    title: "Attention To Detail",
    description:
      "Every blade of grass, every hedge, every flower bed — we treat your property with meticulous care.",
  },
  {
    icon: Sparkles,
    title: "Professional Workmanship",
    description:
      "Professional tools, proven techniques, and a commitment to quality in every project we complete.",
  },
  {
    icon: MapPin,
    title: "Local Service",
    description:
      "Based in Maple Ridge, we understand the local climate, soil, and plants that thrive in the Lower Mainland.",
  },
  {
    icon: Phone,
    title: "Clear Communication",
    description:
      "We keep you informed every step of the way, from the first call to the final walkthrough.",
  },
  {
    icon: ShieldCheck,
    title: "Complete Outdoor Maintenance",
    description:
      "From lawn care to garden design, we handle all your outdoor maintenance needs in one place.",
  },
];

export type ComponentProps = {
  Hero: {
    badgeText: string;
    title: string;
    description: string;
    bgImage: string;
    ctaText: string;
    ctaHref: string;
    phoneText: string;
  };
  WhyChooseUs: {
    badgeText: string;
    title: string;
    description: string;
  };
  ServicesGrid: {
    badgeText: string;
    title: string;
    limit: number;
  };
  GalleryGrid: {
    badgeText: string;
    title: string;
    description: string;
    limit: number;
  };
  ServiceAreas: {
    badgeText: string;
    title: string;
    description: string;
  };
  CallToAction: {
    title: string;
    description: string;
    ctaText: string;
    ctaHref: string;
    phoneText: string;
  };
  TextBlock: {
    title: string;
    body: string;
    theme: "light" | "dark" | "forest";
  };
};

export const config: Config<ComponentProps> = {
  root: {
    ai: {
      instructions:
        "Najm Garden & Maintenance Ltd. provides professional landscaping, lawn care, garden maintenance, hedge trimming, and outdoor improvements in Maple Ridge, BC and the Lower Mainland.",
    },
  },
  components: {
    Hero: {
      ai: {
        instructions: "Always placed at the top of a page. Should feature strong title and call to action for free quotes.",
      },
      fields: {
        badgeText: { type: "text" },
        title: { type: "text" },
        description: { type: "textarea" },
        bgImage: { type: "text" },
        ctaText: { type: "text" },
        ctaHref: { type: "text" },
        phoneText: { type: "text" },
      },
      defaultProps: {
        badgeText: "Serving Maple Ridge & the Lower Mainland",
        title: "Beautiful Outdoor Spaces. Expertly Maintained.",
        description:
          "Professional landscaping, lawn care, garden maintenance, and outdoor improvements throughout Maple Ridge and the Lower Mainland.",
        bgImage:
          "https://images.pexels.com/photos/8082322/pexels-photo-8082322.jpeg?auto=compress&cs=tinysrgb&w=1920",
        ctaText: "Get a Free Quote",
        ctaHref: "/quote",
        phoneText: "778-233-1599",
      },
      render: ({ badgeText, title, description, bgImage, ctaText, ctaHref, phoneText }) => (
        <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-zinc-900 text-white">
          <div className="absolute inset-0">
            <Image
              src={bgImage}
              alt="Landscaped garden background"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
          </div>

          <div className="relative z-10 mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                {badgeText}
              </span>
            </div>
            <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              {title}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-white/80 sm:text-lg md:text-xl">
              {description}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-emerald-700 px-8 text-white hover:bg-emerald-800"
              >
                <Link href={ctaHref}>
                  {ctaText}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-white/30 bg-white/10 px-8 text-white backdrop-blur-md hover:bg-white/20"
              >
                <Link href="/services">Explore Our Services</Link>
              </Button>
            </div>
            {phoneText && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <a
                  href={`tel:${phoneText.replace(/\D/g, "")}`}
                  className="flex items-center gap-2 text-sm font-medium text-white/90 transition-colors hover:text-white"
                >
                  <Phone className="h-4 w-4" />
                  {phoneText}
                </a>
              </div>
            )}
          </div>
        </section>
      ),
    },

    WhyChooseUs: {
      ai: {
        instructions: "Highlights company key differentiators such as reliability, local service, and clear communication.",
      },
      fields: {
        badgeText: { type: "text" },
        title: { type: "text" },
        description: { type: "textarea" },
      },
      defaultProps: {
        badgeText: "Why Najm",
        title: "The Najm Garden difference",
        description:
          "We take pride in delivering dependable, high-quality landscaping services across Maple Ridge and the Lower Mainland.",
      },
      render: ({ badgeText, title, description }) => (
        <section className="bg-background py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-semibold uppercase tracking-widest text-emerald-700">
                {badgeText}
              </span>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl text-balance">
                {title}
              </h2>
              <p className="mt-4 text-base text-muted-foreground sm:text-lg">
                {description}
              </p>
            </div>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {whyChooseUsDefault.map((item) => (
                <div
                  key={item.title}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-card p-8 shadow-sm transition-all duration-500 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-700/10 text-emerald-700 transition-all duration-500 group-hover:bg-emerald-700 group-hover:text-white">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ),
    },

    ServicesGrid: {
      ai: {
        instructions: "Displays grid of landscaping and garden care services.",
      },
      fields: {
        badgeText: { type: "text" },
        title: { type: "text" },
        limit: { type: "number" },
      },
      defaultProps: {
        badgeText: "Our Services",
        title: "Everything your garden needs",
        limit: 8,
      },
      render: ({ badgeText, title, limit }) => (
        <section className="bg-muted/30 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div className="max-w-2xl">
                <span className="text-sm font-semibold uppercase tracking-widest text-emerald-700">
                  {badgeText}
                </span>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl text-balance">
                  {title}
                </h2>
              </div>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-emerald-700/30 text-emerald-700 hover:bg-emerald-700 hover:text-white"
              >
                <Link href="/services">
                  View All Services
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {services.slice(0, limit || 8).map((service) => (
                <ServiceCard key={service.id} data={service} />
              ))}
            </div>
          </div>
        </section>
      ),
    },

    GalleryGrid: {
      ai: {
        instructions: "Displays photo gallery of completed landscaping and garden projects.",
      },
      fields: {
        badgeText: { type: "text" },
        title: { type: "text" },
        description: { type: "textarea" },
        limit: { type: "number" },
      },
      defaultProps: {
        badgeText: "Featured Work",
        title: "See the transformation",
        description: "A selection of our landscaping and garden maintenance projects.",
        limit: 6,
      },
      render: ({ badgeText, title, description, limit }) => (
        <section className="bg-background py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-semibold uppercase tracking-widest text-emerald-700">
                {badgeText}
              </span>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl text-balance">
                {title}
              </h2>
              <p className="mt-4 text-base text-muted-foreground sm:text-lg">
                {description}
              </p>
            </div>

            <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {galleryImages.slice(0, limit || 6).map((img) => (
                <div key={img.src} className="group relative overflow-hidden rounded-2xl border border-border shadow-sm">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    <div className="absolute bottom-0 left-0 p-5 translate-y-3 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                      <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                        {img.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Button
                asChild
                variant="outline"
                className="rounded-full border-emerald-700/30 text-emerald-700 hover:bg-emerald-700 hover:text-white"
              >
                <Link href="/gallery">
                  View Full Gallery
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      ),
    },

    ServiceAreas: {
      ai: {
        instructions: "Lists target service cities: Maple Ridge, Pitt Meadows, Coquitlam, Port Coquitlam, Burnaby, Surrey, Vancouver, Richmond.",
      },
      fields: {
        badgeText: { type: "text" },
        title: { type: "text" },
        description: { type: "textarea" },
      },
      defaultProps: {
        badgeText: "Service Area",
        title: "Serving Maple Ridge & surrounding communities",
        description:
          "Based in Maple Ridge, BC, we proudly serve homeowners and properties throughout the Lower Mainland.",
      },
      render: ({ badgeText, title, description }) => (
        <section className="bg-muted/30 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-semibold uppercase tracking-widest text-emerald-700">
                {badgeText}
              </span>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl text-balance">
                {title}
              </h2>
              <p className="mt-4 text-base text-muted-foreground sm:text-lg">
                {description}
              </p>
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-3">
              {serviceAreas.map((area) => (
                <div
                  key={area.name}
                  className="flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium shadow-sm"
                >
                  <MapPin className="h-4 w-4 text-emerald-700" />
                  {area.name}
                </div>
              ))}
            </div>
          </div>
        </section>
      ),
    },

    CallToAction: {
      ai: {
        instructions: "Call to action banner to get a free quote or call sales.",
      },
      fields: {
        title: { type: "text" },
        description: { type: "textarea" },
        ctaText: { type: "text" },
        ctaHref: { type: "text" },
        phoneText: { type: "text" },
      },
      defaultProps: {
        title: "Ready to improve your outdoor space?",
        description:
          "Request a free quote and let's discuss how we can bring your outdoor space to life.",
        ctaText: "Request a Free Quote",
        ctaHref: "/quote",
        phoneText: "778-233-1599",
      },
      render: ({ title, description, ctaText, ctaHref, phoneText }) => (
        <section className="relative overflow-hidden bg-emerald-900 py-20 text-white sm:py-28">
          <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl text-balance">
              {title}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-white/80 sm:text-lg">
              {description}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-white px-8 text-emerald-900 hover:bg-white/90"
              >
                <Link href={ctaHref}>
                  {ctaText}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              {phoneText && (
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/30 bg-transparent px-8 text-white hover:bg-white/10"
                >
                  <a href={`tel:${phoneText.replace(/\D/g, "")}`}>Call {phoneText}</a>
                </Button>
              )}
            </div>
          </div>
        </section>
      ),
    },

    TextBlock: {
      ai: {
        instructions: "A generic section with a heading and body text for additional content.",
      },
      fields: {
        title: { type: "text" },
        body: { type: "textarea" },
        theme: {
          type: "radio",
          options: [
            { label: "Light", value: "light" },
            { label: "Dark", value: "dark" },
            { label: "Forest", value: "forest" },
          ],
        },
      },
      defaultProps: {
        title: "About Our Craftsmanship",
        body: "With years of experience in lawn care and landscape maintenance, Najm Garden & Maintenance Ltd. delivers unmatched quality and customer satisfaction.",
        theme: "light",
      },
      render: ({ title, body, theme }) => {
        const themeStyles = {
          light: "bg-background text-foreground",
          dark: "bg-zinc-900 text-white",
          forest: "bg-emerald-950 text-white",
        };
        return (
          <section className={`py-16 px-4 sm:px-6 lg:px-8 ${themeStyles[theme || "light"]}`}>
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
              <p className="mt-4 text-base leading-relaxed opacity-90 sm:text-lg">{body}</p>
            </div>
          </section>
        );
      },
    },
  },
};
