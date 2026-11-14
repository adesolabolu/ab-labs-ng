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
        <div className="form_message-success site-form-done" style={{ display: 'block' }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎉</div>
          <h4 style={{ fontSize: '18px', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>Thank you!</h4>
          <p style={{ color: '#a1a1aa', fontSize: '14px', lineHeight: 1.6 }}>
            Your submission has been received. Our engineering team will review it and reply within 24 hours.
          </p>
          <button
            onClick={() => setStatus('idle')}
            className="site-button"
            style={{ marginTop: '16px', padding: '8px 16px', fontSize: '13px' }}
          >
            Send another message
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
