import Navbar from '@/components/Navbar';
import React, { Suspense } from 'react';
import Link from 'next/link';
import ShopCatalog from '@/components/ShopCatalog';

export const metadata = {
  title: 'Shop All Templates | aB Labs',
  description: 'Explore production-ready Next.js website templates and web systems engineered for African and Nigerian businesses. Mobile-first, turnkey customization, and ultra-fast.',
};

export default function ShopPage() {
  return (
    <>
      <div className="page-wrapper">
        <Navbar />
        
        <div className="main-wrapper">
          <section className="section-breadcrumb">
            <div className="w-layout-blockcontainer container-large w-container">
              <div className="page-heading-block align-center">
                <div className="hero-subtitle-block">
                  <div className="subtitle-dot"></div>
                  <div>01 — Complete Catalog</div>
                </div>
                <div className="page-title-block">
                  <h1 className="heading-style-h1">Shop All Templates</h1>
                </div>
                <div className="hero-summary-wrapper max-width-460px">
                  <p className="hero-summary">
                    Handcrafted, ultra-fast Next.js templates engineered for Nigerian &amp; African commerce. Bespoke brand styling, responsive across all screen sizes, and optimized for sub-second Core Web Vitals.
                  </p>
                </div>

                <div className="breadcrumb-badge-wrapper" style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <div className="ab-flow-tag bg-rgba-249-246-241-7">
                    <div className="him-icon w-embed">
                      <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" width="16" height="16">
                        <path d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                      </svg>
                    </div>
                    <div>Sub-Second Load Times</div>
                  </div>
                  <div className="ab-flow-tag bg-rgba-249-246-241-7">
                    <div className="him-icon w-embed">
                      <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" width="16" height="16">
                        <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                        <line x1="2" y1="10" x2="22" y2="10"></line>
                      </svg>
                    </div>
                    <div>Turnkey Customization</div>
                  </div>
                  <div className="ab-flow-tag bg-rgba-249-246-241-7">
                    <div className="him-icon w-embed">
                      <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" width="16" height="16">
                        <rect x="5" y="2" width="14" height="20" rx="2"></rect>
                        <line x1="12" y1="18" x2="12.01" y2="18"></line>
                      </svg>
                    </div>
                    <div>100% Mobile Optimized</div>
                  </div>
                  <div className="ab-flow-tag bg-rgba-249-246-241-7">
                    <div className="him-icon w-embed">
                      <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" width="16" height="16">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      </svg>
                    </div>
                    <div>Direct Lifetime Support</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="section-shop-catalog" style={{ padding: '40px 0 80px' }}>
            <div className="w-layout-blockcontainer container-large w-container">
              <Suspense fallback={<div style={{ textAlign: 'center', padding: '60px' }}>Loading templates...</div>}>
                <ShopCatalog />
              </Suspense>
            </div>
          </section>
        </div>

        <section className="footer"><div className="w-layout-blockcontainer container-large w-container"><div className="fh-trust"><div className="fh-trust-it"><div className="footer-icon w-embed"><svg fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
          <rect x="1" y="3" width="15" height="13"></rect>
          <path d="M16 8h4l3 3v5h-7V8z"></path>
          <circle cx="5.5" cy="18.5" r="2.5"></circle>
          <circle cx="18.5" cy="18.5" r="2.5"></circle>
        </svg></div><div>48-Hour Rapid Deployment &amp; Setup</div></div><div className="fh-trust-it"><div className="footer-icon w-embed"><svg fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg></div><div>Paystack &amp; Flutterwave Local Gateway Ready</div></div><div className="fh-trust-it"><div className="footer-icon w-embed"><svg fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
  <polyline points="23 4 23 10 17 10"></polyline>
  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
</svg></div><div>100% Clean Code &amp; Full Source Ownership</div></div><div className="fh-trust-it"><div className="footer-icon w-embed"><svg fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
          <rect x="3" y="11" width="18" height="11" rx="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg></div><div>Google Search Console &amp; Technical SEO Ready</div></div></div><div className="fh-in"><div className="fh-main"><div className="fh-brand"><a href="/" aria-current="page" className="fh-logo w-inline-block w--current"><img src="/assets/ab-labs-logo.svg" loading="lazy" alt="aB Labs logo" className="footer-logo"/></a><p className="fh-statement">Production-ready Next.js website templates and bespoke web engineering built for ambitious Nigerian and African businesses.</p><div className="w-form"><form id="cta-forms" name="email-form" data-name="Email Form" method="get" data-turnstile-sitekey="0x4AAAAAAAQTptj2So4dx43e"><label htmlFor="name" aria-label="text" className="fh-nl-ey">Get New Template Drops &amp; Playbooks</label><div className="fh-nl-form"><input className="fh-nl-inp w-input" maxLength={256} name="email" data-name="email" aria-label="Email address" placeholder="Enter your business email" type="email" id="email" required={true}/><button type="submit" className="fh-nl-btn"><div className="arrow-icon w-embed"><svg fill="none" width="15" height="15" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg></div></button></div></form><div className="form_message-success w-form-done"><div>You&#x27;re on the list! Check your inbox for our next update.</div></div><div className="form_message-error w-form-fail"><div>We couldn&#x27;t subscribe you just now. Please check your email and try again.</div></div></div><div className="fh-soc"><a href="https://instagram.com" target="_blank" className="fh-si"><div className="arrow-icon w-embed"><svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg></div></a><a href="https://dribbble.com" target="_blank" className="fh-si"><div className="arrow-icon w-embed"><svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"></path>
              </svg></div></a><a href="https://youtube.com" target="_blank" className="fh-si"><div className="arrow-icon w-embed"><svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M22.5 6.4a2.8 2.8 0 0 0-2-2C18.9 4 12 4 12 4s-6.9 0-8.6.5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 1 12a29 29 0 0 0 .5 5.6 2.8 2.8 0 0 0 2 2C5.1 20 12 20 12 20s6.9 0 8.6-.5a2.8 2.8 0 0 0 2-2A29 29 0 0 0 23 12a29 29 0 0 0-.5-5.6z"></path>
                <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon>
              </svg></div></a><a href="https://tiktok.com" target="_blank" className="fh-si"><div className="arrow-icon w-embed"><svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
              </svg></div></a></div></div><div className="fh-col"><p className="fh-col-h">Templates</p><a href="/shop" className="fh-lk">All Templates</a><a href="/shop?category=ecommerce" className="fh-lk">E-Commerce</a><a href="/shop?category=real-estate" className="fh-lk">Real Estate</a><a href="/shop?category=corporate" className="fh-lk">Corporate</a><a href="/shop?category=saas" className="fh-lk">Tech &amp; SaaS</a></div><div className="fh-col"><p className="fh-col-h">Company</p><a href="/" aria-current="page" className="fh-lk a w--current">Home</a><a href="/about-us" className="fh-lk a">About Us</a><a href="/contact-us" className="fh-lk a">Contact Us</a><a href="/blog" className="fh-lk a">Insights</a></div></div><div className="footer-border v2"></div><div className="footer-border"></div></div><div className="fh-bot"><div className="fh-bot-in"><p className="fh-copy">© 2026 aB Labs — Production-Ready Web Flagships</p><a href="/#top" className="fh-top-top w-inline-block"><div>Back to top</div><div className="fh-toptop-span"><div className="arrow-icon w-embed"><svg fill="none" width="14" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path d="M12 19V5M5 12l7-7 7 7"></path>
            </svg></div></div></a></div></div></div></section>
      </div>
    </>
  );
}
