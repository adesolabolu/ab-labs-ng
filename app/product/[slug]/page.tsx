import React from 'react';
import { notFound } from 'next/navigation';
import { itemsMap, itemSlugs } from './content';

// Mapping alias slugs (from homepage & shop catalog) to the rich individual product view items
const SLUG_ALIASES: Record<string, string> = {
  'lumina-storefront': 'cozy-curve-sofa',
  'apex-real-estate': 'coastal-bed-frame',
  'vertex-corporate': 'linnea-coffee-table',
  'pulse-saas': 'halo-side-table',
  'aura-hospitality': 'mesa-dining-table',
  'arcus-agency': 'arcus-two-seater',
  'zenith-fintech': 'retro-oak-lounge',
  'solis-health': 'highback-glide',
};

export function generateStaticParams() {
  const allSlugs = Array.from(new Set([...itemSlugs, ...Object.keys(SLUG_ALIASES)]));
  return allSlugs.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resolved = SLUG_ALIASES[slug] || slug;
  const title = resolved
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  return {
    title: `${title} | aB Labs`,
    description: 'Production-ready website template engineered with modern web standards and tailored for your brand.',
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resolved = SLUG_ALIASES[slug] || slug;
  const Component = itemsMap[resolved] || itemsMap[slug];

  if (!Component) {
    return notFound();
  }

  return <Component />;
}
