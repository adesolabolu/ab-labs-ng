import React from 'react';
import { notFound } from 'next/navigation';
import { itemsMap, itemSlugs } from './content';

export function generateStaticParams() {
  return itemSlugs.map(slug => ({ slug }));
}

export default async function CuratedCollectionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const Component = itemsMap[slug];

  if (!Component) {
    return notFound();
  }

  return <Component />;
}
