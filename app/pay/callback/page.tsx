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

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'sans-serif', backgroundColor: '#faf8f5' }}>
      <div style={{ maxWidth: '520px', width: '100%', backgroundColor: '#ffffff', padding: '36px 28px', borderRadius: '20px', border: '1px solid rgba(12,11,10,0.08)', boxShadow: '0 16px 40px rgba(12,11,10,0.06)', textAlign: 'center' }}>
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

        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1c1917', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
          Welcome, {client?.name || 'Valued Client'}!
        </h2>
        <p style={{ color: '#57534e', fontSize: '13.5px', lineHeight: 1.55, margin: '0 0 22px' }}>
          Your payment has been cleared and your client portal is fully activated. You are already logged in to begin Phase 1 setup.
        </p>

        {/* Credentials Card */}
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
            <span style={{ fontWeight: 600, color: '#fafafa' }}>{client?.email}</span>
          </div>

          {client?.temporaryPassword && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #27272a', fontSize: '13px' }}>
              <span style={{ color: '#a1a1aa' }}>Initial Password:</span>
              <code style={{ fontSize: '14px', color: '#34d399', fontWeight: 700, backgroundColor: '#27272a', padding: '2px 8px', borderRadius: '4px' }}>
                {client.temporaryPassword}
              </code>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', paddingTop: '8px' }}>
            <span style={{ color: '#a1a1aa' }}>Reference:</span>
            <span style={{ fontWeight: 600, color: '#fafafa', fontFamily: 'monospace' }}>{reference}</span>
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
              padding: '14px',
              backgroundColor: '#1c1917',
              color: '#ffffff',
              borderRadius: '12px',
              fontSize: '14.5px',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
              boxSizing: 'border-box',
            }}
          >
            <span>Enter Client Portal &amp; Upload Brand Assets</span>
            <span>&rarr;</span>
          </Link>

          <a
            href={`https://wa.me/2349036193817?text=${encodeURIComponent(
              `Hi aB Labs, I just completed payment for reference ${reference} (${client?.name || 'Client'}). I am ready for Phase 1 setup!`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
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
