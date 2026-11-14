'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { TEMPLATES, type Template } from '@/data/templates';

/** A catalog template merged with any saved price override. */
type PricedTemplate = Template & {
  pricingOverride?: boolean;
  basePriceNgn?: number;
  baseSetupFeeNgn?: number;
  baseMonthlyNgn?: number;
};

export default function AdminPortalPage() {
  const [activeTab, setActiveTab] = useState<'links' | 'clients' | 'orders' | 'templates' | 'inquiries'>('links');
  
  // Data States
  const [loading, setLoading] = useState(true);
  const [links, setLinks] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [inquiryFilter, setInquiryFilter] = useState<'ALL' | 'DEMO' | 'CONTACT' | 'NEW'>('ALL');
  const [updatingInquiryId, setUpdatingInquiryId] = useState<number | null>(null);
  const [stats, setStats] = useState({
    totalLinks: 0,
    activeLinks: 0,
    paidLinks: 0,
    totalPaidAmount: 0,
  });

  // Search Filter State
  const [searchQuery, setSearchQuery] = useState('');

  // New Link Modal / Form State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creatingLink, setCreatingLink] = useState(false);
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkClientName, setNewLinkClientName] = useState('');
  const [newLinkClientEmail, setNewLinkClientEmail] = useState('');
  const [newLinkClientPhone, setNewLinkClientPhone] = useState('');
  const [newLinkTemplateSlug, setNewLinkTemplateSlug] = useState('carzap-detailing');
  const [newLinkPlanType, setNewLinkPlanType] = useState<'MONTHLY' | 'OUTRIGHT'>('MONTHLY');
  const [newLinkSetupFee, setNewLinkSetupFee] = useState(15000);
  const [newLinkMonthly, setNewLinkMonthly] = useState(5000);
  const [newLinkOutright, setNewLinkOutright] = useState(50000);
  const [newLinkNotes, setNewLinkNotes] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Client domain editing state
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [editDomainName, setEditDomainName] = useState('');
  const [editDomainExpiry, setEditDomainExpiry] = useState('');
  const [savingDomain, setSavingDomain] = useState(false);

  // Catalog pricing state (defaults from data/templates.ts, overridable in Neon)
  const [pricedTemplates, setPricedTemplates] = useState<PricedTemplate[]>(TEMPLATES);
  const [editingPriceSlug, setEditingPriceSlug] = useState<string | null>(null);
  const [editPriceOutright, setEditPriceOutright] = useState('');
  const [editPriceSetup, setEditPriceSetup] = useState('');
  const [editPriceMonthly, setEditPriceMonthly] = useState('');
  const [savingPrice, setSavingPrice] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [linksRes, clientsRes, ordersRes, templatesRes, inquiriesRes] = await Promise.all([
        fetch('/api/admin/links').then(r => r.json()),
        fetch('/api/admin/clients').then(r => r.json()),
        fetch('/api/admin/orders').then(r => r.json()),
        fetch('/api/admin/templates').then(r => r.json()).catch(() => null),
        fetch('/api/admin/inquiries').then(r => r.json()).catch(() => null),
      ]);

      if (linksRes.success) {
        setLinks(linksRes.links || []);
        setStats(linksRes.stats || { totalLinks: 0, activeLinks: 0, paidLinks: 0, totalPaidAmount: 0 });
      }
      if (clientsRes.success) {
        setClients(clientsRes.clients || []);
      }
      if (ordersRes.success) {
        setOrders(ordersRes.orders || []);
      }
      if (templatesRes?.success && Array.isArray(templatesRes.templates)) {
        setPricedTemplates(templatesRes.templates);
      }
      if (inquiriesRes?.success && Array.isArray(inquiriesRes.inquiries)) {
        setInquiries(inquiriesRes.inquiries);
      }
    } catch (err) {
      console.error('Error loading admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateInquiryStatus = async (id: number, newStatus: string) => {
    setUpdatingInquiryId(id);
    try {
      const res = await fetch('/api/admin/inquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to update status');
      }
      setInquiries(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
    } catch (err: any) {
      alert(`Status update failed: ${err.message}`);
    } finally {
      setUpdatingInquiryId(null);
    }
  };

  const handleDeleteInquiry = async (id: number) => {
    if (!confirm('Are you sure you want to permanently delete this lead?')) return;
    try {
      const res = await fetch(`/api/admin/inquiries?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to delete lead');
      }
      setInquiries(prev => prev.filter(item => item.id !== id));
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingLink(true);

    const chosenTemplate = TEMPLATES.find(t => t.slug === newLinkTemplateSlug);
    const autoTitle = `${chosenTemplate ? chosenTemplate.name : 'Digital Web Flagship'} Launch Proposal`;
    const titleToSend = newLinkTitle.trim() || autoTitle;

    try {
      const res = await fetch('/api/admin/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: titleToSend,
          clientName: newLinkClientName.trim() || null,
          clientEmail: newLinkClientEmail.trim() || null,
          clientPhone: newLinkClientPhone.trim() || null,
          templateSlug: newLinkTemplateSlug,
          templateName: chosenTemplate ? chosenTemplate.name : newLinkTemplateSlug,
          planType: newLinkPlanType,
          setupFeeNgn: Number(newLinkSetupFee) || 15000,
          monthlyPriceNgn: Number(newLinkMonthly) || 5000,
          outrightPriceNgn: Number(newLinkOutright) || 50000,
          notes: newLinkNotes.trim() || null,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowCreateModal(false);
        setNewLinkTitle('');
        setNewLinkClientName('');
        setNewLinkClientEmail('');
        setNewLinkClientPhone('');
        setNewLinkNotes('');
        fetchAdminData();
      } else {
        alert(`Failed to create link: ${data.error}`);
      }
    } catch (err: any) {
      alert(`Error creating link: ${err.message}`);
    } finally {
      setCreatingLink(false);
    }
  };

  const copyToClipboard = (id: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const fullUrl = `${origin}/pay/${id}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const formatNgn = (val: number) => `₦${Number(val || 0).toLocaleString()}`;

  const startEditingDomain = (client: any) => {
    setEditingClientId(client.id);
    setEditDomainName(client.domain_name || '');
    setEditDomainExpiry(
      client.domain_expiry_date ? new Date(client.domain_expiry_date).toISOString().slice(0, 10) : ''
    );
  };

  const cancelEditingDomain = () => {
    setEditingClientId(null);
    setEditDomainName('');
    setEditDomainExpiry('');
  };

  const saveClientDomain = async (clientId: string) => {
    setSavingDomain(true);
    try {
      const res = await fetch('/api/admin/clients', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          domainName: editDomainName,
          domainExpiryDate: editDomainExpiry || null,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Could not save the domain.');
      }
      setClients(prev => prev.map(c => (c.id === clientId ? { ...c, ...data.client } : c)));
      cancelEditingDomain();
    } catch (err: any) {
      alert(`Domain update failed: ${err.message}`);
    } finally {
      setSavingDomain(false);
    }
  };

  const startEditingPrice = (template: PricedTemplate) => {
    setEditingPriceSlug(template.slug);
    setEditPriceOutright(String(template.outrightNgn ?? template.priceNgn ?? 0));
    setEditPriceSetup(String(template.setupFeeNgn ?? 0));
    setEditPriceMonthly(String(template.monthlyNgn ?? 0));
  };

  const cancelEditingPrice = () => {
    setEditingPriceSlug(null);
    setEditPriceOutright('');
    setEditPriceSetup('');
    setEditPriceMonthly('');
  };

  const saveTemplatePrice = async (slug: string) => {
    setSavingPrice(true);
    try {
      const res = await fetch('/api/admin/templates', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          priceNgn: Number(editPriceOutright) || 0,
          setupFeeNgn: Number(editPriceSetup) || 0,
          monthlyNgn: Number(editPriceMonthly) || 0,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Could not save the pricing.');
      }

      const saved = data.pricing;
      setPricedTemplates(prev =>
        prev.map(t =>
          t.slug === slug
            ? {
                ...t,
                priceNgn: saved.priceNgn,
                outrightNgn: saved.priceNgn,
                setupFeeNgn: saved.setupFeeNgn,
                monthlyNgn: saved.monthlyNgn,
                pricingOverride: true,
              }
            : t
        )
      );
      cancelEditingPrice();
    } catch (err: any) {
      alert(`Pricing update failed: ${err.message}`);
    } finally {
      setSavingPrice(false);
    }
  };

  const resetTemplatePrice = async (slug: string) => {
    const fallback = TEMPLATES.find(t => t.slug === slug);
    if (!fallback) return;
    if (!confirm('Reset this catalog price back to the coded default?')) return;

    setSavingPrice(true);
    try {
      const res = await fetch(`/api/admin/templates?slug=${encodeURIComponent(slug)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Could not reset the pricing.');
      }

      setPricedTemplates(prev =>
        prev.map(t =>
          t.slug === slug
            ? {
                ...t,
                priceNgn: fallback.priceNgn,
                outrightNgn: fallback.outrightNgn,
                setupFeeNgn: fallback.setupFeeNgn,
                monthlyNgn: fallback.monthlyNgn,
                pricingOverride: false,
              }
            : t
        )
      );
      cancelEditingPrice();
    } catch (err: any) {
      alert(`Reset failed: ${err.message}`);
    } finally {
      setSavingPrice(false);
    }
  };

  /** ₦15,000 -> "₦15k", ₦5,000 -> "₦5k", ₦2,500 -> "₦2.5k" */
  const formatShortNgn = (val: number) => {
    const n = Number(val || 0);
    if (n >= 1000 && n % 1000 === 0) return `₦${n / 1000}k`;
    if (n >= 1000) return `₦${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`;
    return `₦${n}`;
  };

  // Filtered lists based on search
  const filteredLinks = useMemo(() => {
    if (!searchQuery) return links;
    const q = searchQuery.toLowerCase();
    return links.filter(l => 
      (l.title && l.title.toLowerCase().includes(q)) ||
      (l.client_name && l.client_name.toLowerCase().includes(q)) ||
      (l.client_email && l.client_email.toLowerCase().includes(q)) ||
      (l.template_name && l.template_name.toLowerCase().includes(q))
    );
  }, [links, searchQuery]);

  const filteredClients = useMemo(() => {
    if (!searchQuery) return clients;
    const q = searchQuery.toLowerCase();
    return clients.filter(c =>
      (c.name && c.name.toLowerCase().includes(q)) ||
      (c.business_name && c.business_name.toLowerCase().includes(q)) ||
      (c.domain_name && c.domain_name.toLowerCase().includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q))
    );
  }, [clients, searchQuery]);

  const filteredOrders = useMemo(() => {
    if (!searchQuery) return orders;
    const q = searchQuery.toLowerCase();
    return orders.filter(o =>
      (o.paystack_reference && o.paystack_reference.toLowerCase().includes(q)) ||
      (o.customer_name && o.customer_name.toLowerCase().includes(q)) ||
      (o.customer_email && o.customer_email.toLowerCase().includes(q))
    );
  }, [orders, searchQuery]);

  const filteredTemplates = useMemo(() => {
    if (!searchQuery) return pricedTemplates;
    const q = searchQuery.toLowerCase();
    return pricedTemplates.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.categoryLabel.toLowerCase().includes(q) ||
      t.tagline.toLowerCase().includes(q)
    );
  }, [searchQuery, pricedTemplates]);

  const filteredInquiries = useMemo(() => {
    let list = inquiries;
    if (inquiryFilter === 'DEMO') {
      list = list.filter(i => i.inquiry_type === 'DEMO_REQUEST');
    } else if (inquiryFilter === 'CONTACT') {
      list = list.filter(i => i.inquiry_type !== 'DEMO_REQUEST');
    } else if (inquiryFilter === 'NEW') {
      list = list.filter(i => i.status === 'NEW');
    }

    if (!searchQuery) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(i =>
      (i.name && i.name.toLowerCase().includes(q)) ||
      (i.email && i.email.toLowerCase().includes(q)) ||
      (i.phone && i.phone.toLowerCase().includes(q)) ||
      (i.business_name && i.business_name.toLowerCase().includes(q)) ||
      (i.template_interest && i.template_interest.toLowerCase().includes(q)) ||
      (i.notes && i.notes.toLowerCase().includes(q))
    );
  }, [inquiries, inquiryFilter, searchQuery]);

  const activeTemplateForModal = useMemo(() => {
    return pricedTemplates.find(t => t.slug === newLinkTemplateSlug) || pricedTemplates[0] || TEMPLATES[0];
  }, [newLinkTemplateSlug, pricedTemplates]);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0c0c0e',
      color: '#e4e4e7',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
    }}>
      
      {/* Top Studio Executive Bar */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(16px)',
        backgroundColor: 'rgba(12, 12, 14, 0.85)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '0 32px',
        height: '68px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Left Brand Unit */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link 
            href="/" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              textDecoration: 'none' 
            }}
          >
            <span style={{
              fontSize: '19px',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              color: '#ffffff',
            }}>
              aB Labs
            </span>
            <span style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.04em',
              padding: '3px 8px',
              borderRadius: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              color: '#a1a1aa',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}>
              Executive Studio
            </span>
          </Link>

          <div style={{ width: '1px', height: '18px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />

          {/* Database Live Telemetry Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            color: '#a1a1aa',
          }}>
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              boxShadow: '0 0 10px rgba(16, 185, 129, 0.6)',
              display: 'inline-block',
            }} />
            <span style={{ fontWeight: 500 }}>Neon Serverless Postgres</span>
            <span style={{ fontSize: '11px', color: '#52525b' }}>· aws-us-east-2</span>
          </div>
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link
            href="/shop"
            target="_blank"
            style={{
              fontSize: '13px',
              fontWeight: 500,
              color: '#a1a1aa',
              textDecoration: 'none',
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              transition: 'all 0.15s ease',
            }}
          >
            Public Catalog ↗
          </Link>

          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              padding: '9px 18px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '-0.01em',
              backgroundColor: '#f4f4f5',
              color: '#09090b',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
              transition: 'transform 0.1s ease',
            }}
          >
            <span style={{ fontSize: '16px', lineHeight: 1, fontWeight: 700 }}>+</span>
            <span>Create Launch Proposal</span>
          </button>
        </div>
      </header>

      {/* Main Executive Body */}
      <main style={{ maxWidth: '1360px', margin: '0 auto', padding: '36px 32px 80px' }}>
        
        {/* Editorial Header & Timeframe */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '28px',
        }}>
          <div>
            <h1 style={{
              fontSize: '26px',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#fafafa',
              margin: '0 0 4px',
            }}>
              Operations &amp; Client Dispatch
            </h1>
            <p style={{
              fontSize: '14px',
              color: '#71717a',
              margin: 0,
            }}>
              Monitor active payments, provisioned client accounts, 1-year domain cycles, and catalog inventory.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={fetchAdminData}
              disabled={loading}
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#a1a1aa',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '6px',
                padding: '6px 12px',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Refreshing...' : '↻ Refresh Ledger'}
            </button>
            <button
              onClick={async () => {
                await fetch('/api/admin/auth', { method: 'DELETE' });
                window.location.href = '/admin/login';
              }}
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '6px',
                padding: '6px 12px',
                cursor: 'pointer',
              }}
            >
              Sign out
            </button>
          </div>
        </div>

        {/* Unified Integrated Metric Board (Anti-SaaS-Card Polish) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          backgroundColor: '#121215',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          overflow: 'hidden',
          marginBottom: '36px',
        }}>
          
          {/* Stat 1: Total Paid Revenue */}
          <div style={{
            padding: '24px 28px',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#71717a', letterSpacing: '0.02em' }}>
                Total Paid Revenue
              </span>
              <span style={{
                fontSize: '10.5px',
                fontWeight: 700,
                color: '#10b981',
                padding: '2px 6px',
                borderRadius: '4px',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
              }}>
                Verified
              </span>
            </div>
            <div style={{
              fontSize: '32px',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {formatNgn(stats.totalPaidAmount)}
            </div>
            <div style={{ fontSize: '12px', color: '#52525b', marginTop: '4px' }}>
              Confirmed Paystack settlements
            </div>
          </div>

          {/* Stat 2: Active Proposals */}
          <div style={{
            padding: '24px 28px',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#71717a', letterSpacing: '0.02em' }}>
                One-Click Proposals
              </span>
              <span style={{
                fontSize: '10.5px',
                fontWeight: 600,
                color: '#a1a1aa',
                padding: '2px 6px',
                borderRadius: '4px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              }}>
                {stats.paidLinks} Converted
              </span>
            </div>
            <div style={{
              fontSize: '32px',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {stats.totalLinks}
            </div>
            <div style={{ fontSize: '12px', color: '#52525b', marginTop: '4px' }}>
              {stats.activeLinks} awaiting client action
            </div>
          </div>

          {/* Stat 3: Provisioned Clients */}
          <div style={{
            padding: '24px 28px',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#71717a', letterSpacing: '0.02em' }}>
                Provisioned Clients
              </span>
              <span style={{
                fontSize: '10.5px',
                fontWeight: 600,
                color: '#10b981',
                padding: '2px 6px',
                borderRadius: '4px',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
              }}>
                100% Active
              </span>
            </div>
            <div style={{
              fontSize: '32px',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {clients.length}
            </div>
            <div style={{ fontSize: '12px', color: '#52525b', marginTop: '4px' }}>
              Automated account + domain cycle
            </div>
          </div>

          {/* Stat 4: Catalog Ready */}
          <div style={{
            padding: '24px 28px',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#71717a', letterSpacing: '0.02em' }}>
                Catalog Foundations
              </span>
              <span style={{
                fontSize: '10.5px',
                fontWeight: 600,
                color: '#d97706',
                padding: '2px 6px',
                borderRadius: '4px',
                backgroundColor: 'rgba(217, 119, 6, 0.1)',
                border: '1px solid rgba(217, 119, 6, 0.2)',
              }}>
                Zero 404s
              </span>
            </div>
            <div style={{
              fontSize: '32px',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {TEMPLATES.length}
            </div>
            <div style={{ fontSize: '12px', color: '#52525b', marginTop: '4px' }}>
              25 Live Vercel production demos
            </div>
          </div>

          {/* Stat 5: Inbound Leads & Demos */}
          <div 
            onClick={() => setActiveTab('inquiries')}
            style={{
              padding: '24px 28px',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#71717a', letterSpacing: '0.02em' }}>
                Inbound Leads
              </span>
              <span style={{
                fontSize: '10.5px',
                fontWeight: 700,
                color: '#a855f7',
                padding: '2px 6px',
                borderRadius: '4px',
                backgroundColor: 'rgba(168, 85, 247, 0.12)',
                border: '1px solid rgba(168, 85, 247, 0.25)',
              }}>
                {inquiries.filter(i => i.status === 'NEW').length} New
              </span>
            </div>
            <div style={{
              fontSize: '32px',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {inquiries.length}
            </div>
            <div style={{ fontSize: '12px', color: '#a1a1aa', marginTop: '4px' }}>
              {inquiries.filter(i => i.inquiry_type === 'DEMO_REQUEST').length} demo requests · View leads →
            </div>
          </div>

        </div>

        {/* Recent Transactions — compact snapshot, full ledger lives in the Paystack tab */}
        <div style={{
          backgroundColor: '#121215',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '14px',
          marginBottom: '20px',
          overflow: 'hidden',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          }}>
            <div>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#f4f4f5', letterSpacing: '-0.01em' }}>
                Recent Transactions
              </span>
              <span style={{ fontSize: '11.5px', color: '#52525b', marginLeft: '8px' }}>
                {orders.length === 0
                  ? 'Awaiting the first Paystack settlement'
                  : `${orders.length} settled in total`}
              </span>
            </div>
            <button
              onClick={() => setActiveTab('orders')}
              style={{
                fontSize: '11.5px',
                fontWeight: 600,
                color: '#a1a1aa',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '6px',
                padding: '5px 10px',
                cursor: 'pointer',
              }}
            >
              View ledger →
            </button>
          </div>

          {orders.length === 0 ? (
            <div style={{ padding: '28px 20px', fontSize: '12.5px', color: '#71717a' }}>
              No transactions yet. Share a one-click proposal link and settlements will appear here in real-time.
            </div>
          ) : (
            <div>
              {orders.slice(0, 4).map((o, idx) => {
                const statusLabel = String(o.status || '').toUpperCase() || 'PAID';
                const isPaid = statusLabel === 'PAID' || statusLabel === 'SUCCESS';
                return (
                  <div
                    key={o.id || o.paystack_reference || idx}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1.2fr 1.4fr 0.9fr 0.8fr 0.7fr',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 20px',
                      borderBottom: idx === Math.min(orders.length, 4) - 1 ? 'none' : '1px solid rgba(255, 255, 255, 0.04)',
                      fontSize: '12.5px',
                    }}
                  >
                    <span style={{ fontFamily: 'monospace', fontSize: '11.5px', color: '#a1a1aa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {o.paystack_reference || '—'}
                    </span>

                    <div style={{ minWidth: 0 }}>
                      <span style={{ display: 'block', fontWeight: 600, color: '#e4e4e7', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {o.customer_name || 'Unnamed client'}
                      </span>
                      <span style={{ display: 'block', fontSize: '11px', color: '#71717a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {o.customer_email || '—'}
                      </span>
                    </div>

                    <span style={{ fontWeight: 700, color: '#10b981', fontVariantNumeric: 'tabular-nums' }}>
                      {formatNgn(o.amount_paid_ngn)}
                    </span>

                    <span style={{
                      justifySelf: 'start',
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      color: isPaid ? '#34d399' : '#fbbf24',
                      backgroundColor: isPaid ? 'rgba(52, 211, 153, 0.12)' : 'rgba(251, 191, 36, 0.12)',
                    }}>
                      {statusLabel}
                    </span>

                    <span style={{ fontSize: '11.5px', color: '#71717a', textAlign: 'right' }}>
                      {o.created_at ? new Date(o.created_at).toLocaleDateString('en-NG', { day: '2-digit', month: 'short' }) : '—'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Toolbar: Segmented Tab Selector + Universal Search Filter */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px',
        }}>
          {/* Segmented Control */}
          <div style={{
            display: 'inline-flex',
            padding: '4px',
            backgroundColor: '#16161a',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}>
            <button
              onClick={() => setActiveTab('links')}
              style={{
                padding: '7px 16px',
                borderRadius: '7px',
                fontSize: '13px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeTab === 'links' ? '#27272a' : 'transparent',
                color: activeTab === 'links' ? '#ffffff' : '#71717a',
                transition: 'all 0.15s ease',
              }}
            >
              One-Click Proposals ({links.length})
            </button>

            <button
              onClick={() => setActiveTab('clients')}
              style={{
                padding: '7px 16px',
                borderRadius: '7px',
                fontSize: '13px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeTab === 'clients' ? '#27272a' : 'transparent',
                color: activeTab === 'clients' ? '#ffffff' : '#71717a',
                transition: 'all 0.15s ease',
              }}
            >
              Clients &amp; Domains ({clients.length})
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              style={{
                padding: '7px 16px',
                borderRadius: '7px',
                fontSize: '13px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeTab === 'orders' ? '#27272a' : 'transparent',
                color: activeTab === 'orders' ? '#ffffff' : '#71717a',
                transition: 'all 0.15s ease',
              }}
            >
              Paystack Ledger ({orders.length})
            </button>

            <button
              onClick={() => setActiveTab('templates')}
              style={{
                padding: '7px 16px',
                borderRadius: '7px',
                fontSize: '13px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeTab === 'templates' ? '#27272a' : 'transparent',
                color: activeTab === 'templates' ? '#ffffff' : '#71717a',
                transition: 'all 0.15s ease',
              }}
            >
              Catalog Inventory ({TEMPLATES.length})
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              style={{
                padding: '7px 16px',
                borderRadius: '7px',
                fontSize: '13px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeTab === 'inquiries' ? '#27272a' : 'transparent',
                color: activeTab === 'inquiries' ? '#ffffff' : '#71717a',
                transition: 'all 0.15s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>Inbound Leads ({inquiries.length})</span>
              {inquiries.filter(i => i.status === 'NEW').length > 0 && (
                <span style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '1px 5px',
                  borderRadius: '10px',
                  backgroundColor: '#a855f7',
                  color: '#ffffff',
                }}>
                  {inquiries.filter(i => i.status === 'NEW').length}
                </span>
              )}
            </button>
          </div>

          {/* Quick Search Field */}
          <div style={{ position: 'relative', width: '280px' }}>
            <input
              type="text"
              placeholder="Search records or filter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 32px',
                backgroundColor: '#16161a',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <span style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#52525b',
              fontSize: '13px',
              pointerEvents: 'none',
            }}>
              🔍
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#71717a',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Tab 1: One-Click Proposals Table */}
        {activeTab === 'links' && (
          <div style={{
            backgroundColor: '#121215',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            overflow: 'hidden',
          }}>
            {filteredLinks.length === 0 ? (
              <div style={{ padding: '64px 24px', textAlign: 'center' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  color: '#71717a',
                }}>
                  ✦
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#f4f4f5', margin: '0 0 6px' }}>
                  {searchQuery ? 'No matching proposals found' : 'No checkout links generated yet'}
                </h3>
                <p style={{ fontSize: '13px', color: '#71717a', margin: '0 0 20px', maxWidth: '380px', marginLeft: 'auto', marginRight: 'auto' }}>
                  {searchQuery ? 'Try clearing your search query.' : 'Create your first personalized launch proposal link to send to prospective clients.'}
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  style={{
                    padding: '8px 18px',
                    backgroundColor: '#ffffff',
                    color: '#09090b',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Create Proposal Link
                </button>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{
                    backgroundColor: '#16161a',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    color: '#71717a',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}>
                    <th style={{ padding: '14px 20px' }}>Proposal &amp; Client</th>
                    <th style={{ padding: '14px 20px' }}>Selected Foundation</th>
                    <th style={{ padding: '14px 20px' }}>Fee Structure</th>
                    <th style={{ padding: '14px 20px' }}>Status</th>
                    <th style={{ padding: '14px 20px' }}>Views</th>
                    <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLinks.map((link, idx) => (
                    <tr 
                      key={link.id} 
                      style={{ 
                        borderBottom: idx === filteredLinks.length - 1 ? 'none' : '1px solid rgba(255, 255, 255, 0.05)',
                        transition: 'background-color 0.12s ease',
                      }}
                    >
                      {/* Proposal Title & Client */}
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ fontWeight: 600, color: '#f4f4f5', fontSize: '14px' }}>
                          {link.title}
                        </div>
                        <div style={{ color: '#71717a', fontSize: '12px', marginTop: '2px' }}>
                          {link.client_name ? `${link.client_name} · ` : ''}{link.client_email || 'Direct Share'}
                        </div>
                      </td>

                      {/* Template */}
                      <td style={{ padding: '16px 20px', color: '#a1a1aa' }}>
                        <span style={{ fontWeight: 500, color: '#e4e4e7' }}>{link.template_name}</span>
                      </td>

                      {/* Plan & Amount */}
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ fontWeight: 700, color: '#ffffff', fontVariantNumeric: 'tabular-nums' }}>
                          {formatNgn(link.amount_due_now_ngn)}
                        </div>
                        <div style={{ fontSize: '11px', color: '#71717a', marginTop: '1px' }}>
                          {link.plan_type === 'MONTHLY'
                            ? `${formatShortNgn(Number(link.setup_fee_ngn ?? 0))} setup + ${formatShortNgn(Number(link.monthly_price_ngn ?? 0))}/mo`
                            : `${formatShortNgn(Number(link.outright_price_ngn ?? link.amount_due_now_ngn ?? 0))} outright ownership`}
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 700,
                          backgroundColor: link.status === 'PAID' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(217, 119, 6, 0.12)',
                          color: link.status === 'PAID' ? '#34d399' : '#fbbf24',
                          border: link.status === 'PAID' ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(217, 119, 6, 0.25)',
                        }}>
                          <span style={{
                            width: '5px',
                            height: '5px',
                            borderRadius: '50%',
                            backgroundColor: link.status === 'PAID' ? '#34d399' : '#fbbf24',
                          }} />
                          {link.status}
                        </span>
                      </td>

                      {/* Clicks */}
                      <td style={{ padding: '16px 20px', color: '#71717a', fontVariantNumeric: 'tabular-nums' }}>
                        {link.clicks_count || 0}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button
                            onClick={() => copyToClipboard(link.id)}
                            style={{
                              padding: '6px 12px',
                              backgroundColor: copiedId === link.id ? '#10b981' : 'rgba(255, 255, 255, 0.05)',
                              color: copiedId === link.id ? '#ffffff' : '#d4d4d8',
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: 500,
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            {copiedId === link.id ? '✓ Copied' : 'Copy Link'}
                          </button>
                          
                          <Link
                            href={`/pay/${link.id}`}
                            target="_blank"
                            style={{
                              padding: '6px 12px',
                              backgroundColor: 'rgba(255, 255, 255, 0.05)',
                              color: '#a1a1aa',
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: 500,
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <span>Open</span>
                            <span style={{ fontSize: '11px' }}>↗</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Tab 2: Clients & Domain Tracker */}
        {activeTab === 'clients' && (
          <div style={{
            backgroundColor: '#121215',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            overflow: 'hidden',
          }}>
            {filteredClients.length === 0 ? (
              <div style={{ padding: '64px 24px', textAlign: 'center' }}>
                <p style={{ color: '#71717a', fontSize: '14px' }}>
                  {searchQuery ? 'No matching clients found.' : 'No client accounts provisioned yet. Accounts automatically appear upon Paystack settlement.'}
                </p>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{
                    backgroundColor: '#16161a',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    color: '#71717a',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}>
                    <th style={{ padding: '14px 20px' }}>Client &amp; Brand</th>
                    <th style={{ padding: '14px 20px' }}>Registered Domain</th>
                    <th style={{ padding: '14px 20px' }}>1-Year Renewal Runway</th>
                    <th style={{ padding: '14px 20px' }}>Monthly Status</th>
                    <th style={{ padding: '14px 20px', textAlign: 'right' }}>Direct Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((c, idx) => {
                    const expiry = c.domain_expiry_date ? new Date(c.domain_expiry_date) : null;
                    const daysLeft = expiry ? Math.ceil((expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 365;

                    return (
                      <tr 
                        key={c.id} 
                        style={{ 
                          borderBottom: idx === filteredClients.length - 1 ? 'none' : '1px solid rgba(255, 255, 255, 0.05)',
                        }}
                      >
                        <td style={{ padding: '16px 20px' }}>
                          <strong style={{ color: '#f4f4f5', display: 'block', fontSize: '14px' }}>{c.name}</strong>
                          <span style={{ color: '#71717a', fontSize: '12px' }}>{c.business_name || c.email}</span>
                        </td>

                        <td style={{ padding: '16px 20px' }}>
                          {editingClientId === c.id ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '190px' }}>
                              <input
                                type="text"
                                value={editDomainName}
                                onChange={(e) => setEditDomainName(e.target.value)}
                                placeholder="clientbrand.com.ng"
                                style={{
                                  padding: '7px 9px',
                                  borderRadius: '6px',
                                  border: '1px solid rgba(255, 255, 255, 0.14)',
                                  backgroundColor: '#16161a',
                                  color: '#f4f4f5',
                                  fontSize: '12.5px',
                                  fontFamily: 'monospace',
                                  outline: 'none',
                                  width: '100%',
                                }}
                              />
                              <input
                                type="date"
                                value={editDomainExpiry}
                                onChange={(e) => setEditDomainExpiry(e.target.value)}
                                style={{
                                  padding: '6px 9px',
                                  borderRadius: '6px',
                                  border: '1px solid rgba(255, 255, 255, 0.14)',
                                  backgroundColor: '#16161a',
                                  color: '#f4f4f5',
                                  fontSize: '12.5px',
                                  outline: 'none',
                                  width: '100%',
                                }}
                              />
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button
                                  type="button"
                                  onClick={() => saveClientDomain(c.id)}
                                  disabled={savingDomain}
                                  style={{
                                    padding: '5px 12px',
                                    borderRadius: '6px',
                                    border: '1px solid rgba(16, 185, 129, 0.3)',
                                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                                    color: '#34d399',
                                    fontSize: '11.5px',
                                    fontWeight: 700,
                                    cursor: savingDomain ? 'not-allowed' : 'pointer',
                                  }}
                                >
                                  {savingDomain ? 'Saving...' : 'Save'}
                                </button>
                                <button
                                  type="button"
                                  onClick={cancelEditingDomain}
                                  disabled={savingDomain}
                                  style={{
                                    padding: '5px 12px',
                                    borderRadius: '6px',
                                    border: '1px solid rgba(255, 255, 255, 0.12)',
                                    backgroundColor: 'transparent',
                                    color: '#a1a1aa',
                                    fontSize: '11.5px',
                                    fontWeight: 600,
                                    cursor: savingDomain ? 'not-allowed' : 'pointer',
                                  }}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                              <span style={{
                                fontFamily: 'monospace',
                                fontWeight: 600,
                                color: c.domain_name ? '#10b981' : '#71717a',
                                fontSize: '13px',
                              }}>
                                {c.domain_name || 'Custom .com.ng (Pending)'}
                              </span>
                              <button
                                type="button"
                                onClick={() => startEditingDomain(c)}
                                style={{
                                  padding: '3px 9px',
                                  borderRadius: '6px',
                                  border: '1px solid rgba(255, 255, 255, 0.12)',
                                  backgroundColor: 'transparent',
                                  color: '#a1a1aa',
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                }}
                              >
                                {c.domain_name ? 'Edit' : 'Set'}
                              </button>
                            </div>
                          )}
                        </td>

                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 600, color: '#ffffff', fontVariantNumeric: 'tabular-nums' }}>
                              {daysLeft} days remaining
                            </span>
                          </div>
                          <span style={{ display: 'block', fontSize: '11px', color: '#71717a', marginTop: '2px' }}>
                            Expires: {expiry ? expiry.toLocaleDateString() : '1 Year From Launch'}
                          </span>
                        </td>

                        <td style={{ padding: '16px 20px' }}>
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 700,
                            backgroundColor: 'rgba(16, 185, 129, 0.12)',
                            color: '#34d399',
                            border: '1px solid rgba(16, 185, 129, 0.25)',
                          }}>
                            {c.monthly_status}
                          </span>
                        </td>

                        <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                          {c.phone ? (
                            <a
                              href={`https://wa.me/${c.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${c.name}, this is engineering from aB Labs regarding your domain setup.`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                padding: '6px 12px',
                                backgroundColor: 'rgba(22, 163, 74, 0.15)',
                                color: '#4ade80',
                                border: '1px solid rgba(22, 163, 74, 0.3)',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: 600,
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}
                            >
                              <span>WhatsApp</span>
                              <span style={{ fontSize: '10px' }}>↗</span>
                            </a>
                          ) : (
                            <span style={{ color: '#52525b' }}>-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Tab 3: Orders Ledger */}
        {activeTab === 'orders' && (
          <div style={{
            backgroundColor: '#121215',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            overflow: 'hidden',
          }}>
            {filteredOrders.length === 0 ? (
              <div style={{ padding: '64px 24px', textAlign: 'center' }}>
                <p style={{ color: '#71717a', fontSize: '14px' }}>
                  {searchQuery ? 'No matching orders found.' : 'No transactions recorded yet. When a lead pays via Paystack, the ledger updates in real-time.'}
                </p>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{
                    backgroundColor: '#16161a',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    color: '#71717a',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}>
                    <th style={{ padding: '14px 20px' }}>Paystack Reference</th>
                    <th style={{ padding: '14px 20px' }}>Client</th>
                    <th style={{ padding: '14px 20px' }}>Settled Amount</th>
                    <th style={{ padding: '14px 20px' }}>Plan Type</th>
                    <th style={{ padding: '14px 20px' }}>Status</th>
                    <th style={{ padding: '14px 20px', textAlign: 'right' }}>Settlement Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((o, idx) => (
                    <tr 
                      key={o.id} 
                      style={{ 
                        borderBottom: idx === filteredOrders.length - 1 ? 'none' : '1px solid rgba(255, 255, 255, 0.05)',
                      }}
                    >
                      <td style={{ padding: '16px 20px', fontFamily: 'monospace', color: '#a1a1aa' }}>
                        {o.paystack_reference}
                      </td>

                      <td style={{ padding: '16px 20px' }}>
                        <strong style={{ color: '#f4f4f5', display: 'block', fontSize: '14px' }}>{o.customer_name}</strong>
                        <span style={{ color: '#71717a', fontSize: '12px' }}>{o.customer_email}</span>
                      </td>

                      <td style={{ padding: '16px 20px', fontWeight: 700, color: '#10b981', fontVariantNumeric: 'tabular-nums' }}>
                        {formatNgn(o.amount_paid_ngn)}
                      </td>

                      <td style={{ padding: '16px 20px', color: '#d4d4d8' }}>
                        {o.plan_type}
                      </td>

                      <td style={{ padding: '16px 20px' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 700,
                          backgroundColor: o.paystack_status === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(217, 119, 6, 0.12)',
                          color: o.paystack_status === 'success' ? '#34d399' : '#fbbf24',
                          border: o.paystack_status === 'success' ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(217, 119, 6, 0.25)',
                        }}>
                          {o.paystack_status}
                        </span>
                      </td>

                      <td style={{ padding: '16px 20px', textAlign: 'right', color: '#71717a', fontSize: '12px' }}>
                        {new Date(o.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Tab 4: Catalog Foundations Grid */}
        {activeTab === 'templates' && (
          <div>
            <div className="admin-catalog-grid">
              {filteredTemplates.map((t) => (
                <div 
                  key={t.slug}
                  style={{
                    backgroundColor: '#121215',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'border-color 0.15s ease',
                  }}
                >
                  <div style={{ position: 'relative', height: '170px', backgroundColor: '#18181b', overflow: 'hidden' }}>
                    <img 
                      src={t.image} 
                      alt={t.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      fontSize: '10.5px',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(0, 0, 0, 0.75)',
                      backdropFilter: 'blur(8px)',
                      color: '#ffffff',
                    }}>
                      {t.categoryLabel}
                    </div>
                  </div>

                  <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f4f4f5', margin: '0 0 6px' }}>
                      {t.name}
                    </h3>
                    <p style={{ fontSize: '12.5px', color: '#71717a', lineHeight: 1.45, margin: '0 0 16px', flex: 1 }}>
                      {t.tagline}
                    </p>

                    <div style={{
                      paddingTop: '14px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                    }}>
                      {editingPriceSlug === t.slug ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                            {([
                              { label: 'Outright ₦', value: editPriceOutright, set: setEditPriceOutright },
                              { label: 'Setup ₦', value: editPriceSetup, set: setEditPriceSetup },
                              { label: 'Monthly ₦', value: editPriceMonthly, set: setEditPriceMonthly },
                            ]).map((field) => (
                              <label key={field.label} style={{ display: 'block' }}>
                                <span style={{ display: 'block', fontSize: '10px', fontWeight: 600, color: '#71717a', marginBottom: '4px' }}>
                                  {field.label}
                                </span>
                                <input
                                  type="number"
                                  min={0}
                                  step={500}
                                  value={field.value}
                                  onChange={(e) => field.set(e.target.value)}
                                  disabled={savingPrice}
                                  style={{
                                    width: '100%',
                                    padding: '7px 8px',
                                    backgroundColor: '#18181b',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '6px',
                                    color: '#ffffff',
                                    fontSize: '12.5px',
                                    fontWeight: 600,
                                    boxSizing: 'border-box',
                                    outline: 'none',
                                    colorScheme: 'dark',
                                  }}
                                />
                              </label>
                            ))}
                          </div>

                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => saveTemplatePrice(t.slug)}
                              disabled={savingPrice}
                              style={{
                                flex: 1,
                                fontSize: '12px',
                                fontWeight: 600,
                                color: '#052e16',
                                backgroundColor: '#34d399',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '6px 12px',
                                cursor: savingPrice ? 'wait' : 'pointer',
                                opacity: savingPrice ? 0.6 : 1,
                              }}
                            >
                              {savingPrice ? 'Saving…' : 'Save price'}
                            </button>
                            <button
                              onClick={cancelEditingPrice}
                              disabled={savingPrice}
                              style={{
                                fontSize: '12px',
                                fontWeight: 600,
                                color: '#a1a1aa',
                                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                borderRadius: '6px',
                                padding: '6px 12px',
                                cursor: 'pointer',
                              }}
                            >
                              Cancel
                            </button>
                            {(t.pricingOverride || (t.priceNgn !== (t.basePriceNgn ?? t.priceNgn))) && (
                              <button
                                onClick={() => resetTemplatePrice(t.slug)}
                                disabled={savingPrice}
                                style={{
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  color: '#fca5a5',
                                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                  border: '1px solid rgba(239, 68, 68, 0.25)',
                                  borderRadius: '6px',
                                  padding: '6px 12px',
                                  cursor: 'pointer',
                                }}
                              >
                                Reset
                              </button>
                            )}
                          </div>

                          <span style={{ fontSize: '10.5px', color: '#71717a' }}>
                            Saves to the live catalog instantly.
                          </span>
                        </div>
                      ) : (
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                          <div>
                            <span style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff' }}>
                              {formatNgn(t.outrightNgn ?? t.priceNgn)}
                            </span>
                            {t.pricingOverride && (
                              <span style={{
                                marginLeft: '6px',
                                fontSize: '9.5px',
                                fontWeight: 700,
                                letterSpacing: '0.04em',
                                textTransform: 'uppercase',
                                color: '#34d399',
                                backgroundColor: 'rgba(52, 211, 153, 0.12)',
                                padding: '2px 5px',
                                borderRadius: '4px',
                                verticalAlign: 'middle',
                              }}>
                                Custom
                              </span>
                            )}
                            <span style={{ fontSize: '11px', color: '#71717a', display: 'block' }}>
                              or {formatShortNgn(t.setupFeeNgn)} + {formatShortNgn(t.monthlyNgn)}/mo
                            </span>
                          </div>

                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => startEditingPrice(t)}
                              style={{
                                fontSize: '12px',
                                fontWeight: 600,
                                color: '#a1a1aa',
                                background: 'transparent',
                                textDecoration: 'none',
                                padding: '5px 10px',
                                borderRadius: '6px',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                                cursor: 'pointer',
                              }}
                            >
                              Price
                            </button>
                            {t.demoUrl && (
                              <a
                                href={t.demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  color: '#a1a1aa',
                                  textDecoration: 'none',
                                  padding: '5px 10px',
                                  borderRadius: '6px',
                                  border: '1px solid rgba(255, 255, 255, 0.08)',
                                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                                }}
                              >
                                Demo ↗
                              </a>
                            )}
                            <button
                              onClick={() => {
                                setNewLinkTemplateSlug(t.slug);
                                setNewLinkOutright(Number(t.outrightNgn ?? t.priceNgn));
                                setNewLinkSetupFee(Number(t.setupFeeNgn));
                                setNewLinkMonthly(Number(t.monthlyNgn));
                                setShowCreateModal(true);
                              }}
                              style={{
                                fontSize: '12px',
                                fontWeight: 600,
                                color: '#ffffff',
                                backgroundColor: '#27272a',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '5px 12px',
                                cursor: 'pointer',
                              }}
                            >
                              Use in Link
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Inbound Leads & Demo Requests */}
        {activeTab === 'inquiries' && (
          <div style={{
            backgroundColor: '#121215',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            overflow: 'hidden',
          }}>
            {/* Header + Filter Bar */}
            <div style={{
              padding: '24px 28px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff', margin: 0 }}>
                    Inbound Leads &amp; Demo Requests
                  </h2>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(168, 85, 247, 0.15)',
                    color: '#c084fc',
                    border: '1px solid rgba(168, 85, 247, 0.25)',
                  }}>
                    {inquiries.length} Total Submissions
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: '#71717a', margin: '4px 0 0' }}>
                  Live leads submitted via the 2-option Demo Request modal and Contact Us form. Directly reach out via WhatsApp or email.
                </p>
              </div>

              {/* Sub-Filter Chips */}
              <div style={{
                display: 'inline-flex',
                gap: '6px',
                padding: '4px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}>
                <button
                  onClick={() => setInquiryFilter('ALL')}
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    padding: '5px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: inquiryFilter === 'ALL' ? '#27272a' : 'transparent',
                    color: inquiryFilter === 'ALL' ? '#ffffff' : '#a1a1aa',
                  }}
                >
                  All ({inquiries.length})
                </button>
                <button
                  onClick={() => setInquiryFilter('DEMO')}
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    padding: '5px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: inquiryFilter === 'DEMO' ? '#27272a' : 'transparent',
                    color: inquiryFilter === 'DEMO' ? '#ffffff' : '#a1a1aa',
                  }}
                >
                  ⚡ Demo Requests ({inquiries.filter(i => i.inquiry_type === 'DEMO_REQUEST').length})
                </button>
                <button
                  onClick={() => setInquiryFilter('CONTACT')}
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    padding: '5px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: inquiryFilter === 'CONTACT' ? '#27272a' : 'transparent',
                    color: inquiryFilter === 'CONTACT' ? '#ffffff' : '#a1a1aa',
                  }}
                >
                  📬 General Contact ({inquiries.filter(i => i.inquiry_type !== 'DEMO_REQUEST').length})
                </button>
                <button
                  onClick={() => setInquiryFilter('NEW')}
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    padding: '5px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: inquiryFilter === 'NEW' ? '#27272a' : 'transparent',
                    color: inquiryFilter === 'NEW' ? '#ffffff' : '#a1a1aa',
                  }}
                >
                  🔥 New ({inquiries.filter(i => i.status === 'NEW').length})
                </button>
              </div>
            </div>

            {/* Inquiries List */}
            {filteredInquiries.length === 0 ? (
              <div style={{ padding: '64px 28px', textAlign: 'center' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  fontSize: '22px',
                }}>
                  📬
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f4f4f5', margin: '0 0 6px' }}>
                  No submissions found
                </h3>
                <p style={{ fontSize: '13px', color: '#71717a', maxWidth: '420px', margin: '0 auto' }}>
                  {searchQuery
                    ? `No leads match "${searchQuery}". Try clearing the search bar or choosing another filter.`
                    : 'When clients request a free demo or submit the contact form, their information and project scope will appear here immediately.'}
                </p>
              </div>
            ) : (
              <div>
                {filteredInquiries.map((inq, idx) => {
                  const isDemo = inq.inquiry_type === 'DEMO_REQUEST';
                  const isNew = inq.status === 'NEW';
                  const isContacted = inq.status === 'CONTACTED';
                  const isConverted = inq.status === 'CONVERTED';

                  // Format phone for WhatsApp
                  const rawPhone = String(inq.phone || '').trim();
                  const cleanDigits = rawPhone.replace(/[^0-9]/g, '');
                  const waNumber = cleanDigits.startsWith('0')
                    ? '234' + cleanDigits.slice(1)
                    : cleanDigits.length === 10
                    ? '234' + cleanDigits
                    : cleanDigits;

                  const waMessage = encodeURIComponent(
                    `Hello ${inq.name}! Thank you for your interest in aB Labs ${inq.template_interest ? `(${inq.template_interest})` : ''}. We received your inquiry and would love to assist you with your brand demo and launch.`
                  );
                  const waUrl = waNumber ? `https://wa.me/${waNumber}?text=${waMessage}` : null;

                  return (
                    <div
                      key={inq.id || idx}
                      style={{
                        padding: '24px 28px',
                        borderBottom: idx === filteredInquiries.length - 1 ? 'none' : '1px solid rgba(255, 255, 255, 0.05)',
                        backgroundColor: isNew ? 'rgba(168, 85, 247, 0.02)' : 'transparent',
                        transition: 'background-color 0.15s ease',
                      }}
                    >
                      {/* Top Bar: Badges + Timestamp + Status Dropdown */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '12px',
                        marginBottom: '14px',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          {/* Type Badge */}
                          <span style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            letterSpacing: '0.02em',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            backgroundColor: isDemo ? 'rgba(168, 85, 247, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                            color: isDemo ? '#c084fc' : '#60a5fa',
                            border: `1px solid ${isDemo ? 'rgba(168, 85, 247, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}>
                            {isDemo ? '⚡ Demo Request' : '📬 General Contact'}
                          </span>

                          {/* Plan Badge (if demo) */}
                          {inq.plan_type && (
                            <span style={{
                              fontSize: '11px',
                              fontWeight: 600,
                              padding: '3px 8px',
                              borderRadius: '6px',
                              backgroundColor: 'rgba(255, 255, 255, 0.06)',
                              color: '#e4e4e7',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                            }}>
                              Plan: {inq.plan_type === 'MONTHLY' ? '₦5k/mo Monthly' : '₦50k Outright'}
                            </span>
                          )}

                          {/* Template Interest Badge */}
                          {inq.template_interest && (
                            <span style={{
                              fontSize: '11px',
                              fontWeight: 600,
                              padding: '3px 8px',
                              borderRadius: '6px',
                              backgroundColor: 'rgba(245, 158, 11, 0.1)',
                              color: '#fbbf24',
                              border: '1px solid rgba(245, 158, 11, 0.25)',
                            }}>
                              Design: {inq.template_interest}
                            </span>
                          )}

                          {/* Created Date */}
                          <span style={{ fontSize: '12px', color: '#71717a' }}>
                            {inq.created_at
                              ? new Date(inq.created_at).toLocaleString('en-NG', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : '—'}
                          </span>
                        </div>

                        {/* Status Changer + Actions */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '11.5px', color: '#71717a' }}>Status:</span>
                            <select
                              value={inq.status || 'NEW'}
                              disabled={updatingInquiryId === inq.id}
                              onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value)}
                              style={{
                                fontSize: '11.5px',
                                fontWeight: 700,
                                padding: '4px 8px',
                                borderRadius: '6px',
                                backgroundColor: isNew
                                  ? 'rgba(245, 158, 11, 0.15)'
                                  : isContacted
                                  ? 'rgba(59, 130, 246, 0.15)'
                                  : isConverted
                                  ? 'rgba(16, 185, 129, 0.15)'
                                  : '#1f1f23',
                                color: isNew
                                  ? '#fbbf24'
                                  : isContacted
                                  ? '#60a5fa'
                                  : isConverted
                                  ? '#34d399'
                                  : '#a1a1aa',
                                border: '1px solid rgba(255, 255, 255, 0.12)',
                                cursor: 'pointer',
                                outline: 'none',
                              }}
                            >
                              <option value="NEW" style={{ backgroundColor: '#18181b', color: '#fbbf24' }}>● New Lead</option>
                              <option value="CONTACTED" style={{ backgroundColor: '#18181b', color: '#60a5fa' }}>● Contacted</option>
                              <option value="CONVERTED" style={{ backgroundColor: '#18181b', color: '#34d399' }}>● Converted</option>
                              <option value="ARCHIVED" style={{ backgroundColor: '#18181b', color: '#a1a1aa' }}>● Archived</option>
                            </select>
                          </div>

                          <button
                            onClick={() => handleDeleteInquiry(inq.id)}
                            title="Delete this lead"
                            style={{
                              padding: '5px 8px',
                              fontSize: '11.5px',
                              color: '#71717a',
                              backgroundColor: 'transparent',
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                            }}
                            onMouseOver={(e) => (e.currentTarget.style.color = '#ef4444')}
                            onMouseOut={(e) => (e.currentTarget.style.color = '#71717a')}
                          >
                            ✕
                          </button>
                        </div>
                      </div>

                      {/* Lead Details Card Content */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '16px',
                        marginBottom: '14px',
                      }}>
                        {/* Name & Business */}
                        <div>
                          <span style={{ fontSize: '11px', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '2px' }}>
                            Client Name
                          </span>
                          <span style={{ fontSize: '14px', fontWeight: 700, color: '#f4f4f5', display: 'block' }}>
                            {inq.name || 'Unnamed Client'}
                          </span>
                          {inq.business_name && (
                            <span style={{ fontSize: '12px', color: '#a1a1aa', display: 'block', marginTop: '2px' }}>
                              🏢 {inq.business_name}
                            </span>
                          )}
                        </div>

                        {/* Email */}
                        <div>
                          <span style={{ fontSize: '11px', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '2px' }}>
                            Email Address
                          </span>
                          <a
                            href={`mailto:${inq.email}?subject=Regarding your aB Labs Demo Request`}
                            style={{ fontSize: '13px', color: '#60a5fa', textDecoration: 'none', display: 'inline-block' }}
                          >
                            ✉️ {inq.email}
                          </a>
                        </div>

                        {/* Phone / WhatsApp */}
                        <div>
                          <span style={{ fontSize: '11px', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '2px' }}>
                            Phone / WhatsApp
                          </span>
                          {inq.phone ? (
                            <span style={{ fontSize: '13px', color: '#e4e4e7', fontFamily: 'monospace' }}>
                              📞 {inq.phone}
                            </span>
                          ) : (
                            <span style={{ fontSize: '12px', color: '#52525b' }}>None provided</span>
                          )}
                        </div>
                      </div>

                      {/* Message / Scope Notes */}
                      {inq.notes && (
                        <div style={{
                          padding: '12px 16px',
                          borderRadius: '8px',
                          backgroundColor: '#18181b',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          marginBottom: '14px',
                        }}>
                          <span style={{ fontSize: '11px', fontWeight: 600, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '4px' }}>
                            Notes / Requirements
                          </span>
                          <p style={{ fontSize: '13px', color: '#d4d4d8', margin: 0, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                            {inq.notes}
                          </p>
                        </div>
                      )}

                      {/* Action Bar */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
                        {waUrl && (
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '7px 14px',
                              borderRadius: '7px',
                              fontSize: '12.5px',
                              fontWeight: 700,
                              backgroundColor: '#25D366',
                              color: '#000000',
                              textDecoration: 'none',
                              boxShadow: '0 1px 3px rgba(37, 211, 102, 0.3)',
                              transition: 'transform 0.1s ease',
                            }}
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.838.813 2.796.813h.005c3.179 0 5.767-2.586 5.768-5.766 0-3.18-2.587-5.766-5.773-5.766zm3.383 8.163c-.143.402-.832.74-1.15.777-.318.037-.733.056-2.18-.541-1.849-.762-3.033-2.651-3.125-2.774-.092-.123-.746-.992-.746-1.892s.471-1.343.639-1.515c.168-.172.367-.215.49-.215.123 0 .245.001.352.006.113.005.264-.043.413.315.153.368.522 1.272.568 1.364.046.092.077.2.015.323s-.092.2-.184.307c-.092.107-.194.24-.277.323-.092.092-.188.192-.081.376.107.184.477.787 1.023 1.274.704.628 1.298.822 1.482.914.184.092.292.077.4-.046.107-.123.46-1.343.583-.49.123-.153.245-.123.414-.061.168.061 1.074.506 1.258.598.184.092.307.138.352.215.046.077.046.445-.097.847z"/>
                            </svg>
                            <span>WhatsApp Client</span>
                          </a>
                        )}

                        <a
                          href={`mailto:${inq.email}?subject=Your aB Labs Demo Request`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '7px 14px',
                            borderRadius: '7px',
                            fontSize: '12.5px',
                            fontWeight: 600,
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            color: '#e4e4e7',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            textDecoration: 'none',
                          }}
                        >
                          <span>Email Reply</span>
                        </a>

                        {/* Fast Track to Proposal Link creation */}
                        <button
                          onClick={() => {
                            setNewLinkClientName(inq.name || '');
                            setNewLinkClientEmail(inq.email || '');
                            setNewLinkClientPhone(inq.phone || '');
                            if (inq.template_interest) {
                              const found = TEMPLATES.find(
                                t => t.slug === inq.template_interest || t.name.toLowerCase().includes(inq.template_interest.toLowerCase())
                              );
                              if (found) {
                                setNewLinkTemplateSlug(found.slug);
                                setNewLinkOutright(Number(found.outrightNgn ?? found.priceNgn));
                                setNewLinkSetupFee(Number(found.setupFeeNgn));
                                setNewLinkMonthly(Number(found.monthlyNgn));
                              }
                            }
                            if (inq.plan_type === 'OUTRIGHT') {
                              setNewLinkPlanType('OUTRIGHT');
                            } else {
                              setNewLinkPlanType('MONTHLY');
                            }
                            if (inq.notes) {
                              setNewLinkNotes(inq.notes);
                            }
                            setShowCreateModal(true);
                          }}
                          style={{
                            padding: '7px 14px',
                            borderRadius: '7px',
                            fontSize: '12.5px',
                            fontWeight: 600,
                            backgroundColor: '#27272a',
                            color: '#ffffff',
                            border: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          Generate Proposal Link →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Bespoke Proposal Generator Modal / Drawer */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          zIndex: 9999,
        }}>
          <div style={{
            backgroundColor: '#121215',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '18px',
            maxWidth: '620px',
            width: '100%',
            maxHeight: '92vh',
            overflowY: 'auto',
            padding: '32px',
            boxShadow: '0 24px 64px rgba(0, 0, 0, 0.6)',
          }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#10b981' }}>
                  ✦ Instant One-Click Checkout
                </span>
                <h2 style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff', margin: '4px 0 0' }}>
                  Create Launch Proposal Link
                </h2>
                <p style={{ fontSize: '13px', color: '#71717a', margin: '4px 0 0' }}>
                  Configure a custom proposal link configured for your prospective client.
                </p>
              </div>

              <button
                onClick={() => setShowCreateModal(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#a1a1aa',
                  borderRadius: '6px',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLink} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Proposal Title */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#d4d4d8', marginBottom: '6px' }}>
                  Proposal Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. VIP Detailing Launch (Auto-generated if left blank)"
                  value={newLinkTitle}
                  onChange={(e) => setNewLinkTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    backgroundColor: '#18181b',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Template Selector with Visual Summary */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#d4d4d8', marginBottom: '6px' }}>
                  Target Design Foundation *
                </label>
                <select
                  value={newLinkTemplateSlug}
                  onChange={(e) => {
                    const slug = e.target.value;
                    setNewLinkTemplateSlug(slug);
                    const picked = pricedTemplates.find(t => t.slug === slug);
                    if (picked) {
                      setNewLinkOutright(Number(picked.outrightNgn ?? picked.priceNgn));
                      setNewLinkSetupFee(Number(picked.setupFeeNgn));
                      setNewLinkMonthly(Number(picked.monthlyNgn));
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    backgroundColor: '#18181b',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    outline: 'none',
                    colorScheme: 'dark',
                  }}
                >
                  {pricedTemplates.map((t) => (
                    <option
                      key={t.slug}
                      value={t.slug}
                      style={{ backgroundColor: '#18181b', color: '#ffffff' }}
                    >
                      {t.name} ({t.categoryLabel})
                    </option>
                  ))}
                </select>

                {/* Selected Template Mini-Preview */}
                {activeTemplateForModal && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginTop: '10px',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}>
                    <img
                      src={activeTemplateForModal.image}
                      alt={activeTemplateForModal.name}
                      style={{ width: '48px', height: '36px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {activeTemplateForModal.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#71717a' }}>
                        {activeTemplateForModal.categoryLabel}
                      </div>
                    </div>
                    {activeTemplateForModal.demoUrl && (
                      <a
                        href={activeTemplateForModal.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: '11.5px', color: '#a1a1aa', textDecoration: 'none' }}
                      >
                        Preview ↗
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Client Info Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#d4d4d8', marginBottom: '6px' }}>
                    Client Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Kolawole Davies"
                    value={newLinkClientName}
                    onChange={(e) => setNewLinkClientName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      backgroundColor: '#18181b',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#d4d4d8', marginBottom: '6px' }}>
                    Client Email (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="kola@company.ng"
                    value={newLinkClientEmail}
                    onChange={(e) => setNewLinkClientEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      backgroundColor: '#18181b',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* WhatsApp Phone */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#d4d4d8', marginBottom: '6px' }}>
                  Client WhatsApp Phone (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 08012345678"
                  value={newLinkClientPhone}
                  onChange={(e) => setNewLinkClientPhone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    backgroundColor: '#18181b',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Flexible Pricing Structure Customizer */}
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                padding: '14px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Flexible Pricing & Retainer (₦)
                  </label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => { setNewLinkSetupFee(15000); setNewLinkMonthly(5000); setNewLinkOutright(50000); }}
                      style={{ padding: '3px 8px', fontSize: '10.5px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.08)', color: '#d4d4d8', cursor: 'pointer' }}
                    >
                      Standard (15k/5k/50k)
                    </button>
                    <button
                      type="button"
                      onClick={() => { setNewLinkSetupFee(25000); setNewLinkMonthly(8000); setNewLinkOutright(75000); }}
                      style={{ padding: '3px 8px', fontSize: '10.5px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.08)', color: '#d4d4d8', cursor: 'pointer' }}
                    >
                      Growth (25k/8k/75k)
                    </button>
                    <button
                      type="button"
                      onClick={() => { setNewLinkSetupFee(50000); setNewLinkMonthly(15000); setNewLinkOutright(120000); }}
                      style={{ padding: '3px 8px', fontSize: '10.5px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.08)', color: '#d4d4d8', cursor: 'pointer' }}
                    >
                      Enterprise (50k/15k/120k)
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '11px', color: '#a1a1aa', marginBottom: '4px' }}>Setup Fee (₦)</span>
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      value={newLinkSetupFee}
                      onChange={(e) => setNewLinkSetupFee(Number(e.target.value))}
                      style={{ width: '100%', padding: '9px 10px', backgroundColor: '#18181b', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '6px', color: '#ffffff', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <span style={{ display: 'block', fontSize: '11px', color: '#a1a1aa', marginBottom: '4px' }}>Monthly Retainer (₦)</span>
                    <input
                      type="number"
                      min="0"
                      step="500"
                      value={newLinkMonthly}
                      onChange={(e) => setNewLinkMonthly(Number(e.target.value))}
                      style={{ width: '100%', padding: '9px 10px', backgroundColor: '#18181b', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '6px', color: '#ffffff', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <span style={{ display: 'block', fontSize: '11px', color: '#a1a1aa', marginBottom: '4px' }}>Outright Buyout (₦)</span>
                    <input
                      type="number"
                      min="0"
                      step="5000"
                      value={newLinkOutright}
                      onChange={(e) => setNewLinkOutright(Number(e.target.value))}
                      style={{ width: '100%', padding: '9px 10px', backgroundColor: '#18181b', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '6px', color: '#ffffff', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
              </div>

              {/* Pricing Plan Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#d4d4d8', marginBottom: '8px' }}>
                  Default Pricing Plan for Link
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setNewLinkPlanType('MONTHLY')}
                    style={{
                      padding: '14px',
                      borderRadius: '10px',
                      border: newLinkPlanType === 'MONTHLY' ? '1.5px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                      backgroundColor: newLinkPlanType === 'MONTHLY' ? 'rgba(16, 185, 129, 0.08)' : '#18181b',
                      color: '#ffffff',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '14px' }}>Monthly Plan</strong>
                      {newLinkPlanType === 'MONTHLY' && <span style={{ color: '#10b981', fontSize: '13px' }}>✓</span>}
                    </div>
                    <span style={{ fontSize: '12px', color: '#a1a1aa', display: 'block', marginTop: '4px' }}>
                      ₦{Number(newLinkSetupFee).toLocaleString()} setup + ₦{Number(newLinkMonthly).toLocaleString()}/mo
                    </span>
                    <span style={{ fontSize: '11px', color: '#71717a', display: 'block', marginTop: '2px' }}>
                      (₦{(Number(newLinkSetupFee) + Number(newLinkMonthly)).toLocaleString()} due now)
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewLinkPlanType('OUTRIGHT')}
                    style={{
                      padding: '14px',
                      borderRadius: '10px',
                      border: newLinkPlanType === 'OUTRIGHT' ? '1.5px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                      backgroundColor: newLinkPlanType === 'OUTRIGHT' ? 'rgba(16, 185, 129, 0.08)' : '#18181b',
                      color: '#ffffff',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '14px' }}>Outright Buyout</strong>
                      {newLinkPlanType === 'OUTRIGHT' && <span style={{ color: '#10b981', fontSize: '13px' }}>✓</span>}
                    </div>
                    <span style={{ fontSize: '12px', color: '#a1a1aa', display: 'block', marginTop: '4px' }}>
                      ₦{Number(newLinkOutright).toLocaleString()} full ownership
                    </span>
                    <span style={{ fontSize: '11px', color: '#71717a', display: 'block', marginTop: '2px' }}>
                      (Zero recurring fees)
                    </span>
                  </button>
                </div>
              </div>

              {/* Custom Scope Notes */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#d4d4d8', marginBottom: '6px' }}>
                  Scope Notes (Visible to Client on Checkout)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Includes custom photography upload, WhatsApp test-drive intake, and 1 year .com.ng domain."
                  value={newLinkNotes}
                  onChange={(e) => setNewLinkNotes(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    backgroundColor: '#18181b',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Form Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    padding: '10px 18px',
                    backgroundColor: 'transparent',
                    color: '#a1a1aa',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingLink}
                  style={{
                    padding: '10px 22px',
                    backgroundColor: '#ffffff',
                    color: '#09090b',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: creatingLink ? 'not-allowed' : 'pointer',
                  }}
                >
                  {creatingLink ? 'Generating...' : 'Generate Proposal Link'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
