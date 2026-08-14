import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/about',
    '/services',
    '/gallery',
    '/service-areas',
    '/contact',
    '/quote',
  ];

  return routes.map((route) => ({
    url: `https://ngmlandscape.ca${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.8,
  }));
}
