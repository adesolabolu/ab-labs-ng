'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import TemplatePreviewCanvas from '@/components/TemplatePreviewCanvas';
import DualPricingSelector from '@/components/DualPricingSelector';
import CallToAction from '@/components/CallToAction';
import Footer from '@/components/Footer';
import { Template, TEMPLATES } from '@/data/templates';

interface TemplateDetailViewProps {
  template: Template;
  /** Catalog with any admin price overrides applied. */
  relatedTemplates?: Template[];
}

export default function TemplateDetailView({
  template,
  relatedTemplates = TEMPLATES,
}: TemplateDetailViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'launch'>('overview');

  // Select 4 other templates to recommend
  const otherTemplates = relatedTemplates
    .filter((t) => t.slug !== template.slug)
    .slice(0, 4);

  return (
    <>
      <div className="page-wrapper">
        <Navbar />

        <div className="main-wrapper">
          {/* Main Studio Section: 70/30 Interactive Split */}
          <section className="section-product-details" style={{ paddingTop: '104px', paddingBottom: '48px' }}>
            <div className="site-blockcontainer container-large site-container">
              <div className="product-studio-grid">
                {/* 70% Column: Interactive Live Preview Studio */}
                <div className="product-studio-preview">
                  <TemplatePreviewCanvas
                    demoUrl={template.demoUrl}
                    fallbackImage={template.image}
                    templateName={template.name}
                  />
                </div>

                {/* 30% Column: Purchase & Customization Sidebar */}
                <div className="product-studio-sidebar">
                  <div fade-in="true" className="pd-info" style={{ width: '100%', maxWidth: '100%' }}>
                    {/* Category Label */}
                    <div className="site-dyn-list">
                      <div role="list" className="site-dyn-items">
                        <div role="listitem" className="site-dyn-item">
                          <p className="pd-cat">{template.categoryLabel}</p>
                        </div>
                      </div>
                    </div>

                    {/* Template Title */}
                    <h2 className="pd-name" style={{ fontSize: '28px', lineHeight: '1.25', marginTop: '4px' }}>
                      {template.name}
                    </h2>

                    {/* Adaptation Notice (Not locked to single industry) */}
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 12px',
                        backgroundColor: '#f0fdf4',
                        border: '1px solid #bbf7d0',
                        borderRadius: '8px',
                        marginTop: '12px',
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="m9 12 2 2 4-4"></path>
                      </svg>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#166534' }}>
                        Adapts to Any Business - {template.categoryLabel} theme is sample only
                      </span>
                    </div>

                    {/* Description */}
                    <p
                      className="pd-desc"
                      style={{ marginTop: '10px', fontSize: '14px', lineHeight: '1.55', color: '#4b5563' }}
                    >
                      {template.description}{' '}
                      <strong style={{ color: '#111827' }}>Fully customized for your specific brand and industry.</strong>
                    </p>

                    {/* Dual Pricing Selector: Monthly or Outright */}
                    <DualPricingSelector
                      templateName={template.name}
                      templateSlug={template.slug}
                      monthlyPrice={template.monthlyNgn || 5000}
                      setupFee={template.setupFeeNgn || 15000}
                      outrightPrice={template.outrightNgn || 50000}
                      standardMonthlyPrice={template.standardMonthlyNgn || 10000}
                      standardSetupFee={template.standardSetupFeeNgn || 30000}
                      standardOutrightPrice={template.standardOutrightNgn || 100000}
                      whatsappNumber="2349036193817"
                    />

                    {/* Value & Delivery Trust Items */}
                    <div className="pd-trust" style={{ marginTop: '26px' }}>
                      <div className="pd-trust-it">
                        <div className="product-icon site-embed">
                          <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                            <rect x="1" y="3" width="15" height="13"></rect>
                            <path d="M16 8h4l3 3v5h-7V8z"></path>
                            <circle cx="5.5" cy="18.5" r="2.5"></circle>
                            <circle cx="18.5" cy="18.5" r="2.5"></circle>
                          </svg>
                        </div>
                        <div>
                          <p className="pd-trust-it-b">
                            <strong>1-Year Custom Domain Included </strong>(.com.ng, .online, .store, .site &amp; more) + SSL
                          </p>
                        </div>
                      </div>

                      <div className="pd-trust-it">
                        <div className="product-icon site-embed">
                          <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                          </svg>
                        </div>
                        <div>
                          <p className="pd-trust-it-b">
                            <strong>Personalized business email </strong>&amp; direct WhatsApp routing
                          </p>
                        </div>
                      </div>

                      <div className="pd-trust-it">
                        <div className="product-icon site-embed">
                          <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                            <polyline points="23 4 23 10 17 10"></polyline>
                            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                          </svg>
                        </div>
                        <div>
                          <p className="pd-trust-it-b">
                            <strong>Live in &lt; 36 hours </strong>fully customized for your brand
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Information Tabs Section: Clean 2 Tabs (Overview & Launch) */}
          <section className="product-details-info" style={{ backgroundColor: 'var(--bistro-white, #ede8e1)', paddingTop: '80px', paddingBottom: '40px' }}>
            <div className="site-blockcontainer container-large site-container">
                <div fade-in="true" className="site-tabs">
                  <div className="pd-tabs-nav site-tab-menu" style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                    <button
                      type="button"
                      onClick={() => setActiveTab('overview')}
                      className={`pd-tab-btnon inline-block site-tab-link ${activeTab === 'overview' ? 'is-current' : ''}`}
                      style={{
                        padding: '12px 24px',
                        borderRadius: '100px',
                        cursor: 'pointer',
                        border: 'none',
                        backgroundColor: activeTab === 'overview' ? '#111827' : '#f3f4f6',
                        color: activeTab === 'overview' ? '#ffffff' : '#4b5563',
                        fontWeight: 600,
                        fontSize: '14px',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div>What&apos;s Included &amp; Overview</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('launch')}
                      className={`pd-tab-btnon inline-block site-tab-link ${activeTab === 'launch' ? 'is-current' : ''}`}
                      style={{
                        padding: '12px 24px',
                        borderRadius: '100px',
                        cursor: 'pointer',
                        border: 'none',
                        backgroundColor: activeTab === 'launch' ? '#111827' : '#f3f4f6',
                        color: activeTab === 'launch' ? '#ffffff' : '#4b5563',
                        fontWeight: 600,
                        fontSize: '14px',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div>How We Launch Your Site</div>
                    </button>
                  </div>

                  {/* Tab 1: Overview & Deliverables */}
                  {activeTab === 'overview' && (
                    <div className="site-tab-content">
                      <div className="pd-panel">
                        <div className="pdd-intro">
                          <div className="product-dtails-subtitle">
                            <div className="subtitle-dot"></div>
                            <p className="pd-ey">What&apos;s Included</p>
                          </div>
                          <div className="product-overview-details site-richtext">
                            <h2>Everything Your Business Needs to Launch Online.</h2>
                            <p>
                              While shown here with a sample theme, this design foundation is{' '}
                              <strong>never locked to a single industry</strong>. Whether you operate a clinic, real estate
                              agency, corporate consultancy, legal practice, luxury spa, or retail boutique, our team fully
                              adapts the typography, colors, imagery, content, and booking flows to match your exact business.
                            </p>
                          </div>
                        </div>

                        {/* Deliverables Grid */}
                        <div className="pdd-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '32px' }}>
                          <div className="pdd-card">
                            <div className="pdd-ic pdd-card-span">
                              <div className="p-icon site-embed">
                                <svg fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                                  <circle cx="12" cy="12" r="10"></circle>
                                  <line x1="2" y1="12" x2="22" y2="12"></line>
                                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                                </svg>
                              </div>
                            </div>
                            <div className="product-details site-richtext">
                              <h3>Custom 1-Year Domain Included</h3>
                              <p>We register and configure your branded domain (.com.ng, .name.ng, .store, .online, .site &amp; more) with automated HTTPS SSL security certificates.</p>
                            </div>
                          </div>

                          <div className="pdd-card">
                            <div className="pdd-ic pdd-card-span">
                              <div className="p-icon site-embed">
                                <svg fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                  <polyline points="22,6 12,13 2,6"></polyline>
                                </svg>
                              </div>
                            </div>
                            <div className="product-details site-richtext">
                              <h3>Personalized Business Domain Email</h3>
                              <p>Professional email addresses (e.g. info@yourbusiness.com.ng) connected directly to your staff devices.</p>
                            </div>
                          </div>

                          <div className="pdd-card">
                            <div className="pdd-ic pdd-card-span">
                              <div className="p-icon site-embed">
                                <svg fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                </svg>
                              </div>
                            </div>
                            <div className="product-details site-richtext">
                              <h3>Contact Forms &amp; Direct WhatsApp Routing</h3>
                              <p>Direct leads into your front-desk inbox and WhatsApp for immediate speed-to-lead response under 5 minutes.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab 2: How We Launch Your Site */}
                  {activeTab === 'launch' && (
                    <div className="site-tab-content">
                      <div className="pd-panel">
                        <div className="pds">
                          <div className="pds-head">
                            <div className="product-dtails-subtitle">
                              <div className="subtitle-dot"></div>
                              <p className="pd-ey">Fast Launch Flow</p>
                            </div>
                            <h3 className="pd-panel-h3">From Selection to Live in Less Than 36 Hours.</h3>
                            <p className="pd-panel-p">
                              We handle the technical setup, asset insertion, domain linking, and hosting optimization so you can focus on running your business.
                            </p>
                          </div>

                          <div className="pds-flow">
                            <div className="pds-step">
                              <div className="pds-ic pds-step-span">
                                <div className="p-icon site-embed">
                                  <svg fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                                    <path d="M12 2a5 5 0 0 1 5 5c0 3-2.5 4.5-5 9-2.5-4.5-5-6-5-9a5 5 0 0 1 5-5z"></path>
                                    <circle cx="12" cy="7" r="1.6"></circle>
                                  </svg>
                                </div>
                              </div>
                              <p className="pds-step-b">1. Pick Design</p>
                              <p className="pds-step-span">Choose your preferred design foundation.</p>
                            </div>

                            <div className="pds-arrow">
                              <div className="p-icon d4baa0 site-embed">
                                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path d="M5 12h14M13 6l6 6-6 6"></path>
                                </svg>
                              </div>
                            </div>

                            <div className="pds-step">
                              <div className="pds-ic pds-step-span">
                                <div className="p-icon site-embed">
                                  <svg fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                                    <rect x="1" y="3" width="15" height="13"></rect>
                                    <path d="M16 8h4l3 3v5h-7V8z"></path>
                                    <circle cx="5.5" cy="18.5" r="2.5"></circle>
                                    <circle cx="18.5" cy="18.5" r="2.5"></circle>
                                  </svg>
                                </div>
                              </div>
                              <p className="pds-step-b">2. Send Assets</p>
                              <p className="pds-step-span">Send your logo, brand colors &amp; services.</p>
                            </div>

                            <div className="pds-arrow">
                              <div className="p-icon d4baa0 site-embed">
                                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path d="M5 12h14M13 6l6 6-6 6"></path>
                                </svg>
                              </div>
                            </div>

                            <div className="pds-step">
                              <div className="pds-ic pds-step-span">
                                <div className="p-icon site-embed">
                                  <svg fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                  </svg>
                                </div>
                              </div>
                              <p className="pds-step-b">3. We Customize</p>
                              <p className="pds-step-span">We assemble copy, link domain &amp; SSL.</p>
                            </div>

                            <div className="pds-arrow">
                              <div className="p-icon d4baa0 site-embed">
                                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path d="M5 12h14M13 6l6 6-6 6"></path>
                                </svg>
                              </div>
                            </div>

                            <div className="pds-step">
                              <div className="pds-ic pds-step-span">
                                <div className="p-icon site-embed">
                                  <svg fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                  </svg>
                                </div>
                              </div>
                              <p className="pds-step-b">4. Live &amp; Handed Over</p>
                              <p className="pds-step-span">Live in &lt; 36 hours with full ownership.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

          {/* Real Website Templates: Explore More Website Foundations */}
          <section className="section-products" style={{ backgroundColor: 'var(--bistro-white, #ede8e1)', paddingTop: '40px' }}>
            <div className="site-blockcontainer container-large site-container">
              <div className="section-heading-flex">
                <div className="section-heading-block">
                  <div className="section-title-block">
                    <h2 className="heading-style-h2">Explore More Website Foundations</h2>
                  </div>
                </div>

                <div fade-in="true" className="section-left-button-wrapper">
                  <Link href="/shop" className="primary-button inline-block">
                    <div className="button-text-wrapper">
                      <div className="button-text-block">
                        <div className="link-text is-1">View All Foundations</div>
                        <div className="link-text is-2">View All Foundations</div>
                      </div>
                      <div className="button-arrow-block">
                        <div className="link-icon is-1 site-embed">
                          <svg fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
                            <path d="M7 17 17 7M7 7h10v10"></path>
                          </svg>
                        </div>
                        <div className="link-icon is-2 site-embed">
                          <svg fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
                            <path d="M7 17 17 7M7 7h10v10"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Working Real Website Cards */}
              <div className="site-dyn-list">
                <div
                  fade-in="true"
                  role="list"
                  className="products-content site-dyn-items"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '24px',
                    marginTop: '32px',
                  }}
                >
                  {otherTemplates.map((other) => (
                    <div role="listitem" className="site-dyn-item" key={other.id}>
                      <article className="products-single-item" style={{ overflow: 'hidden' }}>
                        <div className="products-image-wrapper">
                          <Link href={`/product/${other.slug}`} className="peoduct-image-link inline-block">
                            <img
                              loading="lazy"
                              alt={other.name}
                              src={other.image}
                              className="products-image"
                              style={{ width: '100%', height: '240px', objectFit: 'cover' }}
                            />
                          </Link>
                        </div>
                        <div className="product-content-wrapper" style={{ padding: '16px 20px 20px' }}>
                          <div className="product-rating-block">
                            <div className="prate-i">{other.categoryLabel}</div>
                          </div>
                          <Link
                            href={`/product/${other.slug}`}
                            className="product-title"
                            style={{
                              fontSize: '18px',
                              fontWeight: 600,
                              textDecoration: 'none',
                              color: '#111827',
                              marginTop: '6px',
                              display: 'block',
                            }}
                          >
                            {other.name}
                          </Link>
                          <div
                            className="pft"
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginTop: '16px',
                            }}
                          >
                            <div className="pprice">
                              <p className="ppr" style={{ fontSize: '15px', fontWeight: 800, color: '#111827', margin: 0 }}>
                                ₦{other.monthlyNgn.toLocaleString()}/mo <span style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>+ ₦{(other.setupFeeNgn / 1000).toFixed(0)}k setup</span>
                              </p>
                              <p style={{ fontSize: '11px', color: '#78716c', margin: '2px 0 0' }}>
                                or <strong>₦{other.outrightNgn.toLocaleString()}</strong> outright
                              </p>
                            </div>
                            <Link
                              href={`/product/${other.slug}`}
                              className="primary-button"
                              style={{
                                padding: '8px 16px',
                                fontSize: '13px',
                                fontWeight: 600,
                                textDecoration: 'none',
                                borderRadius: '100px',
                                backgroundColor: '#111827',
                                color: '#ffffff',
                              }}
                            >
                              View Foundation →
                            </Link>
                          </div>
                        </div>
                      </article>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Standardized Global Call to Action with Unified Warm Beige Background */}
          <CallToAction bgColor="var(--bistro-white, #ede8e1)" />
        </div>

        {/* Standardized Global Footer */}
        <Footer />
      </div>

      <link rel="stylesheet" href="https://unpkg.com/lenis@1.3.1/dist/lenis.css" />
    </>
  );
}
