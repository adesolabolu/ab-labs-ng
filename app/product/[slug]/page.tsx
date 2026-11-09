import React from 'react';
import { notFound } from 'next/navigation';
import { TEMPLATES, Template } from '@/data/templates';
import TemplateDetailView from '@/components/TemplateDetailView';

// Legacy slug mapping to ensure zero 404s from Webflow links
const SLUG_ALIASES: Record<string, string> = {
  'arcus-two-seater': 'arcus-agency',
  'highback-glide': 'solis-health',
  'arc-floor-lamp': 'lumina-storefront',
  'coastal-bed-frame': 'apex-real-estate',
  'cozy-curve-sofa': 'lumina-storefront',
  'globe-table-lamp': 'vertex-corporate',
  'halo-side-table': 'pulse-saas',
  'linea-sideboard': 'aura-hospitality',
  'linen-headboard-bed': 'apex-real-estate',
  'linen-loveseat': 'lumina-storefront',
  'linnea-coffee-table': 'vertex-corporate',
  'mesa-dining-table': 'aura-hospitality',
  'nordic-lounge-chair': 'arcus-agency',
  'oak-bookcase': 'vertex-corporate',
  'retro-oak-lounge': 'zenith-fintech',
  'soft-oak-remix': 'solis-health',
};

export function generateStaticParams() {
  const primarySlugs = TEMPLATES.map(t => ({ slug: t.slug }));
  const aliasSlugs = Object.keys(SLUG_ALIASES).map(slug => ({ slug }));
  return [...primarySlugs, ...aliasSlugs];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resolvedSlug = SLUG_ALIASES[slug] || slug;
  const template = TEMPLATES.find(t => t.slug === resolvedSlug);

  if (!template) {
    return {
      title: 'Template Not Found | aB Labs NG',
    };
  }

  return {
    title: `${template.name} — Website Template | aB Labs NG`,
    description: `${template.tagline}. Built with Next.js 16, Tailwind CSS, and Paystack for African commerce. Full source code included.`,
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resolvedSlug = SLUG_ALIASES[slug] || slug;
  const template = TEMPLATES.find(t => t.slug === resolvedSlug);

  if (!template) {
    return notFound();
  }

  return <TemplateDetailView template={template} />;
}
