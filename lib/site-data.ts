export const siteConfig = {
  name: 'Najm Garden & Maintenance Ltd.',
  shortName: 'NGM Landscape',
  phone: '778-233-1599',
  email: 'info@ngmlandscape.ca',
  location: 'Maple Ridge, BC',
  owner: 'Najmudin Najm',
  primaryArea: 'Maple Ridge and the Lower Mainland / Fraser Valley',
  // Verified business profile URLs. Keep empty if not verified yet to avoid broken external links.
  social: {
    instagram: '', // Add verified URL (e.g. 'https://www.instagram.com/ngmlandscape')
    facebook: '',  // Add verified URL (e.g. 'https://www.facebook.com/ngmlandscape')
  },
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
    id: 'lawn-mowing-weeding-edging',
    title: 'Lawn Mowing, Weeding & Edging',
    shortDescription:
      'Regular mowing, precision line edging along walkways and beds, and thorough weeding to keep your turf immaculate.',
    description:
      'Keep your turf healthy, clean-cut, and neatly edged with our reliable lawn care services. We provide scheduled mowing, crisp boundary edging along walkways and flower beds, and proactive weeding.',
    image:
      'https://images.pexels.com/photos/6728925/pexels-photo-6728925.jpeg?auto=compress&cs=tinysrgb&w=800&fm=webp',
    href: '/services#lawn-mowing-weeding-edging',
    features: [
      'Scheduled lawn mowing',
      'Walkway and bed edge trimming',
      'Perimeter and crack weeding',
      'Grass clipping collection and disposal',
      'Consistent lawn maintenance',
    ],
  },
  {
    id: 'hedge-shrub-trimming',
    title: 'Hedge & Shrub Trimming',
    shortDescription:
      'Precise shaping and maintenance pruning for cedars, boxwoods, ornamental shrubs, and boundary hedges.',
    description:
      'Maintain strong plant health and sharp curb appeal with our hedge and shrub trimming services. We prune to promote thick growth, level tops, clean sides, and remove dead or diseased branches.',
    image:
      'https://images.pexels.com/photos/38936334/pexels-photo-38936334.jpeg?auto=compress&cs=tinysrgb&w=800&fm=webp',
    href: '/services#hedge-shrub-trimming',
    features: [
      'Cedar and laurel hedge trimming',
      'Ornamental shrub shaping',
      'Deadwood and stray branch pruning',
      'Complete trimmings cleanup and removal',
      'Seasonal aesthetic shaping',
    ],
  },
  {
    id: 'planting',
    title: 'Planting Flowers, Trees & Shrubs',
    shortDescription:
      'Professional planting of seasonal annuals, perennials, ornamental trees, and shrubs suited to the Pacific Northwest.',
    description:
      'Bring color, structure, and year-round vitality to your garden beds. We source and install climate-appropriate flowers, shrubs, and trees with proper soil preparation and spacing for long-term health.',
    image:
      'https://images.pexels.com/photos/7728050/pexels-photo-7728050.jpeg?auto=compress&cs=tinysrgb&w=800&fm=webp',
    href: '/services#planting',
    features: [
      'Flower bed planting (annuals & perennials)',
      'Shrub and bush installation',
      'Specimen tree planting and staking',
      'Soil preparation and root conditioning',
      'Species selection suited to BC climate',
    ],
  },
  {
    id: 'garden-bed-mulching',
    title: 'Garden Bed Mulching',
    shortDescription:
      'Premium bark and organic mulch installation to suppress weeds, retain soil moisture, and insulate plant roots.',
    description:
      'Protect your soil and enhance garden aesthetics with our garden bed mulching service. Fresh mulch conserves soil moisture during dry BC summers, suppresses weed growth, and prevents winter soil erosion.',
    image:
      'https://images.pexels.com/photos/5807154/pexels-photo-5807154.jpeg?auto=compress&cs=tinysrgb&w=800&fm=webp',
    href: '/services#garden-bed-mulching',
    features: [
      'Premium dark bark mulch delivery and spreading',
      'Soil moisture retention for summer heat',
      'Natural weed suppression',
      'Root insulation against winter frost',
      'Clean edge trenching for sharp presentation',
    ],
  },
  {
    id: 'fertilizer-weed-control',
    title: 'Fertilizer & Weed Control',
    shortDescription:
      'Nutrient management and targeted weed treatments to promote thick green turf and healthy garden plants.',
    description:
      'Give your lawn and garden beds the nutrients they need to grow thick and green. We apply balanced, seasonal fertilizers and provide targeted weed and moss management.',
    image:
      'https://images.pexels.com/photos/4162016/pexels-photo-4162016.jpeg?auto=compress&cs=tinysrgb&w=800&fm=webp',
    href: '/services#fertilizer-weed-control',
    features: [
      'Seasonal lawn fertilizing',
      'Targeted broadleaf weed control',
      'Garden bed weed treatments',
      'Moss control and lawn health',
      'Turf strengthening programs',
    ],
  },
  {
    id: 'seasonal-cleanups',
    title: 'Spring & Fall Cleanups',
    shortDescription:
      'Comprehensive yard cleanups to reset your landscape after winter or prepare it before the freeze.',
    description:
      'Clear accumulated debris, branches, leaves, and wet foliage that can harbor mold and damage lawns. Our seasonal cleanups ensure your property transitions smoothly into every season.',
    image:
      'https://images.pexels.com/photos/16442678/pexels-photo-16442678.jpeg?auto=compress&cs=tinysrgb&w=800&fm=webp',
    href: '/services#seasonal-cleanups',
    features: [
      'Spring lawn and bed cleanup',
      'Fall leaf raking and removal',
      'Perennial cutbacks and deadheading',
      'Storm debris clearing and eco-disposal',
      'Lawn aeration preparation',
    ],
  },
  {
    id: 'garden-design-consultation',
    title: 'Garden Design & Consultation',
    shortDescription:
      'Practical garden layout planning, plant recommendations, and consultations tailored to your space.',
    description:
      'Transform neglected or overgrown spaces into functional, attractive garden landscapes. We collaborate with you on plant palettes, bed layouts, and maintenance-conscious design.',
    image: '/images/garden-design.jpg',
    href: '/services#garden-design-consultation',
    features: [
      'On-site property consultation',
      'Plant selection for Pacific Northwest conditions',
      'Garden bed layout and zoning',
      'Sunlight and drainage evaluation',
      'Low-maintenance planting concepts',
    ],
  },
  {
    id: 'power-washing',
    title: 'Power Washing Decks & Patios',
    shortDescription:
      'Restorative pressure washing for concrete driveways, stone patios, pavers, walkways, and wooden decks.',
    description:
      'Remove slippery moss, algae, mildew, and accumulated dirt from outdoor surfaces. We restore stone, concrete, and decking to safe, clean condition throughout Maple Ridge and surrounding areas.',
    image: '/images/power-washing.jpg',
    href: '/services#power-washing',
    features: [
      'Patio and walkway power washing',
      'Driveway grime and moss removal',
      'Deck and wood surface cleaning',
      'Slip-hazard prevention',
      'Surface-safe pressure techniques',
    ],
  },
  {
    id: 'drip-irrigation',
    title: 'Drip Irrigation for Gardens',
    shortDescription:
      'Convenient drip irrigation installation for flower beds, shrubs, and garden trees.',
    description:
      'Keep your garden beds, hedges, and shrubs consistently watered without dragging hoses across the yard. We install straightforward drip systems that deliver water directly to your plants.',
    image: '/images/drip-irrigation.jpg',
    href: '/services/drip-irrigation',
    features: [
      'Flower bed & shrub drip systems',
      'Direct watering at plant roots',
      'Automated timer setup',
      'Neatly hidden under garden mulch',
      'Spring startup and winter shut-off',
    ],
  },
];

