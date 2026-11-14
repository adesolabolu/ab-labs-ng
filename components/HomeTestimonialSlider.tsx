'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  productName: string;
  productSlug: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 'haven-property',
    quote: "aB Labs transformed our real estate firm's digital presence. We closed three major property leads within our first two weeks live on the new site.",
    name: "Tunde Bakare",
    role: "Managing Partner, Haven Property Group (Lagos)",
    productName: "STRATOS PropTech",
    productSlug: "stratos-real-estate",
  },
  {
    id: 'zuri-luxury',
    quote: "The speed and mobile checkout polish on our fashion store blew our customers away. Our conversion rate increased by 42% in month one.",
    name: "Amina Bello",
    role: "Founder, Zuri Luxury Apparel (Abuja)",
    productName: "Bauhaus Atelier",
    productSlug: "bauhaus-atelier",
  },
  {
    id: 'paygrid-fintech',
    quote: "Hands down the sharpest web agency experience in Nigeria. Fast, professional, and zero technical headaches. Highly recommend.",
    name: "Emeka Nwosu",
    role: "Co-Founder, PayGrid (Port Harcourt)",
    productName: "Vertex Strategic",
    productSlug: "vertex-elite-marketing",
  },
];

export default function HomeTestimonialSlider() {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const next = () => {
    setCurrent((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prev = () => {
    setCurrent((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 45;
    const isRightSwipe = distance < -45;

    if (isLeftSwipe) {
      next();
    } else if (isRightSwipe) {
      prev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section className="section-testimonial ab-testimonial-section">
      <div className="site-blockcontainer container-large site-container">
        <div className="ab-testimonial-layout">
          {/* Left Column: Heading, Subtitle & Desktop Controls */}
          <div className="ab-testimonial-header">
            <div className="section-heading-block">
              <div className="section-title-block max-width-520px">
                <h2 className="ab-testimonial-heading">Trusted by Ambitious Nigerian Brands.</h2>
              </div>
              <div className="section-summary-block max-width-440px" style={{ marginTop: '14px' }}>
                <p className="text-size-regular text-color--8c8782">
                  High-growth founders and Nigerian enterprises trust aB Labs to power their digital flagships &mdash; here&rsquo;s what they say.
                </p>
              </div>
            </div>

            {/* Desktop Navigation Controls */}
            <div className="ab-testimonial-desktop-controls">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous testimonial"
                className="ab-testimonial-nav-btn"
              >
                <svg fill="none" width="18" height="18" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path d="M19 12H5M12 5l-7 7 7 7"></path>
                </svg>
              </button>

              <button
                type="button"
                onClick={next}
                aria-label="Next testimonial"
                className="ab-testimonial-nav-btn"
              >
                <svg fill="none" width="18" height="18" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7"></path>
                </svg>
              </button>

              <span className="ab-testimonial-counter">
                0{current + 1} <span style={{ opacity: 0.4 }}>/</span> 0{TESTIMONIALS.length}
              </span>
            </div>
          </div>

          {/* Right Column: Interactive Card Slider */}
          <div
            className="ab-testimonial-slider-container"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="ab-testimonial-track"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {TESTIMONIALS.map((item, idx) => (
                <div key={item.id} className="ab-testimonial-slide">
                  <article className="ab-testimonial-card">
                    {/* Top Quote Icon */}
                    <div className="ab-testimonial-quote-icon">
                      <svg
                        width="36"
                        height="36"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        style={{ color: '#9a6843', opacity: 0.7 }}
                      >
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                    </div>

                    {/* Client Feedback Quote */}
                    <p className="ab-testimonial-quote-text">
                      &ldquo;{item.quote}&rdquo;
                    </p>

                    {/* Footer: Author Info & Dedicated Foundation Link */}
                    <div className="ab-testimonial-card-footer">
                      <div className="ab-testimonial-author-block">
                        <div className="ab-testimonial-author-name">{item.name}</div>
                        <div className="ab-testimonial-author-role">{item.role}</div>
                      </div>

                      <Link
                        href={`/product/${item.productSlug}`}
                        className="ab-testimonial-product-link"
                      >
                        <span>{item.productName}</span>
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                          <path d="M7 17 17 7M7 7h10v10"></path>
                        </svg>
                      </Link>
                    </div>
                  </article>
                </div>
              ))}
            </div>

            {/* Mobile Navigation Controls & Dots */}
            <div className="ab-testimonial-mobile-controls">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous testimonial"
                className="ab-testimonial-nav-btn mobile"
              >
                <svg fill="none" width="16" height="16" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path d="M19 12H5M12 5l-7 7 7 7"></path>
                </svg>
              </button>

              {/* Dots */}
              <div className="ab-testimonial-dots">
                {TESTIMONIALS.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrent(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`ab-testimonial-dot ${idx === current ? 'active' : ''}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={next}
                aria-label="Next testimonial"
                className="ab-testimonial-nav-btn mobile"
              >
                <svg fill="none" width="16" height="16" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
