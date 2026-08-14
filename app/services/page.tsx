import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Check, ArrowRight, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/site/reveal';

export const metadata: Metadata = {
  title: 'Services | Landscaping & Garden Maintenance Maple Ridge BC',
  description:
    'Professional landscaping services in Maple Ridge BC: lawn care, garden maintenance, landscape design, seasonal cleanup, irrigation systems, power washing, and more.',
};

const detailedServices = [
  {
    id: 'lawn-care',
    title: 'Lawn Care',
    description:
      'Keep your lawn healthy, green, and perfectly manicured with our comprehensive lawn care services. We handle everything from regular mowing to weed control.',
    image:
      'https://images.pexels.com/photos/6728925/pexels-photo-6728925.jpeg?auto=compress&cs=tinysrgb&w=1200&fm=webp',
    features: [
      'Lawn mowing with professional-grade equipment',
      'Precise edging along walkways and garden beds',
      'Weeding of lawn perimeters and cracks',
      'Targeted weed control treatments',
      'General yard and lawn maintenance',
    ],
  },
  {
    id: 'garden-maintenance',
    title: 'Garden Maintenance',
    description:
      'Complete garden care to keep your beds looking their best. We monitor plant health, remove weeds, and maintain a neat appearance year-round.',
    image:
      'https://images.pexels.com/photos/38936347/pexels-photo-38936347.jpeg?auto=compress&cs=tinysrgb&w=1200&fm=webp',
    features: [
      'Thorough garden bed cleanup',
      'Targeted weeding of flower beds and soil areas',
      'Routine bed maintenance and soil cultivation',
      'Expert plant care and health monitoring',
      'Fresh mulching for insulation and protection',
    ],
  },
  {
    id: 'hedge-shrub-trimming',
    title: 'Hedge & Shrub Trimming',
    description:
      'Precise trimming and shaping of hedges, shrubs, and bushes to maintain clean, beautiful structure for your property.',
    image:
      'https://images.pexels.com/photos/38936334/pexels-photo-38936334.jpeg?auto=compress&cs=tinysrgb&w=1200&fm=webp',
    features: [
      'Hedge trimming and leveling',
      'Shrub shaping and pruning',
      'Removal of dead wood and stray branches',
      'Complete cleanup and disposal of trimmings',
      'General shaping and aesthetic maintenance',
    ],
  },
  {
    id: 'planting',
    title: 'Planting',
    description:
      'Expert planting of annuals, perennials, shrubs, and trees to add vibrant colour, structure, and value to your landscape.',
    image:
      'https://images.pexels.com/photos/7728050/pexels-photo-7728050.jpeg?auto=compress&cs=tinysrgb&w=1200&fm=webp',
    features: [
      'Seasonal flower planting',
      'Shrub and bush installation',
      'Tree planting and anchoring',
      'Soil preparation and root booster application',
      'Proper spacing and depth configuration',
    ],
  },
  {
    id: 'mulching-fertilizing',
    title: 'Mulching & Fertilizing',
    description:
      'Nourish your soil and plants while suppressing weed growth. We apply premium mulch and seasonal fertilizers for optimal growth.',
    image:
      'https://images.pexels.com/photos/5807154/pexels-photo-5807154.jpeg?auto=compress&cs=tinysrgb&w=1200&fm=webp',
    features: [
      'Premium dark or bark mulching',
      'Garden bed mulch replenishment',
      'Customized fertilizer application programs',
      'Soil nourishment treatments',
      'Weed growth suppression strategies',
    ],
  },
  {
    id: 'seasonal-cleanup',
    title: 'Seasonal Cleanup',
    description:
      'Prepare your yard for changing weather. We clear leaves, branches, and debris in the spring and fall to keep your landscape healthy.',
    image:
      'https://images.pexels.com/photos/16442678/pexels-photo-16442678.jpeg?auto=compress&cs=tinysrgb&w=1200&fm=webp',
    features: [
      'Comprehensive spring cleanup and leaf blowing',
      'Fall yard cleanup and garden winterization',
      'Leaf rake, removal, and eco-friendly composting',
      'Debris clearing and lawn aerating prep',
      'General seasonal yard maintenance',
    ],
  },
  {
    id: 'garden-design',
    title: 'Garden Design',
    description:
      'Professional design consultations and custom concepts to turn your yard into a beautiful, harmonious outdoor living space.',
    image:
      'https://images.pexels.com/photos/32959283/pexels-photo-32959283.jpeg?auto=compress&cs=tinysrgb&w=1200&fm=webp',
    features: [
      'On-site design consultations',
      'Harmonious plant layout concepts',
      'Material and color coordination',
      'Functional space planning',
      'Step-by-step planting schedules',
    ],
  },
  {
    id: 'drip-irrigation',
    title: 'Drip Irrigation',
    description:
      'Keep your garden beds watered automatically and efficiently, conserving water while keeping plants hydrated.',
    image:
      'https://images.pexels.com/photos/450064/pexels-photo-450064.jpeg?auto=compress&cs=tinysrgb&w=1200&fm=webp',
    features: [
      'Custom drip irrigation system design',
      'Professional installation of drip emitters and tubing',
      'Water conservation settings',
      'System testing and configuration',
    ],
  },
  {
    id: 'power-washing',
    title: 'Power Washing',
    description:
      'Restore dirty, stained surfaces back to their original state. We blast away grime, moss, and dirt from patios, walkways, and driveways.',
    image:
      'https://images.pexels.com/photos/4876678/pexels-photo-4876678.jpeg?auto=compress&cs=tinysrgb&w=1200&fm=webp',
    features: [
      'Driveway power washing and cleaning',
      'Sidewalk and walkway restoration',
      'Patio and deck cleaning',
      'Moss, algae, and grime removal',
      'Surface pre-treatment and post-rinsing',
    ],
  },
  {
    id: 'outdoor-lighting',
    title: 'Outdoor Lighting Design',
    description:
      'Highlight the features of your landscape and improve property safety at night with custom lighting design.',
    image:
      'https://images.pexels.com/photos/8143684/pexels-photo-8143684.jpeg?auto=compress&cs=tinysrgb&w=1200&fm=webp',
    features: [
      'Landscape accent lighting concepts',
      'Walkway and path illumination design',
      'Energy-efficient LED layouts',
      'Nighttime safety and security enhancement',
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <Image
            src="https://images.pexels.com/photos/8143684/pexels-photo-8143684.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Landscaped outdoor patio"
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
              Our Services
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base text-white/80 sm:text-lg text-balance">
              Professional landscaping and garden maintenance services tailored
              to your property&apos;s needs.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Detailed Services */}
      {detailedServices.map((service, idx) => (
        <section
          key={service.id}
          id={service.id}
          className={`scroll-mt-24 py-20 sm:py-28 ${
            idx % 2 === 0 ? 'bg-background' : 'bg-muted/30'
          }`}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div
              className={`grid gap-12 lg:grid-cols-2 lg:items-center ${
                idx % 2 === 1 ? 'lg:grid-flow-dense' : ''
              }`}
            >
              <Reveal
                className={idx % 2 === 1 ? 'lg:col-start-2' : ''}
              >
                <span className="text-sm font-semibold uppercase tracking-widest text-forest">
                  Service {String(idx + 1).padStart(2, '0')}
                </span>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl text-balance">
                  {service.title}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
                <ul className="mt-6 space-y-3">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-forest/10">
                        <Check className="h-3 w-3 text-forest" />
                      </div>
                      <span className="text-sm text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className="mt-8 rounded-full bg-forest text-white hover:bg-forest-light"
                >
                  <Link href="/quote">
                    Get a Quote
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </Reveal>
              <Reveal
                delay={200}
                className={idx % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="bg-forest py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <Reveal>
            <Leaf className="mx-auto h-10 w-10 text-white/60" />
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl text-balance">
              Ready to get started?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-white/80">
              Request a free estimate and let&apos;s discuss how we can transform
              your outdoor space.
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
