import React from 'react';
import Link from 'next/link';
import NavbarCartButton from '@/components/NavbarCartButton';

export const metadata = {
  title: '404 - Page Not Found | aB Labs NG',
  description: 'The requested template or page could not be found. Browse our catalog of production-ready Next.js website templates.',
};

export default function NotFoundPage() {
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
                        <img loading="lazy" src="/assets/ab-labs-logo.svg" alt="aB Labs NG logo" className="logo" />
                      </Link>
                      <nav role="navigation" className="nav-menu-wrapper w-nav-menu">
                        <ul role="list" className="nav-menu w-list-unstyled">
                          <li className="mobile-logo">
                            <Link href="/" className="hdr-logo w-inline-block">
                              <img loading="lazy" src="/assets/ab-labs-logo.svg" alt="aB Labs NG logo" className="logo" />
                            </Link>
                          </li>
                          <li><Link href="/" className="hdr-nav-a">Home</Link></li>
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
                            <svg className="nav__search-ico" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9A9A9A" strokeWidth="2px" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
                      <div className="menu-button w-nav-button"><div className="w-icon-nav-menu"></div></div>
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
                      <form id="not-found-search-form" name="not-found-search-form" method="get">
                        <div className="search-field-wrapper">
                          <input className="search-field w-input" maxLength={256} name="q" aria-label="Search website templates" placeholder="Search templates by industry or feature…" type="text" id="q" required={true} />
                          <input type="submit" className="search-button-icon w-button" value="" />
                        </div>
                      </form>
                      <div className="form_message-success w-form-done">
                        <div>Search submitted. Browse our catalog for matching designs.</div>
                      </div>
                      <div className="form_message-error w-form-fail">
                        <div>Search is currently unavailable. Please visit our shop catalog directly.</div>
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
            </div>
          </div>
        </header>

        <main className="main-wrapper">
          <section className="section-404">
            <div className="w-layout-blockcontainer container-large w-container">
              <div className="content-block-404">
                <h1 className="text-404">4<span className="span-404">0</span>4</h1>
                <div className="inner-content-block-404">
                  <h2 className="utility-title">Page or Template Not Found</h2>
                  <p className="excerpt-404">
                    The page or template you are looking for may have been moved, renamed, or is currently unavailable. Explore our full template catalog or return to the home page.
                  </p>
                  <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '24px' }}>
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
                    <Link href="/" className="primary-button w-variant-247f4bce-739b-3294-dc6c-b061c876c17e w-inline-block">
                      <div className="button-text-wrapper">
                        <div className="button-text-block">
                          <div className="link-text is-1">Back To Home</div>
                          <div className="link-text is-2">Back To Home</div>
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
                </div>
              </div>
            </div>
          </section>
        </main>

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
                    <img src="/assets/ab-labs-logo.svg" loading="lazy" alt="aB Labs NG logo" className="footer-logo" />
                  </Link>
                  <p className="fh-statement">
                    Production-ready Next.js website templates engineered for ambitious African businesses, agencies, and e-commerce leaders.
                  </p>
                  <div className="w-form">
                    <form id="cta-forms-404" name="email-form" method="get">
                      <label htmlFor="newsletter-404" className="fh-nl-ey">Join our developer dispatch</label>
                      <div className="fh-nl-form">
                        <input className="fh-nl-inp w-input" maxLength={256} name="email" placeholder="Enter your work email" type="email" id="newsletter-404" required={true} />
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
                  <Link href="/about-us" className="fh-lk a">About Us</Link>
                  <Link href="/contact-us" className="fh-lk a">Contact Us</Link>
                  <Link href="/blog" className="fh-lk a">Insights &amp; Playbooks</Link>
                </div>
              </div>

              <div className="footer-border v2"></div>
              <div className="footer-border"></div>
            </div>

            <div className="fh-bot">
              <div className="fh-bot-in">
                <p className="fh-copy">© 2026 aB Labs NG — Production-Ready Next.js Web Flagships</p>
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
