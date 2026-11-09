import React from 'react';
import { notFound } from 'next/navigation';
import { BLOG_POSTS } from '@/data/blogs';
import BlogPostView from '@/components/BlogPostView';

// Mapping alias slugs (including legacy Webflow furniture slugs & shorthand links) to authentic tech blog posts
const BLOG_SLUG_ALIASES: Record<string, string> = {
  // Legacy Webflow furniture slugs
  'how-to-create-a-cozy-scandinavian-living-room-in-2026': 'why-single-page-websites-hurt-local-seo-nigeria',
  'caring-for-your-premium-furniture-a-complete-guide': 'speed-to-lead-converting-nigerian-web-traffic-under-5-minutes',
  '2026-furniture-trends-you-need-to-know-this-year': 'building-high-trust-ecommerce-stores-with-paystack-in-2026',
  'small-space-big-style-furnishing-compact-homes': 'google-maps-3-pack-playbook-for-lagos-abuja-businesses',
  'inside-the-studio-how-an-oak-table-is-made': 'nextjs-16-turbopack-vs-wordpress-why-modern-brands-are-migrating',
  'layering-textures-for-a-warm-inviting-home': 'the-death-of-ai-slop-web-design-in-african-tech',
  'the-return-of-warm-minimalism-in-modern-homes': 'zero-friction-checkout-card-transfer-ussd-stack',
  'how-to-clean-and-protect-boucle-upholstery': 'edge-caching-and-asset-optimization-african-telecoms',
  // Alternate shorthand aliases
  'single-page-vs-multi-page-seo': 'why-single-page-websites-hurt-local-seo-nigeria',
  'speed-to-lead': 'speed-to-lead-converting-nigerian-web-traffic-under-5-minutes',
  'high-trust-ecommerce-checkout': 'building-high-trust-ecommerce-stores-with-paystack-in-2026',
  'local-seo-google-maps-playbook': 'google-maps-3-pack-playbook-for-lagos-abuja-businesses',
  'modern-architecture-vs-wordpress': 'nextjs-16-turbopack-vs-wordpress-why-modern-brands-are-migrating',
  'anti-slop-web-design': 'the-death-of-ai-slop-web-design-in-african-tech',
  'zero-friction-checkout': 'zero-friction-checkout-card-transfer-ussd-stack',
  'edge-caching-nigerian-networks': 'edge-caching-and-asset-optimization-african-telecoms',
};

export function generateStaticParams() {
  const allSlugs = Array.from(new Set([
    ...BLOG_POSTS.map(p => p.slug),
    ...Object.keys(BLOG_SLUG_ALIASES)
  ]));
  return allSlugs.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resolvedSlug = BLOG_SLUG_ALIASES[slug] || slug;
  const post = BLOG_POSTS.find(p => p.slug === resolvedSlug);

  if (!post) {
    return {
      title: 'Article Not Found | aB Labs Blog',
      description: 'The requested engineering insight or playbook could not be found.',
    };
  }

  return {
    title: `${post.title} | aB Labs Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.image }],
    },
  };
}

export default async function BlogPostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resolvedSlug = BLOG_SLUG_ALIASES[slug] || slug;
  const post = BLOG_POSTS.find(p => p.slug === resolvedSlug);

  if (!post) {
    return notFound();
  }

  return <BlogPostView post={post} />;
}
