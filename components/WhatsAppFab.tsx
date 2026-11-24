'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export const WHATSAPP_NUMBER = '2349036193817';
export const WHATSAPP_DISPLAY = '+234 903 619 3817';
export const whatsappLink = (message?: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}${message ? `?text=${encodeURIComponent(message)}` : ''}`;

const HIDDEN_PREFIXES = ['/admin', '/portal', '/login'];

export default function WhatsAppFab() {
  const pathname = usePathname() || '/';
  const [showBubble, setShowBubble] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem('ab_labs_wa_custom_dismissed') === 'true') {
        setIsDismissed(true);
      }
    } catch {}

    const handleScroll = () => {
      // Trigger prompt once user scrolls down past 280px
      if (window.scrollY > 280) {
        setShowBubble(true);
      } else {
        setShowBubble(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return null;
  }

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDismissed(true);
    try {
      sessionStorage.setItem('ab_labs_wa_custom_dismissed', 'true');
    } catch {}
  };

  const isBubbleVisible = showBubble && !isDismissed;

  return (
    <div className="whatsapp-fab-container">
      {/* Speech Bubble / Message Box */}
      {isBubbleVisible && (
        <div className="whatsapp-bubble" role="dialog" aria-label="Custom website inquiry">
          <div className="whatsapp-bubble-top">
            <p className="whatsapp-bubble-title">Looking for something custom?</p>
            <button
              type="button"
              onClick={handleDismiss}
              className="whatsapp-bubble-close"
              aria-label="Dismiss message"
              title="Dismiss"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <a
            href={whatsappLink("Hi aB Labs, I'm looking for a custom website build.")}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-bubble-link"
            data-umami-event="WhatsApp Bubble - Clicked Custom Inquiry"
          >
            <p className="whatsapp-bubble-text">
              Tell us what you need and we will build it for you.
            </p>
            <span className="whatsapp-bubble-btn">
              <span>Chat on WhatsApp</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
          </a>

          {/* Pointer Arrow pointing to FAB */}
          <div className="whatsapp-bubble-arrow" aria-hidden="true" />
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={whatsappLink('Hi aB Labs, I would like to know more about your website templates and custom builds.')}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-fab"
        aria-label={`Chat with aB Labs on WhatsApp at ${WHATSAPP_DISPLAY}`}
        data-umami-event="WhatsApp FAB - Clicked Chat"
      >
        <svg
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.92-2.19-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.46s1.06 2.85 1.21 3.05c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.75-.71 2-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35z" />
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.38c1.44.79 3.06 1.2 4.76 1.2h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm0 18.13h-.01c-1.52 0-3.01-.41-4.31-1.18l-.31-.18-3.2.84.85-3.12-.2-.32a8.19 8.19 0 0 1-1.26-4.36c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.41a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23z" />
        </svg>
      </a>
    </div>
  );
}
