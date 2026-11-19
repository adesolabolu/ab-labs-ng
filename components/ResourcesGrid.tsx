'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { ResourceItem } from '@/data/resources';

interface ResourcesGridProps {
  items: ResourceItem[];
}

export default function ResourcesGrid({ items }: ResourcesGridProps) {
  const [activeEmbed, setActiveEmbed] = useState<ResourceItem | null>(null);

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
          <article key={item.id} className="res-card">
            {item.embeddable ? (
              <div className="res-preview-box">
                <iframe
                  src={item.url}
                  title={item.title}
                  className="res-preview-iframe"
                  loading="lazy"
                />
                <button
                  type="button"
                  onClick={() => setActiveEmbed(item)}
                  aria-label={`Preview ${item.title} interactively`}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(7,8,10,0.65) 0%, transparent 45%)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-end',
                    padding: '12px',
                  }}
                >
                  <span
                    style={{
                      backgroundColor: '#ffffff',
                      color: '#1c1917',
                      fontSize: '12px',
                      fontWeight: 700,
                      padding: '6px 12px',
                      borderRadius: '8px',
                    }}
                  >
                    Interactive View
                  </span>
                </button>
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
              <div style={{ fontSize: '11.5px', fontWeight: 700, color: item.isPlaceholder ? '#78716c' : '#9a6843', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {item.category}
              </div>

              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1c1917', margin: 0, lineHeight: 1.3 }}>
                {item.title}
              </h2>

              <p style={{ fontSize: '14px', color: '#57534e', margin: 0, lineHeight: 1.55, flex: 1 }}>
                {item.description}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px', flexWrap: 'wrap' }}>
                {item.embeddable && (
                  <button
                    type="button"
                    onClick={() => setActiveEmbed(item)}
                    style={{
                      padding: '10px 16px',
                      borderRadius: '9px',
                      border: 'none',
                      backgroundColor: '#1c1917',
                      color: '#ffffff',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Launch Preview
                  </button>
                )}

                {item.isExternal ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '10px 14px',
                      borderRadius: '9px',
                      border: '1px solid #d6d3d1',
                      backgroundColor: '#ffffff',
                      color: '#1c1917',
                      fontSize: '13px',
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    {item.ctaLabel} ↗
                  </a>
                ) : (
                  <Link
                    href={item.url}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '9px',
                      border: '1px solid #d6d3d1',
                      backgroundColor: '#ffffff',
                      color: '#1c1917',
                      fontSize: '13px',
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    {item.ctaLabel} →
                  </Link>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Full Interactive Modal for Embeddable Resources */}
      {activeEmbed && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeEmbed.title}
          onClick={() => setActiveEmbed(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999999,
            backgroundColor: 'rgba(12, 11, 10, 0.72)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '1120px',
              height: '86vh',
              backgroundColor: '#07080a',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.14)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                padding: '12px 16px',
                backgroundColor: '#121215',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              <div style={{ minWidth: 0 }}>
                <strong style={{ color: '#ffffff', fontSize: '14px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {activeEmbed.title}
                </strong>
                <span style={{ color: '#a1a1aa', fontSize: '12px' }}>{activeEmbed.url}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                <a
                  href={activeEmbed.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '7px 12px',
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    color: '#121215',
                    fontSize: '12px',
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  Open in New Tab ↗
                </a>
                <button
                  type="button"
                  onClick={() => setActiveEmbed(null)}
                  aria-label="Close preview"
                  style={{
                    padding: '7px 12px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Close
                </button>
              </div>
            </div>
            <iframe
              src={activeEmbed.url}
              title={activeEmbed.title}
              style={{ width: '100%', flex: 1, border: 'none', backgroundColor: '#07080a' }}
            />
          </div>
        </div>
      )}
    </>
  );
}
