'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { TEMPLATES } from '@/data/templates';

interface PaymentLinkData {
  id: string;
  title: string;
  client_name?: string;
  client_email?: string;
  client_phone?: string;
  template_slug: string;
  template_name: string;
  plan_type: 'MONTHLY' | 'OUTRIGHT' | 'CUSTOM';
  setup_fee_ngn: number;
  monthly_price_ngn: number;
  outright_price_ngn: number;
  amount_due_now_ngn: number;
  notes?: string;
  status: 'ACTIVE' | 'PAID' | 'EXPIRED';
}

export default function OneLinkCheckoutPage() {
  const params = useParams();
  const linkId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [linkData, setLinkData] = useState<PaymentLinkData | null>(null);

  // Form State
  const [selectedPlan, setSelectedPlan] = useState<'MONTHLY' | 'OUTRIGHT'>('MONTHLY');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  // Processing & Success State
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<any>(null);

  useEffect(() => {
    if (!linkId) return;

    fetch(`/api/pay/${linkId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.link) {
          setLinkData(data.link);
          setSelectedPlan(data.link.plan_type === 'OUTRIGHT' ? 'OUTRIGHT' : 'MONTHLY');
          setCustomerName(data.link.client_name || '');
          setCustomerEmail(data.link.client_email || '');
          setCustomerPhone(data.link.client_phone || '');
        } else {
          setError(data.error || 'Invalid or expired payment link.');
        }
      })
      .catch(err => {
        setError('Failed to connect to checkout services.');
      })
      .finally(() => setLoading(false));
  }, [linkId]);

  const template = linkData ? TEMPLATES.find(t => t.slug === linkData.template_slug) : null;

  const formatNgn = (val: number) => `₦${Number(val || 0).toLocaleString()}`;

  const currentAmountDue = selectedPlan === 'MONTHLY'
    ? (Number(linkData?.setup_fee_ngn || 0) + Number(linkData?.monthly_price_ngn || 0))
    : Number(linkData?.outright_price_ngn || 0);

  const handlePayNow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerEmail || !customerName) {
      alert('Please fill in your name and email.');
      return;
    }

    setProcessing(true);
    try {
      // 1. Initialize with backend
      const initRes = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          linkId,
          templateSlug: linkData?.template_slug,
          planType: selectedPlan,
          amountNgn: currentAmountDue,
          customerName,
          customerEmail,
          customerPhone,
          businessName,
        }),
      });

      const initData = await initRes.json();
      if (!initData.success) {
        throw new Error(initData.error || 'Failed to initialize payment.');
      }

      if (initData.isSimulation) {
        // Complete via instant sandbox verification
        const verifyRes = await fetch('/api/paystack/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reference: initData.reference }),
        });
        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          setPaymentSuccess({
            ...verifyData,
            amount: currentAmountDue,
            reference: initData.reference,
          });
        } else {
          throw new Error(verifyData.error || 'Verification failed.');
        }
      } else if (initData.authorizationUrl) {
        // Redirect to Paystack secure checkout
        window.location.href = initData.authorizationUrl;
      }
    } catch (err: any) {
      alert(`Checkout Notice: ${err.message}`);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '36px', height: '36px', border: '3px solid #e5e7eb', borderTop: '3px solid #111827', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#6b7280', fontSize: '14px', fontWeight: 600 }}>Loading custom checkout...</p>
        </div>
      </div>
    );
  }

  if (error || !linkData) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'sans-serif' }}>
        <div style={{ maxWidth: '480px', width: '100%', textAlign: 'center', padding: '36px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #fee2e2' }}>
          <div style={{ width: '48px', height: '48px', backgroundColor: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#dc2626' }}>
            ✕
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>Payment Link Unavailable</h2>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>{error || 'This link may have already been used, expired, or does not exist.'}</p>
          <Link href="/shop" style={{ display: 'inline-block', padding: '10px 20px', backgroundColor: '#111827', color: '#ffffff', borderRadius: '8px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
            Browse designs
          </Link>
        </div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'sans-serif', backgroundColor: '#fafaf9' }}>
        <div style={{ maxWidth: '540px', width: '100%', backgroundColor: '#ffffff', padding: '40px', borderRadius: '20px', border: '1px solid #e5e7eb', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', textAlign: 'center' }}>
          <div style={{ width: '56px', height: '56px', backgroundColor: '#ecfdf5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#059669', fontSize: '24px' }}>
            ✓
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', marginBottom: '6px' }}>Launch Payment Confirmed!</h2>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
            Your account has been automatically provisioned. We are preparing your live digital foundation.
          </p>

          <div style={{ backgroundColor: '#f9fafb', borderRadius: '12px', padding: '20px', textAlign: 'left', marginBottom: '20px', border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #e5e7eb', fontSize: '13px' }}>
              <span style={{ color: '#6b7280' }}>Reference:</span>
              <span style={{ fontWeight: 700, color: '#111827' }}>{paymentSuccess.reference}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e5e7eb', fontSize: '13px' }}>
              <span style={{ color: '#6b7280' }}>Registered Client:</span>
              <span style={{ fontWeight: 700, color: '#111827' }}>{paymentSuccess.client.name}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e5e7eb', fontSize: '13px' }}>
              <span style={{ color: '#6b7280' }}>Assigned Domain:</span>
              <span style={{ fontWeight: 700, color: '#059669' }}>{paymentSuccess.client.domainName || 'Custom Domain (Provisioning)'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', fontSize: '13px' }}>
              <span style={{ color: '#6b7280' }}>Domain Included:</span>
              <span style={{ fontWeight: 700, color: '#111827' }}>1 Year Active Cycle</span>
            </div>
          </div>

          {/* 8-Hour Contact SLA Banner */}
          <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #86efac', borderRadius: '12px', padding: '16px', marginBottom: '20px', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '18px' }}>⚡</span>
              <strong style={{ fontSize: '14px', color: '#166534' }}>8-Hour Onboarding &amp; Demo SLA Guarantee</strong>
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: '#15803d', lineHeight: 1.5 }}>
              Our engineering team will contact you via WhatsApp and Email within <strong>8 hours</strong> to review your brand details and share your Phase 1 interactive demo prototype.
            </p>
          </div>

          <a
            href={`https://wa.me/2348123456789?text=${encodeURIComponent(`Hi aB Labs, I just completed payment for reference ${paymentSuccess.reference} (${paymentSuccess.client.name}). Looking forward to the onboarding!`)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              width: '100%',
              padding: '14px',
              backgroundColor: '#16a34a',
              color: '#ffffff',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: 700,
              textDecoration: 'none',
              boxSizing: 'border-box',
            }}
          >
            Connect on WhatsApp with Engineering
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fafaf9', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        
        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link href="/" style={{ fontSize: '24px', fontWeight: 900, color: '#111827', textDecoration: 'none', letterSpacing: '-0.04em' }}>
            aB Labs
          </Link>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#111827', marginTop: '12px' }}>
            {linkData.title}
          </h1>
          {linkData.client_name && (
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0' }}>
              Exclusively configured for <strong>{linkData.client_name}</strong>
            </p>
          )}
        </div>

        {/* 2-Column Checkout Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px', alignItems: 'start' }}>
          
          {/* Left Column: Scope & Package Summary */}
          <div style={{ backgroundColor: '#ffffff', padding: '28px', borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#111827', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              What you're ordering
            </h2>

            {template && (
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', paddingBottom: '20px', borderBottom: '1px solid #e5e7eb', marginBottom: '20px' }}>
                <img
                  src={template.image}
                  alt={template.name}
                  style={{ width: '88px', height: '64px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: 0 }}>
                    {template.name}
                  </h3>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: '2px 0 6px' }}>
                    {template.categoryLabel}
                  </p>
                  {template.demoUrl && (
                    <a href={template.demoUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
                      See the live demo ↗
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Interactive Plan Selector */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Choose Payment Structure
                </span>
                <span style={{ fontSize: '18px', fontWeight: 900, color: '#111827' }}>
                  {formatNgn(currentAmountDue)}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Monthly Plan Card */}
                <div
                  onClick={() => setSelectedPlan('MONTHLY')}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: selectedPlan === 'MONTHLY' ? '2px solid #059669' : '1px solid #e5e7eb',
                    backgroundColor: selectedPlan === 'MONTHLY' ? '#f0fdf4' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '16px', height: '16px', borderRadius: '50%', border: selectedPlan === 'MONTHLY' ? '5px solid #059669' : '2px solid #d1d5db', display: 'inline-block' }} />
                      <strong style={{ fontSize: '14px', color: '#111827' }}>Monthly Retainer Plan</strong>
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#059669' }}>
                      {formatNgn(Number(linkData.setup_fee_ngn) + Number(linkData.monthly_price_ngn))} due now
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: '6px 0 0 24px', lineHeight: 1.4 }}>
                    Includes ₦{Number(linkData.setup_fee_ngn).toLocaleString()} one-time setup fee + ₦{Number(linkData.monthly_price_ngn).toLocaleString()}/month hosting &amp; maintenance.
                  </p>
                </div>

                {/* Outright Ownership Card */}
                <div
                  onClick={() => setSelectedPlan('OUTRIGHT')}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: selectedPlan === 'OUTRIGHT' ? '2px solid #059669' : '1px solid #e5e7eb',
                    backgroundColor: selectedPlan === 'OUTRIGHT' ? '#f0fdf4' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '16px', height: '16px', borderRadius: '50%', border: selectedPlan === 'OUTRIGHT' ? '5px solid #059669' : '2px solid #d1d5db', display: 'inline-block' }} />
                      <strong style={{ fontSize: '14px', color: '#111827' }}>100% Outright Buyout</strong>
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#111827' }}>
                      {formatNgn(Number(linkData.outright_price_ngn))}
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: '6px 0 0 24px', lineHeight: 1.4 }}>
                    You own it outright — code handover included. Zero monthly builder or maintenance fees.
                  </p>
                </div>
              </div>
            </div>

            {/* Included Value Points */}
            <div style={{ backgroundColor: '#f9fafb', borderRadius: '12px', padding: '16px', border: '1px solid #e5e7eb' }}>
              <p style={{ fontSize: '12px', fontWeight: 700, color: '#374151', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Included in your build:
              </p>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#4b5563', lineHeight: 1.7 }}>
                <li><strong>1-Year Custom Domain Included</strong> (.com.ng, .online, .store, .site &amp; 5 others)</li>
                <li><strong>Personalized Business Email</strong> (e.g. hello@yourbrand.com.ng) set up on your new domain</li>
                <li>Automated HTTPS SSL security certificates</li>
                <li>Cloud server hosting &amp; edge CDN distribution</li>
                <li>Direct WhatsApp lead routing &amp; consultation intake</li>
                <li>Mobile-responsive UI audit across iOS &amp; Android</li>
              </ul>
            </div>

            {linkData.notes && (
              <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe', fontSize: '12px', color: '#1e40af' }}>
                <strong>Special Note:</strong> {linkData.notes}
              </div>
            )}
          </div>

          {/* Right Column: Checkout Intake & Pay Form */}
          <div style={{ backgroundColor: '#ffffff', padding: '28px', borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#111827', marginBottom: '6px' }}>
              Client Onboarding Details
            </h2>
            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '20px' }}>
              These details will be used to automatically provision your client account and register your domain.
            </p>

            <form onSubmit={handlePayNow} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Tunde Adebayo"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                  Official Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="tunde@yourcompany.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                  WhatsApp Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="08012345678"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                  Brand / Business Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Adebayo Orthodontics"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginTop: '12px' }}>
                <button
                  type="submit"
                  disabled={processing}
                  style={{
                    width: '100%',
                    padding: '14px',
                    backgroundColor: processing ? '#9ca3af' : '#111827',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '15px',
                    fontWeight: 800,
                    cursor: processing ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                >
                  {processing ? 'Connecting Paystack Gateway...' : `Pay ${formatNgn(currentAmountDue)} with Paystack`}
                </button>
              </div>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
