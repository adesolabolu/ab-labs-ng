'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Template } from '@/data/templates';
import { useCart } from '@/context/CartContext';
import NavbarCartButton from '@/components/NavbarCartButton';

interface TemplateDetailViewProps {
  template: Template;
}

export default function TemplateDetailView({ template }: TemplateDetailViewProps) {
  const router = useRouter();
  const { addItem, toggleSetupService, items } = useCart();
  const [includeSetup, setIncludeSetup] = useState(false);

  const existingInCart = items.find(i => i.template.id === template.id);

  const handleAddToCart = () => {
    addItem(template);
    if (includeSetup && (!existingInCart || !existingInCart.setupService)) {
      toggleSetupService(template.id);
    }
    router.push('/cart');
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <header id="top" className="header">
        <div className="site-top">
          <div className="header-wrapper">
            <div data-animation="over-left" data-collapse="medium" data-duration="400" data-easing="ease" data-easing2="ease" role="banner" className="hdr w-nav">
              <div className="hdr-in">
                <div className="w-layout-blockcontainer container-large w-container">
                  <div className="navbar-wrapper">
                    <Link href="/" className="hdr-logo w-inline-block">
                      <img src="/assets/ab-labs-logo.svg" loading="lazy" alt="aB Labs logo" className="logo" />
                    </Link>
                    <nav role="navigation" className="nav-menu-wrapper w-nav-menu">
                      <ul role="list" className="nav-menu w-list-unstyled">
                        <li className="mobile-logo">
                          <Link href="/" className="hdr-logo w-inline-block">
                            <img src="/assets/ab-labs-logo.svg" loading="lazy" alt="aB Labs logo" className="logo" />
                          </Link>
                        </li>
                        <li>
                          <div data-delay="0" data-hover="false" className="nav-dropdown w-dropdown">
                            <div className="dropdown w-dropdown-toggle">
                              <div>Templates</div>
                              <div className="nav-dropdown-icon w-icon-dropdown-toggle"></div>
                            </div>
                            <nav className="nav-dropdown-list w-dropdown-list">
                              <div className="w-layout-blockcontainer container-large w-container">
                                <div className="nav-dropdown-flex">
                                  <div className="nav-content-wrapper">
                                    <div className="nav-category-text">Templates by Industry</div>
                                    <div className="nav-content-block">
                                      <div className="w-dyn-list">
                                        <div role="list" className="nav-list-category w-dyn-items">
                                          <div role="listitem" className="w-dyn-item">
                                            <Link href="/shop" className="nav-link-block w-inline-block">
                                              <div>All Templates (8)</div>
                                            </Link>
                                          </div>
                                          <div role="listitem" className="w-dyn-item">
                                            <Link href="/shop?category=ecommerce" className="nav-link-block w-inline-block">
                                              <div>E-Commerce &amp; Retail</div>
                                            </Link>
                                          </div>
                                          <div role="listitem" className="w-dyn-item">
                                            <Link href="/shop?category=real-estate" className="nav-link-block w-inline-block">
                                              <div>Real Estate &amp; PropTech</div>
                                            </Link>
                                          </div>
                                          <div role="listitem" className="w-dyn-item">
                                            <Link href="/shop?category=corporate" className="nav-link-block w-inline-block">
                                              <div>Corporate &amp; Agency</div>
                                            </Link>
                                          </div>
                                          <div role="listitem" className="w-dyn-item">
                                            <Link href="/shop?category=saas" className="nav-link-block w-inline-block">
                                              <div>Tech Startups &amp; SaaS</div>
                                            </Link>
                                          </div>
                                          <div role="listitem" className="w-dyn-item">
                                            <Link href="/shop?category=hospitality" className="nav-link-block w-inline-block">
                                              <div>Hospitality &amp; Dining</div>
                                            </Link>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="best-collection-flex">
                                    <div className="best-collection-wrapper">
                                      <Link href="/shop" className="best-collection-link w-inline-block" style={{ textDecoration: 'none' }}>
                                        <div style={{ padding: '24px', background: 'linear-gradient(135deg, #18181b 0%, #09090b 100%)', borderRadius: '14px', color: '#fff', display: 'flex', flexDirection: 'column', gap: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                          <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#60A5FA' }}>2026 Collection</span>
                                          <h4 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#fff' }}>Production-Ready Digital Flagships</h4>
                                          <p style={{ margin: 0, fontSize: '12px', color: '#a1a1aa', lineHeight: '1.5' }}>modern web standards, bespoke responsive styling, customized turnkey for your brand.</p>
                                          <span style={{ fontSize: '12px', fontWeight: 600, color: '#38BDF8', marginTop: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>Browse Catalog →</span>
                                        </div>
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </nav>
                          </div>
                        </li>
                        <li><Link href="/shop" className="hdr-nav-a">Templates</Link></li>
                        <li><Link href="/about-us" className="hdr-nav-a">About</Link></li>
                        <li><Link href="/blog" className="hdr-nav-a">Insights</Link></li>
                        <li><Link href="/contact-us" className="hdr-nav-a">Contact</Link></li>
                        <li className="mobile-button">
                          <Link href="/shop" className="primary-button w-inline-block">
                            <div className="button-text-wrapper">
                              <div className="button-text-block">
                                <div className="link-text is-1">Explore Templates</div>
                                <div className="link-text is-2">Explore Templates</div>
                              </div>
                            </div>
                          </Link>
                        </li>
                      </ul>
                    </nav>
                    <div className="hdr-acts">
                      <NavbarCartButton />
                      <div className="cart-devider"></div>
                      <Link href="/shop" className="primary-button w-inline-block">
                        <div className="button-text-wrapper">
                          <div className="button-text-block">
                            <div className="link-text is-1">Explore Templates</div>
                            <div className="link-text is-2">Explore Templates</div>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="offcanvas-button-wrapper">
                      <NavbarCartButton />
                      <div className="cart-devider"></div>
                      <div className="menu-button w-nav-button"><div className="w-icon-nav-menu"></div></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="main-wrapper">
        {/* Breadcrumb */}
        <section className="section-breadcrumb" style={{ padding: '24px 0 16px' }}>
          <div className="w-layout-blockcontainer container-large w-container">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#71717a' }}>
              <Link href="/" style={{ color: '#71717a', textDecoration: 'none' }}>Home</Link>
              <span>/</span>
              <Link href="/shop" style={{ color: '#71717a', textDecoration: 'none' }}>Templates</Link>
              <span>/</span>
              <span style={{ color: '#09090b', fontWeight: 600 }}>{template.name}</span>
            </div>
          </div>
        </section>

        {/* Product Details Section */}
        <section style={{ padding: '20px 0 80px' }}>
          <div className="w-layout-blockcontainer container-large w-container">
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '48px',
              alignItems: 'start'
            }}>
              {/* Left Column: Visual Preview */}
              <div>
                <div style={{
                  position: 'relative',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid #e4e4e7',
                  backgroundColor: '#f4f4f5',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.06)'
                }}>
                  {template.badge && (
                    <span style={{
                      position: 'absolute',
                      top: '16px',
                      left: '16px',
                      backgroundColor: template.badgeColor || '#18181b',
                      color: '#fff',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '6px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      zIndex: 2
                    }}>
                      {template.badge}
                    </span>
                  )}
                  <img
                    src={template.image}
                    alt={template.name}
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                      objectFit: 'cover'
                    }}
                  />
                </div>

                {/* Stack Badges */}
                <div style={{ marginTop: '20px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#71717a', marginBottom: '8px' }}>
                    Engineered With
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {template.stack.map(s => (
                      <span
                        key={s}
                        style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          padding: '6px 12px',
                          backgroundColor: '#f4f4f5',
                          borderRadius: '8px',
                          color: '#27272a',
                          border: '1px solid #e4e4e7'
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* What's Included Box */}
                <div style={{
                  marginTop: '28px',
                  padding: '24px',
                  backgroundColor: '#fafafa',
                  borderRadius: '14px',
                  border: '1px solid #e4e4e7'
                }}>
                  <h4 style={{ margin: '0 0 14px', fontSize: '15px', fontWeight: 700, color: '#18181b' }}>
                    What You Get Upon Checkout:
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#52525b', lineHeight: '1.8' }}>
                    <li><strong>Full Source Code:</strong> Complete, unminified modern web standards &amp; bespoke responsive styling codebase.</li>
                    <li><strong>Complete Brand Customization:</strong> Tailored with your business logo, custom color palette, and bespoke copy.</li>
                    <li><strong>Dedicated Launch Support:</strong> We configure your custom domain, connect your business email, and deploy your live site.</li>
                    <li><strong>Step-by-Step Setup Guide:</strong> Full launch guide and dedicated setup assistance for your domain.</li>
                    <li><strong>Commercial License:</strong> Lifetime usage for your business with zero recurring template fees.</li>
                  </ul>
                </div>
              </div>

              {/* Right Column: Template Info & Checkout */}
              <div>
                <span style={{
                  display: 'inline-block',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: '#2563EB',
                  backgroundColor: '#eff6ff',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  marginBottom: '12px'
                }}>
                  {template.categoryLabel}
                </span>

                <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#09090b', margin: '0 0 8px', letterSpacing: '-0.02em', lineHeight: '1.2' }}>
                  {template.name}
                </h1>

                <p style={{ fontSize: '16px', color: '#52525b', margin: '0 0 16px', lineHeight: '1.5' }}>
                  {template.tagline}
                </p>

                {/* Rating */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '14px' }}>
                  <div style={{ color: '#eab308', letterSpacing: '2px', fontWeight: 700 }}>★★★★★</div>
                  <span style={{ fontWeight: 700, color: '#18181b' }}>{template.rating.toFixed(1)}</span>
                  <span style={{ color: '#71717a' }}>({template.reviews} founder reviews)</span>
                </div>

                {/* Price Display */}
                <div style={{
                  padding: '20px 24px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '14px',
                  border: '1px solid #e2e8f0',
                  marginBottom: '24px'
                }}>
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    One-Time Purchase Price
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '4px' }}>
                    <div style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                      ₦{template.priceNgn.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '15px', color: '#64748b', fontWeight: 500 }}>
                      (≈ ${template.priceUsd} USD)
                    </div>
                  </div>
                  <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#64748b' }}>
                    Lifetime commercial license · 0 monthly platform tax · Full source ownership
                  </p>
                </div>

                {/* Description */}
                <p style={{ fontSize: '15px', color: '#3f3f46', lineHeight: '1.7', marginBottom: '24px' }}>
                  {template.description}
                </p>

                {/* Key Features List */}
                <div style={{ marginBottom: '28px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#18181b', marginBottom: '10px' }}>
                    Key Architecture Highlights:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                    {template.features.map(f => (
                      <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#3f3f46' }}>
                        <span style={{ color: '#16a34a', fontWeight: 800 }}>✓</span>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Turnkey Deployment Add-On */}
                <div
                  onClick={() => setIncludeSetup(!includeSetup)}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: includeSetup ? '1.5px solid #2563EB' : '1px dashed #cbd5e1',
                    backgroundColor: includeSetup ? '#eff6ff' : '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    marginBottom: '24px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input
                      type="checkbox"
                      checked={includeSetup}
                      onChange={() => {}}
                      style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                    />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
                        Add Turnkey Live Domain Launch &amp; Domain Setup
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>
                        Our engineering team configures your custom domain, SSL certificate, and deployment within days.
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#1e293b', whiteSpace: 'nowrap' }}>
                    +₦50,000
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button
                    onClick={handleAddToCart}
                    style={{
                      width: '100%',
                      padding: '16px',
                      backgroundColor: '#09090b',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '15px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
                    }}
                  >
                    Get Template &amp; Source Code →
                  </button>

                  <Link
                    href="/shop"
                    style={{
                      width: '100%',
                      padding: '14px',
                      backgroundColor: '#f4f4f5',
                      color: '#18181b',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontWeight: 600,
                      textAlign: 'center',
                      textDecoration: 'none',
                      border: '1px solid #e4e4e7'
                    }}
                  >
                    ← Browse All Templates
                  </Link>
                </div>

                {/* Trust Footer */}
                <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #f4f4f5', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#71717a' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>🔒</span>
                    <span>Secure Paystack checkout (Cards, USSD, Bank Transfer, Apple Pay)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>⚡</span>
                    <span>Immediate website codebase access upon payment confirmation</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>🛡️</span>
                    <span>100% Clean Code Guarantee · Handcrafted in Nigeria for scale</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <section className="footer">
        <div className="w-layout-blockcontainer container-large w-container">
          <div className="fh-trust">
            <div className="fh-trust-it">
              <div className="footer-icon w-embed">
                <svg fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                  <rect x="1" y="3" width="15" height="13"></rect>
                  <path d="M16 8h4l3 3v5h-7V8z"></path>
                  <circle cx="5.5" cy="18.5" r="2.5"></circle>
                  <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
              </div>
              <div>48-Hour Rapid Deployment &amp; Setup</div>
            </div>
            <div className="fh-trust-it">
              <div className="footer-icon w-embed">
                <svg fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <div>Direct WhatsApp &amp; Live Deployment Support</div>
            </div>
            <div className="fh-trust-it">
              <div className="footer-icon w-embed">
                <svg fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                  <polyline points="23 4 23 10 17 10"></polyline>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                </svg>
              </div>
              <div>100% Clean Code &amp; Full Source Ownership</div>
            </div>
            <div className="fh-trust-it">
              <div className="footer-icon w-embed">
                <svg fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <div>Google Search Console &amp; Technical SEO Ready</div>
            </div>
          </div>
          <div className="fh-in">
            <div className="fh-main">
              <div className="fh-brand">
                <Link href="/" className="fh-logo w-inline-block">
                  <img src="/assets/ab-labs-logo.svg" loading="lazy" alt="aB Labs logo" className="footer-logo" />
                </Link>
                <p className="fh-statement">
                  Production-ready website designs and bespoke web engineering built for ambitious Nigerian and African businesses.
                </p>
              </div>
              <div className="fh-col">
                <p className="fh-col-h">Templates</p>
                <Link href="/shop" className="fh-lk">All Templates</Link>
                <Link href="/shop?category=ecommerce" className="fh-lk">E-Commerce</Link>
                <Link href="/shop?category=real-estate" className="fh-lk">Real Estate</Link>
                <Link href="/shop?category=corporate" className="fh-lk">Corporate</Link>
                <Link href="/shop?category=saas" className="fh-lk">SaaS &amp; Tech</Link>
              </div>
              <div className="fh-col">
                <p className="fh-col-h">Company</p>
                <Link href="/" className="fh-lk">Home</Link>
                <Link href="/about-us" className="fh-lk">About Us</Link>
                <Link href="/contact-us" className="fh-lk">Contact Us</Link>
                <Link href="/blog" className="fh-lk">Insights</Link>
                <Link href="/cart" className="fh-lk">Your Cart</Link>
              </div>
            </div>
            <div className="footer-border v2"></div>
            <div className="footer-border"></div>
          </div>
          <div className="fh-bot">
            <div className="fh-bot-in">
              <p className="fh-copy">© 2026 aB Labs — Production-Ready Web Flagships</p>
              <a href="#top" className="fh-top-top w-inline-block">
                <div>Back to top</div>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
