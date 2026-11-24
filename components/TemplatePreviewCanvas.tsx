'use client';

import React, { useState, useEffect, useRef } from 'react';

interface TemplatePreviewCanvasProps {
  demoUrl?: string;
  fallbackImage: string;
  templateName: string;
}

export default function TemplatePreviewCanvas({
  demoUrl,
  fallbackImage,
  templateName,
}: TemplatePreviewCanvasProps) {
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [iframeKey, setIframeKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [frameWidth, setFrameWidth] = useState(910);
  const [canvasWidth, setCanvasWidth] = useState(910);

  // Dynamically observe container and frame width for proportional scaling
  useEffect(() => {
    const updateSizes = () => {
      if (frameRef.current) {
        const fw = frameRef.current.clientWidth;
        if (fw > 0) setFrameWidth(fw);
      }
      if (canvasRef.current) {
        // Deduct 48px padding (24px left + 24px right)
        const cw = canvasRef.current.clientWidth - 48;
        if (cw > 0) setCanvasWidth(cw);
      }
    };

    updateSizes();
    const ro = new ResizeObserver(updateSizes);
    if (canvasRef.current) ro.observe(canvasRef.current);
    if (frameRef.current) ro.observe(frameRef.current);
    window.addEventListener('resize', updateSizes);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateSizes);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [iframeKey]);
const handleRefresh = () => {
    setIsLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  const activeUrl = demoUrl || null;

  // Viewport calculation:
  // Desktop: True 1440px desktop canvas scaled down proportionally to frame width.
  //          Preserves full desktop navbar, multi-column grids, and luxury desktop typography.
  // Tablet:  768px tablet canvas.
  // Mobile:  390px mobile canvas.
  const targetHeight = 720;
  let activeScale = 1;
  let activeIframeWidth = 1440;
  let outerWidth = '100%';
  let frameClass = 'tpc-frame-desktop';

  if (viewport === 'desktop') {
    frameClass = 'tpc-frame-desktop';
    activeIframeWidth = 1440;
    activeScale = frameWidth > 0 ? frameWidth / 1440 : 0.632;
    outerWidth = '100%';
  } else if (viewport === 'tablet') {
    frameClass = 'tpc-frame-tablet';
    activeIframeWidth = 768;
    const avail = canvasWidth > 0 ? canvasWidth : 910;
    activeScale = Math.min(1, avail / 768);
    outerWidth = activeScale < 1 ? '100%' : '768px';
  } else {
    frameClass = 'tpc-frame-mobile';
    activeIframeWidth = 390;
    const avail = canvasWidth > 0 ? canvasWidth : 910;
    activeScale = Math.min(1, avail / 390);
    outerWidth = activeScale < 1 ? '100%' : '390px';
  }

  const activeIframeHeight = targetHeight / (activeScale || 1);

  return (
    <>
      {/* 1. DESKTOP VIEWPORT STUDIO (Visible on desktop screens >= 768px) */}
      <div className="tpc-wrapper tpc-light-theme tpc-desktop-only">
        {/* Top Device & Control Bar */}
        <div className="tpc-header">
          {/* Left: Window Controls & Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="tpc-dots">
              <span className="tpc-dot tpc-dot-red"></span>
              <span className="tpc-dot tpc-dot-yellow"></span>
              <span className="tpc-dot tpc-dot-green"></span>
            </div>

            <div className="tpc-meta">
              <span className="tpc-pulse"></span>
              <span className="tpc-title">
                {templateName} - Live Preview
              </span>
            </div>
          </div>

          {/* Center / Right: Viewport Switcher & Scroll Lock Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div className="tpc-switcher">
              <button
                type="button"
                onClick={() => setViewport('desktop')}
                data-umami-event="Preview Canvas - Switched Viewport"
                data-umami-event-viewport="desktop"
                className={`tpc-btn ${viewport === 'desktop' ? 'active' : ''}`}
                title="Desktop View (1440px True Desktop Canvas)"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
                <span>Desktop</span>
              </button>

              <button
                type="button"
                onClick={() => setViewport('tablet')}
                data-umami-event="Preview Canvas - Switched Viewport"
                data-umami-event-viewport="tablet"
                className={`tpc-btn ${viewport === 'tablet' ? 'active' : ''}`}
                title="Tablet View (768px)"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="4" y="2" width="16" height="20" rx="2"></rect>
                  <line x1="12" y1="18" x2="12.01" y2="18"></line>
                </svg>
                <span>Tablet</span>
              </button>

              <button
                type="button"
                onClick={() => setViewport('mobile')}
                data-umami-event="Preview Canvas - Switched Viewport"
                data-umami-event-viewport="mobile"
                className={`tpc-btn ${viewport === 'mobile' ? 'active' : ''}`}
                title="Mobile View (390px)"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="5" y="2" width="14" height="20" rx="2"></rect>
                  <line x1="12" y1="18" x2="12.01" y2="18"></line>
                </svg>
                <span>Mobile</span>
              </button>
            </div>

            {/* Refresh Frame Button */}
            {activeUrl && (
              <button
                type="button"
                onClick={handleRefresh}
                className="tpc-refresh-btn"
                title="Reload Frame"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Preview Viewport Canvas Area */}
        <div className="tpc-canvas" ref={canvasRef} style={{ overscrollBehavior: 'contain' }}>
          {activeUrl && isLoading && (
            <div style={{
              position: 'absolute',
              inset: 0,
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(4px)',
              color: '#1f2937',
              gap: '12px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                border: '3px solid #10b981',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
              }}></div>
              <p style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.04em', color: '#374151' }}>
                Loading Interactive Template Preview...
              </p>
            </div>
          )}

          {/* Proportional Scaled Viewport Frame */}
          {activeUrl ? (
            <div
              ref={frameRef}
              className={frameClass}
              style={{
                display: 'block',
                width: outerWidth,
                height: `${targetHeight}px`,
                position: 'relative',
                overflow: 'hidden',
                margin: viewport === 'desktop' ? '0' : '0 auto',
              }}
            >
              {viewport === 'mobile' && <div className="tpc-mobile-notch"></div>}

              <iframe
                key={iframeKey}
                src={activeUrl}
                title={`${templateName} Interactive Preview`}
                className="tpc-iframe"
                style={{
                  flexShrink: 0,
                  width: `${activeIframeWidth}px`,
                  height: `${activeIframeHeight}px`,
                  transform: `scale(${activeScale})`,
                  transformOrigin: 'top left',
                  border: 'none',
                  display: 'block',
                  backgroundColor: '#ffffff',
                }}
                onLoad={() => setIsLoading(false)}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                loading="eager"
              />
            </div>
          ) : (
            <div
              className={frameClass}
              style={{
                width: outerWidth,
                height: `${targetHeight}px`,
                position: 'relative',
                overflow: 'hidden',
                margin: viewport === 'desktop' ? '0' : '0 auto',
              }}
            >
              <img
                src={fallbackImage}
                alt={templateName}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
              />
            </div>
          )}
        </div>
      </div>

      {/* 2. MOBILE DEDICATED PREVIEW CARD (Visible only on mobile < 768px) */}
      <div className="tpc-mobile-only">
        <div className="tpc-mob-card">
          <div className="tpc-mob-header">
            <div className="tpc-mob-title-wrap">
              <span className="tpc-pulse"></span>
              <span className="tpc-mob-title">{templateName} Live Demo</span>
            </div>
            {activeUrl && (
              <a
                href={activeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="tpc-mob-ext-link"
                data-umami-event="Preview Canvas - Opened Fullsite New Tab"
              >
                <span>Open Fullsite</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            )}
          </div>

          {!isMobileExpanded ? (
            <div className="tpc-mob-collapsed">
              <div className="tpc-mob-thumb-frame">
                <img
                  src={fallbackImage}
                  alt={templateName}
                  className="tpc-mob-thumb-img"
                  loading="lazy"
                />
                <div className="tpc-mob-thumb-overlay">
                  <button
                    type="button"
                    onClick={() => setIsMobileExpanded(true)}
                    className="tpc-mob-toggle-btn"
                    data-umami-event="Preview Canvas - Expanded Mobile Preview"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="5" y="2" width="14" height="20" rx="2" />
                      <line x1="12" y1="18" x2="12.01" y2="18" />
                    </svg>
                    <span>Test Interactive Demo on Page ▾</span>
                  </button>
                  {activeUrl && (
                    <a
                      href={activeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tpc-mob-tab-link"
                    >
                      Open in New Tab ↗
                    </a>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="tpc-mob-expanded">
              {/* Sticky Top Control Bar */}
              <div className="tpc-mob-control-bar">
                <div className="tpc-mob-control-label">
                  <span className="tpc-pulse"></span>
                  <span>Interactive Mobile View</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileExpanded(false)}
                  className="tpc-mob-close-btn"
                  data-umami-event="Preview Canvas - Closed Mobile Preview"
                >
                  <span>Close Preview</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Native 1:1 Mobile Iframe Container */}
              <div className="tpc-mob-frame-wrapper">
                {isLoading && (
                  <div className="tpc-mob-loader">
                    <div className="tpc-mob-spinner"></div>
                    <span>Loading interactive preview...</span>
                  </div>
                )}
                {activeUrl && (
                  <iframe
                    src={activeUrl}
                    title={`${templateName} Mobile Live Preview`}
                    className="tpc-mob-iframe"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                    loading="eager"
                    onLoad={() => setIsLoading(false)}
                  />
                )}
              </div>

              {/* Bottom Close Bar */}
              <div className="tpc-mob-bottom-bar">
                <button
                  type="button"
                  onClick={() => setIsMobileExpanded(false)}
                  className="tpc-mob-bottom-close"
                >
                  ✕ Close Interactive Preview
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
