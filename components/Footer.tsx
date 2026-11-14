import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <section className="footer">
      <div className="site-blockcontainer container-large site-container">
        <div className="fh-in">
          <div className="fh-main">
            <div className="fh-brand">
              <Link href="/" aria-current="page" className="fh-logo inline-block is-current">
                <img src="/assets/ab-labs-logo.svg" loading="lazy" alt="aB Labs logo" className="footer-logo" />
              </Link>
              <p className="fh-statement">
                Simple, high-speed website templates customized and launched for ambitious African brands.
              </p>
              <div className="site-form">
                <form id="cta-forms" name="email-form" data-name="Email Form" method="get" data-umami-event="Footer - Submitted Newsletter">
                  <label htmlFor="footer-email" className="fh-nl-ey">Get New Template Drops &amp; Guides</label>
                  <div className="fh-nl-form">
                    <input
                      className="fh-nl-inp site-input"
                      maxLength={256}
                      name="email"
                      data-name="email"
                      aria-label="Email address"
                      placeholder="Enter your business email"
                      type="email"
                      id="footer-email"
                      required={true}
                    />
                    <button type="submit" className="fh-nl-btn" aria-label="Subscribe" data-umami-event="Footer - Clicked Subscribe">
                      <div className="arrow-icon site-embed">
                        <svg fill="none" width="15" height="15" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                          <path d="M5 12h14M12 5l7 7-7 7"></path>
                        </svg>
                      </div>
                    </button>
                  </div>
                </form>
                <div className="form_message-success site-form-done"><div>You&#x27;re on the list! Check your inbox for our next update.</div></div>
                <div className="form_message-error site-form-fail"><div>We couldn&#x27;t subscribe you just now. Please check your email and try again.</div></div>
              </div>
              <div className="fh-soc">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" data-umami-event="Footer - Clicked Facebook" className="fh-si">
                  <div className="arrow-icon site-embed">
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  </div>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" data-umami-event="Footer - Clicked Instagram" className="fh-si">
                  <div className="arrow-icon site-embed">
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </div>
                </a>
                <a href="https://wa.me/2349036193817" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" data-umami-event="Footer - Clicked WhatsApp" className="fh-si">
                  <div className="arrow-icon site-embed">
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"></path><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"></path></svg>
                  </div>
                </a>
              </div>
            </div>
            <div className="fh-col">
              <p className="fh-col-h">Templates</p>
              <Link href="/shop" className="fh-lk a">All Templates</Link>
              <Link href="/shop?category=ecommerce" className="fh-lk a">E-Commerce</Link>
              <Link href="/shop?category=real-estate" className="fh-lk a">Real Estate</Link>
              <Link href="/shop?category=corporate" className="fh-lk a">Corporate</Link>
              <Link href="/shop?category=saas" className="fh-lk a">Tech &amp; SaaS</Link>
            </div>
            <div className="fh-col">
              <p className="fh-col-h">Company</p>
              <Link href="/" className="fh-lk a">Home</Link>
              <Link href="/about-us" className="fh-lk a">About Us</Link>
              <Link href="/contact-us" className="fh-lk a">Contact Us</Link>
              <Link href="/blog" className="fh-lk a">Insights</Link>
            </div>
          </div>
          <div className="footer-border v2"></div>
          <div className="footer-border"></div>
        </div>
        <div className="fh-bot">
          <div className="fh-bot-in">
            <p className="fh-copy">© {new Date().getFullYear()} aB Labs - Production-Ready Web Flagships</p>
            <a href="#top" className="fh-top-top inline-block">
              <div>Back to top</div>
              <div className="fh-toptop-span">
                <div className="arrow-icon site-embed">
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
  );
}
