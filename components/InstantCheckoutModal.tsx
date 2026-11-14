'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface InstantCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateName: string;
  templateSlug: string;
  selectedPlan: 'monthly' | 'outright';
  monthlyPrice: number;
  setupFee: number;
  outrightPrice: number;
  whatsappNumber?: string;
}

export default function InstantCheckoutModal({
  isOpen,
  onClose,
  templateName,
  templateSlug,
  selectedPlan,
  monthlyPrice,
  setupFee,
  outrightPrice,
  whatsappNumber = '2349036193817',
}: InstantCheckoutModalProps) {
  // Amount Calculation
  const amountDue = selectedPlan === 'monthly' ? setupFee + monthlyPrice : outrightPrice;
  const formatNgn = (val: number) => `₦${val.toLocaleString()}`;

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [requestedDomain, setRequestedDomain] = useState('');

  // Processing & Success State
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState<any>(null);

  if (!isOpen) return null;

  const handlePayNow = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setErrorMessage('');

    try {
      // 1. Initialize Paystack transaction with backend
      const initRes = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateSlug,
          planType: selectedPlan.toUpperCase(),
          amountNgn: amountDue,
          customerName,
          customerEmail,
          customerPhone,
          businessName,
          requestedDomain,
          callbackUrl: `${typeof window !== 'undefined' ? window.location.origin : ''}/pay/callback`,
        }),
      });

      const initData = await initRes.json();
      if (!initData.success) {
        throw new Error(initData.error || 'Failed to initialize secure checkout.');
      }

      // Track Umami event
      if (typeof window !== 'undefined' && (window as any).umami) {
        (window as any).umami.track('Instant Checkout - Initiated Payment', {
          template: templateSlug,
          plan: selectedPlan,
          amount: amountDue,
        });
      }

      // 2. Route based on environment / Paystack mode
      if (initData.authorizationUrl) {
        // Live Paystack redirect
        window.location.href = initData.authorizationUrl;
      } else if (initData.isSimulation) {
        // Instant sandbox verification
        const verifyRes = await fetch('/api/paystack/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reference: initData.reference }),
        });

        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          setPaymentSuccess({
            ...verifyData,
            amount: amountDue,
            reference: initData.reference,
          });
        } else {
          throw new Error(verifyData.error || 'Verification encountered an error.');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment service error. Please try again or chat via WhatsApp.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(12, 11, 10, 0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        padding: '16px',
        overflowY: 'auto',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !processing) onClose();
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '520px',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: '28px 24px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(12, 11, 10, 0.08)',
          boxSizing: 'border-box',
          animation: 'fadeInModal 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          maxHeight: '92vh',
          overflowY: 'auto',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={processing}
          type="button"
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: '1px solid rgba(12, 11, 10, 0.1)',
            backgroundColor: '#f5f5f4',
            color: '#44403c',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            lineHeight: 1,
            transition: 'background-color 0.15s ease',
          }}
        >
          &times;
        </button>

        {paymentSuccess ? (
          /* ==============================================================
             SUCCESS / AUTO-PROVISIONED CLIENT PORTAL ACCESS SCREEN
             ============================================================== */
          <div style={{ textAlign: 'center', padding: '12px 4px' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: '0 6px 18px rgba(22, 163, 74, 0.18)',
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
                padding: '3px 12px',
                borderRadius: '100px',
                marginBottom: '10px',
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e' }}></span>
              Payment Confirmed &bull; Portal Provisioned
            </span>

            <h3
              style={{
                fontSize: '22px',
                fontWeight: 700,
                color: '#1c1917',
                margin: '0 0 6px',
                letterSpacing: '-0.02em',
              }}
            >
              Welcome, {paymentSuccess.client?.name || customerName}!
            </h3>

            <p style={{ color: '#57534e', fontSize: '13.5px', lineHeight: 1.55, margin: '0 0 20px' }}>
              Your account has been automatically provisioned for <strong>{templateName}</strong>. You are already logged in to your project portal.
            </p>

            {/* Portal Credentials Card */}
            <div
              style={{
                backgroundColor: '#18181b',
                color: '#f4f4f5',
                borderRadius: '14px',
                padding: '20px',
                textAlign: 'left',
                marginBottom: '20px',
                border: '1px solid #27272a',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#a1a1aa', fontWeight: 700 }}>
                  Client Portal Credentials
                </span>
                <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 600 }}>
                  &bull; Instant Session Active
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', paddingBottom: '8px', borderBottom: '1px solid #27272a' }}>
                <span style={{ color: '#a1a1aa' }}>Login Email:</span>
                <span style={{ fontWeight: 600, color: '#fafafa' }}>{paymentSuccess.client?.email || customerEmail}</span>
              </div>

              {paymentSuccess.client?.temporaryPassword && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #27272a', fontSize: '13px' }}>
                  <span style={{ color: '#a1a1aa' }}>Initial Password:</span>
                  <code style={{ fontSize: '14px', color: '#34d399', fontWeight: 700, backgroundColor: '#27272a', padding: '2px 8px', borderRadius: '4px' }}>
                    {paymentSuccess.client.temporaryPassword}
                  </code>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', paddingTop: '8px' }}>
                <span style={{ color: '#a1a1aa' }}>Amount Paid:</span>
                <span style={{ fontWeight: 700, color: '#34d399' }}>{formatNgn(amountDue)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link
                href="/portal"
                data-umami-event="Instant Checkout Success - Clicked Enter Portal"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '14px',
                  backgroundColor: '#1c1917',
                  color: '#ffffff',
                  borderRadius: '12px',
                  fontSize: '14.5px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
                  transition: 'background-color 0.15s ease',
                  boxSizing: 'border-box',
                }}
              >
                <span>Enter Client Portal &amp; Upload Brand Assets</span>
                <span>&rarr;</span>
              </Link>

              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                  `Hi aB Labs, I just completed payment of ${formatNgn(amountDue)} for the ${templateName} (${selectedPlan.toUpperCase()} plan, Ref: ${paymentSuccess.reference}). I am ready for Phase 1 setup!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                data-umami-event="Instant Checkout Success - Clicked Direct WhatsApp"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#f0fdf4',
                  color: '#15803d',
                  borderRadius: '12px',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  border: '1px solid #bbf7d0',
                  boxSizing: 'border-box',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.38c1.44.79 3.06 1.2 4.76 1.2h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm0 18.13h-.01c-1.52 0-3.01-.41-4.31-1.18l-.31-.18-3.2.84.85-3.12-.2-.32a8.19 8.19 0 0 1-1.26-4.36c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.41a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23z" />
                </svg>
                <span>Notify Engineering Desk on WhatsApp</span>
              </a>
            </div>
          </div>
        ) : (
          /* ==============================================================
             FRICTIONLESS INSTANT PAYMENT CHECKOUT FORM
             ============================================================== */
          <div>
            {/* Header Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '100px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', marginBottom: '12px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16a34a' }}></span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Instant Launch Checkout
              </span>
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1c1917', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
              Deploy {templateName}
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#78716c', lineHeight: 1.5 }}>
              Pay securely via Paystack to automatically provision your client portal and start your custom launch.
            </p>

            {/* Selected Plan Summary Banner */}
            <div
              style={{
                padding: '14px 16px',
                borderRadius: '12px',
                backgroundColor: '#faf8f5',
                border: '1px solid rgba(12, 11, 10, 0.08)',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#1c1917' }}>
                  {selectedPlan === 'monthly' ? 'Low-Friction Monthly Plan' : '100% Full Outright Ownership'}
                </div>
                <div style={{ fontSize: '11.5px', color: '#78716c', marginTop: '2px' }}>
                  {selectedPlan === 'monthly'
                    ? `${formatNgn(setupFee)} setup + ${formatNgn(monthlyPrice)}/mo`
                    : 'One-time investment &bull; Zero monthly software fees'}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#1c1917' }}>
                  {formatNgn(amountDue)}
                </div>
                <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#059669', textTransform: 'uppercase' }}>
                  Due Today
                </div>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fee2e2',
                  color: '#dc2626',
                  fontSize: '12.5px',
                  marginBottom: '14px',
                }}
              >
                {errorMessage}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handlePayNow} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#44403c', marginBottom: '4px' }}>
                  Full Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tunde Adebayo"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #d6d3d1',
                    fontSize: '13.5px',
                    color: '#1c1917',
                    boxSizing: 'border-box',
                    outline: 'none',
                    backgroundColor: '#ffffff',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#44403c', marginBottom: '4px' }}>
                  Email Address <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. tunde@company.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #d6d3d1',
                    fontSize: '13.5px',
                    color: '#1c1917',
                    boxSizing: 'border-box',
                    outline: 'none',
                    backgroundColor: '#ffffff',
                  }}
                />
                <span style={{ fontSize: '11px', color: '#78716c', marginTop: '3px', display: 'block' }}>
                  Your client portal login credentials and payment receipts are sent here.
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#44403c', marginBottom: '4px' }}>
                    WhatsApp / Phone <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="08012345678"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #d6d3d1',
                      fontSize: '13.5px',
                      color: '#1c1917',
                      boxSizing: 'border-box',
                      outline: 'none',
                      backgroundColor: '#ffffff',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#44403c', marginBottom: '4px' }}>
                    Business / Brand Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lumina Studios"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #d6d3d1',
                      fontSize: '13.5px',
                      color: '#1c1917',
                      boxSizing: 'border-box',
                      outline: 'none',
                      backgroundColor: '#ffffff',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#44403c', marginBottom: '4px' }}>
                  Preferred Custom Domain (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. mybrand.com.ng (or .online, .store, .site)"
                  value={requestedDomain}
                  onChange={(e) => setRequestedDomain(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #d6d3d1',
                    fontSize: '13.5px',
                    color: '#1c1917',
                    boxSizing: 'border-box',
                    outline: 'none',
                    backgroundColor: '#ffffff',
                  }}
                />
                <span style={{ fontSize: '11px', color: '#78716c', marginTop: '3px', display: 'block' }}>
                  1-year custom domain registration &amp; SSL included at zero extra cost.
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={processing}
                data-umami-event="Instant Checkout - Clicked Submit Payment"
                data-umami-event-template={templateSlug}
                data-umami-event-plan={selectedPlan}
                style={{
                  marginTop: '6px',
                  width: '100%',
                  padding: '14px 20px',
                  borderRadius: '100px',
                  border: 'none',
                  backgroundColor: processing ? '#78716c' : '#1c1917',
                  color: '#ffffff',
                  fontSize: '14.5px',
                  fontWeight: 700,
                  cursor: processing ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
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
                        width: '16px',
                        height: '16px',
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTop: '2px solid #ffffff',
                        borderRadius: '50%',
                        display: 'inline-block',
                        animation: 'spin 1s linear infinite',
                      }}
                    />
                    <span>Securing Paystack Session...</span>
                  </>
                ) : (
                  <>
                    <span>Pay {formatNgn(amountDue)} via Paystack &amp; Launch Portal</span>
                    <span style={{ fontSize: '16px' }}>&rarr;</span>
                  </>
                )}
              </button>

              {/* Trust & Guarantee strip */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '11.5px',
                  color: '#78716c',
                  textAlign: 'center',
                  marginTop: '4px',
                }}
              >
                <span>🔒 256-Bit SSL Encrypted</span>
                <span>&bull;</span>
                <span>Cards, Transfers &amp; USSD</span>
                <span>&bull;</span>
                <span>Instant Account Setup</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
