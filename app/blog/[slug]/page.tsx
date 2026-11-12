import React from 'react';
import { notFound } from 'next/navigation';
import { itemsMap, itemSlugs } from './content';

// Mapping alias slugs (from homepage & insights) to the authentic blog layout items
const BLOG_SLUG_ALIASES: Record<string, string> = {
  'why-single-page-websites-hurt-local-seo-nigeria': 'how-to-create-a-cozy-scandinavian-living-room-in-2026',
  'speed-to-lead-converting-nigerian-web-traffic-under-5-minutes': 'caring-for-your-premium-furniture-a-complete-guide',
  'building-high-trust-ecommerce-stores-with-paystack-in-2026': '2026-furniture-trends-you-need-to-know-this-year',
  'google-maps-3-pack-playbook-for-lagos-abuja-businesses': 'small-space-big-style-furnishing-compact-homes',
  'nextjs-16-turbopack-vs-wordpress-why-modern-brands-are-migrating': 'inside-the-studio-how-an-oak-table-is-made',
  'the-death-of-ai-slop-web-design-in-african-tech': 'layering-textures-for-a-warm-inviting-home',
  'zero-friction-checkout-card-transfer-ussd-stack': 'the-return-of-warm-minimalism-in-modern-homes',
  'edge-caching-and-asset-optimization-african-telecoms': 'how-to-clean-and-protect-boucle-upholstery',
};

export function generateStaticParams() {
  const allSlugs = Array.from(new Set([...itemSlugs, ...Object.keys(BLOG_SLUG_ALIASES)]));
  return allSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resolved = BLOG_SLUG_ALIASES[slug] || slug;
  const title = slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  return {
    title: `${title} | aB Labs Blog`,
    description: 'Conversion insights, digital growth strategies, and high-performance web architecture from aB Labs.',
  };
}

export default async function BlogPostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resolved = BLOG_SLUG_ALIASES[slug] || slug;
  const Component = itemsMap[resolved] || itemsMap[slug];

  if (!Component) {
    return notFound();
  }

  return <Component />;
}
