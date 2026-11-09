import React from 'react';
import Link from 'next/link';
import NavbarCartButton from '@/components/NavbarCartButton';
import BlogCatalog from '@/components/BlogCatalog';

export const metadata = {
  title: 'Engineering Playbooks & Insights | aB Labs',
  description: 'Proven web architecture, Paystack checkout optimization, local SEO playbooks, and conversion rate engineering for ambitious African brands.',
};

export default function BlogPage() {
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
                                          <div role="listitem" className="w-dyn-item"><Link href="/shop" className="nav-link-block w-inline-block"><div>All Templates (8)</div></Link></div>
                                          <div role="listitem" className="w-dyn-item"><Link href="/shop?category=ecommerce" className="nav-link-block w-inline-block"><div>E-Commerce &amp; Retail</div></Link></div>
                                          <div role="listitem" className="w-dyn-item"><Link href="/shop?category=real-estate" className="nav-link-block w-inline-block"><div>Real Estate &amp; PropTech</div></Link></div>
                                          <div role="listitem" className="w-dyn-item"><Link href="/shop?category=corporate" className="nav-link-block w-inline-block"><div>Corporate &amp; Agency</div></Link></div>
                                          <div role="listitem" className="w-dyn-item"><Link href="/shop?category=saas" className="nav-link-block w-inline-block"><div>Tech Startups &amp; SaaS</div></Link></div>
                                          <div role="listitem" className="w-dyn-item"><Link href="/shop?category=hospitality" className="nav-link-block w-inline-block"><div>Hospitality &amp; Dining</div></Link></div>
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
                        <li><Link href="/shop" className="hdr-nav-a">Templates</Link></li>
                        <li><Link href="/about-us" className="hdr-nav-a">About</Link></li>
                        <li><Link href="/blog" aria-current="page" className="hdr-nav-a w--current">Insights</Link></li>
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
        <section className="section-breadcrumb">
          <div className="w-layout-blockcontainer container-large w-container">
            <div className="page-heading-block align-center">
              <div className="hero-subtitle-block">
                <div className="subtitle-dot"></div>
                <div>08 — Engineering &amp; Growth Insights</div>
              </div>
              <div className="page-title-block">
                <h1 className="heading-style-h1">Playbooks for African Founders</h1>
              </div>
              <div className="hero-summary-wrapper max-width-460px">
                <p className="hero-summary">
                  Technical guides, conversion frameworks, local SEO playbooks, and modern web architecture — straight from the aB Labs engineering desk.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic & Interactive Blog Catalog */}
        <BlogCatalog />
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
              <div>Paystack &amp; Flutterwave Local Gateway Ready</div>
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
                  Production-ready Next.js website templates and bespoke web engineering built for ambitious Nigerian and African businesses.
                </p>
              </div>
              <div className="fh-col">
                <p className="fh-col-h">Templates</p>
                <Link href="/shop" className="fh-lk">All Templates</Link>
                <Link href="/shop?category=ecommerce" className="fh-lk">E-Commerce</Link>
                <Link href="/shop?category=real-estate" className="fh-lk">Real Estate</Link>
                <Link href="/shop?category=corporate" className="fh-lk">Corporate</Link>
                <Link href="/shop?category=saas" className="fh-lk">Tech &amp; SaaS</Link>
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
