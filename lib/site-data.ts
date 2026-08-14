export const siteConfig = {
  name: 'Najm Garden & Maintenance Ltd.',
  phone: '778-233-1599',
  email: 'info@ngmlandscape.ca',
  location: 'Maple Ridge, BC',
  owner: 'Najmudin Najm',
};

export interface ServiceData {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  image: string;
  features: string[];
  href: string;
}

export const services: ServiceData[] = [
  {
    id: 'lawn-care',
    title: 'Lawn Care',
    shortDescription:
      'Professional mowing, edging, weeding, and weed control to keep your lawn healthy and well-maintained.',
    description:
      'Keep your lawn healthy, green, and perfectly manicured with our comprehensive lawn care services. We handle everything from regular mowing to targeted weed control.',
    image:
      'https://images.pexels.com/photos/6728925/pexels-photo-6728925.jpeg?auto=compress&cs=tinysrgb&w=800&fm=webp',
    href: '/services#lawn-care',
    features: [
      'Lawn mowing',
      'Edging along walkways and garden beds',
      'Weeding',
      'Weed control',
      'General lawn maintenance',
    ],
  },
  {
    id: 'garden-maintenance',
    title: 'Garden Maintenance',
    shortDescription:
      'Complete garden care including cleanup, weeding, bed maintenance, plant care, and mulching.',
    description:
      'Complete garden care to keep your outdoor space looking its best throughout every season. From routine cleanup to specialized plant care and mulching.',
    image:
      'https://images.pexels.com/photos/38936347/pexels-photo-38936347.jpeg?auto=compress&cs=tinysrgb&w=800&fm=webp',
    href: '/services#garden-maintenance',
    features: [
      'Garden cleanup',
      'Weeding',
      'Bed maintenance',
      'Plant care',
      'Mulching',
    ],
  },
  {
    id: 'hedge-shrub-trimming',
    title: 'Hedge & Shrub Trimming',
    shortDescription:
      'Precise trimming and shaping of hedges and shrubs to maintain a clean, polished look.',
    description:
      'Precise trimming and shaping of hedges and shrubs to maintain a clean, polished look for your property throughout the growing season.',
    image:
      'https://images.pexels.com/photos/38936334/pexels-photo-38936334.jpeg?auto=compress&cs=tinysrgb&w=800&fm=webp',
    href: '/services#hedge-shrub-trimming',
    features: [
      'Hedge trimming',
      'Shrub trimming',
      'General shaping and maintenance',
    ],
  },
  {
    id: 'planting',
    title: 'Planting',
    shortDescription:
      'Expert planting of flowers, shrubs, and trees to bring colour and life to your garden.',
    description:
      'Expert planting of flowers, shrubs, and trees to bring colour, structure, and life to your garden beds and landscape.',
    image:
      'https://images.pexels.com/photos/7728050/pexels-photo-7728050.jpeg?auto=compress&cs=tinysrgb&w=800&fm=webp',
    href: '/services#planting',
    features: [
      'Flower planting',
      'Shrub planting',
      'Tree planting',
    ],
  },
  {
    id: 'mulching-fertilizing',
    title: 'Mulching & Fertilizing',
    shortDescription:
      'Garden bed mulching and fertilizer application to suppress weeds and nourish your plants.',
    description:
      'Fresh mulch application and fertilizer programs to suppress weeds, retain moisture, and keep your plants well-nourished.',
    image:
      'https://images.pexels.com/photos/5807154/pexels-photo-5807154.jpeg?auto=compress&cs=tinysrgb&w=800&fm=webp',
    href: '/services#mulching-fertilizing',
    features: [
      'Garden bed mulching',
      'Fertilizer application',
    ],
  },
  {
    id: 'seasonal-cleanup',
    title: 'Seasonal Cleanup',
    shortDescription:
      'Spring and fall cleanup services to prepare your yard for the season ahead.',
    description:
      'Prepare your property for every season with our thorough cleanup services. We handle the heavy work so your yard stays healthy year-round.',
    image:
      'https://images.pexels.com/photos/16442678/pexels-photo-16442678.jpeg?auto=compress&cs=tinysrgb&w=800&fm=webp',
    href: '/services#seasonal-cleanup',
    features: [
      'Spring cleanup',
      'Fall cleanup',
      'Seasonal yard cleanup',
    ],
  },
  {
    id: 'garden-design',
    title: 'Garden Design',
    shortDescription:
      'Garden consultation and design services to bring your outdoor vision to life.',
    description:
      'Transform your outdoor space with custom garden design tailored to your property, lifestyle, and aesthetic preferences.',
    image:
      'https://images.pexels.com/photos/32959283/pexels-photo-32959283.jpeg?auto=compress&cs=tinysrgb&w=800&fm=webp',
    href: '/services#garden-design',
    features: [
      'Garden consultation',
      'Garden design',
      'Planting concepts',
    ],
  },
  {
    id: 'drip-irrigation',
    title: 'Drip Irrigation',
    shortDescription:
      'Drip irrigation installation to keep your garden efficiently watered and thriving.',
    description:
      'Efficient drip irrigation system installation to keep your garden properly watered while conserving water and reducing manual effort.',
    image:
      'https://images.pexels.com/photos/450064/pexels-photo-450064.jpeg?auto=compress&cs=tinysrgb&w=800&fm=webp',
    href: '/services#drip-irrigation',
    features: [
      'Drip irrigation installation',
    ],
  },
  {
    id: 'power-washing',
    title: 'Power Washing',
    shortDescription:
      'Professional power washing for driveways, patios, decks, and walkways.',
    description:
      'Professional power washing to restore driveways, patios, decks, and walkways to like-new condition by removing built-up grime and stains.',
    image:
      'https://images.pexels.com/photos/4876678/pexels-photo-4876678.jpeg?auto=compress&cs=tinysrgb&w=800&fm=webp',
    href: '/services#power-washing',
    features: [
      'Outdoor surface cleaning',
    ],
  },
  {
    id: 'outdoor-lighting',
    title: 'Outdoor Lighting Design',
    shortDescription:
      'Landscape lighting design to enhance the beauty and safety of your outdoor space.',
    description:
      'Landscape lighting design to enhance the beauty, safety, and usability of your outdoor space after dark.',
    image:
      'https://images.pexels.com/photos/8143684/pexels-photo-8143684.jpeg?auto=compress&cs=tinysrgb&w=800&fm=webp',
    href: '/services#outdoor-lighting',
    features: [
      'Landscape lighting design',
    ],
  },
];

