'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Template } from '@/data/templates';

interface ClientData {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  business_name?: string | null;
  domain_name?: string | null;
  domain_status?: string | null;
  domain_expiry_date?: string | null;
  template_slug?: string | null;
  plan_type?: string | null;
  build_phase?: number | null;
  logo_url?: string | null;
  primary_color?: string | null;
  accent_color?: string | null;
  business_bio?: string | null;
  whatsapp_number?: string | null;
  demo_preview_url?: string | null;
  created_at?: string | null;
}

interface ClientPortalViewProps {
  client: ClientData;
  template?: Template | null;
}

export default function ClientPortalView({ client, template }: ClientPortalViewProps) {
  const router = useRouter();

  // Form State
  const [logoUrl, setLogoUrl] = useState(client.logo_url || '');
  const [primaryColor, setPrimaryColor] = useState(client.primary_color || '#18181b');
  const [accentColor, setAccentColor] = useState(client.accent_color || '#10b981');
  const [businessBio, setBusinessBio] = useState(client.business_bio || '');
  const [whatsappNumber, setWhatsappNumber] = useState(client.whatsapp_number || client.phone || '');
  
  // Save State
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const currentPhase = client.build_phase || 1;

  const handleSaveAssets = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setErrorMessage('');

    try {
      const res = await fetch('/api/portal/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logoUrl,
          primaryColor,
          accentColor,
          businessBio,
          whatsappNumber,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to save brand assets');
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/client', { method: 'DELETE' });
    router.push('/login');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#090a0b', color: '#f4f4f5', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Top Navbar */}
      <header style={{ borderBottom: '1px solid #1f2227', padding: '16px 24px', backgroundColor: '#0d0f12' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 800, fontSize: '18px', letterSpacing: '-0.02em' }}>
              aB Labs
            </Link>
            <span style={{ color: '#52525b', fontSize: '14px' }}>/</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#a1a1aa' }}>Client Portal</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '13px', color: '#a1a1aa' }}>
              {client.email}
            </span>
            <button
              onClick={handleLogout}
              style={{
                background: 'transparent',
                border: '1px solid #27272a',
                color: '#a1a1aa',
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '36px 20px 80px' }}>
        
        {/* Welcome & Project Overview Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontSize: '12px', fontWeight: 700, padding: '3px 10px', borderRadius: '100px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              Active Project Build
            </span>
            <span style={{ color: '#71717a', fontSize: '13px' }}>Client ID: {client.id}</span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em', margin: 0 }}>
            Welcome, {client.name}
          </h1>
          <p style={{ color: '#a1a1aa', fontSize: '14px', marginTop: '6px' }}>
            Track the status of your website build and provide your brand details below.
          </p>
        </div>

        {/* 8-Hour SLA Guarantee Banner */}
        <div style={{
          backgroundColor: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          borderRadius: '14px',
          padding: '20px 24px',
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '18px' }}>⚡</span>
              <strong style={{ color: '#34d399', fontSize: '15px' }}>8-Hour Onboarding &amp; Phase 1 Demo Guarantee</strong>
            </div>
            <p style={{ color: '#a7f3d0', fontSize: '13px', margin: 0, lineHeight: 1.5 }}>
              Our engineering team is actively preparing your staging site. You will receive a direct WhatsApp message and demo preview within <strong>8 hours</strong> of your payment.
            </p>
          </div>

          <a
            href={`https://wa.me/2348123456789?text=${encodeURIComponent(`Hi aB Labs, I am checking in from my portal for ${client.business_name || client.name} (${client.id}).`)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: '#16a34a',
              color: '#ffffff',
              padding: '10px 18px',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '13px',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            Direct WhatsApp Support &rarr;
          </a>
        </div>

        {/* 3-Phase Interactive Progress Stepper */}
        <section style={{ backgroundColor: '#131518', border: '1px solid #23272e', borderRadius: '16px', padding: '24px 28px', marginBottom: '36px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', marginBottom: '20px', letterSpacing: '-0.01em' }}>
            36-Hour Launch Timeline
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            
            {/* Step 1 */}
            <div style={{
              backgroundColor: currentPhase === 1 ? 'rgba(16, 185, 129, 0.08)' : '#181b20',
              border: currentPhase === 1 ? '1px solid #10b981' : '1px solid #272b33',
              borderRadius: '12px',
              padding: '18px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: currentPhase === 1 ? '#34d399' : '#71717a' }}>
                  PHASE 01
                </span>
                <span style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  padding: '2px 8px',
                  borderRadius: '100px',
                  backgroundColor: currentPhase === 1 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  color: currentPhase === 1 ? '#34d399' : '#71717a',
                }}>
                  {currentPhase === 1 ? 'In Progress' : 'Completed'}
                </span>
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', margin: '0 0 6px' }}>
                Onboarding &amp; Brand Assets
              </h3>
              <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0, lineHeight: 1.5 }}>
                Submitting your logo, colors, and business info so we can adapt your selected template.
              </p>
            </div>

            {/* Step 2 */}
            <div style={{
              backgroundColor: currentPhase === 2 ? 'rgba(16, 185, 129, 0.08)' : '#181b20',
              border: currentPhase === 2 ? '1px solid #10b981' : '1px solid #272b33',
              borderRadius: '12px',
              padding: '18px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: currentPhase === 2 ? '#34d399' : '#71717a' }}>
                  PHASE 02
                </span>
                <span style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  padding: '2px 8px',
                  borderRadius: '100px',
                  backgroundColor: currentPhase === 2 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  color: currentPhase === 2 ? '#34d399' : '#71717a',
                }}>
                  {currentPhase === 2 ? 'In Review' : (currentPhase > 2 ? 'Completed' : 'Queued')}
                </span>
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', margin: '0 0 6px' }}>
                Customization &amp; Staging Demo
              </h3>
              <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0, lineHeight: 1.5 }}>
                {client.demo_preview_url ? (
                  <a href={client.demo_preview_url} target="_blank" rel="noopener noreferrer" style={{ color: '#34d399', fontWeight: 700 }}>
                    View Staging Demo &rarr;
                  </a>
                ) : (
                  'Live prototype built with your content for your review and approval.'
                )}
              </p>
            </div>

            {/* Step 3 */}
            <div style={{
              backgroundColor: currentPhase === 3 ? 'rgba(16, 185, 129, 0.08)' : '#181b20',
              border: currentPhase === 3 ? '1px solid #10b981' : '1px solid #272b33',
              borderRadius: '12px',
              padding: '18px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: currentPhase === 3 ? '#34d399' : '#71717a' }}>
                  PHASE 03
                </span>
                <span style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  padding: '2px 8px',
                  borderRadius: '100px',
                  backgroundColor: currentPhase === 3 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  color: currentPhase === 3 ? '#34d399' : '#71717a',
                }}>
                  {currentPhase === 3 ? 'Live Now' : 'Pending Staging'}
                </span>
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', margin: '0 0 6px' }}>
                Domain &amp; Live Launch
              </h3>
              <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0, lineHeight: 1.5 }}>
                Connecting <strong>{client.domain_name || 'your custom domain'}</strong>, generating SSL, and going live.
              </p>
            </div>

          </div>
        </section>

        {/* Two-Column Grid: Left (Asset Submission Form), Right (Project Specs) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
          
          {/* Left: Brand Asset Submission */}
          <div style={{ backgroundColor: '#131518', border: '1px solid #23272e', borderRadius: '16px', padding: '28px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', marginBottom: '8px', letterSpacing: '-0.02em' }}>
              Brand Details &amp; Assets
            </h2>
            <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '24px', lineHeight: 1.5 }}>
              Enter whatever you have ready. If you prefer to send these over WhatsApp, our engineer will collect them directly.
            </p>

            {saveSuccess && (
              <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#34d399', padding: '12px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, marginBottom: '20px' }}>
                ✓ Brand details saved successfully! We have updated your project file.
              </div>
            )}

            {errorMessage && (
              <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#f87171', padding: '12px 16px', borderRadius: '8px', fontSize: '13px', marginBottom: '20px' }}>
                ✕ {errorMessage}
              </div>
            )}

            <form onSubmit={handleSaveAssets}>
              {/* Logo URL */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#d4d4d8', marginBottom: '6px' }}>
                  Logo Link or Google Drive / Cloudinary URL
                </label>
                <input
                  type="text"
                  placeholder="https://.../my-logo.png"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: '#1b1e24',
                    border: '1px solid #2e3440',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                />
                <span style={{ fontSize: '11px', color: '#71717a', marginTop: '4px', display: 'block' }}>
                  Or paste a link to your Google Drive folder or Dropbox.
                </span>
              </div>

              {/* Brand Colors */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#d4d4d8', marginBottom: '6px' }}>
                    Primary Color
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      style={{ width: '38px', height: '38px', border: 'none', borderRadius: '6px', cursor: 'pointer', background: 'transparent' }}
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        backgroundColor: '#1b1e24',
                        border: '1px solid #2e3440',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '13px',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#d4d4d8', marginBottom: '6px' }}>
                    Accent Color
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      style={{ width: '38px', height: '38px', border: 'none', borderRadius: '6px', cursor: 'pointer', background: 'transparent' }}
                    />
                    <input
                      type="text"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        backgroundColor: '#1b1e24',
                        border: '1px solid #2e3440',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '13px',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* WhatsApp Contact */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#d4d4d8', marginBottom: '6px' }}>
                  Official WhatsApp Number (To receive leads)
                </label>
                <input
                  type="text"
                  placeholder="+234 812 345 6789"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: '#1b1e24',
                    border: '1px solid #2e3440',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Bio & Copy */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#d4d4d8', marginBottom: '6px' }}>
                  Company Bio, Tagline or Custom Requests
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell us what your business does, your key services, and any special features you want on your website..."
                  value={businessBio}
                  onChange={(e) => setBusinessBio(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: '#1b1e24',
                    border: '1px solid #2e3440',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#ffffff',
                  color: '#090a0b',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '14px',
                  border: 'none',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving ? 'Saving...' : 'Save & Update Brand Details'}
              </button>
            </form>
          </div>

          {/* Right: Project Specifications Card */}
          <div>
            <div style={{ backgroundColor: '#131518', border: '1px solid #23272e', borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', marginBottom: '16px', letterSpacing: '-0.02em' }}>
                Your Website Details
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ paddingBottom: '12px', borderBottom: '1px solid #23272e' }}>
                  <div style={{ fontSize: '11px', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Selected Template</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', marginTop: '3px' }}>
                    {template ? template.name : (client.template_slug || 'Custom Architecture')}
                  </div>
                  {template?.category && (
                    <span style={{ fontSize: '11px', color: '#a1a1aa' }}>Category: {template.category}</span>
                  )}
                </div>

                <div style={{ paddingBottom: '12px', borderBottom: '1px solid #23272e' }}>
                  <div style={{ fontSize: '11px', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Provisioned Domain</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#34d399', marginTop: '3px' }}>
                    {client.domain_name || 'Free .com.ng Included'}
                  </div>
                  <span style={{ fontSize: '11px', color: '#a1a1aa' }}>Status: {client.domain_status || 'Active Provisioning'}</span>
                </div>

                <div style={{ paddingBottom: '12px', borderBottom: '1px solid #23272e' }}>
                  <div style={{ fontSize: '11px', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Package Plan</div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff', marginTop: '3px' }}>
                    {client.plan_type === 'OUTRIGHT' ? 'Outright Ownership (One-Time)' : 'Monthly Managed Care Plan'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dedicated Support</div>
                  <div style={{ fontSize: '13px', color: '#d4d4d8', marginTop: '3px' }}>
                    Lagos Engineering Squad &middot; WhatsApp Lead Desk
                  </div>
                </div>
              </div>
            </div>

            {/* Quick WhatsApp Reminder Card */}
            <div style={{ backgroundColor: '#181b20', border: '1px solid #272b33', borderRadius: '16px', padding: '24px' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>💬</div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', margin: '0 0 6px' }}>
                Prefer to handle everything on WhatsApp?
              </h3>
              <p style={{ fontSize: '13px', color: '#9ca3af', margin: '0 0 16px', lineHeight: 1.5 }}>
                You never have to worry about complicated web portals. You can send pictures, logos, and voice notes directly to our WhatsApp hotline anytime.
              </p>
              <a
                href="https://wa.me/2348123456789"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  color: '#34d399',
                  fontSize: '13px',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                Chat with our lead developer &rarr;
              </a>
            </div>

          </div>

        </div>

      </main>

    </div>
  );
}
