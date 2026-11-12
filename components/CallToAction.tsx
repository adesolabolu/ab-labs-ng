'use client';

import React from 'react';
import Link from 'next/link';

interface CallToActionProps {
  subtitle?: string;
  title?: string;
  summary?: string;
  primaryBtnText?: string;
  primaryBtnHref?: string;
  secondaryBtnText?: string;
  secondaryBtnHref?: string;
  bgColor?: string;
}

export default function CallToAction({
  subtitle = "Get Started",
  title = "Dominate Your Market Online.",
  summary = "Pick a proven website design for your business. We customize the colors, logo, copy, and payments, then launch your live website in less than 36 hours.",
  primaryBtnText = "Explore Templates",
  primaryBtnHref = "/shop",
  secondaryBtnText = "Request a Consultation",
  secondaryBtnHref = "/contact-us",
  bgColor,
}: CallToActionProps) {
  return (
    <section className="section-cta" style={bgColor ? { backgroundColor: bgColor } : undefined}>
      <div className="site-blockcontainer container-large site-container">
        <div className="ctas-in">
          <div className="ctas-l rv">
            <div className="section-heading-block">
              <div className="section-subtitle-block">
                <div className="subtitle-text text-color-white" style={{ color: '#ffffff' }}>{subtitle}</div>
              </div>
              <div className="section-title-block" style={{ maxWidth: '460px' }}>
                <h2 className="heading-style-h2 cta-title text-color-white" style={{ color: '#ffffff', fontSize: '36px', lineHeight: '1.2' }}>{title}</h2>
              </div>
              <div className="section-summary-block" style={{ maxWidth: '460px' }}>
                <p data-summary="true" className="ctas-p" style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '15px', lineHeight: '1.6' }}>{summary}</p>
              </div>
            </div>
            <div className="ctas-btns">
              <Link
                href={primaryBtnHref}
                className="primary-button site-variant-3b5a4d32-eebf-cbfb-72aa-bab6d6dbb242 inline-block"
              >
                <div className="button-text-wrapper">
                  <div className="button-text-block">
                    <div className="link-text is-1">{primaryBtnText} </div>
                    <div className="link-text is-2">{primaryBtnText} </div>
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
              <Link
                href={secondaryBtnHref}
                className="primary-button site-variant-446f7c99-5055-c60b-2e0e-10ff042897b8 inline-block"
              >
                <div className="button-text-wrapper">
                  <div className="button-text-block">
                    <div className="link-text is-1">{secondaryBtnText}</div>
                    <div className="link-text is-2">{secondaryBtnText}</div>
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
            <div className="ctas-trust">
              <div className="ctas-trust-avs">
                <div className="ctas-trust-av">
                  <img
                    sizes="(max-width: 550px) 100vw, 550px"
                    srcSet="/assets/6a9fda0f85c2f29e3ea2bc3f_Testimonial%20author%20image%206-p-500.webp 500w, /assets/6a9fda0f85c2f29e3ea2bc3f_Testimonial%20author%20image%206.webp 550w"
                    alt=""
                    src="/assets/6a9fda0f85c2f29e3ea2bc3f_Testimonial%20author%20image%206.webp"
                    loading="lazy"
                    className="img ctas-trust-av-img"
                  />
                </div>
                <div className="ctas-trust-av">
                  <img
                    sizes="(max-width: 550px) 100vw, 550px"
                    srcSet="/assets/6a9fda0fcbec38cdbf6198d4_Testimonial%20author%20image%207-p-500.webp 500w, /assets/6a9fda0fcbec38cdbf6198d4_Testimonial%20author%20image%207.webp 550w"
                    alt=""
                    src="/assets/6a9fda0fcbec38cdbf6198d4_Testimonial%20author%20image%207.webp"
                    loading="lazy"
                    className="img ctas-trust-av-img"
                  />
                </div>
                <div className="ctas-trust-av">
                  <img
                    sizes="(max-width: 550px) 100vw, 550px"
                    srcSet="/assets/6a9fda10411e920c9451fde8_Testimonial%20author%20image%202-p-500.webp 500w, /assets/6a9fda10411e920c9451fde8_Testimonial%20author%20image%202.webp 550w"
                    alt=""
                    src="/assets/6a9fda10411e920c9451fde8_Testimonial%20author%20image%202.webp"
                    loading="lazy"
                    className="img ctas-trust-av-img"
                  />
                </div>
              </div>
              <p className="ctas-trust-txt">
                <span className="ctas-trust-stars">★★★★★</span>
                <span className="ctas-trust-txt-b">4.9/5</span> · Trusted by ambitious brands &amp; founders
              </p>
            </div>
          </div>
          <div className="ctas-r">
            <img
              sizes="(max-width: 767px) 100vw, (max-width: 991px) 728px, 940px"
              srcSet="/assets/6a9fd74773afd35f9342e799_shr-bg%20image-p-500.webp 500w, /assets/6a9fd74773afd35f9342e799_shr-bg%20image-p-800.webp 800w, /assets/6a9fd74773afd35f9342e799_shr-bg%20image-p-1080.webp 1080w, /assets/6a9fd74773afd35f9342e799_shr-bg%20image.webp 1152w"
              alt="Modern SaaS dashboard template preview"
              src="/assets/6a9fd74773afd35f9342e799_shr-bg%20image.webp"
              loading="lazy"
              className="ctas-r-img"
            />
            <div className="cta-image-overlay"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
