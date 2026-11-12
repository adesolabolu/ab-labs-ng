import React from 'react';

/**
 * Shared 1200×630 social card rendered with `next/og` (ImageResponse).
 * Used by both `app/opengraph-image.tsx` and `app/twitter-image.tsx`.
 */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

export function OgCard() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '72px 80px',
        background: '#0c0b0a',
        color: '#f7f4ef',
        fontFamily:
          'Inter, "Segoe UI", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Warm glow accents */}
      <div
        style={{
          position: 'absolute',
          top: -220,
          right: -160,
          width: 620,
          height: 620,
          borderRadius: 9999,
          background:
            'radial-gradient(circle, rgba(255,138,61,0.42) 0%, rgba(255,138,61,0) 68%)',
          display: 'flex',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -280,
          left: -140,
          width: 620,
          height: 620,
          borderRadius: 9999,
          background:
            'radial-gradient(circle, rgba(120,140,255,0.30) 0%, rgba(120,140,255,0) 70%)',
          display: 'flex',
        }}
      />

      {/* Header: wordmark + category */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: '#ff8a3d',
              color: '#0c0b0a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: -1,
            }}
          >
            aB
          </div>
          <div style={{ display: 'flex', fontSize: 30, fontWeight: 700, letterSpacing: -0.5 }}>
            Labs
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 20,
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: '#b9b2a7',
          }}
        >
          <div
            style={{
              width: 9,
              height: 9,
              borderRadius: 9999,
              background: '#ff8a3d',
              display: 'flex',
            }}
          />
          Web Studio · Nigeria
        </div>
      </div>

      {/* Headline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 940 }}>
        <div
          style={{
            display: 'flex',
            fontSize: 78,
            lineHeight: 1.04,
            fontWeight: 800,
            letterSpacing: -2.5,
          }}
        >
          High-Performance Websites for Ambitious Brands
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 28,
            lineHeight: 1.45,
            color: '#c9c2b7',
            maxWidth: 820,
          }}
        >
          Production-ready templates and bespoke web engineering, launched in under 36 hours.
        </div>
      </div>

      {/* Footer bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid rgba(247,244,239,0.16)',
          paddingTop: 28,
          fontSize: 22,
          color: '#9c958a',
        }}
      >
        <div style={{ display: 'flex' }}>ablabs.ng</div>
        <div style={{ display: 'flex', gap: 28 }}>
          <div style={{ display: 'flex' }}>Website Templates</div>
          <div style={{ display: 'flex', color: '#ff8a3d' }}>Bespoke Builds</div>
        </div>
      </div>
    </div>
  );
}
