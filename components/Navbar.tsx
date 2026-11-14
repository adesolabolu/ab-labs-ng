'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname() || '/';
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  // Focus search input when search opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <header id="top" className="header" data-react-nav="true">
        <div className="site-top">
          <div className="header-wrapper">
            <div data-nav-animation="over-left" data-nav-collapse="medium" data-nav-duration="400" data-anim-easing="ease" data-anim-easing2="ease" role="banner" className="hdr site-nav">
              <div className="hdr-in">
                <div className="site-blockcontainer container-large site-container">
                  <div className="navbar-wrapper">
                    <Link href="/" className={`hdr-logo inline-block ${pathname === '/' ? 'is-current' : ''}`}>
                      <img src="/assets/ab-labs-logo.svg" loading="lazy" alt="aB Labs logo" className="logo" />
                    </Link>

                    {/* DESKTOP NAVIGATION BAR */}
                    <nav
                      role="navigation"
                      id="desktop-nav-menu"
                      aria-label="Main navigation"
                      className="nav-menu-wrapper nav-menu-list"
                    >
                      <ul role="list" className="nav-menu site-list-unstyled list-unstyled" style={{ listStyle: 'none', paddingLeft: 0, margin: 0 }}>
                        <li>
                          <Link href="/" className={`hdr-nav-a ${pathname === '/' ? 'is-current' : ''}`}>
                            <span>Home</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/shop" className={`hdr-nav-a ${pathname.startsWith('/shop') ? 'is-current' : ''}`}>
                            <span>Templates &amp; Shop</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/blog" className={`hdr-nav-a ${pathname.startsWith('/blog') ? 'is-current' : ''}`}>
                            <span>Guides &amp; Blog</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/contact-us" className={`hdr-nav-a ${pathname === '/contact-us' ? 'is-current' : ''}`}>
                            <span>Contact Us</span>
                          </Link>
                        </li>
                      </ul>
                    </nav>

                    <div className="hdr-acts">
                      {/* SEARCH BUTTON */}
                      <div
                        className="search-button-wrapper"
                        onClick={() => setIsSearchOpen(true)}
                        style={{ cursor: 'pointer' }}
                        role="button"
                        aria-label="Open search"
                      >
                        <div className="search-icon site-embed">
                          <svg className="nav__search-ico" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9A9A9A" strokeWidth="2px" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <circle cx="11" cy="11" r="8" stroke="currentColor" fill="none" strokeWidth="2px"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" fill="none" strokeWidth="2px"></line>
                          </svg>
                        </div>
                      </div>

                      <Link href="/shop" className="primary-button inline-block">
                        <div className="button-text-wrapper">
                          <div className="button-text-block">
                            <div className="link-text is-1">Explore Templates</div>
                            <div className="link-text is-2">Explore Templates</div>
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

                    {/* MOBILE HAMBURGER BUTTON */}
                    <div className="offcanvas-button-wrapper">
                      <button
                        type="button"
                        className={`menu-button nav-toggle-btn ${isMobileMenuOpen ? 'is-open' : ''}`}
                        onClick={() => setIsMobileMenuOpen((open) => !open)}
                        aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                        aria-expanded={isMobileMenuOpen}
                        aria-controls="mobile-nav-menu"
                        style={{ cursor: 'pointer' }}
                      >
                        <span className="icon-nav-menu" aria-hidden="true"></span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SEARCH MODAL OVERLAY */}
          <div
            className="search-wrapper"
            style={{
              display: isSearchOpen ? 'block' : 'none',
              height: isSearchOpen ? 'auto' : 0,
              minHeight: isSearchOpen ? '130px' : 0,
              paddingTop: isSearchOpen ? '28px' : 0,
              paddingBottom: isSearchOpen ? '28px' : 0,
              transition: 'all 0.25s ease'
            }}
          >
            <div className="search-inner-block">
              <div className="site-blockcontainer container-large site-container">
                <div className="search-inner-wrapper">
                  <div className="search-form site-form" style={{ width: '100%' }}>
                    <form onSubmit={handleSearchSubmit} className="search-form">
                      <div className="search-field-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <input
                          ref={searchInputRef}
                          className="search-field site-input"
                          maxLength={256}
                          name="q"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          aria-label="Search website templates"
                          placeholder="Search templates by industry or feature…"
                          type="text"
                          required={true}
                          style={{ paddingRight: '48px' }}
                        />
                        <button type="submit" className="search-button-icon site-button" style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9A9A9A" strokeWidth="2px" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" stroke="currentColor" fill="none" strokeWidth="2px"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" fill="none" strokeWidth="2px"></line>
                          </svg>
                        </button>
                      </div>
                    </form>
                  </div>
                  <div
                    className="search-close-btn"
                    onClick={() => setIsSearchOpen(false)}
                    style={{ cursor: 'pointer', marginLeft: '16px' }}
                    role="button"
                    aria-label="Close search"
                  >
                    <div className="close-button-icon site-embed">
                      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#9A9A9A" strokeWidth="2px" strokeLinecap="round" aria-hidden="true">
                        <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" fill="none" strokeWidth="2px"></line>
                        <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" fill="none" strokeWidth="2px"></line>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Search Backdrop Overlay */}
          <div
            className="search-overlay"
            onClick={() => setIsSearchOpen(false)}
            style={{ display: isSearchOpen ? 'block' : 'none' }}
          ></div>
        </div>
      </header>

      {/* REACT PORTAL MOBILE NAVIGATION DRAWER */}
      {mounted && isMobileMenuOpen && createPortal(
        <div
          id="mobile-nav-root"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999999,
          }}
        >
          {/* Backdrop (Darkened Blur on Main Page) */}
          <div
            className="mobile-nav-backdrop"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(12, 11, 10, 0.6)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              animation: 'nav-fade-in 0.22s ease-out both',
            }}
          />

          {/* Solid Slide-In Drawer Pane (Above Backdrop, Zero Blur) */}
          <nav
            id="mobile-nav-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Main Navigation Menu"
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: 'min(86vw, 360px)',
              height: '100dvh',
              backgroundColor: '#ffffff',
              zIndex: 100000000,
              boxShadow: '-12px 0 40px rgba(0, 0, 0, 0.25)',
              borderLeft: '1px solid rgba(12, 11, 10, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              animation: 'nav-drawer-in-right 0.28s cubic-bezier(0.16, 1, 0.3, 1) both',
            }}
          >
            {/* Drawer Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '18px 22px',
              borderBottom: '1px solid rgba(12, 11, 10, 0.08)',
              backgroundColor: '#faf8f5',
            }}>
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'inline-flex', alignItems: 'center' }}>
                <img src="/assets/ab-labs-logo.svg" loading="lazy" alt="aB Labs logo" style={{ height: '28px', width: 'auto' }} />
              </Link>
              <button
                type="button"
                className="drawer-close-btn"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  border: '1px solid rgba(12, 11, 10, 0.12)',
                  backgroundColor: '#ffffff',
                  color: '#1c1917',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Navigation Links */}
            <div style={{ flex: 1, padding: '16px 20px 24px', display: 'flex', flexDirection: 'column' }}>
              <ul role="list" style={{ listStyle: 'none', paddingLeft: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li>
                  <Link
                    href="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 16px',
                      fontSize: '16px',
                      fontWeight: pathname === '/' ? 700 : 500,
                      color: pathname === '/' ? '#9a6843' : '#292524',
                      backgroundColor: pathname === '/' ? 'rgba(154, 104, 67, 0.1)' : 'transparent',
                      borderRadius: '10px',
                      textDecoration: 'none',
                    }}
                  >
                    <span>Home</span>
                    <span style={{ fontSize: '16px', color: pathname === '/' ? '#9a6843' : '#a8a29e' }}>→</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop"
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 16px',
                      fontSize: '16px',
                      fontWeight: pathname.startsWith('/shop') ? 700 : 500,
                      color: pathname.startsWith('/shop') ? '#9a6843' : '#292524',
                      backgroundColor: pathname.startsWith('/shop') ? 'rgba(154, 104, 67, 0.1)' : 'transparent',
                      borderRadius: '10px',
                      textDecoration: 'none',
                    }}
                  >
                    <span>Templates &amp; Shop</span>
                    <span style={{ fontSize: '16px', color: pathname.startsWith('/shop') ? '#9a6843' : '#a8a29e' }}>→</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 16px',
                      fontSize: '16px',
                      fontWeight: pathname.startsWith('/blog') ? 700 : 500,
                      color: pathname.startsWith('/blog') ? '#9a6843' : '#292524',
                      backgroundColor: pathname.startsWith('/blog') ? 'rgba(154, 104, 67, 0.1)' : 'transparent',
                      borderRadius: '10px',
                      textDecoration: 'none',
                    }}
                  >
                    <span>Guides &amp; Blog</span>
                    <span style={{ fontSize: '16px', color: pathname.startsWith('/blog') ? '#9a6843' : '#a8a29e' }}>→</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact-us"
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 16px',
                      fontSize: '16px',
                      fontWeight: pathname === '/contact-us' ? 700 : 500,
                      color: pathname === '/contact-us' ? '#9a6843' : '#292524',
                      backgroundColor: pathname === '/contact-us' ? 'rgba(154, 104, 67, 0.1)' : 'transparent',
                      borderRadius: '10px',
                      textDecoration: 'none',
                    }}
                  >
                    <span>Contact Us</span>
                    <span style={{ fontSize: '16px', color: pathname === '/contact-us' ? '#9a6843' : '#a8a29e' }}>→</span>
                  </Link>
                </li>
              </ul>

              {/* Drawer Footer CTA & Direct Contact Card */}
              <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid rgba(12, 11, 10, 0.08)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <Link
                  href="/shop"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="primary-button inline-block"
                  style={{
                    width: '100%',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '14px 20px',
                    textDecoration: 'none',
                    borderRadius: '100px',
                    backgroundColor: '#1c1917',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '14px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                  }}
                >
                  <span>Explore Templates →</span>
                </Link>

                <div style={{ padding: '14px 16px', borderRadius: '12px', backgroundColor: '#f9f6f1', border: '1px solid rgba(12, 11, 10, 0.06)' }}>
                  <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#78716c', margin: '0 0 6px' }}>
                    Direct Engineering Line
                  </p>
                  <a
                    href="https://wa.me/2349036193817?text=Hi%20aB%20Labs%2C%20I%20would%20like%20to%20inquire%20about%20a%20website%20template."
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#15803d',
                      textDecoration: 'none',
                    }}
                  >
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }} />
                    <span>WhatsApp: +234 903 619 3817</span>
                  </a>
                  <div style={{ marginTop: '4px' }}>
                    <a href="mailto:hello@ab-labs.cv" style={{ fontSize: '12px', color: '#78716c', textDecoration: 'none' }}>
                      hello@ab-labs.cv
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>,
        document.body
      )}
    </>
  );
}
