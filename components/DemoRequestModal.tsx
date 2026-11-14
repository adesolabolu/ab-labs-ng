'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface DemoRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateName: string;
  templateSlug?: string;
  whatsappNumber?: string;
  selectedPlan?: 'monthly' | 'outright';
  monthlyPrice?: number;
  setupFee?: number;
  outrightPrice?: number;
}

export default function DemoRequestModal({
  isOpen,
  onClose,
  templateName,
  templateSlug,
  whatsappNumber = '2349036193817',
}: DemoRequestModalProps) {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    businessName: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setStatus('idle');
      setErrorMessage('');
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const whatsappMessage = `Hi aB Labs, I'm contacting you concerning a free demo for the ${templateName} for my business.`;
  const encodedWhatsapp = encodeURIComponent(whatsappMessage);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          businessName: formData.businessName,
          templateName,
          templateSlug,
          template_interest: templateName,
          inquiry_type: 'DEMO_REQUEST',
          message: `Free brand demo request for ${templateName}. Business: ${formData.businessName || 'Not specified'}. WhatsApp: ${formData.phone}.`,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (typeof window !== 'undefined' && (window as any).umami) {
          (window as any).umami.track('Demo Modal - Successfully Submitted', {
            template: templateSlug || templateName,
            business: formData.businessName || 'N/A',
          });
        }
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Failed to submit details. Please try WhatsApp or try again.');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Network error. Please try again or message us directly on WhatsApp.');
    }
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: 'rgba(12, 11, 10, 0.72)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '470px',
          maxHeight: '92vh',
          overflowY: 'auto',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ padding: '22px 24px 16px', borderBottom: '1px solid #f3f4f6', position: 'relative' }}>
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              position: 'absolute',
              top: '18px',
              right: '18px',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: '#f3f4f6',
              color: '#4b5563',
              fontSize: '18px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e5e7eb';
              e.currentTarget.style.color = '#111827';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.color = '#4b5563';
            }}
          >
            ×
          </button>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: '#15803d',
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              padding: '3px 10px',
              borderRadius: '100px',
              marginBottom: '8px',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e' }}></span>
            Free Brand Demo Request
          </span>

          <h2 id="demo-modal-title" style={{ fontSize: '19px', fontWeight: 700, color: '#111827', margin: '0 0 4px', lineHeight: 1.3 }}>
            Experience {templateName}
          </h2>
          <p style={{ fontSize: '12.5px', color: '#6b7280', margin: 0, lineHeight: 1.45 }}>
            See this design customized with your logo, business details, and colors before making any payment.
          </p>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '20px 24px 24px' }}>
          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '16px 8px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#dcfce7',
                  color: '#16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  fontSize: '26px',
                }}
              >
                ✓
              </div>
              <h3 style={{ fontSize: '19px', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>
                Demo Request Received!
              </h3>
              <p style={{ fontSize: '13.5px', color: '#4b5563', lineHeight: 1.55, margin: '0 0 20px' }}>
                Our engineering team will prepare your custom preview for <strong>{templateName}</strong> and contact you on WhatsApp in <strong>less than 8 hours</strong>.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodedWhatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-umami-event="Demo Modal - Clicked WhatsApp After Success"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px 20px',
                    backgroundColor: '#25D366',
                    color: '#ffffff',
                    borderRadius: '10px',
                    fontWeight: 600,
                    fontSize: '14px',
                    textDecoration: 'none',
                    boxShadow: '0 2px 8px rgba(37, 211, 102, 0.25)',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.38c1.44.79 3.06 1.2 4.76 1.2h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm0 18.13h-.01c-1.52 0-3.01-.41-4.31-1.18l-.31-.18-3.2.84.85-3.12-.2-.32a8.19 8.19 0 0 1-1.26-4.36c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.41a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23z" />
                    <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.92-2.19-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.46s1.06 2.85 1.21 3.05c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.75-.71 2-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35z" />
                  </svg>
                  <span>Need It Faster? Message on WhatsApp Now →</span>
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: '10px 16px',
                    backgroundColor: '#f3f4f6',
                    border: 'none',
                    borderRadius: '10px',
                    color: '#374151',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* Option 1: Contact via WhatsApp */}
              <div
                style={{
                  padding: '16px 18px',
                  borderRadius: '14px',
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  marginBottom: '18px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#166534' }}>
                    Option 1: Contact via WhatsApp
                  </span>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '2px 7px',
                      borderRadius: '4px',
                      backgroundColor: '#22c55e',
                      color: '#ffffff',
                      letterSpacing: '0.04em',
                    }}
                  >
                    FASTEST
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#15803d', margin: '4px 0 12px', lineHeight: 1.4 }}>
                  Chat directly with our design desk on WhatsApp for instant response.
                </p>

                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodedWhatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-umami-event="Demo Modal - Clicked WhatsApp Fast-Track"
                  data-umami-event-template={templateSlug || templateName}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '9px',
                    padding: '11px 18px',
                    backgroundColor: '#25D366',
                    color: '#ffffff',
                    borderRadius: '10px',
                    fontWeight: 600,
                    fontSize: '14px',
                    textDecoration: 'none',
                    boxShadow: '0 2px 8px rgba(37, 211, 102, 0.28)',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#20bd5a';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#25D366';
                  }}
                >
                  {/* Authentic WhatsApp Icon */}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.38c1.44.79 3.06 1.2 4.76 1.2h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm0 18.13h-.01c-1.52 0-3.01-.41-4.31-1.18l-.31-.18-3.2.84.85-3.12-.2-.32a8.19 8.19 0 0 1-1.26-4.36c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.41a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23z" />
                    <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.92-2.19-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.46s1.06 2.85 1.21 3.05c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.75-.71 2-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35z" />
                  </svg>
                  <span>Chat on WhatsApp →</span>
                </a>
              </div>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '18px 0 16px' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', letterSpacing: '0.06em' }}>
                  OPTION 2: SUBMIT YOUR DETAILS
                </span>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
              </div>

              {/* Option 2: Streamlined Form (Full Name + WhatsApp Number + Business Details) */}
              <form
                onSubmit={handleSubmit}
                data-umami-event="Demo Modal - Submitted Form"
                data-umami-event-template={templateSlug || templateName}
                style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
              >
                {/* Full Name & WhatsApp Number Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>
                      Full Name <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tunde Adebayo"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{
                        width: '100%',
                        height: '42px',
                        padding: '0 12px',
                        borderRadius: '9px',
                        border: '1px solid #d1d5db',
                        backgroundColor: '#f9fafb',
                        fontSize: '13.5px',
                        color: '#111827',
                        outline: 'none',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.15s ease, background-color 0.15s ease',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#111827';
                        e.target.style.backgroundColor = '#ffffff';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#d1d5db';
                        e.target.style.backgroundColor = '#f9fafb';
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>
                      WhatsApp Number <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 08012345678"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{
                        width: '100%',
                        height: '42px',
                        padding: '0 12px',
                        borderRadius: '9px',
                        border: '1px solid #d1d5db',
                        backgroundColor: '#f9fafb',
                        fontSize: '13.5px',
                        color: '#111827',
                        outline: 'none',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.15s ease, background-color 0.15s ease',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#111827';
                        e.target.style.backgroundColor = '#ffffff';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#d1d5db';
                        e.target.style.backgroundColor = '#f9fafb';
                      }}
                    />
                  </div>
                </div>

                {/* Business / Brand Details */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>
                    Business / Brand Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Haven Luxury Interiors"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    style={{
                      width: '100%',
                      height: '42px',
                      padding: '0 12px',
                      borderRadius: '9px',
                      border: '1px solid #d1d5db',
                      backgroundColor: '#f9fafb',
                      fontSize: '13.5px',
                      color: '#111827',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.15s ease, background-color 0.15s ease',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#111827';
                      e.target.style.backgroundColor = '#ffffff';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.backgroundColor = '#f9fafb';
                    }}
                  />
                </div>

                {status === 'error' && (
                  <div style={{ padding: '8px 12px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#b91c1c', fontSize: '12.5px' }}>
                    {errorMessage}
                  </div>
                )}

                {/* Submit Button (Polished, Premium Design) */}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  style={{
                    width: '100%',
                    height: '48px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: '#18181b',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '14.5px',
                    cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                    opacity: status === 'loading' ? 0.75 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '6px',
                    boxShadow: '0 4px 12px rgba(24, 24, 27, 0.2)',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (status !== 'loading') e.currentTarget.style.backgroundColor = '#27272a';
                  }}
                  onMouseLeave={(e) => {
                    if (status !== 'loading') e.currentTarget.style.backgroundColor = '#18181b';
                  }}
                >
                  {status === 'loading' ? (
                    <span>Submitting Details...</span>
                  ) : (
                    <>
                      <span>Submit Details</span>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </>
                  )}
                </button>

                <p style={{ textAlign: 'center', fontSize: '11.5px', color: '#9ca3af', margin: '4px 0 0' }}>
                  🔒 You will be contacted on WhatsApp in less than 8 hours.
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
