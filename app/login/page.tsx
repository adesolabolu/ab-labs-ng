'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ClientLoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<'password' | 'magic-link'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await fetch('/api/auth/client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password: mode === 'password' ? password : undefined,
          requestMagicLink: mode === 'magic-link',
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Authentication failed');
      }

      if (mode === 'password') {
        router.push(data.redirectUrl || '/portal');
      } else {
        setSuccessMessage(data.message || 'Check your email for your 1-click login link!');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#090a0b',
      color: '#f4f4f5',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '24px 16px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      
      {/* Brand Header */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <Link href="/" style={{ color: '#ffffff', textDecoration: 'none', fontSize: '24px', fontWeight: 800, letterSpacing: '-0.03em' }}>
          aB Labs
        </Link>
        <p style={{ color: '#a1a1aa', fontSize: '14px', marginTop: '6px' }}>
          Client Project Portal Sign In
        </p>
      </div>

      {/* Login Card */}
      <div style={{
        maxWidth: '420px',
        width: '100%',
        backgroundColor: '#131518',
        border: '1px solid #23272e',
        borderRadius: '18px',
        padding: '32px 28px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
      }}>
        
        {/* Mode Selector Tabs */}
        <div style={{ display: 'flex', backgroundColor: '#1b1e24', borderRadius: '8px', padding: '3px', marginBottom: '24px' }}>
          <button
            type="button"
            onClick={() => { setMode('password'); setErrorMessage(''); setSuccessMessage(''); }}
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              backgroundColor: mode === 'password' ? '#2e3440' : 'transparent',
              color: mode === 'password' ? '#ffffff' : '#9ca3af',
            }}
          >
            Password Login
          </button>
          <button
            type="button"
            onClick={() => { setMode('magic-link'); setErrorMessage(''); setSuccessMessage(''); }}
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              backgroundColor: mode === 'magic-link' ? '#2e3440' : 'transparent',
              color: mode === 'magic-link' ? '#ffffff' : '#9ca3af',
            }}
          >
            1-Click Email Link
          </button>
        </div>

        {errorMessage && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#f87171', padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '18px', lineHeight: 1.4 }}>
            ✕ {errorMessage}
          </div>
        )}

        {successMessage && (
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#34d399', padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '18px', lineHeight: 1.4 }}>
            ✓ {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#d4d4d8', marginBottom: '6px' }}>
              Checkout Email Address
            </label>
            <input
              type="email"
              required
              placeholder="e.g. founder@company.ng"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                backgroundColor: '#1b1e24',
                border: '1px solid #2e3440',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Password (if mode === 'password') */}
          {mode === 'password' && (
            <div style={{ marginBottom: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#d4d4d8' }}>
                  Temporary or Set Password
                </label>
                <button
                  type="button"
                  onClick={() => setMode('magic-link')}
                  style={{ background: 'none', border: 'none', color: '#34d399', fontSize: '11px', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                required
                placeholder="Enter password from welcome email"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  backgroundColor: '#1b1e24',
                  border: '1px solid #2e3440',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#ffffff',
              color: '#090a0b',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '14px',
              border: 'none',
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? 'Authenticating...' : (mode === 'password' ? 'Sign In to Portal' : 'Send 1-Click Login Link')}
          </button>
        </form>

        <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid #23272e', textAlign: 'center', fontSize: '13px', color: '#71717a' }}>
          Don&apos;t have an account yet?{' '}
          <Link href="/shop" style={{ color: '#34d399', fontWeight: 700, textDecoration: 'none' }}>
            Choose a design &rarr;
          </Link>
        </div>

      </div>

      {/* Footer Back Link */}
      <div style={{ marginTop: '28px', textAlign: 'center' }}>
        <Link href="/" style={{ color: '#71717a', fontSize: '13px', textDecoration: 'none' }}>
          &larr; Back to aB Labs
        </Link>
      </div>

    </div>
  );
}
