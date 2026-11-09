'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import NavbarCartButton from '@/components/NavbarCartButton';

export default function Navbar() {
  const pathname = usePathname() || '/';
  const router = useRouter();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLLIElement>(null);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  // Focus search input when search opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
      <header id="top" className="header">
        <div className="site-top">
          <div className="header-wrapper">
            <div data-animation="over-left" data-collapse="medium" data-duration="400" data-easing="ease" data-easing2="ease" role="banner" className="hdr w-nav">
              <div className="hdr-in">
                <div className="w-layout-blockcontainer container-large w-container">
                  <div className="navbar-wrapper">
                    <Link href="/" className={`hdr-logo w-inline-block ${pathname === '/' ? 'w--current' : ''}`}>
                      <img src="/assets/ab-labs-logo.svg" loading="lazy" alt="aB Labs logo" className="logo" />
                    </Link>

                    <nav
                      role="navigation"
                      className={`nav-menu-wrapper w-nav-menu ${isMobileMenuOpen ? 'w--nav-menu-open' : ''}`}
                      style={isMobileMenuOpen ? { display: 'block' } : undefined}
                    >
                      <ul role="list" className="nav-menu w-list-unstyled">
                        <li className="mobile-logo">
                          <Link href="/" className="hdr-logo w-inline-block">
                            <img src="/assets/ab-labs-logo.svg" loading="lazy" alt="aB Labs logo" className="logo" />
                          </Link>
                        </li>

                        {/* TEMPLATES DROPDOWN */}
                        <li ref={dropdownRef}>
                          <div
                            className={`nav-dropdown w-dropdown ${isDropdownOpen ? 'w--open' : ''}`}
                            onMouseEnter={() => setIsDropdownOpen(true)}
                            onMouseLeave={() => setIsDropdownOpen(false)}
                          >
                            <div
                              className={`dropdown w-dropdown-toggle ${isDropdownOpen ? 'w--open' : ''}`}
                              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                              style={{ cursor: 'pointer' }}
                            >
                              <div>Templates</div>
                              <div className="nav-dropdown-icon w-icon-dropdown-toggle"></div>
                            </div>
                            <nav
                              className={`nav-dropdown-list w-dropdown-list ${isDropdownOpen ? 'w--open' : ''}`}
                              style={isDropdownOpen ? { display: 'block', opacity: 1, visibility: 'visible' } : undefined}
                            >
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
                                          <p style={{ margin: 0, fontSize: '12px', color: '#a1a1aa', lineHeight: '1.5' }}>Next.js 16, Tailwind CSS, and Paystack pre-wired for African commerce.</p>
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

                        <li>
                          <Link href="/shop" className={`hdr-nav-a ${pathname === '/shop' ? 'w--current' : ''}`}>
                            Templates
                          </Link>
                        </li>
                        <li>
                          <Link href="/about-us" className={`hdr-nav-a ${pathname === '/about-us' ? 'w--current' : ''}`}>
                            About
                          </Link>
                        </li>
                        <li>
                          <Link href="/blog" className={`hdr-nav-a ${pathname.startsWith('/blog') ? 'w--current' : ''}`}>
                            Insights
                          </Link>
                        </li>
                        <li>
                          <Link href="/contact-us" className={`hdr-nav-a ${pathname === '/contact-us' ? 'w--current' : ''}`}>
                            Contact
                          </Link>
                        </li>

                        <li className="mobile-button">
                          <Link href="/shop" className="primary-button w-inline-block">
                            <div className="button-text-wrapper">
                              <div className="button-text-block">
                                <div className="link-text is-1">Explore Templates</div>
                                <div className="link-text is-2">Explore Templates</div>
                              </div>
                              <div className="button-arrow-block">
                                <div className="link-icon is-1 w-embed">
                                  <svg fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
                                    <path d="M7 17 17 7M7 7h10v10"></path>
                                  </svg>
                                </div>
                                <div className="link-icon is-2 w-embed">
                                  <svg fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
                                    <path d="M7 17 17 7M7 7h10v10"></path>
                                  </svg>
                                </div>
                              </div>
                            </div>
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
                        <div className="search-icon w-embed">
                          <svg className="nav__search-ico" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9A9A9A" strokeWidth="2px" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <circle cx="11" cy="11" r="8" stroke="currentColor" fill="none" strokeWidth="2px"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" fill="none" strokeWidth="2px"></line>
                          </svg>
                        </div>
                      </div>

                      <NavbarCartButton />
                      <div className="cart-devider"></div>

                      <Link href="/shop" className="primary-button w-inline-block">
                        <div className="button-text-wrapper">
                          <div className="button-text-block">
                            <div className="link-text is-1">Explore Templates</div>
                            <div className="link-text is-2">Explore Templates</div>
                          </div>
                          <div className="button-arrow-block">
                            <div className="link-icon is-1 w-embed">
                              <svg fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
                                <path d="M7 17 17 7M7 7h10v10"></path>
                              </svg>
                            </div>
                            <div className="link-icon is-2 w-embed">
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
                      <NavbarCartButton />
                      <div className="cart-devider"></div>
                      <div
                        className={`menu-button w-nav-button ${isMobileMenuOpen ? 'w--open' : ''}`}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle navigation menu"
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="w-icon-nav-menu"></div>
                      </div>
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
              <div className="w-layout-blockcontainer container-large w-container">
                <div className="search-inner-wrapper">
                  <div className="search-form w-form" style={{ width: '100%' }}>
                    <form onSubmit={handleSearchSubmit} className="search-form">
                      <div className="search-field-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <input
                          ref={searchInputRef}
                          className="search-field w-input"
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
                        <button type="submit" className="search-button-icon w-button" style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
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
                    <div className="close-button-icon w-embed">
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
          <div
            className="search-overlay"
            onClick={() => setIsSearchOpen(false)}
            style={{ display: isSearchOpen ? 'block' : 'none' }}
          ></div>
        </div>
      </header>
    </>
  );
}
