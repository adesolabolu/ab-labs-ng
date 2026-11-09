import React from 'react';
import { notFound } from 'next/navigation';
import { BLOG_POSTS, BlogPost } from '@/data/blogs';
import BlogPostView from '@/components/BlogPostView';

// Alias map from legacy Webflow furniture blog slugs to new web tech playbooks
const BLOG_SLUG_ALIASES: Record<string, string> = {
  'how-to-create-a-cozy-scandinavian-living-room-in-2026': 'why-single-page-websites-hurt-local-seo-nigeria',
  'caring-for-your-premium-furniture-a-complete-guide': 'speed-to-lead-converting-nigerian-web-traffic-under-5-minutes',
  '2026-furniture-trends-you-need-to-know-this-year': 'building-high-trust-ecommerce-stores-with-paystack-in-2026',
  'small-space-big-style-furnishing-compact-homes': 'google-maps-3-pack-playbook-for-lagos-abuja-businesses',
  'inside-the-studio-how-an-oak-table-is-made': 'nextjs-16-turbopack-vs-wordpress-why-modern-brands-are-migrating',
  'layering-textures-for-a-warm-inviting-home': 'the-death-of-ai-slop-web-design-in-african-tech',
  'the-return-of-warm-minimalism-in-modern-homes': 'zero-friction-checkout-card-transfer-ussd-stack',
  'how-to-clean-and-protect-boucle-upholstery': 'edge-caching-and-asset-optimization-african-telecoms',
  'scaling-your-brand-online-a-complete-guide': 'speed-to-lead-converting-nigerian-web-traffic-under-5-minutes',
  '2026-web-design-trends-and-conversion-standards': 'building-high-trust-ecommerce-stores-with-paystack-in-2026',
};

export function generateStaticParams() {
  const primary = BLOG_POSTS.map(p => ({ slug: p.slug }));
  const aliases = Object.keys(BLOG_SLUG_ALIASES).map(slug => ({ slug }));
  return [...primary, ...aliases];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resolved = BLOG_SLUG_ALIASES[slug] || slug;
  const post = BLOG_POSTS.find(p => p.slug === resolved);

  if (!post) {
    return {
      title: 'Article Not Found | aB Labs NG',
    };
  }

  return {
    title: `${post.title} | aB Labs NG Insights`,
    description: post.excerpt,
  };
}

export default async function BlogPostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resolved = BLOG_SLUG_ALIASES[slug] || slug;
  const post = BLOG_POSTS.find(p => p.slug === resolved);

  if (!post) {
    return notFound();
  }

  return <BlogPostView post={post} />;
}
