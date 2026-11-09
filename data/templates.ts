export interface Template {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: 'ecommerce' | 'real-estate' | 'corporate' | 'saas' | 'hospitality';
  categoryLabel: string;
  priceNgn: number;
  priceUsd: number;
  rating: number;
  reviews: number;
  badge?: string;
  badgeColor?: string;
  image: string;
  description: string;
  stack: string[];
  features: string[];
  demoUrl?: string;
}

export const TEMPLATES: Template[] = [
  {
    id: 'lumina-storefront',
    slug: 'lumina-storefront',
    name: 'Lumina Storefront Pro',
    tagline: 'High-Converting E-Commerce Flagship with Paystack',
    category: 'ecommerce',
    categoryLabel: 'E-Commerce & Retail',
    priceNgn: 220000,
    priceUsd: 150,
    rating: 4.9,
    reviews: 128,
    badge: 'Best Seller',
    badgeColor: '#2563EB',
    image: '/assets/6aa24c86eaf0b376c1c2e6db_Product%20image%201.webp',
    description: 'Ultra-fast headless Next.js storefront engineered for African retail brands. Includes multi-currency Paystack checkout, dynamic inventory counters, real-time search, and mobile-optimized product galleries.',
    stack: ['Next.js 16', 'Tailwind CSS', 'Paystack', 'TypeScript'],
    features: ['Paystack Multi-Currency', 'Real-Time Inventory', 'Mobile Cart Drawer', 'SEO Schema Structured Data']
  },
  {
    id: 'apex-real-estate',
    slug: 'apex-real-estate',
    name: 'Apex Real Estate Portal',
    tagline: 'Luxury Property & PropTech Flagship Platform',
    category: 'real-estate',
    categoryLabel: 'Real Estate & PropTech',
    priceNgn: 250000,
    priceUsd: 170,
    rating: 5.0,
    reviews: 94,
    badge: 'Featured',
    badgeColor: '#059669',
    image: '/assets/6aa24adff0a9f5d137f8f65d_Product%20image%204.webp',
    description: 'Prestigious architecture for property developers, luxury brokers, and real estate agencies in Lagos & Abuja. Interactive floor plan viewers, virtual tour embeds, and instant WhatsApp inspection booking.',
    stack: ['Next.js 16', 'Tailwind CSS', 'Leaflet Maps', 'WhatsApp CRM'],
    features: ['Interactive Map Search', 'Virtual Inspection Booking', 'Property Filter Matrix', 'Neighborhood Guides']
  },
  {
    id: 'vertex-corporate',
    slug: 'vertex-corporate',
    name: 'Vertex Corporate Authority',
    tagline: 'Institutional B2B & Advisory Firm Presence',
    category: 'corporate',
    categoryLabel: 'Corporate & Professional',
    priceNgn: 195000,
    priceUsd: 130,
    rating: 4.9,
    reviews: 76,
    badge: 'Popular',
    badgeColor: '#4F46E5',
    image: '/assets/6aa24a73752e259b387431e7_Product%20image%205.webp',
    description: 'Bespoke corporate presence engineered for law firms, management consultancies, private equity, and advisory firms. Features case study portfolios, executive directory, and client intake forms.',
    stack: ['Next.js 16', 'Framer Motion', 'Tailwind CSS', 'TypeScript'],
    features: ['Executive Roster Layout', 'Deal / Case Studies Engine', 'Intake Form Automations', 'WCAG AAA Accessibility']
  },
  {
    id: 'pulse-saas',
    slug: 'pulse-saas',
    name: 'Pulse SaaS & Tech Platform',
    tagline: 'Software Launchpad & Interactive Customer Portal',
    category: 'saas',
    categoryLabel: 'Tech Startups & SaaS',
    priceNgn: 280000,
    priceUsd: 190,
    rating: 5.0,
    reviews: 112,
    badge: 'Trending',
    badgeColor: '#7C3AED',
    image: '/assets/6aa24c19c2220127b89badf2_Product%20image%202.webp',
    description: 'Complete digital launchpad for SaaS applications and developer tools. Includes interactive tier pricing calculators, feature comparison grids, MDX documentation layouts, and roadmap voting boards.',
    stack: ['Next.js 16', 'Tailwind CSS', 'MDX Docs', 'Stripe & Paystack'],
    features: ['Interactive Pricing Tiers', 'Feature Matrix Comparison', 'Changelog & Documentation', 'Light & Dark Mode']
  },
  {
    id: 'aura-hospitality',
    slug: 'aura-hospitality',
    name: 'Aura Hospitality & Hotel',
    tagline: 'Luxury Boutique Resort & Culinary Flagship',
    category: 'hospitality',
    categoryLabel: 'Hospitality & Dining',
    priceNgn: 180000,
    priceUsd: 120,
    rating: 4.8,
    reviews: 88,
    badge: 'New',
    badgeColor: '#D97706',
    image: '/assets/6aa24bc680e5b871c56b0d91_Product%20image%203.webp',
    description: 'Sensory web architecture for luxury hotels, boutique resorts, and fine dining establishments. Features direct reservation engines, interactive culinary menus, and cinematic imagery showcases.',
    stack: ['Next.js 16', 'Framer Motion', 'Tailwind CSS', 'Calendar Sync'],
    features: ['Direct Room Booking', 'Interactive Menu Cards', 'Events & Private Dining', 'Multi-Language Ready']
  },
  {
    id: 'zenith-fintech',
    slug: 'zenith-fintech',
    name: 'Zenith FinTech & Banking',
    tagline: 'High-Trust Financial Services & Neobank Architecture',
    category: 'corporate',
    categoryLabel: 'Corporate & Professional',
    priceNgn: 320000,
    priceUsd: 210,
    rating: 5.0,
    reviews: 64,
    badge: 'Enterprise',
    badgeColor: '#0284C7',
    image: '/assets/6aa24749f7081ea71f224b42_Product%20image%2010.webp',
    description: 'Institutional-grade frontend designed for digital neobanks, cross-border payment providers, and wealth management platforms. Built with bank-grade security standards and live rate tickers.',
    stack: ['Next.js 16', 'Tailwind CSS', 'API Ready', 'TypeScript'],
    features: ['Live Currency Calculator', 'Security & Compliance Badges', 'Developer API Showcase', 'Investor Relations Deck']
  },
  {
    id: 'arcus-agency',
    slug: 'arcus-agency',
    name: 'Arcus Creative Studio',
    tagline: 'Bold Design Agency & High-End Portfolio',
    category: 'corporate',
    categoryLabel: 'Corporate & Professional',
    priceNgn: 190000,
    priceUsd: 130,
    rating: 4.9,
    reviews: 53,
    badge: 'Award Winner',
    badgeColor: '#EA580C',
    image: '/assets/6aa24a04ed5eeea13b58498f_Product%20image%206.webp',
    description: 'Expressive portfolio and agency flagship engineered to win high-ticket contracts. Smooth scroll transitions, case study interactive carousels, and client inquiry intake workflows.',
    stack: ['Next.js 16', 'Framer Motion', 'Tailwind CSS', 'TypeScript'],
    features: ['Smooth Page Transitions', 'Video Case Studies', 'Client Pitch Calculator', 'Custom Inquiry Form']
  },
  {
    id: 'solis-health',
    slug: 'solis-health',
    name: 'Solis Medical & Wellness',
    tagline: 'Modern Clinic, Diagnostic & Healthcare Flagship',
    category: 'corporate',
    categoryLabel: 'Corporate & Professional',
    priceNgn: 175000,
    priceUsd: 115,
    rating: 4.9,
    reviews: 42,
    badge: 'Essential',
    badgeColor: '#10B981',
    image: '/assets/6aa248db87a0e3f2824cf481_Product%20image%207.webp',
    description: 'Clean, trust-inspiring website architecture for specialized clinics, diagnostic labs, and healthcare practices. Pre-built with doctor profiles, insurance verification notices, and online appointment booking.',
    stack: ['Next.js 16', 'Tailwind CSS', 'Calendly / Cal.com', 'Accessible'],
    features: ['Appointment Scheduling', 'Doctor & Specialist Roster', 'Service Pricing Directory', 'HIPAA/GDPR Compliant Notice']
  }
];

export const CATEGORIES = [
  { id: 'all', label: 'All Templates', count: 8 },
  { id: 'ecommerce', label: 'E-Commerce & Retail', count: 1 },
  { id: 'real-estate', label: 'Real Estate & PropTech', count: 1 },
  { id: 'corporate', label: 'Corporate & Professional', count: 4 },
  { id: 'saas', label: 'Tech Startups & SaaS', count: 1 },
  { id: 'hospitality', label: 'Hospitality & Dining', count: 1 }
];