export interface GalleryItem {
  src: string;
  alt: string;
  serviceCategory: string;
  label: string;
  span?: boolean;
}

export const galleryImages: GalleryItem[] = [
  {
    src: '/images/garden-design.jpg',
    alt: 'Service illustration: Custom garden bed design with structured plants and stepping stone pathway',
    serviceCategory: 'Garden Design',
    label: 'Garden Design & Layout',
    span: true,
  },
  {
    src: '/images/drip-irrigation.jpg',
    alt: 'Service illustration: Micro drip irrigation line delivering water directly to garden plant root zone',
    serviceCategory: 'Drip Irrigation',
    label: 'Drip Irrigation Installation',
  },
  {
    src: '/images/power-washing.jpg',
    alt: 'Service illustration: High-pressure washing removing moss and grime from stone patio surface',
    serviceCategory: 'Power Washing',
    label: 'Patio & Surface Cleaning',
  },
  {
    src: '/images/garden-design-2.jpg',
    alt: 'Service illustration: Balanced garden planting concept with curated shrubs and mulch',
    serviceCategory: 'Garden Design',
    label: 'Planting & Bed Consultation',
  },
  {
    src: '/images/drip-irrigation-2.jpg',
    alt: 'Service illustration: Automated drip tubing and emitter hydration in residential garden bed',
    serviceCategory: 'Drip Irrigation',
    label: 'Efficient Garden Hydration',
  },
  {
    src: 'https://images.pexels.com/photos/6728925/pexels-photo-6728925.jpeg?auto=compress&cs=tinysrgb&w=800&fm=webp',
    alt: 'Service illustration: Professional lawn mowing and crisp walkway edge trimming',
    serviceCategory: 'Lawn Care',
    label: 'Mowing & Edge Trimming',
  },
  {
    src: 'https://images.pexels.com/photos/31215699/pexels-photo-31215699.jpeg?auto=compress&cs=tinysrgb&w=800&fm=webp',
    alt: 'Service illustration: Healthy perennial flower and shrub planting arrangement',
    serviceCategory: 'Planting',
    label: 'Flower & Shrub Planting',
  },
  {
    src: 'https://images.pexels.com/photos/38936334/pexels-photo-38936334.jpeg?auto=compress&cs=tinysrgb&w=800&fm=webp',
    alt: 'Service illustration: Neatly trimmed privacy hedge and shaped garden shrubs',
    serviceCategory: 'Hedge Trimming',
    label: 'Hedge & Shrub Maintenance',
  },
  {
    src: 'https://images.pexels.com/photos/5807154/pexels-photo-5807154.jpeg?auto=compress&cs=tinysrgb&w=800&fm=webp',
    alt: 'Service illustration: Fresh garden bed bark mulch applied for weed suppression and moisture retention',
    serviceCategory: 'Mulching',
    label: 'Garden Bed Mulching',
    span: true,
  },
  {
    src: 'https://images.pexels.com/photos/16442678/pexels-photo-16442678.jpeg?auto=compress&cs=tinysrgb&w=800&fm=webp',
    alt: 'Service illustration: Thorough seasonal yard cleanup and wet leaf removal',
    serviceCategory: 'Seasonal Cleanups',
    label: 'Spring & Fall Cleanups',
  },
  {
    src: 'https://images.pexels.com/photos/4162016/pexels-photo-4162016.jpeg?auto=compress&cs=tinysrgb&w=800&fm=webp',
    alt: 'Service illustration: Lawn fertilizer and weed management for thick green grass',
    serviceCategory: 'Fertilizing',
    label: 'Turf Care & Weed Control',
  },
];

