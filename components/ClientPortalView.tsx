'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Template } from '@/data/templates';

export interface BrandFileItem {
  publicId: string;
  url: string;
  name: string;
  format: string;
  resourceType: string;
  bytes: number;
  uploadedAt: string;
}

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
  brand_files?: BrandFileItem[] | null;
  primary_color?: string | null;
  accent_color?: string | null;
  business_bio?: string | null;
  whatsapp_number?: string | null;
  demo_preview_url?: string | null;
  created_at?: string | null;
  billing_status?: string | null;
  next_billing_date?: string | null;
  monthly_amount_ngn?: number | null;
  card_last4?: string | null;
  card_brand?: string | null;
  paystack_subscription_code?: string | null;
}

export interface ClientProject extends ClientData {
  template?: Template | null;
}

interface ClientPortalViewProps {
  client: ClientData;
  projects?: ClientProject[];
  template?: Template | null;
}

type PortalTab = 'overview' | 'brand' | 'billing' | 'account';

export default function ClientPortalView({ client, projects, template }: ClientPortalViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<PortalTab>('overview');

  const initialProjects: ClientProject[] =
    Array.isArray(projects) && projects.length > 0
      ? projects
      : [{ ...client, template: template || null }];

  const [projectList, setProjectList] = useState<ClientProject[]>(initialProjects);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(initialProjects[0].id);
  const activeProject = projectList.find((p) => p.id === selectedProjectId) || projectList[0];
  const activeTemplate = activeProject.template || template || null;

  // Brand Assets Form State
  const [logoUrl, setLogoUrl] = useState(activeProject.logo_url || '');
  const [brandFiles, setBrandFiles] = useState<BrandFileItem[]>(
    Array.isArray(activeProject.brand_files) ? activeProject.brand_files : []
  );
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [primaryColor, setPrimaryColor] = useState(activeProject.primary_color || '#18181b');
  const [accentColor, setAccentColor] = useState(activeProject.accent_color || '#10b981');
  const [businessBio, setBusinessBio] = useState(activeProject.business_bio || '');
  const [whatsappNumber, setWhatsappNumber] = useState(activeProject.whatsapp_number || client.phone || '');

  // Save Brand State
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Billing & Card Linking State
  const [linkingCard, setLinkingCard] = useState(false);
  const [cardLinkedMessage, setCardLinkedMessage] = useState('');
  const [cardLast4, setCardLast4] = useState(client.card_last4 || '');
  const [cardBrand, setCardBrand] = useState(client.card_brand || '');
  const billingStatus = activeProject.billing_status || client.billing_status || 'pending_launch';

  // Password Change State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSelectProject = (proj: ClientProject) => {
    setSelectedProjectId(proj.id);
    setLogoUrl(proj.logo_url || '');
    setBrandFiles(Array.isArray(proj.brand_files) ? proj.brand_files : []);
    setPrimaryColor(proj.primary_color || '#18181b');
    setAccentColor(proj.accent_color || '#10b981');
    setBusinessBio(proj.business_bio || '');
    setWhatsappNumber(proj.whatsapp_number || client.phone || '');
    setUploadError('');
    setSaveSuccess(false);
  };

  const currentPhase = activeProject.build_phase || 1;
  const isOutright = String(activeProject.plan_type || '').toUpperCase() === 'OUTRIGHT';
  const monthlyRate = Number(activeProject.monthly_amount_ngn || activeTemplate?.monthlyNgn || 5000);
  const firstName = client.name ? String(client.name).trim().split(' ')[0] : 'there';

  // Reset "Redirecting to Paystack..." if user hits Back button from Paystack (bfcache restore)
  useEffect(() => {
    const resetLoading = () => setLinkingCard(false);
    window.addEventListener('pageshow', resetLoading);
    window.addEventListener('focus', resetLoading);
    return () => {
      window.removeEventListener('pageshow', resetLoading);
      window.removeEventListener('focus', resetLoading);
    };
  }, []);

  // Verify card-linking callback when returning from Paystack
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('reference') || params.get('trxref');
    if (params.get('card_linked') === '1' && ref) {
      setActiveTab('billing');
      fetch('/api/paystack/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference: ref }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.success && data?.cardLinked) {
            if (data.last4) setCardLast4(data.last4);
            if (data.brand) setCardBrand(data.brand);
            setCardLinkedMessage(data.message || 'Your card has been saved for automatic monthly renewals.');
            window.history.replaceState({}, '', '/portal');
          }
        })
        .catch(() => {});
    }
  }, []);

  const handleLinkCard = async () => {
    setLinkingCard(true);
    setErrorMessage('');
    const timeoutId = setTimeout(() => setLinkingCard(false), 12000);
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const res = await fetch('/api/portal/link-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callbackOrigin: origin }),
      });
      const data = await res.json();
      if (!data?.success || !data?.authorizationUrl) {
        throw new Error(data?.error || 'Could not open card setup.');
      }
      window.location.href = data.authorizationUrl;
    } catch (err: any) {
      clearTimeout(timeoutId);
      setErrorMessage(err.message || 'Could not start card setup. Please try again.');
      setLinkingCard(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes < 1024) return `${bytes || 0} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleFilesSelected = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setUploadError('');

    const selected = Array.from(fileList);
    const allowedExts = new Set(['png', 'jpg', 'jpeg', 'webp', 'pdf', 'zip']);
    const maxBytes = 8 * 1024 * 1024;

    if (brandFiles.length + selected.length > 10) {
      setUploadError(`You can upload up to 10 files total. (${10 - brandFiles.length} slot(s) remaining.)`);
      return;
    }

    setUploadingFiles(true);
    let updatedFiles = [...brandFiles];
    let updatedLogoUrl = logoUrl;

    try {
      for (const file of selected) {
        const ext = (file.name.split('.').pop() || '').toLowerCase();
        if (!allowedExts.has(ext)) {
          throw new Error(`"${file.name}" is not supported. Allowed: PNG, JPG, WebP, PDF, or ZIP.`);
        }
        if (file.size > maxBytes) {
          throw new Error(`"${file.name}" is too large. Maximum size is 8 MB per file.`);
        }

        const signRes = await fetch('/api/portal/upload-sign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type,
          }),
        });
        const signData = await signRes.json();
        if (!signRes.ok || !signData?.success) {
          throw new Error(signData?.error || `Could not prepare upload for "${file.name}".`);
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', signData.apiKey);
        formData.append('timestamp', String(signData.timestamp));
        formData.append('signature', signData.signature);
        formData.append('folder', signData.folder);
        formData.append('allowed_formats', signData.allowedFormats);

        const cloudRes = await fetch(
          `https://api.cloudinary.com/v1_1/${signData.cloudName}/auto/upload`,
          { method: 'POST', body: formData }
        );
        const cloudData = await cloudRes.json();
        if (!cloudRes.ok || !cloudData?.secure_url || !cloudData?.public_id) {
          throw new Error(cloudData?.error?.message || `Upload failed for "${file.name}".`);
        }

        const newItem: BrandFileItem = {
          publicId: cloudData.public_id,
          url: cloudData.secure_url,
          name: file.name,
          format: (cloudData.format || ext).toLowerCase(),
          resourceType: cloudData.resource_type || (ext === 'pdf' || ext === 'zip' ? 'raw' : 'image'),
          bytes: Number(cloudData.bytes || file.size),
          uploadedAt: new Date().toISOString(),
        };

        updatedFiles = [...updatedFiles, newItem];
        if (!updatedLogoUrl && ['png', 'jpg', 'jpeg', 'webp'].includes(newItem.format)) {
          updatedLogoUrl = newItem.url;
        }
      }

      const persistRes = await fetch('/api/portal/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: activeProject.id,
          logoUrl: updatedLogoUrl,
          brandFiles: updatedFiles,
        }),
      });
      const persistData = await persistRes.json();
      if (!persistRes.ok || !persistData?.success) {
        throw new Error(persistData?.error || 'Uploaded, but could not save to your account.');
      }

      setBrandFiles(updatedFiles);
      setLogoUrl(updatedLogoUrl);
      setProjectList((prev) =>
        prev.map((p) =>
          p.id === activeProject.id ? { ...p, logo_url: updatedLogoUrl, brand_files: updatedFiles } : p
        )
      );
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err: any) {
      setUploadError(err.message || 'File upload failed. Please try again.');
    } finally {
      setUploadingFiles(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = async (file: BrandFileItem) => {
    setUploadError('');
    try {
      const res = await fetch(
        `/api/portal/assets?projectId=${encodeURIComponent(activeProject.id)}&publicId=${encodeURIComponent(file.publicId)}&resourceType=${encodeURIComponent(file.resourceType || 'image')}`,
        { method: 'DELETE' }
      );
      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || 'Could not remove file.');
      }
      const next = Array.isArray(data.brandFiles)
        ? data.brandFiles
        : brandFiles.filter((item) => item.publicId !== file.publicId);
      setBrandFiles(next);
      const nextLogoUrl =
        logoUrl === file.url
          ? next.find((item: BrandFileItem) => ['png', 'jpg', 'jpeg', 'webp'].includes(item.format))?.url || ''
          : logoUrl;
      if (logoUrl === file.url) {
        setLogoUrl(nextLogoUrl);
      }
      setProjectList((prev) =>
        prev.map((p) => (p.id === activeProject.id ? { ...p, logo_url: nextLogoUrl, brand_files: next } : p))
      );
    } catch (err: any) {
      setUploadError(err.message || 'Could not remove file.');
    }
  };

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
          projectId: activeProject.id,
          logoUrl,
          brandFiles,
          primaryColor,
          accentColor,
          businessBio,
          whatsappNumber,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to save brand details');
      }

      setProjectList((prev) =>
        prev.map((p) =>
          p.id === activeProject.id
            ? {
                ...p,
                logo_url: logoUrl,
                brand_files: brandFiles,
                primary_color: primaryColor,
                accent_color: accentColor,
                business_bio: businessBio,
                whatsapp_number: whatsappNumber,
              }
            : p
        )
      );

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPassword(true);
    setPasswordSuccess('');
    setPasswordError('');

    try {
      const res = await fetch('/api/portal/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword, confirmPassword }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Could not update password');
      }
      setPasswordSuccess('Password updated! Use this password next time you sign in.');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordError(err.message || 'Could not update password');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/client', { method: 'DELETE' });
    router.push('/login');
  };

  const billingLabel = isOutright
    ? 'Paid in Full (One-Time)'
    : billingStatus === 'active'
    ? 'Auto-Renewal Active'
    : billingStatus === 'past_due'
    ? 'Payment Due'
    : 'Starts After Your Site Goes Live';

  const tabs: { id: PortalTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'brand', label: 'Brand & Logo' },
    { id: 'billing', label: 'Billing' },
    { id: 'account', label: 'Account & Password' },
  ];

  return (
    <div className="portal-shell">
      <style>{`
        .portal-shell {
          min-height: 100vh;
          background-color: #faf8f5;
          color: #1c1917;
          font-family: system-ui, -apple-system, sans-serif;
          overflow-x: hidden;
          width: 100%;
          box-sizing: border-box;
        }
        .portal-shell * {
          box-sizing: border-box;
        }
        .portal-header-bar {
          background-color: #ffffff;
          border-bottom: 1px solid #e7e5e4;
          padding: 14px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }
        .portal-main {
          max-width: 1060px;
          margin: 0 auto;
          padding: 28px 18px 72px;
        }
        .portal-layout {
          display: grid;
          grid-template-columns: 220px minmax(0, 1fr);
          gap: 24px;
          align-items: start;
        }
        .portal-nav {
          display: flex;
          flex-direction: column;
          gap: 6px;
          background-color: #ffffff;
          border: 1px solid #e7e5e4;
          border-radius: 14px;
          padding: 10px;
        }
        .portal-tab-btn {
          text-align: left;
          padding: 10px 14px;
          border-radius: 8px;
          border: none;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          background: transparent;
          color: #57534e;
          transition: background-color 0.15s ease, color 0.15s ease;
          font-family: inherit;
        }
        .portal-tab-btn.is-active {
          background-color: #1c1917;
          color: #ffffff;
        }
        .portal-tab-btn:not(.is-active):hover {
          background-color: #f5f5f4;
          color: #1c1917;
        }
        .portal-card {
          background-color: #ffffff;
          border: 1px solid #e7e5e4;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 20px;
          min-width: 0;
        }
        .portal-steps-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }
        .portal-color-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }
        .portal-input {
          width: 100%;
          min-width: 0;
          padding: 11px 14px;
          background-color: #ffffff;
          border: 1px solid #d6d3d1;
          border-radius: 8px;
          color: #1c1917;
          font-size: 14px;
          font-family: inherit;
        }
        .portal-input:focus {
          outline: none;
          border-color: #1c1917;
        }
        @media (max-width: 820px) {
          .portal-layout {
            grid-template-columns: minmax(0, 1fr);
            gap: 16px;
          }
          .portal-nav {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 6px;
            padding: 8px;
          }
          .portal-tab-btn {
            text-align: center;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            padding: 9px 10px;
            font-size: 12.5px;
          }
          .portal-steps-grid {
            grid-template-columns: minmax(0, 1fr);
          }
        }
        @media (max-width: 560px) {
          .portal-main {
            padding: 20px 14px 64px;
          }
          .portal-card {
            padding: 18px 16px;
          }
          .portal-color-grid {
            grid-template-columns: minmax(0, 1fr);
          }
        }
        .portal-file-split {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          align-items: stretch;
        }
        @media (max-width: 640px) {
          .portal-file-split {
            grid-template-columns: minmax(0, 1fr);
          }
        }
      `}</style>

      {/* Top Header */}
      <header className="portal-header-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          <Link href="/" style={{ textDecoration: 'none', color: '#1c1917', fontWeight: 800, fontSize: '18px', letterSpacing: '-0.03em', whiteSpace: 'nowrap' }}>
            aB Labs
          </Link>
          <span style={{ color: '#d6d3d1' }}>/</span>
          <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#57534e', whiteSpace: 'nowrap' }}>
            Client Dashboard
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', maxWidth: '100%' }}>
          <span style={{ fontSize: '12.5px', color: '#78716c', wordBreak: 'break-all' }}>
            {client.email}
          </span>
          <button
            type="button"
            onClick={handleLogout}
            style={{
              background: '#ffffff',
              border: '1px solid #d6d3d1',
              color: '#1c1917',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '6px 12px',
              borderRadius: '8px',
            }}
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="portal-main">
        {/* Welcome Heading */}
        <div style={{ marginBottom: '22px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#1c1917', letterSpacing: '-0.03em', margin: '0 0 6px' }}>
            Welcome, {firstName}
          </h1>
          <p style={{ color: '#57534e', fontSize: '14px', margin: 0, lineHeight: 1.5 }}>
            {activeProject.business_name ? `${activeProject.business_name} · ` : ''}Track your website build, send your brand details, and manage billing.
          </p>
        </div>

        {/* Multi-Website Switcher (only shown when client has 2+ websites) */}
        {projectList.length > 1 && (
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e7e5e4',
              borderRadius: '12px',
              padding: '12px 14px',
              marginBottom: '18px',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#57534e', marginBottom: '8px' }}>
              Your Websites ({projectList.length})
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {projectList.map((proj, idx) => {
                const isSelected = proj.id === activeProject.id;
                const label = proj.business_name || proj.template?.name || `Website ${idx + 1}`;
                const sub = proj.domain_name || 'Domain pending';
                return (
                  <button
                    key={proj.id}
                    type="button"
                    onClick={() => handleSelectProject(proj)}
                    style={{
                      textAlign: 'left',
                      padding: '8px 12px',
                      borderRadius: '9px',
                      border: isSelected ? '1.5px solid #1c1917' : '1px solid #e7e5e4',
                      backgroundColor: isSelected ? '#1c1917' : '#fafaf9',
                      color: isSelected ? '#ffffff' : '#1c1917',
                      cursor: 'pointer',
                      minWidth: 0,
                      maxWidth: '100%',
                    }}
                  >
                    <div style={{ fontSize: '13px', fontWeight: 700, lineHeight: 1.25 }}>{label}</div>
                    <div style={{ fontSize: '11px', opacity: isSelected ? 0.8 : 0.65, marginTop: '2px' }}>{sub}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Global Error Banner */}
        {errorMessage && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '12px 16px', borderRadius: '10px', fontSize: '13px', marginBottom: '18px' }}>
            {errorMessage}
          </div>
        )}

        <div className="portal-layout">
          {/* Side / Top Navigation Tabs */}
          <nav className="portal-nav" aria-label="Portal sections">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`portal-tab-btn ${activeTab === tab.id ? 'is-active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Active Tab Content */}
          <div style={{ minWidth: 0 }}>
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <>
                <div className="portal-card">
                  <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1c1917', margin: '0 0 14px' }}>
                    Your Build Progress
                  </h2>
                  <div className="portal-steps-grid">
                    <div style={{ backgroundColor: currentPhase === 1 ? '#f0fdf4' : '#fafaf9', border: `1px solid ${currentPhase === 1 ? '#86efac' : '#e7e5e4'}`, borderRadius: '12px', padding: '14px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: currentPhase === 1 ? '#15803d' : '#78716c', marginBottom: '4px' }}>
                        STEP 1 · {currentPhase > 1 ? 'Done' : 'Active'}
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#1c1917', marginBottom: '4px' }}>
                        Send Brand Details
                      </div>
                      <p style={{ fontSize: '12.5px', color: '#57534e', margin: 0, lineHeight: 1.45 }}>
                        Add your logo, preferred colors, and business info in the Brand &amp; Logo tab (or send on WhatsApp).
                      </p>
                    </div>

                    <div style={{ backgroundColor: currentPhase === 2 ? '#f0fdf4' : '#fafaf9', border: `1px solid ${currentPhase === 2 ? '#86efac' : '#e7e5e4'}`, borderRadius: '12px', padding: '14px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: currentPhase === 2 ? '#15803d' : '#78716c', marginBottom: '4px' }}>
                        STEP 2 · {currentPhase > 2 ? 'Done' : currentPhase === 2 ? 'Ready' : 'Up Next'}
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#1c1917', marginBottom: '4px' }}>
                        Preview Your Site
                      </div>
                      <p style={{ fontSize: '12.5px', color: '#57534e', margin: 0, lineHeight: 1.45 }}>
                        {activeProject.demo_preview_url ? (
                          <a href={activeProject.demo_preview_url} target="_blank" rel="noopener noreferrer" style={{ color: '#15803d', fontWeight: 700 }}>
                            Open Site Preview &rarr;
                          </a>
                        ) : (
                          'We customize your design and send you a private preview link within 8 hours.'
                        )}
                      </p>
                    </div>

                    <div style={{ backgroundColor: currentPhase >= 3 ? '#f0fdf4' : '#fafaf9', border: `1px solid ${currentPhase >= 3 ? '#86efac' : '#e7e5e4'}`, borderRadius: '12px', padding: '14px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: currentPhase >= 3 ? '#15803d' : '#78716c', marginBottom: '4px' }}>
                        STEP 3 · {currentPhase >= 4 ? 'Live' : currentPhase === 3 ? 'In Progress' : 'Up Next'}
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#1c1917', marginBottom: '4px' }}>
                        Connect Domain &amp; Launch
                      </div>
                      <p style={{ fontSize: '12.5px', color: '#57534e', margin: 0, lineHeight: 1.45 }}>
                        Once you approve the preview, we connect your website address and take it live.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="portal-card">
                  <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1c1917', margin: '0 0 14px' }}>
                    Website Summary
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13.5px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', paddingBottom: '10px', borderBottom: '1px solid #f5f5f4', flexWrap: 'wrap' }}>
                      <span style={{ color: '#78716c' }}>Selected Design</span>
                      <strong style={{ color: '#1c1917' }}>{activeTemplate ? activeTemplate.name : (activeProject.template_slug || 'Custom Website')}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', paddingBottom: '10px', borderBottom: '1px solid #f5f5f4', flexWrap: 'wrap' }}>
                      <span style={{ color: '#78716c' }}>Website Domain</span>
                      <strong style={{ color: activeProject.domain_name ? '#15803d' : '#57534e', textAlign: 'right' }}>
                        {activeProject.domain_name || 'Not set yet (we will set this up with you)'}
                      </strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                      <span style={{ color: '#78716c' }}>Plan</span>
                      <strong style={{ color: '#1c1917' }}>
                        {isOutright ? 'Full Ownership (One-Time)' : `Monthly Plan (₦${monthlyRate.toLocaleString()}/mo)`}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="portal-card" style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#166534', margin: '0 0 6px' }}>
                    Need help or prefer WhatsApp?
                  </h3>
                  <p style={{ fontSize: '13px', color: '#15803d', margin: '0 0 14px', lineHeight: 1.5 }}>
                    You can send your logo, pictures, or voice notes directly to us on WhatsApp at any time.
                  </p>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <a
                      href={`https://wa.me/2349036193817?text=${encodeURIComponent(`Hi aB Labs, this is ${client.name} (${client.email}). Checking in about my website.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-block',
                        padding: '10px 16px',
                        backgroundColor: '#16a34a',
                        color: '#ffffff',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 700,
                        textDecoration: 'none',
                      }}
                    >
                      Chat on WhatsApp &rarr;
                    </a>
                    <button
                      type="button"
                      onClick={() => setActiveTab('brand')}
                      style={{
                        padding: '10px 16px',
                        backgroundColor: '#ffffff',
                        color: '#1c1917',
                        border: '1px solid #d6d3d1',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Fill Brand Details Form
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* TAB 2: BRAND & LOGO */}
            {activeTab === 'brand' && (
              <div className="portal-card">
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1c1917', margin: '0 0 6px' }}>
                  Brand Details &amp; Logo
                </h2>
                <p style={{ color: '#57534e', fontSize: '13.5px', margin: '0 0 20px', lineHeight: 1.5 }}>
                  Share whatever you have ready. Anything you leave blank can be sent later on WhatsApp.
                </p>

                {saveSuccess && (
                  <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', padding: '12px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, marginBottom: '18px' }}>
                    Saved! Our team has received your brand details.
                  </div>
                )}

                <form onSubmit={handleSaveAssets} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#44403c', marginBottom: '8px' }}>
                      Logo &amp; Brand Files
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".png,.jpg,.jpeg,.webp,.pdf,.zip,image/png,image/jpeg,image/webp,application/pdf,application/zip"
                      style={{ display: 'none' }}
                      onChange={(e) => handleFilesSelected(e.target.files)}
                    />
                    <div className="portal-file-split">
                      {/* Left Half: Upload Dropzone */}
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => !uploadingFiles && fileInputRef.current?.click()}
                        onKeyDown={(e) => {
                          if ((e.key === 'Enter' || e.key === ' ') && !uploadingFiles) {
                            e.preventDefault();
                            fileInputRef.current?.click();
                          }
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDragging(false);
                          if (!uploadingFiles) handleFilesSelected(e.dataTransfer.files);
                        }}
                        style={{
                          border: isDragging ? '1.5px dashed #1c1917' : '1.5px dashed #d6d3d1',
                          backgroundColor: isDragging ? '#f5f5f4' : '#fafaf9',
                          borderRadius: '10px',
                          padding: '22px 16px',
                          minHeight: '190px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',
                          cursor: uploadingFiles ? 'wait' : 'pointer',
                          transition: 'background-color 0.15s, border-color 0.15s',
                        }}
                      >
                        <div style={{ width: '38px', height: '38px', borderRadius: '9px', backgroundColor: '#ffffff', border: '1px solid #e7e5e4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px', fontSize: '18px', fontWeight: 700, color: '#1c1917' }}>
                          {uploadingFiles ? '…' : '+'}
                        </div>
                        <p style={{ margin: '0 0 4px', fontSize: '13.5px', fontWeight: 700, color: '#1c1917' }}>
                          {uploadingFiles ? 'Uploading files...' : 'Click or drop files here'}
                        </p>
                        <p style={{ margin: 0, fontSize: '12px', color: '#78716c', lineHeight: 1.45 }}>
                          PNG, JPG, WebP, PDF or ZIP
                          <br />
                          Max 8 MB per file · Up to 10 files
                        </p>
                      </div>

                      {/* Right Half: Uploaded Files List */}
                      <div
                        style={{
                          border: '1px solid #e7e5e4',
                          backgroundColor: '#ffffff',
                          borderRadius: '10px',
                          padding: '14px',
                          minHeight: '190px',
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', paddingBottom: '8px', borderBottom: '1px solid #f5f5f4' }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#44403c' }}>
                            Uploaded Files ({brandFiles.length}/10)
                          </span>
                        </div>

                        {brandFiles.length === 0 ? (
                          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '16px 8px' }}>
                            <p style={{ margin: 0, fontSize: '12.5px', color: '#a8a29e', lineHeight: 1.5 }}>
                              No files uploaded yet.
                              <br />
                              Your logos and brand assets will appear here.
                            </p>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto' }}>
                            {brandFiles.map((file) => {
                              const isImg = ['png', 'jpg', 'jpeg', 'webp'].includes((file.format || '').toLowerCase());
                              return (
                                <div
                                  key={file.publicId}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '8px',
                                    borderRadius: '8px',
                                    backgroundColor: '#fafaf9',
                                    border: '1px solid #f5f5f4',
                                    minWidth: 0,
                                  }}
                                >
                                  {isImg ? (
                                    <img
                                      src={file.url}
                                      alt={file.name}
                                      style={{ width: '34px', height: '34px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #e7e5e4', flexShrink: 0, backgroundColor: '#ffffff' }}
                                    />
                                  ) : (
                                    <div style={{ width: '34px', height: '34px', borderRadius: '6px', backgroundColor: '#f5f5f4', border: '1px solid #e7e5e4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: '#57534e', textTransform: 'uppercase', flexShrink: 0 }}>
                                      {file.format || 'FILE'}
                                    </div>
                                  )}
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#1c1917', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                      {file.name}
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#78716c' }}>
                                      {formatFileSize(file.bytes)}
                                    </div>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                                    <a
                                      href={file.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{ fontSize: '11.5px', fontWeight: 600, color: '#44403c', textDecoration: 'underline' }}
                                    >
                                      View
                                    </a>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveFile(file)}
                                      style={{
                                        background: 'none',
                                        border: 'none',
                                        padding: '2px 4px',
                                        fontSize: '11.5px',
                                        fontWeight: 600,
                                        color: '#b91c1c',
                                        cursor: 'pointer',
                                      }}
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                    {uploadError && (
                      <p style={{ margin: '8px 0 0', fontSize: '12.5px', color: '#b91c1c', fontWeight: 600 }}>
                        {uploadError}
                      </p>
                    )}
                  </div>

                  <div className="portal-color-grid">
                    <div>
                      <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#44403c', marginBottom: '6px' }}>
                        Primary Color
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                          type="color"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          style={{ width: '40px', height: '40px', border: '1px solid #d6d3d1', borderRadius: '8px', cursor: 'pointer', padding: '2px', backgroundColor: '#ffffff', flexShrink: 0 }}
                        />
                        <input
                          type="text"
                          className="portal-input"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#44403c', marginBottom: '6px' }}>
                        Accent Color
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                          type="color"
                          value={accentColor}
                          onChange={(e) => setAccentColor(e.target.value)}
                          style={{ width: '40px', height: '40px', border: '1px solid #d6d3d1', borderRadius: '8px', cursor: 'pointer', padding: '2px', backgroundColor: '#ffffff', flexShrink: 0 }}
                        />
                        <input
                          type="text"
                          className="portal-input"
                          value={accentColor}
                          onChange={(e) => setAccentColor(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#44403c', marginBottom: '6px' }}>
                      Customer WhatsApp Number (shown on your website)
                    </label>
                    <input
                      type="tel"
                      className="portal-input"
                      placeholder="08012345678"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#44403c', marginBottom: '6px' }}>
                      About Your Business / Special Requests
                    </label>
                    <textarea
                      rows={4}
                      className="portal-input"
                      placeholder="Briefly describe what your business does, your main products or services, and any custom notes..."
                      value={businessBio}
                      onChange={(e) => setBusinessBio(e.target.value)}
                      style={{ resize: 'vertical' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    style={{
                      width: '100%',
                      padding: '13px',
                      backgroundColor: '#1c1917',
                      color: '#ffffff',
                      borderRadius: '10px',
                      fontWeight: 700,
                      fontSize: '14px',
                      border: 'none',
                      cursor: saving ? 'not-allowed' : 'pointer',
                      opacity: saving ? 0.7 : 1,
                    }}
                  >
                    {saving ? 'Saving...' : 'Save Brand Details'}
                  </button>
                </form>
              </div>
            )}

            {/* TAB 3: BILLING */}
            {activeTab === 'billing' && (
              <div className="portal-card">
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1c1917', margin: '0 0 6px' }}>
                  Billing &amp; Maintenance
                </h2>
                <p style={{ color: '#57534e', fontSize: '13.5px', margin: '0 0 20px', lineHeight: 1.5 }}>
                  Manage your website maintenance plan and payment method.
                </p>

                {isOutright ? (
                  <div style={{ padding: '16px', backgroundColor: '#fafaf9', border: '1px solid #e7e5e4', borderRadius: '12px', fontSize: '13.5px', color: '#44403c' }}>
                    You own this website 100% outright with <strong>₦0 recurring monthly fees</strong>.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ padding: '16px', backgroundColor: '#fafaf9', border: '1px solid #e7e5e4', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
                        <span style={{ color: '#78716c' }}>Monthly Maintenance Fee</span>
                        <strong style={{ color: '#1c1917' }}>₦{monthlyRate.toLocaleString()}/month</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
                        <span style={{ color: '#78716c' }}>Status</span>
                        <strong style={{ color: billingStatus === 'active' ? '#15803d' : '#1c1917' }}>{billingLabel}</strong>
                      </div>
                      {client.next_billing_date && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
                          <span style={{ color: '#78716c' }}>Next Billing Date</span>
                          <strong style={{ color: '#1c1917' }}>
                            {new Date(client.next_billing_date).toLocaleDateString('en-NG', { dateStyle: 'medium' })}
                          </strong>
                        </div>
                      )}
                    </div>

                    {cardLinkedMessage && (
                      <div style={{ padding: '12px 14px', borderRadius: '8px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', fontSize: '13px', fontWeight: 600 }}>
                        {cardLinkedMessage}
                      </div>
                    )}

                    {cardLast4 ? (
                      <div style={{ padding: '14px 16px', borderRadius: '10px', backgroundColor: '#fafaf9', border: '1px solid #e7e5e4', fontSize: '13.5px', color: '#1c1917' }}>
                        Saved Card: <strong style={{ textTransform: 'uppercase' }}>{cardBrand || 'Card'}</strong> &bull;&bull;&bull;&bull; {cardLast4}
                      </div>
                    ) : (
                      <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid #e7e5e4', backgroundColor: '#ffffff' }}>
                        <h3 style={{ fontSize: '14.5px', fontWeight: 700, color: '#1c1917', margin: '0 0 6px' }}>
                          Auto-Renewal Card (Optional)
                        </h3>
                        <p style={{ fontSize: '13px', color: '#57534e', margin: '0 0 14px', lineHeight: 1.5 }}>
                          Save a debit card so monthly renewals run automatically once your website is live. Paystack performs a quick ₦50 check that is refunded immediately.
                        </p>
                        <button
                          type="button"
                          onClick={handleLinkCard}
                          disabled={linkingCard}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            backgroundColor: '#1c1917',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '13.5px',
                            fontWeight: 700,
                            cursor: linkingCard ? 'not-allowed' : 'pointer',
                            opacity: linkingCard ? 0.7 : 1,
                          }}
                        >
                          {linkingCard ? 'Opening Paystack...' : 'Save Card for Auto-Renewal'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: ACCOUNT & PASSWORD */}
            {activeTab === 'account' && (
              <div className="portal-card">
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1c1917', margin: '0 0 6px' }}>
                  Account &amp; Password
                </h2>
                <p style={{ color: '#57534e', fontSize: '13.5px', margin: '0 0 20px', lineHeight: 1.5 }}>
                  Set your own password so you don&apos;t have to use the temporary password from your email.
                </p>

                <div style={{ padding: '14px 16px', backgroundColor: '#fafaf9', border: '1px solid #e7e5e4', borderRadius: '10px', marginBottom: '20px', fontSize: '13.5px' }}>
                  <span style={{ color: '#78716c', display: 'block', fontSize: '12px', marginBottom: '2px' }}>Account Email</span>
                  <strong style={{ color: '#1c1917', wordBreak: 'break-all' }}>{client.email}</strong>
                </div>

                {passwordSuccess && (
                  <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', padding: '12px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, marginBottom: '16px' }}>
                    {passwordSuccess}
                  </div>
                )}

                {passwordError && (
                  <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '12px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
                    {passwordError}
                  </div>
                )}

                <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#44403c', marginBottom: '6px' }}>
                      New Password (at least 8 characters)
                    </label>
                    <input
                      type="password"
                      required
                      minLength={8}
                      className="portal-input"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#44403c', marginBottom: '6px' }}>
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      minLength={8}
                      className="portal-input"
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={savingPassword}
                    style={{
                      width: '100%',
                      padding: '13px',
                      backgroundColor: '#1c1917',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: savingPassword ? 'not-allowed' : 'pointer',
                      opacity: savingPassword ? 0.7 : 1,
                    }}
                  >
                    {savingPassword ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
