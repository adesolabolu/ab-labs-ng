import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CallToAction from '@/components/CallToAction';
import { getBlogPostFromDb, getBlogPostsFromDb } from '@/lib/blogs-db';
import { pageMetadata, absoluteUrl } from '@/lib/site';
import { itemsMap } from './content';

// Single source of truth: Always query latest editorial guide from Neon DB.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostFromDb(slug);

  if (post) {
    return pageMetadata({
      title: `${post.title} | aB Labs Guides`,
      description: post.excerpt || post.subtitle,
      path: `/blog/${post.slug}`,
      image: { url: post.image, alt: post.title },
    });
  }

  const title = slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  return pageMetadata({
    title: `${title} | aB Labs Blog`,
    description: 'Practical guides on getting more customers, SEO, and building high-performance websites.',
    path: `/blog/${slug}`,
  });
}

export default async function BlogPostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // 1. Query real blog post from database
  const post = await getBlogPostFromDb(slug);

  if (post) {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.excerpt,
      image: post.image,
      datePublished: post.date,
      author: {
        '@type': 'Person',
        name: post.author.name,
        jobTitle: post.author.role,
      },
      publisher: {
        '@type': 'Organization',
        name: 'aB Labs',
        url: absoluteUrl('/'),
      },
    };

    return (
      <div className="page-wrapper" style={{ backgroundColor: '#faf8f5', minHeight: '100vh' }}>
        <Navbar />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <main style={{ maxWidth: '840px', margin: '0 auto', padding: '60px 24px 100px' }}>
          {/* Breadcrumb Navigation */}
          <div style={{ marginBottom: '28px' }}>
            <Link
              href="/blog"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13.5px',
                fontWeight: 600,
                color: '#78716c',
                textDecoration: 'none',
              }}
            >
              <span>&larr;</span>
              <span>Back to all guides</span>
            </Link>
          </div>

          {/* Post Header */}
          <header style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
              <span
                style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: '100px',
                  backgroundColor: '#f5f5f4',
                  border: '1px solid #e7e5e4',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#44403c',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                {post.category}
              </span>
              <span style={{ fontSize: '12.5px', color: '#a8a29e' }}>&bull;</span>
              <span style={{ fontSize: '13px', color: '#78716c' }}>{post.readTime}</span>
              <span style={{ fontSize: '12.5px', color: '#a8a29e' }}>&bull;</span>
              <span style={{ fontSize: '13px', color: '#78716c' }}>{post.date}</span>
            </div>

            <h1
              style={{
                fontSize: '34px',
                fontWeight: 800,
                color: '#1c1917',
                letterSpacing: '-0.03em',
                lineHeight: 1.25,
                margin: '0 0 14px',
              }}
            >
              {post.title}
            </h1>

            {post.subtitle && (
              <p style={{ fontSize: '18px', color: '#57534e', lineHeight: 1.5, margin: '0 0 24px' }}>
                {post.subtitle}
              </p>
            )}

            {/* Author Card */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                paddingTop: '16px',
                borderTop: '1px solid #e7e5e4',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: '#1c1917',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '14px',
                  flexShrink: 0,
                }}
              >
                {post.author.initials}
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#1c1917' }}>{post.author.name}</div>
                <div style={{ fontSize: '12px', color: '#78716c' }}>{post.author.role}</div>
              </div>
            </div>
          </header>

          {/* Hero Image */}
          {post.image && (
            <div
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                marginBottom: '40px',
                boxShadow: '0 8px 30px rgba(12, 11, 10, 0.06)',
                backgroundColor: '#e7e5e4',
              }}
            >
              <img
                src={post.image}
                alt={post.title}
                style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '460px', objectFit: 'cover' }}
              />
            </div>
          )}

          {/* Post Content */}
          <article
            style={{
              fontSize: '16px',
              lineHeight: 1.8,
              color: '#292524',
              display: 'flex',
              flexDirection: 'column',
              gap: '28px',
            }}
          >
            {/* Lead */}
            {post.content?.lead && (
              <p
                style={{
                  fontSize: '18px',
                  fontWeight: 500,
                  lineHeight: 1.7,
                  color: '#1c1917',
                  margin: 0,
                  borderLeft: '3px solid #1c1917',
                  paddingLeft: '18px',
                }}
              >
                {post.content.lead}
              </p>
            )}

            {/* Sections */}
            {post.content?.sections?.map((sec, idx) => (
              <section key={idx} style={{ marginTop: '12px' }}>
                {sec.heading && (
                  <h2
                    style={{
                      fontSize: '22px',
                      fontWeight: 700,
                      color: '#1c1917',
                      letterSpacing: '-0.015em',
                      margin: '0 0 14px',
                    }}
                  >
                    {sec.heading}
                  </h2>
                )}

                {sec.paragraphs?.map((p, pIdx) => (
                  <p key={pIdx} style={{ margin: '0 0 16px', color: '#44403c' }}>
                    {p}
                  </p>
                ))}

                {/* Key Takeaway Callout */}
                {sec.keyTakeaway && (
                  <div
                    style={{
                      backgroundColor: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      borderRadius: '12px',
                      padding: '16px 20px',
                      margin: '20px 0',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '16px' }}>💡</span>
                      <strong style={{ fontSize: '13.5px', color: '#166534', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                        Key Takeaway
                      </strong>
                    </div>
                    <p style={{ margin: 0, fontSize: '14.5px', color: '#15803d', lineHeight: 1.6 }}>
                      {sec.keyTakeaway}
                    </p>
                  </div>
                )}

                {/* Code or Metric Highlight */}
                {sec.codeOrMetric && (
                  <div
                    style={{
                      backgroundColor: '#1c1917',
                      color: '#ffffff',
                      borderRadius: '12px',
                      padding: '20px 24px',
                      margin: '20px 0',
                    }}
                  >
                    <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#a8a29e' }}>
                      {sec.codeOrMetric.label}
                    </div>
                    <div style={{ fontSize: '32px', fontWeight: 800, color: '#38bdf8', margin: '4px 0 8px', letterSpacing: '-0.02em' }}>
                      {sec.codeOrMetric.value}
                    </div>
                    <div style={{ fontSize: '13.5px', color: '#d6d3d1', lineHeight: 1.5 }}>
                      {sec.codeOrMetric.description}
                    </div>
                  </div>
                )}
              </section>
            ))}
          </article>

          {/* Post Footer Box */}
          <div
            style={{
              marginTop: '60px',
              padding: '32px',
              borderRadius: '16px',
              backgroundColor: '#ffffff',
              border: '1px solid #e7e5e4',
              boxShadow: '0 8px 30px rgba(12, 11, 10, 0.04)',
              textAlign: 'center',
            }}
          >
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1c1917', margin: '0 0 10px' }}>
              Ready to Launch Your High-Performance Website?
            </h3>
            <p style={{ fontSize: '14.5px', color: '#78716c', margin: '0 0 20px', maxWidth: '520px', marginLeft: 'auto', marginRight: 'auto' }}>
              Pick a ready-made template designed for your industry. We customize your brand colors, logos, and copy, and deploy on your domain in under 36 hours.
            </p>
            <Link
              href="/shop"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 28px',
                borderRadius: '100px',
                backgroundColor: '#1c1917',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '14px',
                textDecoration: 'none',
              }}
            >
              <span>Explore Website Templates</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // 2. Fallback to legacy static CMS items if matching
  const Component = itemsMap[slug];
  if (Component) {
    return <Component />;
  }

  return notFound();
}
