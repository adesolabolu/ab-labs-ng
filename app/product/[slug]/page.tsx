import React from 'react';
import { notFound } from 'next/navigation';
import { TEMPLATES } from '@/data/templates';
import TemplateDetailView from '@/components/TemplateDetailView';
import { itemsMap, itemSlugs } from './content';
import { applyPricingOverrides } from '@/lib/template-pricing';
import { pageMetadata, absoluteUrl, SITE_NAME } from '@/lib/site';

// Prices are editable from the admin portal, so refresh the cached page.
export const revalidate = 60;

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
  const templates = await applyPricingOverrides();
  const template = templates.find((t) => t.slug === resolvedSlug || t.id === resolvedSlug);

  if (template) {
    return pageMetadata({
      title: template.name,
      description: template.description,
      path: `/product/${template.slug}`,
      image: { url: template.image, alt: `${template.name} website template preview` },
    });
  }

  const title = resolvedSlug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  return pageMetadata({
    title,
    description:
      'Production-ready website template engineered with modern web standards and tailored for your brand.',
    path: `/product/${resolvedSlug}`,
  });
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resolvedSlug = SLUG_ALIASES[slug] || slug;

  // 1. Check for real website template in catalog
  const templates = await applyPricingOverrides();
  const template = templates.find((t) => t.slug === resolvedSlug || t.id === resolvedSlug);
  if (template) {
    const productUrl = absoluteUrl(`/product/${template.slug}`);
    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Product',
          name: template.name,
          description: template.description,
          image: absoluteUrl(template.image),
          url: productUrl,
          category: template.categoryLabel,
          brand: { '@type': 'Brand', name: SITE_NAME },
          offers: {
            '@type': 'Offer',
            priceCurrency: 'NGN',
            price: template.priceNgn,
            availability: 'https://schema.org/InStock',
            url: productUrl,
          },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
            { '@type': 'ListItem', position: 2, name: 'Templates', item: absoluteUrl('/shop') },
            { '@type': 'ListItem', position: 3, name: template.name, item: productUrl },
          ],
        },
      ],
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <TemplateDetailView template={template} relatedTemplates={templates} />
      </>
    );
  }

  // 2. Fallback to legacy CMS items if any exist
  const Component = itemsMap[resolvedSlug] || itemsMap[slug];
  if (Component) {
    return <Component />;
  }

  return notFound();
}
