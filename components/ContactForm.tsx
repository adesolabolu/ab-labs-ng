'use client';

import React, { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    field: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          field: formData.field,
          message: formData.message,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (typeof window !== 'undefined' && (window as any).umami) {
          (window as any).umami.track('Contact Form - Successfully Sent', {
            topic: formData.field || 'General Inquiry',
          });
        }
        setStatus('success');
        setFormData({ firstName: '', lastName: '', email: '', field: '', message: '' });
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Oops! Something went wrong while submitting the form.');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Network error. Please try again.');
    }
  };

  return (
    <div className="site-form">
      {status === 'success' ? (
        <div
          className="contact-success-card"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '36px 24px',
            textAlign: 'center',
            border: '1px solid rgba(12, 11, 10, 0.08)',
            boxShadow: '0 12px 36px rgba(12, 11, 10, 0.06)',
          }}
        >
          {/* Elegant Circular Emerald Badge */}
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 4px 14px rgba(22, 163, 74, 0.15)',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#15803d',
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              padding: '3px 10px',
              borderRadius: '100px',
              marginBottom: '10px',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e' }}></span>
            Message Dispatched
          </span>

          <h3
            style={{
              fontSize: '21px',
              fontWeight: 700,
              color: '#1c1917',
              margin: '0 0 8px',
              letterSpacing: '-0.02em',
            }}
          >
            We Received Your Message!
          </h3>

          <p
            style={{
              color: '#57534e',
              fontSize: '13.5px',
              lineHeight: 1.6,
              maxWidth: '380px',
              margin: '0 auto 20px',
            }}
          >
            Thank you for reaching out. Our engineering team has received your inquiry and will review it and reply within <strong>24 hours</strong>.
          </p>

          {/* Quick WhatsApp Alternative */}
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: '#faf8f5',
              borderRadius: '12px',
              border: '1px solid rgba(12, 11, 10, 0.06)',
              marginBottom: '20px',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div>
              <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#1c1917' }}>
                Need an immediate reply?
              </div>
              <div style={{ fontSize: '11.5px', color: '#78716c' }}>
                Direct engineering desk on WhatsApp
              </div>
            </div>
            <a
              href="https://wa.me/2349036193817?text=Hi%20aB%20Labs%2C%20I%20just%20submitted%20a%20message%20on%20your%20contact%20page%20and%20wanted%20to%20follow%20up."
              target="_blank"
              rel="noopener noreferrer"
              data-umami-event="Contact Success - Clicked Direct WhatsApp"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 12px',
                borderRadius: '8px',
                backgroundColor: '#25D366',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 600,
                textDecoration: 'none',
                flexShrink: 0,
                boxShadow: '0 2px 6px rgba(37, 211, 102, 0.25)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.38c1.44.79 3.06 1.2 4.76 1.2h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm0 18.13h-.01c-1.52 0-3.01-.41-4.31-1.18l-.31-.18-3.2.84.85-3.12-.2-.32a8.19 8.19 0 0 1-1.26-4.36c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.41a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23z" />
                <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.92-2.19-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.46s1.06 2.85 1.21 3.05c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.75-.71 2-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35z" />
              </svg>
              <span>Chat WhatsApp</span>
            </a>
          </div>

          {/* Reset / Send Another Message Button */}
          <button
            onClick={() => setStatus('idle')}
            data-umami-event="Contact Success - Clicked Send Another Message"
            style={{
              padding: '10px 22px',
              backgroundColor: '#1c1917',
              color: '#ffffff',
              borderRadius: '100px',
              fontSize: '13px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#9a6843';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#1c1917';
            }}
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form id="contact-form" onSubmit={handleSubmit} data-umami-event="Contact Form - Submitted">
          <h3 data-summary="true" className="ct-form-h">Send us a message</h3>
          <p data-summary="true" className="ct-form-sub">Fill in the form and we&apos;ll get back to you shortly.</p>

          <div fade-in="true" className="form-content-wrapper">
            <div className="ct-row">
              <div className="ct-field">
                <label htmlFor="first-name" className="input-text-field">First name</label>
                <input
                  className="ct-input site-input"
                  maxLength={256}
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Jordan"
                  type="text"
                  id="first-name"
                  required
                />
              </div>
              <div className="ct-field">
                <label htmlFor="last-name" className="input-text-field">Last name</label>
                <input
                  className="ct-input site-input"
                  maxLength={256}
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Lee"
                  type="text"
                  id="last-name"
                  required
                />
              </div>
            </div>

            <div className="ct-field">
              <label htmlFor="emails" className="input-text-field">Email address</label>
              <input
                className="ct-input site-input"
                maxLength={256}
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@email.com"
                type="email"
                id="emails"
                required
              />
            </div>

            <div className="ct-field">
              <label htmlFor="field" className="input-text-field">How can we help?</label>
              <select
                id="field"
                name="field"
                value={formData.field}
                onChange={handleChange}
                required
                className="ct-input site-select"
              >
                <option value="">Select a topic…</option>
                <option value="Template Purchase & Licensing">Template Purchase & Licensing</option>
                <option value="Website & Domain Setup">Website & Domain Setup</option>
                <option value="Custom Integrations & Features">Custom Integrations & Features</option>
                <option value="Bespoke Flagship Engineering">Bespoke Flagship Engineering</option>
              </select>
            </div>

            <div className="ct-field">
              <label htmlFor="field-2" className="input-text-field">Message</label>
              <textarea
                className="ct-input text-area site-input"
                maxLength={5000}
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us a little more…"
                id="field-2"
                required
              />
            </div>

            {status === 'error' && (
              <div className="form_message-error site-form-fail" style={{ display: 'block', marginBottom: '16px' }}>
                <div>{errorMessage}</div>
              </div>
            )}

            <input
              type="submit"
              disabled={status === 'loading'}
              className="submit-button site-button"
              value={status === 'loading' ? 'Sending message...' : 'Send message'}
            />
          </div>
        </form>
      )}

      <div fade-in="true" className="ct-form-note">
        <div className="social-icon clr site-embed">
          <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <rect x="3" y="11" width="18" height="11" rx="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        <div>Your details are kept private and never shared.</div>
      </div>
    </div>
  );
}