export interface ServiceAreaInfo {
  name: string;
  tagline: string;
  description: string;
  focus: string[];
}

export const serviceAreas: ServiceAreaInfo[] = [
  {
    name: 'Maple Ridge',
    tagline: 'Our Home Base & Primary Service Hub',
    description:
      'From Silver Valley and Kanaka Creek to Albion and Cottonwood, we provide full-service lawn care, garden maintenance, mulching, hedge trimming, and drip irrigation tailored to Maple Ridge’s distinct soils and rainy climate.',
    focus: [
      'Scheduled lawn mowing & edge trimming',
      'Hedge & shrub pruning',
      'Garden bed mulching & weeding',
      'Drip irrigation installation',
    ],
  },
  {
    name: 'Pitt Meadows',
    tagline: 'Reliable Turf & Bed Maintenance for Flatland Properties',
    description:
      'Pitt Meadows properties often feature open exposures and high-water-table soils. We provide attentive lawn mowing, seasonal cleanups, power washing, and aeration prep to keep grass healthy and moss-free.',
    focus: [
      'Spring & fall seasonal cleanups',
      'Lawn mowing, edging & weeding',
      'Patio & driveway power washing',
      'Fertilizer & weed management',
    ],
  },
  {
    name: 'Mission',
    tagline: 'Care for Hillside Lots & Expansive Gardens',
    description:
      'Serving residential properties in Mission with dedicated landscape maintenance, shrub shaping, storm debris clearing, and garden bed restoration suited to northern Fraser Valley terrain.',
    focus: [
      'Hedge trimming & shaping',
      'Garden bed weed control & mulch',
      'Seasonal debris clearing',
      'Planting & garden consultation',
    ],
  },
  {
    name: 'Langley',
    tagline: 'Curb Appeal & Garden Care for Suburban Homes',
    description:
      'We serve homeowners in Langley communities including Walnut Grove and Willoughby, offering consistent garden maintenance, shrub trimming, flower planting, and water-wise drip irrigation.',
    focus: [
      'Garden drip irrigation',
      'Hedge & shrub trimming',
      'Flower & shrub planting',
      'Garden bed mulching',
    ],
  },
  {
    name: 'Coquitlam',
    tagline: 'Foothill & Suburban Landscape Management',
    description:
      'Properties in Coquitlam and Westwood Plateau receive high rainfall and heavy shade. We specialize in moss control, power washing, shrub shaping, and lawn care that thrives in foothill conditions.',
    focus: [
      'Power washing decks & stone patios',
      'Hedge leveling & shrub care',
      'Lawn weed control & fertilizing',
      'Garden design consultation',
    ],
  },
  {
    name: 'Port Coquitlam',
    tagline: 'Neighbourhood Garden & Lawn Upkeep',
    description:
      'Dependable lawn maintenance, hedge shaping, and garden bed care for residential properties throughout Port Coquitlam.',
    focus: [
      'Regular mowing and line edging',
      'Garden bed mulching & weeding',
      'Hedge trimming & green disposal',
      'Seasonal yard resets',
    ],
  },
  {
    name: 'Surrey',
    tagline: 'Complete Landscape Care Across North Surrey',
    description:
      'From Fraser Heights to Guildford and Fleetwood, we deliver expert hedge trimming, seasonal leaf cleanups, lawn care, and garden bed mulching for busy homeowners.',
    focus: [
      'Seasonal leaf removal & cleanups',
      'Lawn mowing & perimeter weeding',
      'Hedge & shrub shaping',
      'Drip irrigation installation',
    ],
  },
  {
    name: 'Burnaby',
    tagline: 'Meticulous Garden Maintenance & Surface Washing',
    description:
      'Providing professional garden bed care, shrub trimming, patio power washing, and seasonal property maintenance for Burnaby residences.',
    focus: [
      'Power washing patios & walkways',
      'Hedge & shrub trimming',
      'Garden bed rejuvenation & mulching',
      'Planting flowers, trees & shrubs',
    ],
  },
];

export const quoteServiceOptions = [
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
