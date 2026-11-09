import Navbar from '@/components/Navbar';
import BlogCatalog from '@/components/BlogCatalog';
import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Engineering & Conversion Insights | aB Labs',
  description: 'Actionable web strategy, conversion rate optimization, local SEO playbooks, and high-performance digital architecture from aB Labs.',
};

export default function BlogPage() {
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
                  <div>From the Engineering Lab</div>
                </div>
                <div className="page-title-block">
                  <h1 className="heading-style-h1">Engineering &amp; Conversion Insights</h1>
                </div>
                <div className="hero-summary-wrapper" style={{ maxWidth: '680px', margin: '0 auto' }}>
                  <p className="hero-summary" style={{ textAlign: 'center' }}>
                    Battle-tested web architecture, local SEO strategies, payment infrastructure, and conversion optimization playbooks from aB Labs.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Sourced directly from @/data/blogs */}
          <BlogCatalog />
        </div>

        {/* Global aB Labs Footer */}
        <section className="footer">
          <div className="w-layout-blockcontainer container-large w-container">
            <div className="fh-in">
              <div className="fh-main">
                <div className="fh-brand">
                  <Link href="/" className="fh-logo w-inline-block">
                    <img src="/assets/ab-labs-logo.svg" loading="lazy" alt="aB Labs logo" className="footer-logo" />
                  </Link>
                  <p className="fh-statement">
                    Production-ready website designs and bespoke web engineering built for ambitious Nigerian and African businesses.
                  </p>
                  <div className="w-form">
                    <form id="cta-forms" name="email-form" data-name="Email Form" method="get">
                      <label htmlFor="name" aria-label="text" className="fh-nl-ey">Join our newsletter</label>
                      <div className="fh-nl-form">
                        <input className="fh-nl-inp w-input" maxLength={256} name="email" data-name="email" aria-label="Email address" placeholder="Enter your email" type="email" id="email" required={true} />
                        <button type="submit" className="fh-nl-btn">
                          <div className="arrow-icon w-embed">
                            <svg fill="none" width="15" height="15" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                              <path d="M5 12h14M12 5l7 7-7 7"></path>
                            </svg>
                          </div>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="fh-col">
                  <p className="fh-col-h">Templates</p>
                  <Link href="/shop" className="fh-lk a">All Templates</Link>
                  <Link href="/shop?category=real-estate" className="fh-lk">Real Estate</Link>
                  <Link href="/shop?category=ecommerce" className="fh-lk a">E-Commerce</Link>
                  <Link href="/shop?category=corporate" className="fh-lk a">Corporate</Link>
                  <Link href="/shop?category=saas" className="fh-lk a">Tech &amp; SaaS</Link>
                </div>
                <div className="fh-col">
                  <p className="fh-col-h">Company</p>
                  <Link href="/" className="fh-lk a">Home</Link>
                  <Link href="/about-us" className="fh-lk a">About Us</Link>
                  <Link href="/contact-us" className="fh-lk a">Contact Us</Link>
                  <Link href="/blog" aria-current="page" className="fh-lk a w--current">Insights</Link>
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
