'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface DemoRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateName: string;
  templateSlug?: string;
  selectedPlan?: 'monthly' | 'outright';
  monthlyPrice?: number;
  setupFee?: number;
  outrightPrice?: number;
  whatsappNumber?: string;
}

export default function DemoRequestModal({
  isOpen,
  onClose,
  templateName,
  templateSlug,
  selectedPlan = 'monthly',
  monthlyPrice = 5000,
  setupFee = 15000,
  outrightPrice = 50000,
  whatsappNumber = '2349036193817',
}: DemoRequestModalProps) {
  const [mounted, setMounted] = useState(false);
  const [planPreference, setPlanPreference] = useState<'monthly' | 'outright'>(selectedPlan);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync initial plan whenever opened
  useEffect(() => {
    setPlanPreference(selectedPlan);
    setStatus('idle');
    setErrorMessage('');
  }, [selectedPlan, isOpen]);

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

  const planLabel = planPreference === 'monthly'
    ? `Monthly Plan (₦${setupFee.toLocaleString()} setup + ₦${monthlyPrice.toLocaleString()}/mo)`
    : `Outright Purchase (₦${outrightPrice.toLocaleString()} one-time)`;

  const whatsappMessage = `Hi aB Labs, I would like to request a free brand demo for the ${templateName} on the ${planPreference === 'monthly' ? 'Monthly Launch Plan' : 'Outright Plan'}. My business name is: ${formData.businessName || ''}`;
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
          email: formData.email,
          phone: formData.phone,
          businessName: formData.businessName,
          templateName,
          templateSlug,
          template_interest: templateName,
          inquiry_type: 'DEMO_REQUEST',
          plan_type: planPreference === 'monthly' ? 'Monthly' : 'Outright',
          message: formData.message || `Free demo request for ${templateName} (${planLabel}). Business: ${formData.businessName || 'Not specified'}.`,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (typeof window !== 'undefined' && (window as any).umami) {
          (window as any).umami.track('Demo Modal - Successfully Submitted', {
            template: templateSlug || templateName,
            plan: planPreference,
            business: formData.businessName || 'N/A'
          });
        }
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Failed to submit demo request. Please try WhatsApp or try again.');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Network connection error. Please try again or chat via WhatsApp.');
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
          maxWidth: '520px',
          maxHeight: '90vh',
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
        {/* Top Header */}
        <div style={{ padding: '24px 28px 18px', borderBottom: '1px solid #f3f4f6', position: 'relative' }}>
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
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
              marginBottom: '10px',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e' }}></span>
            Free Brand Demo Request
          </span>

          <h2 id="demo-modal-title" style={{ fontSize: '20px', fontWeight: 700, color: '#111827', margin: '0 0 4px', lineHeight: 1.3 }}>
            Experience {templateName}
          </h2>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: 0, lineHeight: 1.45 }}>
            See this foundation customized with your business logo, services, and brand colors before making any payment.
          </p>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px 28px' }}>
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
                  fontSize: '28px',
                }}
              >
                ✓
              </div>
              <h3 style={{ fontSize: '19px', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>
                Demo Request Received!
              </h3>
              <p style={{ fontSize: '13.5px', color: '#4b5563', lineHeight: 1.55, margin: '0 0 24px' }}>
                Our engineering desk is preparing your interactive preview for <strong>{templateName}</strong>. We will message your WhatsApp / Email within 24 hours.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodedWhatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
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
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                  <span>Chat With Engineer on WhatsApp Now</span>
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
                  Done
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* Option 1: WhatsApp Fast-Track Button */}
              <div
                style={{
                  padding: '16px 18px',
                  borderRadius: '14px',
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  marginBottom: '20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#166534' }}>
                        Option 1: Fast-Track on WhatsApp
                      </span>
                      <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', backgroundColor: '#22c55e', color: '#fff' }}>
                        FASTEST
                      </span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#15803d', margin: '3px 0 0', lineHeight: 1.4 }}>
                      Send your logo &amp; brand details directly to our design desk for instant reply.
                    </p>
                  </div>
                </div>

                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodedWhatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-umami-event="Demo Modal - Clicked WhatsApp Fast-Track"
                  data-umami-event-template={templateSlug || templateName}
                  data-umami-event-plan={planPreference}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '12px',
                    padding: '10px 16px',
                    backgroundColor: '#25D366',
                    color: '#ffffff',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '13.5px',
                    textDecoration: 'none',
                    boxShadow: '0 2px 6px rgba(37, 211, 102, 0.2)',
                    transition: 'transform 0.15s ease',
                  }}
                >
                  <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                  <span>Chat Directly on WhatsApp &rarr;</span>
                </a>
              </div>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', letterSpacing: '0.06em' }}>
                  OPTION 2: OR SUBMIT DETAILS ONLINE
                </span>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
              </div>

              {/* Option 2 Form */}
              <form
                onSubmit={handleSubmit}
                data-umami-event="Demo Modal - Submitted Form"
                data-umami-event-template={templateSlug || templateName}
                data-umami-event-plan={planPreference}
                style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
              >
                {/* Name & Phone Grid */}
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
                        height: '40px',
                        padding: '0 12px',
                        borderRadius: '8px',
                        border: '1px solid #d1d5db',
                        fontSize: '13px',
                        color: '#111827',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>
                      WhatsApp / Phone <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 08012345678"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{
                        width: '100%',
                        height: '40px',
                        padding: '0 12px',
                        borderRadius: '8px',
                        border: '1px solid #d1d5db',
                        fontSize: '13px',
                        color: '#111827',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                {/* Email & Business Name Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>
                      Email Address <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        width: '100%',
                        height: '40px',
                        padding: '0 12px',
                        borderRadius: '8px',
                        border: '1px solid #d1d5db',
                        fontSize: '13px',
                        color: '#111827',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>
                      Business / Brand Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Haven Luxury"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      style={{
                        width: '100%',
                        height: '40px',
                        padding: '0 12px',
                        borderRadius: '8px',
                        border: '1px solid #d1d5db',
                        fontSize: '13px',
                        color: '#111827',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                {/* Plan Preference Toggle */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    Plan of Interest
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setPlanPreference('monthly')}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: planPreference === 'monthly' ? '2px solid #111827' : '1px solid #e5e7eb',
                        backgroundColor: planPreference === 'monthly' ? '#f9fafb' : '#ffffff',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: planPreference === 'monthly' ? '#111827' : '#4b5563',
                      }}
                    >
                      <div>Monthly Launch</div>
                      <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: 400 }}>
                        ₦{monthlyPrice.toLocaleString()}/mo + ₦{setupFee.toLocaleString()}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPlanPreference('outright')}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: planPreference === 'outright' ? '2px solid #111827' : '1px solid #e5e7eb',
                        backgroundColor: planPreference === 'outright' ? '#f9fafb' : '#ffffff',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: planPreference === 'outright' ? '#111827' : '#4b5563',
                      }}
                    >
                      <div>Outright Purchase</div>
                      <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: 400 }}>
                        ₦{outrightPrice.toLocaleString()} one-time
                      </div>
                    </button>
                  </div>
                </div>

                {/* Optional Message */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>
                    Specific Notes / Services to Include
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Tell us a little about your business or specific features you need..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '13px',
                      color: '#111827',
                      outline: 'none',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                {status === 'error' && (
                  <div style={{ padding: '8px 12px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#b91c1c', fontSize: '12.5px' }}>
                    {errorMessage}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  style={{
                    width: '100%',
                    height: '44px',
                    borderRadius: '100px',
                    border: 'none',
                    backgroundColor: '#111827',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '14px',
                    cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                    opacity: status === 'loading' ? 0.7 : 1,
                    transition: 'all 0.15s ease',
                  }}
                >
                  {status === 'loading' ? 'Submitting Demo Request...' : 'Submit Demo Request &rarr;'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
