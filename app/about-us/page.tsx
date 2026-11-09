import React from 'react';
import Link from 'next/link';
import NavbarCartButton from '@/components/NavbarCartButton';

export const metadata = {
  title: 'About aB Labs | High-Performance Next.js Website Templates & Digital Flagships',
  description: 'Learn how aB Labs engineers production-grade Next.js website templates, custom digital storefronts, and conversion-optimized web applications for ambitious African brands.',
};

export default function AboutUsPage() {
  return (
    <>
      <div className="page-wrapper">
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
                          <li><Link href="/about-us" aria-current="page" className="hdr-nav-a w--current">About</Link></li>
                          <li><Link href="/blog" className="hdr-nav-a">Insights</Link></li>
                          <li><Link href="/contact-us" className="hdr-nav-a">Contact</Link></li>
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
                        <div className="search-button-wrapper">
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
            <div className="search-wrapper">
              <div className="search-inner-block">
                <div className="w-layout-blockcontainer container-large w-container">
                  <div className="search-inner-wrapper">
                    <div className="search-form w-form">
                      <form id="template-search-form" name="template-search-form" method="get">
                        <div className="search-field-wrapper">
                          <input className="search-field w-input" maxLength={256} name="q" aria-label="Search website templates" placeholder="Search templates by industry or feature…" type="text" id="q" required={true} />
                          <input type="submit" className="search-button-icon w-button" value="" />
                        </div>
                      </form>
                      <div className="form_message-success w-form-done">
                        <div>Search submitted. Browse our template catalog for matching architectures.</div>
                      </div>
                      <div className="form_message-error w-form-fail">
                        <div>Search is unavailable right now. Please browse our catalog directly.</div>
                      </div>
                    </div>
                    <div className="search-close-btn">
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
              <div className="search-overlay"></div>
            </div>
          </div>
        </header>

        <main className="main-wrapper">
          {/* SECTION: HERO */}
          <section className="section-about-hero">
            <div className="w-layout-blockcontainer container-large w-container">
              <div className="ab-hero-in">
                <div className="ab-hero-left">
                  <div className="page-heading-block">
                    <div className="hero-subtitle-block">
                      <div className="subtitle-dot"></div>
                      <div>About aB Labs</div>
                    </div>
                    <div className="page-title-block max-width-780px">
                      <h1 className="heading-style-h1">Digital Flagships Engineered for Scale, Built to Convert.</h1>
                    </div>
                    <div className="hero-summary-wrapper max-width-520px">
                      <p className="about-hero-summary">
                        We design and engineer production-grade Next.js website templates, high-converting digital storefronts, and tailored web applications for fast-growing African enterprises and ambitious creators.
                      </p>
                    </div>
                  </div>
                  <div className="ab-hero-actions">
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
                    <Link href="/contact-us" className="primary-button w-variant-247f4bce-739b-3294-dc6c-b061c876c17e w-inline-block">
                      <div className="button-text-wrapper">
                        <div className="button-text-block">
                          <div className="link-text is-1">Book a Consultation</div>
                          <div className="link-text is-2">Book a Consultation</div>
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
                  <div className="ab-hero-meta">
                    <div className="it">
                      <p className="ab-hero-meta-it-b counter">2020</p>
                      <p className="ab-hero-meta-it-small">Founded in Lagos</p>
                    </div>
                    <div className="sep"></div>
                    <div className="it">
                      <p className="ab-hero-meta-it-b"><span className="counter">140</span>+</p>
                      <p className="ab-hero-meta-it-small">Flagships deployed</p>
                    </div>
                    <div className="sep"></div>
                    <div className="it">
                      <p className="ab-hero-meta-it-b"><span className="counter">99.8</span>%</p>
                      <p className="ab-hero-meta-it-small">Mobile Lighthouse score</p>
                    </div>
                  </div>
                </div>
                <div className="ab-hero-right">
                  <div className="ab-hero-rate">
                    <p className="ab-hero-rate-n">4.9</p>
                    <div>
                      <p className="ab-hero-rate-s">★★★★★</p>
                      <p className="ab-hero-rate-l">Rated by 120+ founders &amp; tech leads</p>
                    </div>
                  </div>
                  <img src="/assets/6aa0e1f3d02666b3379f7bfb_About%20Hero%20image%20(1).webp" alt="Engineers building high-performance web flagships at aB Labs" loading="eager" className="ab-hero-media-img" />
                  <div className="ab-hero-tag">
                    <div className="subtitle-dot"></div>
                    <div>Engineered in Nigeria for global commerce</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION: PHILOSOPHY */}
          <section className="section-philoshphy">
            <div className="w-layout-blockcontainer container-large w-container">
              <div className="section-heading-block align-center">
                <div className="section-subtitle-block">
                  <div className="subtitle-text">02 — Our Philosophy</div>
                </div>
                <div className="section-title-block max-width-980px">
                  <h2 className="title-42px text-weight-medium _42px">
                    We Believe Web Software Should Be Accessible, Blazing Fast, and 100% Free of Bloat.
                  </h2>
                </div>
              </div>
              <div className="ab-prin-grid">
                <div className="ab-prin rv">
                  <p className="ab-prin-n">01</p>
                  <div className="ab-prin-rule"></div>
                  <h3 className="ab-prin-h">Material Honesty in Code</h3>
                  <p className="ab-prin-p">
                    Zero bloated drag-and-drop builders, zero fragile plugins. Clean Next.js 16, TypeScript, and semantic Tailwind CSS that your engineers will love working with.
                  </p>
                </div>
                <div className="ab-prin rv rv1">
                  <p className="ab-prin-n">02</p>
                  <div className="ab-prin-rule"></div>
                  <h3 className="ab-prin-h">Engineered for African Scale</h3>
                  <p className="ab-prin-p">
                    Pre-wired Paystack &amp; Flutterwave checkout routes, lightweight assets for 3G/4G networks, and responsive WhatsApp lead capture designed to maximize conversion.
                  </p>
                </div>
                <div className="ab-prin">
                  <p className="ab-prin-n">03</p>
                  <div className="ab-prin-rule"></div>
                  <h3 className="ab-prin-h">100% Full Source Ownership</h3>
                  <p className="ab-prin-p">
                    When you acquire an aB Labs template, you own the full unminified GitHub codebase forever. Zero recurring builder lock-ins, zero hidden licensing royalties.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION: STORY */}
          <section className="section-story">
            <div className="w-layout-blockcontainer container-large w-container">
              <div className="story-wrapper">
                <div className="story-left-column">
                  <div className="section-heading-block">
                    <div className="section-subtitle-block">
                      <div className="subtitle-text text-color-white">03 — Our Story</div>
                    </div>
                    <div className="section-title-block max-width-460px">
                      <h2 className="heading-style-h2 text-color-white">Six Years, One Mission.</h2>
                    </div>
                    <div className="section-summary-block max-width-400px">
                      <p className="text-size-regular text-color--f9f6f1">
                        Frustrated by sluggish website builders and fragile CMS stacks, we set out to engineer production-grade web flagships that give African founders enterprise speed without agency overhead.
                      </p>
                    </div>
                  </div>
                  <div className="ab-story-badge">
                    <p className="ab-story-badge-b"><span className="counter">140</span>+</p>
                    <p className="ab-story-badge-span">Digital flagships deployed to date</p>
                  </div>
                </div>
                <div className="story-right-column">
                  <div className="ab-tl-list">
                    <div className="ab-tl-row">
                      <div className="ab-tl-rail"></div>
                      <div className="ab-tl-dot"></div>
                      <p className="ab-tl-yr">2020</p>
                      <div>
                        <h3 className="ab-tl-h">The Boutique Software Lab</h3>
                        <p className="ab-tl-p">
                          aB Labs was founded in Lagos as a bespoke full-stack engineering consultancy building high-traffic fintech, logistics, and commerce platforms.
                        </p>
                      </div>
                    </div>
                    <div className="ab-tl-row">
                      <div className="ab-tl-rail"></div>
                      <div className="ab-tl-dot"></div>
                      <p className="ab-tl-yr">2022</p>
                      <div>
                        <h3 className="ab-tl-h">Codifying Modern Architecture</h3>
                        <p className="ab-tl-p">
                          After repeatedly hand-crafting the same core Next.js &amp; Paystack payment foundations, we standardized our component libraries and design tokens into production-ready marketplace templates.
                        </p>
                      </div>
                    </div>
                    <div className="ab-tl-row">
                      <div className="ab-tl-rail"></div>
                      <div className="ab-tl-dot"></div>
                      <p className="ab-tl-yr">2024</p>
                      <div>
                        <h3 className="ab-tl-h">Pan-African Expansion</h3>
                        <p className="ab-tl-p">
                          Our templates power brands across Nigeria, Ghana, Kenya, and Rwanda, processing hundreds of millions in transactions with sub-second response times.
                        </p>
                      </div>
                    </div>
                    <div className="ab-tl-row">
                      <div className="ab-tl-rail"></div>
                      <div className="ab-tl-dot"></div>
                      <p className="ab-tl-yr">2025</p>
                      <div>
                        <h3 className="ab-tl-h">Next.js 16 &amp; Turbopack Standard</h3>
                        <p className="ab-tl-p">
                          Complete modernization to React 19, Turbopack, and Server Actions, cutting mobile page load times by over 70% on cellular networks.
                        </p>
                      </div>
                    </div>
                    <div className="ab-tl-row">
                      <div className="ab-tl-rail"></div>
                      <div className="ab-tl-dot"></div>
                      <p className="ab-tl-yr">Today</p>
                      <div>
                        <h3 className="ab-tl-h">The Template Benchmark</h3>
                        <p className="ab-tl-p">
                          Over 140 deployments later, every template in our catalog represents the gold standard in speed, typography, conversion, and transaction reliability.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION: NUMBERS */}
          <section className="section-number">
            <div className="w-layout-blockcontainer container-large w-container">
              <div className="ab-stats-stage">
                <div className="ab-stats-bg">
                  <img src="/assets/6aa0f4f06ebeb100bcea2cac_About%20stats%20image.webp" alt="Inside the aB Labs studio" loading="lazy" sizes="100vw" className="ab-stats-bg-img" />
                  <div className="number-image-overlay"></div>
                </div>
                <div className="ab-stats-top">
                  <div className="section-heading-block align-center">
                    <div className="section-subtitle-block">
                      <div className="subtitle-text text-color-white">04 — By the Numbers</div>
                    </div>
                    <div className="section-title-block">
                      <h2 className="heading-style-h2 text-color-white">Performance Metrics That Impact Your Bottom Line.</h2>
                    </div>
                  </div>
                </div>
                <div className="ab-stat-row">
                  <div className="ab-stat">
                    <div className="ab-statn"><p data-count="99"><span className="counter">99</span></p><p className="s">+</p></div>
                    <div className="ab-statl">Mobile Lighthouse Score</div>
                  </div>
                  <div className="ab-stat left-border">
                    <div className="ab-statn"><p data-count="48"><span className="counter">48</span></p><p className="s">hr</p></div>
                    <div className="ab-statl">Average Turnkey Launch</div>
                  </div>
                  <div className="ab-stat left-border">
                    <div className="ab-statn"><p data-count="140"><span className="counter">140</span></p><p className="s">+</p></div>
                    <div className="ab-statl">Active Brand Flagships</div>
                  </div>
                  <div className="ab-stat left-border">
                    <div className="ab-statn"><p data-count="99.9"><span className="counter">99.9</span></p><p className="s">%</p></div>
                    <div className="ab-statl">Production Uptime Benchmark</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION: STANDARDS / PROMISE */}
          <section className="section-promise">
            <div className="w-layout-blockcontainer container-large w-container">
              <div className="section-heading-block align-center">
                <div className="section-subtitle-block">
                  <div className="subtitle-text">05 — Our Standards</div>
                </div>
                <div className="section-title-block">
                  <h2 className="heading-style-h2">Code You Own. Performance You Can Verify.</h2>
                </div>
                <div className="section-summary-block max-width-670px">
                  <p className="text-size-regular text-color--8c8782">
                    Every aB Labs digital package is tested against Google Core Web Vitals and African payment gateway APIs before joining our catalog.
                  </p>
                </div>
              </div>
              <div className="ab-seals">
                <div className="ab-seal">
                  <div className="ab-seal-ring">
                    <div className="ab-seal-tick">
                      <div className="arrow-icon w-embed">
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <path d="M20 6 9 17l-5-5"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="ab-seal-disc">
                      <div className="promise-icon w-embed">
                        <svg fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <h3 className="ab-seal-h">100% Code Ownership</h3>
                  <p className="ab-seal-p">Complete GitHub repository access with clean, modular Next.js 16 and TypeScript.</p>
                </div>
                <div className="ab-seal">
                  <div className="ab-seal-ring">
                    <div className="ab-seal-tick">
                      <div className="arrow-icon w-embed">
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <path d="M20 6 9 17l-5-5"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="ab-seal-disc">
                      <div className="promise-icon w-embed">
                        <svg fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                          <rect x="1" y="3" width="15" height="13"></rect>
                          <path d="M16 8h4l3 3v5h-7V8z"></path>
                          <circle cx="5.5" cy="18.5" r="2.5"></circle>
                          <circle cx="18.5" cy="18.5" r="2.5"></circle>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <h3 className="ab-seal-h">Instant Digital Transfer</h3>
                  <p className="ab-seal-p">Automatic GitHub repository invite and ZIP download immediately upon Paystack checkout.</p>
                </div>
                <div className="ab-seal">
                  <div className="ab-seal-ring">
                    <div className="ab-seal-tick">
                      <div className="arrow-icon w-embed">
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <path d="M20 6 9 17l-5-5"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="ab-seal-disc">
                      <div className="promise-icon w-embed">
                        <svg fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                          <polyline points="23 4 23 10 17 10"></polyline>
                          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <h3 className="ab-seal-h">30-Day Dev Support</h3>
                  <p className="ab-seal-p">Direct technical support for environment setup, custom domains, and Paystack webhooks.</p>
                </div>
                <div className="ab-seal">
                  <div className="ab-seal-ring">
                    <div className="ab-seal-tick">
                      <div className="arrow-icon w-embed">
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <path d="M20 6 9 17l-5-5"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="ab-seal-disc">
                      <div className="promise-icon w-embed">
                        <svg fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                          <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <h3 className="ab-seal-h">Zero Platform Subscriptions</h3>
                  <p className="ab-seal-p">Deploy free on Vercel or your own cloud. Never pay recurring monthly website builder fees.</p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION: HOW IT'S ENGINEERED */}
          <section className="section-him">
            <div className="w-layout-blockcontainer container-large w-container">
              <div className="section-heading-block align-center">
                <div className="section-subtitle-block">
                  <div className="subtitle-text">06 — How We Engineer</div>
                </div>
                <div className="section-title-block">
                  <h2 className="heading-style-h2">From Design System to Production Deployment.</h2>
                </div>
                <div className="section-summary-block max-width-510px">
                  <p className="text-size-regular text-color--8c8782">
                    A disciplined, engineering-first approach to digital commerce — from atomic UI components to sub-second edge delivery.
                  </p>
                </div>
              </div>
              <div className="ab-proc-in">
                {/* STEP 1 */}
                <div className="ab-flow-row">
                  <div className="ab-flow-img is-1">
                    <img src="/assets/6aa11df30f2e4d72542f8ec8_Step%2001.webp" alt="Design tokens and architecture" loading="lazy" sizes="100vw" className="ab-flow-img-img" />
                    <div className="ab-flow-badge"><div className="him-dot"></div><div>Phase 01</div></div>
                  </div>
                  <div className="ab-flow-txt is-1">
                    <div className="ab-flow-idx">
                      <p className="ab-flow-wm">01</p>
                      <div className="ab-flow-idx-rule"></div>
                      <p className="ab-flow-k">Design &amp; Architecture</p>
                    </div>
                    <h3 className="ab-flow-h">Built from conversion psychology and clean tokens.</h3>
                    <p className="ab-flow-p">
                      Each template begins with rigorous UX wireframes and WCAG-compliant design tokens, perfected for crisp mobile typography, instant visual hierarchy, and intuitive user navigation.
                    </p>
                    <div className="ab-flow-meta">
                      <div className="ab-flow-tag">
                        <div className="him-icon w-embed">
                          <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                          </svg>
                        </div>
                        <div>Semantic Tokens</div>
                      </div>
                      <div className="ab-flow-tag">
                        <div className="him-icon w-embed">
                          <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                          </svg>
                        </div>
                        <div>Mobile-First Grid</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* STEP 2 */}
                <div className="ab-flow-row">
                  <div className="ab-flow-txt is-2">
                    <div className="ab-flow-idx">
                      <p className="ab-flow-wm">02</p>
                      <div className="ab-flow-idx-rule"></div>
                      <p className="ab-flow-k">Next.js 16 &amp; TypeScript</p>
                    </div>
                    <h3 className="ab-flow-h">Strict typing and zero fragile dependencies.</h3>
                    <p className="ab-flow-p">
                      Engineered with Next.js App Router, Turbopack, and type-safe schemas. Optimized for Core Web Vitals and tested against real-world 3G mobile cellular networks across West Africa.
                    </p>
                    <div className="ab-flow-meta">
                      <div className="ab-flow-tag">
                        <div className="him-icon w-embed">
                          <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                            <path d="M20 6 9 17l-5-5"></path>
                          </svg>
                        </div>
                        <div>100% Type-Safe</div>
                      </div>
                      <div className="ab-flow-tag">
                        <div className="him-icon w-embed">
                          <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="9"></circle>
                            <path d="M12 7v5l3 2"></path>
                          </svg>
                        </div>
                        <div>&lt; 1.2s LCP Benchmark</div>
                      </div>
                    </div>
                  </div>
                  <div id="w-node-_5bfb187c-5cc4-f5c1-d31d-7accf11859c5-e9c951ad" className="ab-flow-img is-2">
                    <img src="/assets/6aa11df33ec80924db4ad236_Step%2002.webp" alt="Clean TypeScript engineering" loading="lazy" sizes="100vw" className="ab-flow-img-img" />
                    <div className="ab-flow-badge"><div className="him-dot"></div><div>Phase 02</div></div>
                  </div>
                </div>

                {/* STEP 3 */}
                <div className="ab-flow-row">
                  <div className="ab-flow-img">
                    <img src="/assets/6aa11df30f2e4d72542f8ec3_Step%2003.webp" alt="Turnkey deployment and Paystack handover" loading="lazy" sizes="100vw" className="ab-flow-img-img" />
                    <div className="ab-flow-badge"><div className="him-dot"></div><div>Phase 03</div></div>
                  </div>
                  <div className="ab-flow-txt">
                    <div className="ab-flow-idx">
                      <p className="ab-flow-wm">03</p>
                      <div className="ab-flow-idx-rule"></div>
                      <p className="ab-flow-k">Turnkey Launch &amp; Payments</p>
                    </div>
                    <h3 className="ab-flow-h">Pre-wired for African transactions.</h3>
                    <p className="ab-flow-p">
                      One-click Vercel deployment with pre-wired Paystack multi-currency webhooks, automated WhatsApp sales channel routing, and complete SEO schema configurations ready from day one.
                    </p>
                    <div className="ab-flow-meta">
                      <div className="ab-flow-tag">
                        <div className="him-icon w-embed">
                          <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                            <rect x="1" y="3" width="15" height="13"></rect>
                            <path d="M16 8h4l3 3v5h-7V8z"></path>
                            <circle cx="5.5" cy="18.5" r="2.5"></circle>
                            <circle cx="18.5" cy="18.5" r="2.5"></circle>
                          </svg>
                        </div>
                        <div>Paystack Pre-Wired</div>
                      </div>
                      <div className="ab-flow-tag">
                        <div className="him-icon w-embed">
                          <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                          </svg>
                        </div>
                        <div>1-Click Vercel Deploy</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* SECTION: FOOTER */}
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
                <div>Instant Code Delivery (GitHub &amp; ZIP)</div>
              </div>
              <div className="fh-trust-it">
                <div className="footer-icon w-embed">
                  <svg fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <div>30-Day Engineering Support</div>
              </div>
              <div className="fh-trust-it">
                <div className="footer-icon w-embed">
                  <svg fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                    <polyline points="23 4 23 10 17 10"></polyline>
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                  </svg>
                </div>
                <div>100% Clean Code &amp; Full Ownership</div>
              </div>
              <div className="fh-trust-it">
                <div className="footer-icon w-embed">
                  <svg fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <div>Secure Paystack Checkout</div>
              </div>
            </div>

            <div className="fh-in">
              <div className="fh-main">
                <div className="fh-brand">
                  <Link href="/" className="fh-logo w-inline-block">
                    <img src="/assets/ab-labs-logo.svg" loading="lazy" alt="aB Labs logo" className="footer-logo" />
                  </Link>
                  <p className="fh-statement">
                    Production-ready Next.js website templates engineered for ambitious African businesses, agencies, and e-commerce leaders.
                  </p>
                  <div className="w-form">
                    <form id="cta-forms" name="email-form" method="get">
                      <label htmlFor="newsletter-email" className="fh-nl-ey">Join our developer dispatch</label>
                      <div className="fh-nl-form">
                        <input className="fh-nl-inp w-input" maxLength={256} name="email" placeholder="Enter your work email" type="email" id="newsletter-email" required={true} />
                        <button type="submit" className="fh-nl-btn" aria-label="Subscribe">
                          <div className="arrow-icon w-embed">
                            <svg fill="none" width="15" height="15" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                              <path d="M5 12h14M12 5l7 7-7 7"></path>
                            </svg>
                          </div>
                        </button>
                      </div>
                    </form>
                    <div className="form_message-success w-form-done">
                      <div>You&apos;re subscribed! Expect new template drops &amp; engineering playbooks.</div>
                    </div>
                    <div className="form_message-error w-form-fail">
                      <div>Unable to subscribe right now. Please try again.</div>
                    </div>
                  </div>
                  <div className="fh-soc">
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="fh-si" aria-label="Instagram">
                      <div className="arrow-icon w-embed">
                        <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                          <rect x="2" y="2" width="20" height="20" rx="5"></rect>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                      </div>
                    </a>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="fh-si" aria-label="GitHub">
                      <div className="arrow-icon w-embed">
                        <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                        </svg>
                      </div>
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="fh-si" aria-label="X / Twitter">
                      <div className="arrow-icon w-embed">
                        <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                          <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                        </svg>
                      </div>
                    </a>
                  </div>
                </div>

                <div className="fh-col">
                  <p className="fh-col-h">Templates</p>
                  <Link href="/shop" className="fh-lk a">All Templates (8)</Link>
                  <Link href="/shop?category=ecommerce" className="fh-lk">E-Commerce &amp; Retail</Link>
                  <Link href="/shop?category=real-estate" className="fh-lk a">Real Estate &amp; PropTech</Link>
                  <Link href="/shop?category=corporate" className="fh-lk a">Corporate &amp; Agency</Link>
                  <Link href="/shop?category=saas" className="fh-lk a">Tech Startups &amp; SaaS</Link>
                  <Link href="/shop?category=hospitality" className="fh-lk a">Hospitality &amp; Dining</Link>
                </div>

                <div className="fh-col">
                  <p className="fh-col-h">Company</p>
                  <Link href="/" className="fh-lk a">Home</Link>
                  <Link href="/about-us" aria-current="page" className="fh-lk a w--current">About Us</Link>
                  <Link href="/contact-us" className="fh-lk a">Contact Us</Link>
                  <Link href="/blog" className="fh-lk a">Insights &amp; Playbooks</Link>
                </div>
              </div>

              <div className="footer-border v2"></div>
              <div className="footer-border"></div>
            </div>

            <div className="fh-bot">
              <div className="fh-bot-in">
                <p className="fh-copy">© 2026 aB Labs — Production-Ready Next.js Web Flagships</p>
                <a href="#top" className="fh-top-top w-inline-block">
                  <div>Back to top</div>
                  <div className="fh-toptop-span">
                    <div className="arrow-icon w-embed">
                      <svg fill="none" width="14" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                        <path d="M12 19V5M5 12l7-7 7 7"></path>
                      </svg>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
      <link rel="stylesheet" href="https://unpkg.com/lenis@1.3.1/dist/lenis.css" />
    </>
  );
}
