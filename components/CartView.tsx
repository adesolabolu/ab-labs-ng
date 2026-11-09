'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CartView() {
  const {
    items,
    removeItem,
    toggleSetupService,
    clearCart,
    subtotalNgn,
    subtotalUsd
  } = useCart();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !fullName) {
      alert('Please fill in your name and email address.');
      return;
    }

    setIsProcessing(true);
    // Simulate Paystack payment popup initiation
    setTimeout(() => {
      setIsProcessing(false);
      setOrderComplete(true);
      clearCart();
    }, 1800);
  };

  if (orderComplete) {
    return (
      <div style={{
        maxWidth: '680px',
        margin: '60px auto',
        padding: '48px 32px',
        background: '#fff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        textAlign: 'center',
        boxShadow: '0 10px 30px rgba(0,0,0,0.04)'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: '#dcfce7',
          color: '#16a34a',
          fontSize: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px'
        }}>
          ✓
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#111', marginBottom: '8px' }}>
          Payment &amp; Transfer Confirmed!
        </h2>
        <p style={{ color: '#666', fontSize: '15px', lineHeight: '1.6', marginBottom: '24px' }}>
          Thank you, <strong>{fullName}</strong>. A confirmation email with your repository invitation and documentation has been sent to <strong>{email}</strong>.
        </p>
        <div style={{
          padding: '16px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          fontSize: '13px',
          color: '#475569',
          marginBottom: '28px',
          textAlign: 'left'
        }}>
          <p style={{ margin: '0 0 6px 0', fontWeight: 600 }}>Next Steps:</p>
          <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
            <li>Accept your GitHub organization invite sent to your email.</li>
            <li>Clone your repository or deploy directly to Vercel in 1 click.</li>
            <li>Our engineering team will reach out via WhatsApp ({phone || 'your phone'}) for your deployment onboarding.</li>
          </ul>
        </div>
        <Link
          href="/shop"
          style={{
            display: 'inline-block',
            padding: '12px 28px',
            backgroundColor: '#111',
            color: '#fff',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 600
          }}
        >
          Return to Marketplace
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div style={{
        maxWidth: '560px',
        margin: '80px auto',
        padding: '60px 24px',
        background: '#fff',
        borderRadius: '16px',
        border: '1px solid #e5e5e5',
        textAlign: 'center'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: '#f4f4f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          color: '#71717a'
        }}>
          <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z"></path>
          </svg>
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111', marginBottom: '8px' }}>
          Your Cart is Empty
        </h2>
        <p style={{ color: '#71717a', fontSize: '14px', lineHeight: '1.6', marginBottom: '28px' }}>
          You haven't selected any website templates yet. Browse our 2026 catalog of production-ready digital flagships.
        </p>
        <Link
          href="/shop"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 28px',
            backgroundColor: '#111',
            color: '#fff',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 600,
            textDecoration: 'none'
          }}
        >
          Browse All Templates →
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1160px', margin: '40px auto 80px', padding: '0 20px' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '40px',
        alignItems: 'start'
      }}>
        {/* Left Column: Cart Items */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#111', margin: 0 }}>
              Order Items ({items.length})
            </h2>
            <button
              onClick={clearCart}
              style={{
                background: 'none',
                border: 'none',
                color: '#ef4444',
                fontSize: '13px',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              Clear Cart
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {items.map(({ template, setupService }) => (
              <div
                key={template.id}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '14px',
                  border: '1px solid #e5e5e5',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                }}
              >
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  {/* Thumbnail */}
                  <div style={{
                    width: '90px',
                    height: '70px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    backgroundColor: '#f4f4f5',
                    flexShrink: 0
                  }}>
                    <img
                      src={template.image}
                      alt={template.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  {/* Info */}
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          color: '#2563EB',
                          letterSpacing: '0.04em'
                        }}>
                          {template.categoryLabel}
                        </span>
                        <h3 style={{ margin: '2px 0 6px', fontSize: '16px', fontWeight: 700, color: '#111' }}>
                          {template.name}
                        </h3>
                      </div>

                      <button
                        onClick={() => removeItem(template.id)}
                        aria-label="Remove item"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#94a3b8',
                          cursor: 'pointer',
                          fontSize: '18px',
                          padding: '0 4px'
                        }}
                      >
                        ×
                      </button>
                    </div>

                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#111' }}>
                      ₦{template.priceNgn.toLocaleString()}
                      <span style={{ fontSize: '11px', color: '#71717a', marginLeft: '6px', fontWeight: 500 }}>
                        (≈ ${template.priceUsd} USD)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Included Deliverables Badge */}
                <div style={{
                  padding: '10px 14px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#475569',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <span>✓ Full Next.js 16 Source Code</span>
                  <span>✓ Lifetime License</span>
                  <span>✓ Paystack Integrated</span>
                  <span>✓ Step-by-Step Docs</span>
                </div>

                {/* Turnkey Deployment Add-On Option */}
                <div style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: setupService ? '1px solid #2563EB' : '1px dashed #cbd5e1',
                  backgroundColor: setupService ? '#eff6ff' : '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => toggleSetupService(template.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="checkbox"
                      checked={setupService}
                      onChange={() => {}} // Controlled by container onClick
                      style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                    />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
                        Turnkey Vercel Deployment &amp; Domain Setup
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>
                        Our engineers deploy and connect your custom domain within 24 hours.
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', whiteSpace: 'nowrap' }}>
                    +₦50,000
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Checkout & Summary */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '16px',
          border: '1px solid #e5e5e5',
          padding: '28px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          position: 'sticky',
          top: '20px'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#111', margin: '0 0 16px' }}>
            Checkout Summary
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', fontSize: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
              <span>Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
              <span style={{ fontWeight: 600, color: '#111' }}>₦{subtotalNgn.toLocaleString()}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
              <span>Processing &amp; VAT</span>
              <span style={{ fontWeight: 600, color: '#16a34a' }}>Free (₦0)</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
              <span>License Format</span>
              <span style={{ fontWeight: 600, color: '#111' }}>Single Commercial Use</span>
            </div>

            <div style={{
              height: '1px',
              backgroundColor: '#e2e8f0',
              margin: '8px 0'
            }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '16px', fontWeight: 700, color: '#111' }}>Total Amount</span>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#111', letterSpacing: '-0.02em' }}>
                  ₦{subtotalNgn.toLocaleString()}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>
                  ≈ ${subtotalUsd.toLocaleString()} USD
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Tunde Bakare"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Work Email * (For GitHub Access)
              </label>
              <input
                type="email"
                required
                placeholder="tunde@havenproperties.ng"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                WhatsApp Number (Optional for Onboarding)
              </label>
              <input
                type="tel"
                placeholder="+234 800 000 0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              style={{
                width: '100%',
                padding: '14px',
                marginTop: '8px',
                backgroundColor: isProcessing ? '#64748b' : '#059669',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: 700,
                cursor: isProcessing ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'background-color 0.2s ease'
              }}
            >
              {isProcessing ? 'Connecting to Paystack...' : 'Pay with Paystack ↗'}
            </button>
          </form>

          {/* Trust Guarantee Footnotes */}
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px', color: '#64748b' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>🔒</span>
              <span>256-Bit SSL Encrypted &amp; PCI-DSS Level 1 Compliant</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>⚡</span>
              <span>Instant GitHub Repository Transfer upon payment</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>💳</span>
              <span>Accepts Nigerian Cards, Bank Transfer, USSD &amp; Apple Pay</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
