import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import ContactForm from '@/components/ContactForm';
import React from 'react';
import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata({
  title: 'Contact Us',
  description:
    'Questions about our website templates, bespoke customization, custom domain deployment, or web engineering? Our team replies within 24 hours.',
  path: '/contact-us',
});

export default function ContactUsPage() {
  return (
    <>
      <div className="page-wrapper">
        <Navbar />
        <div className="main-wrapper">
          <section className="section-breadcrumb">
            <div className="site-blockcontainer container-large site-container">
              <div className="page-heading-block align-center">
                <div className="hero-subtitle-block">
                  <div className="subtitle-dot"></div>
                  <div>Contact Us</div>
                </div>
                <div className="page-title-block">
                  <h1 className="heading-style-h1">Let&#x27;s talk</h1>
                </div>
                <div className="hero-summary-wrapper max-width-460px">
                  <p className="hero-summary">
                    Questions about our website templates, bespoke customization, custom domain deployment, or web engineering? Our team is here to help - we usually reply within 24 hours.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="section-contact-us">
            <div className="site-blockcontainer container-large site-container">
              <div className="ct-main-in">
                <div className="ct-info">
                  <div className="section-heading-block">
                    <div fade-in="true" className="section-subtitle-block">
                      <div className="subtitle-text">Get in touch</div>
                    </div>
                    <div className="section-title-block">
                      <h2 className="heading-style-h2">We’re Here To Help.</h2>
                    </div>
                    <div className="section-summary-block max-width-670px">
                      <p data-summary="true" className="text-size-regular text-color--8c8782">
                        Whether you need template guidance, custom integration support, or a bespoke flagship build, reach out to our engineering team.
                      </p>
                    </div>
                  </div>

                  <div fade-in="true" className="ct-methods">
                    <div className="ct-method">
                      <div className="ct-method-ic">
                        <div className="social-icon-20px site-embed">
                          <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                            <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                            <path d="m22 7-10 6L2 7"></path>
                          </svg>
                        </div>
                      </div>
                      <div>
                        <div className="ct-method-k">Email us</div>
                        <div className="ct-method-v">
                          <a href="mailto:hello@ab-labs.cv" className="ct-method-v-a">hello@ab-labs.cv</a>
                        </div>
                      </div>
                    </div>

                    <div className="ct-method">
                      <div className="ct-method-ic">
                        <div className="social-icon-20px site-embed">
                          <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                          </svg>
                        </div>
                      </div>
                      <div>
                        <div className="ct-method-k">Direct WhatsApp &amp; Support</div>
                        <div className="ct-method-v">
                          <a
                            href="https://wa.me/2349036193817?text=Hi%20aB%20Labs%2C%20I%20would%20like%20to%20know%20more%20about%20your%20website%20templates."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ct-method-v-a"
                          >
                            +234 903 619 3817
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="ct-method">
                      <div className="ct-method-ic">
                        <div className="social-icon-20px site-embed">
                          <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"></path>
                          </svg>
                        </div>
                      </div>
                      <div>
                        <div className="ct-method-k">Call or WhatsApp us</div>
                        <div className="ct-method-v">
                          <a href="tel:+2349036193817" className="ct-method-v-a">0903 619 3817</a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p data-summary="true" className="ct-info-lbl">Follow along</p>
                  <div fade-in="true" className="ct-socials">
                    <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer" className="ct-si">
                      <div className="social-icon site-embed">
                        <svg fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                        </svg>
                      </div>
                    </a>
                    <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="ct-si">
                      <div className="social-icon site-embed">
                        <svg fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                          <rect x="2" y="2" width="20" height="20" rx="5"></rect>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                      </div>
                    </a>
                    <a href="https://wa.me/2349036193817" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer" className="ct-si">
                      <div className="social-icon site-embed">
                        <svg fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                          <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"></path>
                          <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"></path>
                        </svg>
                      </div>
                    </a>
                  </div>
                </div>

                <div className="ct-form-card">
                  <ContactForm />
                </div>
              </div>
            </div>
          </section>
        </div>
        <Footer />
      </div>
      <link rel="stylesheet" href="https://unpkg.com/lenis@1.3.1/dist/lenis.css" />
    </>
  );
}
