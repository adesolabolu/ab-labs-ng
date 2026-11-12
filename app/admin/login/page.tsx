'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Authentication rejected');
      }

      router.push('/admin');
    } catch (err: any) {
      setErrorMessage(err.message || 'Access denied');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a0c',
      color: '#f4f4f5',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '24px 16px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      
      {/* Admin Branding */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#18181b',
          border: '1px solid #27272a',
          padding: '4px 12px',
          borderRadius: '100px',
          fontSize: '11px',
          fontWeight: 700,
          color: '#a1a1aa',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          marginBottom: '12px',
        }}>
          🔒 Internal Operations
        </div>
        <h1 style={{ color: '#ffffff', fontSize: '24px', fontWeight: 800, letterSpacing: '-0.03em', margin: 0 }}>
          aB Labs Admin Portal
        </h1>
        <p style={{ color: '#71717a', fontSize: '13px', marginTop: '6px' }}>
          Restricted access. Authentication required to manage pricing and orders.
        </p>
      </div>

      {/* Card */}
      <div style={{
        maxWidth: '380px',
        width: '100%',
        backgroundColor: '#111215',
        border: '1px solid #212328',
        borderRadius: '16px',
        padding: '30px 24px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
      }}>
        
        {errorMessage && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#f87171', padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '18px', textAlign: 'center' }}>
            ✕ {errorMessage}
          </div>
        )}

        <form onSubmit={handleAdminLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#d4d4d8', marginBottom: '8px' }}>
              Master Security Key
            </label>
            <input
              type="password"
              required
              autoFocus
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                backgroundColor: '#181a1f',
                border: '1px solid #2b2f38',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
          </div>

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
            {submitting ? 'Verifying Key...' : 'Unlock Admin Operations'}
          </button>
        </form>

      </div>

      <div style={{ marginTop: '28px', textAlign: 'center' }}>
        <Link href="/" style={{ color: '#52525b', fontSize: '12px', textDecoration: 'none' }}>
          &larr; Return to public site
        </Link>
      </div>

    </div>
  );
}
