'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ClientAuthFormProps {
  initialMode?: 'password' | 'signup' | 'magic-link';
}

export default function ClientAuthForm({ initialMode = 'password' }: ClientAuthFormProps) {
  const router = useRouter();

  const [mode, setMode] = useState<'password' | 'signup' | 'magic-link'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'signup') {
      setMode('signup');
    }
  }, []);

  const switchMode = (next: 'password' | 'signup' | 'magic-link') => {
    setMode(next);
    setErrorMessage('');
    setSuccessMessage('');
    setShowPassword(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (mode === 'signup') {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, phone, password }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Could not create account');
        }
        router.push(data.redirectUrl || '/portal');
        return;
      }

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

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '11px 14px',
    backgroundColor: '#1b1e24',
    border: '1px solid #2e3440',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '14px',
    boxSizing: 'border-box',
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#090a0b',
        color: '#f4f4f5',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px 16px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Brand Header */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <Link
          href="/"
          style={{
            color: '#ffffff',
            textDecoration: 'none',
            fontSize: '24px',
            fontWeight: 800,
            letterSpacing: '-0.03em',
          }}
        >
          aB Labs
        </Link>
        <p style={{ color: '#a1a1aa', fontSize: '14px', marginTop: '6px' }}>
          {mode === 'signup' ? 'Create Your Client Account' : 'Client Project Portal'}
        </p>
      </div>

      {/* Auth Card */}
      <div
        style={{
          maxWidth: '420px',
          width: '100%',
          backgroundColor: '#131518',
          border: '1px solid #23272e',
          borderRadius: '18px',
          padding: '32px 28px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          boxSizing: 'border-box',
        }}
      >
        <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', margin: '0 0 6px' }}>
          {mode === 'signup'
            ? 'Create an account'
            : mode === 'password'
            ? 'Sign in to your account'
            : 'Reset or get a login link'}
        </h1>
        <p style={{ fontSize: '13px', color: '#a1a1aa', margin: '0 0 22px', lineHeight: 1.5 }}>
          {mode === 'signup'
            ? 'Sign up to browse, order, and manage your website projects in one place.'
            : mode === 'password'
            ? 'Enter your email and password to access your portal.'
            : 'Enter your account email and we will send a sign-in link to your inbox.'}
        </p>

        {errorMessage && (
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid #ef4444',
              color: '#f87171',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '13px',
              marginBottom: '18px',
              lineHeight: 1.4,
            }}
          >
            ✕ {errorMessage}
          </div>
        )}

        {successMessage && (
          <div
            style={{
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid #10b981',
              color: '#34d399',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '13px',
              marginBottom: '18px',
              lineHeight: 1.4,
            }}
          >
            ✓ {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Full Name (Sign Up only) */}
          {mode === 'signup' && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#d4d4d8', marginBottom: '6px' }}>
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Boluwatife Adesola"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
              />
            </div>
          )}

          {/* Email */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#d4d4d8', marginBottom: '6px' }}>
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="you@yourbusiness.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* WhatsApp / Phone (Sign Up only, optional) */}
          {mode === 'signup' && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#d4d4d8', marginBottom: '6px' }}>
                WhatsApp / Phone Number <span style={{ color: '#71717a', fontWeight: 400 }}>(optional)</span>
              </label>
              <input
                type="tel"
                placeholder="08012345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={inputStyle}
              />
            </div>
          )}

          {/* Password with Eye Toggle */}
          {(mode === 'password' || mode === 'signup') && (
            <div style={{ marginBottom: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#d4d4d8' }}>
                  Password
                </label>
                {mode === 'password' && (
                  <button
                    type="button"
                    onClick={() => switchMode('magic-link')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#34d399',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    Forgot password?
                  </button>
                )}
              </div>

              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={mode === 'signup' ? 8 : undefined}
                  placeholder={mode === 'signup' ? 'Create a password (min. 8 characters)' : 'Enter your password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ ...inputStyle, paddingRight: '44px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  title={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    background: 'none',
                    border: 'none',
                    padding: '4px',
                    cursor: 'pointer',
                    color: '#a1a1aa',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
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
            {submitting
              ? mode === 'signup'
                ? 'Creating account...'
                : 'Signing in...'
              : mode === 'signup'
              ? 'Sign Up'
              : mode === 'password'
              ? 'Sign In'
              : 'Send Login Link to Email'}
          </button>

          {mode === 'magic-link' && (
            <button
              type="button"
              onClick={() => switchMode('password')}
              style={{
                width: '100%',
                marginTop: '12px',
                background: 'none',
                border: 'none',
                color: '#a1a1aa',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              &larr; Back to password sign in
            </button>
          )}
        </form>

        <div
          style={{
            marginTop: '24px',
            paddingTop: '18px',
            borderTop: '1px solid #23272e',
            textAlign: 'center',
            fontSize: '13px',
            color: '#71717a',
          }}
        >
          {mode === 'signup' ? (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => switchMode('password')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  color: '#34d399',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Sign in
              </button>
            </>
          ) : (
            <>
              Don&apos;t have an account yet?{' '}
              <button
                type="button"
                onClick={() => switchMode('signup')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  color: '#34d399',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Sign up
              </button>
            </>
          )}
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
