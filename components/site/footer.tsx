import Link from 'next/link';
import { Leaf, Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react';

const serviceLinks = [
  { href: '/services#lawn-care', label: 'Lawn Care' },
  { href: '/services#garden-maintenance', label: 'Garden Maintenance' },
  { href: '/services#landscape-design', label: 'Landscape Design' },
  { href: '/services#seasonal-cleanup', label: 'Seasonal Cleanup' },
  { href: '/services#outdoor-services', label: 'Outdoor Services' },
];

const companyLinks = [
  { href: '/about', label: 'About Us' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/service-areas', label: 'Service Areas' },
  { href: '/contact', label: 'Contact' },
  { href: '/quote', label: 'Get a Quote' },
];

export function Footer() {
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
                Najm Garden & Maintenance Ltd.
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Professional landscaping and garden maintenance in Maple Ridge and
              the Lower Mainland. Transforming outdoor spaces with care and
              precision.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-background text-foreground/60 transition-colors hover:bg-forest hover:text-white"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-background text-foreground/60 transition-colors hover:bg-forest hover:text-white"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Services
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
              Company
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
                  href="tel:7782331599"
                  className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-forest"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  778-233-1599
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@ngmlandscape.ca"
                  className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-forest"
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  info@ngmlandscape.ca
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" />
                Maple Ridge, BC
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Najm Garden & Maintenance Ltd. All
            rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Serving Maple Ridge, Pitt Meadows, Surrey, Coquitlam, Burnaby,
            Vancouver & the Lower Mainland
          </p>
        </div>
      </div>
    </footer>
  );
}
