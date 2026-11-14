'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { TEMPLATES, type Template } from '@/data/templates';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const templateSlugParam = searchParams?.get('template') || 'lumina-lighting-lamps';
  const planParam = searchParams?.get('plan')?.toLowerCase() === 'outright' ? 'outright' : 'monthly';

  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'outright'>(planParam);
  const [template, setTemplate] = useState<Template | null>(null);
  const [loadingTemplate, setLoadingTemplate] = useState(true);

  // Form inputs
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [requestedDomain, setRequestedDomain] = useState('');

  // Processing state
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Find template by slug
    const matched = TEMPLATES.find((t) => t.slug === templateSlugParam || t.id === templateSlugParam) || TEMPLATES[0];
    setTemplate(matched);
    setLoadingTemplate(false);
  }, [templateSlugParam]);

  const monthlyPrice = template?.monthlyNgn || 5000;
  const setupFee = template?.setupFeeNgn || 15000;
  const outrightPrice = template?.outrightNgn || template?.priceNgn || 50000;

  const amountDue = selectedPlan === 'monthly' ? setupFee + monthlyPrice : outrightPrice;
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
          templateSlug: template?.slug || templateSlugParam,
          planType: selectedPlan.toUpperCase(),
          amountNgn: amountDue,
          customerName,
          customerEmail,
          customerPhone,
          businessName,
          requestedDomain,
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
          template: template?.slug,
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
    <div className="page-wrapper" style={{ minHeight: '100vh', backgroundColor: '#faf8f5' }}>
      <Navbar />

      <main style={{ maxWidth: '1160px', margin: '0 auto', padding: '40px 20px 80px' }}>
        {/* Breadcrumb / Return Link */}
        <div style={{ marginBottom: '24px' }}>
          <Link
            href={template ? `/product/${template.slug}` : '/shop'}
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
            <span>Back to {template?.name || 'Templates'}</span>
          </Link>
        </div>

        {/* Page Title & Subtitle */}
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
            Deploy {template?.name || 'Your Website Foundation'}
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
          {/* LEFT COLUMN: The Checkout Form */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '32px 28px',
              border: '1px solid rgba(12, 11, 10, 0.08)',
              boxShadow: '0 12px 36px rgba(12, 11, 10, 0.04)',
            }}
          >
            {/* Step 1: Plan Toggle Selection */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1c1917', marginBottom: '12px', letterSpacing: '-0.01em' }}>
                1. Select Your Launch Plan
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {/* Monthly Plan Card */}
                <div
                  onClick={() => setSelectedPlan('monthly')}
                  role="button"
                  tabIndex={0}
                  style={{
                    cursor: 'pointer',
                    padding: '16px',
                    borderRadius: '12px',
                    border: selectedPlan === 'monthly' ? '2px solid #1c1917' : '1px solid #e7e5e4',
                    backgroundColor: selectedPlan === 'monthly' ? '#fafaf9' : '#ffffff',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1c1917' }}>Monthly Launch</span>
                    <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#166534', backgroundColor: '#dcfce7', padding: '2px 6px', borderRadius: '4px' }}>
                      Low Friction
                    </span>
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#1c1917', marginBottom: '2px' }}>
                    {formatNgn(setupFee + monthlyPrice)}
                  </div>
                  <div style={{ fontSize: '11px', color: '#78716c' }}>
                    {formatNgn(setupFee)} setup + {formatNgn(monthlyPrice)}/mo
                  </div>
                </div>

                {/* Outright Plan Card */}
                <div
                  onClick={() => setSelectedPlan('outright')}
                  role="button"
                  tabIndex={0}
                  style={{
                    cursor: 'pointer',
                    padding: '16px',
                    borderRadius: '12px',
                    border: selectedPlan === 'outright' ? '2px solid #1c1917' : '1px solid #e7e5e4',
                    backgroundColor: selectedPlan === 'outright' ? '#fafaf9' : '#ffffff',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1c1917' }}>Outright Purchase</span>
                    <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#0369a1', backgroundColor: '#e0f2fe', padding: '2px 6px', borderRadius: '4px' }}>
                      100% Ownership
                    </span>
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#1c1917', marginBottom: '2px' }}>
                    {formatNgn(outrightPrice)}
                  </div>
                  <div style={{ fontSize: '11px', color: '#78716c' }}>
                    One-time payment &bull; Zero monthly fees
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

            {/* Step 2: Customer Intake Form */}
            <form onSubmit={handlePayNow} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1c1917', marginBottom: '12px' }}>
                  2. Account &amp; Provisioning Details
                </label>
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

              <div>
                <label htmlFor="domainChoice" style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#44403c', marginBottom: '6px' }}>
                  Desired Custom Domain (Optional)
                </label>
                <input
                  id="domainChoice"
                  type="text"
                  placeholder="e.g. mybrand.com.ng (or .online, .store, .site)"
                  value={requestedDomain}
                  onChange={(e) => setRequestedDomain(e.target.value)}
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
                  1-year custom domain registration, DNS wiring &amp; SSL certificate included.
                </span>
              </div>

              {/* Pay Now Button */}
              <button
                type="submit"
                disabled={processing}
                data-umami-event="Dedicated Checkout - Clicked Paystack Checkout"
                data-umami-event-template={template?.slug}
                data-umami-event-plan={selectedPlan}
                style={{
                  marginTop: '10px',
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
                    <span>Securing Paystack Gateway...</span>
                  </>
                ) : (
                  <>
                    <span>Pay {formatNgn(amountDue)} via Paystack &amp; Launch Portal</span>
                    <span style={{ fontSize: '18px' }}>&rarr;</span>
                  </>
                )}
              </button>

              {/* Trust Indicators */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  fontSize: '12px',
                  color: '#78716c',
                  textAlign: 'center',
                  marginTop: '4px',
                }}
              >
                <span>🔒 256-Bit SSL Encrypted</span>
                <span>&bull;</span>
                <span>Official Paystack Gateway</span>
                <span>&bull;</span>
                <span>Instant Account Setup</span>
              </div>
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

              {/* Template Preview Card */}
              {template && (
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
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#1c1917' }}>
                      {template.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#78716c' }}>
                      {template.categoryLabel} Foundation
                    </div>
                  </div>
                </div>
              )}

              {/* Breakdown Line Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#57534e' }}>Selected Model:</span>
                  <span style={{ fontWeight: 600, color: '#1c1917' }}>
                    {selectedPlan === 'monthly' ? 'Monthly Launch Plan' : '100% Outright Ownership'}
                  </span>
                </div>

                {selectedPlan === 'monthly' ? (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#57534e' }}>Deployment Setup Fee:</span>
                      <span style={{ fontWeight: 600, color: '#1c1917' }}>{formatNgn(setupFee)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#57534e' }}>First Month Subscription:</span>
                      <span style={{ fontWeight: 600, color: '#1c1917' }}>{formatNgn(monthlyPrice)}</span>
                    </div>
                  </>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#57534e' }}>Codebase &amp; License:</span>
                    <span style={{ fontWeight: 600, color: '#1c1917' }}>{formatNgn(outrightPrice)}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#57534e' }}>1-Year Custom Domain &amp; SSL:</span>
                  <span style={{ fontWeight: 600, color: '#16a34a' }}>FREE (₦0)</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#57534e' }}>Client Portal Provisioning:</span>
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
      </main>

      <Footer />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: '#78716c', fontSize: '14px' }}>Loading launch checkout...</p>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
