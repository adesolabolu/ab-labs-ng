import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import BlogCatalog from '@/components/BlogCatalog';

export const metadata = {
  title: 'Engineering Playbooks & Insights | aB Labs',
  description: 'Proven web architecture, Paystack checkout optimization, local SEO playbooks, and conversion rate engineering for ambitious African brands.',
};

export default function BlogPage() {
  return (
    <div className="page-wrapper">
      {/* Header */}
      <Navbar />

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
