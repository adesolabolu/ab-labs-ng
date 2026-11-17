'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function PaystackCallbackContent() {
  const searchParams = useSearchParams();
  const reference = searchParams?.get('reference') || searchParams?.get('trxref');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!reference) {
      setError('No transaction reference found in callback parameters.');
      setLoading(false);
      return;
    }

    // Verify payment reference with backend
    fetch('/api/paystack/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reference }),
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setData(resData);
        } else {
          setError(resData.error || 'Payment verification failed at Paystack.');
        }
      })
      .catch((err) => {
        setError('Network error while verifying payment. Please contact support.');
      })
      .finally(() => setLoading(false));
  }, [reference]);

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '3px solid #e7e5e4',
              borderTop: '3px solid #1c1917',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px',
            }}
          />
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1c1917', margin: '0 0 6px' }}>
            Verifying Paystack Transaction...
          </h3>
          <p style={{ fontSize: '13.5px', color: '#78716c', margin: 0 }}>
            Provisioning your client portal and activating your project workspace.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'sans-serif' }}>
        <div style={{ maxWidth: '480px', width: '100%', backgroundColor: '#ffffff', padding: '36px 24px', borderRadius: '18px', border: '1px solid #fee2e2', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
          <div style={{ width: '50px', height: '50px', backgroundColor: '#fef2f2', borderRadius: '50%', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '24px' }}>
            &times;
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1c1917', margin: '0 0 8px' }}>
            Verification Encountered an Issue
          </h2>
          <p style={{ fontSize: '13.5px', color: '#78716c', margin: '0 0 20px', lineHeight: 1.5 }}>
            {error}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <a
              href={`https://wa.me/2349036193817?text=${encodeURIComponent(`Hi aB Labs, I completed payment on Paystack (Ref: ${reference || 'unknown'}), but the verification returned: ${error}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                padding: '12px',
                borderRadius: '10px',
                backgroundColor: '#16a34a',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '13.5px',
                textDecoration: 'none',
              }}
            >
              Resolve on WhatsApp (+234 903 619 3817) &rarr;
            </a>
            <Link
              href="/shop"
              style={{
                display: 'block',
                padding: '12px',
                borderRadius: '10px',
                backgroundColor: '#f5f5f4',
                color: '#44403c',
                fontWeight: 600,
                fontSize: '13px',
                textDecoration: 'none',
              }}
            >
              Back to Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const client = data?.client;
  const firstName = client?.name ? String(client.name).trim().split(' ')[0] : '';

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#faf8f5' }}>
      <div style={{ maxWidth: '480px', width: '100%', backgroundColor: '#ffffff', padding: '32px 22px', borderRadius: '18px', border: '1px solid rgba(12,11,10,0.08)', boxShadow: '0 14px 34px rgba(12,11,10,0.06)', textAlign: 'center', boxSizing: 'border-box' }}>
        <div
          style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            color: '#16a34a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>

        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1c1917', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
          {firstName ? `Thank you, ${firstName}!` : 'Payment Confirmed!'}
        </h2>
        <p style={{ color: '#57534e', fontSize: '14px', lineHeight: 1.55, margin: '0 0 22px' }}>
          Your payment has been received and your client dashboard is ready. You can share your logo and business details inside.
        </p>

        {/* Clean Receipt Summary */}
        <div
          style={{
            backgroundColor: '#fafaf9',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'left',
            marginBottom: '22px',
            border: '1px solid #e7e5e4',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            boxSizing: 'border-box',
          }}
        >
          {client?.email && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', fontSize: '13px', paddingBottom: '10px', borderBottom: '1px solid #e7e5e4', flexWrap: 'wrap' }}>
              <span style={{ color: '#78716c', flexShrink: 0 }}>Account Email</span>
              <span style={{ fontWeight: 600, color: '#1c1917', wordBreak: 'break-word', textAlign: 'right' }}>{client.email}</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', fontSize: '13px', flexWrap: 'wrap' }}>
            <span style={{ color: '#78716c', flexShrink: 0 }}>Payment Reference</span>
            <span style={{ fontWeight: 600, color: '#1c1917', fontFamily: 'monospace', fontSize: '12px', wordBreak: 'break-all', textAlign: 'right' }}>
              {reference}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link
            href="/portal"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              padding: '14px 16px',
              backgroundColor: '#1c1917',
              color: '#ffffff',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 700,
              textDecoration: 'none',
              boxSizing: 'border-box',
            }}
          >
            <span>Open Your Client Dashboard</span>
            <span>&rarr;</span>
          </Link>

          <a
            href={`https://wa.me/2349036193817?text=${encodeURIComponent(
              `Hi aB Labs, I just completed my payment (Reference: ${reference}). Ready to get my website started!`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              padding: '12px 16px',
              backgroundColor: '#f0fdf4',
              color: '#15803d',
              borderRadius: '10px',
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
            <span>Message Us on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function PaystackCallbackPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: '#78716c', fontSize: '14px' }}>Loading payment confirmation...</p>
        </div>
      }
    >
      <PaystackCallbackContent />
    </Suspense>
  );
}
