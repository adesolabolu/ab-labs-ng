'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname() || '/';
  const router = useRouter();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

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
      <header id="top" className="header">
        <div className="site-top">
          <div className="header-wrapper">
            <div data-nav-animation="over-left" data-nav-collapse="medium" data-nav-duration="400" data-anim-easing="ease" data-anim-easing2="ease" role="banner" className="hdr site-nav">
              <div className="hdr-in">
                <div className="site-blockcontainer container-large site-container">
                  <div className="navbar-wrapper">
                    <Link href="/" className={`hdr-logo inline-block ${pathname === '/' ? 'is-current' : ''}`}>
                      <img src="/assets/ab-labs-logo.svg" loading="lazy" alt="aB Labs logo" className="logo" />
                    </Link>

                    <nav
                      role="navigation"
                      className={`nav-menu-wrapper nav-menu-list ${isMobileMenuOpen ? 'nav-menu-open' : ''}`}
                      style={isMobileMenuOpen ? { display: 'block' } : undefined}
                    >
                      <ul role="list" className="nav-menu site-list-unstyled list-unstyled" style={{ listStyle: 'none', paddingLeft: 0, margin: 0 }}>
                        <li className="mobile-logo">
                          <Link href="/" className="hdr-logo inline-block">
                            <img src="/assets/ab-labs-logo.svg" loading="lazy" alt="aB Labs logo" className="logo" />
                          </Link>
                        </li>

                        <li>
                          <Link href="/" className={`hdr-nav-a ${pathname === '/' ? 'is-current' : ''}`}>
                            Home
                          </Link>
                        </li>
                        <li>
                          <Link href="/shop" className={`hdr-nav-a ${pathname.startsWith('/shop') ? 'is-current' : ''}`}>
                            Shop
                          </Link>
                        </li>
                        <li>
                          <Link href="/blog" className={`hdr-nav-a ${pathname.startsWith('/blog') ? 'is-current' : ''}`}>
                            Blog
                          </Link>
                        </li>
                        <li>
                          <Link href="/contact-us" className={`hdr-nav-a ${pathname === '/contact-us' ? 'is-current' : ''}`}>
                            Contact
                          </Link>
                        </li>

                        <li className="mobile-button">
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
                      <div
                        className={`menu-button nav-toggle-btn ${isMobileMenuOpen ? 'is-open' : ''}`}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle navigation menu"
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="icon-nav-menu"></div>
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
