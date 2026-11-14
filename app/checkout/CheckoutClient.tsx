'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { TemplateWithPricing } from '@/lib/template-pricing';

interface CheckoutClientProps {
  initialTemplate: TemplateWithPricing;
  initialPlan: 'monthly' | 'outright';
}

export default function CheckoutClient({
  initialTemplate,
  initialPlan,
}: CheckoutClientProps) {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'outright'>(initialPlan);
  const [template, setTemplate] = useState<TemplateWithPricing>(initialTemplate);

  // Form inputs (Lean, frictionless: Name, Email, WhatsApp, Business)
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [businessName, setBusinessName] = useState('');

  // Processing state
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Exact prices from database-backed template
  const monthlyPrice = Number(template?.monthlyNgn || 5000);
  const setupFee = Number(template?.setupFeeNgn || 15000);
  const outrightPrice = Number(template?.outrightNgn || template?.priceNgn || 50000);

  // Amount due today: setup fee only for monthly launch, full price for outright
  const amountDue = selectedPlan === 'monthly' ? setupFee : outrightPrice;
  const formatNgn = (val: number) => `₦${Number(val || 0).toLocaleString()}`;

  const handlePayNow = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setErrorMessage('');

    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const callbackUrl = `${origin}/pay/callback`;

      const initRes = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateSlug: template.slug,
          planType: selectedPlan.toUpperCase(),
          amountNgn: amountDue,
          customerName,
          customerEmail,
          customerPhone,
          businessName,
          callbackUrl,
        }),
      });

      const initData = await initRes.json();
      if (!initData.success) {
        throw new Error(initData.error || 'Failed to initialize Paystack checkout.');
      }

      // Track conversion in Umami
      if (typeof window !== 'undefined' && (window as any).umami) {
        (window as any).umami.track('Dedicated Checkout - Initiated Payment', {
          template: template.slug,
          plan: selectedPlan,
          amount: amountDue,
        });
      }

      if (initData.authorizationUrl) {
        // Redirect to Paystack live checkout
        window.location.href = initData.authorizationUrl;
      } else if (initData.isSimulation) {
        // In test/sandbox simulation, verify automatically and redirect to callback/portal
        const verifyRes = await fetch('/api/paystack/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reference: initData.reference }),
        });
        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          router.push(`/pay/callback?reference=${encodeURIComponent(initData.reference)}`);
        } else {
          throw new Error(verifyData.error || 'Verification encountered an error.');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment service error. Please try again or reach out on WhatsApp.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      {/* Return Navigation Link */}
      <div style={{ marginBottom: '24px' }}>
        <Link
          href={`/product/${template.slug}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            fontWeight: 600,
            color: '#78716c',
            textDecoration: 'none',
            transition: 'color 0.15s ease',
          }}
        >
          <span>&larr;</span>
          <span>Back to {template.name}</span>
        </Link>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: '100px',
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            marginBottom: '10px',
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16a34a' }}></span>
          <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Instant Launch Checkout
          </span>
        </div>

        <h1
          style={{
            fontSize: '32px',
            fontWeight: 800,
            color: '#1c1917',
            letterSpacing: '-0.03em',
            margin: '0 0 8px',
          }}
        >
          Deploy {template.name}
        </h1>
        <p style={{ margin: 0, fontSize: '15px', color: '#78716c', maxWidth: '640px', lineHeight: 1.55 }}>
          Complete your launch order below. Your client portal will be automatically provisioned so you can upload brand assets and track live production.
        </p>
      </div>

      {/* Two-Column Checkout Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
          gap: '32px',
          alignItems: 'start',
        }}
        className="checkout-grid-container"
      >
        {/* LEFT COLUMN: Clean Customer Form */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '32px 28px',
            border: '1px solid rgba(12, 11, 10, 0.08)',
            boxShadow: '0 12px 36px rgba(12, 11, 10, 0.04)',
          }}
        >
          {/* Plan Selection: Two Dedicated Boxes (Setup Fee Only vs Full Build Upfront) */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <label style={{ fontSize: '13.5px', fontWeight: 700, color: '#1c1917' }}>
                Select Payment Option
              </label>
              <span style={{ fontSize: '12px', color: '#78716c' }}>
                {selectedPlan === 'monthly' ? 'Setup fee model selected' : 'Full build upfront selected'}
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
                gap: '12px',
              }}
            >
              {/* BOX 1: Setup Fee Only (Monthly Launch) */}
              <div
                onClick={() => setSelectedPlan('monthly')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setSelectedPlan('monthly');
                }}
                style={{
                  cursor: 'pointer',
                  padding: '16px 16px',
                  borderRadius: '14px',
                  border: selectedPlan === 'monthly' ? '2px solid #1c1917' : '1px solid #e7e5e4',
                  backgroundColor: selectedPlan === 'monthly' ? '#ffffff' : '#fafaf9',
                  boxShadow: selectedPlan === 'monthly' ? '0 4px 14px rgba(0, 0, 0, 0.06)' : 'none',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          border: selectedPlan === 'monthly' ? '5px solid #1c1917' : '2px solid #d6d3d1',
                          backgroundColor: '#ffffff',
                          boxSizing: 'border-box',
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1c1917' }}>
                        Setup Fee Only
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: '10.5px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        color: '#166534',
                        backgroundColor: '#dcfce7',
                        padding: '2px 7px',
                        borderRadius: '6px',
                      }}
                    >
                      Monthly Plan
                    </span>
                  </div>

                  <div style={{ marginTop: '4px' }}>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#1c1917', lineHeight: 1.1 }}>
                      {formatNgn(setupFee)}
                      <span style={{ fontSize: '12px', fontWeight: 500, color: '#57534e', marginLeft: '4px' }}>
                        Due Today
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#15803d', marginTop: '4px' }}>
                      + {formatNgn(monthlyPrice)}/mo maintenance
                    </div>
                  </div>

                  <p style={{ margin: '8px 0 0', fontSize: '11.5px', color: '#78716c', lineHeight: 1.45 }}>
                    Pay only the setup fee today to start your build. Monthly maintenance begins only after your site is completed, approved, and live.
                  </p>
                </div>
              </div>

              {/* BOX 2: Full Build Upfront (Outright Ownership) */}
              <div
                onClick={() => setSelectedPlan('outright')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setSelectedPlan('outright');
                }}
                style={{
                  cursor: 'pointer',
                  padding: '16px 16px',
                  borderRadius: '14px',
                  border: selectedPlan === 'outright' ? '2px solid #1c1917' : '1px solid #e7e5e4',
                  backgroundColor: selectedPlan === 'outright' ? '#ffffff' : '#fafaf9',
                  boxShadow: selectedPlan === 'outright' ? '0 4px 14px rgba(0, 0, 0, 0.06)' : 'none',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          border: selectedPlan === 'outright' ? '5px solid #1c1917' : '2px solid #d6d3d1',
                          backgroundColor: '#ffffff',
                          boxSizing: 'border-box',
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1c1917' }}>
                        Full Build Upfront
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: '10.5px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        color: '#0369a1',
                        backgroundColor: '#e0f2fe',
                        padding: '2px 7px',
                        borderRadius: '6px',
                      }}
                    >
                      100% Outright
                    </span>
                  </div>

                  <div style={{ marginTop: '4px' }}>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#1c1917', lineHeight: 1.1 }}>
                      {formatNgn(outrightPrice)}
                      <span style={{ fontSize: '12px', fontWeight: 500, color: '#57534e', marginLeft: '4px' }}>
                        Due Today
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#0369a1', marginTop: '4px' }}>
                      0 recurring monthly fees
                    </div>
                  </div>

                  <p style={{ margin: '8px 0 0', fontSize: '11.5px', color: '#78716c', lineHeight: 1.45 }}>
                    100% full ownership with zero monthly fees. GitHub repository transfer, 1-year custom domain &amp; SSL included.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '10px',
                backgroundColor: '#fef2f2',
                border: '1px solid #fee2e2',
                color: '#dc2626',
                fontSize: '13px',
                marginBottom: '20px',
              }}
            >
              {errorMessage}
            </div>
          )}

          {/* Clean Customer Intake Form */}
          <form onSubmit={handlePayNow} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 700, color: '#1c1917', marginBottom: '4px' }}>
                Client Details &amp; Portal Account
              </label>
              <p style={{ margin: '0 0 14px', fontSize: '12.5px', color: '#78716c' }}>
                Your account is provisioned automatically with these details.
              </p>
            </div>

            <div>
              <label htmlFor="customerName" style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#44403c', marginBottom: '6px' }}>
                Full Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                id="customerName"
                type="text"
                required
                placeholder="e.g. Tunde Adebayo"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '1px solid #d6d3d1',
                  fontSize: '14px',
                  color: '#1c1917',
                  boxSizing: 'border-box',
                  outline: 'none',
                  backgroundColor: '#ffffff',
                }}
              />
            </div>

            <div>
              <label htmlFor="customerEmail" style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#44403c', marginBottom: '6px' }}>
                Email Address <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                id="customerEmail"
                type="email"
                required
                placeholder="e.g. tunde@company.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '1px solid #d6d3d1',
                  fontSize: '14px',
                  color: '#1c1917',
                  boxSizing: 'border-box',
                  outline: 'none',
                  backgroundColor: '#ffffff',
                }}
              />
              <span style={{ fontSize: '11.5px', color: '#78716c', marginTop: '4px', display: 'block' }}>
                Your client portal login credentials and payment receipts are sent to this address.
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label htmlFor="customerPhone" style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#44403c', marginBottom: '6px' }}>
                  WhatsApp / Phone <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  id="customerPhone"
                  type="tel"
                  required
                  placeholder="08012345678"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '1px solid #d6d3d1',
                    fontSize: '14px',
                    color: '#1c1917',
                    boxSizing: 'border-box',
                    outline: 'none',
                    backgroundColor: '#ffffff',
                  }}
                />
              </div>

              <div>
                <label htmlFor="businessName" style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#44403c', marginBottom: '6px' }}>
                  Business / Brand Name
                </label>
                <input
                  id="businessName"
                  type="text"
                  placeholder="e.g. Lumina Studios"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '1px solid #d6d3d1',
                    fontSize: '14px',
                    color: '#1c1917',
                    boxSizing: 'border-box',
                    outline: 'none',
                    backgroundColor: '#ffffff',
                  }}
                />
              </div>
            </div>

            {/* Pay Now Button */}
            <button
              type="submit"
              disabled={processing}
              style={{
                marginTop: '12px',
                width: '100%',
                padding: '16px 24px',
                borderRadius: '100px',
                border: 'none',
                backgroundColor: processing ? '#78716c' : '#1c1917',
                color: '#ffffff',
                fontSize: '15px',
                fontWeight: 700,
                cursor: processing ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.18)',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (!processing) e.currentTarget.style.backgroundColor = '#9a6843';
              }}
              onMouseLeave={(e) => {
                if (!processing) e.currentTarget.style.backgroundColor = '#1c1917';
              }}
            >
              {processing ? (
                <>
                  <span
                    style={{
                      width: '18px',
                      height: '18px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTop: '2px solid #ffffff',
                      borderRadius: '50%',
                      display: 'inline-block',
                      animation: 'spin 1s linear infinite',
                    }}
                  />
                  <span>Connecting to Paystack...</span>
                </>
              ) : (
                <>
                  <span>
                    Pay {formatNgn(amountDue)} &amp; {selectedPlan === 'monthly' ? 'Start Build (Setup Fee)' : 'Start Full Build'}
                  </span>
                  <span style={{ fontSize: '18px' }}>&rarr;</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: Order Summary Card */}
        <div style={{ position: 'sticky', top: '90px' }}>
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '28px 24px',
              border: '1px solid rgba(12, 11, 10, 0.08)',
              boxShadow: '0 12px 36px rgba(12, 11, 10, 0.04)',
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1c1917', margin: '0 0 16px', letterSpacing: '-0.01em' }}>
              Order Summary
            </h3>

            {/* Template Artwork Card */}
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #f5f5f4', marginBottom: '16px' }}>
              <img
                src={template.image}
                alt={template.name}
                style={{
                  width: '72px',
                  height: '52px',
                  borderRadius: '8px',
                  objectFit: 'cover',
                  border: '1px solid #e7e5e4',
                }}
              />
              <div>
                <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#1c1917' }}>
                  {template.name}
                </div>
                <div style={{ fontSize: '12px', color: '#78716c' }}>
                  {template.categoryLabel} Foundation
                </div>
              </div>
            </div>

            {/* Breakdown Line Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#57534e' }}>Selected Model:</span>
                <span style={{ fontWeight: 600, color: '#1c1917' }}>
                  {selectedPlan === 'monthly' ? 'Monthly Launch' : '100% Outright Ownership'}
                </span>
              </div>

              {selectedPlan === 'monthly' ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#57534e' }}>Deployment Setup Fee:</span>
                    <span style={{ fontWeight: 600, color: '#1c1917' }}>{formatNgn(setupFee)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#57534e' }}>Monthly Maintenance:</span>
                    <span style={{ fontWeight: 600, color: '#15803d' }}>
                      {formatNgn(monthlyPrice)}/mo (billed only after live)
                    </span>
                  </div>
                </>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#57534e' }}>Full Codebase &amp; License:</span>
                  <span style={{ fontWeight: 600, color: '#1c1917' }}>{formatNgn(outrightPrice)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#57534e' }}>1-Year Custom Domain &amp; SSL:</span>
                <span style={{ fontWeight: 600, color: '#16a34a' }}>FREE (₦0)</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#57534e' }}>Client Portal Access:</span>
                <span style={{ fontWeight: 600, color: '#16a34a' }}>INSTANT</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  borderTop: '1px solid #f5f5f4',
                  fontSize: '16px',
                  fontWeight: 800,
                  color: '#1c1917',
                }}
              >
                <span>Total Due Today:</span>
                <span style={{ color: '#1c1917' }}>{formatNgn(amountDue)}</span>
              </div>
            </div>

            {/* 8-Hour SLA Guarantee Box */}
            <div
              style={{
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '12px',
                padding: '14px',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <span style={{ fontSize: '16px' }}>⚡</span>
                <strong style={{ fontSize: '13px', color: '#166534' }}>8-Hour Onboarding SLA</strong>
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: '#15803d', lineHeight: 1.5 }}>
                Our engineering team will contact you via WhatsApp and Email within <strong>8 hours</strong> of payment to review your logo and start Phase 1 customization.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
