import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { RESOURCES } from '@/data/resources';
import { pageMetadata } from '@/lib/site';

export function generateStaticParams() {
  return RESOURCES.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = RESOURCES.find((r) => r.slug === slug);
  if (!item) return {};
  return pageMetadata({
    title: item.title,
    description: item.description,
    path: `/resources/${item.slug}`,
  });
}

export default async function ResourceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = RESOURCES.find((r) => r.slug === slug);
  if (!item) notFound();

  return (
    <div className="page-wrapper">
      <Navbar />

      <main style={{ backgroundColor: '#faf8f5', minHeight: '85vh', paddingTop: '92px', paddingBottom: '48px' }}>
        <div className="site-blockcontainer container-large site-container">
          {/* Top Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap',
              marginBottom: '18px',
            }}
          >
            <div>
              <Link
                href="/resources"
                style={{
                  display: 'inline-block',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#78716c',
                  textDecoration: 'none',
                  marginBottom: '6px',
                }}
              >
                ← Back to Resources
              </Link>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1c1917', margin: 0, letterSpacing: '-0.02em' }}>
                {item.title}
              </h1>
            </div>

            {item.embeddable && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '9px 14px',
                  borderRadius: '9px',
                  border: '1px solid #d6d3d1',
                  backgroundColor: '#ffffff',
                  color: '#1c1917',
                  fontSize: '13px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                Open Fullscreen ↗
              </a>
            )}
          </div>

          {/* Embedded App or Placeholder Body */}
          {item.embeddable ? (
            <div
              style={{
                width: '100%',
                height: '80vh',
                minHeight: '620px',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid #e7e5e4',
                backgroundColor: '#07080a',
                boxShadow: '0 14px 36px rgba(28, 25, 23, 0.08)',
              }}
            >
              <iframe
                src={item.url}
                title={item.title}
                style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                allow="clipboard-write; fullscreen"
              />
            </div>
          ) : (
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e7e5e4',
                borderRadius: '16px',
                padding: '32px',
                maxWidth: '720px',
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#78716c', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
                {item.category}
              </div>
              <p style={{ fontSize: '15px', color: '#44403c', lineHeight: 1.65, margin: '0 0 20px' }}>
                {item.description}
              </p>
              <Link
                href={item.url}
                style={{
                  display: 'inline-block',
                  padding: '11px 18px',
                  borderRadius: '10px',
                  backgroundColor: '#1c1917',
                  color: '#ffffff',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                Continue →
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
