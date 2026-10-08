import Link from 'next/link';
import { Leaf, Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react';
import { siteConfig } from '@/lib/site-data';

const serviceLinks = [
  { href: '/services#lawn-mowing-weeding-edging', label: 'Lawn Mowing & Edging' },
  { href: '/services#hedge-shrub-trimming', label: 'Hedge & Shrub Trimming' },
  { href: '/services#planting', label: 'Planting Flowers, Trees & Shrubs' },
  { href: '/services#garden-bed-mulching', label: 'Garden Bed Mulching' },
  { href: '/services/drip-irrigation', label: 'Drip Irrigation Installation' },
  { href: '/services#seasonal-cleanups', label: 'Spring & Fall Cleanups' },
  { href: '/services#power-washing', label: 'Power Washing Decks & Patios' },
  { href: '/services#garden-design-consultation', label: 'Garden Design & Consultation' },
];

const companyLinks = [
  { href: '/about', label: 'About Us' },
  { href: '/services', label: 'All Services' },
  { href: '/services/drip-irrigation', label: 'Drip Irrigation (Dedicated)' },
  { href: '/gallery', label: 'Services Visual Guide' },
  { href: '/service-areas', label: 'Service Areas' },
  { href: '/contact', label: 'Contact' },
  { href: '/quote', label: 'Request an Estimate' },
];

export function Footer() {
  const hasInstagram = Boolean(siteConfig.social.instagram);
  const hasFacebook = Boolean(siteConfig.social.facebook);

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-forest text-white">
                <Leaf className="h-5 w-5" />
              </div>
              <span className="text-base font-semibold">
                {siteConfig.name}
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Professional, trustworthy landscaping and garden maintenance based in
              Maple Ridge, BC. Caring for lawns, garden beds, and irrigation across
              the Lower Mainland and Fraser Valley.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {hasInstagram ? (
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-background text-foreground/60 transition-colors hover:bg-forest hover:text-white"
                  aria-label="Visit NGM Landscape on Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              ) : (
                <span
                  title="Official Instagram profile link pending confirmation from owner"
                  className="flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-full bg-background/50 text-foreground/30 transition-colors"
                  aria-label="Instagram profile link pending confirmation"
                >
                  <Instagram className="h-4 w-4" />
                </span>
              )}

              {hasFacebook ? (
                <a
                  href={siteConfig.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-background text-foreground/60 transition-colors hover:bg-forest hover:text-white"
                  aria-label="Visit NGM Landscape on Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              ) : (
                <span
                  title="Official Facebook page link pending confirmation from owner"
                  className="flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-full bg-background/50 text-foreground/30 transition-colors"
                  aria-label="Facebook page link pending confirmation"
                >
                  <Facebook className="h-4 w-4" />
                </span>
              )}
            </div>
            {!hasInstagram && !hasFacebook && (
              <p className="mt-2 text-[11px] text-muted-foreground/70">
                Official social profile links will be connected upon verification.
              </p>
            )}
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Core Services
            </h3>
            <ul className="mt-4 space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-forest"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Company &amp; Service Areas
            </h3>
            <ul className="mt-4 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-forest"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Get in Touch
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a
                  href={`tel:${siteConfig.phone.replace(/[^0-9]/g, '')}`}
                  className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-forest"
                  aria-label={`Call NGM Landscape at ${siteConfig.phone}`}
                >
                  <Phone className="h-4 w-4 shrink-0 text-forest" />
                  {siteConfig.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-forest"
                  aria-label={`Email NGM Landscape at ${siteConfig.email}`}
                >
                  <Mail className="h-4 w-4 shrink-0 text-forest" />
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0 text-forest" />
                Maple Ridge, BC (Serving Lower Mainland &amp; Fraser Valley)
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Najm Garden &amp; Maintenance Ltd. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground text-center sm:text-right">
            Serving Maple Ridge, Pitt Meadows, Mission, Langley, Coquitlam, Port Coquitlam, Surrey, Burnaby &amp; the Lower Mainland / Fraser Valley
          </p>
        </div>
      </div>
    </footer>
  );
}
