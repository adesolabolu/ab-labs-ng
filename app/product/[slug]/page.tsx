import React from 'react';
import { notFound } from 'next/navigation';
import { TEMPLATES } from '@/data/templates';
import TemplateDetailView from '@/components/TemplateDetailView';
import { itemsMap, itemSlugs } from './content';

// Mapping legacy furniture slugs to our real website foundations
const SLUG_ALIASES: Record<string, string> = {
  'cozy-curve-sofa': 'lumina-lighting-lamps',
  'coastal-bed-frame': 'stratos-real-estate',
  'linnea-coffee-table': 'vertex-elite-marketing',
  'halo-side-table': 'launchkit-ng-studio',
  'mesa-dining-table': 'aura-luxury-interiors',
  'arcus-two-seater': 'ananya-singh-motion',
  'retro-oak-lounge': 'designer-voice-studio',
  'highback-glide': 'vanguard-health-medical',
  'linea-sideboard': 'alex-chen-architect',
};

export function generateStaticParams() {
  const templateSlugs = TEMPLATES.map((t) => t.slug);
  const allSlugs = Array.from(new Set([...templateSlugs, ...itemSlugs, ...Object.keys(SLUG_ALIASES)]));
  return allSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resolvedSlug = SLUG_ALIASES[slug] || slug;
  const template = TEMPLATES.find((t) => t.slug === resolvedSlug || t.id === resolvedSlug);

  if (template) {
    return {
      title: `${template.name} | aB Labs`,
      description: template.description,
    };
  }

  const title = resolvedSlug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  return {
    title: `${title} | aB Labs`,
    description: 'Production-ready website template engineered with modern web standards and tailored for your brand.',
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resolvedSlug = SLUG_ALIASES[slug] || slug;

  // 1. Check for real website template in catalog
  const template = TEMPLATES.find((t) => t.slug === resolvedSlug || t.id === resolvedSlug);
  if (template) {
    return <TemplateDetailView template={template} />;
  }

  // 2. Fallback to legacy CMS items if any exist
  const Component = itemsMap[resolvedSlug] || itemsMap[slug];
  if (Component) {
    return <Component />;
  }

  return notFound();
}
