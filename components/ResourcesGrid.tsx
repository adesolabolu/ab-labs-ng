'use client';

import React from 'react';
import Link from 'next/link';
import type { ResourceItem } from '@/data/resources';

interface ResourcesGridProps {
  items: ResourceItem[];
}

export default function ResourcesGrid({ items }: ResourcesGridProps) {
  return (
    <>
      <style>{`
        .res-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
        }
        @media (max-width: 980px) {
          .res-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 640px) {
          .res-grid {
            grid-template-columns: minmax(0, 1fr);
          }
        }
        .res-card {
          background-color: #ffffff;
          border: 1px solid #e7e5e4;
          border-radius: 16px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: inherit;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .res-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(28, 25, 23, 0.06);
        }
        .res-preview-box {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10;
          background-color: #07080a;
          border-bottom: 1px solid #e7e5e4;
          overflow: hidden;
        }
        .res-preview-iframe {
          width: 1280px;
          height: 800px;
          border: none;
          transform: scale(0.32);
          transform-origin: top left;
          pointer-events: none;
        }
      `}</style>

      <div className="res-grid">
        {items.map((item) => (
          <Link key={item.id} href={`/resources/${item.slug}`} className="res-card">
            {item.embeddable ? (
              <div className="res-preview-box">
                <iframe
                  src={item.url}
                  title={item.title}
                  className="res-preview-iframe"
                  loading="lazy"
                  tabIndex={-1}
                />
              </div>
            ) : (
              <div
                style={{
                  width: '100%',
                  aspectRatio: '16 / 10',
                  backgroundColor: '#f5f2ec',
                  borderBottom: '1px solid #e7e5e4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px',
                  textAlign: 'center',
                }}
              >
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#78716c' }}>
                  {item.category}
                </span>
              </div>
            )}

            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1, gap: '10px' }}>
              <div
                style={{
                  fontSize: '11.5px',
                  fontWeight: 700,
                  color: item.isPlaceholder ? '#78716c' : '#9a6843',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                {item.category}
              </div>

              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1c1917', margin: 0, lineHeight: 1.3 }}>
                {item.title}
              </h2>

              <p style={{ fontSize: '14px', color: '#57534e', margin: 0, lineHeight: 1.55, flex: 1 }}>
                {item.description}
              </p>

              <div style={{ marginTop: '8px', fontSize: '13.5px', fontWeight: 700, color: '#1c1917' }}>
                {item.ctaLabel} →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