export const galleryImages = [
  {
    src: 'https://images.pexels.com/photos/8082322/pexels-photo-8082322.jpeg?auto=compress&cs=tinysrgb&w=800&fm=webp',
    alt: 'Landscaped property with lush greenery',
    category: 'Garden Design',
    span: true,
  },
  {
    src: 'https://images.pexels.com/photos/6728925/pexels-photo-6728925.jpeg?auto=compress&cs=tinysrgb&w=800&fm=webp',
    alt: 'Lawn mowing service',
    category: 'Lawn Care',
  },
  {
    src: 'https://images.pexels.com/photos/31215699/pexels-photo-31215699.jpeg?auto=compress&cs=tinysrgb&w=800&fm=webp',
    alt: 'Garden flowers in full bloom',
    category: 'Planting',
  },
  {
    src: 'https://images.pexels.com/photos/8583822/pexels-photo-8583822.jpeg?auto=compress&cs=tinysrgb&w=800&fm=webp',
    alt: 'Patio with fire pit and garden',
    category: 'Outdoor Improvements',
    span: true,
  },
  {
    src: 'https://images.pexels.com/photos/38936347/pexels-photo-38936347.jpeg?auto=compress&cs=tinysrgb&w=800&fm=webp',
    alt: 'Hedge trimming and maintenance',
    category: 'Garden Maintenance',
  },
  {
    src: 'https://images.pexels.com/photos/32959283/pexels-photo-32959283.jpeg?auto=compress&cs=tinysrgb&w=800&fm=webp',
    alt: 'Stone pathway garden design',
    category: 'Garden Design',
  },
  {
    src: 'https://images.pexels.com/photos/7728050/pexels-photo-7728050.jpeg?auto=compress&cs=tinysrgb&w=800&fm=webp',
    alt: 'Fresh flower planting in garden bed',
    category: 'Planting',
  },
  {
    src: 'https://images.pexels.com/photos/8143684/pexels-photo-8143684.jpeg?auto=compress&cs=tinysrgb&w=800&fm=webp',
    alt: 'Modern outdoor patio with garden',
    category: 'Outdoor Improvements',
    span: true,
  },
  {
    src: 'https://images.pexels.com/photos/16442678/pexels-photo-16442678.jpeg?auto=compress&cs=tinysrgb&w=800&fm=webp',
    alt: 'Seasonal yard cleanup and leaf removal',
    category: 'Cleanups',
  },
  {
    src: 'https://images.pexels.com/photos/450064/pexels-photo-450064.jpeg?auto=compress&cs=tinysrgb&w=800&fm=webp',
    alt: 'Garden pathway with pebbled walkway',
    category: 'Garden Design',
  },
  {
    src: 'https://images.pexels.com/photos/4162016/pexels-photo-4162016.jpeg?auto=compress&cs=tinysrgb&w=800&fm=webp',
    alt: 'Lawn mower cutting fresh green grass',
    category: 'Lawn Care',
  },
  {
    src: 'https://images.pexels.com/photos/4876678/pexels-photo-4876678.jpeg?auto=compress&cs=tinysrgb&w=800&fm=webp',
    alt: 'Power washing driveway surface',
    category: 'Outdoor Improvements',
  },
];

export const serviceAreas = [
  {
    name: 'Maple Ridge',
    description:
      'Our home base. We provide full-service landscaping and garden maintenance throughout Maple Ridge, BC.',
  },
  {
    name: 'Pitt Meadows',
    description:
      'Reliable lawn care, garden maintenance, and landscape design for Pitt Meadows properties.',
  },
  {
    name: 'Coquitlam',
    description:
      'Expert garden care, lawn maintenance, and outdoor improvements for properties in Coquitlam.',
  },
  {
    name: 'Port Coquitlam',
    description:
      'Professional landscaping and garden maintenance services for homes in Port Coquitlam.',
  },
  {
    name: 'Burnaby',
    description:
      'Quality landscaping and garden maintenance services for homes and businesses in Burnaby.',
  },
  {
    name: 'Surrey',
    description:
      'Professional landscaping services across Surrey, from seasonal cleanup to garden maintenance.',
  },
  {
    name: 'Vancouver',
    description:
      'Premium landscape design and garden maintenance serving the Vancouver area.',
  },
  {
    name: 'Richmond',
    description:
      'Professional landscaping and garden maintenance services for properties in Richmond.',
  },
];

export const quoteServiceOptions = [
  'Lawn mowing',
  'Lawn maintenance',
  'Garden maintenance',
  'Hedge trimming',
  'Shrub trimming',
  'Weeding',
  'Mulching',
  'Planting',
  'Tree planting',
  'Fertilizing',
  'Spring cleanup',
  'Fall cleanup',
  'Garden design',
  'Drip irrigation',
  'Power washing',
  'Outdoor lighting',
  'Other',
];
